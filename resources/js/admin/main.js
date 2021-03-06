// Auto Save
/*
var form = document.querySelector('[data-object="autosave"]');
var message = document.querySelector('[data-object="autosave-message"]');

if(form) {
	
	var request = new XMLHttpRequest();
	
	
	function autoSave (){
		var postUrl = form.getAttribute("action");
		var data = new FormData();
		
		data.append("autosaving", 'true');
		data.append('title', document.getElementById('title').value);
		data.append('content', document.getElementById('content').value);
		data.append('lat', document.getElementById('lat').value);
		data.append('long', document.getElementById('long').value);
		data.append('strava', document.getElementById('strava').value);
		data.append('user', document.getElementById('user').value);
		data.append('date', document.getElementById('date').value);
		
		if(document.getElementById('pub_status').checked) {
			data.append('pub_status', 'on');
		} else {
			data.append('pub_status', 'off');
		}

		request.open("POST", postUrl + "?as=true", true);

		request.onreadystatechange = function () {
			if(request.responseText !== "") {
				var req = JSON.parse(request.responseText); 

				if (request.readyState != 4 || request.status != 200) {

					if(req.type === 'save' || req.type === 'update') {
						if(req.type === 'save') {
							form.setAttribute('action', postUrl + req.id);
						}

					} else {
					
						message.innerHTML = 'Auto save failed! When you actually go to save it might fail as well, make sure you backup the bulk of your writing.';
						message.classList.add('failure');

						setTimeout(function() { 
							message.classList.remove('failure');
							message.innerHTML = '';
						}, 5000)


					}
				}

			}
			
		};
		
		request.send(data);
		
	}
	
	setInterval(autoSave, 15000);	
}
*/

var mdContainer = document.getElementById('md');
var mdList = mdContainer.getElementsByTagName('ul')[0];
var mdBtn = document.getElementById('md-btn');

mdList.className = 'js-hide';
mdBtn.className = 'button pin-right';
mdBtn.innerHTML = 'Show ' + mdBtn.innerHTML;

mdBtn.addEventListener('click', function() {
	if(mdList.getAttribute('aria-expanded') === 'false') {
		mdList.className = 'grid-12 mt10';
		mdList.setAttribute('aria-expanded', 'true');
		mdBtn.innerHTML = mdBtn.innerHTML.replace(/^Show/gi, 'Hide');
	} else {
		mdList.className = 'js-hide';
		mdList.setAttribute('aria-expanded', 'false');
		mdBtn.innerHTML = mdBtn.innerHTML.replace(/^Hide/gi, 'Show');
	}
});


if ('geolocation' in navigator) {
	var posButton =  document.getElementById('find-pos');

	posButton.addEventListener('click', function() {
		posButton.innerHTML = 'Please wait, finding your location';
		navigator.geolocation.getCurrentPosition(function(position) {
			var latField = document.getElementById('lat');
			var longField = document.getElementById('long');
			var latDisplay = document.getElementById('fake-lat');
			var longDisplay = document.getElementById('fake-long');
			var locationFieldset = latField.parentNode;
			var img = new Image();

						
			img.src = 'https://maps.googleapis.com/maps/api/staticmap?center=' + position.coords.latitude + ',' + position.coords.longitude + '&zoom=13&size=300x300&markers=color:blue%7C' + position.coords.latitude + ',' + position.coords.longitude;
			img.style.display = 'block';

			latField.value = position.coords.latitude;
			longField.value = position.coords.longitude;

			latDisplay.innerHTML = position.coords.latitude;
			longDisplay.innerHTML = position.coords.longitude;

			locationFieldset.appendChild(img);
			posButton.innerHTML = 'Update location';

		});
	}, false);

	
} else {
	var posButton =  document.getElementById('find-pos');

	posButton.className += ' js-hide';
}
