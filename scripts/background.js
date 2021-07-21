// Page Inspector Chrome Extension
// LanguageTool && Google Lighthouse
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/07/21

document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('mainButton');
    if (checkPageButton) {
        checkPageButton.addEventListener('click', function () {
            chrome.tabs.executeScript(null, { file: 'scripts/inject.js' });
        }, false);
    }
}, false);