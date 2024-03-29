/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */


// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //


let nameWS = "InspectorWS";
if (!(window.location.pathname.includes("InspectorWS"))) {
    nameWS = window.location.pathname.replace("Inspector", "").replaceAll("/", "");
}

const inspectorUrl = "https://" + window.location.hostname + "/" + nameWS;
const downloaderPost = "/" + nameWS + "/" + "Downloader";
const languageToolPost = "/" + nameWS + "/" + "LanguageTool";
const lighthousePost = "/" + nameWS + "/" + "Lighthouse";
const linksPost = "/" + nameWS + "/" + "Links";
const accessibilityPost = "/" + nameWS + "/" + "Accessibility";
const cookiesPost = "/" + nameWS + "/" + "Cookies";
const wappalyzerPost = "/" + nameWS + "/" + "Wappalyzer";
const imagesPost = "/" + nameWS + "/" + "Images";
const domainsPost = "/" + nameWS + "/" + "DomainDiscovery";
let spellTagsElem = [];
let device = "desktop";
let checkLanguageTool, checkAccessibility, checkCookies, checkTechnologies, checkImages, checkDomains, checkLighthouse, checkLinks = false;
let useCacheLanguageTool, useCacheAccessibility, useCacheCookies, useCacheTechnologies, useCacheImages, useCacheDomains, useCacheLighthouse, useCacheLinks = true;
let ogEditable = [];
let cmsName;

// ------------------------------------- AUX FUNCTIONS ------------------------------------- //


$("#searchURL").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        gotoNewPage();
    }
});

async function sleep(secs) {
    await new Promise(resolve => setTimeout(resolve, secs * 1000));
}

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

    // Check for a valid URL
    try {
        new URL(siteUrl);
    } catch (_) {
        // Set Error Message in MODAL
        await setErrorModal("", "Please insert a valid URL");
        return false;
    }

    // Get selected Language
    let language = document.getElementById("languages-list").value;

    // Launch new Inspector
    window.location.href = inspectorUrl + "/Inspector?url=" + siteUrl + "&lang=" + language;
}

async function resetPage() {
    window.location.href = inspectorUrl + "/" + "Inspector";
}

async function toggleView(view) {
    // console.log("toggleView - " + view);

    // Set Sidebar btn Active
    let btnId = ["desktop-btn", "mobile-btn", "code-btn", "spelling-btn", "accessibility-btn", "cookies-btn", "technologies-btn", "images-btn", "domains-btn", "lighthouse-btn", "links-btn"];
    btnId.forEach(function (btn) {
        document.getElementById(btn).classList.remove("active");
    });
    let activeBtnId = view + "-btn";
    if (btnId.includes(activeBtnId)) {
        document.getElementById(activeBtnId).classList.add("active");
    }

    // Hide all sections except mainPage
    let reportId = ["mainPageDiv", "mainCodeDiv", "mainSpellingDiv", "mainAccessibilityDiv", "mainCookiesDiv", "mainTechnologiesDiv", "mainImagesDiv", "mainDomainsDiv", "mainLighthouseDiv", "mainLinksDiv"];
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
                await runLanguageTool();
                checkLanguageTool = true;
            } else {
                console.log("Already runLanguageTool");
                document.getElementById("mainPageDiv").hidden = true;
                document.getElementById("mainSpellingDiv").hidden = false;
            }
            break;
        case 'accessibility':
            if (!checkAccessibility) {
                await runAccessibility();
                checkAccessibility = true;
            } else {
                console.log("Already runAccessibility");
                document.getElementById("mainPageDiv").hidden = true;
                document.getElementById("mainAccessibilityDiv").hidden = false;
            }
            break;
        case 'cookies':
            if (!checkCookies) {
                await runCookies();
                checkCookies = true;
            } else {
                console.log("Already runCookies");
                document.getElementById("mainPageDiv").hidden = true;
                document.getElementById("mainCookiesDiv").hidden = false;
            }
            break;
        case 'technologies':
            if (!checkTechnologies) {
                await runTechnologies();
                checkTechnologies = true;
            } else {
                console.log("Already runTechnologies");
                document.getElementById("mainPageDiv").hidden = true;
                document.getElementById("mainTechnologiesDiv").hidden = false;
            }
            break;
        case 'images':
            if (!checkImages) {
                await runImages();
                checkImages = true;
            } else {
                console.log("Already runImages");
                document.getElementById("mainPageDiv").hidden = true;
                document.getElementById("mainImagesDiv").hidden = false;
            }
            break;
        case 'domains':
            if (!checkDomains) {
                await runDomains();
                checkDomains = true;
            } else {
                console.log("Already runDomains");
                document.getElementById("mainPageDiv").hidden = true;
                document.getElementById("mainDomainsDiv").hidden = false;
            }
            break;
        case 'lighthouse':
            console.log(checkLighthouse);
            if (checkLighthouse !== "running") {
                if (!checkLighthouse) {
                    $("#lighthouseModal").modal("show");
                } else {
                    console.log("Already runLighthouse");
                    document.getElementById("mainPageDiv").hidden = true;
                    document.getElementById("mainLighthouseDiv").hidden = false;
                }
            } else {
                $('#lighthouseNotification').toast('show');
            }
            break;
        case 'links':
            if (checkLinks !== "running") {
                if (!checkLinks) {
                    $("#linksModal").modal("show");
                } else {
                    console.log("Already runLinks");
                    document.getElementById("mainPageDiv").hidden = true;
                    document.getElementById("mainLinksDiv").hidden = false;
                }
            } else {
                $('#linksNotification').toast('show');
            }
            break;
        default:
            console.log("Wrong view");
    }

    // Check if Report Status is True -> All reports finished running
    if (checkLanguageTool && checkAccessibility && checkCookies && checkTechnologies && checkImages && checkDomains) {
        console.log("READY");
        await overlay("removeOverlay", "", "");
    }
}

async function overlay(action, message, sndMessage) {
    if (action === "addOverlay") {
        // Disable goBtn
        await enableDisableActions("disable");

        // // Insert overlay
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlayMessage").innerText = message;
        document.getElementById("overlaySndMessage").innerHTML = sndMessage + "</br>";
        document.getElementById("overlay").hidden = false;
    } else if (action === "removeOverlay") {
        // // Remove overlay
        document.getElementById("overlay").style.display = "none";
        document.getElementById("overlay").hidden = true;

        // Enable goBtn
        await enableDisableActions("enable");
    }
}

async function enableDisableActions(action) {
    // Set all elemId
    let elemId = ["searchURL", "languages-list", "WCAG-level-list", "desktop-btn", "mobile-btn", "code-btn", "spelling-btn", "accessibility-btn", "cookies-btn", "technologies-btn", "images-btn", "domains-btn", "lighthouse-btn", "links-btn"];

    // Set disabled status
    elemId.forEach(function (id) {
        document.getElementById(id).disabled = action !== "enable";
    });
}

