// OpenSeadragon canvas Overlay plugin 0.0.1 based on svg overlay plugin

(function() {

    if (!window.OpenSeadragon) {
        console.error('[openseadragon-canvas-overlay] requires OpenSeadragon');
        return;
    }


    // ----------
    OpenSeadragon.Viewer.prototype.fabricjsOverlay = function() {
        if (this._fabricjsOverlayInfo) {
            return this._fabricjsOverlayInfo;
        }

        this._fabricjsOverlayInfo = new Overlay(this);
        return this._fabricjsOverlayInfo;
    };

    // ----------
    var Overlay = function(viewer) {
        var self = this;

        this._viewer = viewer;

        this._containerWidth = 0;
        this._containerHeight = 0;

        this._canvasdiv = document.createElement( 'div');
        this._canvasdiv.style.position = 'absolute';
        this._canvasdiv.style.left = 0;
        this._canvasdiv.style.top = 0;
        this._canvasdiv.style.width = '100%';
        this._canvasdiv.style.height = '100%';
        this._viewer.canvas.appendChild(this._canvasdiv);

        this._canvas = document.createElement('canvas');
        this._canvas.setAttribute('id', 'osd-overlaycanvas');
        this._canvasdiv.appendChild(this._canvas);
        this.resize();
        this._fabricCanvas=new fabric.Canvas('osd-overlaycanvas');
        // disable fabric selection because default click is tracked by OSD
        this._fabricCanvas.selection=false; 
        // prevent OSD click elements on fabric objects
        this._fabricCanvas.on('mouse:down', function (options) {
            if (options.target) {
                options.e.preventDefault();
                options.e.stopPropagation();
            }
        });
        
    
        
        this._viewer.addHandler('update-viewport', function() {
            self.resize();
            self.resizecanvas();

        });

        this._viewer.addHandler('open', function() {
            self.resize();
            self.resizecanvas();
        });

        this.resize();
    };

    // ----------
    Overlay.prototype = {
        // ----------
        canvas: function() {
            return this._canvas;
        },
        fabricCanvas: function() {
            return this._fabricCanvas;
        },
        // ----------
        clear: function() {
            this._fabricCanvas.clearAll();
        },
        // ----------
        resize: function() {
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
            this._viewportOrigin = new OpenSeadragon.Point(0, 0);
            var boundsRect = this._viewer.viewport.getBounds(true);
            this._viewportOrigin.x = boundsRect.x;
            this._viewportOrigin.y = boundsRect.y * this.imgAspectRatio;
            
            this._viewportWidth = boundsRect.width;
            this._viewportHeight = boundsRect.height * this.imgAspectRatio;
            this.imgWidth = this._viewer.viewport.contentSize.x;
            this.imgHeight = this._viewer.viewport.contentSize.y;
            this.imgAspectRatio = this.imgWidth / this.imgHeight;

        },
       resizecanvas: function() {
           
           
           var viewportZoom = this._viewer.viewport.getZoom(true);
           var image1 = this._viewer.world.getItemAt(0);
           var zoom = image1.viewportToImageZoom(viewportZoom);     
                   
           var x=((this._viewportOrigin.x/this.imgWidth-this._viewportOrigin.x )/this._viewportWidth)*this._containerWidth;
           var y=((this._viewportOrigin.y/this.imgHeight-this._viewportOrigin.y )/this._viewportHeight)*this._containerHeight;
           this._fabricCanvas.setWidth(this._containerWidth);
           this._fabricCanvas.setHeight(this._containerHeight);
           this._fabricCanvas.absolutePan(new fabric.Point(-x,-y));
           this._fabricCanvas.setZoom(zoom);
       }
        
    };

})();
