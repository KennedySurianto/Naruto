const menuBtn = $('#menu-btn');
const menu = $('#menu');

menuBtn.on('click', () => {
    menu.fadeToggle();
})