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
    let tagsText = iframeElement.querySelectorAll('p, h1, h2');
    while (tagsText.length == 0) {
        tagsText = iframeElement.querySelectorAll('p, h1, h2');
    }

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
                document.getElementById("detectedLanguage").innerText = detectedLanguage + " (Auto) ";
            } else {
                // Get detected language and confidence
                let detectedLanguage = data.language.name;
                document.getElementById("detectedLanguage").innerText = detectedLanguage;
            }


            // Iterate on every error
            data.matches.forEach(function (entry) {

                // Get error, message, replacements and color;
                let text = entry.context.text;
                let message = entry.message;
                let error = text.substring(entry.context.offset, entry.context.offset + entry.context.length);
                let reps = entry.replacements;
                var replacements = reps.map(function (reps) { return reps['value']; }).toString().replaceAll(",", ", ");
                let color;

                // Remove false-positive errors (three chars and whitespaces)
                if (error.length >= 3 && !(/\s/g.test(error))) {

                    // Set color of error => red for mistake and yellow for others
                    if (message == "Possible spelling mistake found.") { color = "red"; } else { color = "orange"; }

                    // Update error color on html
                    tagText.innerHTML = tagText.innerHTML.replace(error,
                        "<a href='#' style='text-decoration: none;'><span title='Message: " + message + "&#010;" + "Replacements: " + replacements + "' style='color: black; background-color:" + color + ";font-weight:bold;'>" + error + "</span></a>"
                    );;

                    // Add/update key error on errorsDict
                    if (error in errorsDict) { errorsDict[error][0] = errorsDict[error][0] + 1; } else { errorsDict[error] = [1, message, replacements]; }
                }
            });

        } catch (error) {
            continue;
        }
    }

    // Create items array
    var items = Object.keys(errorsDict).map(function (key) {
        return [key, errorsDict[key]];
    });

    // Sort the array based on the count element
    items.sort(function (first, second) {
        return second[1][0] - first[1][0];
    });

    // Add errors to Sidebar
    let spellErrors = document.getElementById("spellErrors")
    items.forEach(function (entry) {
        let error = entry[0]; let count = entry[1][0]; let message = entry[1][1]; let replacements = entry[1][2];
        spellErrors.innerHTML += "<li><a href='#' title='Message: " + message + "&#010;" + "Replacements: " + replacements + "'>" + error + " (" + count + "x)" + "</a></li>";
    });

    //  Add totalErrors to GENERALINFO
    document.getElementById("totalErrors").innerText = Object.keys(errorsDict).length;

}

async function runLighthouse(lighthouseJson) {
    console.log("runLighthouse")

    // Get lighthouseInfo div
    let lighthouseInfo = document.getElementById("lighthouseInfo");

    // Check if Lighthouse ran successfully
    try {
        lighthouseJson["runtimeError"]["code"];
        lighthouseInfo.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.<br>You can try refreshing the page and retry.</li>";
    } catch (Ex) {
        try {

            // Iterate over every Category and set the Tittle and Score
            categories.split(",").forEach(cat => {
                let catScore = lighthouseJson["categories"][cat]["score"] * 100;
                let catTitle = lighthouseJson["categories"][cat]["title"];
                lighthouseInfo.innerHTML += "<li><a></a>" + catTitle + " - " + catScore + " % </li > ";
            })

            // Add Read More -> Open the HTML File
            lighthouseInfo.innerHTML += "<li><a id='lighthouseReadMore' href='#'><b>" + "Read More" + "</b></a></li>";
            let lighthouseReadMore = document.getElementById("lighthouseReadMore");
            lighthouseReadMore.target = "_blank";
            lighthouseReadMore.href = "https://inspector.littleforest.co.uk/LighthouseWS/lighthouseServlet?url=null&cats=null&view=" + lighthouseJson["htmlReport"];
            document.getElementById("lighthouse-section").removeAttribute("hidden");
        } catch (Ex) {
            lighthouseInfo.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.<br>You can try refreshing the page and retry.</li>";
        }
        document.getElementById("lighthouse-section").removeAttribute("hidden");
    }
}


// MAIN
console.clear();

(async function () {
    // START
    console.log("Start Inject.js");

    // Check if the script already been injected
    if (document.getElementById("maincontent")) {
        console.log("Already Injected");
        return;
    } else {
        // Clear current html code
        await clearHTML();
    }

    // Add Sidebar <html>
    let htmlContent = await getRequest(chrome.runtime.getURL("assets/report.html"));
    await addSidebarHTML(htmlContent);

    // Add Sidebar <script>
    let jsContent = await getRequest(chrome.runtime.getURL("assets/report.js"));
    await addSidebarJS(jsContent);

    // Add Sidebar <style>
    let cssContent = await getRequest(chrome.runtime.getURL("assets/report.css"));
    await addSidebarCSS(cssContent);

    // Insert overlay
    await overlay("addOverlay");

    // Insert General Information
    await addGeneralInfo();

    // // Run LanguageTool
    await runLanguageTool("en-GB");

    // Remove overlay
    await overlay("removeOverlay");

    // Add Lighthouse
    chrome.runtime.sendMessage({ url: window.location.href, question: "Lighthouse" });
    chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
        await runLighthouse(request.json);
    });

    // END
})();