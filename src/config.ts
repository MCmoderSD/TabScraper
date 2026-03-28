export interface Configuration {
    prefix: string;
    suffix: string;
    regex: string;
    invert: boolean;
}

export async function fetchConfig(): Promise<Configuration> {

    // Fetch config from storage
    const config: Configuration = await chrome.storage.sync.get([
        "prefix",
        "suffix",
        "regex",
        "invert"
    ]);

    // Set default values if not present
    if (!config.prefix) config.prefix = "";
    if (!config.suffix) config.suffix = "";
    if (!config.regex) config.regex = "";
    return config;
}

export async function saveConfig(config: Configuration): Promise<void> {
    await chrome.storage.sync.set({
        prefix: config.prefix,
        suffix: config.suffix,
        regex: config.regex,
        invert: config.invert,
    })
}