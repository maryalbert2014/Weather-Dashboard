$(document).ready(function () {
	var date = moment().format("L");

	// Local Storage for city entered
	var getCity = JSON.parse(localStorage.getItem("city"));
	if (getCity) {
		getWeatherReport(getCity);
	}

	// function that handles the current day weather report
	function getWeatherReport(cityToSearch) {
		$("#searchCity").val("");
		$("#city-weather").empty();

		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				cityToSearch +
				"&units=imperial&appid=73bc46b9424e41f245151d328bfa5a7a",

			method: "GET",
		}).then(function (response) {
			// Values to be passed to uvIndex()
			var longitude = response.coord.lon;
			var latitude = response.coord.lat;

			// Div to hold daily weather
			var todayWeatherDiv = $("<div>");
			todayWeatherDiv.attr("id", "today-box");

			// Header
			var cityHeader = $("<h3>");
			cityHeader.attr("id", "city-head");
			cityHeader.text(cityToSearch + " (" + date + ")");
			todayWeatherDiv.append(cityHeader);
			//  Temperature
			var temperature = $("<p>");
			temperature.attr("id", "temp");
			temperature.attr("class", "main-box");
			temperature.text(
				"Temperature: " + parseInt(response.main.temp) + " \xB0F"
			);
			todayWeatherDiv.append(temperature);

			// Humidity
			var humidity = $("<p>");
			humidity.attr("id", "humid");
			humidity.attr("class", "main-box");
			humidity.text("Humidity: " + response.main.humidity + "%");
			todayWeatherDiv.append(humidity);

			// Wind speed
			var windSpeed = $("<p>");
			windSpeed.attr("id", "wnd-spd");
			windSpeed.attr("class", "main-box");
			windSpeed.text(
				"Wind Speed: " + parseInt(response.wind.speed) + "MPH"
			);
			todayWeatherDiv.append(windSpeed);

			// Forecast
			var forecast = $("<p>");
			forecast.attr("id", "for-cst");
			forecast.attr("class", "main-box");
			forecast.text(
				"The current forecast calls for " +
					response.weather[0].description
			);
			todayWeatherDiv.append(forecast);
			// Append to div in HTML
			$("#city-weather").append(todayWeatherDiv);
			// Call to cityList() to keep track of all citeies chosen
			cityList(cityToSearch);

			// Call to uvIndex() to obtain uv rating
			uvIndex(longitude, latitude);
		});
	}

	// function that retrieves uvIndex
	function uvIndex(lon, lat) {
		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
				lat +
				"&lon=" +
				lon +
				"&appid=73bc46b9424e41f245151d328bfa5a7a",
			method: "GET",
		}).then(function (response) {
			var uVRating = response[0].value;
			var uvi = $("<p>");
			var uvScore = parseInt(Math.round(uVRating));

			// Switch statement that color codes uvIndex rating
			switch (uvScore) {
				case (uvScore = 0):
				case (uvScore = 1):
				case (uvScore = 2):
					uvi.css("background-color", "green");
					break;
				case (uvScore = 3):
				case (uvScore = 4):
				case (uvScore = 5):
					uvi.css("background-color", "yellow");
					break;
				case (uvScore = 6):
				case (uvScore = 7):
				case (uvScore = 8):
					uvi.css("background-color", "orange");
					break;
				default:
					uvi.css("background-color", "red");
			}

			uvi.attr("class", "uv-rate");
			uvi.css("width", "15%");
			uvi.text("UV Index: " + uVRating);

			$("#city-weather").append(uvi);
		});
	}

	// function that keeps track of past cities chosen
	function cityList(listOfCities) {
		var cityListDiv = $("<div>");
		cityListDiv.attr("id", "past-city-list");
		cityListDiv.css("height", "35px");
		cityListDiv.css("background-color", "#f7f7f7");
		cityListDiv.css("font-size", "22px");
		cityListDiv.css("border", "solid grey 1px");

		var lastCityChosen = $("<p>");
		lastCityChosen.attr("class", "past-list");
		lastCityChosen.text(listOfCities);
		cityListDiv.prepend(lastCityChosen);
		$("#city-list").append(cityListDiv);
	}

	// function that handles the 5 day forecast
	function _5day(city) {
		var _key = "73bc46b9424e41f245151d328bfa5a7a";
		var _queryURL =
			"https://api.openweathermap.org/data/2.5/forecast?q=" +
			city +
			"&units=imperial&appid=";
		$("#five-day").empty();

		$.ajax({
			url: _queryURL + _key,
			method: "GET",
		}).then(function (response) {
			var listArray = response.list;

			// Got the first 5 elements of the array for the 5 day forecast
			var _forecast = listArray.slice(0, 5);

			// Loops thru the 5 day array
			for (let i = 0; i < _forecast.length; i++) {
				var day = _forecast[i];
				var humidity = day.main.humidity;
				var temp = day.main.temp;

				// Div to hold each 5 day forecast
				var _dayDiv = $("<div>");
				_dayDiv.attr("class", "day-box");
				_dayDiv.attr("id", "five-day");
				_dayDiv.css("height", "180px");
				_dayDiv.css("width", "150px");
				_dayDiv.css("font-size", "13px");
				_dayDiv.css("border-radius", "10px");

				// Used Moment.js to obtain future dates
				var dateDisplay = $("<p>");
				dateDisplay.text(moment().add([i], "days").calendar());
				_dayDiv.append(dateDisplay);

				//weather icons
				var icon = $("<img>");
				var checkIcon = response.list[i].weather[0].main;
				console.log(checkIcon);

				// Switch statement to decipher which weather icon is appropriate
				if (checkIcon === "Rain") {
					icon.attr(
						"src",
						"http://openweathermap.org/img/wn/09d.png"
					);
					icon.attr("height", "25%", "width", "25%");
				} else if (checkIcon === "Clouds") {
					icon.attr(
						"src",
						"http://openweathermap.org/img/wn/03d.png"
					);
					icon.attr("height", "25%", "width", "25%");
				} else if (checkIcon === "Drizzle") {
					icon.attr(
						"src",
						"http://openweathermap.org/img/wn/10d.png"
					);
					icon.attr("height", "25%", "width", "25%");
				} else if (checkIcon === "Snow") {
					icon.attr(
						"src",
						"http://openweathermap.org/img/wn/13d.png"
					);
					icon.attr("height", "25%", "width", "25%");
				} else if (checkIcon === "Sun") {
					icon.attr(
						"src",
						"http://openweathermap.org/img/wn/50d.png"
					);
					icon.attr("height", "25%", "width", "25%");
				} else if (checkIcon === "Wind") {
					icon.attr(
						"src",
						"http://openweathermap.org/img/wn/50d.png"
					);
					icon.attr("height", "25%", "width", "25%");
				} else {
					icon.attr(
						"src",
						"http://openweathermap.org/img/wn/01d.png"
					);
					icon.attr("height", "25%", "width", "25%");
				}

				_dayDiv.append(icon);

				// 5 day forecast temperature
				var _4castTemp = $("<p>");
				_4castTemp.attr("class", "info");
				_4castTemp.attr("id", "cast-temp");
				_4castTemp.text("Temp: " + parseInt(temp) + " \xB0F");
				_dayDiv.append(_4castTemp);

				// Feels like temperature
				var feelsLike = $("<p>");
				feelsLike.attr("class", "info");
				feelsLike.attr("id", "feel");
				feelsLike.text(
					"Feels like: " +
						Math.round(listArray[i].main.feels_like) +
						" \xB0F"
				);
				_dayDiv.append(feelsLike);

				// Humidity forecast
				var _humidity = $("<p>");
				_humidity.attr("class", "info");
				_humidity.attr("id", "humidity-box");
				_humidity.text("Humidity: " + humidity + "%");
				_dayDiv.append(_humidity);

				$("#five-day").append(_dayDiv);
			}
		});
	}

	// Listens for click on button to select city
	$("#start-search").on("click", function (event) {
		event.preventDefault();

		// Grabs the value inputted to the search box
		var city = $("#searchCity").val();

		// Checks to make sure field is not blank
		if (!city) {
			alert("Please enter a valid city");
		} else {
			// Stores the last city chosen in local storage
			localStorage.setItem("city", JSON.stringify(city));

			// Call to begin the process
			getWeatherReport(city);
			_5day(city);
		}
	});
});