if ("geolocation" in navigator) {
	var posButton =  document.getElementById('find-pos');

	posButton.addEventListener("click", function() {
		navigator.geolocation.getCurrentPosition(function(position) {
			var latField = document.getElementById('lat');
			var longField = document.getElementById('long');
			var latDisplay = document.getElementById('fake-lat');
			var longDisplay = document.getElementById('fake-long');
			var locationFieldset = latField.parentNode;

			var img = new Image();
			
			img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=13&size=300x300&sensor=false";
			img.style.display = 'block';

			latField.value = position.coords.latitude;
			longField.value = position.coords.longitude;

			latDisplay.innerHTML = position.coords.latitude;
			longDisplay.innerHTML = position.coords.longitude;

			locationFieldset.appendChild(img);

		});
	}, false);

	
} else {

}