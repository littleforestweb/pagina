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
    // set github repo URL
    var url = "https://raw.githubusercontent.com/littleforestweb/pagina/main/";

    // Add Sidebar <html>
    const mySidebarHTML = await getRequest(url + "mySidebar.html");
    var mySidebar = document.createElement("div");
    document.body.appendChild(mySidebar).innerHTML = mySidebarHTML;

    // Add Sidebar <script>
    const mySidebarJS = await getRequest(url + "script.js");
    var script = document.createElement("script");
    document.body.appendChild(script).innerHTML = mySidebarJS;

    // Add Sidebar <style>
    const mySidebarCSS = await getRequest(url + "style.css");
    var style = document.createElement("style");
    document.head.appendChild(style).innerHTML = mySidebarCSS;
}

async function runLangTool(tagName, lang) {
    // get all tags
    var tags = document.getElementsByTagName(tagName);

    // set errorsDict where key => error and value => count
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

                    // add error to eDict
                    eDict[error] = 1;

                }
            });

        } catch (error) {
            continue;
        }
    }

    // Add errors to sidebar
    console.log(eDict);
    // toLowerCase 
    // get unique 
    // get counter
    // var div = document.getElementById('mySidebar');
    // div.innerHTML += "<a style='color:" + color + ";' href='#''>" + error + "</a>";
}

async function main() {
    // Add Sidebar
    await addSidebar();

    // Run languageTool on tagName using lang
    const content = await runLangTool("p", "en-GB");
}

(async function () {
    // START
    console.clear()
    console.log('Bookmarklet started');

    // Check if already ran previously
    if (!document.getElementById("mySidebar")) {
        await main();
    } else {
        console.log("Already checked.. nothing to do!");
    }

    // Open sidebar
    document.getElementById("btn").click();

    // END
    console.log('Bookmarklet ended');
})();