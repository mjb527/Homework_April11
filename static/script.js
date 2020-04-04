

$(document).ready(function(event) {

	// easier to add cities if we have the whole list always
	let citiesArr = loadCities();

	$('#cities').scrollTop(0);

	const date = moment().format('dddd[, ] MMMM Do[, ] YYYY');
	$('#name').text(date);

	$('#submit-city').click(function() {

		let cityName = formatCityName($('#city-input').val());
		if(cityName === null || cityName === undefined) return;

		request(cityName);

	});

	// when typing in the search box, search on enter click
	$('#city-input').focus(function() {
		$('#city-input').keypress(function(event) {
			if(event.charCode === 13) {
				let cityName = formatCityName($('#city-input').val());
				if(cityName === null || cityName === undefined) return;
				request(cityName);
			}
		});
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
		else cities = localStorage.getItem('cities').split(',');

		cities.forEach((item) => {
			$('#cities').prepend(`<a href="#" class="list-group-item list-group-item-action" data-val="${item}"><div class="row">
							<div class="col-10">${item}</div>
							<div class="col-1"><span class="badge badge-secondary badge-pill delete"><i class="far fa-trash-alt"></i></span></div>
							</div>
						</a>
					`);
		});

		return cities;

	}
	// delete button behavior
	$(document).on('mouseover', '.delete', function() {
		$(this).addClass('badge-danger');
		$(this).removeClass('badge-secondary');
	}).on('mouseout', '.delete',	function() {
		$(this).addClass('badge-secondary');
		$(this).removeClass('badge-danger');
	});

	$(document).on('click', '.delete', function() {
		const parent = $(this).closest('.list-group-item');
		if(confirm(`Delete ${parent.attr('data-val')} from the list of cities?`)) {
			// remove from cities array
			citiesArr.splice(citiesArr.indexOf(parent.attr('data-val')));
			// update localStorage
			localStorage.setItem('cities', citiesArr.toString());
			// remove the parent
			parent.remove();

		}

	});

	function prependList(city) {
		$('.selected').removeClass('selected');
		$('#cities').prepend(`<a href="#" class="list-group-item list-group-item-action selected" data-val="${city}"><div class="row">
						<div class="col-10">${city}</div>
						<div class="col-1"><span class="badge badge-secondary badge-pill delete"><i class="far fa-trash-alt"></i></span></div>
						</div>
					</a>
				`);
		citiesArr.push(city);
		localStorage.setItem('cities', citiesArr.toString());
	}

	function request(city) {
		// clear the input field
		$('#city-input').val('');
		const apiKey = '0c975a7e003d3a7d785c46c579b0d823';
		const url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

		$.ajax(url).then(function(response) {
			// if the city isn't already on the list, add it
			if(citiesArr.indexOf(city) === -1) {
				prependList(city);
			}
			// otherwise, find the list item and add class to it
			else {
				// const cityList = ;
				$.each($('.list-group-item'), function(i, val) {
					if($(val).attr('data-val') === city) {
						$('.selected').removeClass('selected');
						$(val).addClass('selected');
					}
				});
			}

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
		// remove the temporary text
		$('#removable').remove();
		// reset the div to append new city data
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
				<div class="date pt-1 pl-2 h5 row">
							<div class="col-8"><strong>${date}</strong</div>
							<div class="col-4">${img}</div>
				</div>
				<div class="smaller weatherDiv pb-1 px-2">Weather: <span class="weatherSpan">${weather}</span></div>
				<div class="smaller tempDiv pb-1 px-2">Temperature: <span class="tempSpan">${temperature + String.fromCharCode(176)}F</span></div>
				<div class="smaller humidityDiv pb-1 px-2">Humidity: <span class="humiditySpan">${humidity}%</span></div>
				<div class="smaller windDiv pb-1 px-2">Wind: <span class="windSpan">${wind} mph</span></div>
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

	// set the name of the city properly and aVOid tHiS tyPe of TYPinG
	function formatCityName(name) {
		// set all to be lowercase
		name = name.toLowerCase();
		// set first letter capital
		name = name.charAt(0).toUpperCase() + name.slice(1);
		// find each new letter next to a space, hyphen, or period and make capital
		const names = name.split('');
		for(let i = 0; i < name.length; i++) {
			if(names[i] === ' ' || names[i] === '-')
				names[i+1] = names[i+1].toUpperCase();
			if(names[i] === '.')
				names[i-1] = names[i-1].toUpperCase();

		name = names.join('');
		}

		return name;
	}


});
