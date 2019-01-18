# unveil.js
### A very lightweight plugin to lazy load images for jQuery

Set the `src` to a placeholder image with the same proportions as your final image. Or, use a relatively low-resolution version of your image.

Then use `data-src` and `data-srcset` as you normally would use `src` and `srcset`.

The two arguments are:

- a "look-ahead" distance (in px) to start loading images before they reach the browser viewport.
- a callback function

For a lightweight fallback for users without Javascript, add a link to a plain html page.

## Usage

```
<p class="link-to-unlazy">Images not loading? Sorry about that. <a href="index-unlazy.html">Try this page instead.</a></p>
<img src="img/placeholder-v.png" class="unveil" 
  data-src="img/purple-gills-700.jpg"
  data-srcset="img/purple-gills-1400.jpg 1400w, img/purple-gills-2800.jpg 2800w"
  alt="A small mushroom with pink-purple, widly-spaced gills, lying on a green mossy background."
/>
...

<script>
  $('.link-to-unlazy').remove();
  $('.unveil').unveil(300, function(){
    //... do stuff
  });
</script>  
```


Visit unveil's [original project page](http://luis-almeida.github.com/unveil/).

### License
Unveil is licensed under the [MIT license](http://opensource.org/licenses/MIT).
