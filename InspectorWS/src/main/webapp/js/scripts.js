window.addEventListener('DOMContentLoaded', event => {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            document.body.classList.toggle('lf-sidenav-toggled');
        });
    }

    // Wait for ENTER on input URL
    $("#searchURL").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            gotoNewPage();
        }
    });
});