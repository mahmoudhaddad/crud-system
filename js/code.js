//get total price

const root = document.documentElement
const mode = document.getElementById('mode')
const title = document.getElementById('title')
const price = document.getElementById('price')
const taxes = document.getElementById('taxes')
const ads = document.getElementById('ads')
const discount = document.getElementById('discount')
const total = document.getElementById('total')
const count = document.getElementById('count')
const category = document.getElementById('category')
const submit = document.getElementById('submit')
const update = document.getElementById('update')
const searchInput = document.getElementById('search')
const searchTitle = document.getElementById('search-title')
const searchCategory = document.getElementById('search-category')
const deleteAll = document.getElementById('delete-all')
const tableBody = document.getElementById('table-body')


// **************** change mode ********************

mode.addEventListener('click', () => {
    mode.classList.toggle('fa-sun')
    mode.classList.toggle('fa-moon')

    root.classList.toggle('dark')
})

// *************** get total ***********************



function getTotal(){
    if (price.value != ''){
        let result = +price.value + +taxes.value + +ads.value - (discount.value)
        total.innerText = result
        total.style.backgroundColor = '#040'
    }else{
        total.innerText = ''
        total.style.backgroundColor = 'red'
    }
}

price.addEventListener('input', getTotal)
taxes.addEventListener('input', getTotal)
ads.addEventListener('input', getTotal)
discount.addEventListener('input', getTotal)

// ************* clear data ******************

function clearData() {
    title.value = ''
    price.value = ''
    taxes.value = ''
    ads.value = ''
    discount.value = ''
    total.innerText = ''
    count.value = ''
    category.value = ''
}

// **************** create **********************

let products =  JSON.parse(localStorage.getItem('products')) || [];

function create() {

    if (title.value != '' && price.value != '' && category.value != '') {
        let product = {
            'title': title.value,
            'price': price.value,
            'taxes': taxes.value === '' ? 0 : taxes.value,
            'ads': ads.value === '' ? 0 : ads.value,
            'discount': discount.value === '' ? 0 : discount.value,
            'total': total.innerText,
            'count': count.value,
            'category': category.value,
        }
    
        if (count.value > 1){
            for (let i = 0; i < count.value; i++) {
                products.push(product)
            }
        }else{
            products.push(product)
        }
    
        total.style.backgroundColor = 'red'
    
        localStorage.setItem('products', JSON.stringify(products))
    
        clearData()
    }

    read()
}

submit.addEventListener('click', create)


// ************** read ***********************

let updateBtn = document.createElement('button')
updateBtn.innerText = 'update'
updateBtn.classList.add('updateBtn')

let deleteBtn = document.createElement('button')
deleteBtn.innerText = 'delete'
deleteBtn.classList.add('deleteBtn')


function read() {

    tableBody.innerText = ''

    products.forEach((e, i) => {
        let dataRow = document.createElement('tr')
        let idEl = document.createElement('td')
        let titleEl = document.createElement('td')
        let priceEl = document.createElement('td')
        let taxesEl = document.createElement('td')
        let adsEl = document.createElement('td')
        let discountEl = document.createElement('td')
        let totalEl = document.createElement('td')
        let categoryEl = document.createElement('td')
        let updateEl = document.createElement('td')
        let deleteEl = document.createElement('td')

        idEl.innerText = i+1
        titleEl.innerText = e.title
        priceEl.innerText = e.price
        taxesEl.innerText = e.taxes
        adsEl.innerText = e.ads
        discountEl.innerText = e.discount
        totalEl.innerText = e.total
        categoryEl.innerText = e.category
        updateEl.appendChild(updateBtn.cloneNode(true))
        deleteEl.appendChild(deleteBtn.cloneNode(true))

        dataRow.appendChild(idEl)
        dataRow.appendChild(titleEl)
        dataRow.appendChild(priceEl)
        dataRow.appendChild(taxesEl)
        dataRow.appendChild(adsEl)
        dataRow.appendChild(discountEl)
        dataRow.appendChild(totalEl)
        dataRow.appendChild(categoryEl)
        dataRow.appendChild(updateEl)
        dataRow.appendChild(deleteEl)

        tableBody.appendChild(dataRow)
    });

    products.length > 0 ? deleteAll.classList.remove('hide') : deleteAll.classList.add('hide')

    deleteAll.innerText = `delete all (${products.length})`

    getTotal()

    deleteListener()

    updateListener()
    
    
}


