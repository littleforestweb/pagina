var mini = true;

function toggleSidebar() {
    if (mini) {
        document.getElementById("mySidebar").style.width = "350px";
        document.getElementById("mywrap").style.marginLeft = "350px";
        document.getElementById("lfi_img").src = "https://raw.githubusercontent.com/littleforestweb/pagina/main/littleforest_logo.png"
        document.getElementById("lfi_img").style.marginRight = "auto";
        document.getElementById("lfi_img").style.marginLeft = "auto";
        this.mini = false;
    } else {
        document.getElementById("mySidebar").style.width = "85px";
        document.getElementById("mywrap").style.marginLeft = "85px";
        document.getElementById("lfi_img").src = "https://raw.githubusercontent.com/littleforestweb/pagina/main/forest.png"
        document.getElementById("lfi_img").style.marginRight = "auto";
        document.getElementById("lfi_img").style.marginLeft = "unset";
        this.mini = true;
    }
}