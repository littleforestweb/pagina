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
const accessibilityPost = "/" + nameWS + "Accessibility";
const cookiesPost = "/" + nameWS + "Cookies";
const wappalyzerPost = "/" + nameWS + "Wappalyzer";
let counter = 0;
let myTimmer = setInterval(myTimer, 1000);


// ------------------------------------- AUX FUNCTIONS ------------------------------------- //


$("#searchURL").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        gotoNewPage();
    }
});

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
                await setErrorModal("", "Failed to load <b>" + siteUrl + "</b> (Timeout)</br>Plase check the URL.");

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

        // Toggle Desktop View
        await toggleView("Desktop");

        // Insert overlay
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlayMessage").innerText = message;
        document.getElementById("overlaySndMessage").innerHTML = sndMessage + "</br>";
        document.getElementById("overlayProgress").innerText = "";
    } else if (action === "removeOverlay") {
        // Remove overlay
        document.getElementById("overlay").style.display = "none";

        // Enable goBtn
        await enableDisableActions("enable");
    }
}

async function enableDisableActions(action) {

    // Set all elemId
    let elemId = ["searchURL", "HTMLBtn", "ReportsViewBtn", "desktopView", "mobileView", "languages-list", "spelling-btn",
        "lighthouse-btn", "links-btn", "accessibility-btn", "WCAG-level-list", "cookies-btn",
        "technologies-btn"];

    // Set disabled status
    elemId.forEach(function (id) {
        document.getElementById(id).disabled = action !== "enable";
    });
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
        let language = document.getElementById("languages-list").value;

        // Launch new Inspector
        window.location.href = inspectorUrl + "/Inspector?url=" + siteUrl + "&lang=" + language;
    }
}

async function toggleView(view) {
    if (view === "HTML") {
        document.getElementById("mainContent").hidden = true;
        document.getElementById("mainCode").hidden = false;
        document.getElementById("mainReports").hidden = true;
        document.getElementById("HTMLBtn").classList.add("active");
        document.getElementById("ReportsViewBtn").classList.remove("active");
        document.getElementById("mobileView").classList.remove("active");
        document.getElementById("desktopView").classList.remove("active");
    } else if (view === "Desktop") {
        document.getElementById("mainContent").hidden = false;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainReports").hidden = true;
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("ReportsViewBtn").classList.remove("active");
        document.getElementById("mobileView").classList.remove("active");
        document.getElementById("desktopView").classList.add("active");
        document.getElementById("mainContent").classList.remove("iframePageMobile")
    } else if (view === "Mobile") {
        document.getElementById("mainContent").hidden = false;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainReports").hidden = true;
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("ReportsViewBtn").classList.remove("active");
        document.getElementById("mobileView").classList.add("active");
        document.getElementById("desktopView").classList.remove("active");
        document.getElementById("mainContent").classList.add("iframePageMobile")
    } else if (view === "Reports") {
        document.getElementById("mainContent").hidden = true;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainReports").hidden = false;
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("ReportsViewBtn").classList.add("active");
        document.getElementById("mobileView").classList.remove("active");
        document.getElementById("desktopView").classList.remove("active");
    } else {
    }
}

async function setErrorModal(title, message) {
    document.getElementById("modalErrorTitle").innerHTML = ((title !== "") ? title : "Something went wrong!");
    document.getElementById("modalErrorBody").innerHTML = message;
    let errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
}

async function toggleSidebar(section) {
    if (section === "spelling") {
        let spellingDiv = document.getElementById("spelling-main");
        spellingDiv.hidden = !spellingDiv.hidden;
    } else if (section === "lighthouse") {
        let lighthouseDiv = document.getElementById("lighthouse-main");
        lighthouseDiv.hidden = !lighthouseDiv.hidden;
    } else if (section === "links") {
        let linksDiv = document.getElementById("links-main");
        linksDiv.hidden = !linksDiv.hidden;
    } else if (section === "accessibility") {
        let accessibilityDiv = document.getElementById("accessibility-main");
        accessibilityDiv.hidden = !accessibilityDiv.hidden;
    } else if (section === "cookies") {
        let cookiesDiv = document.getElementById("cookies-main");
        cookiesDiv.hidden = !cookiesDiv.hidden;
    } else if (section === "technologies") {
        let technologiesDiv = document.getElementById("technologies-main");
        technologiesDiv.hidden = !technologiesDiv.hidden;
    }
}


