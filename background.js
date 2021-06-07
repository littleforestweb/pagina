// this is the background code...
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


