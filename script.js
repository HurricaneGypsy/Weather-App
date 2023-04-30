const datetime = document.getElementById("datetime");

const date = new Date();

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "short",
};
const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);
const formattedDateTime = dateTimeFormat.format(date);
datetime.innerHTML = formattedDateTime;
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function searchLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "59a70ea155f6bd700d4dc06ce96174c8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  // Convert Unix time to local time
  const sunrise = new Date(
    (response.data.sys.sunrise + response.data.timezone) * 1000
  ).toLocaleTimeString();
  const sunset = new Date(
    (response.data.sys.sunset + response.data.timezone) * 1000
  ).toLocaleTimeString();

  document.querySelector("#rise").innerHTML = sunrise;
  document.querySelector("#set").innerHTML = sunset;

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  let celsiusTemperature = response.data.main.temp;
  let fahrenheitTemperature = convertToFahrenheit(celsiusTemperature);

  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = `${Math.round(
    celsiusTemperature
  )}°C / ${Math.round(fahrenheitTemperature)}°F`;
  let iconElement = document.querySelector("#icon");
  console.log(response.data);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );
  getForecast(response.data.coord);
}
function getForecast(coordinates) {
  let apiKey = "445905dadb3d2b0c6f1b916c9d0e3860";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function convertToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}
function convertToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function search(event) {
  event.preventDefault();
  let apiKey = "59a70ea155f6bd700d4dc06ce96174c8";
  let city = document.querySelector("#city-input").value;
  document.querySelector("#city").innerHTML = city;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayWeatherCondition);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="44"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let now = new Date();
let dayOfWeek = daysOfWeek[now.getDay()];
now.setDate(now.getDate() + 7);
