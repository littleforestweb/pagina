// Page Inspector Chrome Extension
// LanguageTool && Google Lighthouse
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/07/08


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

    // Get base page HTML
    let allHTML = document.documentElement.outerHTML;

    // Clear current html code
    let newHTML = document.open("text/html", "replace");
    newHTML.write('<html><head><body style="margin:0;"></body></html>');
    newHTML.close();

    // Add iframe
    let iframeElement = document.createElement('iframe');
    iframeElement.id = "maincontent";
    iframeElement.classList.add("iframe-width-300");
    iframeElement.classList.add("iframe");
    document.body.appendChild(iframeElement);

    // Add base page HTML to iframe content
    let doc = document.getElementById('maincontent').contentWindow.document;
    doc.open();
    doc.write(allHTML);
    doc.close();
}

async function addSidebarHTML(htmlContent) {
    console.log("addSidebarHTML");

    // Add Sidebar <html>
    let sidebar = document.createElement('div');
    sidebar.innerHTML = htmlContent;
    document.body.appendChild(sidebar);
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

    // // wait for iframe to load
    // document.getElementById('maincontent').addEventListener("load", function () {
    //     isIframeLoad = true;
    // });
    // while (!(isIframeLoad)) { await sleep(1000); }

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
    console.log("runLanguageTool - " + language);

    // Get iframe element
    let iframeElement = document.getElementById('maincontent').contentDocument;

    // Get all tagsText
    let tagsText = iframeElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span')

    // Set errorsDict where key => error and value => [count, color]
    let errorsDict = {};

    // Iterate on every tag
    for (let i = 0; i < tagsText.length; i++) {

        // Set phrase from content array index
        let tagText = tagsText[i]

        // Get LangTool API Response
        const data = await getRequest("https://api.languagetoolplus.com/v2/check" + "?text=" + tagText.innerHTML.replace(/<\/?[^>]+(>|$)/g, "") + "&language=" + language);

        try {

            if (language == "auto") {
                // Get detected language and confidence
                let detectedLanguage = data.language.detectedLanguage.name;
                document.getElementById("detectedLanguage").innerText = detectedLanguage + " (auto-detect) ";
            } else {
                // Get detected language and confidence
                let detectedLanguage = data.language.name;
                document.getElementById("detectedLanguage").innerText = detectedLanguage;
            }


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
                        "<a style='text-decoration: none;' href='#'><span title='" + message + "' style='color: black; background-color:" + color + ";font-weight:bold;'>" + error + "</span></a>"
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

async function runLighthouse(lighthouseJson, categories) {
    console.log("runLighthouse")

    // Check if Lighthouse ran successfully
    let lighthouseInfo = document.getElementById("lighthouseInfo");
    try {
        lighthouseJson["runtimeError"]["code"];
        lighthouseInfo.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.</li>";
    } catch (Ex) {
        try {

            // Iterate over every Category and set the Tittle and Score
            categories.split(",").forEach(cat => {
                let catScore = lighthouseJson["categories"][cat]["score"] * 100;
                let catTitle = lighthouseJson["categories"][cat]["title"];
                lighthouseInfo.innerHTML += "<li><a></a>" + catTitle + " - " + catScore + " % </li > ";
            })

            // Add Read More -> Open the HTML File
            lighthouseInfo.innerHTML += "<li><a id='lighthouseReadMore' href='#'><b>" + "View Full Report" + "</b></a></li>";
            let lighthouseReadMore = document.getElementById("lighthouseReadMore");
            lighthouseReadMore.target = "_blank";
            lighthouseReadMore.href = "https://inspector.littleforest.co.uk/LighthouseWS/lighthouseServlet?url=null&cats=null&view=" + lighthouseJson["htmlReport"];
        } catch (Ex) {
            lighthouseInfo.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.</li>";
        }
    }
}

console.clear();
chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
    if (msg.text == "startInject") {
        if (document.getElementById("maincontent")) {
            chrome.runtime.sendMessage({ question: "allDone" });
        } else {
            // Clear current html code
            await clearHTML();
            chrome.runtime.sendMessage({ question: "sidebarHTML" });
        }
    } else if (msg.text == "addSidebarHTML") {
        // Add Sidebar <html>
        await addSidebarHTML(msg.content);
        chrome.runtime.sendMessage({ question: "sidebarJS" });
    } else if (msg.text == "addSidebarJS") {
        // Add Sidebar <script>
        await addSidebarJS(msg.content);
        chrome.runtime.sendMessage({ question: "sidebarCSS" });
    } else if (msg.text == "addSidebarCSS") {
        // Add Sidebar <style>
        await addSidebarCSS(msg.content);
        chrome.runtime.sendMessage({ question: "addOverlay" });
    } else if (msg.text == "addOverlay") {
        // Insert overlay
        await overlay(msg.text);
        chrome.runtime.sendMessage({ question: "generealInfo" });
    } else if (msg.text == "addGeneralInfo") {
        // Insert General Information
        await addGeneralInfo();
        chrome.runtime.sendMessage({ question: "languageTool" });
    } else if (msg.text == "runLanguageTool") {
        // Run LanguageTool
        await runLanguageTool(msg.lang);
        chrome.runtime.sendMessage({ question: "removeOverlay" });
    } else if (msg.text == "removeOverlay") {
        // Remove overlay
        await overlay(msg.text);
        chrome.runtime.sendMessage({ question: "lighthouse" });
    } else if (msg.text == "runLighthouse") {
        // Add Lighthouse
        document.getElementById("lighthouse-section").hidden = false;
        await runLighthouse(msg.content, msg.categories);
        chrome.runtime.sendMessage({ question: "end" });
    }
});