// Page Inspector Chrome Extension
// LanguageTool && Google Lighthouse
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/07/08

console.log("go content.js")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function clearHTML() {
    console.log("clearHTML");

    // Clear current html code
    let newHTML = document.open("text/html", "replace");
    newHTML.write('<html><head><body style="margin:0;"></body></html>');
    newHTML.close();
}

async function addIframe() {
    console.log("addIframe");

    // Add iframe with current url
    let iframeElement = document.createElement('iframe');
    iframeElement.id = "maincontent";
    iframeElement.classList.add("iframe-width-300");
    iframeElement.classList.add("iframe");
    iframeElement.src = window.location.href;
    document.body.appendChild(iframeElement);
}

async function addSidebarHTML(htmlContent) {
    console.log("addSidebarHTML");

    // Add Sidebar <html>
    document.body.innerHTML += htmlContent;
}

async function addSidebarJS(jsContent) {
    console.log("addSidebarJS");

    // Add Sidebar <script>
    let report = document.createElement("script");
    document.body.appendChild(report).innerHTML = jsContent;
}

async function addSidebarCSS(cssContent) {
    console.log("addSidebarCSS");

    // Add Sidebar <style>
    let report = document.createElement("style");
    document.head.appendChild(report).innerHTML = cssContent;
}

async function overlay(action) {
    if (action == "addOverlay") {
        // Insert overlay
        console.log("addOverlay")
        document.getElementById("overlay").style.display = "block";
    } else if (action == "removeOverlay") {
        // Remove overlay
        console.log("removeOverlay")
        document.getElementById("overlay").style.display = "none";
    }
}

async function addGeneralInfo() {
    console.log("addGeneralInfo");

    // wait for iframe to load
    document.getElementById('maincontent').addEventListener("load", function () {
        isIframeLoad = true;
    });
    while (!(isIframeLoad)) { await sleep(1000); }

    // Get iframe element
    let iframeElement = document.getElementById('maincontent').contentDocument;

    //  Add totalLinks to GENERALINFO
    let totalLinks = []; let extLinks = []; let intLinks = []; let allLinks = iframeElement.links;
    for (let i = 0; i < allLinks.length; i++) {
        let linkHref = allLinks[i].href;
        totalLinks.push(linkHref);
        if (linkHref.includes(window.location.href)) { intLinks.push(linkHref); } else { extLinks.push(linkHref); }
    }

    document.getElementById("totalLinks").innerText = totalLinks.length;
    document.getElementById("extLinks").innerText = extLinks.length;
    document.getElementById("intLinks").innerText = intLinks.length;

    //  Add totalImages to GENERALINFO
    let totalImages = iframeElement.getElementsByTagName("img").length;
    document.getElementById("totalImages").innerText = totalImages;
}

async function runLanguageTool(language) {
    console.log("runLanguageTool");

    // Get iframe element
    let iframeElement = document.getElementById('maincontent').contentDocument;

    // Get all tagsText
    let tagsText = iframeElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, caption, footer, label, small, strong')

    // Set errorsDict where key => error and value => [count, color]
    let errorsDict = {};

    // Iterate on every tag
    for (let i = 0; i < tagsText.length; i++) {

        // Set phrase from content array index
        let tagText = tagsText[i]

        // Get LangTool API Response
        const data = await getRequest("https://api.languagetoolplus.com/v2/check" + "?text=" + tagText.innerHTML.replace(/<\/?[^>]+(>|$)/g, "") + "&language=" + language);

        try {

            // // Get detected language and confidence
            // let detectedLanguage = data.language.detectedLanguage.name;
            // let detectConfidence = data.language.detectedLanguage.confidence * 100;
            // document.getElementById("detectedLanguage").innerHTML = detectedLanguage;
            // document.getElementById("detectConfidence").innerHTML = detectConfidence;

            // Iterate on every error
            data.matches.forEach(function (entry) {

                // Get error, message;
                let text = entry.context.text; let message = entry.message; let color;
                let error = text.substring(entry.context.offset, entry.context.offset + entry.context.length);

                // Remove false-positive errors (one char and whitespaces)
                if (error.length >= 3 && !(/\s/g.test(error))) {

                    // Set color of error => red for mistake and yellow for others
                    if (message == "Possible spelling mistake found.") { color = "red"; } else { color = "orange"; }

                    // Update error color on html
                    tagText.innerHTML = tagText.innerHTML.replace(error,
                        // "<span class='tooltip'>" + message + "<span class='tooltip' style='color: black; background-color:" + color + "; font-weight:bold;'>" + error + "</span></span>"
                        // "<span class='tooltip'>" + message + "<span class='tooltiptext'>" + Message + "</span></span>"
                    );;

                    // Add/update key error on errorsDict
                    if (error in errorsDict) { errorsDict[error][0] = errorsDict[error][0] + 1; } else { errorsDict[error] = [1, color, message]; }
                }
            });

        } catch (error) {
            continue;
        }
    }

    // Add errors to Sidebar
    var spellErrors = document.getElementById("spellErrors")
    Object.entries(errorsDict).forEach(([key, value]) => {
        var error = key; var count = value[0]; var color = value[1]; var message = value[2];
        spellErrors.innerHTML += "<li><a href='#' title='" + message + "'>" + error + " (" + count + "x)" + "</a></li>";
    });

    //  Add totalErrors to GENERALINFO
    document.getElementById("totalErrors").innerText = Object.keys(errorsDict).length;

}

