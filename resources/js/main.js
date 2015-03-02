if ("geolocation" in navigator) {
	var posButton =  document.getElementById('find-pos');

	posButton.addEventListener("click", function() {
		navigator.geolocation.getCurrentPosition(function(position) {
			var latField = document.getElementById('lat');
			var longField = document.getElementById('long');
			var latDisplay = document.getElementById('fake-lat');
			var longDisplay = document.getElementById('fake-long');

			latField.value = position.coords.latitude;
			longField.value = position.coords.longitude;

			latDisplay.innerHTML = position.coords.latitude;
			longDisplay.innerHTML = position.coords.longitude;
		});
	}, false);

	
} else {

}