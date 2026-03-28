import { Configuration, fetchConfig, saveConfig } from "./config.js";

document.addEventListener("DOMContentLoaded", async (): Promise<void> => {

    // HTML Elements
    const prefixInput = document.getElementById("prefix") as HTMLInputElement;
    const suffixInput = document.getElementById("suffix") as HTMLInputElement;
    const regexInput = document.getElementById("regex") as HTMLInputElement;
    const invertInput = document.getElementById("invert") as HTMLInputElement;
    const button = document.getElementById("scrape") as HTMLButtonElement;

    // Apply config values to input fields
    function applyConfig(config: Configuration): void {
        prefixInput.value = config.prefix.trim();
        suffixInput.value = config.suffix.trim();
        regexInput.value = config.regex.trim();
        invertInput.checked = config.invert;
    }

    // Gather config values from input fields
    function gatherConfig(): Configuration {
        return {
            prefix: prefixInput.value.trim(),
            suffix: suffixInput.value.trim(),
            regex: regexInput.value.trim(),
            invert: invertInput.checked,
        };
    }

    // Load config from storage and apply to inputs
    let config: Configuration = await fetchConfig();
    applyConfig(config);

    // Save Config + trigger scraping
    button.addEventListener("click", async (): Promise<void> => {

        // Update Config
        config = gatherConfig();
        await saveConfig(config);

        // Trigger scraping
        await chrome.runtime.sendMessage({
            action: "scrape",
            config: config
        });
    });
});