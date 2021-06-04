// LanguageTool Bookmarklet
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/06/04

async function getRequest(url) {
    try {
        const res = await fetch(url, { cache: "no-store" });
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
    div.id = "mywrap";
    while (document.body.firstChild) {
        div.appendChild(document.body.firstChild);
    }
    document.body.appendChild(div);

    // set github repo URL
    var url = "https://raw.githubusercontent.com/littleforestweb/pagina/main/";
    // var url = "https://pagina.xhico:8443/";

    // // Add Sidebar <html>
    // const reportHTML = await getRequest(url + "report.html");
    // var report = document.createElement("div");
    // document.body.appendChild(report).innerHTML = reportHTML;

    // // Add Sidebar <script>
    // const reportJS = await getRequest(url + "report.js");
    // var report = document.createElement("script");
    // document.body.appendChild(report).innerHTML = reportJS;

    // // Add Sidebar <style>
    // const reportCSS = await getRequest(url + "report.css");
    // var report = document.createElement("style");
    // document.head.appendChild(report).innerHTML = reportCSS;

    // Add Sidebar Dependencies
    const reportCSS = await getRequest(url + "dependencies.html");
    document.head.innerHTML += reportCSS;

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

    // Add errors to sidebar
    Object.entries(eDict).forEach(([key, value]) => {
        var count = value[0]; var color = value[1];
        console.log(key, count, color);
        // div.innerHTML += "<a style='color:" + color + ";' href='#''>" + error + "(" + count + ")" + "</a>";
    });

}

async function main() {
    // Add Sidebar
    await addSidebar();

    // Run languageTool on tagName using lang
    // const content = await runLangTool("p", "en-GB");
}

(async function () {
    // START
    console.clear()
    console.log('CRX started');

    // Check if already ran previously
    if (!document.getElementById("mywrap")) {
        await main();
    } else {
        console.log("Already checked.. nothing to do!");
    }

    // Open sidebar
    // document.getElementById("openbtn").click();

    // END
    console.log('CRX ended');
})();