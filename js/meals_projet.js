const search_input = document.querySelector('.search-input');
const search_icon = document.querySelector('.search_i');
const mealEl_container = document.querySelector('.meal');
var theme = "light";
var data = [];
var card = document.querySelector('.card');
var paginate = document.querySelector('#pagination');

const popup_container = document.querySelector('.pop-up-container');
const close_popup_btn = document.querySelector('.pop-up > i');
const popup = document.querySelector('.pop-up-inner');

getRandomMeal();
var random_num = 5;
// Generates Random Meal from the MealDB API
async function getRandomMeal() {
    const resp = await fetch(
    'https://www.themealdb.com/api/json/v1/1/random.php'
    );
    const respData = await resp.json();
    

    for( let i= 0 ; i <= random_num ; i++){
        const resp = await fetch(
            'https://www.themealdb.com/api/json/v1/1/random.php'
        );
        const respData = await resp.json();
        const random_meal = respData.meals[0];
        data = random_meal
        addMeal(data);
}
}

// Fetches the Meal upon search
async function getMealsBySearch(term) {
  paginate.style.opacity= '1';
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  const respData = await resp.json();
  const meals = respData.meals;
  
  return meals;
}

// Performs Search Meal Operation
search_icon.addEventListener('click', async () => {
  mealEl_container.innerHTML = '';
  const searchVal = search_input.value;
  // exemple: recher par mot clé chicken ==> 10 éléments
  data = await getMealsBySearch(searchVal);
  paginate.style.opacity= '1';

  SearchMeals(data)
  function SearchMeals(data) { 
    // var index =  i < first + numberOfitems; i++;
    if (data) {
      for (let i = first; i < first + numberOfitems; i++) {
        if(i < data.length){

        addMeal(data[i]);
        showPageInfo()

        }}
      document.querySelector('.meals-container > h2').innerText =
        'Search Results';
    } else {
      document.querySelector('.meals-container > h2').innerText =
        'No Meals Found';
      mealEl_container.innerHTML = '';
      randommeal.style.color = 'red';
    }
  }
});

// Function to Add Meal Searched by User
function addMeal(data) {
  
  var meal_card = document.createElement('div');
  meal_card.classList.add('meal-card'); 
  meal_card.innerHTML = `
        <div class="meal-card-img-container">
            <img
            src="${data.strMealThumb}"
            />
        </div>
        <div class="meal-name">
            <p>${data.strMeal}</p>
        
        </div>`;

  mealEl_container.appendChild(meal_card);
  meal_card.firstChild.nextSibling.addEventListener('click', () => {
    showMealPopup(data);
  });
}
// Displays the Meal Details in Modal
function showMealPopup(data) {
  popup.innerHTML = '';
  const newPopup = document.createElement('div');
  newPopup.classList.add('pop-up-inner');
  document.querySelector('nav').style.display = 'none';
  document.querySelector('.card').style.display='none';
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (data[`strIngredient${i}`]) {
        
      ingredients.push(
        `${data[`strIngredient${i}`]} - ${data[`strMeasure${i}`]}`
      );
    } else {
        
      break;
    }
  }          
  newPopup.innerHTML = `<div class="left">
  <div class="meal-card">
    <div class="meal-card-img-container">
      <img
        src="${data.strMealThumb}"
      />
    </div>
    <div class="meal-name">
      <p>${data.strMeal}</p>
      <i class="fa-regular fa-heart"></i>
    </div>
  </div>
  <div class="recipe-link">
  <a href="${data.strYoutube}" target="_blank">
  <button type="button" class="btn btn-outline-success">
  Watch Recipe<i class="fa-brands fa-youtube"></i>
  </button>
  </a>
  </div>
</div>
<div class="right">
  <div>
    <h2>Instructions</h2>
    <p class="meal-info">
      ${data.strInstructions}
    </p>
  </div>
  <div>
    <h2>Ingredients / Measures</h2>
    <ul>
      ${ingredients.map((e) => `<li>${e}</li>`).join('')}
    </ul>
  </div>
</div>`;

  popup.appendChild(newPopup);
  popup_container.style.display = 'flex';
}

// Close the Popup Modal
close_popup_btn.addEventListener('click', () => {
  popup_container.style.display = 'none';
  document.querySelector('nav').style.display = 'block';
  document.querySelector('.card').style.display='block';
});

let numberOfitems = 6;
let first = 0 ;
var actualpage = 1 ;

function nextPage() {
  actualpage++;
  first += numberOfitems;
  var lastIndex = (data.length < first + numberOfitems) ? data.length : first + numberOfitems;
  mealEl_container.innerHTML = '';
  for (let i = first; i < lastIndex; i++) {
    addMeal(data[i]);
  }
  showPageInfo()
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function previous() {
  actualpage--;
  first -= numberOfitems;
  var lastIndex = (data.length < first + numberOfitems) ? data.length : first + numberOfitems;
  mealEl_container.innerHTML = '';
  for (let i = first; i < lastIndex; i++) {
    addMeal(data[i]);
  }
  showPageInfo()
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function showPageInfo() {
  let topnextpage = Math.ceil(data.length / numberOfitems);
  document.querySelector('.pageinfo').innerHTML = `
  Page ${actualpage} / ${topnextpage}
  
  `;
}

var mybutton = document.getElementById("button");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

document.querySelector(".toggle").addEventListener("click", (e) => {
  if (theme == "light") {
    theme = "dark";
    // Change the icon to the sun icon
    document.querySelector("body").style.background = "#ffe600";
    document.querySelector("body").style.color = "#ffe600";
  } else {
    theme = "light";
    // Change the icon to the moon icon
    document.querySelector("body").style.background = '#ffff';
    document.querySelector("body").style.color = "#ffff";
  }
});