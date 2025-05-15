// noinspection JSIgnoredPromiseFromCall

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "scrape") scrapeTabs();
});

async function scrapeTabs() {
    const { prefix = "", suffix = "", regex = "" } = await chrome.storage.sync.get([
        "prefix",
        "suffix",
        "regex"
    ]);

    const pattern = regex ? new RegExp(regex) : null;
    const tabs = await chrome.tabs.query({});

    const urls = tabs
        .map(tab => tab.url ?? "")
        .filter(url => {
            if (prefix && !url.startsWith(prefix)) return false;
            if (suffix && !url.endsWith(suffix)) return false;
            return !(pattern && !pattern.test(url));

        });

    const dataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(urls.join("\n"));

    await chrome.downloads.download({
        url: dataUrl,
        filename: "tabs.txt",
        saveAs: true
    });
}