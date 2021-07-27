/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */

// ------------------ Functions ------------------------------------- //




const inspectorUrl = "https://inspector.littleforest.co.uk/InspectorWS/";
//const inspectorUrl = "http://localhost:8081/InspectorWS/";

async  function getSiteUrl() {
    // Set siteUrl
//    const siteUrl = document.getElementById("searchURL").value;
    const siteUrl = "https://www.gov.uk/";
//    const siteUrl = "https://littleforest.co.uk/";
//    const siteUrl = "https://pplware.sapo.pt/";

    return  siteUrl;
}

async function getRequest(url) {
    try {
        const res = await fetch(url);
        if (url.includes("languagetoolplus") ||
                url.includes("BrokenLinksServlet") ||
                url.includes("CodeSnifferServlet") ||
                url.includes("LanguageToolServlet") ||
                url.includes("LighthouseServlet")) {
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

async function setIframe() {
    console.log("setIframe");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    if (siteUrl === "") {
        // Add base page HTML to iframe content
        // Get iframe element
        let iframeElement = document.getElementById('mainContent').contentWindow.document;
        iframeElement.open();
        iframeElement.write("Please insert a valid URL");
        iframeElement.close();
    } else {
        // Add overlay
        await overlay("addOverlay", "Loading page")

        // Get HTML from site
        let HTMLServlet = inspectorUrl + "HTMLDownloaderServlet?url=" + siteUrl;
        let html = await  getRequest(HTMLServlet);

        if (html === "") {
            // Add base page HTML to iframe content
            // Get iframe element
            let iframeElement = document.getElementById('mainContent').contentWindow.document;
            iframeElement.open();
            iframeElement.write("Unable to get HTML");
            iframeElement.close();
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
            document.getElementById("htmlView").innerHTML = html;
            w3CodeColor(document.getElementById("htmlView"));

            // Hide Go Btn && Show Start Btn
            document.getElementById("goBtn").hidden = true;
            document.getElementById("mainBtn").hidden = false;
        }

        // Remove overlay
        await overlay("removeOverlay", "")
    }
}

async function addContentInfo() {
    console.log("addContentInfo");

    // Insert overlay
    await overlay("addOverlay", "Gathering Content");

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentDocument;

    //  Add totalImages to GENERALINFO
    let totalImages = iframeElement.getElementsByTagName("img").length;
    document.getElementById("totalImages").innerText = totalImages;

    // Toggle Content Section
    document.getElementById("content-btn").hidden = true;
    document.getElementById("content-li").style.display = "block";
    document.getElementById("content-div").hidden = false;

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
    let iframeElement = document.getElementById('mainContent').contentDocument;

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
    document.getElementById("links-btn").hidden = true;
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
    let iframeElement = document.getElementById('mainContent').contentDocument;

    let brokenLinksCount = 0;
    let checkedLinks = [];
    let allLinks = iframeElement.links;

    for (let i = 0; i < allLinks.length; i++) {
        let linkElem = allLinks[i]
        let linkHref = linkElem.href;

        // Check if href has already been checked
        if (checkedLinks.includes(linkHref) !== true) {
            // Add href to checkedLinks
            checkedLinks.push(linkHref);

            // Check if broken link
            let brokenLinkServlet = inspectorUrl + "BrokenLinksServlet?url=" + linkHref;
            let linkJSON = await getRequest(brokenLinkServlet);
            let linkCode = linkJSON.code;
            let linkValid = linkJSON.valid;

            console.log(linkJSON);

            // Check code status
            if (linkCode === -1 || linkCode >= 400 || linkValid === false) {
                brokenLinksCount += 1;
            }
        } else {
            console.log("already checked: " + linkHref);
        }
    }

    // Toggle Broken Links Sectin
    document.getElementById("brokenLinks").innerText = brokenLinksCount;
    document.getElementById("brokenLinks-p").hidden = false;
    document.getElementById("brokenLinks-btn").hidden = true;


    // Remove overlay
    await overlay("removeOverlay", "");
}

async function runLanguageTool() {
    console.log("runLanguageTool");

    // Insert overlay
    await overlay("addOverlay", "Running Spell Check");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    let language = document.getElementById("languages_list").value;
    console.log("Language - " + language);

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentDocument;

    // Get all tagsText
    let tagsText = iframeElement.querySelectorAll('p, h1, h2');

    // Set errorsDict where key => error and value => [count, color]
    let errorsDict = {};

    // Iterate on every tag
    for (let i = 0; i < tagsText.length; i++) {

        // Set phrase from content array index
        let tagText = tagsText[i]

        // Get LangTool API Response
        const data = await getRequest("https://api.languagetoolplus.com/v2/check" + "?text=" + tagText.innerHTML.replace(/<\/?[^>]+(>|$)/g, "") + "&language=" + language);

        try {

            if (language === "auto") {
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

                    // Update error color on html
                    tagText.innerHTML = tagText.innerHTML.replace(error,
                            "<span class='spellErrors' title='Message: " + message + "&#010;" + "Replacements: " + replacements + "' style='color: black; background-color:" + color + ";font-weight:bold;'>" + error + "</span>"
                            );
                    ;

                    // Add/update key error on errorsDict
                    if (error in errorsDict) {
                        errorsDict[error][0] = errorsDict[error][0] + 1;
                    } else {
                        errorsDict[error] = [1, message, replacements];
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
    let spelling_errors = document.getElementById("spelling_errors")
    items.forEach(function (entry) {
        let error = entry[0];
        let count = entry[1][0];
        let message = entry[1][1];
        let replacements = entry[1][2];
        spelling_errors.innerHTML += "<li><a href='#' title='Message: " + message + "&#010;" + "Replacements: " + replacements + "'>" + error + " (" + count + "x)" + "</a></li>";
    });

    //  Add totalErrors to GENERALINFO
    document.getElementById("totalErrors").innerText = Object.keys(errorsDict).length;

    // Toggle Spelling Section
    document.getElementById("spelling-btn").hidden = true;
    document.getElementById("language-select-div").hidden = true;
    document.getElementById("spelling-li").style.display = "block";
    document.getElementById("spelling-div").hidden = false;

    // Remove overlay
    await overlay("removeOverlay", "");
}

async function runLighthouse() {
    console.log("runLighthouse");

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
    let lighthouseJson = await getRequest(inspectorUrl + "LighthouseServlet?" + "url=" + siteUrl + "&cats=" + categories + "&device=" + device);

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
        lighthouseReadMore.href = lighthouseURL + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
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

async function main() {
    // START
    console.log("----------------------");

    // Insert Content Information
    await addContentInfo();

    // Insert Links Information
    await addLinksInfo();

    // Run Spelling Report
    await runLanguageTool();

    console.log("----------------------");
}

