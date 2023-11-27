const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");

const ApiKey = "2c4b7c5766e0dd52db1d9b8ea76ac816";

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  const coordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${ApiKey}`;

  fetch(coordinates)
    .then(response => response.json())
    .then(data => {
      if (!data.length) return alert("Something went wrong!");
    })
    .catch(() => {
      alert("Something went wrong!");
    });
};

searchButton.addEventListener("click", getCityCoordinates);
