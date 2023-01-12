
const mealEl_container = document.querySelector('.meal');
const popup_container = document.querySelector('.pop-up-container');
const close_popup_btn = document.querySelector('.pop-up > i');
const popup = document.querySelector('.pop-up-inner');
var ingredients = document.getElementById('ingredients');

let lastArray;
let areaSelect = document.querySelector('#areaSelect');
let categorySelect = document.querySelector('#categorySelect');
let contentContainer = document.querySelector('#content');
let areaData = [];
let categoryData = [];
let filteredData = {
    meals: []
};

getOptions("https://www.themealdb.com/api/json/v1/1/list.php?a=list", "strArea", "Moroccan", areaSelect);
getOptions("https://www.themealdb.com/api/json/v1/1/list.php?c=list", "strCategory", "Lamb", categorySelect);
getDataFromApi(`https://www.themealdb.com/api/json/v1/1/filter.php?a=Moroccan`).then(async (response) => {
    areaData = await response.meals;
}).then(() => {
    getDataFromApi("https://www.themealdb.com/api/json/v1/1/filter.php?c=Lamb").then(async (response) => {
        categoryData = await response.meals
    }).then(() => {
        filter(filteredData.meals);
        contentContainer.innerHTML = ""
        showInCards(filteredData)
    })
})
areaSelect.addEventListener('change', () => {
    showInCardsFiltered()
})
categorySelect.addEventListener('change', () => {
    showInCardsFiltered()
})

function showInCardsFiltered() {
    contentContainer.innerHTML = ""
    if (areaSelect.value == 0 && categorySelect.value == 0) {
        let img = document.createElement('img');
        img.setAttribute('src', 'depositphotos_51087345-stock-illustration-cartoon-frying-pan.jpg');
        img.setAttribute('alt', 'depositphotos_51087345-stock-illustration-cartoon-frying-pan.jpg');
        img.classList.add('opacity-50')
        img.style.width = "300px";
        contentContainer.append(img)
        let notFound = document.createElement('h4')
        notFound.append("Please Select at least one of Areas or Categories");
        notFound.setAttribute('class', 'opacity-50 text-center')
        contentContainer.append(notFound);
        document.querySelector('#pagination').innerHTML = '';
    }else if (areaSelect.value !== "0" && categorySelect.value !== "0") {
        getDataFromApi(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaSelect.value}`).then(async (response) => {
            areaData = await response.meals;
        }).then(() => {
            getDataFromApi(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorySelect.value}`).then(async (response) => {
                categoryData = await response.meals
            }).then(() => {
                filteredData = {
                    meals: []
                };
                filter(filteredData.meals);
                showInCards(filteredData)
            })
        })
    }else if(areaSelect.value === "0" ) {
        getDataFromApi(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorySelect.value}`).then(async (response) => {
            await showInCards(response);
        })
    }else {
        getDataFromApi(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaSelect.value}`).then(async (response) => {
            await showInCards(response);
        })
    }
} 

function getOptions(url, dataToGet, selectedValue, selectElement) {
    return fetch(url).then(async (response) => {
        let data = await response.json()
        data.meals.forEach((element) => {
            let option = document.createElement('option');
            option.append(element[dataToGet]);
            option.setAttribute('value', element[dataToGet]);
            if (element[dataToGet] === selectedValue) {
                option.setAttribute('selected', '');
            }
            selectElement.append(option)
        })
        return data;
    })

} 

function filter(array) {
    areaData.forEach((areaMeal) => {
        categoryData.forEach((categoryMeal) => {
            if (areaMeal.strMeal === categoryMeal.strMeal) {
                array.push(areaMeal)
            }
        })
    })
} 

function recipeMe(data) {
    let meal = data.meals[0]
    document.querySelector("#modal-label").innerHTML = meal.strMeal;
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';
    let image = document.createElement('img');
    image.setAttribute('src', `${meal.strMealThumb}`);
    image.setAttribute('class', 'card-img-top img-fluid');
    image.setAttribute('alt', 'meal thumbnail');
    modalBody.append(image);
    let instructionsTitle = document.createElement('h5')
    instructionsTitle.append('Instructions');
    instructionsTitle.classList.add('mt-4')
    modalBody.append(instructionsTitle)
    let instructions = document.createElement('p');
    instructions.append(meal.strInstructions);
    modalBody.append(instructions);
    let ingredientTitle = document.createElement('h5');
    ingredientTitle.append('Ingredients');
    modalBody.append(ingredientTitle);
    let ingredients = document.createElement('ul');
    
    for (let i = 1; i <= 20; i++) {
        let mesure = "strMeasure" + i;
        let ingredient = "strIngredient" + i;
        if (meal[mesure] !== "" && meal[mesure] !== null && meal[mesure] !== " ") {
            let li = document.createElement('li');
            li.append(`${meal[ingredient]}: ${meal[mesure]}`)
            ingredients.append(li);
        }
    }
    modalBody.append(ingredients);
} 

