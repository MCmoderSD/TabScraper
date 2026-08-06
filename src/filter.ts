import { describeError } from "./util.js";
import type { Configuration } from "./config.js";

export type UrlPredicate = (url: string) => boolean;

export type CompiledFilter =
    | { readonly ok: true; readonly matches: UrlPredicate }
    | { readonly ok: false; readonly error: string };

export function compileFilter(config: Configuration): CompiledFilter {
    let pattern: RegExp | null = null;

    if (config.regex !== "") {
        try {
            pattern = new RegExp(config.regex);
        } catch (error) {
            return { ok: false, error: describeError(error) };
        }
    }

    const matches: UrlPredicate = (url: string): boolean => {
        if (config.prefix !== "" && !url.startsWith(config.prefix)) return false;
        if (config.suffix !== "" && !url.endsWith(config.suffix)) return false;
        return pattern === null || pattern.test(url);
    };

    if (!config.invert) return { ok: true, matches };
    return { ok: true, matches: (url: string): boolean => !matches(url) };
}

export function selectUrls(urls: Iterable<string | undefined>, matches: UrlPredicate): string[] {
    const selected: Set<string> = new Set<string>();

    for (const url of urls) {
        if (url === undefined || url === "") continue;
        if (matches(url)) selected.add(url);
    }

    return [...selected];
}