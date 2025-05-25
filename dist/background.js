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
            const match = isMatch(url); // check if URL matches the criteria
            return invert ? !match : match; // invert the match if invert is true
        });
        function isMatch(url) {
            const checks = [];
            if (prefix)
                checks.push(url.startsWith(prefix));
            if (suffix)
                checks.push(url.endsWith(suffix));
            if (pattern)
                checks.push(pattern.test(url));
            if (checks.length === 0)
                return true;
            return checks.every(Boolean);
        }
        // If no URLs match, show a notification
        if (urls.length === 0) {
            yield chrome.tabs.create({ url: "public/html/error.html" });
            return;
        }
        // Download the URLs as a text file
        yield chrome.downloads.download({
            url: `data:text/plain;charset=utf-8,${encodeURIComponent(urls.join("\n"))}`,
            saveAs: true
        });
    });
}
