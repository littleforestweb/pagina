const puppeteer = require('puppeteer-core');

// Replace with the path to the chrome executable in your file system. This one assumes MacOSX.
const executablePath = '/usr/bin/google-chrome';

// Replace with the url you wish to test.
const url = 'https://www.squiz.net';

(async () => {
  const browser = await puppeteer.launch({
    executablePath
  });

  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(msg.text())
  });

  await page.goto(url);

  await page.addScriptTag({
    path: '/home/user/node_modules/html_codesniffer/build/HTMLCS.js'
  });

  await page.evaluate(function () {
    HTMLCS_RUNNER.run('WCAG2AA');
  });

  await browser.close();
})();
