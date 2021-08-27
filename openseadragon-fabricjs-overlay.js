/**
 * OpenSeadragon canvas Overlay plugin based on svg overlay plugin and fabric.js
 * @version 0.0.2
 */
(function () {

    if (!window.OpenSeadragon) {
        console.error('[openseadragon-canvas-overlay] requires OpenSeadragon');
        return;
    }

    /**
     * Adds fabric.js overlay capability to your OpenSeadragon Viewer
     *
     * @param {Object} options
     *     Allows configurable properties to be entirely specified by passing
     *     an options object to the constructor.
     *
     * @param {Number} options.scale
     *     Fabric 'virtual' canvas size, for creating objects
     *
     * @returns {Overlay}
     */
    OpenSeadragon.Viewer.prototype.fabricjsOverlay = function (options) {

        this._fabricjsOverlayInfo = new Overlay(this, options.static);
        if (options && options.scale) {
            this._fabricjsOverlayInfo._scale = options.scale; // arbitrary scale for created fabric canvas
        }
        else {
            this._fabricjsOverlayInfo._scale = 1;
        }

        return this._fabricjsOverlayInfo;
    };

    /**
     * Static counter for multiple overlays differentiation
     * @type {function(): number}
     */
    let counter = (function () {
        let i = 1;

        return function () {
            return i++;
        }
    })();

    /**
     * Overlay object
     * @param viewer
     * @constructor
     */
    let Overlay = function (viewer, staticCanvas, fabricCanvasOptions = {}) {
        fabricCanvasOptions.enablePointerEvents = window.PointerEvent != null;
        let self = this;

        this._viewer = viewer;

        this._containerWidth = 0;
        this._containerHeight = 0;

        this._canvasdiv = document.createElement('div');
        this._canvasdiv.style.position = 'absolute';
        this._canvasdiv.style.left = "0px";
        this._canvasdiv.style.top = "0px";
        this._canvasdiv.style.width = '100%';
        this._canvasdiv.style.height = '100%';
        this._viewer.canvas.appendChild(this._canvasdiv);

        this._canvas = document.createElement('canvas');

        this._id = 'osd-overlaycanvas-' + counter();
        this._canvas.setAttribute('id', this._id);
        this._canvasdiv.appendChild(this._canvas);
        this.resize();

        // make the canvas static if specified, ordinary otherwise
        if (staticCanvas) {
            this._fabricCanvas = new fabric.StaticCanvas(this._canvas, fabricCanvasOptions);
        }
        else {
            this._fabricCanvas = new fabric.Canvas(this._canvas, fabricCanvasOptions);
        }

        // Disable fabric selection because default click is tracked by OSD
        this._fabricCanvas.selection = false;

        /**
         * Prevent OSD mousedown on fabric objects
         */
        this._fabricCanvas.on('mouse:down', function (options) {
            if (options.target) {
                options.e.preventDefaultAction = true;
                options.e.preventDefault();
                options.e.stopPropagation();
            }
        });

        /**
         * Prevent OSD mouseup on fabric objects
         */
        this._fabricCanvas.on('mouse:up', function (options) {
            if (options.target) {
                options.e.preventDefaultAction = true;
                options.e.preventDefault();
                options.e.stopPropagation();
            }
        });

        /**
         * Update viewport
         */
        this._viewer.addHandler('update-viewport', function () {
            self.resize();
            self.resizeCanvas();
            self.render();

        });

        /**
         * Resize the fabric.js overlay when the viewer or window changes size
         */
        this._viewer.addHandler('open', function () {
            self.resize();
            self.resizeCanvas();
        });
        window.addEventListener('resize', function () {
            self.resize();
            self.resizeCanvas();
        });

    };


    /**
     * Overlay prototype
     * {{canvas: (function(): HTMLCanvasElement),
     * fabricCanvas: (function(): *),
     * clear: Overlay.clear,
     * resizeCanvas: Overlay.resizeCanvas,
     * resize: Overlay.resize,
     * render: Overlay.render}}
     */
    Overlay.prototype = {
        // ----------
        canvas: function () {
            return this._canvas;
        },
        fabricCanvas: function () {
            // Returns fabric.js canvas that you can add elements to
            return this._fabricCanvas;
        },
        // ----------
        clear: function () {
            this._fabricCanvas.clear();
        },
        render: function () {
            this._fabricCanvas.renderAll();
        },
        // ----------
        resize: function () {
            if (this._containerWidth !== this._viewer.container.clientWidth) {
                this._containerWidth = this._viewer.container.clientWidth;
                this._canvasdiv.setAttribute('width', this._containerWidth);
                this._canvas.setAttribute('width', this._containerWidth);
            }

            if (this._containerHeight !== this._viewer.container.clientHeight) {
                this._containerHeight = this._viewer.container.clientHeight;
                this._canvasdiv.setAttribute('height', this._containerHeight);
                this._canvas.setAttribute('height', this._containerHeight);
            }

        },
        resizeCanvas: function () {
            let origin = new OpenSeadragon.Point(0, 0);
            let viewportZoom = this._viewer.viewport.getZoom(true);
            this._fabricCanvas.setWidth(this._containerWidth);
            this._fabricCanvas.setHeight(this._containerHeight);
            let zoom = this._viewer.viewport._containerInnerSize.x * viewportZoom / this._scale;
            this._fabricCanvas.setZoom(zoom);
            let viewportWindowPoint = this._viewer.viewport.viewportToWindowCoordinates(origin);
            let x = Math.round(viewportWindowPoint.x);
            let y = Math.round(viewportWindowPoint.y);
            let canvasOffset = this._canvasdiv.getBoundingClientRect();

            let pageScroll = OpenSeadragon.getPageScroll();

            this._fabricCanvas.absolutePan(new fabric.Point(canvasOffset.left - x + pageScroll.x, canvasOffset.top - y + pageScroll.y));

        }

    };

})();
