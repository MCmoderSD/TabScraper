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
            if (url === "") return false;           // skip empty URLs
            const match: boolean = isMatch(url);    // check if URL matches the criteria
            return invert ? !match : match;         // invert the match if invert is true
        });

    function isMatch(url: string): boolean {
        const checks: boolean[] = [];
        if (prefix) checks.push(url.startsWith(prefix));
        if (suffix) checks.push(url.endsWith(suffix));
        if (pattern) checks.push(pattern.test(url));
        if (checks.length === 0) return true;
        return checks.every(Boolean);
    }

    // If no URLs match, show a notification
    if (urls.length === 0) {
        // await chrome.runtime.sendMessage({ action: "noUrlsFound" });
        let tab = await chrome.tabs.create({url: "public/error.html"});
        // let injection = {
        //     target: { tabId: tab.id ?? -1 },
        //     func:() => {
        //         alert("No URLs matched the criteria.");
        //     }
        // }
        // await chrome.scripting.executeScript(injection);
        return;
    }

    // Download the URLs as a text file
    await chrome.downloads.download({
        url: `data:text/plain;charset=utf-8,${encodeURIComponent(urls.join("\n"))}`,
        saveAs: true
    });
}




