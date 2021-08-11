/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */

// ------------------ Toggle Sidebar Section On/Off ------------------ //

//// ACCESSIBILITY
//document.getElementById("accessibility-li").style.display = "none";
//document.getElementById('accessibility-title').addEventListener('click', () => {
//    if (document.getElementById("accessibility-li").style.display === "none") {
//        document.getElementById("accessibility-li").style.display = "block";
//    } else {
//        document.getElementById("accessibility-li").style.display = "none";
//    }
//});

//// CONTENT
//document.getElementById("content-li").style.display = "none";
//document.getElementById('content-title').addEventListener('click', () => {
//    if (document.getElementById("content-li").style.display === "none") {
//        document.getElementById("content-li").style.display = "block";
//    } else {
//        document.getElementById("content-li").style.display = "none";
//    }
//});

// // LINKS
// document.getElementById("links-li").style.display = "none";
// document.getElementById('links-title').addEventListener('click', () => {
//     if (document.getElementById("links-li").style.display === "none") {
//         document.getElementById("links-li").style.display = "block";
//     } else {
//         document.getElementById("links-li").style.display = "none";
//     }
// });

// SPELLING
document.getElementById("spelling-li").style.display = "none";
document.getElementById('spelling-title').addEventListener('click', () => {
    if (document.getElementById("spelling-li").style.display === "none") {
        document.getElementById("spelling-li").style.display = "block";
    } else {
        document.getElementById("spelling-li").style.display = "none";
    }
});

// LIGHTHOUSE
document.getElementById("lighthouse-li").style.display = "none";
document.getElementById('lighthouse-title').addEventListener('click', () => {
    if (document.getElementById("lighthouse-li").style.display === "none") {
        document.getElementById("lighthouse-li").style.display = "block";
    } else {
        document.getElementById("lighthouse-li").style.display = "none";
    }
});


//// TECHNOLOGIES
//document.getElementById("technologies-li").style.display = "none";
//document.getElementById('technologies-title').addEventListener('click', () => {
//    if (document.getElementById("technologies-li").style.display === "none") {
//        document.getElementById("technologies-li").style.display = "block";
//    } else {
//        document.getElementById("technologies-li").style.display = "none";
//    }
//});


// ------------------ Toggle Page <-> HTML View ------------------ //
function toggleView(view) {
    if (view === "Page") {
        document.getElementById("mainContent").hidden = false;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainLighthouse").hidden = true;
        document.getElementById("PageBtn").classList.add("active");
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("LighthouseViewBtn").classList.remove("active");
    } else if (view === "HTML") {
        document.getElementById("mainContent").hidden = true;
        document.getElementById("mainCode").hidden = false;
        document.getElementById("mainLighthouse").hidden = true;
        document.getElementById("PageBtn").classList.remove("active");
        document.getElementById("HTMLBtn").classList.add("active");
        document.getElementById("LighthouseViewBtn").classList.remove("active");
    } else if (view === "lighthouseReport") {
        document.getElementById("mainContent").hidden = true;
        document.getElementById("mainCode").hidden = true;
        document.getElementById("mainLighthouse").hidden = false;
        document.getElementById("PageBtn").classList.remove("active");
        document.getElementById("HTMLBtn").classList.remove("active");
        document.getElementById("LighthouseViewBtn").classList.add("active");
    } else {
    }
}


// ------------------ Toggle Desktop <-> Mobile View ------------------ //
function toggleDeviceView(view) {
    if (view === "Desktop") {
        document.getElementById("desktopView").classList.add("active");
        document.getElementById("mobileView").classList.remove("active");
        document.getElementById("mainContent").classList.remove("iframePageMobile");
    } else if (view === "Mobile") {
        document.getElementById("desktopView").classList.remove("active");
        document.getElementById("mobileView").classList.add("active");
        document.getElementById("mainContent").classList.add("iframePageMobile");
    } else {
    }
}