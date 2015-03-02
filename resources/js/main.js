if ("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var latField = document.getElementById('lat');
		var longField = document.getElementById('long');

		latField.value = position.coords.latitude;
		longField.value =  position.coords.longitude;
	});
} else {

}