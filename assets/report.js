// ------------------ Toggle Sidebar Section On/Off ------------------ //

// Default hide every section apart from Settings and General
document.getElementById("lfi_settings-li").style.display = "none"
document.getElementById("lfi_accessibility-li").style.display = "none"
document.getElementById("lfi_content-li").style.display = "none"
document.getElementById("lfi_links-li").style.display = "none"
document.getElementById("lfi_spelling-li").style.display = "none"
document.getElementById("lfi_lighthouse-li").style.display = "none"
document.getElementById("lfi_technologies-li").style.display = "none"


// SETTINGS
document.getElementById('lfi_settings-title').addEventListener('click', () => {
    if (document.getElementById("lfi_settings-li").style.display == "none") {
        document.getElementById("lfi_settings-li").style.display = "block";
    } else {
        document.getElementById("lfi_settings-li").style.display = "none";
    }
});

// ACCESSIBILITY
document.getElementById('lfi_accessibility-title').addEventListener('click', () => {
    if (document.getElementById("lfi_accessibility-li").style.display == "none") {
        document.getElementById("lfi_accessibility-li").style.display = "block";
    } else {
        document.getElementById("lfi_accessibility-li").style.display = "none";
    }
});

// CONTENT
document.getElementById('lfi_content-title').addEventListener('click', () => {
    if (document.getElementById("lfi_content-li").style.display == "none") {
        document.getElementById("lfi_content-li").style.display = "block";
    } else {
        document.getElementById("lfi_content-li").style.display = "none";
    }
});

// LINKS
document.getElementById('lfi_links-title').addEventListener('click', () => {
    if (document.getElementById("lfi_links-li").style.display == "none") {
        document.getElementById("lfi_links-li").style.display = "block";
    } else {
        document.getElementById("lfi_links-li").style.display = "none";
    }
});

// SPELLING
document.getElementById('lfi_spelling-title').addEventListener('click', () => {
    if (document.getElementById("lfi_spelling-li").style.display == "none") {
        document.getElementById("lfi_spelling-li").style.display = "block";
    } else {
        document.getElementById("lfi_spelling-li").style.display = "none";
    }
});

// LIGHTHOUSE
document.getElementById('lfi_lighthouse-title').addEventListener('click', () => {
    if (document.getElementById("lfi_lighthouse-li").style.display == "none") {
        document.getElementById("lfi_lighthouse-li").style.display = "block";
    } else {
        document.getElementById("lfi_lighthouse-li").style.display = "none";
    }
});


// TECHNOLOGIES
document.getElementById('lfi_technologies-title').addEventListener('click', () => {
    if (document.getElementById("lfi_technologies-li").style.display == "none") {
        document.getElementById("lfi_technologies-li").style.display = "block";
    } else {
        document.getElementById("lfi_technologies-li").style.display = "none";
    }
});


// -------------------------------------------------------------------------------------- //
