// LanguageTool Bookmarklet
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/06/04

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
    // Move the body's children into this wrapper
    // Append the wrapper to the body
    var div = document.createElement("div");
    div.id = "maincontent";
    while (document.body.firstChild) {
        div.appendChild(document.body.firstChild);
    }
    document.body.appendChild(div);

    // set github repo URL
    // var url = "https://raw.githubusercontent.com/littleforestweb/pagina/main/";
    var url = "https://pagina.xhico:8443/";

    // Add LFisidebar <html>
    var reportHTML = await getRequest(url + "report.html");
    document.body.innerHTML += reportHTML;

    // Add LFisidebar <script>
    const reportJS = await getRequest(url + "report.js");
    var report = document.createElement("script");
    document.body.appendChild(report).innerHTML = reportJS;

    // Add LFisidebar <style>
    var depCSS = await getRequest(url + "report.css");
    var report = document.createElement("style");
    document.head.appendChild(report).innerHTML = depCSS;
}

async function runLangTool(tagName, lang) {
    // get all tags
    var tags = document.getElementsByTagName(tagName);

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
                        "<span title='" + message + "' style='color:" + color + ";font-weight:bold;'>" + error + "</span>"
                    );;

                    // add/update key error on eDict
                    if (error in eDict) { eDict[error][0] = eDict[error][0] + 1; } else { eDict[error] = [1, color]; }
                }
            });

        } catch (error) {
            continue;
        }
    }

    // Add errors to LFisidebar
    var sidebar = document.getElementById("spellErrors")
    Object.entries(eDict).forEach(([key, value]) => {
        var error = key; var count = value[0]; var color = value[1];
        console.log(key, count, color);
        sidebar.innerHTML += "<li><a href='#'>" + error + " (" + count + ")" + "</a></li>";
    });

}

async function main() {
    // Add sidebar
    await addSidebar();

    // Run languageTool on tagName using lang
    await runLangTool("p", "en-GB");
}

(async function () {
    // START
    console.clear()
    console.log('inject started');

    // Check if already ran previously
    if (!document.getElementById("mywrap")) {
        await main();
    } else {
        console.log("Already checked.. nothing to do!");
    }

    // END
    console.log('inject ended');
})();