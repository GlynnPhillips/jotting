
$(function(){ 
	// Gallery
	var gallery = document.getElementById('article-gallery');

	if(gallery) {
		baguetteBox.run('#article-gallery', {
			animation: 'slideIn'
		});
	}


	// Menu 

	var menuBtn = $('#menu-button'),
		menu = $('#main-menu');
	
	menu.addClass('js-menu');

	menuBtn.click(function(evt) {
		menu.toggleClass('reveal-menu');
		evt.preventDefault();
	});

	// Map
	
	var map = $('#map');

	if(map) {
		function initialize() {
			var mapOptions = {
			  center: { lat: 45.193651, lng: 14.128418},
			  zoom: 4,
			  disableDefaultUI: true,
			  styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType": "administrative.country","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#59b4c0"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#3e85a2"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3e85a2"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#3e85a2"}]}]
			};
			var map = new google.maps.Map(document.getElementById('map'),
				mapOptions);

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(51.033855,4.190475),
				map: map,
				icon: {
					url: 'http://www.glynnphillips.co.uk/flanders-marker.png',
					size: new google.maps.Size(70, 47),
					anchor: new google.maps.Point(35, 30)
				}
			});
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(41.008238,28.978359),
				map: map,
				icon: 'http://www.glynnphillips.co.uk/istanbul-marker.png'
			});
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(44.173966,5.278285),
				map: map,
				icon: {
					url: 'http://www.glynnphillips.co.uk/ventoux-marker-2.png',
					size: new google.maps.Size(70, 31),
					anchor: new google.maps.Point(35, 15)
				}
			});
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(45.112485,7.591799),
				map: map,
				icon: {
					url: 'http://www.glynnphillips.co.uk/assietta-marker-2.png',
					size: new google.maps.Size(70, 31),
					anchor: new google.maps.Point(20, 31)
				}	
			});
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(45.345238,19.001020),
				map: map,
				icon: {
					url: 'http://www.glynnphillips.co.uk/vukovar-marker-2.png',
					size: new google.maps.Size(70, 31)
				}
			});
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(42.399444,18.818889),
				map: map,
				icon: {
					url: 'http://www.glynnphillips.co.uk/lovcen-marker-2.png',
					size: new google.maps.Size(70, 31)
				}
			});
		  }
		  google.maps.event.addDomListener(window, 'load', initialize);	
	}
});