// ------------------------------------- SPELLING REPORT ------------------------------------- //


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

async function loadDictionaryList() {
    // Get existing Dictionary
    let dict = await getDictionary("dictionary");
    let dataset = [];

    // Set dataset
    if (dict.length !== 0) {
        dict.forEach(function (error) {
            dataset.push([error, error]);
        });
    }

    // Initialize Dictionary Table
    $('#dictionaryTable').DataTable({
        dom: 'Blfrtip',
        buttons: [{text: 'Export', extend: 'csv', filename: 'Spelling Errors'}],
        paginate: false,
        "oLanguage": {"sSearch": "Filter:", "emptyTable": "loading data...please wait..."},
        "order": [[0, "desc"]],
        data: dataset,
        "autoWidth": false,
        "columnDefs": [
            {
                "width": "50%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "50%", "targets": 1, "render": function (data, type, row) {
                    return "<a href='#' class='removeDictionary' onclick='removeDictionary(\"" + data + "\")'>Remove from Dictionary</a>";
                },
            }
        ]
    });
}

async function addDictionary(row) {
    console.log("addDictionary - " + row);

    // Get error from row
    let error = row.split(",")[0];

    // Remove from Errors Table
    let errorsTable = $('#errorsTable').DataTable();
    $('#errorsTable tbody').on('click', '.addDictionary', function () {
        errorsTable.row($(this).parents('tr')).remove().draw();
    });

    // Add to Dictionary Table
    let dictionaryTable = $('#dictionaryTable').DataTable();
    dictionaryTable.row.add(["<span>" + error + "</span>", error]).draw(false);

    // Remove from Spelling List
    let spelling_errors = document.getElementById("spelling-errors").childNodes;
    for (let i = 0; i < spelling_errors.length; i++) {
        let elem = spelling_errors[i];
        if (elem.innerText.split(" (")[0] === error) {
            elem.remove();
            break;
        }
    }

    //  Update totalErrors to GENERALINFO
    document.getElementById("spelling-total-errors").innerText = spelling_errors.length.toString();

    // Remove spellError from iframe and htmlCode
    let iframeElement = document.getElementById('mainContent').contentWindow.document;
    let iframeCode = document.getElementById('mainCode').contentWindow.document;
    let spellErrors = [...iframeElement.querySelectorAll("spellerror"), ...iframeCode.querySelectorAll("spellerror")];
    spellErrors.forEach(function (elem) {
        if (elem.innerText === error) {
            let parent = elem.parentNode;
            while (elem.firstChild) parent.insertBefore(elem.firstChild, elem);
            parent.removeChild(elem);
        }

    });

    // Get existing Dictionary
    let dict = await getDictionary("dictionary");

    // Set new Dictionary
    if (dict.length === 0) {
        dict = [error];
    } else {
        dict.push(error);
    }

    // Update Cookie with the new Dictionary
    await setDictionary("dictionary", dict, 180);
}

async function removeDictionary(row) {
    console.log("removeDictionary - " + row);

    // Get error from row
    let error = row.split(",")[0];

    // Get existing Dictionary
    let dict = await getDictionary("dictionary");

    // Remove word from Dictionary
    dict = dict.filter(function (value, index, arr) {
        return value !== error;
    });

    // Update Cookie with the new Dictionary
    await setDictionary("dictionary", dict, 180);

    // Remove from Dictionary Table
    let table = $('#dictionaryTable').DataTable();
    $('#dictionaryTable tbody').on('click', '.removeDictionary', function () {
        table.row($(this).parents('tr')).remove().draw();
    });
}

async function toggleSpellView(view) {
    if (view === "dictionaryTableDiv") {
        document.getElementById("dictionaryTableViewBtn").classList.add("active");
        document.getElementById("errorsTableViewBtn").classList.remove("active");
        document.getElementById("dictionaryTableDiv").hidden = false;
        document.getElementById("errorsTableDiv").hidden = true;
    } else if (view === "errorsTableDiv") {
        document.getElementById("dictionaryTableViewBtn").classList.remove("active");
        document.getElementById("errorsTableViewBtn").classList.add("active");
        document.getElementById("dictionaryTableDiv").hidden = true;
        document.getElementById("errorsTableDiv").hidden = false;
    }
}

