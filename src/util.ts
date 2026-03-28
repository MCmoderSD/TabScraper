import QueryInfo = chrome.tabs.QueryInfo;
import Tab = chrome.tabs.Tab;

const queryInfo: QueryInfo = {
    active: true,
    currentWindow: true
}

function isInjectAble(tab: Tab): boolean {
    if (!tab.url) return false;
    return tab.url?.startsWith("http://") || tab.url?.startsWith("https://");
}

export async function showAlert(message: string): Promise<void> {

    // Get Active Tab
    const [tab] = await chrome.tabs.query(queryInfo);
    if (!isInjectAble(tab)) return

    // Inject Alert Script
    await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: (msg: string) => alert(msg),
        args: [message]
    });
}

export async function downloadAsTextFile(lines: string[]): Promise<void> {
    await chrome.downloads.download({
        url: `data:text/plain;charset=utf-8,${encodeURIComponent(lines.join("\n"))}`,
        saveAs: true
    });
}

export function filterPrefix(prefix: string, tabs: Tab[]): Tab[] {

    // No Tabs
    if (tabs.length === 0) return [];

    // No Prefix
    if (prefix.trim() === "") return tabs;

    // Filter Tabs
    return tabs.filter(tab => tab.url?.startsWith(prefix));
}

export function filterSuffix(suffix: string, tabs: Tab[]): Tab[] {

    // No Tabs
    if (tabs.length === 0) return [];

    // No Suffix
    if (suffix.trim() === "") return tabs;

    // Filter Tabs
    return tabs.filter(tab => tab.url?.endsWith(suffix));
}

export function filterRegex(regex: string, tabs: Tab[]): Tab[] {

    // No Tabs
    if (tabs.length === 0) return [];

    // No Regex
    if (regex.trim() === "") return tabs;

    // Compile Regex
    const pattern: RegExp = new RegExp(regex);

    // Filter Tabs
    return tabs.filter(tab => pattern.test(tab.url!));
}