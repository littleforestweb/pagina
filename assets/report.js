// Toggle Sidebar Section On/Off

let lfi_settings = document.getElementById('lfi_settings-title');
lfi_settings.addEventListener('click', () => {
    if (document.getElementById("lfi_settings-li").style.display == "none") {
        document.getElementById("lfi_settings-li").style.display = "block";
    } else {
        document.getElementById("lfi_settings-li").style.display = "none";
    }
});

let lfi_spelling_errors = document.getElementById('lfi_spelling-title');
lfi_spelling_errors.addEventListener('click', () => {
    if (document.getElementById("lfi_spelling-li").style.display == "none") {
        document.getElementById("lfi_spelling-li").style.display = "block";
    } else {
        document.getElementById("lfi_spelling-li").style.display = "none";
    }
});

let lighthouse = document.getElementById('lfi_lighthouse-title');
lighthouse.addEventListener('click', () => {
    if (document.getElementById("lfi_lighthouse-li").style.display == "none") {
        document.getElementById("lfi_lighthouse-li").style.display = "block";
    } else {
        document.getElementById("lfi_lighthouse-li").style.display = "none";
    }
});

let generalInfo = document.getElementById('lfi_general-title');
generalInfo.addEventListener('click', () => {
    if (document.getElementById("lfi_general-li").style.display == "none") {
        document.getElementById("lfi_general-li").style.display = "block";
    } else {
        document.getElementById("lfi_general-li").style.display = "none";
    }
});

// Functions

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

async function runLighthouse() {
    console.log("runLighthouse")

    // Insert overlay
    await overlay("addOverlay", "Lighthouse");

    // Get selected categories
    let categories = "";
    let cat_performance = document.getElementById("cat_performance").checked;
    let cat_pwa = document.getElementById("cat_pwa").checked;
    let cat_bp = document.getElementById("cat_bp").checked;
    let cat_accessibility = document.getElementById("cat_accessibility").checked;
    let cat_seo = document.getElementById("cat_seo").checked;
    if (cat_performance) { categories += "performance,"; }
    if (cat_pwa) { categories += "pwa,"; }
    if (cat_bp) { categories += "best-practices"; }
    if (cat_accessibility) { categories += "accessibility,"; }
    if (cat_seo) { categories += "seo,"; }

    // Get selected device
    let device;
    let device_mobile = document.getElementById("dev_mobile").checked;
    let device_desktop = document.getElementById("dev_desktop").checked;
    if (device_mobile) { device = "mobile"; } else if (device_desktop) { device = "desktop"; }

    // Get lighthouseJson
    let siteUrl = window.location.href;
    let lighthouseURL = "https://inspector.littleforest.co.uk/InspectorWS/LighthouseServlet?"
    let lighthouseJson = await getRequest(lighthouseURL + "url=" + siteUrl + "&cats=" + categories.slice(0, -1) + "&device=" + device);

    // Get lighthouseInfo div
    let lfi_lighthouseInfo = document.getElementById("lfi_lighthouseInfo");

    // Check if Lighthouse ran successfully
    try {
        lighthouseJson["runtimeError"]["code"];
        lfi_lighthouseInfo.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.<br>You can try refreshing the page and retry.</li>";
    } catch (Ex) {
        try {

            // Iterate over every Category and set the Tittle and Score
            categories.split(",").forEach(cat => {
                let catScore = lighthouseJson["categories"][cat]["score"] * 100;
                let catTitle = lighthouseJson["categories"][cat]["title"];
                lfi_lighthouseInfo.innerHTML += "<li><a></a>" + catTitle + " - " + catScore + " % </li > ";
            })

            // Add Read More -> Open the HTML File
            lfi_lighthouseInfo.innerHTML += "<li><a id='lighthouseReadMore' href='#'><b>" + "Read More" + "</b></a></li>";
            let lighthouseReadMore = document.getElementById("lighthouseReadMore");
            lighthouseReadMore.target = "_blank";
            lighthouseReadMore.href = lighthouseURL + "url=null" + "&cats=null" + "&view=" + lighthouseJson["htmlReport"];
            document.getElementById("lfi_lighthouse-section").removeAttribute("hidden");
        } catch (Ex) {
            lfi_lighthouseInfo.innerHTML = "<li>Lighthouse was unable to reliably load the page you requested.<br>You can try refreshing the page and retry.</li>";
        }
        document.getElementById("lfi_lighthouse-section").removeAttribute("hidden");
    }

    // Hide runLighthouse button
    document.getElementById("runLighthouse").hidden = true;

    // Remove overlay
    await overlay("removeOverlay", "");
}