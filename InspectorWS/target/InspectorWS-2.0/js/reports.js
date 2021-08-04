/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */

// ------------------ Functions ------------------------------------- //

// const inspectorUrl = "https://inspector.littleforest.co.uk/InspectorWS/";

const inspectorUrl = "http://localhost:8080/InspectorWS/";

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

async function runMain() {
    var myIframe = document.getElementById('mainContent');
    myIframe.addEventListener("load", function () {
        document.getElementById("mainBtn").click();
    });
}

async function clearAll() {
    console.log("clearReports");

    // Clear Page and HTM
    let iframeElement = document.getElementById('mainContent').contentWindow.document;
    iframeElement.open();
    iframeElement.write("");
    iframeElement.close();
    document.getElementById("htmlCode").innerHTML = "";

//    // Clear Content Report
//    document.getElementById("content-keyword-div").hidden = false;
//    document.getElementById("content-btn").hidden = false;
//    document.getElementById("content-div").hidden = true;
//    document.getElementById("totalImages").innerHTML = "";

    // Clear Links Report
    document.getElementById("links-div").hidden = true;
    document.getElementById("totalLinks").innerHTML = "";
    document.getElementById("extLinks").innerHTML = "";
    document.getElementById("intLinks").innerHTML = "";
    document.getElementById("brokenLinks").innerHTML = "";

    // Clear Spelling Report
    document.getElementById("language-select-div").hidden = false;
    document.getElementById("spelling-div").hidden = true;
//    document.getElementById("detectedLanguage").innerHTML = "";
    document.getElementById("totalErrors").innerHTML = "";
    document.getElementById("spelling_errors").innerHTML = "";
}

async function setIframe() {
    console.log("setIframe");

    // Disable goBtn
    document.getElementById("loadBtn").disabled = true;

    // Clear mainContent and Sidebar
    await clearAll();

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    if (siteUrl === "") {
        // Add base page HTML to iframe content
        // Get iframe element
        let iframeElement = document.getElementById('mainContent').contentWindow.document;
        iframeElement.open();
        iframeElement.write("Please insert a valid URL");
        iframeElement.close();

        // Enable goBtn
        document.getElementById("loadBtn").disabled = false;
    } else {
        // Add overlay
        await overlay("addOverlay", "Loading page")

        // Get HTML from site
        let HTMLServlet = inspectorUrl + "HTMLDownloader?url=" + siteUrl;
        let html = await getRequest(HTMLServlet);

        if (html === "") {
            // Add base page HTML to iframe content
            // Get iframe element
            let iframeElement = document.getElementById('mainContent').contentWindow.document;
            iframeElement.open();
            iframeElement.write("Unable to get HTML");
            iframeElement.close();

            // Enable goBtn
            document.getElementById("goBtn").disabled = false;
        } else {
            // Add base page HTML to iframe content
            // Get iframe element
            let iframeElement = document.getElementById('mainContent').contentWindow.document;
            iframeElement.open();
            iframeElement.write(html);
            iframeElement.close();

            // Set htmlCode Text Area
            html = html.replaceAll("<", "&lt;");
            html = html.replaceAll(">", "&gt;");
            document.getElementById("htmlCode").innerHTML = html;

            // HTMLCode Syntax Highlighter
            w3CodeColor(document.getElementById("htmlCode"));
        }

        // Add Stylesheet to iframe head
        await addStyleHead();

        // Set active Action Btn
        await runMain();

        // Remove overlay
        await overlay("removeOverlay", "")
    }
}

async function addStyleHead() {
    // Add Stylesheet to iframe head
    let iframeElement = document.getElementById('mainContent').contentWindow.document;
    let iframeCSS = inspectorUrl + "css/iframe.css";
    iframeElement.head.innerHTML = iframeElement.head.innerHTML + "<link type='text/css' rel='Stylesheet' href='" + iframeCSS + "' />";
}

async function addContentInfo() {
    console.log("addContentInfo");

    // Insert overlay
    await overlay("addOverlay", "Gathering Content");

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;
    ;

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
    ;

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
    let htmlCode = document.getElementById("htmlCode");

    // Set vars
    let brokenLinksCount = 0;
    let checkedLinks = [];
    let allLinks = iframeElement.links;

    for (let i = 0; i < allLinks.length; i++) {
        let linkElem = allLinks[i];
        let linkHref = linkElem.href;

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

            console.log(linkCode + " - " + linkHref);

            // Check code status
            if (linkCode === 404) {
                brokenLinksCount += 1;

                // Highlight Broken Link in HTML View
                linkElem.innerHTML = "<span class='hoverMessage' aria-label='" + message + "' style='padding: 2px 2px; border: 4px solid " + borderColor + ";'>" + linkElem.innerHTML + "</span>";

                // Update error color on html Code
                htmlCode.innerHTML = htmlCode.innerHTML.replaceAll(linkHref, "<span class='hoverMessage' aria-label='" + message + "' style='padding: 2px 2px; border: 4px solid " + borderColor + ";'>" + linkHref + "</span>");
            }
        } else {
            continue;
        }
    }

    // Toggle Broken Links Sectin
    document.getElementById("brokenLinks").innerText = brokenLinksCount;

    // If there is no Broken Links add "Good Job!"
    if (brokenLinksCount === 0) {
        document.getElementById("brokenLinks-p").innerHTML = document.getElementById("brokenLinks-p").innerHTML + " Good Job!"
    }

    document.getElementById("brokenLinks-p").hidden = false;

    // Remove overlay
    await overlay("removeOverlay", "");
}

async function runLanguageTool() {
    console.log("runLanguageTool");

    // Insert overlay
    await overlay("addOverlay", "Running Spell Check");

    // Get htmlCode
    let htmlCode = document.getElementById("htmlCode");

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
                var replacements = reps.map(function (reps) {
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

    // Create items array
    var items = Object.keys(errorsDict).map(function (key) {
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
        let count = entry[1][0];
        let message = entry[1][1];
        let replacements = entry[1][2];
        let color = entry[1][3];
        spelling_errors.innerHTML += "<li><a href=javascript:gotoSpellError('spell_" + error + "');>" + error + " (" + count + "x)" + "</a></li>";

        // Update error color on html Code
        htmlCode.innerHTML = htmlCode.innerHTML.replaceAll(error, "<span class='hoverMessage' style='background-color:" + color + ";'>" + error + "<span class='msgPopup'>" + message + " Replacements: " + replacements + "</span></span>");
    });

    //  Add totalErrors to GENERALINFO
    document.getElementById("totalErrors").innerText = Object.keys(errorsDict).length;

    // If there is no spell errors add "Good Job!"
    if (Object.keys(errorsDict).length === 0) {
        document.getElementById("spellErrors-p").innerHTML = document.getElementById("spellErrors-p").innerHTML + " Good Job!"
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
    var iframeElement = document.getElementById("mainContent").contentWindow;
    iframeElement.scrollTo(0, iframeElement.document.getElementById(spellError).offsetTop - 200);
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

    // Get selected Language
    let language = document.getElementById("languages_list").value;

    window.location.href = inspectorUrl + "Inspector?url=" + siteUrl + "&lang=" + language;
}

async function main() {
    // START
    console.log("----------------------");

    // Run Spelling Report
    await runLanguageTool();

    // Insert Links Information
    await addLinksInfo();

    // Enable goBtn
    document.getElementById("loadBtn").disabled = false;

    console.log("----------------------");
}
