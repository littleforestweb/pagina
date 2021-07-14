document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('checkPage').addEventListener('click', function () {
        let selectedLanguage = document.getElementById("languagesList").value;
        chrome.runtime.sendMessage({ language: selectedLanguage });
    }, false);
}, false);



