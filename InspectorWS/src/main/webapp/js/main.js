/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */


// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //


// const inspectorUrl = "https://inspector.littleforest.co.uk/InspectorWS";
// const inspectorUrl = "https://inspector.littleforest.co.uk/TestWS";
const inspectorUrl = "http://localhost:8080/InspectorWS";
const nameWS = inspectorUrl.split("/")[3] + "/";
const languageToolPost = "/" + nameWS + "LanguageTool";
const lighthousePost = "/" + nameWS + "Lighthouse";
const linksPost = "/" + nameWS + "Links";

let counter = 0;
let myTimmer = setInterval(myTimer, 1000);


// ------------------------------------- AUX FUNCTIONS ------------------------------------- //


async function myTimer() {
    // Get siteUrl
    let siteUrl = await getSiteUrl();
    if (siteUrl === "") {
        return;
    }

    try {
        // Get Iframe
        let iframeElement = document.getElementById('mainContent');
        let html = iframeElement.contentWindow.document.documentElement.outerHTML;

        // Check if HTML Content is valid
        if (html.length <= 1000) {
            if (counter === 10) {

                // Get iframe element
                iframeElement = iframeElement.contentWindow.document;
                iframeElement.open();
                iframeElement.write("");
                iframeElement.close();

                // Set Error Message in MODAL
                await setErrorModal("", "Failed to load <b>" + siteUrl + "</b> (Timeout)");

                // Remove overlay
                await overlay("removeOverlay", "", "")

                // Enable Actions
                await enableDisableActions("enable");

                // Stop Interval
                clearInterval(myTimmer);
            }
        } else {
            // Stop Interval
            clearInterval(myTimmer);
        }

        // Increment counter
        counter = counter + 1
    } catch (Ex) {
        // console.log(Ex);
    }

}

async function setIframe() {
    console.log("setIframe");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Add overlay
    await overlay("addOverlay", "Loading page", "");

    // Get iframe element
    let iframeElement = document.getElementById('mainContent');

    // Set iframe src to siteUrl
    iframeElement.src = siteUrl;

    // Add EventListener on load
    iframeElement.addEventListener("load", main);
}

async function getSiteUrl() {
    // Return siteUrl
    return document.getElementById("searchURL").value;
}

async function overlay(action, message, sndMessage) {
    if (action === "addOverlay") {
        // Disable goBtn
        await enableDisableActions("disable");

        // Insert overlay
        console.log("addOverlay")
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlayMessage").innerText = message;
        document.getElementById("overlaySndMessage").innerHTML = sndMessage + "</br>";
        document.getElementById("overlayProgress").innerText = "";
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
        // Enable searchURL
        document.getElementById("searchURL").disabled = false;
        // Enable View Switch
        document.getElementById("HTMLBtn").disabled = false;
        document.getElementById("LighthouseViewBtn").disabled = false;
        // Enable Device View Switch
        document.getElementById("desktopView").disabled = false;
        document.getElementById("mobileView").disabled = false;
        // Enable languages_list
        document.getElementById("languages_list").disabled = false;
        // Enable Lighthouse Btn
        document.getElementById("lighthouse-btn").disabled = false;
        // Enable Links Btn
        document.getElementById("links-btn").disabled = false;
        // Enable Dictionary Btn
        document.getElementById("dictionaryModalBtn").disabled = false;
        // Enable Links Btn
        document.getElementById("linksModalBtn").disabled = false;
        // Enable Re-Run Spelling Btn
        document.getElementById("rerunSpelling").disabled = false;
    } else {
        // Disable searchURL
        document.getElementById("searchURL").disabled = true;
        // Disable View Switch
        document.getElementById("HTMLBtn").disabled = true;
        document.getElementById("LighthouseViewBtn").disabled = true;
        // Disable Device View Switch
        document.getElementById("desktopView").disabled = true;
        document.getElementById("mobileView").disabled = true;
        // Disable languages_list
        document.getElementById("languages_list").disabled = true;
        // Disable Lighthouse Btn
        document.getElementById("lighthouse-btn").disabled = true;
        // Disable Links Btn
        document.getElementById("links-btn").disabled = true;
        // Disable Dictionary Btn
        document.getElementById("dictionaryModalBtn").disabled = true;
        // Enable Links Btn
        document.getElementById("linksModalBtn").disabled = true;
        // Disable Re-Run Spelling Btn
        document.getElementById("rerunSpelling").disabled = true;
    }
}

