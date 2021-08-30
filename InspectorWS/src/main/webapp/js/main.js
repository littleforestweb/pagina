/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */


// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //


// const inspectorUrl = "https://inspector.littleforest.co.uk/InspectorWS";
const inspectorUrl = "https://inspector.littleforest.co.uk/TestWS";
// const inspectorUrl = "http://localhost:8080/InspectorWS";
const nameWS = inspectorUrl.split("/")[3] + "/";
const languageToolPost = "/" + nameWS + "LanguageTool";
const lighthousePost = "/" + nameWS + "Lighthouse";
const linksPost = "/" + nameWS + "Links";
const accessibilityPost = "/" + nameWS + "Accessibility";
const cookiesPost = "/" + nameWS + "Cookies";
const wappalyzerPost = "/" + nameWS + "Wappalyzer";
let device = "desktop";
let checkIframes = false;
let checkLanguageTool = false;
let checkLighthouse = false;
let checkLinks = false;
let checkAccessibility = false;
let checkCookies = false;
let checkTechnologies = false;
let showTimeout = setTimeout(async function () {
    let siteUrl = await getSiteUrl();
    await setErrorModal("", "Failed to load <b>" + siteUrl + "</b> (Timeout)</br>Plase check the URL.");
    await overlay("removeOverlay", "", "");
    document.getElementById("mainPage").hidden = true;
    clearTimeout(showTimeout);
}, 10000);


// ------------------------------------- AUX FUNCTIONS ------------------------------------- //


async function getSiteUrl() {
    return document.getElementById("searchURL").value;
}

