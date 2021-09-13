/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */


async function toggleSidebar() {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            document.body.classList.toggle('lf-sidenav-toggled');
        });
    }
}

async function getUsername() {
    // Get existing username
    let name = "username" + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    let username = "";
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            username = c.substring(name.length, c.length).split(",");
        }
    }

    return username;
}

async function setUsername() {
    let cvalue = document.getElementById("userModalInput").value;
    let cname = "username";
    let exdays = 180;

    // Check if the String is Empty
    if (cvalue === "") {
        document.getElementById("userModalInput").placeholder = "Please insert a valid username";
        return;
    }

    // Set Expire Date
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();

    // Save Cookie
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

    // Add to sidebar
    document.getElementById("username").innerText = cvalue;

    // Close modal
    $("#userModal").modal("hide");
}

$("#userModalInput").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        setUsername();
    }
});


window.addEventListener('DOMContentLoaded', async event => {
    // Enable sidebar toggle
    toggleSidebar();

    // // Check username => Add to sidebar || Ask for user input
    // let username = await getUsername();
    // if (username === "") {
    //     $("#userModal").modal("show");
    // } else {
    //     document.getElementById("username").innerText = username;
    // }
});