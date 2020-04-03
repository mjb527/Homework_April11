

$(document).ready(function(event) {

	// easier to add cities if we have the whole list always
	let citiesArr = loadCities();

	const date = moment().format('dddd[, ] MMMM Do[, ] YYYY');
	$('#name').text(date);

	$('#submit-city').click(function() {

		let cityName = formatCityName($('#city-input').val());
		if(cityName === null || cityName === undefined) return;

		prependList(cityName);
		request(cityName);

	});

	$('.list-group-item').click(function() {
		// clear the current selection
		$('.selected').removeClass('selected');
		$(this).addClass('selected');
		request($(this).attr('data-val'));
	});

	function loadCities() {
		let cities = [];
		if(localStorage.getItem('cities') === null) {
			cities = ['Chicago', 'Dallas', 'Los Angeles', 'Seattle', 'Denver', 'New York City'];
			localStorage.setItem('cities', cities.toString());
		}
		else
			cities = localStorage.getItem('cities').split(',');

		cities.forEach((item) => {
			$('#cities').prepend(`<a href="#" class="list-group-item list-group-item-action" data-val="${item}">${item}</a>`);
		});

		return cities;

	}

	function prependList(city) {
		$('#cities').prepend('<a href="#" class="list-group-item list-group-item-action" data-city="' + city + '">' + city + '</a>');
		citiesArr.push(city);
		localStorage.setItem('cities', citiesArr.toString());
	}

	function request(city) {
		const apiKey = '0c975a7e003d3a7d785c46c579b0d823';
		const url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

		$.ajax(url).then(function (response) {
			// set the parameters based on the first object
			const obj = response.list['0'];
			const weather = obj.weather['0'].main;

			// prepend the city to #name
			$('#name').html(city + ' - ' +  date + '<img class="position-absolute" src="http://openweathermap.org/img/wn/' + obj.weather['0'].icon + '@2x.png">');

			// clear the html from the #weather so we clear the icon
			$('#weather').html(weather);
			$('#temp').text(convertTemp(obj.main.temp) + String.fromCharCode(176) + 'F');
			$('#humidity').text(obj.main.humidity + '%');
			$('#wind-speed').text(obj.wind.speed + ' mph');


			// get the noon-time data of every day in list
			let subObjects = [];
			response.list.forEach((item) => {
				if(item.dt_txt.indexOf('12:') !== -1)
					subObjects.push(item);
			});

			// builds the row of squares with the appropriate data
			buildSquares(subObjects);

		});

	}

	function convertTemp(kelvin) {
		return Math.floor((kelvin - 273.15) * 9 / 5 + 32);
	}

	function buildSquares(objects) {
		// reset the div to append to
		$('#five-day').html('');

		objects.forEach((item) => {
			// collect variables
			const date = formatDate(item.dt_txt);
			const temperature = convertTemp(item.main.temp);
			const wind = item.wind.speed;
			const humidity = item.main.humidity;
			const weather = item.weather['0'].main;
			const img = `<img src="https://openweathermap.org/img/wn/${item.weather['0'].icon}.png">`;

			const box = $('<div>');
			box.addClass("bg-primary text-white forecast-box px-2 col-md-2 col-sm-12 mb-2 mt-1 mx-auto");
			box.html(`
				<div class="date pt-1 h5 row">
							<div class="col-8"><strong>${date}</strong</div>
							<div class="col-4">${img}</div>
				</div>
				<div class="smaller weatherDiv pb-1">Weather: <span class="weatherSpan">${weather}</span></div>
				<div class="smaller tempDiv pb-1">Temperature: <span class="tempSpan">${temperature + String.fromCharCode(176)}F</span></div>
				<div class="smaller humidityDiv pb-1">Humidity: <span class="humiditySpan">${humidity}%</span></div>
				<div class="smaller windDiv pb-1">Wind: <span class="windSpan">${wind} mph</span></div>
			`);

			$('#five-day').append(box);

		});

	}

	// convert to 'murican date format
	function formatDate(date) {
		// example -  dt_txt: "2020-04-08 12:00:00"
		const dateString = date.split(' ')[0];
		const dateArray = date.split(' ')[0].split('-');
		return dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0];
	}

	// set the name of the city normally and aVOid tHiS tyPe of TYPinG
	function formatCityName(name) {
		console.log(name);
		// set all to be lowercase
		name = name.toLowerCase();
		// set first letter capital
		name = name.charAt(0).toUpperCase() + name.slice(1);
		console.log(name);
		// find each new letter next to a space, hyphen, or period and make capital
		if(name.indexOf(' ') !== -1)
			name = citySplitter(name, ' ');
		if(name.indexOf('.') !== -1)
			name = citySplitter(name, '.');
		if(name.indexOf('-') !== -1)
			name = citySplitter(name, '-');

		console.log(name);
		// return formattedName;

	}
	// breaks down, adjusts, and rebuilds the city name based on a given character
	function citySplitter(name, character) {
		console.log(name);
		const temp = name.split(character);
		temp.forEach((item) => function() {
			item = character + item.charAt(0).toUpperCase() + item.slice(1);
		});
		let rebuilt = '';

		temp.forEach((item) => function() {
			rebuilt += item;
		});
		return rebuilt;
	}


});