async function setErrorModal(title, message) {
    document.getElementById("modalErrorTitle").innerHTML = ((title !== "") ? title : "Something went wrong!");
    document.getElementById("modalErrorBody").innerHTML = message;
    $("#errorModal").modal("show");
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

async function resetPage() {
    window.location.href = inspectorUrl;
}

async function overlay(action, message, sndMessage) {
    if (action === "addOverlay") {
        // Disable goBtn
        await enableDisableActions("disable");

        // // Insert overlay
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlayMessage").innerText = message;
        document.getElementById("overlaySndMessage").innerHTML = sndMessage + "</br>";
        document.getElementById("overlayProgress").innerText = "";
        document.getElementById("overlay").hidden = false;
    } else if (action === "removeOverlay") {
        // // Remove overlay
        document.getElementById("overlay").style.display = "none";
        document.getElementById("overlay").hidden = true;

        // Enable goBtn
        await enableDisableActions("enable");
    }
}

async function setIframes() {
    // Add overlay
    await overlay("addOverlay", "Loading page", "");

    // Get siteUrl, pageIframe, codeIframe
    let siteUrl = await getSiteUrl();
    let pageIframe = document.getElementById('mainPage');
    let codeIframe = document.getElementById('mainCode');

    // Set iframe src to siteUrl
    pageIframe.src = siteUrl;

    // Wait for pageIframe to load
    pageIframe.addEventListener("load", function () {
        let html = pageIframe.contentWindow.document.documentElement.outerHTML;
        if (html.length > 500) {
            clearTimeout(showTimeout);

            // Set codeIframe
            codeIframe = codeIframe.contentWindow.document;
            codeIframe.open();
            html = html.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
            codeIframe.write('<pre><code id="htmlCode">' + html + '</code></pre>');
            codeIframe.close();

            // HTMLCode Syntax Highlighter
            w3CodeColor();

            // Add Stylesheet to iframe head Page and Code
            let iframeCSS = inspectorUrl + "/css/iframe.css";
            pageIframe = pageIframe.contentWindow.document;
            pageIframe.head.innerHTML = pageIframe.head.innerHTML + "<link type='text/css' rel='Stylesheet' href='" + iframeCSS + "' />";
            codeIframe.head.innerHTML = codeIframe.head.innerHTML + "<link type='text/css' rel='Stylesheet' href='" + iframeCSS + "' />";

            // Remove overlay
            overlay("removeOverlay", "", "");
        }
    });
}

async function enableDisableActions(action) {
    // Set all elemId
    let elemId = ["searchURL", "desktop-btn", "mobile-btn", "code-btn", "spelling-btn", "languages-list", "lighthouse-btn", "links-btn",
        "accessibility-btn", "WCAG-level-list", "cookies-btn", "technologies-btn"];

    // Set disabled status
    elemId.forEach(function (id) {
        document.getElementById(id).disabled = action !== "enable";
    });
}


// ------------------------------------- SPELLING REPORT ------------------------------------- //


async function gotoSpellError(spellError) {
    console.log("Goto " + spellError);

    // Get iframe element
    let pageIframe = document.getElementById("mainPage").contentWindow;

    // Get htmlCode
    let codeIframe = document.getElementById("mainCode").contentWindow;

    await toggleView("desktop");

    // Scroll to spell Errors in htmlView and htmlCode
    pageIframe.document.getElementById(spellError).scrollIntoView();
    codeIframe.document.getElementById(spellError).scrollIntoView();
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

    // Update GENERAL INFO
    document.getElementById("spelling-total-dictionary").innerText = dict.length.toString();

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
                    return "<button href='#/' class='removeDictionary bg-transparent border-0 text-lfi-green' onclick='removeDictionary(\"" + data + "\")'><b>Remove from Dictionary</b></button>";
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
    dictionaryTable.row.add(["<span>" + error + "</span>", error]).draw();

    // Remove spellError from iframe and htmlCode
    let pageIframe = document.getElementById('mainPage').contentWindow.document;
    let codeIframe = document.getElementById('mainCode').contentWindow.document;
    let spellErrors = [...pageIframe.querySelectorAll("spellerror"), ...codeIframe.querySelectorAll("spellerror")];
    spellErrors.forEach(function (elem) {
        if (elem.innerText === error) {
            let parent = elem.parentNode;
            while (elem.firstChild) parent.insertBefore(elem.firstChild, elem);
            parent.removeChild(elem);
        }
    });

    // Update GENERAL INFO
    let updatedErrorsTable = $('#errorsTable').DataTable().data();
    let n_dataset = [];
    for (let i = 0; i < updatedErrorsTable.length; i++) {
        let n_error = updatedErrorsTable[i][0];
        n_dataset.push(n_error);
    }
    n_dataset = n_dataset.filter(function (value, index, arr) {
        return value !== error;
    });
    let mostError = "Good Job!";
    let leastError = "Good Job!";
    let totalError = "0 - Good Job!"
    if (n_dataset.length === 0) {
        document.getElementById("spell-card-total").classList.remove("bg-lfi-blue");
        document.getElementById("spell-card-total").classList.add("bg-lfi-green");
        document.getElementById("spell-card-most").classList.remove("bg-lfi-blue");
        document.getElementById("spell-card-most").classList.add("bg-lfi-green");
        document.getElementById("spell-card-least").classList.remove("bg-lfi-blue");
        document.getElementById("spell-card-least").classList.add("bg-lfi-green");
    } else {
        totalError = n_dataset.length;
        mostError = n_dataset[0];
        leastError = n_dataset[n_dataset.length - 1];
    }
    document.getElementById("spelling-total-errors").innerText = totalError;
    document.getElementById("spelling-most-errors").innerText = mostError;
    document.getElementById("spelling-least-errors").innerText = leastError;


    // Get existing Dictionary
    let dict = await getDictionary("dictionary");

    // Set new Dictionary
    if (dict.length === 0) {
        dict = [error];
    } else {
        dict.push(error);
    }

    // Update GENERAL INFO
    document.getElementById("spelling-total-dictionary").innerText = dict.length.toString();

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

    // Update GENERAL INFO
    document.getElementById("spelling-total-dictionary").innerText = dict.length.toString();

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
        document.getElementById("dictionaryTableDiv").hidden = false;
        document.getElementById("errorsTableDiv").hidden = true;
    } else if (view === "errorsTableDiv") {
        document.getElementById("dictionaryTableDiv").hidden = true;
        document.getElementById("errorsTableDiv").hidden = false;
    }
}

async function rerunSpelling() {
    // Remove spellError from iframe and htmlCode
    let pageIframe = document.getElementById('mainPage').contentWindow.document;
    let codeIframe = document.getElementById('mainCode').contentWindow.document;
    let spellErrors = [...pageIframe.querySelectorAll("spellerror"), ...codeIframe.querySelectorAll("spellerror")];
    spellErrors.forEach(function (elem) {
        let parent = elem.parentNode;
        while (elem.firstChild) parent.insertBefore(elem.firstChild, elem);
        parent.removeChild(elem);

    });

    // Clear Errors table
    $('#errorsTable').DataTable().clear().draw();
    $('#errorsTable').DataTable().destroy();

    // Clear Dictionary table
    $('#dictionaryTable').DataTable().clear().draw();
    $('#dictionaryTable').DataTable().destroy();

    checkLanguageTool = false;
    toggleView("spelling");
}


