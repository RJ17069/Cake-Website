AOS.init({
    duration: 800,
  easing: "slide",
}
);

$(function(){

  $('.confirm').on('click', function(){
    if(!confirm('Confirm Deletion'))
    return false
  });
});


// var waypoint = new Waypoint({
//     element: document.getElementsByClassName('.product-image'),
//     handler: function(direction) {
//         $('.product-image').addClass('animated zoomIn');
//     },
//     offset: 20 
//   });

// var $product = $(".product-image");
// var $win = $(window);

// $win.on('scroll', function(){
//     var top = $win.scrollTop()/3;
//     $product.css('transform','rotate(' + top + 'deg)');
// });

// (function ($) {
//     "use strict";
//     $(window).stellar({
//       responsive: true,
//       parallaxBackgrounds: true,
//       parallaxElements: true,
//       horizontalScrolling: false,
//       hideDistantElements: false,
//       scrollProperty: "scroll",
//     });
// })

// $(document).ready(function(){
//     $('.product-image').Waypoint(function(direction){
//         $('.product-image').addClass('animated zoomIn');
//     })
// });