async function checkCMS() {
    let pageIframe = document.getElementById('mainPage').contentWindow.document;

    // Check if it is Opel, Citroen or Peugeot
    let siteUrl = await getSiteUrl();
    siteUrl = siteUrl.toLowerCase();
    if (siteUrl.includes("www.opel") || siteUrl.includes("www.citroen") || siteUrl.includes("www.peugeot")) {
        try {
            // Get CMS path
            let metaTagContent = pageIframe.getElementsByName("path")[0].getAttribute('content').slice(0, -7);

            // Decode Base64
            metaTagContent = decodeURIComponent(escape(window.atob(metaTagContent)));

            // Build full edit URL
            let editUrl = "https://author-opel-automobile-65-prod.adobecqms.net/editor.html" + metaTagContent + ".html";
            document.getElementById("editPageCMSBtn").setAttribute('href', editUrl);
            document.getElementById("editPageCMSBtn").setAttribute("target", "_blank");
            document.getElementById("editPageCMSBtn").hidden = false;
        } catch (e) {
            console.log("No meta tag");
        }
        return;
    }

    // Check if WordPress | Drupal
    let metas = pageIframe.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("name") === "generator" || metas[i].getAttribute("name") === "Generator") {
            if (metas[i].getAttribute("content").includes("wordpress")) {
                cmsName = "WordPress";
                break;
            } else if (metas[i].getAttribute("content").includes("drupal")) {
                cmsName = "Drupal";
                break;
            } else if (metas[i].getAttribute("content").includes("Leaf CMS")) {
                cmsName = "Leaf CMS";
                break;
            }
        }
    }

    // Get shortlink IF WordPress | Drupal
    if (cmsName !== undefined) {
        let linkRel = pageIframe.getElementsByTagName('link');
        for (let i = 0; i < linkRel.length; i++) {
            if (linkRel[i].rel === "shortlink") {
                console.log(linkRel[i].href);
                if (cmsName === "WordPress") {
                    let editUrl = (linkRel[i].href + "&action=edit");
                    if (editUrl.charAt(0) === "/") {
                        editUrl = editUrl.substring(1);
                    }
                    document.getElementById("editPageCMSBtn").setAttribute('href', editUrl);
                } else if (cmsName === "Drupal") {
                    let editUrl = (linkRel[i].href + "/edit/");
                    if (editUrl.charAt(0) === "/") {
                        editUrl = editUrl.substring(1);
                    }
                    document.getElementById("editPageCMSBtn").setAttribute('href', editUrl);
                }
                document.getElementById("editPageCMSBtn").setAttribute("target", "_blank");
                document.getElementById("editPageCMSBtn").hidden = false;
            }
        }
    }
}

async function editPage() {
    let siteUrl = await getSiteUrl();
    siteUrl = siteUrl.toLowerCase();
    let pageIframe = document.getElementById('mainPage').contentWindow.document;
    if (siteUrl.includes("www.southampton") || siteUrl.includes("https://inspector.littleforest.co.uk:7777")) {
        // Get editable content divs
        let editableElems = pageIframe.getElementsByClassName("uos-tier uos-tier-secondary");

        // Iterate over every div
        for (let i = 0; i < editableElems.length; i++) {
            let elem = editableElems[i];
            ogEditable.push([elem, elem.innerHTML, elem.innerText]);
            elem.contentEditable = "true";
        }
    } else if (siteUrl.includes("eversheds-sutherland.com") || siteUrl.includes("https://inspector.littleforest.co.uk:5555")) {
        // Get editable content divs
        let editableElems = pageIframe.getElementById("maincontent");

        // Iterate over every div
        for (let i = 0; i < editableElems.length; i++) {
            let elem = editableElems[i];
            ogEditable.push([elem, elem.innerHTML, elem.innerText]);
            elem.contentEditable = "true";
        }

        let codeIframe = document.getElementById('mainCode');
        codeIframe.contentWindow.document.getElementById("htmlCode").contentEditable = "true";
    }
    document.getElementById("editPageBtn").hidden = true;
    document.getElementById("savePageBtn").hidden = false;
}

async function savePage() {
    // Keep track of changes JSON
    let editedChanges = '{"changes":[';
    let hasChanges = false;

    // Iterate over every editableElem
    for (let i = 0; i < ogEditable.length; i++) {
        let elem = ogEditable[i][0];
        elem.contentEditable = "false";

        // Check to see if is different => Add to JSON
        if (ogEditable[i][2] !== elem.innerText) {
            hasChanges = true;

            let ogInnerHTML = ogEditable[i][1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
            let editedInnerHTML = elem.innerHTML.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
            // let ogInnerHTML = ogEditable[i][1];
            // let editedInnerHTML = elem.innerHTML;
            editedChanges += '{"original":"' + ogInnerHTML + '", "edited":"' + editedInnerHTML + '" },'
        }
    }

    // If hasChanges => End JSON => Download JSON File
    if (hasChanges) {
        // Remove last "," => Add end JSON
        editedChanges = editedChanges.slice(0, -1);
        editedChanges += ']}';

        let page_id = (await getSiteUrl()).split("id=")[1];
        let saveURL;
        let siteUrl = await getSiteUrl();
        if (siteUrl.includes("www.southampton") || siteUrl.includes("https://inspector.littleforest.co.uk:7777")) {
            saveURL = "https://inspector.littleforest.co.uk:7777/save/site"
        } else if (siteUrl.includes("eversheds-sutherland.com") || siteUrl.includes("https://inspector.littleforest.co.uk:5555")) {
            saveURL = "https://inspector.littleforest.co.uk:5555/save/site"
        }

        $.ajax({
            type: "POST",
            url: saveURL,
            data: {"changesJSON": editedChanges, "page_id": page_id},
            success: function (entry) {
                console.log("success");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error");
            }
        });

        $('#savedNotification').toast('show');
    }

    document.getElementById("savePageBtn").hidden = true;
}

async function checkReports() {
    return (checkLanguageTool && checkAccessibility && checkCookies && checkTechnologies && checkImages && checkDomains);
}

async function removeCookies() {
    // Get pageIframe
    let pageIframe = document.getElementById('mainPage').contentWindow.document;
    let siteUrl = await getSiteUrl();
    await sleep(5);

    if (siteUrl.includes("www.opel") || siteUrl.includes("www.citroen") || siteUrl.includes("www.peugeot")) {
        pageIframe.getElementById("_psaihm_main_div").remove();
        pageIframe.getElementById("_psaihm_overlay").remove();
    } else if (siteUrl.includes("www.southampton") || siteUrl.includes("https://inspector.littleforest.co.uk:7777")) {
        let body = pageIframe.getElementsByTagName("body")[0];
        for (let i = 0; i < body.children.length; i++) {
            let entry = body.children[i];
            if (entry.id === "optanon") {
                entry.remove();
            }
        }
        body.style = "";
    } else if (siteUrl.includes("eversheds-sutherland.com") || siteUrl.includes("https://inspector.littleforest.co.uk:5555")) {
        let body = pageIframe.getElementsByTagName("body")[0];
        for (let i = 0; i < body.children.length; i++) {
            let entry = body.children[i];
            if (entry.id === "CookieReportsPanel") {
                entry.remove();
            }
        }
        for (let i = 0; i < body.children.length; i++) {
            let entry = body.children[i];
            if (entry.id === "CookieReportsPanel") {
                entry.remove();
            }
        }
    }
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
        dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Spelling Errors'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "There is no words on your dictionary."}, "order": [[0, "desc"]], data: dataset, "autoWidth": false, "columnDefs": [{
            "width": "50%", "targets": 0, "render": function (data, type, row) {
                return "<span>" + data + "</span>";
            }
        }, {
            "width": "50%", "targets": 1, "render": function (data, type, row) {
                return "<button href='#/' class='removeDictionary bg-transparent border-0 text-lfi-green' onclick='removeDictionary(\"" + data + "\")'><b>Remove from Dictionary</b></button>";
            }
        }]
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
    let totalError = "0 - Good Job!";
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


