/*
(function($){
	var hero = $('#hero'),
		logo = $('#logo'),
		fix_class = 'is--fixed';

	function stickyScroll(e) {
	
	 if(document.getElementById('logo').getBoundingClientRect().top < 0) {
		logo.addClass(fix_class);
	  }

	  if(document.getElementById('logo').getBoundingClientRect().top > 0) {
	  }
	}

	// Scroll handler to toggle classes.
	$('body').scroll(stickyScroll);
})(jQuery);;

*/

// Gallery
var gallery = document.getElementById('article-gallery');

if(gallery) {
	baguetteBox.run('#article-gallery', {
		animation: 'slideIn'
	});
}


