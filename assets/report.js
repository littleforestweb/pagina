// ------------------ Toggle Sidebar Section On/Off ------------------ //

// SETTINGS
let lfi_settings = document.getElementById('lfi_settings-title');
lfi_settings.addEventListener('click', () => {
    if (document.getElementById("lfi_settings-li").style.display == "none") {
        document.getElementById("lfi_settings-li").style.display = "block";
    } else {
        document.getElementById("lfi_settings-li").style.display = "none";
    }
});

// SPELLING
let lfi_spelling_errors = document.getElementById('lfi_spelling-title');
lfi_spelling_errors.addEventListener('click', () => {
    if (document.getElementById("lfi_spelling-li").style.display == "none") {
        document.getElementById("lfi_spelling-li").style.display = "block";
    } else {
        document.getElementById("lfi_spelling-li").style.display = "none";
    }
});

// LIGHTHOUSE
let lighthouse = document.getElementById('lfi_lighthouse-title');
lighthouse.addEventListener('click', () => {
    if (document.getElementById("lfi_lighthouse-li").style.display == "none") {
        document.getElementById("lfi_lighthouse-li").style.display = "block";
    } else {
        document.getElementById("lfi_lighthouse-li").style.display = "none";
    }
});

// GENERAL INFO
let generalInfo = document.getElementById('lfi_general-title');
generalInfo.addEventListener('click', () => {
    if (document.getElementById("lfi_general-li").style.display == "none") {
        document.getElementById("lfi_general-li").style.display = "block";
    } else {
        document.getElementById("lfi_general-li").style.display = "none";
    }
});


// -------------------------------------------------------------------------------------- //
