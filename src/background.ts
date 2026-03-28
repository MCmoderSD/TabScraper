import { Configuration } from "./config.js";
import { showAlert, downloadAsTextFile, filterPrefix, filterSuffix, filterRegex } from "./util.js";

import Tab = chrome.tabs.Tab;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((data: { action: string, config: Configuration }): void => {
    console.log("Received message:", data);
    if (data.action === "scrape") {
        scrapeTabs(data.config).catch(console.error);
    }
});

// Scrape Tabs Function
async function scrapeTabs(config: Configuration): Promise<void> {

    // Query all tabs
    const tabs: Tab[] = await chrome.tabs.query({})
    let filteredTabs: Tab[] = tabs;
    let result: Tab[];

    // Apply filters
    filteredTabs = filterPrefix(config.prefix, filteredTabs);
    filteredTabs = filterSuffix(config.suffix, filteredTabs);
    filteredTabs = filterRegex(config.regex, filteredTabs);

    // Invert Filter
    if (config.invert) {
        const filteredTabIds = new Set(filteredTabs.map(tab => tab.id));
        result = tabs.filter(tab => !filteredTabIds.has(tab.id));
    } else result = filteredTabs;

    // Extract URLs
    const urls: string[] = result.map(tab => tab.url!).filter(url => url !== undefined);

    // Deduplicate URLs
    const uniqueUrls: string[] = Array.from(new Set(urls));

    // No URLs Found
    if (uniqueUrls.length === 0) {
        await showAlert("No matching tabs found.");
        return;
    }

    // Download URLs as text file
    await downloadAsTextFile(uniqueUrls);
}