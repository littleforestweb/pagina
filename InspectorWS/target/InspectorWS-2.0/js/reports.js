/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */

// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //

const inspectorUrl = "https://inspector.littleforest.co.uk/InspectorWS/";
// const inspectorUrl = "http://localhost:8080/InspectorWS/";
// const LTHTTPServer = "http://inspector.littleforest.co.uk:8081/v2/check?";
const LTHTTPServer = "https://api.languagetoolplus.com/v2/check?";

let counter = 0;
let myTimmer = setInterval(myTimer, 1000);

// ------------------------------------- Functions ------------------------------------- //

async function myTimer() {
    // Get Iframe
    let iframeElement = document.getElementById('mainContent');
    let html = iframeElement.contentWindow.document.documentElement.outerHTML;

    console.log(counter + " - " + html.length);
    if (html.length === 436) {
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

    // Get all tagsText
    let tagsElem = iframeElement.querySelectorAll("p, h1, h2, h3, h4, h5, h6");

    // Iterate on every tag
    for (let i = 0; i < tagsElem.length; i++) {

        // Set phrase from content array index
        let tagElem = tagsElem[i]

        // Only check if tagText is visible
        let style = window.getComputedStyle(tagElem);
        if (tagElem.offsetParent !== null && style.display !== 'none' && style.visibility !== "hidden") {

            // Get Spell Check JSON
            let spellCheckJSON = await getRequest(LTHTTPServer + "language=" + langCode + "&text=" + tagElem.innerText);
            let spellMatches = spellCheckJSON.matches;

            // If there is errors
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
                        let reps = entry.replacements;
                        let replacements = reps.map(function (reps) {
                            return reps['value'];
                        }).toString().replaceAll(",", ", ");
                        let color
                        if (message === "Possible spelling mistake found.") {
                            color = "red";
                        } else {
                            color = "orange";
                        }

                        // Update error in HTML Code
                        let newHTML = tagElem.innerHTML.replace(error, "<span id='spell_" + error + "' class='hoverMessage' style='background-color:" + color + ";'>" + error + "<span class='msgPopup'>" + message + " Replacements: " + replacements + "</span></span>");
                        iframeCode.getElementById("htmlCode").innerHTML = iframeCode.getElementById("htmlCode").innerHTML.replace(error, newHTML);

                        // Update error in HTML Page
                        tagElem.innerHTML = tagElem.innerHTML.replace(error, "<span class='hoverMessage' id='spell_" + error + "' style='background-color:" + color + "'><b>" + error + "</b><span class='msgPopup'>" + message + " Replacements: " + replacements + "</span></span>");

                        // Add/update key error on errorsDict
                        if (error in errorsDict) {
                            errorsDict[error][0] = errorsDict[error][0] + 1;
                        } else {
                            errorsDict[error] = [1, message, replacements, tagElem, color];
                        }
                    }
                }
            }
        }
    }

    // Sort the array based on the count element
    let items = Object.keys(errorsDict).map(function (key) {
        return [key, errorsDict[key]];
    }).sort(function (first, second) {
        return second[1][0] - first[1][0];
    });

    // Add errors to Sidebar
    for (let i = 0; i < items.length; i++) {
        let entry = items[i];
        let error = entry[0];
        let count = entry[1][0];

        // Add errors to Sidebar
        let spelling_errors = document.getElementById("spelling_errors");
        spelling_errors.innerHTML += "<li><a href=javascript:gotoSpellError('spell_" + error + "');>" + error + " (" + count + "x)" + "</a></li>";
    }

    //  Add totalErrors to GENERALINFO
    document.getElementById("totalErrors").innerText = Object.keys(errorsDict).length;

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

    // Get selected categories
    let categories = "";
    let cat_performance = document.getElementById("cat_performance").checked;
    let cat_pwa = document.getElementById("cat_pwa").checked;
    let cat_bp = document.getElementById("cat_bp").checked;
    let cat_accessibility = document.getElementById("cat_accessibility").checked;
    let cat_seo = document.getElementById("cat_seo").checked;
    if (cat_performance) {
        categories += "performance,";
    }
    if (cat_pwa) {
        categories += "pwa,";
    }
    if (cat_bp) {
        categories += "best-practices,";
    }
    if (cat_accessibility) {
        categories += "accessibility,";
    }
    if (cat_seo) {
        categories += "seo,";
    }

    // Check if at least one categories is selected
    let lighthouse_info = document.getElementById("lighthouse_info");
    if (categories === "") {
        lighthouse_info.innerHTML = "<li>Please select at least one categorie</li>";
        return;
    } else {
        categories = categories.slice(0, -1);
    }

    // Insert overlay
    await overlay("addOverlay", "Running Lighthouse Report");

    // Enable Actions
    await enableDisableActions("disable");

    // Get selected device
    let device;
    let device_mobile = document.getElementById("dev_mobile");
    let device_desktop = document.getElementById("dev_desktop");
    if (device_mobile.checked) {
        device = device_mobile.value;
    } else if (device_desktop.checked) {
        device = device_desktop.value;
    }

    console.log("siteUrl: " + siteUrl);
    console.log("Categories: " + categories);
    console.log("Device: " + device);

    // Get lighthouseJson
    let lighthouseJson = await getRequest(inspectorUrl + "Lighthouse?" + "url=" + siteUrl + "&cats=" + categories + "&device=" + device);

    try {
        // Iterate over every Category and set the Tittle and Score
        categories.split(",").forEach(cat => {
            let catScore = lighthouseJson["categories"][cat]["score"] * 100;
            let catTitle = lighthouseJson["categories"][cat]["title"];
            lighthouse_info.innerHTML += "<li>" + catTitle + " - " + catScore + " % </li > ";
        })

        // Toggle Lighthouse Section
        document.getElementById("mainLighthouse").src = inspectorUrl + "Lighthouse?" + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
        document.getElementById("lighthouse-section").removeAttribute("hidden");
        document.getElementById("lighthouse-btn").hidden = true;
        document.getElementById("lighthouseCategories").hidden = true;
        document.getElementById("lighthouseDevice").hidden = true;
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
    if (html.length === 436 || html.length === 39) {
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
