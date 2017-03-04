/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
          // if element is an image, set the src
          // else, set image as background
 +        $(this).is('img') ? $(this).attr("src", source) : $(this).css('background-image', 'url("' + source + '")');
          if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {
      var inview = images.filter(function() {
        var $el = $(this);
        if ($el.is(":hidden")) return;

        var wt = $w.scrollTop(), // window veritical scroll distance
            wb = wt + $w.height(), // last point of document visible in browser window
            et = $el.offset().top, // distance from document top to top of element
            eb = et + $el.height(); // distance from top of document to bottom of element

        // the bottom of the element is below the top of the browser (- threshold)
        // && the top of the element id above the bottom of the browser (+ threshold)
        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil touchmove.unveil", unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
