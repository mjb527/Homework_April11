

$(document).ready(function(event) {
	// const payload = {
	// "async": true,
	// "crossDomain": true,
	// "url": "https://national-weather-service.p.rapidapi.com/products/locations",
	// "method": "GET",
	// "headers": {
	// 	"x-rapidapi-host": "national-weather-service.p.rapidapi.com",
	// 	"x-rapidapi-key": "6483eaca41mshb54c1d2e3ae9a30p1848d0jsnc2a733ce6052"
	// 	}
	// }
	//
	// $.ajax(payload).then(function(response) {
	// 	console.log(response);
	//
	// });

	let cityName = 'Berlin';

	const url = 'api.openweathermap.org/data/2.5/forecast/daily?q=' + cityName + '&cnt=6&appid=0c975a7e003d3a7d785c46c579b0d823';

	$.ajax(url).then(function (response) {
		console.log(response);
	});


});
