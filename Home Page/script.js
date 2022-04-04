// Getting the preferred unit of measurement
var unitValue = document.querySelector("#select-unit").value;

var lat = 0;
var lon = 0;

// Weather object containing functions to fetch weather and display weather
let weather = {

    // My API key
    apiKey: "942dd77fa358eb3439a8212cb16724cd",

    // User's location upon opening the webpage.
    
    // coordinates: ["",""],

    // Returns the appropriate unit parameter based on the user's choice
    getUnit: function () {
        if (unitValue === "fahrenheit") {
            return "imperial";
        } else {
            return "metric";
        }
    },

    // Fetches the weather information from API based on city name
    fetchWeatherByCity: function (city) {
        // Making API call
        fetch("https://api.openweathermap.org/data/2.5/weather?q="
            + city
            + "&units=" + this.getUnit() + "&appid="
            + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => this.getWeatherInfo(data));
    },

    // Fetches the weather information from API based on geolocation
    fetchWeatherByGeolocation: function () {
        // const coordinates = weather.getCurrentLocation();
        // Making API call
        fetch("http://api.openweathermap.org/geo/1.0/reverse?lat="
        + lat
        + "&lon="
        + lon + "&appid="
        + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => this.fetchWeatherByCity(this.getLocation(data)));
    },

    getLocation: function (data) {
        const { name } = data;
        console.log("Your location is " + name);
        return name;
    },

    // Gets the weather info from API response
    getWeatherInfo: function (data) {
        const { name } = data;  
        const { icon, description } = data.weather[0];
        const { temp, humidity, feels_like, temp_min, temp_max } = data.main;
        const { speed } = data.wind;
        console.log(name, icon, description, temp, humidity, feels_like, temp_min, temp_max, speed);

        // Finding out which symbol to display based on the unit
        let symbol;
        if (unitValue === "fahrenheit") {
            symbol = "°F";
        } else {
            symbol = "°C";
        }

        // Assigning the weather details obtained from the API
        // response to their corresponding fields in the page
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".temp").innerText = temp + symbol;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector("#humidity-value").innerText = humidity + "%";
        document.querySelector("#wind-value").innerText = speed + "km/h";
        document.querySelector("#feelslike-value").innerText = feels_like + symbol;
        document.querySelector("#lowhigh-value").innerText = temp_min + symbol + " / " + temp_max + symbol;
    },


    // Get the user's current latitude and longitude
    getCurrentLocation: function (lat, lon) {
        console.log("Getting lat and long");
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            lat = "" + latitude;
            lon = "" + longitude;
            console.log(lat, lon);
            // return [lat, lon]
          });
    },

    // Gets the city name entered in the search bar
    // and fetches the weather for that city
    search: function () {
        let location = document.querySelector(".bar").value
        this.fetchWeatherByCity(location);
    }
};

document.querySelector("#select-unit").addEventListener("change", function () {
    unitValue = this.value;
});

// Setting up the search button to call the
// search function in the weather object
document.querySelector(".btn-primary").addEventListener("click", function () {
    weather.search();
});

// Allows user to hit enter to search for weather by
//  calling the search function in the weather object
document.querySelector(".bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});


// Get weather by the user's current location 
 weather.getCurrentLocation();
weather.fetchWeatherByGeolocation();
