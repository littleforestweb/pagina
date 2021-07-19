const netflix_open_btn = document.querySelector('.floating-btn');
const netflix_close_btn = document.querySelector('.netflix-close-btn');
const netflix_nav = document.querySelectorAll('.netflix-nav');
const maincontent = document.getElementById('maincontent');

netflix_open_btn.addEventListener('click', () => {
    netflix_nav.forEach(nav_el => { nav_el.classList.add('visible'); });
    maincontent.style.marginLeft = "300px";
    maincontent.classList.remove("iframe-width-100");
    maincontent.classList.add("iframe-width-300");
});

netflix_close_btn.addEventListener('click', () => {
    netflix_nav.forEach(nav_el => { nav_el.classList.remove('visible'); });
    maincontent.style.marginLeft = "0px";
    maincontent.classList.remove("iframe-width-300");
    maincontent.classList.add("iframe-width-100");
});


const spellErrors = document.getElementById('spell-title');
spellErrors.addEventListener('click', () => {
    if (document.getElementById("spell-li").style.display == "none") {
        document.getElementById("spell-li").style.display = "block";
    } else {
        document.getElementById("spell-li").style.display = "none";
    }
});

const lighthouse = document.getElementById('lighthouse-title');
lighthouse.addEventListener('click', () => {
    if (document.getElementById("lighthouse-li").style.display == "none") {
        document.getElementById("lighthouse-li").style.display = "block";
    } else {
        document.getElementById("lighthouse-li").style.display = "none";
    }
});

const generalInfo = document.getElementById('general-title');
generalInfo.addEventListener('click', () => {
    if (document.getElementById("general-li").style.display == "none") {
        document.getElementById("general-li").style.display = "block";
    } else {
        document.getElementById("general-li").style.display = "none";
    }
});