// ------------------------------------- LINKS REPORT ------------------------------------- //


async function gotoLink(linkId) {
    console.log("Goto " + linkId);

    // Get iframe element
    let pageIframe = document.getElementById("mainPage").contentWindow;

    await toggleView("desktop");

    // Scroll to Broken Link in htmlView
    pageIframe.document.getElementById(linkId).scrollIntoView();
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

async function gotoAccessibilityError(view, accessibilityError) {
    console.log("Goto " + accessibilityError + " - " + view);

    if (view === "desktop") {
        // Get iframe element
        let pageIframe = document.getElementById("mainPage").contentWindow;

        await toggleView("desktop");

        // Scroll to Accessibility Error Errors in htmlView
        pageIframe.document.getElementById(accessibilityError).classList.add("accessibilityerror_blink");
        pageIframe.document.getElementById(accessibilityError).scrollIntoView();
        await new Promise(r => setTimeout(r, 5000));
        pageIframe.document.getElementById(accessibilityError).classList.remove("accessibilityerror_blink");
    } else {
        // Get iframe element
        let codeIframe = document.getElementById("mainCode").contentWindow;

        await toggleView("code");

        // Scroll to Accessibility Error Errors in htmlView
        codeIframe.document.getElementById(accessibilityError).classList.add("accessibilityerror_blink");
        codeIframe.document.getElementById(accessibilityError).scrollIntoView();
        await new Promise(r => setTimeout(r, 5000));
        codeIframe.document.getElementById(accessibilityError).classList.remove("accessibilityerror_blink");
    }

}


// ------------------------------------- IMAGES REPORT ------------------------------------- //


async function showImage(img_url) {
    document.getElementById("imagepreview").src = img_url;
    $('#imagesModal').modal('show');
}


// ------------------------------------- RERUN REPORTS ------------------------------------- //


async function rerunSpelling() {
    console.log("rerunSpelling");

    document.getElementById("spelling-btn").disabled = true;

    // Remove spellError from iframe and htmlCode
    let pageIframe = document.getElementById('mainPage').contentWindow.document;
    let codeIframe = document.getElementById('mainCode').contentWindow.document;
    let spellErrors = [...pageIframe.querySelectorAll("spellerror"), ...codeIframe.querySelectorAll("spellerror")];
    spellErrors.forEach(function (elem) {
        elem.outerHTML = elem.innerHTML;
    });

    // Clear Errors table
    $('#errorsTable').DataTable().clear().draw();
    $('#errorsTable').DataTable().destroy();

    // Clear Dictionary table
    $('#dictionaryTable').DataTable().clear().draw();
    $('#dictionaryTable').DataTable().destroy();

    document.getElementById("spelling-btn").disabled = false;
    checkLanguageTool = false;
    useCacheLanguageTool = false;
    await overlay("addOverlay", "Running Spelling", "");
    await toggleView("spelling");
    await overlay("removeOverlay", "", "");
    await toggleView("spelling");
}

async function rerunLinks() {
    console.log("rerunLinks");

    document.getElementById("links-btn").disabled = false;

    // Clear Links table
    $('#linksTable').DataTable().clear().draw();
    $('#linksTable').DataTable().destroy();

    document.getElementById("links-btn").disabled = true;
    checkLinks = false;
    useCacheLinks = false;
    await overlay("addOverlay", "Running Links", "");
    await toggleView("links");
    await overlay("removeOverlay", "", "");
    await toggleView("links");
}

async function rerunAccessibility() {
    console.log("rerunAccessibility");

    document.getElementById("accessibility-btn").disabled = true;

    // Clear Accessibility table
    $('#snifferErrorsTable').DataTable().clear().draw();
    $('#snifferErrorsTable').DataTable().destroy();
    $('#snifferNoticesTable').DataTable().clear().draw();
    $('#snifferNoticesTable').DataTable().destroy();
    $('#snifferWarningsTable').DataTable().clear().draw();
    $('#snifferWarningsTable').DataTable().destroy();

    // Remove Highlight from desktop view
    let pageIframe = document.getElementById('mainPage').contentWindow.document;
    let accessibilityErrors = pageIframe.querySelectorAll('*[id^="accessibilityerror_"]');
    for (let i = 0; i < accessibilityErrors.length; i++) {
        let entry = accessibilityErrors[i];
        entry.classList.remove("accessibilityerror_shiny_red");
    }

    document.getElementById("accessibility-btn").disabled = false;
    checkAccessibility = false;
    useCacheAccessibility = false;
    await overlay("addOverlay", "Running Accessibility", "");
    await toggleView("accessibility");
    await overlay("removeOverlay", "", "");
    await toggleView("accessibility");
}

async function rerunCookies() {
    console.log("rerunCookies");

    document.getElementById("cookies-btn").disabled = true;

    // Clear Cookies table
    $('#cookiesTable').DataTable().clear().draw();
    $('#cookiesTable').DataTable().destroy();

    document.getElementById("cookies-btn").disabled = false;
    checkCookies = false;
    useCacheCookies = false;
    await overlay("addOverlay", "Running Cookies", "");
    await toggleView("cookies");
    await overlay("removeOverlay", "", "");
    await toggleView("cookies");
}

async function rerunTechnologies() {
    console.log("rerunTechnologies");

    document.getElementById("technologies-btn").disabled = true;

    // Clear Technologies table
    $('#technologiesTable').DataTable().clear().draw();
    $('#technologiesTable').DataTable().destroy();

    document.getElementById("technologies-btn").disabled = false;
    checkTechnologies = false;
    useCacheTechnologies = false;
    await overlay("addOverlay", "Running Technologies", "");
    await toggleView("technologies");
    await overlay("removeOverlay", "", "");
    await toggleView("technologies");
}

async function rerunImages() {
    console.log("rerunImages");

    document.getElementById("images-btn").disabled = true;

    // Clear Cookies table
    $('#imagesTable').DataTable().clear().draw();
    $('#imagesTable').DataTable().destroy();

    document.getElementById("images-btn").disabled = false;
    checkImages = false;
    useCacheImages = false;
    await overlay("addOverlay", "Running Images", "");
    await toggleView("images");
    await overlay("removeOverlay", "", "");
    await toggleView("images");
}

async function rerunDomains() {
    console.log("rerunDomains");

    document.getElementById("domains-btn").disabled = true;

    // Clear Cookies table
    $('#domainsTable').DataTable().clear().draw();
    $('#domainsTable').DataTable().destroy();

    document.getElementById("domains-btn").disabled = false;
    checkDomains = false;
    useCacheDomains = false;
    await overlay("addOverlay", "Running Domains", "");
    await toggleView("domains");
    await overlay("removeOverlay", "", "");
    await toggleView("domains");
}


// ------------------------------------- MAIN ------------------------------------- //


async function runLanguageTool() {
    console.log("-------------------");
    console.log("runLanguageTool");

    document.getElementById("spelling-btn").disabled = true;

    // Get pageIframe, codeIframe
    let pageIframe = document.getElementById('mainPage').contentWindow.document;
    let codeIframe = document.getElementById('mainCode').contentWindow.document;
    let siteUrl = await getSiteUrl();

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
        } else {
            // Try to detect the general language, if the lang attribute has only two chars ("en")
            for (let i = 0; i < langValues.length; i++) {
                // If detected general lang use the first variant on the list
                if (langValues[i].split("-")[0] === detectedLang) {
                    langCode = langValues[i];
                    break;
                }
                // If it didn't find a general lang, default to en-GB
                langCode = "en-GB";
            }
        }
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

    // Get all spellTagsElem ->  Empty strings -> Only spaces -> Ignore duplicates
    spellTagsElem = [...new Set(pageIframe.body.innerText.split("\n").filter(e => e).filter(e => e !== " "))].join(" ");

    // Get SpellCheckJSON
    try {
        let spellCheckJSON = await $.post(languageToolPost, {
            content: spellTagsElem, langCode: langCode, url: siteUrl, cache: useCacheLanguageTool
        }, function (result) {
            return result;
        });

        // Check is cache
        if (spellCheckJSON["useCache"]) {
            let cacheDate = spellCheckJSON["cacheDate"];
            document.getElementById("spelling-cacheDate").innerText = "Last scanned: " + cacheDate;
            document.getElementById("spelling-cache").hidden = false;
        } else {
            document.getElementById("spelling-cache").hidden = true;
        }

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
                if (!(dict.includes(error)) && error.length >= 3 && !(/\s/g.test(error))) {

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
                preset: 'prose', find: error, wrap: 'spellerror', wrapClass: "shiny_red", wrapId: "spell_" + error
            });

            // Highlight Spelling Errors on Code View
            findAndReplaceDOMText(codeIframe.getElementById("htmlCode"), {
                preset: 'prose', find: error, wrap: 'spellerror', wrapClass: "shiny_red", wrapId: "spell_" + error
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
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Spelling Errors'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Congratulations! We didn't find any possible spelling mistakes."}, "order": [[3, "desc"]], data: dataset, "autoWidth": false, "columnDefs": [{
                "width": "20%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "25%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "25%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 4, "render": function (data, type, row) {
                    return "<button class='addDictionary bg-transparent border-0 text-lfi-green' onclick='addDictionary(\"" + row + "\")'><b>Add to Dictionary</b></button>" + "|" + "<button class='bg-transparent border-0 text-lfi-green' onclick='gotoSpellError(\"spell_" + row[0] + "\")'><b>View in Page</b></button>";
                },
            }]
        });

        // Update GENERAL INFO
        let mostError = "Good Job!";
        let leastError = "Good Job!";
        let totalError = "0 - Good Job!"
        if (dataset.length === 0) {
            document.getElementById("spelling-total-errors").style.color = "green";
        } else {
            document.getElementById("spelling-total-errors").style.color = "red";
            totalError = dataset.length.toString();
            mostError = dataset[0][0];
            leastError = dataset[dataset.length - 1][0];

            document.getElementById("spelling-total-errors").innerText = totalError;
            document.getElementById("spelling-most-errors").innerText = mostError;
            document.getElementById("spelling-least-errors").innerText = leastError;
        }
    } catch (Ex) {
        // Initialize Errors Table
        $('#errorsTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Spelling Errors'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Failed to load information."}, "order": [[3, "desc"]], data: [], "autoWidth": false, "columnDefs": [{
                "width": "20%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "25%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "25%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 4, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });
        document.getElementById("spelling-total-errors").innerText = "None";
        document.getElementById("spelling-most-errors").innerText = "None";
        document.getElementById("spelling-least-errors").innerText = "None";
    }


    await toggleSpellView("errorsTableDiv");
    try {
        document.getElementById("overlay_spelling_mark").style.color = "rgba(var(--lfi-green-rgb)";
    } catch (e) {
    }

    console.log("-------------------");
}

