/*
 Created on : 31 Jul 2021, 00:09:29
 Author     : xhico
 */


// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //


const puppeteer = require('puppeteer-core');
const fs = require('fs');
let siteUrl, jsonPath, level;
let reportInfo = "";


// ------------------------------------- MAIN ------------------------------------- //


async function main() {

    // Set Puppeteer args
    args = ['--no-treekill',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list'];

    // Set browser
    const browser = await puppeteer.launch({executablePath: '/usr/bin/google-chrome', ignoreHTTPSErrors: true, headless: true, args: args});

    // Start new page
    const page = await browser.newPage();

    // Get report
    page.on('console', msg => {
        reportInfo += msg.text() + "\n";
    });

    // Load page
    await page.goto(siteUrl);

    // Run report
    await page.addScriptTag({path: '/opt/node/codesniffer/node_modules/html_codesniffer/build/HTMLCS.js'});
    await page.evaluate(function (level) {
        HTMLCS_RUNNER.run(level);
    }, level);

    // Close browser
    await browser.close();

    // Save reportInfo to file
    fs.writeFile(jsonPath, reportInfo, function (err) {
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
            // console.log(argArray);

            if (argArray.length > 1) {
                let name = argArray[0];
                let value = argArray[1];

                if (name === "--siteUrl") {
                    siteUrl = value;
                } else if (name === "--jsonPath") {
                    jsonPath = value;
                } else if (name === "--level") {
                    level = value;
                }
            }
        }
    });

    if (siteUrl === "" || jsonPath === "" || level === "") {
        console.log("NO siteUrl or jsonPath or level")
    } else {
        main();
    }
})();


