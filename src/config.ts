import { describeError } from "./util.js";

export interface Configuration {
    readonly prefix: string;
    readonly suffix: string;
    readonly regex: string;
    readonly invert: boolean;
}

const DEFAULT_CONFIG: Configuration = {
    prefix: "",
    suffix: "",
    regex: "",
    invert: false
};

const CONFIG_KEYS: string[] = ["prefix", "suffix", "regex", "invert"];

function readString(stored: Record<string, unknown>, key: string): string {
    const value: unknown = stored[key];
    return typeof value === "string" ? value.trim() : "";
}

export async function loadConfig(): Promise<Configuration> {
    let stored: Record<string, unknown>;

    try {
        stored = await chrome.storage.sync.get(CONFIG_KEYS);
    } catch (error) {
        console.warn("Tab Scraper: could not read the saved settings", describeError(error));
        return DEFAULT_CONFIG;
    }

    return {
        prefix: readString(stored, "prefix"),
        suffix: readString(stored, "suffix"),
        regex: readString(stored, "regex"),
        invert: stored["invert"] === true
    };
}

export async function saveConfig(config: Configuration): Promise<void> {
    await chrome.storage.sync.set({
        prefix: config.prefix,
        suffix: config.suffix,
        regex: config.regex,
        invert: config.invert
    });
}