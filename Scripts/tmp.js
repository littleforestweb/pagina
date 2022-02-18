/*
 Created on : 22 Ago 2021, 15:03:55
 Author     : xhico
 */


// ------------------------------------- GLOBAL VARIABLES ------------------------------------- //


const puppeteer = require('puppeteer-core');
let browser, siteUrl;


// ------------------------------------- MAIN ------------------------------------- //


async function main() {

    // Set Puppeteer args
    args = ['--incognito',
        '--no-treekill',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        '--remote-debugging-port=9222'];

    // Set browser
    browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        ignoreHTTPSErrors: true,
        headless: true,
        args: args
    });

    siteUrl = "https://www.southampton.ac.uk/research/facilities.page";

    try {
        // Load page
        const page = await browser.newPage();
        await page.goto(siteUrl, {waitUntil: 'networkidle2'});
        console.log("Loaded");

        const readline = require('readline-sync');
        console.log(readline.question(`Enter to resume?\n`));

    } catch (e) {
        console.log(e);
    } finally {
        // Close browser
        await browser.close();
        console.log("Closed");
    }
}


// ------------------------------------- INITIALIZE ------------------------------------- //

(async () => {
    // Init
    await main();

})();
