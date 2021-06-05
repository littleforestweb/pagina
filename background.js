// this is the background code...
console.clear()
console.log("CRX Started");

document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('checkPage');
    if (checkPageButton) {
        checkPageButton.addEventListener('click', function () {
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.executeScript(tab.ib, { file: 'inject.js' });
            });
        }, false);
    }
}, false);

console.log("CRX Ended");