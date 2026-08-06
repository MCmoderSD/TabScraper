import { loadConfig, saveConfig, type Configuration } from "./config.js";
import { compileFilter, selectUrls, type CompiledFilter } from "./filter.js";
import { describeError, downloadUrls } from "./util.js";

type StatusKind = "busy" | "success" | "error";

function requireElement<T extends HTMLElement>(id: string, type: new () => T): T {
    const element: HTMLElement | null = document.getElementById(id);
    if (!(element instanceof type)) throw new Error(`popup.html is missing ${type.name} #${id}`);
    return element;
}

const prefixInput: HTMLInputElement = requireElement("prefix", HTMLInputElement);
const suffixInput: HTMLInputElement = requireElement("suffix", HTMLInputElement);
const regexInput: HTMLInputElement = requireElement("regex", HTMLInputElement);
const invertInput: HTMLInputElement = requireElement("invert", HTMLInputElement);
const scrapeButton: HTMLButtonElement = requireElement("scrape", HTMLButtonElement);
const statusOutput: HTMLParagraphElement = requireElement("status", HTMLParagraphElement);

function applyConfig(config: Configuration): void {
    prefixInput.value = config.prefix;
    suffixInput.value = config.suffix;
    regexInput.value = config.regex;
    invertInput.checked = config.invert;
}

function gatherConfig(): Configuration {
    return {
        prefix: prefixInput.value.trim(),
        suffix: suffixInput.value.trim(),
        regex: regexInput.value.trim(),
        invert: invertInput.checked
    };
}

function setStatus(kind: StatusKind, message: string): void {
    statusOutput.textContent = message;
    statusOutput.dataset["kind"] = kind;
}

function clearStatus(): void {
    statusOutput.textContent = "";
}

async function scrape(): Promise<void> {
    const config: Configuration = gatherConfig();

    const filter: CompiledFilter = compileFilter(config);
    if (!filter.ok) {
        setStatus("error", filter.error);
        return;
    }

    scrapeButton.disabled = true;
    setStatus("busy", "Scraping tabs…");

    try {
        await saveConfig(config);
    } catch (error) {
        console.warn("Tab Scraper: could not save the settings", describeError(error));
    }

    try {
        const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({});
        const urls: string[] = selectUrls(tabs.map((tab: chrome.tabs.Tab): string | undefined => tab.url), filter.matches);

        if (urls.length === 0) {
            setStatus("error", "No tabs matched the current filter.");
            return;
        }

        await downloadUrls(urls);
        setStatus("success", `Saved ${urls.length.toString()} ${urls.length === 1 ? "URL" : "URLs"}.`);
    } catch (error) {
        setStatus("error", describeError(error));
    } finally {
        scrapeButton.disabled = false;
    }
}

scrapeButton.addEventListener("click", (): void => {
    void scrape();
});

for (const input of [prefixInput, suffixInput, regexInput, invertInput]) {
    input.addEventListener("input", clearStatus);
}

loadConfig()
    .then(applyConfig)
    .catch((error: unknown): void => {
        setStatus("error", `Could not load the saved settings: ${describeError(error)}`);
    });