console.clear();

// -------------------------------------------------------------------------------------- //

setInterval(function () {

    // Check if Lighthouse Report Button is clicked
    if (document.getElementById('lfi_runLighthouse')) {
        document.getElementById('lfi_runLighthouse').onclick = function () {
            runLighthouse();
        };
    }

    // Check if Lighthouse Report Button is clicked
    if (document.getElementById('lfi_languages_list')) {
        document.getElementById('lfi_languages_list').onchange = async function () {
            await resetSpell();
            await runLanguageTool();
        };
    }

}, 100);