async function rerunSpelling() {
    // Remove errors from Spelling List
    document.getElementById("spelling-errors").innerHTML = "";

    // Clear spelling total p"
    document.getElementById("spelling-total-p").innerHTML = "Found <span id=\"spelling-total-errors\">0</span> occurrence(s)."

    // Toggle Spelling Section
    document.getElementById("spelling-info").hidden = true;

    // Remove spellError from iframe and htmlCode
    let iframeElement = document.getElementById('mainContent').contentWindow.document;
    let iframeCode = document.getElementById('mainCode').contentWindow.document;
    let spellErrors = [...iframeElement.querySelectorAll("spellerror"), ...iframeCode.querySelectorAll("spellerror")];
    spellErrors.forEach(function (elem) {
        let parent = elem.parentNode;
        while (elem.firstChild) parent.insertBefore(elem.firstChild, elem);
        parent.removeChild(elem);

    });

    // Clear table
    $('#errorsTable').DataTable().clear().draw();
    $('#errorsTable').DataTable().destroy();

    // Run Spelling again
    await runLanguageTool();
}


// ------------------------------------- ACCESSIBILITY REPORT ------------------------------------- //


async function gotoLighthouseCat(categorie) {
    console.log("Goto " + categorie);

    // Get iframe element
    let mainLighthouse = document.getElementById("mainLighthouse").contentWindow;

    // Scroll to spell Errors in htmlView and htmlCode
    mainLighthouse.document.getElementById(categorie).scrollIntoView();
}

// ------------------------------------- ACCESSIBILITY REPORT ------------------------------------- //


async function toggleAccessibilityView(view) {
    if (view === "snifferErrorsTableDiv") {
        document.getElementById("snifferErrorsTableViewBtn").classList.add("active");
        document.getElementById("snifferNoticesTableViewBtn").classList.remove("active");
        document.getElementById("snifferWarningsTableViewBtn").classList.remove("active");
        document.getElementById("snifferErrorsTableDiv").hidden = false;
        document.getElementById("snifferNoticesTableDiv").hidden = true;
        document.getElementById("snifferWarningsTableDiv").hidden = true;
    } else if (view === "snifferNoticesTableDiv") {
        document.getElementById("snifferErrorsTableViewBtn").classList.remove("active");
        document.getElementById("snifferNoticesTableViewBtn").classList.add("active");
        document.getElementById("snifferWarningsTableViewBtn").classList.remove("active");
        document.getElementById("snifferErrorsTableDiv").hidden = true;
        document.getElementById("snifferNoticesTableDiv").hidden = false;
        document.getElementById("snifferWarningsTableDiv").hidden = true;
    } else if (view === "snifferWarningsTableDiv") {
        document.getElementById("snifferErrorsTableViewBtn").classList.remove("active");
        document.getElementById("snifferNoticesTableViewBtn").classList.remove("active");
        document.getElementById("snifferWarningsTableViewBtn").classList.add("active");
        document.getElementById("snifferErrorsTableDiv").hidden = true;
        document.getElementById("snifferNoticesTableDiv").hidden = true;
        document.getElementById("snifferWarningsTableDiv").hidden = false;
    }
}


// ------------------------------------- MAIN FUNCTIONS ------------------------------------- //