// ------------------------------------- LIGHTHOUSE REPORT ------------------------------------- //


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
        document.getElementById("snifferErrorsTableDiv").hidden = false;
        document.getElementById("snifferNoticesTableDiv").hidden = true;
        document.getElementById("snifferWarningsTableDiv").hidden = true;
    } else if (view === "snifferNoticesTableDiv") {
        document.getElementById("snifferErrorsTableDiv").hidden = true;
        document.getElementById("snifferNoticesTableDiv").hidden = false;
        document.getElementById("snifferWarningsTableDiv").hidden = true;
    } else if (view === "snifferWarningsTableDiv") {
        document.getElementById("snifferErrorsTableDiv").hidden = true;
        document.getElementById("snifferNoticesTableDiv").hidden = true;
        document.getElementById("snifferWarningsTableDiv").hidden = false;
    }
}


// ------------------------------------- MAIN ------------------------------------- //


async function runLanguageTool() {
    console.log("-------------------");
    console.log("runLanguageTool()");

    // Insert overlay
    await overlay("addOverlay", "Running Spell Check", "");

    // Get pageIframe, codeIframe
    let pageIframe = document.getElementById('mainPage').contentWindow.document;
    let codeIframe = document.getElementById('mainCode').contentWindow.document;

    // Get all name from the langCodes
    let langValues = [];
    let languages_list = document.getElementById('languages-list');
    for (let i = 0; i < languages_list.options.length; i++) {
        langValues.push(languages_list.options[i].value);
    }

    // Get the selected lanaguage
    let langCode = document.getElementById("languages-list").value;
    if (langCode === "auto") {
        // If is auto, try to detect the language from the lang attribute
        let detectedLang = pageIframe.documentElement.lang;

        // If the full lang code is present on the list ("en-GB" not "en")
        if (langValues.includes(detectedLang)) {
            langCode = detectedLang;
            let valueText = languages_list.options[langValues.indexOf(langCode)].text;
            document.getElementById("overlaySndMessage").innerHTML = "</br>Detected Language: " + valueText + "</br>";
        } else {
            // Try to detect the general language, if the lang attribute has only two chars ("en")
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
                langCode = "en-GB";
                let valueText = languages_list.options[langValues.indexOf(langCode)].text;
                document.getElementById("overlaySndMessage").innerHTML = "</br>Couldn't detect langauage.</br> Defaulting to : " + valueText + "</br>";
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

    // Load Dictionary
    await loadDictionaryList();

    // Get existing Dictionary
    let dict = await getDictionary("dictionary");

    // Set errorsDict where key => error and value => [count, color]
    let errorsDict = {};

    // Get all tagsElem ->  Empty strings -> Only spaces -> Ignore duplicates
    let tagsElem = [...new Set(pageIframe.body.innerText.split("\n").filter(e => e).filter(e => e !== " "))];

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
        findAndReplaceDOMText(pageIframe.body, {
            preset: 'prose',
            find: error,
            wrap: 'spellerror',
            wrapClass: "shiny_red",
            wrapId: "spell_" + error
        });

        // Highlight Spelling Errors on Code View
        findAndReplaceDOMText(codeIframe.getElementById("htmlCode"), {
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
        let spellErrors = pageIframe.querySelectorAll("spellerror");
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

    // Highlight Spelling Errors on Page and Code View
    // Add Spelling Errors to sidebar
    let dataset = [];
    for (let i = 0; i < items.length; i++) {
        let entry = items[i];
        let error = entry[0];
        let count = entry[1][0];
        let message = entry[1][1];
        let replacements = entry[1][2];

        // Add to dataset
        dataset.push([error, replacements, message, count]);
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
                    return "<button class='addDictionary bg-transparent border-0 text-lfi-green' onclick='addDictionary(\"" + row + "\")'><b>Add to Dictionary</b></button>" + "|" + "<button class='bg-transparent border-0 text-lfi-green' onclick='gotoSpellError(\"spell_" + row[0] + "\")'><b>View</b></button>";
                },
            }
        ]
    });

    // Update GENERAL INFO
    let mostError = "Good Job!";
    let leastError = "Good Job!";
    let totalError = "0 - Good Job!"
    if (dataset.length === 0) {
        document.getElementById("spell-card-total").classList.remove("bg-lfi-blue");
        document.getElementById("spell-card-total").classList.add("bg-lfi-green");
        document.getElementById("spell-card-most").classList.remove("bg-lfi-blue");
        document.getElementById("spell-card-most").classList.add("bg-lfi-green");
        document.getElementById("spell-card-least").classList.remove("bg-lfi-blue");
        document.getElementById("spell-card-least").classList.add("bg-lfi-green");
    } else {
        document.getElementById("spell-card-total").classList.add("bg-lfi-blue");
        document.getElementById("spell-card-most").classList.add("bg-lfi-blue");
        document.getElementById("spell-card-least").classList.add("bg-lfi-blue");
        totalError = dataset.length.toString();
        mostError = dataset[0][0];
        leastError = dataset[dataset.length - 1][0];
    }
    document.getElementById("spelling-total-errors").innerText = totalError;
    document.getElementById("spelling-most-errors").innerText = mostError;
    document.getElementById("spelling-least-errors").innerText = leastError;

    await toggleSpellView("errorsTableDiv");

    // Remove overlay
    await overlay("removeOverlay", "", "");

    console.log("-------------------");
}

