# OpenSeadragonFabricjsOverlay

An [OpenSeadragon](http://openseadragon.github.io) plugin that adds fabricjs overlay capability.

Compatible with OpenSeadragon 2.1.0 or greater.

## Documentation

To use, include the `openseadragon-fabricjs-overlay.js` file after `openseadragon.js` on your web page.

To add fabricjs overlay capability to your OpenSeadragon Viewer, call `fabricjsOverlay()` on it. This will return a new object with the following methods:

* `fabricCanvas()`: Returns fabricjs canvas that you can add elements to
* `resize()`: If your viewer changes size, you'll need to resize the fabricjs overlay by calling this method.

See [online demo](http://altert.github.io/OpenseadragonFabricjsOverlay/demo.html) or demo.html for an example of it in use. 

## Thanks

support for multiple overlays commissioned by [qikkeronline](http://www.qikkeronline.nl) - thanks for supporting open source
