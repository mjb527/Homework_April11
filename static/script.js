var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://community-open-weather-map.p.rapidapi.com/forecast?q=san%20francisco%252Cus&units=standard&lang=en",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
		"x-rapidapi-key": "6483eaca41mshb54c1d2e3ae9a30p1848d0jsnc2a733ce6052"
	}
}

$(document).ready(function() {
  $.ajax(settings).done(function (response) {
  	console.log(response);
  });


});
