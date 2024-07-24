var i = 0;
function move() {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 100);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
                location.href = 'home-page.html';
                return;
            } else {
                width++;
                elem.style.width = width + "%";
            }
        }
    }
}
move();