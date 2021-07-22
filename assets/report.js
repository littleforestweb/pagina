// ------------------ Toggle Sidebar Section On/Off ------------------ //

// Default hide every section apart from Settings and General
// document.getElementById("lfi_settings-li").style.display = "none"
// document.getElementById("lfi_accessibility-li").style.display = "none"
// document.getElementById("lfi_content-li").style.display = "none"
// document.getElementById("lfi_links-li").style.display = "none"
// document.getElementById("lfi_spelling-li").style.display = "none"
// document.getElementById("lfi_lighthouse-li").style.display = "none"
// document.getElementById("lfi_technologies-li").style.display = "none"

// SETTINGS
let lfi_settings = document.getElementById('lfi_settings-title');
lfi_settings.addEventListener('click', () => {
    if (document.getElementById("lfi_settings-li").style.display == "none") {
        document.getElementById("lfi_settings-li").style.display = "block";
    } else {
        document.getElementById("lfi_settings-li").style.display = "none";
    }
});

// -------------------------------------------------------------------------------------- //
