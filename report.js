var mini = true;

function toggleSidebar() {
    if (mini) {
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("LFiwrap").style.marginLeft = "250px";
        this.mini = false;
    } else {
        document.getElementById("mySidebar").style.width = "85px";
        document.getElementById("LFiwrap").style.marginLeft = "85px";
        this.mini = true;
    }
}