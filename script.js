const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");

// Personal Api Key from Open Weather
const ApiKey = "2c4b7c5766e0dd52db1d9b8ea76ac816";

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}`;

  fetch(WEATHER_API)
    .then((response) => response.json())
    .then((data) => {
      // Get 1 forecast a day
      const uniqueForeCastDays = [];

      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForeCastDays.includes(forecastDate)) {
          return uniqueForeCastDays.push(forecastDate);
        }
      });

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherItem) => {
        createWeatherCard(weatherItem);
      });
    })
    .catch(() => {});
};


// Grabs Info from Open weather Api/ Showing alert if user does not type a real location
const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  const coordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${ApiKey}`;

  fetch(coordinates)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return alert("Something went wrong!");
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("Something went wrong!!");
    });
};

searchButton.addEventListener("click", getCityCoordinates);
