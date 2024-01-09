const basket = 'http://localhost:3000/basket/'

const basketList = document.querySelector('.basket-list')
const total = document.querySelector('.total')

let sum = 0

const plus = (id, count) => {
    count++
    axios.patch(basket + id, {count: count}).then(res => window.location.reload())
}
const minus = (id, count) => {
    count > 1 ? count -- : count = 1
    axios.patch(basket + id, {count: count}).then(res => window.location.reload())
}

const deleteBasket = (id) => {
    axios.delete(basket + id).then(response => window.location.reload())
}

axios.get(basket).then(response => {
    response.data.forEach(element => {
        let price = element.price.slice(1) * element.count
        basketList.innerHTML += `
        <div class="list-item">
            <div class="left">
                <div class="image">
                    <i onclick="deleteBasket(${element.id})" class="bx bx-trash"></i>
                    <img src=${element.image} alt="visit">
                </div>
                <div class="desc">
                    <span>${element.name}</span>
                    <p>$${price}</p>
                </div>
            </div>
            <div class="right">
                <button onclick="minus(${element.id}, ${element.count})"><i class="bx bx-minus"></i></button>
                <span>${element.count}</span>
                <button onclick="plus(${element.id}, ${element.count})"><i class="bx bx-plus"></i></button>
            </div>
        </div>`
        return sum = sum + price
    });
    total.innerHTML = `Total: $${sum}`
})