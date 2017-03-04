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
          $(this).is('img') ? $(this).attr("src", source) : $(this).css('background-image', 'url("' + source + '")');
          if (typeof callback === "function") callback.call(this);
      }
    });

    var debouncedUnveil = debounce(unveil, 100);

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

    // https://davidwalsh.name/javascript-debounce-function
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, 
            args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };

    $w.on("scroll.unveil resize.unveil lookup.unveil touchmove.unveil", debouncedUnveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
