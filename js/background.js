// Page Inspector Chrome Extension
// LanguageTool && Google Lighthouse
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/07/08


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.text == "startInject") {
        sendResponse({ text: "hello" });
    }
});