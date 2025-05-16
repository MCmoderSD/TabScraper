"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "scrape")
        void scrapeTabs();
});
function scrapeTabs() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get prefix, suffix, and regex from storage
        const { prefix = "", suffix = "", regex = "", invert = false } = yield chrome.storage.sync.get([
            "prefix",
            "suffix",
            "regex",
            "invert"
        ]);
        const pattern = regex ? new RegExp(regex) : null;
        const tabs = yield chrome.tabs.query({});
        // Filter tabs based on prefix, suffix, and regex
        const urls = tabs
            .map(tab => { var _a; return (_a = tab.url) !== null && _a !== void 0 ? _a : ""; })
            .filter(url => {
            if (url === "")
                return false; // skip empty URLs
            if (prefix && invert ? url.startsWith(prefix) : !url.startsWith(prefix))
                return false; // check prefix
            if (suffix && invert ? url.endsWith(suffix) : !url.endsWith(prefix))
                return invert; // check suffix
            return invert ? pattern && !pattern.test(url) : pattern && pattern.test(url); // check regex
        });
        // If no URLs match, show an alert
        if (urls.length === 0) {
            alert("No URLs matched the criteria.");
            return;
        }
        // Download the URLs as a text file
        yield chrome.downloads.download({
            url: `data:text/plain;charset=utf-8,${encodeURIComponent(urls.join("\n"))}`,
            saveAs: true
        });
    });
}
