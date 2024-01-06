const data = 'http://localhost:3000/data/'
const favorites = 'http://localhost:3000/favorite/'

const detailsWrapper = document.querySelector('.details-wrapper')

let id = new URLSearchParams(window.location.search).get('id')

axios.get(data+id).then(response => {
    detailsWrapper.innerHTML += `
    <div class="image" data-aos="flip-right">
        <img src=${response.data.image} alt="details">
    </div>
    <div class="about" data-aos="fade-left">
        <p>${response.data.date}</p>
        <span>${response.data.name}</span>
    </div>
    <a href="index.html">Home</a>`
})