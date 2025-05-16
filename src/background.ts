chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "scrape") void scrapeTabs();
});

async function scrapeTabs(): Promise<void> {

    // Get prefix, suffix, and regex from storage
    const { prefix = "", suffix = "", regex = "", invert = false }: { prefix: string, suffix: string, regex: string, invert: boolean } = await chrome.storage.sync.get([
        "prefix",
        "suffix",
        "regex",
        "invert"
    ]);

    const pattern: RegExp | null = regex ? new RegExp(regex) : null;
    const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({});

    // Filter tabs based on prefix, suffix, and regex
    const urls: string[] = tabs
        .map(tab => tab.url ?? "")
        .filter(url => {
            if (url === "") return false;                                                           // skip empty URLs
            if (prefix && invert ? url.startsWith(prefix) : !url.startsWith(prefix)) return false;  // check prefix
            if (suffix && invert ? url.endsWith(suffix) : !url.endsWith(prefix)) return invert;     // check suffix
            return invert ? pattern && !pattern!.test(url) : pattern && pattern!.test(url);         // check regex
        });

    // If no URLs match, show an alert
    if (urls.length === 0) {
        alert("No URLs matched the criteria.");
        return;
    }

    // Download the URLs as a text file
    await chrome.downloads.download({
        url: `data:text/plain;charset=utf-8,${encodeURIComponent(urls.join("\n"))}`,
        saveAs: true
    });
}