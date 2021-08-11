/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */

// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //

const inspectorUrl = "https://inspector.littleforest.co.uk/InspectorWS/";
// const inspectorUrl = "http://localhost:8080/InspectorWS/";

let counter = 0;
let myTimmer = setInterval(myTimer, 1000);

// ------------------------------------- Functions ------------------------------------- //

async function myTimer() {
    // Get Iframe
    let iframeElement = document.getElementById('mainContent');
    let html = iframeElement.contentWindow.document.documentElement.outerHTML;

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    console.log(counter + " - " + html.length);
    if (html.length <= 1000 && siteUrl !== "") {
        if (counter === 10) {

            // Get iframe element
            let iframeElement = document.getElementById('mainContent').contentWindow.document;
            iframeElement.open();
            iframeElement.write("");
            iframeElement.close();

            // Set Error Message in MODAL
            document.getElementById("modalTitle").innerHTML = "Something went wrong!";
            document.getElementById("modalBody").innerHTML = "Failed to load <b>" + siteUrl + "</b> (Timeout)</br>";
            document.getElementById("showModal").click();

            // Remove overlay
            await overlay("removeOverlay", "")

            // Enable Actions
            await enableDisableActions("enable");

            // Stop Interval
            clearInterval(myTimmer);
        }
    } else {
        // Stop Interval
        clearInterval(myTimmer);
    }

    counter = counter + 1
}

async function getSiteUrl() {
    // Set siteUrl
    const siteUrl = document.getElementById("searchURL").value;
//    const siteUrl = "https://www.gov.uk/";
//    const siteUrl = "https://littleforest.co.uk/";
//    const siteUrl = "https://pplware.sapo.pt/";
//    const siteUrl = "http://inspector.littleforest.co.uk/InspectorWS/test.html";

    return siteUrl;
}

async function getRequest(url) {
    try {
        const res = await fetch(url);
        if (url.includes("language") ||
            url.includes("BrokenLinks") ||
            url.includes("CodeSniffer") ||
            url.includes("LanguageTool") ||
            url.includes("Lighthouse")) {
            return await res.json();
        }
        return await res.text();
    } catch (error) {
        return error;
    }
}

async function overlay(action, message) {
    if (action === "addOverlay") {
        // Disable goBtn
        await enableDisableActions("disable");

        // Insert overlay
        console.log("addOverlay")
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlayMessage").innerText = message;
    } else if (action === "removeOverlay") {
        // Remove overlay
        console.log("removeOverlay")
        document.getElementById("overlay").style.display = "none";

        // Enable goBtn
        await enableDisableActions("enable");
    }
}

async function enableDisableActions(action) {
    if (action === "enable") {
        // Enable goBtn
        document.getElementById("loadBtn").disabled = false;
        // Enable searchURL
        document.getElementById("searchURL").disabled = false;
        // Enable View Switch
        document.getElementById("PageBtn").disabled = false;
        document.getElementById("HTMLBtn").disabled = false;
        document.getElementById("LighthouseViewBtn").disabled = false;
        // Enable Device View Switch
        document.getElementById("desktopView").disabled = false;
        document.getElementById("mobileView").disabled = false;
        // Enable languages_list
        document.getElementById("languages_list").disabled = false;
        // Enable Lighthouse Btn
        document.getElementById("lighthouse-btn").disabled = false;
    } else {
        // Disable goBtn
        document.getElementById("loadBtn").disabled = true;
        // Disable searchURL
        document.getElementById("searchURL").disabled = true;
        // Disable View Switch
        document.getElementById("PageBtn").disabled = true;
        document.getElementById("HTMLBtn").disabled = true;
        document.getElementById("LighthouseViewBtn").disabled = true;
        // Disable Device View Switch
        document.getElementById("desktopView").disabled = true;
        document.getElementById("mobileView").disabled = true;
        // Disable languages_list
        document.getElementById("languages_list").disabled = true;
        // Disable Lighthouse Btn
        document.getElementById("lighthouse-btn").disabled = true;
    }
}

async function load() {
    // Get siteUrl
    let siteUrl = await getSiteUrl();

    if (siteUrl === "") {
        // Set Error Message in MODAL
        document.getElementById("modalTitle").innerHTML = "Something went wrong!";
        document.getElementById("modalBody").innerHTML = "Please insert a valid URL";
        document.getElementById("showModal").click();
    } else {
        // Get selected Language
        let language = document.getElementById("languages_list").value;

        // Launch new Inspector
        window.location.href = inspectorUrl + "Inspector?url=" + siteUrl + "&lang=" + language;
    }
}