async function runLighthouse(lighthouseJson) {
    console.log("runLighthouse")

    // Check if Lighthouse ran successfully
    let lighthouseInfo = document.getElementById("lighthouseInfo");
    try {
        lighthouseJson["runtimeError"]["code"];
        lighthouseInfo.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.</li>";
    } catch (Ex) {
        try {
            let performanceScore = lighthouseJson["categories"]["performance"]["score"] * 100;
            let accessibilityScore = lighthouseJson["categories"]["accessibility"]["score"] * 100;
            let BPScore = lighthouseJson["categories"]["best-practices"]["score"] * 100;
            let seoScore = lighthouseJson["categories"]["seo"]["score"] * 100;
            let pwaScore = lighthouseJson["categories"]["pwa"]["score"] * 100;
            lighthouseInfo.innerHTML += "<li><a></a>Performance - " + performanceScore + "% </li>";
            lighthouseInfo.innerHTML += "<li><a></a>Accessibility - " + accessibilityScore + "% </li>";
            lighthouseInfo.innerHTML += "<li><a></a>Best Practices - " + BPScore + "% </li>";
            lighthouseInfo.innerHTML += "<li><a></a>SEO - " + seoScore + "% </li>";
            lighthouseInfo.innerHTML += "<li><a></a>Progressive Web App - " + pwaScore + "% </li>";
            lighthouseInfo.innerHTML += "<li><a id='lighthouseReadMore' href='#'>" + "Read More" + "</a></li>";

            // Get jsonPath
            let jsonFileName = lighthouseJson["jsonFileName"];
            let lighthouseReadMore = document.getElementById("lighthouseReadMore");
            lighthouseReadMore.target = "_blank";
            lighthouseReadMore.href = "https://inspector.littleforest.co.uk/LighthouseWS/lighthouseServlet?" + "url=" + "null" + "&json=" + jsonFileName;
            // lighthouseReadMore.href = "https://googlechrome.github.io/lighthouse/viewer/?jsonurl=" + "https://inspector.littleforest.co.uk/LighthouseWS/lighthouseServlet?" + "url=" + "null" + "&json=" + jsonFileName;

        } catch (Ex) {
            lighthouseInfo.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.</li>";
        }
    }
}


// Connect
console.clear()
console.log('Connect');

let isSidebarFinish = false;
let isLangToolFinished = false;
let isIframeLoad = false;
let langToolURL = "https://api.languagetoolplus.com/v2/check"
let port = chrome.runtime.connect({ name: "knockknock" });

port.onMessage.addListener(async function (response) {
    if (response.text == "startInject") {
        // Check if already ran previously
        if (!document.getElementById("maincontent")) {
            // Clear current html code
            await clearHTML();
            // Add iframe with current url
            await addIframe();
            port.postMessage({ question: "sidebarHTML" });
        } else {
            console.log("Already checked.. nothing to do!");
        }
    } else if (response.text == "addSidebarHTML") {
        // Add Sidebar <html>
        await addSidebarHTML(response.content);
        port.postMessage({ question: "sidebarJS" });
    } else if (response.text == "addSidebarJS") {
        // Add Sidebar <script>
        await addSidebarJS(response.content);
        port.postMessage({ question: "sidebarCSS" });
    } else if (response.text == "addSidebarCSS") {
        // Add Sidebar <style>
        await addSidebarCSS(response.content);
        port.postMessage({ question: "addOverlay" });
    } else if (response.text == "addOverlay") {
        // Insert overlay
        await overlay(response.text);
        port.postMessage({ question: "generealInfo" });
    } else if (response.text == "addGeneralInfo") {
        // Insert General Information
        await addGeneralInfo();
        port.postMessage({ question: "languageTool" });
    } else if (response.text == "runLanguageTool") {
        // Run LanguageTool
        await runLanguageTool("en-gb");
        port.postMessage({ question: "removeOverlay" });
    } else if (response.text == "removeOverlay") {
        // Remove overlay
        await overlay(response.text);
        port.postMessage({ question: "lighthouse", content: window.location.href });
    } else if (response.text == "runLighthouse") {
        // Add Lighthouse
        await runLighthouse(response.content);
        console.log("end");
    }
});