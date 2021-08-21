const puppeteer = require('puppeteer-core');
const fs = require('fs');

// Replace with the path to the chrome executable in your file system. This one assumes MacOSX.
const executablePath = '/usr/bin/google-chrome';

let siteUrl
let reportInfo = "";

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

    const page = await browser.newPage();

    page.on('console', msg => {
        reportInfo += msg.text() + "\n";
    });

    await page.goto(siteUrl);

    await page.addScriptTag({path: '/opt/node/scripts/node_modules/html_codesniffer/build/HTMLCS.js'});

    await page.evaluate(function () {
        HTMLCS_RUNNER.run('WCAG2AA');
    });

    await browser.close();

    // Save reportInfo to file
    fs.writeFile(jsonPath, reportInfo, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file " + jsonPath + " was saved!");
    });
}

// ------------------------------------- Initialize ------------------------------------- //

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