async function runAccessibility() {
    console.log("-------------------------");
    console.log("runAccessibility");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Get pageIframe
    let pageIframe = document.getElementById('mainPage').contentWindow.document;

    // Get codeIframe
    let codeIframe = document.getElementById('mainCode').contentWindow.document;

    // Get WCAG Level
    let WCAGLevel = document.getElementById("WCAG-level-list").value;

    try {
        // Get accessibilityJSON
        let accessibilityJSON = await $.post(accessibilityPost, {
            url: siteUrl, level: WCAGLevel, cache: useCacheAccessibility
        }, function (result) {
            return result;
        });

        // Check is cache
        if (accessibilityJSON["useCache"]) {
            let cacheDate = accessibilityJSON["cacheDate"];
            document.getElementById("accessibility-cacheDate").innerText = "Last scanned: " + cacheDate;
            document.getElementById("accessibility-cache").hidden = false;
        } else {
            document.getElementById("accessibility-cache").hidden = true;
        }

        // Iterate over all 3 categories
        let snifferCategories = ["Errors", "Notices", "Warnings"];
        let errorsDataset = [];
        let noticesDataset = [];
        let warningsDataset = [];
        let errorsCounter = 0;

        // Iterate over every entry on the category
        for (let i = 0; i < snifferCategories.length; i++) {
            let category = snifferCategories[i];

            // Get category JSON
            let snifferCategory = accessibilityJSON[category];

            // Add entry to Table
            for (let j = 0; j < snifferCategory.length; j++) {
                let entry = snifferCategory[j];
                let guideline = ((entry["Guideline"] !== "null") ? entry["Guideline"].replaceAll(".", " ") : "N/A");
                let message = ((entry["Message"] !== "null") ? entry["Message"] : "N/A");
                let tag = ((entry["Tag"] !== "null") ? entry["Tag"] : "N/A");
                let code = ((entry["Code"] !== "null") ? entry["Code"] : "N/A");

                // Add entry to respective dataset
                if (category === "Errors") {
                    errorsDataset.push([guideline, message, tag]);
                } else if (category === "Notices") {
                    noticesDataset.push([guideline, message, tag]);
                } else if (category === "Warnings") {
                    warningsDataset.push([guideline, message, tag]);
                }

                // Highlight div on Desktop View && Code View
                if (code !== "N/A" && category === "Errors" && (!(code.includes("<html>") || code.includes("<head>") || code.includes("<body>")))) {
                    errorsCounter += 1;

                    // Desktop View
                    pageIframe.body.innerHTML = pageIframe.body.innerHTML.replace(code.split(">")[0], code.split(">")[0] + "id='accessibilityerror_" + errorsCounter + "'");
                    let accessibilityErrorElemDesktop = pageIframe.getElementById("accessibilityerror_" + errorsCounter);
                    if (accessibilityErrorElemDesktop) {
                        accessibilityErrorElemDesktop.classList.add("accessibilityerror_shiny_red");
                        errorsDataset[errorsDataset.length - 1].push("accessibilityerror_" + errorsCounter);
                    }

                    // Code View
                    let tmpIframe = document.getElementById('tmpCode');
                    tmpIframe = tmpIframe.contentWindow.document;
                    tmpIframe.open();
                    tmpIframe.write('<pre><code id="tmphtmlCode">' + code.replaceAll("<", "&lt;").replaceAll(">", "&gt;") + '</code></pre>');
                    tmpIframe.close();
                    await w3CodeColor(document.getElementById('tmpCode').contentWindow.document.getElementById("tmphtmlCode"));
                    let tmpElem = document.getElementById('tmpCode').contentWindow.document.getElementById("tmphtmlCode").firstElementChild;
                    let newElem = tmpElem.cloneNode(true);
                    newElem.id = "accessibilityerror_" + errorsCounter;
                    newElem.classList.add("accessibilityerror_shiny_red");
                    if (newElem) {
                        codeIframe.getElementById("htmlCode").innerHTML = codeIframe.getElementById("htmlCode").innerHTML.replaceAll(tmpElem.outerHTML, newElem.outerHTML);
                    }
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
            document.getElementById("accessibility-total").style.color = "green";
        } else {
            document.getElementById("accessibility-total").style.color = "red";
        }

        if (errors === 0) {
            errors = "0 - Good Job!";
            document.getElementById("accessibility-errors").style.color = "green";
        } else {
            document.getElementById("accessibility-errors").style.color = "red";
        }

        if (notices === 0) {
            notices = "0 - Good Job!";
            document.getElementById("accessibility-notices").style.color = "green";
        } else {
            document.getElementById("accessibility-notices").style.color = "red";
        }

        if (warnings === 0) {
            warnings = "0 - Good Job!";
            document.getElementById("accessibility-warnings").style.color = "green";
        } else {
            document.getElementById("accessibility-warnings").style.color = "red";
        }

        document.getElementById("accessibility-total").innerText = total.toString();
        document.getElementById("accessibility-errors").innerText = errors.toString();
        document.getElementById("accessibility-notices").innerText = notices.toString();
        document.getElementById("accessibility-warnings").innerText = warnings.toString();

        // Initialize Errors Table
        $('#snifferErrorsTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Accessibility Errors Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Congratulations! We didn't find any errors in the last scan."}, "order": [[0, "asc"]], data: errorsDataset, "autoWidth": false, "columnDefs": [{
                "width": "25%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "45%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 3, "render": function (data, type, row) {
                    if (data !== undefined) {
                        return "<button class='bg-transparent border-0 text-lfi-green' onclick='gotoAccessibilityError(\"desktop\", \"" + data + "\")'><b>View in Page</b></button>" + "<button class='bg-transparent border-0 text-lfi-green' onclick='gotoAccessibilityError(\"code\", \"" + data + "\")'><b>View in Code</b></button>";
                    } else {
                        return "";
                    }
                },
            }]
        });

        // Initialize Errors Table
        $('#snifferNoticesTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Accessibility Notices Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Congratulations! We didn't find any notices in the last scan."}, "order": [[0, "asc"]], data: noticesDataset, "autoWidth": false, "columnDefs": [{
                "width": "30%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "60%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });

        // Initialize Errors Table
        $('#snifferWarningsTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Accessibility Warnings Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Congratulations! We didn't find any warnings in the last scan."}, "order": [[0, "asc"]], data: warningsDataset, "autoWidth": false, "columnDefs": [{
                "width": "30%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "60%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });

    } catch (Ex) {
        console.log(Ex);

        // Initialize Errors Table
        $('#snifferErrorsTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Accessibility Errors Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Failed to load information."}, "order": [[0, "asc"]], data: [], "autoWidth": false, "columnDefs": [{
                "width": "25%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "45%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });

        // Initialize Errors Table
        $('#snifferNoticesTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Accessibility Notices Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Failed to load information."}, "order": [[0, "asc"]], data: [], "autoWidth": false, "columnDefs": [{
                "width": "30%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "60%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });

        // Initialize Errors Table
        $('#snifferWarningsTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Accessibility Warnings Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Failed to load information."}, "order": [[0, "asc"]], data: [], "autoWidth": false, "columnDefs": [{
                "width": "30%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "60%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });

        document.getElementById("accessibility-total").innerText = "None";
        document.getElementById("accessibility-errors").innerText = "None";
        document.getElementById("accessibility-notices").innerText = "None";
        document.getElementById("accessibility-warnings").innerText = "None";
    }

    try {
        document.getElementById("overlay_accessibility_mark").style.color = "rgba(var(--lfi-green-rgb)";
    } catch (e) {
    }
}