function showInCards(data, indexOfArray = 0) {
    lastArray = [];
    let firstIndex = 0;
    let lasIndex = 6;
    document.querySelector('#pagination').innerHTML = '';
    if (data.meals == null || data.meals.length == 0) {
        contentContainer.innerHTML = "";
        let img = document.createElement('img');
        img.setAttribute('src', 'image/depositphotos_51087345-stock-illustration-cartoon-frying-pan.jpg');
        img.setAttribute('alt', 'error-sticker');
        img.classList.add('opacity-50')
        img.style.width = "300px";
        contentContainer.append(img)
        let notFound = document.createElement('h4')
        notFound.append("There is still no recipe for your demand we will try to add it soon");
        notFound.setAttribute('class', 'opacity-50 text-center')
        contentContainer.append(notFound);
        document.querySelector('#pagination').innerHTML = '';
    } else {
        for (let i = 0; i < Math.ceil(data.meals.length / 6); i++) { 
            if (lasIndex > data.meals.length) { 
                lasIndex = data.meals.length
            }
            lastArray.push(data.meals.slice(firstIndex, lasIndex));
            lasIndex += 6;
            firstIndex += 6;
        }
        lastArray[indexOfArray].forEach((meal) => {
            let card = document.createElement('div');
            card.setAttribute('class', 'p-0 card col-xl-3 col-sm-8 col-md-5 col-lg-4');
            let cardBody = document.createElement('div');
            let buttonContainer = document.createElement('div');
            buttonContainer.setAttribute('class', 'w-100 mt-4 d-flex justify-content-center align-items-center');
            var meal_card = document.createElement('div');
            meal_card.classList.add('meal-card');
            meal_card.innerHTML = `
                <div class="meal-card-img-container">
                    <img
                    src="${meal.strMealThumb}"
                    />
                </div>
                <div class="meal-name">
                    <p>${meal.strMeal}</p>
                
                </div>`;
                
                meal_card.addEventListener('click', (e) => {
                    getDataFromApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${e.target.dataset.id}`).then((response) => {
                        recipeMe(response)
                    })
                })
            buttonContainer.append(meal_card);
            cardBody.append(buttonContainer);
            card.append(cardBody)
            contentContainer.append(card);
        })
        createPages(data.meals, indexOfArray)
    }
}

function getDataFromApi(url,) {
    return fetch(url)
        .then(async (response) => {
            Array = await response.json();
            return Array
        })
} 

function extract(arrayToExtract) {
    let extractedArray = {
        meals: []
    };
    arrayToExtract.forEach(e => {
        e.forEach(e => {
            extractedArray.meals.push(e);
        })
    })
    return extractedArray
} 

function createPages(data, indexOfData) {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let numberOfPage = Math.ceil(data.length / 6);
    let ul = document.createElement('ul');
    ul.classList.add('pagination');
    let previous = document.createElement("li");
    previous.classList.add('page-item');
    let a = document.createElement('a');
    a.classList.add('page-link');
    a.append('<');
    if (indexOfData === 0) {
        previous.classList.add('disabled')
    } else { 
        a.addEventListener('click', () => {
            contentContainer.innerHTML = "";
            showInCards(extract(lastArray), document.querySelector('#pagination .active').dataset.page - 2); // this is just call to the show  and extract functions
        });
    }
    previous.append(a);
    ul.append(previous);
    for (let i = 0; i < numberOfPage; i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        let a = document.createElement('a');
        a.classList.add('page-link');
        a.classList.add('d-none')
        a.append(`${i + 1}/${numberOfPage}`)
        a.setAttribute('data-page', `${i + 1}`)
        li.append(a);
        ul.append(li);
    }
    let next = document.createElement('li');
    next.classList.add('page-item');
    let nextA = document.createElement('a');
    nextA.classList.add('page-link');
    nextA.append('>')
    next.append(nextA);
    ul.append(next);
    document.querySelector('#pagination').innerHTML = '';
    document.querySelector('#pagination').append(ul);
    document.querySelector(`#pagination li:nth-child(${indexOfData + 2})>a`).classList.add('active')
    document.querySelector(`#pagination li:nth-child(${indexOfData + 2})>a`).classList.remove('d-none')
    if (document.querySelector(`#pagination li:nth-child(${indexOfData + 2}) a`).dataset.page == numberOfPage) {
        document.querySelector('#pagination li:last-child').classList.add('disabled')
    } else {
        document.querySelector('#pagination li:last-child').addEventListener('click', () => {
            contentContainer.innerHTML = "";
            showInCards(extract(lastArray), +document.querySelector(`#pagination .active`).dataset.page);
        });
    }

} 






