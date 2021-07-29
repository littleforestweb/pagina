/*
 Created on : 23 Jul 2021, 10:38:17
 Author     : xhico
 */

// ------------------ Toggle Sidebar Section On/Off ------------------ //

// Default hide every section apart from Settings and General
//document.getElementById("accessibility-li").style.display = "none"
//document.getElementById("content-li").style.display = "none"
document.getElementById("links-li").style.display = "none"
document.getElementById("spelling-li").style.display = "none"
//document.getElementById("lighthouse-li").style.display = "none"
//document.getElementById("technologies-li").style.display = "none"

//// ACCESSIBILITY
//document.getElementById('accessibility-title').addEventListener('click', () => {
//    if (document.getElementById("accessibility-li").style.display === "none") {
//        document.getElementById("accessibility-li").style.display = "block";
//    } else {
//        document.getElementById("accessibility-li").style.display = "none";
//    }
//});

//// CONTENT
//document.getElementById('content-title').addEventListener('click', () => {
//    if (document.getElementById("content-li").style.display === "none") {
//        document.getElementById("content-li").style.display = "block";
//    } else {
//        document.getElementById("content-li").style.display = "none";
//    }
//});

// LINKS
document.getElementById('links-title').addEventListener('click', () => {
    if (document.getElementById("links-li").style.display === "none") {
        document.getElementById("links-li").style.display = "block";
    } else {
        document.getElementById("links-li").style.display = "none";
    }
});

// SPELLING
document.getElementById('spelling-title').addEventListener('click', () => {
    if (document.getElementById("spelling-li").style.display === "none") {
        document.getElementById("spelling-li").style.display = "block";
    } else {
        document.getElementById("spelling-li").style.display = "none";
    }
});

//// LIGHTHOUSE
//document.getElementById('lighthouse-title').addEventListener('click', () => {
//    if (document.getElementById("lighthouse-li").style.display === "none") {
//        document.getElementById("lighthouse-li").style.display = "block";
//    } else {
//        document.getElementById("lighthouse-li").style.display = "none";
//    }
//});
//
//
//// TECHNOLOGIES
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
        document.getElementById("htmlView").hidden = true;
        document.getElementById("PageBtn").classList.add("active");
        document.getElementById("HTMLBtn").classList.remove("active");

    } else {
        document.getElementById("mainContent").hidden = true;
        document.getElementById("htmlView").hidden = false;
        document.getElementById("PageBtn").classList.remove("active");
        document.getElementById("HTMLBtn").classList.add("active");
    }
}