/*
 Created on : 22 Ago 2021, 15:03:55
 Author     : xhico
 */


// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //


const puppeteer = require('puppeteer-core');
const helpers = require('./helpers');
const fs = require('fs');
let browser, page, siteUrl, jsonPath;


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
    browser = await puppeteer.launch({executablePath: '/usr/bin/google-chrome', ignoreHTTPSErrors: true, headless: true, args: args});

    // Load page
    const page = await browser.newPage();
    await page.goto(siteUrl);

    // Get Cookies
    const cookies = await page.cookies();

    // Close browser
    await browser.close();

    // Save reportInfo to file
    fs.writeFile(jsonPath, "{ \"Cookies\" : " + JSON.stringify(cookies) + "}", function (err) {
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
            console.log(argArray);

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
