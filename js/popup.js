// Page Inspector Chrome Extension
// LanguageTool && Google Lighthouse
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/07/08


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('checkPage').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { text: "startInject" });
        });
    }, false);
}, false);


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


// Set Base URL
let assetsURL = "https://raw.githubusercontent.com/littleforestweb/pagina/main/assets/";
let lighthouseURL = "https://inspector.littleforest.co.uk/LighthouseWS/lighthouseServlet?"

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
        if (msg.question == "sidebarHTML") {
            let htmlContent = await getRequest(assetsURL + "report.html");
            chrome.tabs.sendMessage(tabs[0].id, { text: "addSidebarHTML", content: htmlContent });
        } else if (msg.question == "sidebarJS") {
            let jsContent = await getRequest(assetsURL + "report.js");
            chrome.tabs.sendMessage(tabs[0].id, { text: "addSidebarJS", content: jsContent });
        } else if (msg.question == "sidebarCSS") {
            let cssContent = await getRequest(assetsURL + "report.css");
            chrome.tabs.sendMessage(tabs[0].id, { text: "addSidebarCSS", content: cssContent });
        } else if (msg.question == "addOverlay") {
            chrome.tabs.sendMessage(tabs[0].id, { text: "addOverlay" });
        } else if (msg.question == "generealInfo") {
            chrome.tabs.sendMessage(tabs[0].id, { text: "addGeneralInfo" });
        } else if (msg.question == "languageTool") {
            let selectedLanguage = document.getElementById("languagesList").value;
            chrome.tabs.sendMessage(tabs[0].id, { lang: selectedLanguage, text: "runLanguageTool" });
        } else if (msg.question == "removeOverlay") {
            chrome.tabs.sendMessage(tabs[0].id, { text: "removeOverlay" });
        } else if (msg.question == "lighthouse") {
            let lighthouseAPI = lighthouseURL + "url=" + msg.content + "&json=" + "null";;
            let lighthouseJson = await getRequest(lighthouseAPI);
            chrome.tabs.sendMessage(tabs[0].id, { text: "runLighthouse", content: lighthouseJson });
        }
    });
});