async function resetPage() {
    // Remove overlay
    await overlay("addOverlay", "Loading", "")

    window.location.href = inspectorUrl;
}

async function gotoNewPage() {
    // Get siteUrl
    let siteUrl = await getSiteUrl();

    if (siteUrl === "") {
        // Set Error Message in MODAL
        await setErrorModal("", "Please insert a valid URL");
    } else {
        // Get selected Language
        let language = document.getElementById("languages_list").value;

        // Launch new Inspector
        window.location.href = inspectorUrl + "/Inspector?url=" + siteUrl + "&lang=" + language;
    }
}

async function toggleView(view) {
    if (view === "HTML") {
        document.getElementById("mainContent").hidden = true;
        document.getElementById("mainCode").hidden = false;
        document.getElementById("mainLighthouse").hidden = true;
        document.getElementById("HTMLBtn").classList.add("active");
        document.getElementById("LighthouseViewBtn").classList.remove("active");
        document.getElementById("mobileView").classList.remove("active");
        document.getElementById("desktopView").classList.remove("active");
    } else if (view === "Desktop") {
        document.getElementById("mainContent").hidden = false;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainLighthouse").hidden = true;
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("LighthouseViewBtn").classList.remove("active");
        document.getElementById("mobileView").classList.remove("active");
        document.getElementById("desktopView").classList.add("active");
        document.getElementById("mainContent").classList.remove("iframePageMobile")
    } else if (view === "Mobile") {
        document.getElementById("mainContent").hidden = false;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainLighthouse").hidden = true;
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("LighthouseViewBtn").classList.remove("active");
        document.getElementById("mobileView").classList.add("active");
        document.getElementById("desktopView").classList.remove("active");
        document.getElementById("mainContent").classList.add("iframePageMobile")
    } else if (view === "lighthouseReport") {
        document.getElementById("mainContent").hidden = true;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainLighthouse").hidden = false;
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("LighthouseViewBtn").classList.add("active");
        document.getElementById("mobileView").classList.remove("active");
        document.getElementById("desktopView").classList.remove("active");
    } else {
    }
}

async function setErrorModal(title, message) {
    document.getElementById("modalErrorTitle").innerHTML = ((title !== "") ? title : "Something went wrong!");
    document.getElementById("modalErrorBody").innerHTML = message;

    let checkExist = setInterval(function () {
        let btn = document.getElementById("errorModalBtn");
        if (btn.hidden === true && btn.innerText === "Error Modal") {
            btn.click();
            clearInterval(checkExist);
        }
    }, 100);
}

async function clearSpelling() {
    console.log("clearSpelling");

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;

    // Get all the spellerror elems
    let errors = iframeElement.getElementsByTagName("spellerror");

    // Remove all the elems and keep the innerText
    while (errors.length) {
        let parent = errors[0].parentNode;
        while (errors[0].firstChild) {
            parent.insertBefore(errors[0].firstChild, errors[0]);
        }
        parent.removeChild(errors[0]);
    }

    // Clear Sidebar Spelling Section
    document.getElementById("spelling-div").hidden = true;
    document.getElementById("totalErrors").innerText = 0;
    document.getElementById("spelling_errors").innerHTML = "";
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

async function setDictionary(cname, cvalue, exdays) {
    // Create Array from cvalue string
    cvalue = cvalue.join(",");

    // Check if the String is Empty and Only has one element
    if (cvalue.length === 1 && cvalue[0] === "") {
        return;
    }

    // Set Expire Date
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();

    // Save Cookie
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

async function getDictionary(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    let dict = [];
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            dict = c.substring(name.length, c.length).split(",");
        }
    }

    // Remove empty string from Dictionary
    dict = dict.filter(function (value, index, arr) {
        return value !== "";
    });

    return dict;
}

