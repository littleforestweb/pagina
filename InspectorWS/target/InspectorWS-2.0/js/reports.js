/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */

// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //

// const inspectorUrl = "https://inspector.littleforest.co.uk/InspectorWS/";
const inspectorUrl = "http://localhost:8080/InspectorWS/";

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
        if (url.includes("languagetoolplus") ||
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
        // Insert overlay
        console.log("addOverlay")
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlayMessage").innerText = message;
    } else if (action === "removeOverlay") {
        // Remove overlay
        console.log("removeOverlay")
        document.getElementById("overlay").style.display = "none";
    }
}

async function enableDisableActions(action) {
    if (action === "enable") {
        // Enable goBtn
        document.getElementById("loadBtn").disabled = false;
        // Enable searchURL
        document.getElementById("searchURL").disabled = false;
        // Enable HTML Code Switch
        document.getElementById("PageBtn").disabled = false;
        document.getElementById("HTMLBtn").disabled = false;
        // Enable languages_list
        document.getElementById("languages_list").disabled = false;
    } else {
        // Enable goBtn
        document.getElementById("loadBtn").disabled = true;
        // Enable searchURL
        document.getElementById("searchURL").disabled = true;
        // Enable HTML Code Switch
        document.getElementById("PageBtn").disabled = true;
        document.getElementById("HTMLBtn").disabled = true;
        // Enable languages_list
        document.getElementById("languages_list").disabled = true;
    }
}

async function runMain() {
    let iframeElement = document.getElementById('mainContent');
    iframeElement.addEventListener("load", function () {
        let html = iframeElement.contentWindow.document.documentElement.outerHTML;
        if (html.length !== 436 && html.length !== 39) {
            document.getElementById("mainBtn").click();
        }
    });
}

async function setIframe() {
    console.log("setIframe");

    // Disable goBtn
    await enableDisableActions("disable");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Add overlay
    await overlay("addOverlay", "Loading page")

    // Set iframe src to siteUrl
    document.getElementById('mainContent').src = siteUrl;

    // Set active Action Btn
    await runMain();

    // // Get HTML from site
    // let HTMLServlet = inspectorUrl + "HTMLDownloader?url=" + siteUrl;
    // let html = await getRequest(HTMLServlet);
    //
    // if (html === "") {
    //     // Add base page HTML to iframe content
    //     // Get iframe element
    //     let iframeElement = document.getElementById('mainContent').contentWindow.document;
    //     iframeElement.open();
    //     iframeElement.write("Unable to get HTML");
    //     iframeElement.close();
    //
    //     // Enable Actions
    //     await enableDisableActions("enable");
    // } else {
    //
    //     let pathArray = siteUrl.split('/');
    //     let baseURL = pathArray[0] + "//" + pathArray[2];
    //     html = html.replaceAll("background-image: url(", "background-image: url(" + baseURL);
    //
    //     // Add base page HTML to iframe content
    //     // Get iframe element
    //     let iframeElement = document.getElementById('mainContent').contentWindow.document;
    //     iframeElement.open();
    //     iframeElement.write(html);
    //     iframeElement.close();
    //
    //     // Set htmlCode Text Area
    //     html = html.replaceAll("<", "&lt;");
    //     html = html.replaceAll(">", "&gt;");
    //     let iframeCode = document.getElementById('mainCode').contentWindow.document;
    //     iframeCode.open();
    //     iframeCode.write('<pre id="htmlView" class="htmlView"><code id="htmlCode">' + html + '</code></pre>');
    //     iframeCode.close();
    //
    //     // HTMLCode Syntax Highlighter
    //     w3CodeColor();
    // }
}