async function resetPage() {
    // Remove overlay
    await overlay("addOverlay", "Loading")

    window.location.href = inspectorUrl;
}

async function setIframe() {
    console.log("setIframe");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Add overlay
    await overlay("addOverlay", "Loading page")

    // Get iframe element
    let iframeElement = document.getElementById('mainContent');

    // Set iframe src to siteUrl
    iframeElement.src = siteUrl;

    // Add EventListener on load
    iframeElement.addEventListener("load", main);
}

async function addContentInfo() {
    console.log("addContentInfo");

    // Insert overlay
    await overlay("addOverlay", "Gathering Content");

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;


    //  Add totalImages to GENERALINFO
    let totalImages = iframeElement.getElementsByTagName("img").length;
    document.getElementById("totalImages").innerText = totalImages;

    // Toggle Content Section
    document.getElementById("content-btn").hidden = true;
    document.getElementById("content-li").style.display = "block";
    document.getElementById("content-div").hidden = false;
    document.getElementById("content-keyword-div").hidden = true;

    // Remove overlay
    await overlay("removeOverlay", "");
}

async function addLinksInfo() {
    console.log("addLinksInfo");

    // Insert overlay
    await overlay("addOverlay", "Gathering Links");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;

    // Set links counter
    let totalLinksCount = 0;
    let extLinksCount = 0;
    let intLinksCount = 0;
    let allLinks = iframeElement.links;

    for (let i = 0; i < allLinks.length; i++) {
        let linkElem = allLinks[i]
        let linkHref = linkElem.href;

        // Total | Internal || External
        totalLinksCount += 1;
        if (linkHref.includes(siteUrl)) {
            intLinksCount += 1;
        } else {
            extLinksCount += 1;
        }
    }

    // Add Link information to sidebar
    document.getElementById("totalLinks").innerText = totalLinksCount;
    document.getElementById("extLinks").innerText = extLinksCount;
    document.getElementById("intLinks").innerText = intLinksCount;

    // Toggle Links Section
    document.getElementById("links-li").style.display = "block";
    document.getElementById("links-div").hidden = false;

    // Remove overlay
    await overlay("removeOverlay", "");

    await checkBrokenLinks();
}

async function checkBrokenLinks() {
    console.log("checkBrokenLinks");

    // Insert overlay
    await overlay("addOverlay", "Checking for Broken Links");

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;

    // Get htmlCode
    let htmlCode = document.getElementById("mainCode").contentWindow.document;

    // Set vars
    let brokenLinksCount = 0;
    let checkedLinks = [];
    let allLinks = iframeElement.links;

    for (let i = 0; i < allLinks.length; i++) {
        let linkElem = allLinks[i];
        let linkHref = linkElem.href;

        let isVisible = linkElem.offsetParent;
        if (isVisible !== null) {

            // Check if href has already been checked
            if (checkedLinks.includes(linkHref) !== true) {

                // Add href to checkedLinks
                checkedLinks.push(linkHref);

                // Check if broken link
                let brokenLinkServlet = inspectorUrl + "BrokenLinks?url=" + linkHref;
                let linkJSON = await getRequest(brokenLinkServlet);
                let linkCode = linkJSON.code;
                let linkValid = linkJSON.valid;
                let message = "Not Found";
                let borderColor = "red";

                // Check code status
                if (linkCode === 404) {
                    console.log(linkCode + " - " + linkHref);

                    brokenLinksCount += 1;

                    // Highlight Broken Link in HTML View
                    linkElem.parentNode.setAttribute("style", "padding: 2px 2px; border: 4px solid " + borderColor + ";");

                    // Update error color on html Code
                    htmlCode.getElementById("htmlCode").innerHTML = htmlCode.getElementById("htmlCode").innerHTML.replaceAll(linkHref, "<span class='hoverMessage' aria-label='" + message + "' style='padding: 2px 2px; outline: 4px solid " + borderColor + ";'>" + linkHref + "</span>");
                }
            } else {
                continue;
            }
        }
    }

    // Toggle Broken Links Section
    document.getElementById("brokenLinks").innerText = brokenLinksCount;

    // If there is no Broken Links add "Good Job!"
    if (brokenLinksCount === 0) {
        document.getElementById("brokenLinks-p").innerHTML = document.getElementById("brokenLinks-p").innerHTML + "<br><b>Good Job!<br>";
    }

    // Show Broken Links Message
    document.getElementById("brokenLinks-p").hidden = false;

    // Remove overlay
    await overlay("removeOverlay", "");
}

