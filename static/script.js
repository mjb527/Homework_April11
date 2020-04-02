

$(document).ready(function(event) {

	console.log('got here');

	let cityName = 'Berlin';

	const url = 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + cityName + '&cnt=6&appid=0c975a7e003d3a7d785c46c579b0d823';

	$.ajax(url).then(function (response) {
		console.log(response);
	});


});
