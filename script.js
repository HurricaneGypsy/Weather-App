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


function search(event) {
  event.preventDefault();
  let apiKey = "59a70ea155f6bd700d4dc06ce96174c8";
  let city = document.querySelector("#city-input").value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
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
  console.log({ iconElement });
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );
 
}

function convertToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}
function convertToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}


function displayForecast(response) {
  let forecast = response.data.daily;

  forecast.forEach(function (day, index) {
    if (index < 7) {
      let date = new Date(day.dt * 1000);
      let dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
      let temperature = Math.round(day.temp.day);
      let icon = day.weather[0].icon;
      document.querySelector(`#${dayOfWeek}`).innerHTML = `${temperature}℃`;
      document
        .querySelector(`#${dayOfWeek}-icon`)
        .setAttribute("src", `http://openweathermap.org/img/wn/${icon}.png`);
      getForecast({lat: day.weather[0].lat, lon: day.weather[0].lon});
    }
  });
}

function getForecast(coordinates) {
  let apiKey = "59a70ea155f6bd700d4dc06ce96174c8";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&unit=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let now = new Date();
let dayOfWeek = daysOfWeek[now.getDay()];
now.setDate(now.getDate() + 7);
