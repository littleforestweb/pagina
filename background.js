console.log("go background.js")


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


// Connect
console.clear()
console.log('Connect');

let assetsURL = "https://raw.githubusercontent.com/littleforestweb/pagina/main/";

chrome.runtime.onConnect.addListener(function (port) {

    chrome.browserAction.onClicked.addListener(function () {
        console.assert(port.name == "knockknock");
        port.postMessage({ text: "startInject" });
    });

    port.onMessage.addListener(async function (action) {
        if (action.question == "sidebarHTML") {
            console.log("sidebarHTML");
            let htmlContent = await getRequest(assetsURL + "report.html");
            port.postMessage({ text: "addSidebarHTML", content: htmlContent });
        } else if (action.question == "sidebarJS") {
            console.log("sidebarJS");
            let jsContent = await getRequest(assetsURL + "report.js");
            port.postMessage({ text: "addSidebarJS", content: jsContent });
        } else if (action.question == "sidebarCSS") {
            console.log("sidebarCSS");
            let cssContent = await getRequest(assetsURL + "report.css");
            port.postMessage({ text: "addSidebarCSS", content: cssContent });
        } else if (action.question == "addOverlay") {
            console.log("addOverlay");
            port.postMessage({ text: "addOverlay" });
        } else if (action.question == "generealInfo") {
            console.log("generealInfo");
            port.postMessage({ text: "addGeneralInfo" });
        } else if (action.question == "languageTool") {
            console.log("runLanguageTool");
            port.postMessage({ text: "runLanguageTool" });
        } else if (action.question == "removeOverlay") {
            console.log("removeOverlay");
            port.postMessage({ text: "removeOverlay" });
        } else if (action.question == "lighthouse") {
            console.log("lighthouse");
            let lighthouseURL = "https://inspector.littleforest.co.uk/LighthouseWS/lighthouseServlet?"
            let lighthouseAPI = lighthouseURL + "url=" + action.content + "&json=" + "null";;
            let lighthouseJson = await getRequest(lighthouseAPI);
            port.postMessage({ text: "runLighthouse", content: lighthouseJson });
        }
    });
});





