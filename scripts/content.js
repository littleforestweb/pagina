console.clear();

// Wait for Lighthouse Report Button to exist
setInterval(function () {
    // Check if Lighthouse Report Button is clicked
    if (document.getElementById('runLighthouse')) {
        document.getElementById('runLighthouse').onclick = function () { runLighthouse(); };
    }
}, 100);

// Wait for Lighthouse Report Button to exist
setInterval(function () {
    // Check if Lighthouse Report Button is clicked
    if (document.getElementById('lfi_languages_list')) {
        document.getElementById('lfi_languages_list').onchange = async function () {
            await resetSpell();
            await runLanguageTool();
        };
    }
}, 100);