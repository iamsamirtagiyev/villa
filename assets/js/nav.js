const menuIcon = document.querySelector('.menu-icon')
const menu = document.querySelector('.menu')

menuIcon.onclick = () => {
    menu.classList.toggle('active')
    menuIcon.classList.toggle('active')
}