async function runCookies() {
    console.log("-------------------------");
    console.log("runCookies");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    try {
        // Get cookiesJSON
        let cookiesJSON = await $.post(cookiesPost, {
            url: siteUrl, cache: useCacheCookies
        }, function (result) {
            return result;
        });

        // Check is cache
        if (cookiesJSON["useCache"]) {
            let cacheDate = cookiesJSON["cacheDate"];
            document.getElementById("cookies-cacheDate").innerText = "Last scanned: " + cacheDate;
            document.getElementById("cookies-cache").hidden = false;
        } else {
            document.getElementById("cookies-cache").hidden = true;
        }

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
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Cookies Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "No data available in table"}, "order": [[0, "asc"]], data: dataset, "autoWidth": false, "columnDefs": [{
                "width": "10%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "40%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 4, "render": function (data, type, row) {
                    let colorClass = "";
                    if (data === false) {
                        colorClass = " class='dataRed'";
                    } else if (data === true) {
                        colorClass = " class='dataGreen'";
                    }
                    return "<span" + colorClass + ">" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 5, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });
        document.getElementById("cookies-total").innerText = dataset.length.toString();
    } catch (Ex) {
        // Initialize Errors Table
        $('#cookiesTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Cookies Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Failed to load information."}, "order": [[0, "asc"]], data: [], "autoWidth": false, "columnDefs": [{
                "width": "10%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "40%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 4, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 5, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });
        document.getElementById("cookies-total").innerText = "None";
    }

    try {
        document.getElementById("overlay_cookies_mark").style.color = "rgba(var(--lfi-green-rgb)";
    } catch (e) {
    }
}

