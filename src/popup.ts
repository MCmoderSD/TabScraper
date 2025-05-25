document.addEventListener("DOMContentLoaded", async (): Promise<void> => {

    // Get elements
    const prefixInput = document.getElementById("prefix") as HTMLInputElement;
    const suffixInput = document.getElementById("suffix") as HTMLInputElement;
    const regexInput = document.getElementById("regex") as HTMLInputElement;
    const invertInput = document.getElementById("invert") as HTMLInputElement;
    const button = document.getElementById("scrape") as HTMLButtonElement;

    // Load stored values
    const { prefix = "", suffix = "", regex = "", invert = false } = await chrome.storage.sync.get(["prefix", "suffix", "regex", "invert"]);
    prefixInput.value = prefix;
    suffixInput.value = suffix;
    regexInput.value = regex;
    invertInput.checked = invert;

    // Save + trigger scraping
    button.addEventListener("click", async (): Promise<void> => {
        await chrome.storage.sync.set({
            prefix: prefixInput.value,
            suffix: suffixInput.value,
            regex: regexInput.value,
            invert: invertInput.checked
        });
        // Send message to background
        console.log(`${prefixInput.value} - ${suffixInput.value}`);
        await chrome.runtime.sendMessage({action: "scrape"});
    });
});