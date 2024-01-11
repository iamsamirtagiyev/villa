const data = 'http://localhost:3000/data/'
const favorites = 'http://localhost:3000/favorite/'
const basket = 'http://localhost:3000/basket/'

//--------------------> DOM <--------------------

const cardList = document.querySelector('.recent-wrapper .card-list')
const loadBtn = document.querySelector('.load-btn button')
const topBtn = document.querySelector('.top')
const modal = document.querySelector('.modal-container')
const form = document.querySelector('.form')
const formBtn = form.querySelector('button')
const image = document.querySelector('#image')
const imgLabel = document.querySelector('label img')
const name = form.querySelector('.name')
const dateInput = form.querySelector('.date')
const addBtn = document.querySelector('.add')
const searchInput = document.querySelector('.search')
const selection = document.querySelector('.selection')
const selectionValue = document.querySelector('.selection input')
const options = document.querySelector('.options')
const option = document.querySelectorAll('.option')


//--------------------> Variables <--------------------
let page = 1
let count = 1
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

//--------------------> Scroll <--------------------

window.onscroll = () => {
    scrollY > 30 ? topBtn.style.bottom = '80px' : topBtn.style.bottom = '1000px'
    topBtn.onclick = () => {
        window.scroll({
            top: 0,
            behavior: "smooth"
        })
    }
}

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

const showData = (page) => {
    axios.get(`${data}?_page=${page}&_limit=3`).then(response => {
        response.data.forEach(item => {
            cardList.innerHTML += `
            <div class="card">
                <div class="overlay">
                    <a href="details.html?id=${item.id}">View Details</a>
                    <button onclick="update(${item.id})" >Update</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                    <button onclick="addFavorite(${item.id})">Add Favorite</button>
                    <button onclick="addBasket(${item.id})">Add Basket</button>
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
}

showData(page)

//--------------------> Load More <--------------------

loadBtn.onclick = () => {
    page++
    showData(page)
}

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
    axios.get(data + id).then(response => {
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
        if (name.value != '' && dateInput.value != '') {
            let yearUpd = dateInput.value.split('-')[0]
            let monthUpd = dateInput.value.split('-')[1]
            let dayUpd = dateInput.value.split('-')[2]
            let monthIndexUpd = monthUpd < 10 ? monthUpd[1] : monthUpd
            let newMonthUpd = months[monthIndexUpd - 1]

            let reader = new FileReader
            reader.readAsDataURL(image.files[0])
            reader.onload = (e => {
                axios.patch(data + id, {
                    image: e.target.result,
                    name: name.value,
                    date: `${newMonthUpd} ${dayUpd} ${yearUpd}`
                }).then(() => {
                    modal.classList.remove('active')
                    showAlert('success', 'item has been successfully updated')
                    setTimeout(() => { window.location.reload() }, 3500);
                })
            })
        }
        else {
            showAlert('error', 'please fill in the blanks')
        }
    }
}

//--------------------> Add <--------------------

addBtn.onclick = () => {
    openModal()
    formBtn.textContent = 'Add'

    formBtn.onclick = () => {
        if (name.value != '' && dateInput.value != '') {
            let yearAdd = dateInput.value.split('-')[0]
            let monthAdd = dateInput.value.split('-')[1]
            let dayAdd = dateInput.value.split('-')[2]
            let monthIndexAdd = monthAdd < 10 ? monthAdd[1] : monthAdd
            let newMonthAdd = months[monthIndexAdd - 1]

            let reader = new FileReader
            reader.readAsDataURL(image.files[0])
            reader.onload = (e => {
                axios.post(data, {
                    image: e.target.result,
                    name: name.value,
                    date: `${newMonthAdd} ${dayAdd} ${yearAdd}`
                }).then(() => {
                    modal.classList.remove('active')
                    showAlert('success', 'item added successfully')
                    setTimeout(() => { window.location.reload() }, 3500);
                })
            })
        }
        else {
            showAlert('error', 'please fill in the blanks')
        }
    }
}

//--------------------> Delete <--------------------

const deleteItem = (id) => {
    axios.delete(data + id).then(() => {
        showAlert('success', 'item deleted successfully')
        setTimeout(() => { window.location.reload() }, 3500);
    })
    axios.delete(favorites + id).then(() => console.log(id))
}

//--------------------> Add Favorite <--------------------

const addFavorite = (id) => {
    axios.get(data + id).then(response => {
        axios.post(favorites, response.data).then(() => showAlert('success', 'Item successfully added to favorites'))
    })
}

//--------------------> Search <--------------------

searchInput.oninput = (e) => {
    let search = e.target.value.toUpperCase().trim()
    if (search) {
        axios.get(data).then(response => {
            newData = response.data.filter(item => item.name.toUpperCase().includes(search))
            cardList.innerHTML = ''
            loadBtn.style.display = 'none'
            newData.forEach(item => {
                cardList.innerHTML += `
            <div class="card">
                <div class="overlay">
                    <a href="details.html?id=${item.id}">View Details</a>
                    <button onclick="update(${item.id})" >Update</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                    <button onclick="addFavorite(${item.id})">Add Favorite</button>
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
    }
    else {
        cardList.innerHTML = ''
        loadBtn.style.display = 'inline'
        page = 1
        showData(page)
    }
}

//--------------------> Add Basket <--------------------

const addBasket = (id) => {
    axios.get(data + id).then(response => {
        axios.get(basket).then(res => {
            if (res.data.length == 0) {
                axios.post(basket, response.data).then(res => showAlert('success', 'Item successfully added to basket'))
            }
            else {
                res.data.forEach(element => {
                    if (element.id == id) {
                        count++
                        axios.patch(basket + id, { count: count }).then(res => showAlert('success', 'Item successfully added to basket'))
                    }
                    else {
                        axios.post(basket, response.data).then(res => showAlert('success', 'Item successfully added to basket'))
                    }
                })
            }
        })
    })
}

//--------------------> Selection <--------------------

document.onclick = (e) => {
    if (e.target.classList.contains('selection')) {
        options.classList.toggle('active')
        selection.classList.toggle('active')
    }
    else {
        options.classList.remove('active')
        selection.classList.remove('active')
    }
}

options.onclick = (e) => {
    if (e.target.tagName == 'INPUT') {
        selectionValue.value = e.target.value
        cardList.innerHTML = ''
        axios.get(data).then(response => {
            if (e.target.value == 'a-z') {
                let arr = response.data.sort((a, b) => a.name.localeCompare(b.name))
                arr.forEach(item => {
                    cardList.innerHTML += `
                        <div class="card">
                            <div class="overlay">
                                <a href="details.html?id=${item.id}">View Details</a>
                                <button onclick="update(${item.id})" >Update</button>
                                <button onclick="deleteItem(${item.id})">Delete</button>
                                <button onclick="addFavorite(${item.id})">Add Favorite</button>
                                <button onclick="addBasket(${item.id})">Add Basket</button>
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
            }
            else if (e.target.value == 'z-a') {
                let arr = response.data.sort((a, b) => b.name.localeCompare(a.name))
                arr.forEach(item => {
                    cardList.innerHTML += `
                        <div class="card">
                            <div class="overlay">
                                <a href="details.html?id=${item.id}">View Details</a>
                                <button onclick="update(${item.id})" >Update</button>
                                <button onclick="deleteItem(${item.id})">Delete</button>
                                <button onclick="addFavorite(${item.id})">Add Favorite</button>
                                <button onclick="addBasket(${item.id})">Add Basket</button>
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
            }
            else{
                showData(page)
            }
        })
    }
}