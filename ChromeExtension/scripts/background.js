document.addEventListener('DOMContentLoaded', function () {
    let checkPageButton = document.getElementById("mainButton");
    if (checkPageButton) {
        checkPageButton.addEventListener('click', function () {
            chrome.tabs.executeScript(null, {file: 'scripts/inject.js'});
        }, false);
    }
}, false);