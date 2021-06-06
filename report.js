const netflix_open_btn = document.querySelector('.open-report');
const netflix_close_btn = document.querySelector('.netflix-close-btn');
const netflix_nav = document.querySelectorAll('.netflix-nav');
const maincontent = document.querySelectorAll('#maincontent');

netflix_open_btn.addEventListener('click', () => {
    netflix_nav.forEach(nav_el => { nav_el.classList.add('visible'); });
    maincontent.style.marginLeft = "480px";
});

netflix_close_btn.addEventListener('click', () => {
    netflix_nav.forEach(nav_el => { nav_el.classList.remove('visible'); });
});

// GET IN TOUCH COMPONENT
const floating_btn = document.querySelector('.floating-btn');
const close_btn = document.querySelector('.close-btn');
const social_panel_container = document.querySelector('.social-panel-container');

floating_btn.addEventListener('click', () => {
    social_panel_container.classList.toggle('visible');
});

close_btn.addEventListener('click', () => {
    social_panel_container.classList.remove('visible');
});