async function runLanguageTool() {
    console.log("-------------------------");
    console.log("runLanguageTool");

    // Insert overlay
    await overlay("addOverlay", "Running Spell Check", "");

    // Get iframe element
    let iframeElement = document.getElementById('mainContent').contentWindow.document;

    // Get htmlCode
    let iframeCode = document.getElementById('mainCode').contentWindow.document;


    // Get all name from the langCodes
    let langValues = [];
    let languages_list = document.getElementById('languages-list');
    for (let i = 0; i < languages_list.options.length; i++) {
        langValues.push(languages_list.options[i].value);
    }

    // Get the selected lanaguage
    let langCode = document.getElementById("languages-list").value;
    // If is auto, try to detect the language from the lang attribute
    let detectedLang = iframeElement.documentElement.lang;
    if (langCode === "auto") {
        // If the full lang code is present on the list ("en-GB" not "en")
        if (langValues.includes(detectedLang)) {
            langCode = detectedLang;
            let valueText = languages_list.options[langValues.indexOf(langCode)].text;
            document.getElementById("overlaySndMessage").innerHTML = "</br>Detected Language: " + valueText + "</br>";
            document.getElementById("detectedLanguage").innerHTML = "(Auto-Detected)";
        } else {
            // Try to detect the general language, if the lang attribute has only two chars ("en")
            langCode = "en-GB";
            let generalDetect = false;
            for (let i = 0; i < langValues.length; i++) {
                // If detected general lang use the first variant on the list
                if (langValues[i].split("-")[0] === detectedLang) {
                    langCode = langValues[i];
                    let valueText = languages_list.options[langValues.indexOf(langCode)].text;
                    document.getElementById("overlaySndMessage").innerHTML = "</br>Detected general language: " + valueText.split(" ")[0] + "</br>Using: " + valueText + "</br>";
                    generalDetect = true;
                    break;
                }
            }
            // If it didn't find a general lang, default to en-GB
            if (!(generalDetect)) {
                let valueText = languages_list.options[langValues.indexOf(langCode)].text;
                document.getElementById("overlaySndMessage").innerHTML = "</br>Couldn't detect langauage.</br> Defaulting to : " + valueText + "</br>";
                document.getElementById("detectedLanguage").innerHTML = "(Default)";
            }
        }
    } else {
        // If the user selected a language, then just use that code
        let valueText = languages_list.options[langValues.indexOf(langCode)].text;
        document.getElementById("overlaySndMessage").innerHTML = "</br>Selected language: " + valueText + "</br>";
    }

    // Update the language-list with the language
    document.getElementById("languages-list").value = langCode;
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
                    let message = entry.message;

                    // Remove false-positive errors (three chars and whitespaces)
                    if (!(dict.includes(error)) && error.length >= 3 && !(/\s/g.test(error)) && message === "Possible spelling mistake found.") {

                        // Set message, replacements, color
                        let replacements = entry.replacements.map(reps => reps['value']).slice(0, 5).toString().replaceAll(",", ", ");
                        replacements = ((replacements === "") ? "None available" : replacements);

                        // Add key error on errorsDict
                        if (!(error in errorsDict)) {
                            errorsDict[error] = [message, replacements];
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

    // Sort the array based on the length of the error
    let sortedDict = Object.keys(errorsDict).map(function (key) {
        return [key, errorsDict[key]];
    }).sort(function (first, second) {
        return second[0].length - first[0].length;
    });

    for (let i = 0; i < sortedDict.length; i++) {
        let entry = sortedDict[i];
        let error = entry[0];

        // Highlight Spelling Errors on Page View
        findAndReplaceDOMText(iframeElement.body, {
            preset: 'prose',
            find: error,
            wrap: 'spellerror',
            wrapClass: "shiny_red",
            wrapId: "spell_" + error
        });

        // Highlight Spelling Errors on Code View
        findAndReplaceDOMText(iframeCode.getElementById("htmlCode"), {
            preset: 'prose',
            find: error,
            wrap: 'spellerror',
            wrapClass: "shiny_red",
            wrapId: "spell_" + error
        });
    }

    // Count how many spellerror per error
    Object.keys(errorsDict).forEach(function (entry) {
        let key = entry;
        let value = errorsDict[entry];
        let count = 0;
        let spellErrors = iframeElement.querySelectorAll("spellerror");
        for (let i = 0; i < spellErrors.length; i++) {
            let entry = spellErrors[i];
            if (entry.innerText === key) {
                count += 1;
            }
        }
        errorsDict[key] = [count, value[0], value[1]];
    });

    // Sort the array based on the count element
    let items = Object.keys(errorsDict).map(function (key) {
        return [key, errorsDict[key]];
    }).sort(function (first, second) {
        return second[1][0] - first[1][0];
    });

    let dataset = [];
    // Highlight Spelling Errors on Page and Code View
    // Add Spelling Errors to sidebar
    for (let i = 0; i < items.length; i++) {
        let entry = items[i];
        let error = entry[0];
        let count = entry[1][0];
        let message = entry[1][1];
        let replacements = entry[1][2];

        // Add to dataset
        dataset.push([error, replacements, message, count]);

        // Add errors to Sidebar
        let spelling_errors = document.getElementById("spelling-errors");
        spelling_errors.innerHTML += "<li><a href=javascript:gotoSpellError('spell_" + error + "');>" + error + " (" + count + "x)</a></li>";
    }

    // Initialize Errors Table
    $('#errorsTable').DataTable({
        dom: 'Blfrtip',
        buttons: [{text: 'Export', extend: 'csv', filename: 'Spelling Errors'}],
        // pageLength: 10,
        // "bLengthChange": false,
        paginate: false,
        "oLanguage": {"sSearch": "Filter:", "emptyTable": "loading data...please wait..."},
        "order": [[3, "desc"]],
        data: dataset,
        "autoWidth": false,
        "columnDefs": [
            {
                "width": "20%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "25%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "25%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "15%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "15%", "targets": 4, "render": function (data, type, row) {
                    return "<a href='#' class='addDictionary' onclick='addDictionary(\"" + row + "\")'>Add to Dictionary</a>";
                },
            }
        ]
    });

    //  Add totalErrors to GENERALINFO
    document.getElementById("spelling-total-errors").innerText = Object.keys(errorsDict).length.toString();

    // If there is no spell errors add "Good Job!"
    if (Object.keys(errorsDict).length === 0) {
        document.getElementById("spelling-total-p").innerHTML = document.getElementById("spelling-total-p").innerHTML + "<br><b>Good Job!<br>"
    }

    // Toggle Spelling Section
    document.getElementById("spelling-btn").hidden = true;
    document.getElementById("spelling-info").hidden = false;

    // Remove overlay
    await overlay("removeOverlay", "", "");

    // Enable Actions
    await enableDisableActions("enable");
}

async function runLighthouse() {
    console.log("-------------------------");
    console.log("runLighthouse");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Check if at least one categories is selected
    let lighthouse_info = document.getElementById("lighthouse-info");

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
            let catName = ((catTitle === "Progressive Web App") ? "pwa" : catTitle.toLowerCase().replaceAll(" ", "-"));
            lighthouse_info.innerHTML += "<li><a href=javascript:gotoLighthouseCat('" + catName + "');>" + catTitle + " - " + catScore + " % </a></li>";
        });

        // Toggle Lighthouse Section
        document.getElementById("mainLighthouse").src = inspectorUrl + "/Lighthouse?" + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
        document.getElementById("lighthouse-btn").hidden = true;
        document.getElementById("lighthouse-info").hidden = false;
        document.getElementById("mainLighthouse").hidden = false;
    } catch (Ex) {
        console.log(Ex);
        await setErrorModal("", "Lighthouse was unable to reliably load the page you requested.<br>Please try again.");
    }

    // Remove overlay
    await overlay("removeOverlay", "", "");
}

