console.clear();

// Wait for Lighthouse Report Button to exist
setInterval(function () {
    // Check if Lighthouse Report Button is clicked
    if (document.getElementById('runLighthouse')) {
        document.getElementById('runLighthouse').onclick = function () { runLighthouse(); };
    }
}, 100);



