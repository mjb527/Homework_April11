

$(document).ready(function(event) {

	const date = moment().format('dddd[, ] MMMM Do[, ] YYYY');
	$('#name').text(date);

	$('#submit-city').click(function() {

		let cityName = $('#city-input').val();
		cityName = cityName.toLowerCase();
		cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
		if(cityName === null || cityName === undefined)
			return
		prependList(cityName);
		request(cityName);

	});

	function prependList(city) {
		$('#cities').prepend('<a href="#" class="list-group-item list-group-item-action" data-city="' + city + '">' + city + '</a>')
	}

	function request(city) {
		const apiKey = '0c975a7e003d3a7d785c46c579b0d823';
		const url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

		$.ajax(url).then(function (response) {
			// set the parameters for today at noon
			const obj = response.list['3'];
			const weather = obj.weather['0'].main;

			// prepend the city to #name
			$('#name').html(city + ' - ' +  date + '<img class="position-absolute" src="http://openweathermap.org/img/wn/' + obj.weather['0'].icon + '@2x.png">');

			// clear the html from the #weather so we clear the icon
			$('#weather').html(weather);
			$('#temp').text(convertTemp(obj.main.temp) + String.fromCharCode(176) + 'F');
			$('#humidity').text(obj.main.humidity + '%');
			$('#wind-speed').text(obj.wind.speed + ' mph');

			buildSquares(response);

		});

	}

	function convertTemp(kelvin) {
		return Math.floor((kelvin - 273.15) * 9 / 5 + 32);
	}

	function buildSquares(r) {
		const objects = [r.list('3'), r.list('11'), r.list('19'), r.list('27'), r.list('35')];
		// build the example squares, create a function based on the block with weather, temp etc. above   
	}


});