async function runLighthouse() {
    console.log("-------------------------");
    console.log("runLighthouse");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Insert overlay
    await overlay("addOverlay", "Running Lighthouse Report", "");

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

        // Toggle Lighthouse Section
        document.getElementById("mainLighthouse").src = inspectorUrl + "/Lighthouse?" + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
        document.getElementById("mainLighthouse").hidden = false;
    } catch (Ex) {
        console.log(Ex);
        await setErrorModal("", "Lighthouse was unable to reliably load the page you requested.<br>Please try again.");
    }

    // Remove overlay
    await overlay("removeOverlay", "", "");

    console.log("-------------------");
}

async function runLinks() {
    console.log("-------------------------");
    console.log("runLinks");

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
            if (status === "404" || status === "-1" || status === "999") {
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

    // Update GENERAL INFO
    if (brokenLinksCount === 0) {
        brokenLinksCount = "0 - Good Job!"
        document.getElementById("links-card-broken").classList.remove("bg-danger");
        document.getElementById("links-card-broken").classList.add("bg-lfi-green");
    }
    document.getElementById("links-total").innerText = totalLinksCount;
    document.getElementById("links-ext").innerText = extLinksCount;
    document.getElementById("links-int").innerText = intLinksCount;
    document.getElementById("links-broken").innerText = brokenLinksCount;

    // Remove overlay
    await overlay("removeOverlay", "", "");

    console.log("-------------------");
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
    }

    // Update GENERAL INFO
    let total = errorsDataset.length + noticesDataset.length + warningsDataset.length
    let errors = errorsDataset.length
    let notices = noticesDataset.length
    let warnings = warningsDataset.length
    if (total === 0) {
        total = "0 - Good Job!";
        document.getElementById("accessibility-card-total").classList.remove("bg-lfi-blue");
        document.getElementById("accessibility-card-total").classList.add("bg-lfi-green");
    }
    if (errors === 0) {
        errors = "0 - Good Job!";
        document.getElementById("accessibility-card-errors").classList.remove("bg-lfi-blue");
        document.getElementById("accessibility-card-errors").classList.add("bg-lfi-green");
    }
    if (notices === 0) {
        notices = "0 - Good Job!";
        document.getElementById("accessibility-card-notices").classList.remove("bg-lfi-blue");
        document.getElementById("accessibility-card-notices").classList.add("bg-lfi-green");
    }
    if (warnings === 0) {
        warnings = "0 - Good Job!";
        document.getElementById("accessibility-card-warnings").classList.remove("bg-lfi-blue");
        document.getElementById("accessibility-card-warnings").classList.add("bg-lfi-green");
    }
    document.getElementById("accessibility-total").innerText = total.toString();
    document.getElementById("accessibility-errors").innerText = errors.toString();
    document.getElementById("accessibility-notices").innerText = notices.toString();
    document.getElementById("accessibility-warnings").innerText = warnings.toString();

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
    document.getElementById("cookies-total").innerText = dataset.length.toString();

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
    let categoriesCounter = {};
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
            if (categories[j]["name"] in categoriesCounter) {
                categoriesCounter[categories[j]["name"]] += 1;
            } else {
                categoriesCounter[categories[j]["name"]] = 1;
            }
        }
        categoriesName = categoriesName.substring(0, categoriesName.length - 2);
        dataset.push([icon, name, website, categoriesName, confidence]);
    }

    // Update GENERAL INFO
    // Sort the array based on the count element
    categoriesCounter = Object.keys(categoriesCounter).map(function (key) {
        return [key, categoriesCounter[key]];
    }).sort(function (first, second) {
        return second[1] - first[1];
    });
    document.getElementById("technologies-total").innerText = dataset.length.toString();
    document.getElementById("technologies-most").innerText = categoriesCounter[0][0];

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

    // Remove overlay
    await overlay("removeOverlay", "", "");
}

