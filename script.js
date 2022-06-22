const search = document.getElementById('search'),
      submit = document.querySelector('#submit'),
      random = document.querySelector('#random'),                   // Generating variables
      mealsEl = document.getElementById('meals'),       
      resultHeading = document.getElementById('result-heading'),
      single_mealEl = document.getElementById('single-meal');


//Event Listeners
submit.addEventListener('submit', fetchMeal);                   // On click listener for Submit
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find((item) => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    })
    if(mealInfo) {
        const mealID = mealInfo.dataset.mealid;
        getMealById(mealID);
    }
});
random.addEventListener('click', getRandomMeal);

function fetchMeal(e) {
e.preventDefault();

//Clear single meal
single_mealEl.innerHTML = '';

//Get search term
const term = search.value;

//Check for empty input
if(term.trim()) {
//Fetch meal by first letter
if(term.length === 1) {
    if(/[A-Za-z]/.test(term)) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
        .then(res => res.json())
        .then(data => {
            mealsEl.innerHTML = data.meals.map(meal => {
                return `
                <div class="meal">
                <img src="${meal.strMealThumb}" />
                <div class="meal-info" data-mealid="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
                </div>`;
            }).join('');
        })
    }
} else {
//fetch letter by keyword
fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
.then(function(res){ return res.json()})
.then(function(data){ 
    resultHeading.innerHTML = `
<h2>Search results for  '${term}'</h2>
`;
    if(data.meals === null) {
        resultHeading.innerHTML = 'There are no search results for ' + term + '. Try Again!'
    } else {
        mealsEl.innerHTML = data.meals.map(function(meal){
            return `<div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
            </div>`
        }).join('');
    }
});
}


//Clear search text
search.value = '';
} else {
    const element = document.createElement('h1');
    element.className = 'alert';
    element.textContent = 'Please enter a value';
    document.body.insertBefore(element, document.querySelector('.container'));
    setTimeout(() => {element.remove()}, 2000);
}
}

//Fetch meal by id function
function getMealById(mealID) {
fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
.then(res => res.json())
.then(data => { 
    const meal = data.meals[0];

    addMealToDOM(meal);
})
.catch(console.log('Something went wrong'));
}

function addMealToDOM(meal) {
    const ingredients = [];
    for(let i = 1; i <= 20; i++) {
       if(meal[`strIngredient${i}`]){
          ingredients.push(`${meal[`strIngredient${i}`]} - 
          ${meal[`strMeasure${i}`]}`);
       } else {
          break;
       }
    }
    single_mealEl.innerHTML = `
    <div class="single-meal">
<h1>${meal.strMeal}</h1>
<img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
<div class="single-meal-info">
${meal.strCategory ? `<p>${meal.strCategory}</p>` : '' }
${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
<div class="main">
<p>${meal.strInstructions}</p>
<h2>Ingredients</h2>
<ul>
${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
</ul>
</div>
</div>
    </div>
    `;
}
//Fetch random meal from the api
function getRandomMeal() {
    resultHeading.innerHTML = '';
    mealsEl.innerHTML = '';

    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        
        addMealToDOM(meal);
    })
}