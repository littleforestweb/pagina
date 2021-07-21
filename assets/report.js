const lfi_spelling_errors = document.getElementById('lfi_spelling-title');
lfi_spelling_errors.addEventListener('click', () => {
    if (document.getElementById("lfi_spelling-li").style.display == "none") {
        document.getElementById("lfi_spelling-li").style.display = "block";
    } else {
        document.getElementById("lfi_spelling-li").style.display = "none";
    }
});

const lighthouse = document.getElementById('lfi_lighthouse-title');
lighthouse.addEventListener('click', () => {
    if (document.getElementById("lfi_lighthouse-li").style.display == "none") {
        document.getElementById("lfi_lighthouse-li").style.display = "block";
    } else {
        document.getElementById("lfi_lighthouse-li").style.display = "none";
    }
});

const generalInfo = document.getElementById('lfi_general-title');
generalInfo.addEventListener('click', () => {
    if (document.getElementById("lfi_general-li").style.display == "none") {
        document.getElementById("lfi_general-li").style.display = "block";
    } else {
        document.getElementById("lfi_general-li").style.display = "none";
    }
});