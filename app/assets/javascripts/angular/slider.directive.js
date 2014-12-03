app
  .directive('slider', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        element.flexslider({
	        slideshowSpeed: 5000,
	        directionNav: false,
	        animation: "fade"
	    });
      }
    };
  });
