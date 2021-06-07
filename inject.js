// LanguageTool Chrome Extension
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/06/07



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRequest(url) {
    try {
        const res = await fetch(url);
        if (url.includes("languagetoolplus")) {
            return await res.json();
        }
        return await res.text();
    } catch (error) {
        return error;
    }
}

async function addSidebar() {
    console.log("start sidebar");

    // set github repo URL
    var url = "https://raw.githubusercontent.com/littleforestweb/pagina/main/";
    // var url = "https://pagina.xhico:8443/";

    // clear current html code
    var blankPage = '<html><head><body style="margin:0;"></body></html>';
    var newHTML = document.open("text/html", "replace");
    newHTML.write(blankPage);
    newHTML.close();

    // add iframe with current url
    var iframe = document.createElement('iframe');
    iframe.id = "maincontent"; iframe.classList.add("iframe-width-300"); iframe.classList.add("iframe");
    iframe.src = fullURL = window.location.href;
    document.body.appendChild(iframe);

    // Add LFisidebar <html>
    var reportHTML = await getRequest(url + "report.html");
    document.body.innerHTML += reportHTML;

    // // Add LFisidebar <script>
    // const reportJS = await getRequest(url + "report.js");
    // var report = document.createElement("script");
    // document.body.appendChild(report).innerHTML = reportJS;

    // Add LFisidebar <style>
    var depCSS = await getRequest(url + "report.css");
    var report = document.createElement("style");
    document.head.appendChild(report).innerHTML = depCSS;

    // insert overlay
    document.getElementById("overlay").style.display = "block";

    // finish
    isSidebarFinish = true;
}

async function runLangTool(lang) {
    console.log("start run");

    // get iframe element
    const iframeContent = document.getElementById('maincontent').contentDocument;

    //  Add totalLinks to GENERALINFO
    const totalLinks = []; const extLinks = []; const intLinks = []; const allLinks = iframeContent.links;
    for (var i = 0; i < allLinks.length; i++) {
        var linkHref = allLinks[i].href;
        totalLinks.push(linkHref);
        if (linkHref.includes(window.location.href)) { intLinks.push(linkHref); } else { extLinks.push(linkHref); }
    }
    document.getElementById("totalLinks").innerText = totalLinks.length;
    document.getElementById("extLinks").innerText = extLinks.length;
    document.getElementById("intLinks").innerText = intLinks.length;

    //  Add totalImages to GENERALINFO
    const totalImages = iframeContent.getElementsByTagName("img").length;
    document.getElementById("totalImages").innerText = totalImages;

    // get all tags
    const tags = iframeContent.getElementsByTagName("p");

    // set errorsDict where key => error and value => [count, color]
    var eDict = {};

    // iterate on every tag
    for (var i = 0; i < tags.length; i++) {

        // set phrase from content array index
        var tag = tags[i]

        //  LanguageTool URL
        const url = "https://api.languagetoolplus.com/v2/check?text=" + tag.innerHTML.replace(/<\/?[^>]+(>|$)/g, "") + "&language=" + lang;

        // get LangTool API Response
        const data = await getRequest(url);

        try {

            // iterate on every error
            data.matches.forEach(function (entry) {

                // get error, message;
                var text = entry.context.text; var message = entry.message; let color;
                var error = text.substring(entry.context.offset, entry.context.offset + entry.context.length);

                // remove false-positive errors (one char and whitespaces)
                if (error.length >= 3 && !(/\s/g.test(error))) {

                    // set color of error => red for mistake and yellow for others
                    if (message == "Possible spelling mistake found.") { color = "red"; } else { color = "orange"; }

                    // update error color on html
                    tag.innerHTML = tag.innerHTML.replace(error,
                        "<a style='text-decoration: none;' href='#'><span title='" + message + "' style='color:" + color + ";font-weight:bold;'>" + error + "</span></a>"
                    );;

                    // add/update key error on eDict
                    if (error in eDict) { eDict[error][0] = eDict[error][0] + 1; } else { eDict[error] = [1, color, message]; }
                }
            });

        } catch (error) {
            continue;
        }
    }

    // Add errors to sidebar
    var spellErrors = document.getElementById("spellErrors")
    Object.entries(eDict).forEach(([key, value]) => {
        var error = key; var count = value[0]; var color = value[1]; var message = value[2];
        spellErrors.innerHTML += "<li><a href='#' title='" + message + "'>" + error + " (" + count + "x)" + "</a></li>";
    });


    //  Add totalErrors to GENERALINFO
    document.getElementById("totalErrors").innerText = Object.keys(eDict).length;

    // finish
    isRunFinished = true;
}

async function main() {
    // Add sidebar
    await addSidebar();

    // wait for addSidebar() to finish
    while (!(isSidebarFinish)) { await sleep(1000); }
    console.log("Side Finished")

    // Run languageTool once iframe has loaded
    document.getElementById('maincontent').addEventListener("load", async function () {
        await runLangTool("en-GB");
    });

    // wait for runLangTool() to finish
    while (!(isRunFinished)) { await sleep(1000); }
    console.log("LangTool Finished")

    // remove overlay
    document.getElementById("overlay").style.display = "none";
}

var isRunFinished = false; var isSidebarFinish = false;
(async function () {
    // START
    console.clear()
    console.log('inject started');


    // Check if already ran previously
    if (!document.getElementById("maincontent")) {
        await main();
    } else {
        console.log("Already checked.. nothing to do!");
    }

    // END
    console.log('inject ended');
})();