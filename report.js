var mini = true;

function toggleLFisidebar() {
    if (mini) {
        console.log("opening LFisidebar");
        document.getElementById("LFisidebar").style.width = "250px";
        document.getElementById("LFiwrap").style.marginLeft = "250px";
        this.mini = false;
    } else {
        console.log("closing LFisidebar");
        document.getElementById("LFisidebar").style.width = "85px";
        document.getElementById("LFiwrap").style.marginLeft = "85px";
        this.mini = true;
    }
}