async function addDictionary(word) {
    console.log("addDictionary - " + word)

    if (word === "") {
        // Get inserted word
        word = document.getElementById("dictionaryWord").value;
    }

    // Get existing Dictionary
    let dict = await getDictionary("dictionary");

    // Check if word is already on Dictionary
    if (dict.includes(word)) {
        document.getElementById("dictionaryWord").value = "";
        document.getElementById("dictionaryWord").placeholder = "\"" + word + "\" already on dictionary.";
        return;
    }

    // Remove from Spelling List
    let spelling_errors = document.getElementById("spelling_errors").childNodes;
    for (let i = 0; i < spelling_errors.length; i++) {
        let elem = spelling_errors[i];
        if (elem.innerText.split(" (")[0] === word) {
            elem.remove();
            break;
        }
    }

    //  Update totalErrors to GENERALINFO
    document.getElementById("totalErrors").innerText = spelling_errors.length.toString();

    // Set new Dictionary
    if (dict.length === 0) {
        dict = [word];
    } else {
        dict.push(word);
    }

    // Update Cookie with the new Dictionary
    await setDictionary("dictionary", dict, 180);

    // Reload Dictionary List
    await loadDictionaryList();
}

async function loadDictionaryList() {
    // Get existing Dictionary
    let dict = (await getDictionary("dictionary"));

    // Get Dictionary List
    let dictList = document.getElementById("dictionaryList");
    dictList.innerHTML = "";

    // Set number of error on modal title
    let totalDictWords = ((dict.length === 1) ? dict.length + " word" : dict.length + " words")
    document.getElementById("totalDictWords").innerText = totalDictWords;

    // Check if the String is Empty and Only has one element
    if (dict.length === 0) {
        document.getElementById("dictionaryWord").value = "";
        document.getElementById("dictionaryWord").placeholder = "Insert your first word.";
        return;
    }

    // Add Inserted Word to List
    dict.forEach(function (word) {
        dictList.innerHTML = dictList.innerHTML + "<label class='list-group-item'><span>" + word + "</span><a href='#' onclick='removeDictionary(\"" + word + "\")' class='removeDictionary'>Remove</a></label>";
    });
}

async function removeDictionary(word) {
    // Get existing Dictionary
    let dict = await getDictionary("dictionary");

    // Remove word from Dictionary
    dict = dict.filter(function (value, index, arr) {
        return value !== word;
    });

    // Update Cookie with the new Dictionary
    await setDictionary("dictionary", dict, 180);

    // Reload Dictionary List
    await loadDictionaryList();
}

