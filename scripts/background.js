// Page Inspector Chrome Extension
// LanguageTool && Google Lighthouse
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/07/18


async function getRequest(url) {
    try {
        const res = await fetch(url);
        if (url.includes("languagetoolplus") || url.includes("lighthouseServlet")) {
            return await res.json();
        }
        return await res.text();
    } catch (error) {
        return error;
    }
}


// this is the background code...
document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('mainButton');
    if (checkPageButton) {
        checkPageButton.addEventListener('click', function () {
            chrome.tabs.executeScript(null, { file: 'scripts/inject.js' });
        }, false);
    }
}, false);



chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    console.log(request.question + " - " + sender.tab.id + " - " + request.url);

    if (request.question == "Lighthouse") {
        // Get lighthouseJson
        let siteUrl = "https://www.gov.uk/";
        let categories = "pwa,seo";
        let device = "mobile";
        let lighthouseURL = "https://inspector.littleforest.co.uk/LighthouseWS/lighthouseServlet?"
        let lighthouseJson = await getRequest(lighthouseURL + "url=" + siteUrl + "&cats=" + categories + "&device=" + device);

        // Sending response JSON
        chrome.tabs.sendMessage(sender.tab.id, { tabId: sender.tab.id, json: lighthouseJson });
    }
});