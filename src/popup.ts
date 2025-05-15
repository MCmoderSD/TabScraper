document.addEventListener("DOMContentLoaded", async () => {
    const prefixInput = document.getElementById("prefix") as HTMLInputElement;
    const suffixInput = document.getElementById("suffix") as HTMLInputElement;
    const regexInput = document.getElementById("regex") as HTMLInputElement;
    const button = document.getElementById("scrape") as HTMLButtonElement;

    // Load stored values
    const { prefix = "", suffix = "", regex = "" } = await chrome.storage.sync.get(["prefix", "suffix", "regex"]);
    prefixInput.value = prefix;
    suffixInput.value = suffix;
    regexInput.value = regex;

    // Save + trigger scraping
    button.addEventListener("click", async () => {
        await chrome.storage.sync.set({
            prefix: prefixInput.value,
            suffix: suffixInput.value,
            regex: regexInput.value
        });

        // Send message to background
        await chrome.runtime.sendMessage({action: "scrape"});
        window.close(); // close popup
    });
});
