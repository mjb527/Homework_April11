

$(document).ready(function(event) {
	const payload = {
	"async": true,
	"crossDomain": true,
	"url": "https://national-weather-service.p.rapidapi.com/products/types/%7BtypeId%7D",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "national-weather-service.p.rapidapi.com",
		"x-rapidapi-key": "483eaca41mshb54c1d2e3ae9a30p1848d0jsnc2a733ce6052"
		}
	}

	$.ajax(payload).then(function(response) {
		console.log(response);
		
	});


});