async function toggleView(view) {
    console.log("toggleView - " + view);

    // Set Sidebar btn Active
    let btnId = ["desktop-btn", "mobile-btn", "code-btn", "spelling-btn", "lighthouse-btn", "links-btn", "accessibility-btn", "cookies-btn", "technologies-btn"];
    btnId.forEach(function (btn) {
        document.getElementById(btn).classList.remove("active");
    });
    let activeBtnId = view + "-btn";
    if (btnId.includes(activeBtnId)) {
        document.getElementById(activeBtnId).classList.add("active");
    }

    // Hide all sections except mainPage
    let reportId = ["mainPageDiv", "mainCodeDiv", "mainSpellingDiv", "mainLighthouseDiv", "mainLinksDiv", "mainAccessibilityDiv", "mainCookiesDiv", "mainTechnologiesDiv"];
    reportId.forEach(function (report) {
        document.getElementById(report).hidden = true;
    });
    document.getElementById("mainPageDiv").hidden = false;

    let pageIframe = document.getElementById('mainPage');
    switch (view) {
        case 'desktop':
            pageIframe.classList.remove("iframePageMobile");
            document.getElementById("mainPageDiv").hidden = false;
            device = "desktop";
            break;
        case 'mobile':
            pageIframe.classList.add("iframePageMobile");
            document.getElementById("mainPageDiv").hidden = false;
            device = "mobile";
            break;
        case 'code':
            document.getElementById("mainCodeDiv").hidden = false;
            document.getElementById("mainPageDiv").hidden = true;
            break;
        case 'spelling':
            if (!checkLanguageTool) {
                pageIframe.classList.remove("iframePageMobile");
                document.getElementById("mainPageDiv").hidden = false;
                await runLanguageTool();
                checkLanguageTool = true;
            } else {
                console.log("Already runLanguageTool");
            }
            document.getElementById("mainPageDiv").hidden = true;
            document.getElementById("mainSpellingDiv").hidden = false;
            break;
        case 'lighthouse':
            if (!checkLighthouse) {
                await runLighthouse();
                checkLighthouse = true;
            } else {
                console.log("Already runLighthouse");
            }
            document.getElementById("mainPageDiv").hidden = true;
            document.getElementById("mainLighthouseDiv").hidden = false;
            break;
        case 'links':
            if (!checkLinks) {
                await runLinks();
                checkLinks = true;
            } else {
                console.log("Already runLinks");
            }
            document.getElementById("mainPageDiv").hidden = true;
            document.getElementById("mainLinksDiv").hidden = false;
            break;
        case 'accessibility':
            if (!checkAccessibility) {
                await runAccessibility();
                checkAccessibility = true;
            } else {
                console.log("Already runAccessibility");
            }
            document.getElementById("mainPageDiv").hidden = true;
            document.getElementById("mainAccessibilityDiv").hidden = false;
            break;
        case 'cookies':
            if (!checkCookies) {
                await runCookies();
                checkCookies = true;
            } else {
                console.log("Already runCookies");
            }
            document.getElementById("mainPageDiv").hidden = true;
            document.getElementById("mainCookiesDiv").hidden = false;
            break;
        case 'technologies':
            if (!checkTechnologies) {
                await runTechnologies();
                checkTechnologies = true;
            } else {
                console.log("Already runTechnologies");
            }
            document.getElementById("mainPageDiv").hidden = true;
            document.getElementById("mainTechnologiesDiv").hidden = false;
            break;
        default:
            console.log("Wrong view");
    }
}
