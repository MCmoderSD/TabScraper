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
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const prefixInput = document.getElementById("prefix");
    const suffixInput = document.getElementById("suffix");
    const regexInput = document.getElementById("regex");
    const button = document.getElementById("scrape");
    // Load stored values
    const { prefix = "", suffix = "", regex = "" } = yield chrome.storage.sync.get(["prefix", "suffix", "regex"]);
    prefixInput.value = prefix;
    suffixInput.value = suffix;
    regexInput.value = regex;
    // Save + trigger scraping
    button.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        yield chrome.storage.sync.set({
            prefix: prefixInput.value,
            suffix: suffixInput.value,
            regex: regexInput.value
        });
        // Send message to background
        yield chrome.runtime.sendMessage({ action: "scrape" });
        window.close(); // close popup
    }));
}));
