const getPage = require('./get-page')
const puppeteer = require('puppeteer-core');

module.exports = processRequest

async function processRequest(req, res) {
    const params = {requestMethod: req.method, ...req.query, ...req.params}
    let page;

    if (params.token === "null") {
        page = await getPage(params);
    } else {
        console.log("token: " + params.token);
        console.log("url: " + params.url);
        page = await usePuppeteer(params.url);
    }

    return createResponse(page, params, res);
}

async function usePuppeteer(siteUrl) {
    // Set Puppeteer args
    args = ['--incognito', '--no-treekill', '--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars', '--window-position=0,0', '--ignore-certificate-errors', '--ignore-certificate-errors-spki-list'];

    // Set browser
    let browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome', ignoreHTTPSErrors: true, headless: true, args: args
    });

    try {
        // Load page
        const page = await browser.newPage();
        await page.goto(siteUrl, {waitUntil: 'networkidle2'});

        // siteUrl = "http://46.101.85.189:8888/user/login"
        // let username = "richard"
        // let usernameSelector = "#edit-name"
        // let password = "Testpassing_746325TREw"
        // let passwordSelector = "#edit-pass"
        // let submitBtn = "#edit-submit"

        // await page.type(usernameSelector, username);
        // await page.type(passwordSelector, password);
        // await page.click(submitBtn);
        // await page.waitForNavigation({waitUntil: 'networkidle2'})

        // let content = await page.evaluate(() => document.querySelector('*').outerHTML);
        let content = await page.content();

        return {contents: content.toString()}
    } catch (e) {
        return {contents: "null"}
    } finally {
        browser.close();
    }
}

async function createResponse(page, params, res) {
    res.send(Buffer.from(JSON.stringify(page)))
    return page
}