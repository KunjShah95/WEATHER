const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const forecast = document.getElementById('forecast');
const popularCities = document.querySelectorAll('.popular-cities button'); 
const unitToggle = document.getElementById('unitToggle'); // New toggle for units
const favoritesList = document.getElementById('favoritesList'); // New list for favorite cities

const apiKey = "a95365bcf7208c5f0284d8bb15d65f1b"; 
let isCelsius = true; // Default unit

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    console.log(`Searching for weather in: ${city}`); // Debugging log
    getWeather(city);
});

popularCities.forEach(cityButton => {
    cityButton.addEventListener('click', () => {
        const city = cityButton.dataset.city; // Get city from data attribute
        cityInput.value = city; // Set input field
        console.log(`Searching for weather in: ${city}`); // Debugging log
        getWeather(city);
    });
});

// New event listener for unit toggle
unitToggle.addEventListener('change', () => {
    isCelsius = unitToggle.checked; // Update unit based on toggle
    const city = cityInput.value;
    if (city) {
        getWeather(city); // Re-fetch weather data with new unit
    }
});

async function getWeather(city) {
    try {
        // Show loading indicator
        showLoadingIndicator();

        const unit = isCelsius ? 'metric' : 'imperial'; // Set unit for API call
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`);
        const weatherData = await response.json();

        if (response.ok) {
            cityName.textContent = weatherData.name;
            temperature.textContent = `Temperature: ${weatherData.main.temp}°${isCelsius ? 'C' : 'F'}`;
            condition.textContent = `Condition: ${weatherData.weather[0].description}`;
            getForecast(city);
        } else {
            throw new Error(weatherData.message);
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
        cityName.textContent = "City not found";
        temperature.textContent = "";
        condition.textContent = "";
        forecast.innerHTML = "";
    } finally {
        // Hide loading indicator
        hideLoadingIndicator();
    }
}

async function getForecast(city) {
    try {
        const unit = isCelsius ? 'metric' : 'imperial'; // Set unit for API call
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`);
        const forecastData = await forecastResponse.json();

        forecast.innerHTML = "";

        for (let i = 0; i < 5; i++) {
            const forecastItem = forecastData.list[i * 8];

            const forecastDiv = document.createElement('div');
            forecastDiv.classList.add('forecast-item');
            forecastDiv.innerHTML = `
                <p>${new Date(forecastItem.dt * 1000).toLocaleDateString()}</p>
                <p>${forecastItem.main.temp}°${isCelsius ? 'C' : 'F'}</p>
                <p>${forecastItem.weather[0].description}</p>
            `;
            forecast.appendChild(forecastDiv);
        }

    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

function showLoadingIndicator() {
    // Implement loading indicator logic here
}

function hideLoadingIndicator() {
    // Implement logic to hide loading indicator here
}

// New function to save favorite cities
function saveFavoriteCity(city) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesList();
    }
}

// New function to update the favorites list in the UI
function updateFavoritesList() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = '';
    favorites.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        favoritesList.appendChild(li);
    });
}

// Call updateFavoritesList on page load to display saved favorites
updateFavoritesList();
