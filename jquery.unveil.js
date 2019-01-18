/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 * 
 * Updated by Nora Brown to include `srcset`
 * https://github.com/nabrown/unveil
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 0,
        images = this;

    images.one("unveil", function() {
      var $img = $(this);
      var source = $img.attr("data-src");
      var sourceset = $img.attr("data-srcset");
      if (source) {
        $img.attr("src", source);
      }
      if (sourceset) {
        $img.attr('srcset', sourceset);
      }
      if (typeof callback === "function") callback.call(this);
    });

    function unveil() {
      // create an array of images that are in view
      // by filtering the intial array
      var inview = images.filter(function() {
        var $img = $(this);
        // if the image is hidden, don't bother
        if ($img.is(":hidden")) return;

        var wt = $w.scrollTop(), // window vertical scroll distance
            wb = wt + $w.height(), // last point of document visible in browser window
            et = $img.offset().top, // distance from document top to top of element
            eb = et + $img.height(); // distance from top of document to bottom of element

        // the bottom of the element is below the top of the browser (- threshold)
        // && the top of the element is above the bottom of the browser (+ threshold)
        return eb >= wt - th && et <= wb + th;
      });

      // trigger an 'unveil' event on each of the inview images
      inview.trigger("unveil");
      
      // filter the images to only those that aren't in view yet
      images = images.not(inview);
    }

    // https://davidwalsh.name/javascript-debounce-function
    // from underscore.js
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

    var debouncedUnveil = debounce(unveil, 100);

    // bind (with debounce) to various namespaced browser events
    $w.on("scroll.unveil resize.unveil lookup.unveil", debouncedUnveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);