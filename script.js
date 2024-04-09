const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const weatherCardsContainer = document.querySelector(".weather-cards");

// Personal Api Key from Open Weather
const ApiKey = "2c4b7c5766e0dd52db1d9b8ea76ac816";

const updateWeatherUI = (weatherData) => {
  const { name, main, wind, weather } = weatherData;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

  // Update the city name and other weather details in the UI
  document.getElementById("city-name").textContent = name;
  document.getElementById("current-temp").textContent = `Temperature: ${main.temp} K`;
  document.getElementById("current-wind").textContent = `Wind: ${wind.speed} m/s`;
  document.getElementById("current-humidity").textContent = `Humidity: ${main.humidity}%`;
  document.getElementById("current-icon").src = iconUrl;
  document.getElementById("current-description").textContent = weather[0].description;
};

const createWeatherCard = (weatherItem) => {
  // Create HTML structure for weather card and append it to weatherCardsContainer
  const weatherCard = document.createElement("li");
  weatherCard.classList.add("card");

  const iconUrl = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png`;

  weatherCard.innerHTML = `
    <img src="${iconUrl}" alt="weather-icon" />
    <h1>${weatherItem.name}</h1>
    <h3>Temperature: ${weatherItem.main.temp} K</h3>
    <h3>Wind: ${weatherItem.wind.speed} m/s</h3>
    <h3>Humidity: ${weatherItem.main.humidity}%</h3>
  `;

  weatherCardsContainer.appendChild(weatherCard);
};

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}`;

  fetch(WEATHER_API)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Weather Data:", data); // Debugging: Log weather data

      weatherCardsContainer.innerHTML = ""; // Clear previous weather cards

      // Get 1 forecast per day for the next 5 days
      const fiveDaysForecast = data.list.filter((forecast) => {
        return new Date(forecast.dt_txt).getHours() === 12; // Assuming forecast for 12 PM
      });

      console.log("Filtered Forecast:", fiveDaysForecast); // Debugging: Log filtered forecast

      fiveDaysForecast.forEach((weatherItem) => {
        createWeatherCard(weatherItem);
      });

      updateWeatherUI(data.list[0]); // Update current weather UI
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Something went wrong while fetching weather data!");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;

  const coordinatesURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${ApiKey}`;

  fetch(coordinatesURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Coordinates Data:", data); // Debugging: Log coordinates data
      if (!data.length) return alert("City not found!");
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch((error) => {
      console.error("Error fetching coordinates:", error);
      alert("Something went wrong while fetching city coordinates!");
    });
};

searchButton.addEventListener("click", getCityCoordinates);
