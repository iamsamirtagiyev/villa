const data = 'http://localhost:3000/data/'
const favorites = 'http://localhost:3000/favorite/'

//--------------------> DOM <--------------------

const cardList = document.querySelector('.recent-wrapper .card-list')
const modal = document.querySelector('.modal-container')
const form = document.querySelector('.form')
const formBtn = form.querySelector('button')
const image = document.querySelector('#image')
const imgLabel = document.querySelector('label img')
const name = form.querySelector('.name')
const dateInput = form.querySelector('.date')

//--------------------> Variables <--------------------
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let duration = 0

//--------------------> Alert <--------------------

const showAlert = (type, message) => {
    let alert = document.querySelector(`.${type}`)
    alert.style.top = '50px'
    setTimeout(() => {
        alert.classList.add('active')
        alert.textContent = message
    }, 1000);

    setTimeout(() => {
        alert.classList.remove('active')
        alert.textContent = ''
        setTimeout(() => { alert.style.top = '-500px' }, 1000);
    }, 3000);
}

//--------------------> Show Data <--------------------


axios.get(favorites).then(response => {
    response.data.forEach(item => {
        cardList.innerHTML += `
            <div class="card" data-aos="zoom-in" data-aos-duration="${duration+=500}">
                <div class="overlay">
                    <a href="details.html?id=${item.id}">View Details</a>
                    <button onclick="update(${item.id})" >Update</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                    <button onclick="removeFavorite(${item.id})">Remove Favorite</button>
                </div>
                <div class="image">
                    <img src=${item.image} alt="visit">
                </div>
                <div class="about">
                    <p>${item.date}</p>
                    <span>${item.name}</span>
                </div>
            </div>`
    })
})

//--------------------> Open Modal <--------------------

const openModal = () => {
    modal.classList.add('active')

    modal.onclick = (e) => {
        if (e.target.classList.contains('modal-container')) {
            modal.classList.remove('active')
        }
    }
}

image.onchange = () => {
    imgLabel.src = URL.createObjectURL(image.files[0])
}

//--------------------> Update <--------------------

const update = (id) => {
    openModal()
    formBtn.textContent = 'Update'
    axios.get(favorites + id).then(response => {
        imgLabel.src = response.data.image
        name.value = response.data.name
        let month = response.data.date.split(' ')[0]
        let day = response.data.date.split(' ')[1]
        let year = response.data.date.split(' ')[2]
        let newMonth = (months.map(month => month.toUpperCase()).indexOf(month.toUpperCase()) + 1)
        let monthIndex = newMonth < 10 ? "0" + newMonth : newMonth
        dateInput.value = `${year}-${monthIndex}-${day}`
    })

    formBtn.onclick = () => {
        if(name.value != '' && dateInput.value != ''){
            let yearUpd = dateInput.value.split('-')[0]
            let monthUpd = dateInput.value.split('-')[1]
            let dayUpd = dateInput.value.split('-')[2]
            let monthIndexUpd = monthUpd < 10 ? monthUpd[1] : monthUpd
            let newMonthUpd = months[monthIndexUpd - 1]

            let reader = new FileReader
            reader.readAsDataURL(image.files[0])
            reader.onload = (e => {
                axios.patch(favorites + id, {
                    image: e.target.result,
                    name: name.value,
                    date: `${newMonthUpd} ${dayUpd} ${yearUpd}`
                }).then(() => {
                    modal.classList.remove('active')
                    showAlert('success', 'item has been successfully updated')
                    setTimeout(() => { window.location.reload() }, 3500);
                })

                axios.get(favorites + id).then(response => {
                    axios.patch(data + id, response.data).then(() => console.log(id))
                })
            })
        }
        else{
            showAlert('error', 'please fill in the blanks')
        }
    }
}

//--------------------> Delete <--------------------

const deleteItem = (id) => {
    axios.delete(favorites + id).then(() => {
        showAlert('success', 'item deleted successfully')
        setTimeout(() => { window.location.reload() }, 3500);
    })
    axios.delete(data + id).then(() => console.log(id))
}

//--------------------> Remove Favorites <--------------------

const removeFavorite = (id) => {
    axios.delete(favorites + id).then(() => {
        showAlert('success', 'item successfully removed from favorites')
        setTimeout(() => { window.location.reload() }, 3500);
    })
}
