/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */

// ------------------ Toggle Sidebar Section On/Off ------------------ //

//// ACCESSIBILITY
//document.getElementById("accessibility-li").style.display = "none";
//document.getElementById('accessibility-title').addEventListener('click', () => {
//    if (document.getElementById("accessibility-li").style.display === "none") {
//        document.getElementById("accessibility-li").style.display = "block";
//    } else {
//        document.getElementById("accessibility-li").style.display = "none";
//    }
//});

//// CONTENT
//document.getElementById("content-li").style.display = "none";
//document.getElementById('content-title').addEventListener('click', () => {
//    if (document.getElementById("content-li").style.display === "none") {
//        document.getElementById("content-li").style.display = "block";
//    } else {
//        document.getElementById("content-li").style.display = "none";
//    }
//});

// // LINKS
// document.getElementById("links-li").style.display = "none";
// document.getElementById('links-title').addEventListener('click', () => {
//     if (document.getElementById("links-li").style.display === "none") {
//         document.getElementById("links-li").style.display = "block";
//     } else {
//         document.getElementById("links-li").style.display = "none";
//     }
// });

// SPELLING
document.getElementById("spelling-li").style.display = "none";
document.getElementById('spelling-title').addEventListener('click', () => {
    if (document.getElementById("spelling-li").style.display === "none") {
        document.getElementById("spelling-li").style.display = "block";
    } else {
        document.getElementById("spelling-li").style.display = "none";
    }
});

// LIGHTHOUSE
document.getElementById("lighthouse-li").style.display = "none";
document.getElementById('lighthouse-title').addEventListener('click', () => {
    if (document.getElementById("lighthouse-li").style.display === "none") {
        document.getElementById("lighthouse-li").style.display = "block";
    } else {
        document.getElementById("lighthouse-li").style.display = "none";
    }
});


//// TECHNOLOGIES
//document.getElementById("technologies-li").style.display = "none";
//document.getElementById('technologies-title').addEventListener('click', () => {
//    if (document.getElementById("technologies-li").style.display === "none") {
//        document.getElementById("technologies-li").style.display = "block";
//    } else {
//        document.getElementById("technologies-li").style.display = "none";
//    }
//});


function toggleView(view) {
    if (view === "Page") {
        document.getElementById("mainContent").hidden = false;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainLighthouse").hidden = true;
        document.getElementById("PageBtn").classList.add("active");
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("LighthouseViewBtn").classList.remove("active");
    } else if (view === "HTML") {
        document.getElementById("mainContent").hidden = true;
        document.getElementById("mainCode").hidden = false;
        document.getElementById("mainLighthouse").hidden = true;
        document.getElementById("PageBtn").classList.remove("active");
        document.getElementById("HTMLBtn").classList.add("active");
        document.getElementById("LighthouseViewBtn").classList.remove("active");
    } else if (view === "lighthouseReport") {
        document.getElementById("mainContent").hidden = true;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainLighthouse").hidden = false;
        document.getElementById("PageBtn").classList.remove("active");
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("LighthouseViewBtn").classList.add("active");
    } else {
    }
}

function toggleDeviceView(view) {
    if (view === "Desktop") {
        document.getElementById("desktopView").classList.add("active");
        document.getElementById("mobileView").classList.remove("active");
        document.getElementById("mainContent").classList.remove("iframePageMobile");
    } else if (view === "Mobile") {
        document.getElementById("desktopView").classList.remove("active");
        document.getElementById("mobileView").classList.add("active");
        document.getElementById("mainContent").classList.add("iframePageMobile");
    } else {
    }
}

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

        // Increment counter
        counter = counter + 1
    } catch (Ex) {
        // console.log(Ex);
    }

}

async function getSiteUrl() {
    // Return siteUrl
    return document.getElementById("searchURL").value;
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
        // Enable searchURL
        document.getElementById("searchURL").disabled = false;
        // Enable View Switch
        document.getElementById("PageBtn").disabled = false;
        document.getElementById("HTMLBtn").disabled = false;
        document.getElementById("LighthouseViewBtn").disabled = false;
        // Enable Device View Switch
        document.getElementById("desktopView").disabled = false;
        document.getElementById("mobileView").disabled = false;
        // Enable languages_list
        document.getElementById("languages_list").disabled = false;
        // Enable Lighthouse Btn
        document.getElementById("lighthouse-btn").disabled = false;
        // Enable Dictionary Btn
        document.getElementById("dictionaryModalBtn").disabled = false;
        // Enable Re-Run Spelling Btn
        document.getElementById("rerunSpelling").disabled = false;
    } else {
        // Disable searchURL
        document.getElementById("searchURL").disabled = true;
        // Disable View Switch
        document.getElementById("PageBtn").disabled = true;
        document.getElementById("HTMLBtn").disabled = true;
        document.getElementById("LighthouseViewBtn").disabled = true;
        // Disable Device View Switch
        document.getElementById("desktopView").disabled = true;
        document.getElementById("mobileView").disabled = true;
        // Disable languages_list
        document.getElementById("languages_list").disabled = true;
        // Disable Lighthouse Btn
        document.getElementById("lighthouse-btn").disabled = true;
        // Disable Dictionary Btn
        document.getElementById("dictionaryModalBtn").disabled = true;
        // Disable Re-Run Spelling Btn
        document.getElementById("rerunSpelling").disabled = true;
    }
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
        window.location.href = inspectorUrl + "Inspector?url=" + siteUrl + "&lang=" + language;
    }
}

async function setErrorModal(title, message) {
    if (title === "") {
        title = "Something went wrong!";
    }
    document.getElementById("modalErrorTitle").innerHTML = title;
    document.getElementById("modalErrorBody").innerHTML = message;
    document.getElementById("errorModalBtn").click();
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
    await overlay("addOverlay", "Loading page");

    // Get iframe element
    let iframeElement = document.getElementById('mainContent');

    // Set iframe src to siteUrl
    iframeElement.src = siteUrl;

    // Add EventListener on load
    iframeElement.addEventListener("load", main);
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