async function runLinks() {
    console.log("-------------------------");
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
    let dataset = [];
    for (let i = 0; i < linksInfo.length; i++) {
        Object.entries(linksInfo[i]).forEach(([key, value]) => {
            let url = key;
            let status = value[0];
            let origin = value[1];

            // Add to dataset
            dataset.push([url, status, origin]);

            // Set links counters
            totalLinksCount += 1;
            if (origin === "External") {
                extLinksCount += 1;
            } else if (origin === "Internal") {
                intLinksCount += 1;
            }
            if (status === "404" || status === "-1") {
                brokenLinksCount += 1;
            }

        });
    }

    // Initialize Errors Table
    $('#linksTable').DataTable({
        dom: 'Blfrtip',
        buttons: [{text: 'Export', extend: 'csv', filename: 'Links Report'}],
        paginate: false,
        "oLanguage": {"sSearch": "Filter:", "emptyTable": "loading data...please wait..."},
        "order": [[0, "asc"]],
        data: dataset,
        "autoWidth": false,
        "columnDefs": [
            {
                "width": "40%", "className": "truncate", "targets": 0, "render": function (data, type, row) {
                    return "<a target='_blank' href='" + data + "'>" + data + "</a>";
                },
            },
            {
                "width": "20%", "targets": 1, "render": function (data, type, row) {
                    let status = data.split(",");
                    let html = "";
                    let colorClass;
                    status.forEach(function (code) {
                        if (code.includes("20")) {
                            colorClass = "link200"
                        } else if (code.includes("30")) {
                            colorClass = "link301"
                        } else {
                            colorClass = "link404"
                        }
                        html += "<span class='" + colorClass + "'>" + code + "</span>";
                    });
                    return html;
                },
            },
            {
                "width": "20%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }
        ]
    });

    // Set Links Counters on sidebar
    document.getElementById("links-total").innerText = totalLinksCount;
    document.getElementById("links-ext").innerText = extLinksCount;
    document.getElementById("links-int").innerText = intLinksCount;
    document.getElementById("links-broken").innerText = brokenLinksCount;

    // Show Broken Links Message
    document.getElementById("links-broken-p").hidden = false;

    // Remove links-btn
    document.getElementById("links-btn").hidden = true;

    // Toggle Links Section
    document.getElementById("links-info").hidden = false;

    // Remove overlay
    await overlay("removeOverlay", "", "");
}

async function runAccessibility() {
    console.log("-------------------------");
    console.log("runAccessibility");

    // Insert overlay
    await overlay("addOverlay", "Running Accessibility Report", "");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Get WCAG Level
    let WCAGLevel = document.getElementById("WCAG-level-list").value;

    // Get accessibilityJSON
    let accessibilityJSON = await $.post(accessibilityPost, {
        url: siteUrl,
        level: WCAGLevel
    }, function (result) {
        return result;
    });

    // Iterate over all 3 Categories
    let snifferCategories = ["Errors", "Notices", "Warnings"];
    let errorsDataset = [];
    let noticesDataset = [];
    let warningsDataset = [];

    // Iterate over every entry on the categorie
    for (let i = 0; i < snifferCategories.length; i++) {
        let categorie = snifferCategories[i];

        // Get Categorie JSON
        let snifferCategorie = accessibilityJSON[categorie];

        // Add entry to Table
        for (let j = 0; j < snifferCategorie.length; j++) {
            let entry = snifferCategorie[j];
            let guideline = ((entry["Guideline"] !== "null") ? entry["Guideline"].replaceAll(".", " ") : "N/A");
            let message = ((entry["Message"] !== "null") ? entry["Message"] : "N/A");
            let tag = ((entry["Tag"] !== "null") ? entry["Tag"] : "N/A");
            let code = ((entry["Code"] !== "null") ? entry["Code"] : "N/A");

            if (categorie === "Errors") {
                errorsDataset.push([guideline, message, tag]);
            } else if (categorie === "Notices") {
                noticesDataset.push([guideline, message, tag]);
            } else if (categorie === "Warnings") {
                warningsDataset.push([guideline, message, tag]);
            }
        }

        // Set Accessibility Counter on sidebar
        document.getElementById("accessibility-" + categorie).innerText = snifferCategorie.length;
    }

    // Initialize Errors Table
    $('#snifferErrorsTable').DataTable({
        dom: 'Blfrtip',
        buttons: [{text: 'Export', extend: 'csv', filename: 'Accessibility Errors Report'}],
        paginate: false,
        "oLanguage": {"sSearch": "Filter:", "emptyTable": "loading data...please wait..."},
        "order": [[0, "asc"]],
        data: errorsDataset,
        "autoWidth": false,
        "columnDefs": [
            {
                "width": "30%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "60%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }
        ]
    });

    // Initialize Errors Table
    $('#snifferNoticesTable').DataTable({
        dom: 'Blfrtip',
        buttons: [{text: 'Export', extend: 'csv', filename: 'Accessibility Notices Report'}],
        paginate: false,
        "oLanguage": {"sSearch": "Filter:", "emptyTable": "loading data...please wait..."},
        "order": [[0, "asc"]],
        data: noticesDataset,
        "autoWidth": false,
        "columnDefs": [
            {
                "width": "30%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "60%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }
        ]
    });

    // Initialize Errors Table
    $('#snifferWarningsTable').DataTable({
        dom: 'Blfrtip',
        buttons: [{text: 'Export', extend: 'csv', filename: 'Accessibility Warnings Report'}],
        paginate: false,
        "oLanguage": {"sSearch": "Filter:", "emptyTable": "loading data...please wait..."},
        "order": [[0, "asc"]],
        data: warningsDataset,
        "autoWidth": false,
        "columnDefs": [
            {
                "width": "30%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "60%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }
        ]
    });

    // Toggle Accessibility Section
    document.getElementById("accessibility-info").hidden = false;
    document.getElementById("accessibility-btn").hidden = true;
    document.getElementById("WCAG-level-list").hidden = true;
    document.getElementById("wcag-level-label").innerText += " - " + WCAGLevel.replace("WCAG2", "");

    // Remove overlay
    await overlay("removeOverlay", "", "");
}

async function runCookies() {
    console.log("-------------------------");
    console.log("runCookies");

    // Insert overlay
    await overlay("addOverlay", "Running Cookies Report", "");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Get cookiesJSON
    let cookiesJSON = await $.post(cookiesPost, {
        url: siteUrl,
    }, function (result) {
        return result;
    });

    let dataset = [];
    cookiesJSON = cookiesJSON["cookies"];
    for (let i = 0; i < cookiesJSON.length; i++) {
        let entry = cookiesJSON[i];
        let name = entry["name"];
        let domain = entry["domain"];
        let expires = new Date(0);
        expires.setUTCSeconds(new Date(entry["expires"]));
        expires = '' + expires;
        let httpOnly = entry["httpOnly"];
        let secure = entry["secure"];
        let sourcePort = entry["sourcePort"];
        dataset.push([name, domain, expires, httpOnly, secure, sourcePort]);
    }

    // Initialize Errors Table
    $('#cookiesTable').DataTable({
        dom: 'Blfrtip',
        buttons: [{text: 'Export', extend: 'csv', filename: 'Cookies Report'}],
        paginate: false,
        "oLanguage": {"sSearch": "Filter:", "emptyTable": "loading data...please wait..."},
        "order": [[0, "asc"]],
        data: dataset,
        "autoWidth": false,
        "columnDefs": [
            {
                "width": "10%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "20%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "40%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "10%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "10%", "targets": 4, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "10%", "targets": 5, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }
        ]
    });

    // Toggle Cookies Section
    document.getElementById("cookies-total").innerText = dataset.length.toString();
    document.getElementById("cookies-info").hidden = false;
    document.getElementById("cookies-btn").hidden = true;

    // Remove overlay
    await overlay("removeOverlay", "", "");
}

async function runTechnologies() {
    console.log("-------------------------");
    console.log("runTechnologies");

    // Insert overlay
    await overlay("addOverlay", "Running Technologies Report", "");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Get cookiesJSON
    let wappalyzerJSON = await $.post(wappalyzerPost, {
        url: siteUrl,
    }, function (result) {
        return result;
    });

    let dataset = [];
    wappalyzerJSON = wappalyzerJSON["Wappalyzer"]["technologies"];
    for (let i = 0; i < wappalyzerJSON.length; i++) {
        let entry = wappalyzerJSON[i];
        let confidence = entry["confidence"].toString();
        let icon = entry["icon"];
        let name = entry["name"];
        let website = entry["website"];
        let categories = entry["categories"];
        let categoriesName = "";
        for (let j = 0; j < categories.length; j++) {
            categoriesName += categories[j]["name"] + ", ";
        }
        categoriesName = categoriesName.substring(0, categoriesName.length - 2);
        dataset.push([icon, name, website, categoriesName, confidence]);
    }

    // Initialize Errors Table
    $('#technologiesTable').DataTable({
        dom: 'Blfrtip',
        buttons: [{text: 'Export', extend: 'csv', filename: 'Technologies Report'}],
        paginate: false,
        "oLanguage": {"sSearch": "Filter:", "emptyTable": "loading data...please wait..."},
        "order": [[0, "asc"]],
        data: dataset,
        "autoWidth": false,
        "columnDefs": [
            {
                "width": "5%", "targets": 0, "render": function (data, type, row) {
                    return "<img width='30px' height='30px' src='https://www.wappalyzer.com/images/icons/" + data + "' alt='" + data + " Icon'/>";
                },
            },
            {
                "width": "20%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "20%", "targets": 2, "render": function (data, type, row) {
                    return "<a target='_blank' href='" + data + "'>" + data + "</a>";
                },
            },
            {
                "width": "40%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
            {
                "width": "15%", "targets": 4, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },
        ]
    });

    // Toggle Cookies Section
    document.getElementById("technologies-total").innerText = dataset.length.toString();
    document.getElementById("technologies-info").hidden = false;
    document.getElementById("technologies-btn").hidden = true;

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

    // Run Reports
    await runLanguageTool();
    // await runLighthouse();
    // await runLinks();
    // await runAccessibility();
    // await runCookies();
    // await runTechnologies();
}