async function toggleLinkView(view) {
    if (view === "totalLinks") {
        document.getElementById("totalLinksViewBtn").classList.add("active");
        document.getElementById("intLinksViewBtn").classList.remove("active");
        document.getElementById("extLinksViewBtn").classList.remove("active");
        document.getElementById("brokenLinksViewBtn").classList.remove("active");

        document.getElementById("totalLinksList").hidden = false;
        document.getElementById("intLinksList").hidden = true;
        document.getElementById("extLinksList").hidden = true;
        document.getElementById("brokenLinksList").hidden = true;

    } else if (view === "intLinks") {
        document.getElementById("totalLinksViewBtn").classList.remove("active");
        document.getElementById("intLinksViewBtn").classList.add("active");
        document.getElementById("extLinksViewBtn").classList.remove("active");
        document.getElementById("brokenLinksViewBtn").classList.remove("active");

        document.getElementById("totalLinksList").hidden = true;
        document.getElementById("intLinksList").hidden = false;
        document.getElementById("extLinksList").hidden = true;
        document.getElementById("brokenLinksList").hidden = true;
    } else if (view === "extLinks") {
        document.getElementById("totalLinksViewBtn").classList.remove("active");
        document.getElementById("intLinksViewBtn").classList.remove("active");
        document.getElementById("extLinksViewBtn").classList.add("active");
        document.getElementById("brokenLinksViewBtn").classList.remove("active");

        document.getElementById("totalLinksList").hidden = true;
        document.getElementById("intLinksList").hidden = true;
        document.getElementById("extLinksList").hidden = false;
        document.getElementById("brokenLinksList").hidden = true;
    } else if (view === "brokenLinks") {
        document.getElementById("totalLinksViewBtn").classList.remove("active");
        document.getElementById("intLinksViewBtn").classList.remove("active");
        document.getElementById("extLinksViewBtn").classList.remove("active");
        document.getElementById("brokenLinksViewBtn").classList.add("active");

        document.getElementById("totalLinksList").hidden = true;
        document.getElementById("intLinksList").hidden = true;
        document.getElementById("extLinksList").hidden = true;
        document.getElementById("brokenLinksList").hidden = false;
    }
}


// ------------------------------------- MAIN FUNCTIONS ------------------------------------- //


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
            document.getElementById("overlaySndMessage").innerHTML = "</br>Detected Language: " + valueText + "</br>";
            document.getElementById("detectedLanguage").innerHTML = "(Auto-Detected)";
        } else {
            langCode = "en-GB";
            let valueText = languages_list.options[langValues.indexOf(langCode)].text;
            document.getElementById("overlaySndMessage").innerHTML = "</br>Couldn't detect langauage.</br> Defaulting to : " + valueText + "</br>";
            document.getElementById("detectedLanguage").innerHTML = "(Default)";
        }
    } else {
        let valueText = languages_list.options[langValues.indexOf(langCode)].text;
        document.getElementById("overlaySndMessage").innerHTML = "</br>Selected language: " + valueText + "</br>";
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
            let spellCheckJSON = await $.post(languageToolPost, {
                content: tagElem,
                langCode: langCode
            }, function (result) {
                return result;
            });
            // console.log(spellCheckJSON);

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

        // Update secondary message on Overlay
        document.getElementById("overlayProgress").innerHTML = "Found " + Object.keys(errorsDict).length + " spelling occurrences </br>";

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

        // Add errors to Sidebar
        let spelling_errors = document.getElementById("spelling_errors");
        spelling_errors.innerHTML += "<li><a href=javascript:gotoSpellError('spell_" + error + "');><span class='hoverMessage'>" + error + " (" + count + "x)" + "<span class='msgPopup'>" + message + "<br> Replacements: " + replacements + "</span></span></a></li>";
    }

    // Sort the array based on the length of the error
    let sortedDict = Object.keys(errorsDict).map(function (key) {
        return [key, errorsDict[key]];
    }).sort(function (first, second) {
        return second[0].length - first[0].length;
    });

    for (let i = 0; i < sortedDict.length; i++) {
        let entry = sortedDict[i];
        let error = entry[0];
        let color = entry[1][3];

        // Highlight Spelling Errors on Page View
        findAndReplaceDOMText(iframeElement.body, {
            preset: 'prose',
            find: error,
            wrap: 'spellError',
            wrapClass: "shiny_" + color,
            wrapId: "spell_" + error
        });

        // Highlight Spelling Errors on Code View
        findAndReplaceDOMText(iframeCode.getElementById("htmlCode"), {
            preset: 'prose',
            find: error,
            wrap: 'spellError',
            wrapClass: "shiny_" + color,
            wrapId: "spell_" + error
        });
    }


    //  Add totalErrors to GENERALINFO
    document.getElementById("totalErrors").innerText = Object.keys(errorsDict).length.toString();

    // If there is no spell errors add "Good Job!"
    if (Object.keys(errorsDict).length === 0) {
        document.getElementById("spellErrors-p").innerHTML = document.getElementById("spellErrors-p").innerHTML + "<br><b>Good Job!<br>"
    }

    // Toggle Spelling Section
    document.getElementById("spelling-div").style.display = "block";
    document.getElementById("spelling-div").hidden = false;
    document.getElementById("spelling-li").hidden = false;


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
        let lighthouseJson = await $.post(lighthousePost, {
            url: siteUrl,
            device: device
        }, function (result) {
            return result;
        });
        console.log(lighthouseJson);

        // Iterate over every Category and set the Tittle and Score
        let categories = ["performance", "accessibility", "best-practices", "seo", "pwa"];
        categories.forEach(cat => {
            let catScore = Math.round(lighthouseJson["categories"][cat]["score"] * 100);
            let catTitle = lighthouseJson["categories"][cat]["title"];
            lighthouse_info.innerHTML += "<li>" + catTitle + " - " + catScore + " % </li > ";
        });

        // Toggle Lighthouse Section
        document.getElementById("mainLighthouse").src = inspectorUrl + "/Lighthouse?" + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
        document.getElementById("lighthouse-section").removeAttribute("hidden");
        document.getElementById("lighthouse-btn").hidden = true;
        document.getElementById("lighthouse-div").style.display = "block";
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