async function runTechnologies() {
    console.log("-------------------------");
    console.log("runTechnologies");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    try {
        // Get cookiesJSON
        let wappalyzerJSON = await $.post(wappalyzerPost, {
            url: siteUrl, cache: useCacheTechnologies
        }, function (result) {
            return result;
        });

        // Check is cache
        if (wappalyzerJSON["useCache"]) {
            let cacheDate = wappalyzerJSON["cacheDate"];
            document.getElementById("technologies-cacheDate").innerText = "Last scanned: " + cacheDate;
            document.getElementById("technologies-cache").hidden = false;
        } else {
            document.getElementById("technologies-cache").hidden = true;
        }

        let dataset = [];
        let categoriesCounter = {};
        wappalyzerJSON = wappalyzerJSON["Wappalyzer"]["Wappalyzer"]["technologies"];
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
        if (categoriesCounter.length !== 0) {
            document.getElementById("technologies-most").innerText = categoriesCounter[0][0];
        }


        // Initialize Technologies Table
        $('#technologiesTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Technologies Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "No data available in table"}, "order": [[0, "asc"]], data: dataset, "autoWidth": false, "columnDefs": [{
                "width": "5%", "targets": 0, "render": function (data, type, row) {
                    return "<img width='30px' height='30px' src='https://www.wappalyzer.com/images/icons/" + data + "' alt='" + data + " Icon'/>";
                },
            }, {
                "width": "20%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 2, "render": function (data, type, row) {
                    return "<a target='_blank' href='" + data + "'>" + data + "</a>";
                },
            }, {
                "width": "40%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 4, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },]
        });

    } catch (Ex) {
        // Initialize Technologies Table
        $('#technologiesTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Technologies Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Failed to load information"}, "order": [[0, "asc"]], data: [], "autoWidth": false, "columnDefs": [{
                "width": "5%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "40%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 4, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            },]
        });
        document.getElementById("technologies-total").innerText = "None";
        document.getElementById("technologies-most").innerText = "None";
    }

    try {
        document.getElementById("overlay_technologies_mark").style.color = "rgba(var(--lfi-green-rgb)";
    } catch (e) {
    }

}

async function runImages() {
    console.log("-------------------------");
    console.log("runImages");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    try {
        // Get imagesJSON
        let imagesJSON = await $.post(imagesPost, {
            url: siteUrl, cache: useCacheImages
        }, function (result) {
            return result;
        });

        // Check is cache
        if (imagesJSON["useCache"]) {
            let cacheDate = imagesJSON["cacheDate"];
            document.getElementById("images-cacheDate").innerText = "Last scanned: " + cacheDate;
            document.getElementById("images-cache").hidden = false;
        } else {
            document.getElementById("images-cache").hidden = true;
        }

        let dataset = [];
        let imagesCounter = {};
        let largeCounter = 0;
        let brokenCounter = 0
        imagesJSON = imagesJSON["images"];
        for (let i = 0; i < imagesJSON.length; i++) {
            let entry = imagesJSON[i];
            let url = entry["url"];
            let filename = entry["filename"];
            let statuscode = entry["statuscode"];
            let size = entry["size"];
            let alt = entry["alt"];
            let dimensions = entry["dimensions"];
            let format = entry["format"];

            if (size > "500") {
                largeCounter += 1;
            }

            if (statuscode >= "400" && statuscode < "600") {
                brokenCounter += 1;
                url = "images/unavailable-image.jpg";
            }

            if (format in imagesCounter) {
                imagesCounter[format] += 1;
            } else {
                imagesCounter[format] = 1;
            }

            dataset.push([url, filename, statuscode, size, alt, dimensions, format]);
        }

        // Sort the array based on the count element
        imagesCounter = Object.keys(imagesCounter).map(function (key) {
            return [key, imagesCounter[key]];
        }).sort(function (first, second) {
            return second[6] - first[6];
        });
        document.getElementById("images-total").innerText = dataset.length.toString();
        if (imagesCounter.length !== 0) {
            document.getElementById("images-most").innerText = imagesCounter[0][0];
        }

        // Update GENERAL INFO
        if (brokenCounter === 0) {
            brokenCounter = "0 - Good Job!";
            document.getElementById("images-broken").style.color = "green";
        } else {
            document.getElementById("images-broken").style.color = "red";
        }

        document.getElementById("images-large").innerText = largeCounter.toString();
        document.getElementById("images-broken").innerText = brokenCounter.toString();

        // Initialize Errors Table
        $('#imagesTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Images Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "No data available in table"}, "order": [[0, "asc"]], data: dataset, "autoWidth": false, "columnDefs": [{
                "width": "10%", "targets": 0, "render": function (data, type, row) {
                    return "<button class='bg-transparent border-0' onclick='showImage(\"" + data + "\")'><img src='" + data + "' width='100px' height='auto' alt='Image'></button>"
                },
            }, {
                "width": "15%", "className": "truncate", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    let colorClass;
                    if (data.includes("20")) {
                        colorClass = " class='dataGreen'"
                    } else if (data.includes("30")) {
                        colorClass = " class='dataOrange'"
                    } else if (data.includes("40") || data.includes("50")) {
                        colorClass = " class='dataRed'"
                    } else {
                        colorClass = "";
                        data = "Couldn't get status code";
                    }

                    return "<span" + colorClass + ">" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 3, "render": function (data, type, row) {
                    let color;
                    if (data > 0 && data < 300) {
                        color = "mediumseagreen";
                    } else if (data >= 300 && data <= 500) {
                        color = "orange";
                    } else if (data > 500) {
                        color = "red";
                    } else {
                        color = "";
                    }
                    return "<span style='padding:4px; background-color: " + color + "'>" + data + "</span>";
                },
            }, {
                "width": "25%", "targets": 4, "render": function (data, type, row) {
                    if (!(data)) {
                        data = "None";
                    }
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 5, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 6, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });

    } catch (Ex) {
        // Update GENERAL INFO
        document.getElementById("images-total").innerText = "None";
        document.getElementById("images-most").innerText = "None";
        document.getElementById("images-large").innerText = "None";
        document.getElementById("images-broken").innerText = "None";

        // Initialize Errors Table
        $('#imagesTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Images Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Failed to load information."}, "order": [[0, "asc"]], data: [], "autoWidth": false, "columnDefs": [{
                "width": "10%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "25%", "targets": 4, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 5, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "15%", "targets": 6, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });
    }


    try {
        document.getElementById("overlay_images_mark").style.color = "rgba(var(--lfi-green-rgb)";
    } catch (e) {
    }

}

async function runDomains() {
    console.log("-------------------------");
    console.log("runDomains");

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    try {
        // Get imagesJSON
        let domainsJSON = await $.post(domainsPost, {
            url: siteUrl, cache: useCacheDomains
        }, function (result) {
            return result;
        });

        // Check is cache
        if (domainsJSON["useCache"]) {
            let cacheDate = domainsJSON["cacheDate"];
            document.getElementById("domains-cacheDate").innerText = "Last scanned: " + cacheDate;
            document.getElementById("domains-cache").hidden = false;
        } else {
            document.getElementById("domains-cache").hidden = true;
        }

        let dataset = [];
        domainsJSON = domainsJSON["domains"];
        for (let i = 0; i < domainsJSON.length; i++) {
            let entry = domainsJSON[i];
            let issuer_ca_id = entry["issuer_ca_id"];
            let issuer_name = entry["issuer_name"];
            let common_name = entry["common_name"];
            let name_value = entry["name_value"];
            let entry_timestamp = entry["entry_timestamp"];
            dataset.push([issuer_ca_id, issuer_name, common_name, name_value, entry_timestamp]);
        }
        document.getElementById("domains-total").innerText = dataset.length.toString();

        // Initialize Domains Table
        $('#domainsTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Domains Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "No data available in table"}, "order": [[0, "asc"]], data: dataset, "autoWidth": false, "columnDefs": [{
                "width": "10%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "30%", "className": "truncate", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "30%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 4, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });

    } catch (Ex) {
        document.getElementById("domains-total").innerText = "None";

        // Initialize Errors Table
        $('#domainsTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Domains Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Failed to load information."}, "order": [[0, "asc"]], data: [], "autoWidth": false, "columnDefs": [{
                "width": "10%", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "30%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "30%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "10%", "targets": 4, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });
    }

    try {
        document.getElementById("overlay_domains_mark").style.color = "rgba(var(--lfi-green-rgb)";
    } catch (e) {
    }
}

