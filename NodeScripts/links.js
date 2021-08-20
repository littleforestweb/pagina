/*
 Created on : 19 Ago 2021, 09:53:46
 Author     : xhico
 */


// ------------------------------------- Initialize ------------------------------------- //


const puppeteer = require('puppeteer-core');
const helpers = require('./helpers');
const fs = require('fs');
let browser, page, siteUrl, jsonPath;


// ------------------------------------- Functions ------------------------------------- //


async function main() {
    console.log("----------------------");

    try {

        let jsonLinks = [];
        let checkedLinks = [];

        // Open newPage
        page = await browser.newPage();

        // Goto page
        await page.goto(siteUrl, {waitUntil: 'domcontentloaded', timeout: 20000});

        // Find links present on this page
        let links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map((val) => val.href);
        });

        // CLose page
        page.close();

        // Iterate every link
        for (let i = 0; i < links.length; i++) {
            let linkHref = links[i];

            // Get absoule url
            let newUrl = helpers.absoluteUri(siteUrl, linkHref);
            let status;

            // Internal || External
            let domain = (new URL(siteUrl));
            let baseUrl = domain.protocol + "//" + domain.hostname;
            let origin = ((linkHref.includes(baseUrl)) ? "internal" : "external")

            // Append linkHref to checkedLinks
            checkedLinks.push(newUrl);

            // Open newPage
            page = await browser.newPage();

            try {
                // Get response
                let response = await page.goto(newUrl, {waitUntil: 'domcontentloaded', timeout: 20000});

                // Get status
                status = response.status().toString();
            } catch (ex) {
                // console.log("Ex - " + ex);
                status = "-1";
            }

            // Close page
            page.close();

            // Append info to jsonLinks
            jsonLinks.push('"' + newUrl + '": [\"' + status + "\", \"" + origin + '\"]');

            console.log(newUrl + " " + status + " " + origin);
        }

        // Set full JSON String
        let fullJSON = "{ 'linksInfo' : [";
        for (let i = 0; i < jsonLinks.length; i++) {
            let jsonString = "{" + jsonLinks[i] + "}";
            if (i !== jsonLinks.length - 1) {
                fullJSON = fullJSON + jsonString + ", ";
            } else {
                fullJSON = fullJSON + jsonString;
            }
        }

        // Ignore the last ","
        fullJSON = fullJSON.substr(0, fullJSON.length) + "]}";

        // Save fullJSON to file
        fs.writeFile(jsonPath, fullJSON, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file " + jsonPath + " was saved!");
        });

    } catch (error) {
        console.error("ERROR - " + error);
    }

    console.log("----------------------");
}

async function init() {

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

    // Run main
    await main();

    // Close browser
    await browser.close();
}


// ------------------------------------- Initialize ------------------------------------- //

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
        await init();
    }

})();

