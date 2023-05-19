// Grab DOM elements
const condition = document.querySelector("#condition");
const location_name = document.querySelector("#location");
const datetime = document.querySelector("#datetime");
const temperature = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const changeOfRain = document.querySelector("chance-of-rain");
const windSpeed = document.querySelector("#wind-speed");
const searchError = document.querySelector("#search-error");

const btnToggleUnit = document.querySelector("#unit-selector");
const cityQuery = document.querySelector("#city-query");
const btnSearch = document.querySelector("#btn-search");

// Set some constants
const url = "https://api.weatherapi.com/v1/current.json?key=11f94ca5d29a404798285659231805&q=londonn";
const URL_BASE = "https://api.weatherapi.com/v1/current.json?key=11f94ca5d29a404798285659231805&q=";
const URL_PRE = "https:"
const UNIT_MAP = {
  "c" : {
    "temperature": "°C",
    "speed": "km/h"
  },
  "f" : {
    "temperature": "°F",
    "speed": " mph"
  }
}

// Event Listeners
btnToggleUnit.addEventListener("click", toggleUnit);
btnSearch.addEventListener("click", refresh);

// Global variable to toggle the unit used and choose "c" as default
let unit = "c";
const unitC = document.querySelector("#unit-c");
const unitF = document.querySelector("#unit-f");
unitC.style["font-weight"] = "bolder";
unitF.style["font-weight"] = "lighter";

let weatherData = {};


// Async functions
async function fetchWeatherData(url) {
  let response = await fetch(url);
  weatherData = await response.json();
}

function getProcessedData() {
  const data = weatherData;
  if (unit.toLowerCase() === "f") {
    return {
      "cloud": data.current.cloud, 
      "condition_name": data.current.condition.text,
      "icon": data.current.condition.icon,
      "humidity": data.current.humidity,
      "wind_dir": data.current.wind_dir,
      "feelslike": data.current.feelslike_f,
      "gust": data.current.gust_kph,
      "precipitation": data.current.precip_in,
      "temp": data.current.temp_f,
      "vis": data.current.vis_miles,
      "wind_speed": data.current.wind_mph,
      "datetime": data.location.localtime,
      "location": data.location.name,
      "uv": data.current.uv
    };
  } else if (unit.toLowerCase() ==="c") {
    return {
      "cloud": data.current.cloud, 
      "condition_name": data.current.condition.text,
      "icon": data.current.condition.icon,
      "humidity": data.current.humidity,
      "wind_dir": data.current.wind_dir,
      "feelslike": data.current.feelslike_c,
      "gust": data.current.gust_kph,
      "precipitation": data.current.precip_mm,
      "temp": data.current.temp_c,
      "vis": data.current.vis_km,
      "wind_speed": data.current.wind_kph,
      "datetime": data.location.localtime,
      "location": data.location.name,
      "uv": data.current.uv
    };
  }
}

async function buildContent(data) {
  condition.textContent = data.condition_name;
  location_name.textContent = data.location;
  datetime.innerHTML = `${moment(data.datetime).format("dddd, MMMM Do, YYYY")}<br>${moment(data.datetime).format("h:mm a")}`;
  temperature.textContent = `${data.temp} ${UNIT_MAP[unit].temperature}`;
  feelsLike.textContent = `${data.feelslike} ${UNIT_MAP[unit].temperature}`;
  humidity.textContent = data.humidity;
  uv.textContent = data.uv;
  windSpeed.textContent = `${data.wind_speed} ${UNIT_MAP[unit].speed}`;
}

function getCityName() {
  return cityQuery.value;
}

function getFullUrl(cityName) {
  return `${URL_BASE}${cityName.toLowerCase()}`;
}

function toggleUnit() {
  if (unit === "c") {
    unit = "f";
    unitC.style["font-weight"] = "lighter";
    unitF.style["font-weight"] = "bolder";
  } else {
    unit = "c";
    unitC.style["font-weight"] = "bolder";
    unitF.style["font-weight"] = "lighter";
  }
  const data = getProcessedData();
  buildContent(data)
}

async function refresh() {
  let cityName = getCityName();
  if (cityName !== "") {
    try {
      const url_query = getFullUrl(cityName);
      await fetchWeatherData(url_query);
      const data = getProcessedData();
      buildContent(data);
      searchError.textContent = "";
    } catch(err) {
      searchError.textContent = "Could not find the city. Please try again.";
      cityName.value = "";
    }
  }
  cityQuery.value = "";
}


// Onload
window.onload = function(){
  document.getElementById('city-query').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
          e.preventDefault();
          refresh();
      }
  });
};



// Default - Load with London -> to be changed with IP address location
async function buildDefault() {
  let cityName = "london";
  const url_query = getFullUrl(cityName);
  const tmpData = await fetchWeatherData(url_query);
  const data = getProcessedData(tmpData);
  buildContent(data);
}

buildDefault();