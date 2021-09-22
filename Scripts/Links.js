/*
 Created on : 19 Ago 2021, 19:24:07
 Author     : xhico
 */


// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //


const puppeteer = require('puppeteer-core');
const helpers = require('./helpers');
const fs = require('fs');
const urlStatusCode = require('url-status-code');

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

    try {

        let jsonLinks = [];
        let checkedLinks = [];

        // Open newPage
        page = await browser.newPage();

        // Goto page
        await page.goto(siteUrl, {waitUntil: 'domcontentloaded', timeout: 20000});

        // Find links present on this page
        let links = [...new Set(await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map((val) => val.href);
        }))];

        // Close page
        page.close();

        // Iterate every link
        for (let i = 0; i < links.length; i++) {
            let linkHref = links[i];

            // Check if link has already been checked
            if (!(checkedLinks.includes(linkHref))) {

                // Append linkHref to checkedLinks
                checkedLinks.push(linkHref);

                // Get absoule url
                let newUrl = helpers.absoluteUri(siteUrl, linkHref);
                let status, redirectStatus = "";

                // Internal || External
                let domain = (new URL(siteUrl));
                let baseUrl = domain.protocol + "//" + domain.hostname;
                let origin = ((linkHref.includes(baseUrl)) ? "Internal" : "External");


                // Get status code
                try {
                    status = '' + await urlStatusCode(newUrl);
                } catch (error) {
                    status = "999";
                }

                // Get Redirected UrL
                if (status.includes("30")) {
                    page = await browser.newPage();
                    await page.goto(newUrl, {waitUntil: 'domcontentloaded', timeout: 20000});
                    let redirectUrl = page.url();
                    redirectStatus = '' + await urlStatusCode(redirectUrl);
                    status = status + "," + redirectStatus;
                    page.close();
                }

                // Append info to jsonLinks
                jsonLinks.push('"' + newUrl + '": [\"' + status + "\", \"" + origin + "\", \"" + linkHref + '\"]');
            }

        }

        // Close browser
        await browser.close();

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
        console.log(fullJSON);

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

    // Close browser
    await browser.close();
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