async function runLighthouse() {
    console.log("-------------------------");
    console.log("runLighthouse");

    checkLighthouse = "running";
    $("#lighthouseModal").modal("hide");

    // Show Running Notification
    document.getElementById("lighthouseNotificationTitle").innerText = "Your Lighthouse Report is running.";
    document.getElementById("lighthouseNotificationBtn").hidden = true;
    $('#lighthouseNotification').toast('show');

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    console.log("siteUrl: " + siteUrl);
    console.log("Device: " + device);

    try {
        // Get lighthouseJson
        let lighthouseJson = await $.post(lighthousePost, {
            url: siteUrl, device: device, cache: useCacheLighthouse
        }, function (result) {
            return result;
        });

        // Toggle Lighthouse Section
        document.getElementById("mainLighthouse").src = inspectorUrl + "/Lighthouse?" + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
        document.getElementById("mainLighthouse").hidden = false;

        // Show Ready Notification
        document.getElementById("lighthouseNotificationTitle").innerText = "Your Lighthouse Report is ready.";
        document.getElementById("lighthouseNotificationBtn").hidden = false;
        $('#lighthouseNotification').toast('show');

        checkLighthouse = true;
    } catch (Ex) {
        console.log(Ex);
        checkLighthouse = false;
        await setErrorModal("", "Lighthouse was unable to reliably load the page you requested.<br>Please try again.");
    }

    console.log("-------------------");
}

async function runLinks() {
    console.log("-------------------------");
    console.log("runLinks");

    checkLinks = "running";
    $("#linksModal").modal("hide");

    // Show Running Notification
    document.getElementById("linksNotificationTitle").innerText = "Your Links Report is running.";
    document.getElementById("linksNotificationBtn").hidden = true;
    $('#linksNotification').toast('show');

    // Get siteUrl
    let siteUrl = await getSiteUrl();

    // Get pageIframe, codeIframe
    let pageIframe = document.getElementById('mainPage').contentWindow.document;
    let codeIframe = document.getElementById('mainCode').contentWindow.document;

    // Set links counter
    let totalLinksCount = 0;
    let extLinksCount = 0;
    let intLinksCount = 0;
    let brokenLinksCount = 0;

    try {
        // Check if broken link
        let linkJSON = await $.post(linksPost, {
            url: siteUrl, cache: useCacheLinks
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
                let ogLink = value[2];

                // Hightlighg Broken Link
                let links = Array.from(pageIframe.querySelectorAll('a'));
                for (let i = 0; i < links.length; i++) {
                    let linkElem = links[i];
                    let linkHref = linkElem.href

                    if (linkHref === ogLink && (status >= "400" && status < "600")) {
                        // Highlight Broken Link in HTML View
                        linkElem.style.cssText += 'outline: 2px solid red;';
                        linkElem.id = "blink_" + brokenLinksCount;

                        // Update error color on html Code
                        codeIframe.documentElement.innerHTML = codeIframe.documentElement.innerHTML.replaceAll(linkHref, "<span style='outline: 2px solid red'>" + linkHref + "</span>");
                    }
                }

                // Add to dataset
                dataset.push([url, status, origin]);

                // Set links counters
                totalLinksCount += 1;
                if (origin === "External") {
                    extLinksCount += 1;
                } else if (origin === "Internal") {
                    intLinksCount += 1;
                }
                if (status >= "400" && status < "600") {
                    dataset[dataset.length - 1].push("blink_" + brokenLinksCount);
                    brokenLinksCount += 1;
                }
            });
        }

        // Initialize Errors Table
        $('#linksTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Links Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "No data available in table"}, "order": [[0, "asc"]], data: dataset, "autoWidth": false, "columnDefs": [{
                "width": "40%", "className": "truncate", "targets": 0, "render": function (data, type, row) {
                    return "<a target='_blank' href='" + data + "'>" + data + "</a>";
                },
            }, {
                "width": "20%", "targets": 1, "render": function (data, type, row) {
                    let status = data.split(",");
                    let html = "";
                    let colorClass;
                    status.forEach(function (code) {
                        if (code.includes("20")) {
                            colorClass = " class='dataGreen'"
                        } else if (code.includes("30")) {
                            colorClass = " class='dataOrange'"
                        } else if (code.includes("40") || code.includes("50")) {
                            colorClass = " class='dataRed'"
                        } else {
                            colorClass = "";
                            code = "Couldn't get status code";
                        }

                        html += "<span" + colorClass + ">" + code + "</span>";
                    });
                    return html;
                },
            }, {
                "width": "20%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 3, "render": function (data, type, row) {
                    if (data !== undefined) {
                        return "<button class='bg-transparent border-0 text-lfi-green' onclick='gotoLink(\"" + data + "\")'><b>View in Page</b></button>";
                    } else {
                        return "";
                    }
                },
            }]
        });

        // Update GENERAL INFO
        if (brokenLinksCount === 0) {
            brokenLinksCount = "0 - Great Job!"
            document.getElementById("links-broken").style.color = "green";
        } else {
            document.getElementById("links-broken").style.color = "red";
        }

        document.getElementById("links-total").innerText = totalLinksCount;
        document.getElementById("links-ext").innerText = extLinksCount;
        document.getElementById("links-int").innerText = intLinksCount;
        document.getElementById("links-broken").innerText = brokenLinksCount;

        // Show Ready Notification
        document.getElementById("linksNotificationTitle").innerText = "Your Links Report is ready.";
        document.getElementById("linksNotificationBtn").hidden = false;
        $('#linksNotification').toast('show');

    } catch (Ex) {
        // Initialize Errors Table
        $('#linksTable').DataTable({
            dom: 'Blfrtip', buttons: [{text: 'Export', extend: 'csv', filename: 'Links Report'}], paginate: false, "oLanguage": {"sSearch": "Filter:"}, "language": {"emptyTable": "Failed to load information."}, "order": [[0, "asc"]], data: [], "autoWidth": false, "columnDefs": [{
                "width": "40%", "className": "truncate", "targets": 0, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 1, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 2, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }, {
                "width": "20%", "targets": 3, "render": function (data, type, row) {
                    return "<span>" + data + "</span>";
                },
            }]
        });
        document.getElementById("links-total").innerText = "None";
        document.getElementById("links-ext").innerText = "None";
        document.getElementById("links-int").innerText = "None";
        document.getElementById("links-broken").innerText = "None";

        // Show Ready Notification
        document.getElementById("linksNotificationTitle").innerText = "Your Links Report failed to load information.";
        document.getElementById("linksNotificationBtn").hidden = false;
        $('#linksNotification').toast('show');
    }

    checkLinks = true;
    console.log("-------------------");
}

