$(document).ready(function () {
    var element = document.getElementById('resizable');
    if (element) {
        var resizer = document.createElement('div');
        resizer.className = 'draghandle';
        resizer.style.width = '6px';
        resizer.style.height = '100vh';
        element.appendChild(resizer);
        resizer.addEventListener('mousedown', initResize, false);
    }

    function initResize(e) {
        window.addEventListener('mousemove', Resize, false);
        window.addEventListener('mouseup', stopResize, false);
        $('#mainArea.content, #tabs iframe').addClass('marginLeft');
    }

    function Resize(e) {
        element.style.width = (e.clientX - element.offsetLeft) + 'px';
        $('#mainArea.content').css('margin-left', (e.clientX - element.offsetLeft) + 'px');
        $('#tabs iframe').css('margin-left', (element.offsetLeft + 40) + 'px');
    }

    function stopResize(e) {
        window.removeEventListener('mousemove', Resize, false);
        window.removeEventListener('mouseup', stopResize, false);
        $('#tabs iframe').css('margin-left', element.offsetLeft + 'px');
    }
});