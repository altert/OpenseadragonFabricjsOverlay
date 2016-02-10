# Fabricjs Overlay for OpenSeadragon

An OpenSeadragon plugin that adds fabricjs overlay capability.

Compatible with OpenSeadragon 2.0.0 or greater.

## Documentation

To use, include the `openseadragon-fabricjs-overlay.js` file after `openseadragon.js` on your web page.

To add fabricjs overlay capability to your OpenSeadragon Viewer, call `fabricjsOverlay()` on it. This will return a new object with the following methods:

* `fabricCanvas()`: Returns fabricjs canvas that you can add elements to
* `resize()`: If your viewer changes size, you'll need to resize the fabricjs overlay by calling this method.

See demo.html for an example of it in use. 

