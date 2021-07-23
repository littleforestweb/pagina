// Page Inspector Chrome Extension
// LanguageTool && Google Lighthouse
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/07/22


async function getRequest(url) {
    try {
        const res = await fetch(url);
        if (url.includes("https://api.languagetoolplus.com/v2/check") || url.includes("https://inspector.littleforest.co.uk/InspectorWS/")) {
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
    iframeElement.id = "lfi_mainContent";
    // iframeElement.src = window.location.href;
    iframeElement.classList.add("lfi_iframe");
    document.body.appendChild(iframeElement);

    // Add base page HTML to iframe content
    let doc = document.getElementById('lfi_mainContent').contentWindow.document;
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

async function overlay(action, reportType) {
    if (action == "addOverlay") {
        // Insert overlay
        console.log("addOverlay")
        document.getElementById("lfi_overlay").style.display = "block";
        document.getElementById("lfi_reportType").innerText = reportType;
    } else if (action == "removeOverlay") {
        // Remove overlay
        console.log("removeOverlay")
        document.getElementById("lfi_overlay").style.display = "none";
    }
}

async function addContentInfo() {
    console.log("addContentInfo");

    // Get iframe element
    let iframeElement = document.getElementById('lfi_mainContent').contentDocument;

    //  Add totalImages to GENERALINFO
    let totalImages = iframeElement.getElementsByTagName("img").length;
    document.getElementById("lfi_totalImages").innerText = totalImages;
}

async function addLinksInfo() {
    console.log("addLinksInfo");

    // Insert overlay
    await overlay("addOverlay", "Links");

    // Get iframe element
    let iframeElement = document.getElementById('lfi_mainContent').contentDocument;

    // Set Bwooken links counter
    let brokenLinksCount = 0;

    //  Get links information
    let totalLinks = []; let extLinks = []; let intLinks = []; let allLinks = iframeElement.links;
    for (let i = 0; i < allLinks.length; i++) {
        let linkElem = allLinks[i]

        // Total | Internal || External
        totalLinks.push(linkElem.href);
        if (linkElem.href.includes(window.location.href)) { intLinks.push(linkElem.href); } else { extLinks.push(linkElem.href); }

        // Check if broken link
        let brokenLinkServlet = "https://inspector.littleforest.co.uk/InspectorWS/BrokenLinksServlet?url=" + linkElem.href;
        let linkJSON = await getRequest(brokenLinkServlet);
        let linkCode = linkJSON.code;
        let linkValid = linkJSON.valid;

        // Check code status
        if (linkCode === -1 || linkCode >= 400 || linkValid === false) {
            console.log(linkJSON);
            brokenLinksCount += 1;
        }
    }

    // Add Link information to sidebar
    document.getElementById("lfi_totalLinks").innerText = totalLinks.length;
    document.getElementById("lfi_extLinks").innerText = extLinks.length;
    document.getElementById("lfi_intLinks").innerText = intLinks.length;
    document.getElementById("lfi_brokenLinks").innerText = brokenLinksCount;

    // Remove overlay
    await overlay("removeOverlay", "");
}

async function runLanguageTool() {
    console.log("runLanguageTool");

    // Insert overlay
    await overlay("addOverlay", "Spelling");

    let language = document.getElementById("lfi_languages_list").value;
    console.log("Language - " + language);

    // Get iframe element
    let iframeElement = document.getElementById('lfi_mainContent').contentDocument;

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
                document.getElementById("lfi_detectedLanguage").innerText = detectedLanguage + " (Auto) ";
            } else {
                // Get detected language and confidence
                let detectedLanguage = data.language.name;
                document.getElementById("lfi_detectedLanguage").innerText = detectedLanguage;
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
                        "<span class='lfi_spellErrors' title='Message: " + message + "&#010;" + "Replacements: " + replacements + "' style='color: black; background-color:" + color + ";font-weight:bold;'>" + error + "</span>"
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
    let lfi_spelling_errors = document.getElementById("lfi_spelling_errors")
    items.forEach(function (entry) {
        let error = entry[0]; let count = entry[1][0]; let message = entry[1][1]; let replacements = entry[1][2];
        lfi_spelling_errors.innerHTML += "<li><a href='#' title='Message: " + message + "&#010;" + "Replacements: " + replacements + "'>" + error + " (" + count + "x)" + "</a></li>";
    });

    //  Add lfi_totalErrors to GENERALINFO
    document.getElementById("lfi_totalErrors").innerText = Object.keys(errorsDict).length;

    // Remove overlay
    await overlay("removeOverlay", "");
}

async function resetSpell() {
    console.log("resetSpell");

    // Clear all Spelling Errors in iframe
    let doc = document.getElementById('lfi_mainContent').contentWindow.document;
    let spellErrors = doc.getElementsByClassName("lfi_spellErrors");
    for (var errorIdx = 0; errorIdx < spellErrors.length; errorIdx++) {
        let spellElem = spellErrors[errorIdx];
        spellElem.removeAttribute("title");
        spellElem.removeAttribute("style");
    }

    // Clear all Spelling Errors from sidebar
    lfi_spelling_errors = document.getElementById("lfi_spelling_errors").innerHTML = "";
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
    if (cat_performance) { categories += "performance,"; }
    if (cat_pwa) { categories += "pwa,"; }
    if (cat_bp) { categories += "best-practices,"; }
    if (cat_accessibility) { categories += "accessibility,"; }
    if (cat_seo) { categories += "seo,"; }

    // Check if at least one categories is selected
    let lfi_lighthouse_info = document.getElementById("lfi_lighthouse_info");
    if (categories == "") {
        lfi_lighthouse_info.innerHTML = "<li>Please select at least one categorie</li>";
        return;
    } else {
        categories = categories.slice(0, -1);
    }

    // Insert overlay
    await overlay("addOverlay", "Lighthouse");

    // Get selected device
    let device;
    let device_mobile = document.getElementById("dev_mobile");
    let device_desktop = document.getElementById("dev_desktop");
    if (device_mobile.checked) { device = device_mobile.value; } else if (device_desktop.checked) { device = device_desktop.value; }

    // Get siteUrl
    let siteUrl = window.location.href;
    // let siteUrl = "https://littleforest.co.uk";

    console.log("siteUrl: " + siteUrl);
    console.log("Categories: " + categories);
    console.log("Device: " + device);

    // Get lighthouseJson
    let lighthouseURL = "https://inspector.littleforest.co.uk/InspectorWS/LighthouseServlet?"
    let lighthouseJson = await getRequest(lighthouseURL + "url=" + siteUrl + "&cats=" + categories + "&device=" + device);
    console.log(lighthouseJson);

    try {
        // Iterate over every Category and set the Tittle and Score
        categories.split(",").forEach(cat => {
            let catScore = lighthouseJson["categories"][cat]["score"] * 100;
            let catTitle = lighthouseJson["categories"][cat]["title"];
            lfi_lighthouse_info.innerHTML += "<li>" + catTitle + " - " + catScore + " % </li > ";
        })

        // Add Read More -> Open the HTML File
        lfi_lighthouse_info.innerHTML += "<li><a id='lighthouseReadMore' href='#'><b>" + "Read More" + "</b></a></li>";
        let lighthouseReadMore = document.getElementById("lighthouseReadMore");
        lighthouseReadMore.target = "_blank";
        lighthouseReadMore.href = lighthouseURL + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
        document.getElementById("lfi_lighthouse-section").removeAttribute("hidden");
    } catch (Ex) {
        lfi_lighthouse_info.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.<br>You can try refreshing the page and retry.</li>";
    }

    // Hide Lighthouse Button
    document.getElementById("lfi_runLighthouse").hidden = true;

    // Toggle Lighthouse Section
    document.getElementById("lfi_lighthouse-li").style.display = "block";

    // Remove overlay
    await overlay("removeOverlay", "");
}


// MAIN
console.clear();

(async function () {
    // START
    console.log("Start Inject.js");

    // Check if the script has already been injected
    if (document.getElementById("lfi_mainContent")) {
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

    // // Insert Content Information
    // await addContentInfo();

    // // Insert Links Information
    // await addLinksInfo();

    // // Run LanguageTool
    // await runLanguageTool();
})();