async function runMain(url, mainURL, lang, token, edit, view) {
    console.log("-------------------------");
    console.log('url:', url);
    console.log("mainURL:", mainURL);
    console.log('url:', url);
    console.log("token:", token);
    console.log("edit:", edit);
    console.log("view:", view);

    // Add overlay
    await overlay("addOverlay", "Loading page", "");

    // Set URL on search bar
    document.getElementById("searchURL").value = mainURL;

    // Set Language on Languages Dropdown list
    if (lang === "null") {
        document.getElementById("languages-list").value = "auto";
    } else {
        document.getElementById("languages-list").value = lang;
    }

    // Get pageIframe
    let pageIframe = document.getElementById('mainPage');

    // Load iframe
    let data = await $.get(downloaderPost + "?url=" + mainURL, function (htmlContent) {
        return htmlContent;
    });
    data = data.contents;

    if (data === null || data === "null") {
        // Remove overlay
        await overlay("removeOverlay", "", "");

        // Set Error Message
        await setErrorModal("Something went wrong", "Sorry, we couldn't load this page </br><b>" + mainURL + "</b></br>Please check you URL");
    } else {
        // Replace href to abs hrefs
        data = data.replace(/<head([^>]*)>/i, `<head$1><base href="${mainURL}">`);

        // Set iframe srcdoc
        pageIframe.srcdoc = data;

        // Wait for pageIframe to load
        pageIframe.addEventListener("load", async function () {
            // Get pageIframe, codeIframe
            let pageIframe = document.getElementById('mainPage');
            let codeIframe = document.getElementById('mainCode');

            // Set codeIframe
            codeIframe = codeIframe.contentWindow.document;
            codeIframe.open();
            codeIframe.write('<pre><code id="htmlCode">' + pageIframe.contentWindow.document.documentElement.outerHTML.replaceAll("<", "&lt;").replaceAll(">", "&gt;") + '</code></pre>');
            codeIframe.close();

            // HTMLCode Syntax Highlighter
            await w3CodeColor(document.getElementById('mainCode').contentWindow.document.getElementById("htmlCode"));

            // Add Stylesheet to iframe head Page and Code
            let iframeCSS = inspectorUrl + "/css/iframe.css";
            pageIframe = pageIframe.contentWindow.document;
            pageIframe.head.innerHTML = pageIframe.head.innerHTML + "<link type='text/css' rel='Stylesheet' href='" + iframeCSS + "' />";
            codeIframe.head.innerHTML = codeIframe.head.innerHTML + "<link type='text/css' rel='Stylesheet' href='" + iframeCSS + "' />";

            // Check Drupal || Wordpress || Adobe CMS || Leaf CMS -> Edit Btn
            await checkCMS();

            if (edit === "true") {
                if (cmsName === "Leaf CMS") {
                    // Disable btns
                    await enableDisableActions("disable");
                    await removeCookies();
                    await editPage();
                }

                await overlay("removeOverlay", "", "");
                await enableDisableActions("disable");
                document.getElementById("code-btn").disabled = false;
                return;
            }

            // Remove overlay
            await overlay("removeOverlay", "", "");

            // Auto Run
            await overlay("addOverlay", "Running Reports", "");
            document.getElementById("overlaySndMessage").innerHTML = "<p>Spelling <i id='overlay_spelling_mark' class='fas fa-check-square'></i></p><p>Accessibility <i id='overlay_accessibility_mark' class='fas fa-check-square'></i></p><p>Cookies <i id='overlay_cookies_mark' class='fas fa-check-square'></i></p><p>Technologies <i id='overlay_technologies_mark' class='fas fa-check-square'></i></p><p>Images <i id='overlay_images_mark' class='fas fa-check-square'></i></p><p>Domains <i id='overlay_domains_mark' class='fas fa-check-square'></i></p>"
            toggleView("spelling");
            toggleView("accessibility");
            toggleView("cookies");
            toggleView("technologies");
            toggleView("images");
            toggleView("domains");
            toggleView("desktop");

            // Wait for reports to finish running
            while (await checkReports() === false) {
                await sleep(1);
            }

            // Check if default view is passed
            if (["spelling", "accessibility", "cookies", "technologies", "images", "domains", "desktop", "mobile", "code"].includes(view)) {
                await toggleView(view);
            }

            // Remove Cookies
            await removeCookies();
        });
    }
}

