/*
 Created on : 22 Ago 2021, 22:36:54
 Author     : xhico
 */


// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //


const Wappalyzer = require('wappalyzer');
const fs = require('fs');
let siteUrl, jsonPath, resultsJSON;
const wappalyzer = new Wappalyzer();


// ------------------------------------- MAIN ------------------------------------- //


async function main() {
    try {
        await wappalyzer.init();
        const site = await wappalyzer.open(siteUrl);
        const results = await site.analyze();
        resultsJSON = JSON.stringify(results);

    } catch (error) {
        console.error(error);
    }

    await wappalyzer.destroy();

    // Save reportInfo to file
    fs.writeFile(jsonPath, "{ \"Wappalyzer\" : " + resultsJSON + "}", function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file " + jsonPath + " was saved!");
    });
}


// ------------------------------------- INITIALIZE ------------------------------------- //

(async () => {
    // Get cmd args; Get only non system arguments
    process.argv.forEach(function (val, index, array) {
        if (index > 1 && val.startsWith("--")) {

            let argArray = val.split("=");

            if (argArray.length > 1) {
                let name = argArray[0];
                let value = argArray[1];

                if (name === "--siteUrl") {
                    siteUrl = value;
                } else if (name === "--jsonPath") {
                    jsonPath = value;
                }
            }

        }
    });

    // Init
    if (siteUrl === "" || jsonPath === "") {
        console.log("NO siteUrl or jsonPath")
    } else {
        await main();
    }

})();