read()

// ************** delete ***********************

function deleteListener() {
    document.querySelectorAll('.deleteBtn').forEach((e) => {
        e.addEventListener('click', () => {

            let myId = e.parentElement.parentElement.firstChild.innerText - 1
            
            console.log(myId);
            
            products.splice(myId, 1)
              
            localStorage.setItem('products', JSON.stringify(products))
    
            read()
        })
    })


}

function deleteAllFunction() {
    products = []

    localStorage.setItem('products', JSON.stringify(products))

    read()
}

deleteAll.addEventListener('click', deleteAllFunction)

// ************** update ***********************

let targetObj;

function updateListener() {
    document.querySelectorAll('.updateBtn').forEach((e) => {
        e.addEventListener('click', () => {

            targetId = e.parentElement.parentElement.firstChild.innerText - 1
    
            targetObj = products[targetId]

            console.log(targetObj);
    
            title.value = targetObj.title
            price.value = targetObj.price
            taxes.value = targetObj.taxes
            ads.value = targetObj.ads
            discount.value = targetObj.discount
            category.value = targetObj.category

            getTotal()

            update.classList.remove('hide')
            submit.classList.add('hide')
            count.classList.add('hide')

            scroll({
                top: 0,
                behavior: 'smooth'
            })
        })
        products = JSON.parse(localStorage.getItem('products'))

    })
}

update.addEventListener('click', () => {

    console.log(targetObj);

    products.title = title.value 
    targetObj.price = price.value
    targetObj.taxes = taxes.value
    targetObj.ads = ads.value
    targetObj.discount = discount.value
    targetObj.total = total.innerText
    targetObj.category = category.value

    console.log(products);

    localStorage.setItem('products', JSON.stringify(products))

    read()

    clearData()

    update.classList.add('hide')
    submit.classList.remove('hide')
    count.classList.remove('hide')
    total.style.backgroundColor = 'red'
    
})

// ************** search ***********************

function searchData(value, type) {

    let regex = new RegExp(value, 'ig');

    let searchedProducts = products.map((el, index) => {
        return el[type].search(regex) > -1  ? index : undefined
    }).filter((el) => {
        return el !== undefined
    })

    tableBody.innerText = ''

    searchedProducts.forEach((el) => {

        let dataRow = document.createElement('tr')
        let idEl = document.createElement('td')
        let titleEl = document.createElement('td')
        let priceEl = document.createElement('td')
        let taxesEl = document.createElement('td')
        let adsEl = document.createElement('td')
        let discountEl = document.createElement('td')
        let totalEl = document.createElement('td')
        let categoryEl = document.createElement('td')
        let updateEl = document.createElement('td')
        let deleteEl = document.createElement('td')

        idEl.innerText = el + 1
        titleEl.innerText = products[el].title
        priceEl.innerText = products[el].price
        taxesEl.innerText = products[el].taxes
        adsEl.innerText = products[el].ads
        discountEl.innerText = products[el].discount
        totalEl.innerText = products[el].total
        categoryEl.innerText = products[el].category
        updateEl.appendChild(updateBtn.cloneNode(true))
        deleteEl.appendChild(deleteBtn.cloneNode(true))

        dataRow.appendChild(idEl)
        dataRow.appendChild(titleEl)
        dataRow.appendChild(priceEl)
        dataRow.appendChild(taxesEl)
        dataRow.appendChild(adsEl)
        dataRow.appendChild(discountEl)
        dataRow.appendChild(totalEl)
        dataRow.appendChild(categoryEl)
        dataRow.appendChild(updateEl)
        dataRow.appendChild(deleteEl)

        tableBody.appendChild(dataRow)
    });

    deleteListener()

    updateListener()

}

function searchTitleFunction(){
    searchData(searchInput.value,  'title')
}
function searchCategoryFunction(){
    searchData(searchInput.value,  'category')
}

searchTitle.addEventListener('click', searchTitleFunction)
searchCategory.addEventListener('click', searchCategoryFunction)