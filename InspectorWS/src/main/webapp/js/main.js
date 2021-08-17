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

async function runContent() {
    console.log("addContentInfo");

    // Insert overlay
    await overlay("addOverlay", "Gathering Content", "");

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
    await overlay("removeOverlay", "", "");
}

async function runLinks() {
    console.log("addLinksInfo");

    // Insert overlay
    await overlay("addOverlay", "Gathering Links", "");

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
    await overlay("removeOverlay", "", "");

    await checkBrokenLinks();
}

async function runLanguageTool() {
    console.log("runLanguageTool");

    // Insert overlay
    await overlay("addOverlay", "Running Spell Check", "");

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;

    // Get htmlCode
    let iframeCode = document.getElementById('mainCode').contentWindow.document;

    // Set Language
    let langValues = [];
    let detectedLang = iframeElement.documentElement.lang;
    let languages_list = document.getElementById('languages_list');
    for (let i = 0; i < languages_list.options.length; i++) {
        langValues.push(languages_list.options[i].value);
    }

    let langCode = document.getElementById("languages_list").value;
    if (langCode === "auto") {
        if (langValues.includes(detectedLang)) {
            langCode = detectedLang;
            let valueText = languages_list.options[langValues.indexOf(langCode)].text;
            document.getElementById("overlaySndMessage").innerHTML = "Detected Language: " + valueText + "</br>";
        } else {
            langCode = "en-GB";
            let valueText = languages_list.options[langValues.indexOf(langCode)].text;
            document.getElementById("overlaySndMessage").innerHTML = "Coundn't detect langauage.</br> Defaulting to : " + valueText + "</br>";
        }
    } else {
        let valueText = languages_list.options[langValues.indexOf(langCode)].text;
        document.getElementById("overlaySndMessage").innerHTML = "Selected language: " + valueText + "</br>";
    }

    document.getElementById("languages_list").value = langCode;
    console.log("Language - " + langCode);

    // Get existing Dictionary
    let dict = await getDictionary("dictionary");

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
                    if (!(dict.includes(error)) && error.length >= 3 && !(/\s/g.test(error))) {

                        // Set message, replacements, color
                        let message = entry.message;
                        let replacements = entry.replacements.map(reps => reps['value']).slice(0, 5).toString().replaceAll(",", ", ");
                        replacements = ((replacements === "") ? "None available" : replacements);
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
            console.log(Ex);
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
        spelling_errors.innerHTML += "<li><a href=javascript:addDictionary('" + error + "')><i class='fas fa-plus-circle mx-2'></i></a><a href=javascript:gotoSpellError('spell_" + error + "');><span class='hoverMessage'>" + error + " (" + count + "x)" + "<span class='msgPopup'>" + message + "<br> Replacements: " + replacements + "</span></span></a></li>";
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
    await overlay("removeOverlay", "", "");

    // Enable Actions
    await enableDisableActions("enable");
}

async function runLighthouse() {
    console.log("runLighthouse");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Check if at least one categories is selected
    let lighthouse_info = document.getElementById("lighthouse_info");

    // Insert overlay
    await overlay("addOverlay", "Running Lighthouse Report", "");

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
        let categories = ["performance", "accessibility", "best-practices", "seo", "pwa"];
        categories.forEach(cat => {
            let catScore = math.round(lighthouseJson["categories"][cat]["score"] * 100);
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
        console.log(Ex);
        await setErrorModal("", "Lighthouse was unable to reliably load the page you requested.<br>Please try again.");
    }

    // Remove overlay
    await overlay("removeOverlay", "", "");
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


    // Load Dictionary
    await loadDictionaryList();

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
    await overlay("removeOverlay", "", "")

    // Run Spelling Report
    await runLanguageTool();

    // END
    console.log("----------------------");
}
