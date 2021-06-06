const netflix_open_btn = document.querySelector('.floating-btn');
const netflix_close_btn = document.querySelector('.netflix-close-btn');
const netflix_nav = document.querySelectorAll('.netflix-nav');
const maincontent = document.getElementById('maincontent');

netflix_open_btn.addEventListener('click', () => {
    netflix_nav.forEach(nav_el => { nav_el.classList.add('visible'); });
    maincontent.style.marginLeft = "300px";
});

netflix_close_btn.addEventListener('click', () => {
    netflix_nav.forEach(nav_el => { nav_el.classList.remove('visible'); });
    maincontent.style.marginLeft = "0px";
});