async function addStyleHead() {
    // Add Stylesheet to iframe head
    let iframeElement = document.getElementById('mainContent').contentWindow.document;
    let iframeCSS = inspectorUrl + "css/iframe.css";
    iframeElement.head.innerHTML = iframeElement.head.innerHTML + "<link type='text/css' rel='Stylesheet' href='" + iframeCSS + "' />";

    // Add Stylesheet to iframe head
    let iframeCode = document.getElementById('mainCode').contentWindow.document;
    iframeCode.head.innerHTML = iframeCode.head.innerHTML + "<link type='text/css' rel='Stylesheet' href='" + iframeCSS + "' />";
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

    // Get htmlCode
    let htmlCode = document.getElementById("mainCode").contentWindow.document;

    // Get selected Language
    let language = document.getElementById("languages_list").value;
    console.log("Language - " + language);

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;

    // Get all tagsText
    let tagsText = iframeElement.querySelectorAll('p, h1, h2');

    // Set errorsDict where key => error and value => [count, color]
    let errorsDict = {};

    // Iterate on every tag
    for (let i = 0; i < tagsText.length; i++) {

        // Set phrase from content array index
        let tagText = tagsText[i]

        // Only check if tagText is visible
        if (tagText.offsetParent !== null && window.getComputedStyle(tagText).display !== 'none') {

            // Get LangTool API Response
            const data = await getRequest("https://api.languagetoolplus.com/v2/check" + "?text=" + tagText.innerText + "&language=" + language);

            try {

//            if (language === "auto") {
//                // Get detected language and confidence
//                let detectedLanguage = data.language.detectedLanguage.name;
//                document.getElementById("detectedLanguage").innerText = detectedLanguage + " (Auto) ";
//            } else {
//                // Get detected language and confidence
//                let detectedLanguage = data.language.name;
//                document.getElementById("detectedLanguage").innerText = detectedLanguage;
//            }

                // Iterate on every error
                data.matches.forEach(function (entry) {

                    // Get error, message, replacements and color;
                    let text = entry.context.text;
                    let message = entry.message;
                    let error = text.substring(entry.context.offset, entry.context.offset + entry.context.length);
                    let reps = entry.replacements;
                    let replacements = reps.map(function (reps) {
                        return reps['value'];
                    }).toString().replaceAll(",", ", ");
                    let color;

                    // Remove false-positive errors (three chars and whitespaces)
                    if (error.length >= 3 && !(/\s/g.test(error))) {

                        // Set color of error => red for mistake and yellow for others
                        if (message === "Possible spelling mistake found.") {
                            color = "red";
                        } else {
                            color = "orange";
                        }

                        // Update error color on html View
                        tagText.innerHTML = tagText.innerHTML.replace(error, "<span class='hoverMessage' id='spell_" + error + "' style='background-color:" + color + "'><b>" + error + "</b><span class='msgPopup'>" + message + " Replacements: " + replacements + "</span></span>");

                        // Add/update key error on errorsDict
                        if (error in errorsDict) {
                            errorsDict[error][0] = errorsDict[error][0] + 1;
                        } else {
                            errorsDict[error] = [1, message, replacements, color];
                        }

                    }
                });

            } catch (error) {
                continue;
            }
        }
    }

    // Create items array
    let items = Object.keys(errorsDict).map(function (key) {
        return [key, errorsDict[key]];
    });

    // Sort the array based on the count element
    items.sort(function (first, second) {
        return second[1][0] - first[1][0];
    });

    // Add errors to Sidebar
    let spelling_errors = document.getElementById("spelling_errors");
    items.forEach(function (entry) {
        let error = entry[0];
        if (iframeElement.getElementById("spell_" + error) !== null) {
            let count = entry[1][0];
            let message = entry[1][1];
            let replacements = entry[1][2];
            let color = entry[1][3];
            spelling_errors.innerHTML += "<li><a href=javascript:gotoSpellError('spell_" + error + "');>" + error + " (" + count + "x)" + "</a></li>";

            // Update error color on html Code
            htmlCode.getElementById("htmlCode").innerHTML = htmlCode.getElementById("htmlCode").innerHTML.replaceAll(error, "<span id='spell_" + error + "' class='hoverMessage' style='background-color:" + color + ";'>" + error + "<span class='msgPopup'>" + message + " Replacements: " + replacements + "</span></span>");
        }
    });

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

        // Add Read More -> Open the HTML File
        lighthouse_info.innerHTML += "<li><a id='lighthouseReadMore' href='#'><b>" + "Read More" + "</b></a></li>";
        let lighthouseReadMore = document.getElementById("lighthouseReadMore");
        lighthouseReadMore.target = "_blank";
        lighthouseReadMore.href = inspectorUrl + "Lighthouse?" + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
        document.getElementById("lighthouse-section").removeAttribute("hidden");
    } catch (Ex) {
        lighthouse_info.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.<br>You can try refreshing the page and retry.</li>";
    }

    // Toggle Lighthouse Section
    document.getElementById("lighthouse-btn").hidden = true;
    document.getElementById("lighthouse-li").style.display = "block";
    document.getElementById("lighthouse-div").hidden = false;

    // Remove overlay
    await overlay("removeOverlay", "");
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

    window.location.href = inspectorUrl + "Inspector";
}

async function main() {
    // START
    console.log("----------------------");

    // Get Iframe
    let iframeElement = document.getElementById('mainContent');
    let html = iframeElement.contentWindow.document.documentElement.outerHTML;

    // Set htmlCode Text Area
    html = html.replaceAll("<", "&lt;");
    html = html.replaceAll(">", "&gt;");
    let iframeCode = document.getElementById('mainCode').contentWindow.document;
    iframeCode.open();
    iframeCode.write('<pre id="htmlView" class="htmlView"><code id="htmlCode">' + html + '</code></pre>');
    iframeCode.close();

    // HTMLCode Syntax Highlighter
    w3CodeColor();

    // Add Stylesheet to iframe head
    await addStyleHead();

    // Remove overlay
    await overlay("removeOverlay", "")

    // Run Spelling Report
    await runLanguageTool();

    // Enable Actions
    await enableDisableActions("enable");

    console.log("----------------------");
}