async function runLinks() {
    console.log("addLinksInfo");

    // Insert overlay
    await overlay("addOverlay", "Running Links Report", "");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Set links counter
    let totalLinksCount = 0;
    let extLinksCount = 0;
    let intLinksCount = 0;
    let brokenLinksCount = 0;

    // Check if broken link
    let linkJSON = await $.post(linksPost, {
        url: siteUrl,
    }, function (result) {
        return result;
    });

    // Iterate over every link
    let linksInfo = linkJSON["linksInfo"];
    for (let i = 0; i < linksInfo.length; i++) {
        Object.entries(linksInfo[i]).forEach(([key, value]) => {
            let url = key;
            let status = value[0];
            let origin = value[1];
            // url = url.length > 100 ? url.substring(0, 100) + "..." : url;

            // Set links counters
            totalLinksCount += 1;
            if (origin === "External") {
                extLinksCount += 1;
            } else if (origin === "Internal") {
                intLinksCount += 1;
            }
            let statusColor = "green";
            if (status === "404" || status === "-1") {
                brokenLinksCount += 1;
                statusColor = "red";
            }

            // Add line to table
            document.getElementById("linksTableBody").innerHTML += "<tr><td><a target='_blank' href='" + url + "'>" + url + "</a></td><td style='white-space:normal; text-align: center;'>" + origin + "</td><td style='text-align: center;'><span style='padding: 4px; background-color: " + statusColor + ";'>" + status + "</span></td></tr>";

        });
    }

    $('#linksTable').DataTable({
        dom: 'Blfrtip',
        buttons: [{text: 'Export', extend: 'csv', filename: 'Links Report'}],
        pageLength: 10,
        "aLengthMenu": [[10, 50, 100], [10, 50, 100]],
        "oLanguage": {"sSearch": "Filter:", "emptyTable": "loading data...please wait..."}
    });

    // Set Links Counters on sidebar
    document.getElementById("totalLinks").innerText = totalLinksCount;
    document.getElementById("extLinks").innerText = extLinksCount;
    document.getElementById("intLinks").innerText = intLinksCount;
    document.getElementById("brokenLinks").innerText = brokenLinksCount;

    // Show Broken Links Message
    document.getElementById("brokenLinks-p").hidden = false;

    // Remove links-btn
    document.getElementById("links-btn").hidden = true;

    // Toggle Links Section
    document.getElementById("links-div").style.display = "block";
    document.getElementById("links-div").hidden = false;
    document.getElementById("linksModalBtn").hidden = false;

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
    let iframeCSS = inspectorUrl + "/css/iframe.css";
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
