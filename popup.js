document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('checkPage');
    if (checkPageButton) {
        checkPageButton.addEventListener('click', function () {
            chrome.tabs.getSelected(null, function (tab) {

            });
        }, false);
    }
}, false);