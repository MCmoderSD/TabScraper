"use strict";
// noinspection JSIgnoredPromiseFromCall
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
        scrapeTabs();
});
function scrapeTabs() {
    return __awaiter(this, void 0, void 0, function* () {
        const { prefix = "", suffix = "", regex = "" } = yield chrome.storage.sync.get([
            "prefix",
            "suffix",
            "regex"
        ]);
        const pattern = regex ? new RegExp(regex) : null;
        const tabs = yield chrome.tabs.query({});
        const urls = tabs
            .map(tab => { var _a; return (_a = tab.url) !== null && _a !== void 0 ? _a : ""; })
            .filter(url => {
            if (prefix && !url.startsWith(prefix))
                return false;
            if (suffix && !url.endsWith(suffix))
                return false;
            return !(pattern && !pattern.test(url));
        });
        const dataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(urls.join("\n"));
        yield chrome.downloads.download({
            url: dataUrl,
            filename: "tabs.txt",
            saveAs: true
        });
    });
}
