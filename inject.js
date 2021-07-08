// LanguageTool Chrome Extension
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/06/08

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

async function main() {
    // Add sidebar
    console.log("Start Sidebar");

    // Set base URLs
    const assetsURL = "https://raw.githubusercontent.com/littleforestweb/pagina/main/";
    const langToolURL = "https://api.languagetoolplus.com/v2/check";

    // Clear current html code
    const newHTML = document.open("text/html", "replace");
    newHTML.write('<html><head><body style="margin:0;"></body></html>'); newHTML.close();

    // Add iframe with current url
    var iframeElement = document.createElement('iframe');
    iframeElement.id = "maincontent"; iframeElement.classList.add("iframe-width-300"); iframeElement.classList.add("iframe");
    iframeElement.src = fullURL = window.location.href;
    document.body.appendChild(iframeElement);

    // Add Sidebar <html>
    var reportHTML = await getRequest(assetsURL + "report.html");
    document.body.innerHTML += reportHTML;

    // Add Sidebar <script>
    const reportJS = await getRequest(assetsURL + "report.js");
    var report = document.createElement("script");
    document.body.appendChild(report).innerHTML = reportJS;

    // Add Sidebar <style>
    var reportCSS = await getRequest(assetsURL + "report.css");
    var report = document.createElement("style");
    document.head.appendChild(report).innerHTML = reportCSS;

    // Insert overlay
    document.getElementById("overlay").style.display = "block";

    // Finish Sidebar
    isSidebarFinish = true;

    // Wait for addSidebar() to finish
    while (!(isSidebarFinish)) { await sleep(1000); }
    console.log("End Sidebar")

    var isIframeLoad = false;
    document.getElementById('maincontent').addEventListener("load", function () {
        isIframeLoad = true;
    });

    // wait for addSidebar() to finish
    // while (!(isIframeLoad)) { await sleep(1000); }
    console.log("Iframe Loaded")

    // Run languageTool once iframe has loaded
    console.log("Start LanguageTool");

    // Get iframe element
    var iframeElement = document.getElementById('maincontent').contentDocument;

    //  Add totalLinks to GENERALINFO
    const totalLinks = []; const extLinks = []; const intLinks = []; const allLinks = iframeElement.links;
    for (var i = 0; i < allLinks.length; i++) {
        var linkHref = allLinks[i].href;
        totalLinks.push(linkHref);
        if (linkHref.includes(window.location.href)) { intLinks.push(linkHref); } else { extLinks.push(linkHref); }
    }
    document.getElementById("totalLinks").innerText = totalLinks.length;
    document.getElementById("extLinks").innerText = extLinks.length;
    document.getElementById("intLinks").innerText = intLinks.length;

    //  Add totalImages to GENERALINFO
    const totalImages = iframeElement.getElementsByTagName("img").length;
    document.getElementById("totalImages").innerText = totalImages;

    // Get all tagsText
    const tagsText = iframeElement.getElementsByTagName("p");

    // Set errorsDict where key => error and value => [count, color]
    var errorsDict = {};

    // Iterate on every tag
    for (var i = 0; i < tagsText.length; i++) {

        // Set phrase from content array index
        var tagText = tagsText[i]

        // Get LangTool API Response
        const data = await getRequest(langToolURL + "?text=" + tagText.innerHTML.replace(/<\/?[^>]+(>|$)/g, "") + "&language=" + "en-gb");

        try {

            // Get detected language and confidence
            var detectedLanguage = data.language.detectedLanguage.name;
            var detectConfidence = data.language.detectedLanguage.confidence * 100;
            document.getElementById("detectedLanguage").innerHTML = detectedLanguage;
            document.getElementById("detectConfidence").innerHTML = detectConfidence;

            // Iterate on every error
            data.matches.forEach(function (entry) {

                // Get error, message;
                var text = entry.context.text; var message = entry.message; let color;
                var error = text.substring(entry.context.offset, entry.context.offset + entry.context.length);

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

    // Finish LanguageTool
    isLangToolFinished = true;

    // Wait for runLangTool() to finish
    while (!(isLangToolFinished)) { await sleep(1000); }
    console.log("End LanguageTool")

    // Add Lighthouse
    console.log("Start Lighthouse")
    const lighthouseAPI = "https://192.168.1.21:8443/LighthouseWS/lighthouseServlet?url=" + window.location.href;
    const lighthouseJson = await getRequest(lighthouseAPI);
    const performanceScore = lighthouseJson["categories"]["performance"]["score"];
    const accessibilityScore = lighthouseJson["categories"]["accessibility"]["score"];
    const BPScore = lighthouseJson["categories"]["best-practices"]["score"];
    const seoScore = lighthouseJson["categories"]["seo"]["score"];
    const pwaScore = lighthouseJson["categories"]["pwa"]["score"];
    console.log("performanceScore - " + performanceScore);
    console.log("accessibilityScore - " + accessibilityScore);
    console.log("BPScore - " + BPScore);
    console.log("seoScore - " + seoScore);
    console.log("pwaScore - " + pwaScore);

    // Finish Lighthouse
    isLighthouseFinished = false;
    console.log("End Lighthouse")

    // Remove overlay
    document.getElementById("overlay").style.display = "none";
}

var isSidebarFinish = false; var isLangToolFinished = false; var isLighthouseFinished = false;
(async function () {
    // START
    console.clear()
    console.log('Start Inject');

    // Check if already ran previously
    if (!document.getElementById("maincontent")) {
        await main();
    } else {
        console.log("Already checked.. nothing to do!");
    }

    // END
    console.log('End Inject');
})();