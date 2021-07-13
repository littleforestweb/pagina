// document.addEventListener('DOMContentLoaded', function () {
//     var checkPageButton = document.getElementById('checkPage');
//     if (checkPageButton) {
//         checkPageButton.addEventListener('click', function () {
//             chrome.tabs.getSelected(null, function (tab) {
//                 chrome.tabs.executeScript(tab.ib, { file: 'inject.js' });
//             });
//         }, false);
//     }
// }, false);

chrome.browserAction.onClicked.addListener(initInspection);
function initInspection(tab) {
    chrome.tabs.sendMessage(tab.id, { msg: "startInspection" });
}

async function getRequest(url) {
    try {
        let res = await fetch(url);
        if (url.includes("languagetoolplus") || url.includes("lighthouseServlet")) {
            return await res.json();
        }
        return await res.text();
    } catch (error) {
        return error;
    }
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    let assetsURL = "https://raw.githubusercontent.com/littleforestweb/pagina/main/";
    let url = assetsURL + request.asset
    console.log(request.asset);
    let htmlText = await getRequest(url)
    sendResponse({ html: "htmlText" });
});