async function replaceInText(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInText(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
                node.textContent = node.textContent.replace(pattern, replacement);
                break;
            case Node.DOCUMENT_NODE:
                replaceInText(node, pattern, replacement);
        }
    }
}

async function runLanguageTool() {
    console.log("runLanguageTool");

    // Insert overlay
    await overlay("addOverlay", "Running Spell Check");

    // Get selected Language
    let langCode = document.getElementById("languages_list").value;
    console.log("Language - " + langCode);

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;

    // Get htmlCode
    let iframeCode = document.getElementById('mainCode').contentWindow.document;

    // Set errorsDict where key => error and value => [count, color]
    let errorsDict = {};

    // Get all tagsElem ->  Empty strings -> Only spaces -> Ignore duplicates
    let tagsElem = [...new Set(iframeElement.body.innerText.split("\n").filter(e => e).filter(e => e !== " "))];

    // Iterate on every tag
    for (let i = 0; i < tagsElem.length; i++) {

        // Set phrase from content array index
        let tagElem = tagsElem[i]

        try {
            // Get SpellCheckJSON
            let spellCheckJSON = await $.post("/InspectorWS/LanguageTool", {
                content: tagElem,
                langCode: langCode
            }, function (result) {
                return result;
            });

            // If there is errors
            let spellMatches = spellCheckJSON.matches;
            if (spellMatches.length !== 0) {

                // Iterate on every error
                for (let j = 0; j < spellMatches.length; j++) {
                    let entry = spellMatches[j];

                    // Set error
                    let error = entry.context.text.substring(entry.context.offset, entry.context.offset + entry.context.length);

                    // Remove false-positive errors (three chars and whitespaces)
                    if (error.length >= 3 && !(/\s/g.test(error))) {

                        // Set message, replacements, color
                        let message = entry.message;
                        let replacements = entry.replacements.map(reps => reps['value']).slice(0, 5).toString().replaceAll(",", ", ");
                        let color = ((message === "Possible spelling mistake found.") ? "red" : "orange");

                        // Add/update key error on errorsDict
                        if (error in errorsDict) {
                            errorsDict[error][0] = errorsDict[error][0] + 1;
                        } else {
                            errorsDict[error] = [1, message, replacements, color];
                        }

                    }
                }
            }

        } catch (Ex) {
            // console.log(Ex);
        }
    }

    // Sort the array based on the count element
    let items = Object.keys(errorsDict).map(function (key) {
        return [key, errorsDict[key]];
    }).sort(function (first, second) {
        return second[1][0] - first[1][0];
    });

    // Highlight Spelling Errors on Page and Code View
    // Add Spelling Errors to sidebar
    for (let i = 0; i < items.length; i++) {
        let entry = items[i];
        let error = entry[0];
        let count = entry[1][0];
        let message = entry[1][1];
        let replacements = entry[1][2];
        let color = entry[1][3];

        // Highlight Spelling Errors on Page View
        findAndReplaceDOMText(iframeElement.body, {
            find: error,
            wrap: 'spellError',
            wrapClass: "shiny_" + color,
            wrapId: "spell_" + error
        })

        // Highlight Spelling Errors on Code View
        findAndReplaceDOMText(iframeCode.getElementById("htmlCode"), {
            find: error,
            wrap: 'spellError',
            wrapClass: "shiny_" + color,
            wrapId: "spell_" + error
        })

        // Add errors to Sidebar
        let spelling_errors = document.getElementById("spelling_errors");
        spelling_errors.innerHTML += "<li><a href=javascript:gotoSpellError('spell_" + error + "');><span class='hoverMessage'>" + error + " (" + count + "x)" + "<span class='msgPopup'>" + message + " Replacements: " + replacements + "</span></span></a></li>";
    }

    //  Add totalErrors to GENERALINFO
    document.getElementById("totalErrors").innerText = Object.keys(errorsDict).length.toString();

    // If there is no spell errors add "Good Job!"
    if (Object.keys(errorsDict).length === 0) {
        document.getElementById("spellErrors-p").innerHTML = document.getElementById("spellErrors-p").innerHTML + "<br><b>Good Job!<br>"
    }

    // Toggle Spelling Section
    document.getElementById("spelling-li").style.display = "block";
    document.getElementById("spelling-div").hidden = false;

    // Remove overlay
    await overlay("removeOverlay", "");

    // Enable Actions
    await enableDisableActions("enable");
}

