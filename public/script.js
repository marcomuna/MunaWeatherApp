let city = document.querySelector("#input");
let btn = document.querySelector("#button");

btn.addEventListener("click", () => {
  getResponse(city.value);
});
city.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getResponse(city.value);
  }
});

// Date for all time
let date = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
});
document.querySelector("#now").innerText = date;

let data;
async function getResponse(city = "rayagada") {
  try {
    let res = await fetch(`/api/weather?city=${city}`);
    data = await res.json();

    if (data.cod !== 200) {
      alert("City not found ❌");
      return;
    }

    uiUpdate();
  } catch (err) {
    alert("Server not running ❌");
  }
}

function uiUpdate() {
  let weather = data.weather[0];
  console.log(data);
  console.log(`
    city : ${data.name},
    temp : ${data.main.temp}
    wind : ${data.wind.speed}
    humidity : ${data.main.humidity}
    date : ${date}
    country : ${data.sys.country}
    sunrise : ${data.sys.sunrise}
    sunset : ${data.sys.sunset}
    `);

  // city update
  document.querySelector("#city").innerText = data.name.toUpperCase();
  city.value = "";
  // weather update
  document.querySelector("#desc").innerText = weather.description;
  // temperature
  let temp = Math.round(data.main.temp) + "°";
  document.querySelector("#temp").innerText = temp;
  document.querySelector("#tempSmall").innerText = temp;
  // wind
  document.querySelector("#wind").innerText = data.wind.speed + " km/h";

  // humidity
  document.querySelector("#humidity").innerText = data.main.humidity + "%";
  // icon
  let iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  document.querySelector("#sicon").src = iconUrl;
  // Date
  document.querySelector("#now").innerText = date;
  // sunrise and sunset
  // convert to milliseconds (×1000)
  let sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  );

  let sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  );
  document.querySelector("#sunrise").innerText = sunriseTime;
  document.querySelector("#sunset").innerText = sunsetTime;
}

// for default dom load
document.addEventListener("DOMContentLoaded", () => {
  autoDetectLocation();
});

function autoDetectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, fallbackToDefault);
  } else {
    fallbackToDefault();
  }
}

function fallbackToDefault() {
  getResponse(); // default = rayagada
}
// for currnet location data
let locationBtn = document.querySelector("#location");
locationBtn.addEventListener("click", hide); // your pin icon id

function hide() {
  let box = document.querySelector("#boxContainer");

  box.classList.toggle("active");
}
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Geolocation not supported");
  }
}

async function success(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
  );

  data = await res.json();
  uiUpdate();
}
function error() {
  alert("Location access denied ❌");
}
