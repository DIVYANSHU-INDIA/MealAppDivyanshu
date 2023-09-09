// Get references to HTML elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResultsContainer = document.getElementById('search-results');
const favoritesLink = document.getElementById('favorites-link');
const resetButton = document.getElementById('reset-button');
const favoriteMeals = [];

// Event listener for the search button
searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value;

  // Fetch data from the meal API
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals === null) {
        alert('No meals found for this search query.');
      } else {
        displaySearchResults(data.meals);
      }
    })
    .catch(error => {
      console.error(error);
    });
});

// Function to display search results
function displaySearchResults(meals) {
  searchResultsContainer.innerHTML = '';
 
  meals.forEach(meal => {
    const mealElement = document.createElement('div');
    mealElement.classList.add('meal');

    const mealImage = document.createElement('img');
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;
    mealElement.appendChild(mealImage);

    const mealName = document.createElement('h2');
    mealName.innerText = meal.strMeal;
    mealElement.appendChild(mealName);

    const mealIngredients = document.createElement('ul');
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        const ingredient = document.createElement('li');
        ingredient.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
        mealIngredients.appendChild(ingredient);
      } 
    }

    mealElement.appendChild(mealIngredients);

    const mealDescription = document.createElement('p');
    mealDescription.classList.add('description');
    mealDescription.innerText = meal.strInstructions;
    
    const readMoreButton = document.createElement('button');
    readMoreButton.innerHTML = 'Read More';
    readMoreButton.classList.add('custom-button');
    readMoreButton.addEventListener('click', () => {
      mealElement.appendChild(mealDescription);
    });
    mealElement.appendChild(readMoreButton);

    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('custom-button');
    favoriteButton.innerHTML = ' Add to Favorites';
    favoriteButton.addEventListener('click', () => {
      addToFavorites(meal);
    });
    mealElement.appendChild(favoriteButton);

    searchResultsContainer.appendChild(mealElement);
  });
}

// Function to add a meal to favorites
function addToFavorites(meal) {
  if (!favoriteMeals.includes(meal)) {
    favoriteMeals.push(meal);
    alert(`${meal.strMeal} has been added to your favorites.`);
  } else {
    alert(`${meal.strMeal} is already in your favorites.`);
  }
}

// Event listener for displaying favorite meals
favoritesLink.addEventListener('click', showFavorites);

// Function to display favorite meals
function showFavorites() {
  searchResultsContainer.innerHTML = '';
  
  if (favoriteMeals.length === 0) {
    const noFavoritesMessage = document.createElement('p');
    noFavoritesMessage.innerText = 'You have no favorite meals.';
    searchResultsContainer.appendChild(noFavoritesMessage);
  } else {
    favoriteMeals.forEach(meal => {
      const mealElement = document.createElement('div');
      mealElement.classList.add('meal');

      const mealName = document.createElement('h2');
      mealName.innerText = meal.strMeal;
      mealElement.appendChild(mealName);

      const mealIngredients = document.createElement('ul');
      for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) {
              const ingredient = document.createElement('li');
              ingredient.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
              mealIngredients.appendChild(ingredient);
          } else {
              break;
          }
      }
      mealElement.appendChild(mealIngredients);

      const removeButton = document.createElement('button');
      removeButton.innerHTML = '<i class="fas fa-trash"></i> Remove from Favorites';
      removeButton.classList.add('custom-button');
      removeButton.addEventListener('click', () => {
          removeFromFavorites(meal);
      });
      mealElement.appendChild(removeButton);

      searchResultsContainer.appendChild(mealElement);
    });
  }
}

// Function to remove a meal from favorites
function removeFromFavorites(meal) {
  const mealIndex = favoriteMeals.findIndex(fav => fav.idMeal === meal.idMeal);
  if (mealIndex !== -1) {
    favoriteMeals.splice(mealIndex, 1);
    showFavorites();
    alert(`${meal.strMeal} has been removed from your favorites.`);
  }
}

// Event listener for the reset button
resetButton.addEventListener('click', function() {
    searchResultsContainer.innerHTML = '';
});