async function gotoSpellError(spellError) {
    console.log("Goto " + spellError);

    // Get iframe element
    let iframeElement = document.getElementById("mainContent").contentWindow;

    // Get htmlCode
    let htmlCode = document.getElementById("mainCode").contentWindow;

    // Scroll to spell Errors in htmlView and htmlCode
    iframeElement.document.getElementById(spellError).scrollIntoView();
    htmlCode.document.getElementById(spellError).scrollIntoView();

}

async function runLighthouse() {
    console.log("runLighthouse");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Check if at least one categories is selected
    let lighthouse_info = document.getElementById("lighthouse_info");

    // Insert overlay
    await overlay("addOverlay", "Running Lighthouse Report");

    // Enable Actions
    await enableDisableActions("disable");

    // Get selected device
    let checkMobile = document.getElementById("mobileView").classList.contains("active");
    let device = ((checkMobile) ? "mobile" : "desktop");

    console.log("siteUrl: " + siteUrl);
    console.log("Device: " + device);

    try {

        // Get lighthouseJson
        let lighthouseJson = await $.post("/InspectorWS/Lighthouse", {
            url: siteUrl,
            device: device
        }, function (result) {
            return result;
        });

        // Iterate over every Category and set the Tittle and Score
        let categories = ["performance", "accessibility", "seo", "best-practices", "pwa"];
        categories.forEach(cat => {
            let catScore = lighthouseJson["categories"][cat]["score"] * 100;
            let catTitle = lighthouseJson["categories"][cat]["title"];
            lighthouse_info.innerHTML += "<li>" + catTitle + " - " + catScore + " % </li > ";
        })

        // Toggle Lighthouse Section
        document.getElementById("mainLighthouse").src = inspectorUrl + "Lighthouse?" + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
        document.getElementById("lighthouse-section").removeAttribute("hidden");
        document.getElementById("lighthouse-btn").hidden = true;
        document.getElementById("lighthouse-li").style.display = "block";
        document.getElementById("lighthouse-div").hidden = false;
        document.getElementById("LighthouseViewBtn").hidden = false;
        toggleView("lighthouseReport");
    } catch (Ex) {
        document.getElementById("modalTitle").innerHTML = "Something went wrong!";
        document.getElementById("modalBody").innerHTML = "Lighthouse was unable to reliably load the page you requested.<br>Please try again.";
        document.getElementById("showModal").click();
    }

    // Remove overlay
    await overlay("removeOverlay", "");
}

async function main() {


    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;

    // Get Iframe html
    let html = iframeElement.documentElement.outerHTML;

    // Check if content has loaded successfully
    if (html.length <= 1000) {
        return;
    }

    // START
    console.log("----------------------");

    // Remove Event Listener
    document.getElementById('mainContent').removeEventListener("load", main);

    // Set htmlCode Text Area
    let iframeCode = document.getElementById('mainCode').contentWindow.document;
    iframeCode.open();
    html = html.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    iframeCode.write('<pre id="htmlView" class="htmlView"><code id="htmlCode">' + html + '</code></pre>');
    iframeCode.close();

    // Add Stylesheet to iframe head Page and Code
    let iframeCSS = inspectorUrl + "css/iframe.css";
    iframeElement.head.innerHTML = iframeElement.head.innerHTML + "<link type='text/css' rel='Stylesheet' href='" + iframeCSS + "' />";
    iframeCode.head.innerHTML = iframeCode.head.innerHTML + "<link type='text/css' rel='Stylesheet' href='" + iframeCSS + "' />";

    // HTMLCode Syntax Highlighter
    await w3CodeColor();

    // Remove overlay
    await overlay("removeOverlay", "")

    // Run Spelling Report
    await runLanguageTool();

    // END
    console.log("----------------------");
}
