/* eslint-disable */

function requireRpgMaker() {
//-----------------------------------------------------------------------------
    Graphics = {width: 300, height: 300};
    var Point = PIXI.Point;
    var PluginManager = {
        parameters: function () {
            return {
                "squareShader": 0
            }
        }
    };

    if (PIXI.CanvasRenderer) {
        PIXI.CanvasRenderer.registerPlugin('tilemap', PIXI.tilemap.CanvasTileRenderer);
    }

    /**
     * Vanilla rpgmaker tilemap from rpg_core.js v1.0.1
     *
     * @class Tilemap
     * @constructor
     */
    class Tilemap extends PIXI.Container {

        constructor() {
            super();
            this.initialize.apply(this, arguments);
        }
        initialize()
        {

            this._margin = 20;
            this._width = Graphics.width + this._margin * 2;
            this._height = Graphics.height + this._margin * 2;
            this._tileWidth = 48;
            this._tileHeight = 48;
            this._mapWidth = 0;
            this._mapHeight = 0;
            this._mapData = null;
            this._layerWidth = 0;
            this._layerHeight = 0;
            this._lastTiles = [];

            /**
             * The bitmaps used as a tileset.
             *
             * @property bitmaps
             * @type Array
             */
            this.bitmaps = [];

            /**
             * The origin point of the tilemap for scrolling.
             *
             * @property origin
             * @type Point
             */
            this.origin = new Point();

            /**
             * The tileset flags.
             *
             * @property flags
             * @type Array
             */
            this.flags = [];

            /**
             * The animation count for autotiles.
             *
             * @property animationCount
             * @type Number
             */
            this.animationCount = 0;

            /**
             * Whether the tilemap loops horizontal.
             *
             * @property horizontalWrap
             * @type Boolean
             */
            this.horizontalWrap = false;

            /**
             * Whether the tilemap loops vertical.
             *
             * @property verticalWrap
             * @type Boolean
             */
            this.verticalWrap = false;

            this._createLayers();
            this.refresh();
        }

        onAnimChange() {
            this._needsRepaint = true;
        }

    }

    /**
     * The width of the screen in pixels.
     *
     * @property width
     * @type Number
     */
    Object.defineProperty(Tilemap.prototype, 'width', {
        get: function() {
            return this._width;
        },
        set: function(value) {
            if (this._width !== value) {
                this._width = value;
                this._createLayers();
            }
        }
    });

    /**
     * The height of the screen in pixels.
     *
     * @property height
     * @type Number
     */
    Object.defineProperty(Tilemap.prototype, 'height', {
        get: function() {
            return this._height;
        },
        set: function(value) {
            if (this._height !== value) {
                this._height = value;
                this._createLayers();
            }
        }
    });

    /**
     * The width of a tile in pixels.
     *
     * @property tileWidth
     * @type Number
     */
    Object.defineProperty(Tilemap.prototype, 'tileWidth', {
        get: function() {
            return this._tileWidth;
        },
        set: function(value) {
            if (this._tileWidth !== value) {
                this._tileWidth = value;
                this._createLayers();
            }
        }
    });

    /**
     * The height of a tile in pixels.
     *
     * @property tileHeight
     * @type Number
     */
    Object.defineProperty(Tilemap.prototype, 'tileHeight', {
        get: function() {
            return this._tileHeight;
        },
        set: function(value) {
            if (this._tileHeight !== value) {
                this._tileHeight = value;
                this._createLayers();
            }
        }
    });

    /**
     * Sets the tilemap data.
     *
     * @method setData
     * @param {Number} width The width of the map in number of tiles
     * @param {Number} height The height of the map in number of tiles
     * @param {Array} data The one dimensional array for the map data
     */
    Tilemap.prototype.setData = function(width, height, data) {
        this._mapWidth = width;
        this._mapHeight = height;
        this._mapData = data;
    };

    /**
     * Checks whether the tileset is ready to render.
     *
     * @method isReady
     * @type Boolean
     * @return {Boolean} True if the tilemap is ready
     */
    Tilemap.prototype.isReady = function() {
        for (var i = 0; i < this.bitmaps.length; i++) {
            if (this.bitmaps[i] && !this.bitmaps[i].isReady()) {
                return false;
            }
        }
        return true;
    };

    /**
     * Updates the tilemap for each frame.
     *
     * @method update
     */
    Tilemap.prototype.update = function() {
        this.animationCount++;
        const old_frame = this.animationFrame;
        this.animationFrame = Math.floor(this.animationCount / 30);

        if (old_frame !== this.animationFrame) {
            this.onAnimChange();
        }

        this.children.forEach(function(child) {
            if (child.update) {
                child.update();
            }
        });
    };

    /**
     * Forces to repaint the entire tilemap.
     *
     * @method refresh
     */
    Tilemap.prototype.refresh = function() {
        this._needsRepaint = true;
        this._lastTiles.length = 0;
    };

    /**
     * @method updateTransform
     * @private
     */
    Tilemap.prototype.updateTransformTick = function() {
        var ox = Math.floor(this.origin.x);
        var oy = Math.floor(this.origin.y);
        var startX = Math.floor((ox - this._margin) / this._tileWidth);
        var startY = Math.floor((oy - this._margin) / this._tileHeight);
        this._updateLayerPositions(startX, startY);
        if (this._needsRepaint || this._lastStartX !== startX || this._lastStartY !== startY) {
            this._frameUpdated = this._lastAnimationFrame !== this.animationFrame;
            this._lastAnimationFrame = this.animationFrame;
            this._lastStartX = startX;
            this._lastStartY = startY;
            this._paintAllTiles(startX, startY);
            this._needsRepaint = false;
        }
        this._sortChildren();
    };

    /**
     * @method _createLayers
     * @private
     */
    Tilemap.prototype._createLayers = function() {
        var width = this._width;
        var height = this._height;
        var margin = this._margin;
        var tileCols = Math.ceil(width / this._tileWidth) + 1;
        var tileRows = Math.ceil(height / this._tileHeight) + 1;
        var layerWidth = tileCols * this._tileWidth;
        var layerHeight = tileRows * this._tileHeight;
        this._lowerBitmap = new Bitmap(layerWidth, layerHeight);
        this._upperBitmap = new Bitmap(layerWidth, layerHeight);
        this._layerWidth = layerWidth;
        this._layerHeight = layerHeight;

        /*
         * Z coordinate:
         *
         * 0 : Lower tiles
         * 1 : Lower characters
         * 3 : Normal characters
         * 4 : Upper tiles
         * 5 : Upper characters
         * 6 : Airship shadow
         * 7 : Balloon
         * 8 : Animation
         * 9 : Destination
         */

        this._lowerLayer = new Sprite();
        this._lowerLayer.move(-margin, -margin, width, height);
        this._lowerLayer.z = 0;

        this._upperLayer = new Sprite();
        this._upperLayer.move(-margin, -margin, width, height);
        this._upperLayer.z = 4;

        for (var i = 0; i < 4; i++) {
            this._lowerLayer.addChild(new Sprite(this._lowerBitmap));
            this._upperLayer.addChild(new Sprite(this._upperBitmap));
        }

        this.addChild(this._lowerLayer);
        this.addChild(this._upperLayer);
    };

    /**
     * @method _updateLayerPositions
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    Tilemap.prototype._updateLayerPositions = function(startX, startY) {
        var m = this._margin;
        var ox = Math.floor(this.origin.x);
        var oy = Math.floor(this.origin.y);
        var x2 = (ox - m).mod(this._layerWidth);
        var y2 = (oy - m).mod(this._layerHeight);
        var w1 = this._layerWidth - x2;
        var h1 = this._layerHeight - y2;
        var w2 = this._width - w1;
        var h2 = this._height - h1;

        for (var i = 0; i < 2; i++) {
            var children;
            if (i === 0) {
                children = this._lowerLayer.children;
            } else {
                children = this._upperLayer.children;
            }
            children[0].move(0, 0, w1, h1);
            children[0].setFrame(x2, y2, w1, h1);
            children[1].move(w1, 0, w2, h1);
            children[1].setFrame(0, y2, w2, h1);
            children[2].move(0, h1, w1, h2);
            children[2].setFrame(x2, 0, w1, h2);
            children[3].move(w1, h1, w2, h2);
            children[3].setFrame(0, 0, w2, h2);
        }
    };

    /**
     * @method _paintAllTiles
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    Tilemap.prototype._paintAllTiles = function(startX, startY) {
        var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
        var tileRows = Math.ceil(this._height / this._tileHeight) + 1;
        for (var y = 0; y < tileRows; y++) {
            for (var x = 0; x < tileCols; x++) {
                this._paintTiles(startX, startY, x, y);
            }
        }
    };

    Tilemap.prototype._tempLowerTiles = [];
    Tilemap.prototype._tempUpperTiles = [];

    /**
     * @method _paintTiles
     * @param {Number} startX
     * @param {Number} startY
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    Tilemap.prototype._paintTiles = function(startX, startY, x, y) {
        var tableEdgeVirtualId = 10000;
        var mx = startX + x;
        var my = startY + y;
        var dx = (mx * this._tileWidth).mod(this._layerWidth);
        var dy = (my * this._tileHeight).mod(this._layerHeight);
        var lx = dx / this._tileWidth;
        var ly = dy / this._tileHeight;
        var tileId0 = this._readMapData(mx, my, 0);
        var tileId1 = this._readMapData(mx, my, 1);
        var tileId2 = this._readMapData(mx, my, 2);
        var tileId3 = this._readMapData(mx, my, 3);
        var shadowBits = this._readMapData(mx, my, 4);
        var upperTileId1 = this._readMapData(mx, my - 1, 1);
        var lowerTiles = this._tempLowerTiles;
        var upperTiles = this._tempUpperTiles;
        while (lowerTiles.length>0) lowerTiles.pop();
        while (upperTiles.length>0) upperTiles.pop();

        if (this._isHigherTile(tileId0)) {
            upperTiles.push(tileId0);
        } else {
            lowerTiles.push(tileId0);
        }
        if (this._isHigherTile(tileId1)) {
            upperTiles.push(tileId1);
        } else {
            lowerTiles.push(tileId1);
        }

        lowerTiles.push(-shadowBits);

        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) {
                lowerTiles.push(tableEdgeVirtualId + upperTileId1);
            }
        }

        if (this._isOverpassPosition(mx, my)) {
            upperTiles.push(tileId2);
            upperTiles.push(tileId3);
        } else {
            if (this._isHigherTile(tileId2)) {
                upperTiles.push(tileId2);
            } else {
                lowerTiles.push(tileId2);
            }
            if (this._isHigherTile(tileId3)) {
                upperTiles.push(tileId3);
            } else {
                lowerTiles.push(tileId3);
            }
        }

        var lastLowerTiles = this._readLastTiles(0, lx, ly);
        if (!lowerTiles.equals(lastLowerTiles) ||
            (Tilemap.isTileA1(tileId0) && this._frameUpdated)) {
            this._lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
            for (var i = 0; i < lowerTiles.length; i++) {
                var lowerTileId = lowerTiles[i];
                if (lowerTileId < 0) {
                    this._drawShadow(this._lowerBitmap, shadowBits, dx, dy);
                } else if (lowerTileId >= tableEdgeVirtualId) {
                    this._drawTableEdge(this._lowerBitmap, upperTileId1, dx, dy);
                } else {
                    this._drawTile(this._lowerBitmap, lowerTileId, dx, dy);
                }
            }
            this._writeLastTiles(0, lx, ly, lowerTiles);
        }

        var lastUpperTiles = this._readLastTiles(1, lx, ly);
        if (!upperTiles.equals(lastUpperTiles)) {
            this._upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
            for (var j = 0; j < upperTiles.length; j++) {
                this._drawTile(this._upperBitmap, upperTiles[j], dx, dy);
            }
            this._writeLastTiles(1, lx, ly, upperTiles);
        }
    };

    /**
     * @method _readLastTiles
     * @param {Number} i
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    Tilemap.prototype._readLastTiles = function(i, x, y) {
        var array1 = this._lastTiles[i];
        if (array1) {
            var array2 = array1[y];
            if (array2) {
                var tiles = array2[x];
                if (tiles) {
                    return tiles;
                }
            }
        }
        return [];
    };

    /**
     * @method _writeLastTiles
     * @param {Number} i
     * @param {Number} x
     * @param {Number} y
     * @param {Array} tiles
     * @private
     */
    Tilemap.prototype._writeLastTiles = function(i, x, y, tiles) {
        var array1 = this._lastTiles[i];
        if (!array1) {
            array1 = this._lastTiles[i] = [];
        }
        var array2 = array1[y];
        if (!array2) {
            array2 = array1[y] = [];
        }
        var array3 = array2[x];
        if (!array3) {
            array3 = array2[x] = [];
        }
        while (array3.length>0) array3.pop();
        for (var i= 0,n=tiles.length;i<n;i++)
            array3.push(tiles[i]);
    };

    /**
     * @method _drawTile
     * @param {Bitmap} bitmap
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    Tilemap.prototype._drawTile = function(bitmap, tileId, dx, dy) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this._drawAutotile(bitmap, tileId, dx, dy);
            } else {
                this._drawNormalTile(bitmap, tileId, dx, dy);
            }
        }
    };

    /**
     * @method _drawNormalTile
     * @param {Bitmap} bitmap
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    Tilemap.prototype._drawNormalTile = function(bitmap, tileId, dx, dy) {
        var setNumber = 0;

        if (Tilemap.isTileA5(tileId)) {
            setNumber = 4;
        } else {
            setNumber = 5 + Math.floor(tileId / 256);
        }

        var w = this._tileWidth;
        var h = this._tileHeight;
        var sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
        var sy = (Math.floor(tileId % 256 / 8) % 16) * h;

        var source = this.bitmaps[setNumber];
        if (source) {
            bitmap.blt(source, sx, sy, w, h, dx, dy, w, h);
        }
    };

    /**
     * @method _drawAutotile
     * @param {Bitmap} bitmap
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    Tilemap.prototype._drawAutotile = function(bitmap, tileId, dx, dy) {
        var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        var kind = Tilemap.getAutotileKind(tileId);
        var shape = Tilemap.getAutotileShape(tileId);
        var tx = kind % 8;
        var ty = Math.floor(kind / 8);
        var bx = 0;
        var by = 0;
        var setNumber = 0;
        var isTable = false;

        if (Tilemap.isTileA1(tileId)) {
            var waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
            setNumber = 0;
            if (kind === 0) {
                bx = waterSurfaceIndex * 2;
                by = 0;
            } else if (kind === 1) {
                bx = waterSurfaceIndex * 2;
                by = 3;
            } else if (kind === 2) {
                bx = 6;
                by = 0;
            } else if (kind === 3) {
                bx = 6;
                by = 3;
            } else {
                bx = Math.floor(tx / 4) * 8;
                by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
                if (kind % 2 === 0) {
                    bx += waterSurfaceIndex * 2;
                }
                else {
                    bx += 6;
                    autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                    by += this.animationFrame % 3;
                }
            }
        } else if (Tilemap.isTileA2(tileId)) {
            setNumber = 1;
            bx = tx * 2;
            by = (ty - 2) * 3;
            isTable = this._isTableTile(tileId);
        } else if (Tilemap.isTileA3(tileId)) {
            setNumber = 2;
            bx = tx * 2;
            by = (ty - 6) * 2;
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        } else if (Tilemap.isTileA4(tileId)) {
            setNumber = 3;
            bx = tx * 2;
            by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
            if (ty % 2 === 1) {
                autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
            }
        }

        var table = autotileTable[shape];
        var source = this.bitmaps[setNumber];

        if (table && source) {
            var w1 = this._tileWidth / 2;
            var h1 = this._tileHeight / 2;
            for (var i = 0; i < 4; i++) {
                var qsx = table[i][0];
                var qsy = table[i][1];
                var sx1 = (bx * 2 + qsx) * w1;
                var sy1 = (by * 2 + qsy) * h1;
                var dx1 = dx + (i % 2) * w1;
                var dy1 = dy + Math.floor(i / 2) * h1;
                if (isTable && (qsy === 1 || qsy === 5)) {
                    var qsx2 = qsx;
                    var qsy2 = 3;
                    if (qsy === 1) {
                        qsx2 = [0,3,2,1][qsx];
                    }
                    var sx2 = (bx * 2 + qsx2) * w1;
                    var sy2 = (by * 2 + qsy2) * h1;
                    bitmap.blt(source, sx2, sy2, w1, h1, dx1, dy1, w1, h1);
                    dy1 += h1/2;
                    bitmap.blt(source, sx1, sy1, w1, h1/2, dx1, dy1, w1, h1/2);
                } else {
                    bitmap.blt(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
                }
            }
        }
    };

    /**
     * @method _drawTableEdge
     * @param {Bitmap} bitmap
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    Tilemap.prototype._drawTableEdge = function(bitmap, tileId, dx, dy) {
        if (Tilemap.isTileA2(tileId)) {
            var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
            var kind = Tilemap.getAutotileKind(tileId);
            var shape = Tilemap.getAutotileShape(tileId);
            var tx = kind % 8;
            var ty = Math.floor(kind / 8);
            var setNumber = 1;
            var bx = tx * 2;
            var by = (ty - 2) * 3;
            var table = autotileTable[shape];

            if (table) {
                var source = this.bitmaps[setNumber];
                var w1 = this._tileWidth / 2;
                var h1 = this._tileHeight / 2;
                for (var i = 0; i < 2; i++) {
                    var qsx = table[2 + i][0];
                    var qsy = table[2 + i][1];
                    var sx1 = (bx * 2 + qsx) * w1;
                    var sy1 = (by * 2 + qsy) * h1 + h1/2;
                    var dx1 = dx + (i % 2) * w1;
                    var dy1 = dy + Math.floor(i / 2) * h1;
                    bitmap.blt(source, sx1, sy1, w1, h1/2, dx1, dy1, w1, h1/2);
                }
            }
        }
    };

    /**
     * @method _drawShadow
     * @param {Bitmap} bitmap
     * @param {Number} shadowBits
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    Tilemap.prototype._drawShadow = function(bitmap, shadowBits, dx, dy) {
        if (shadowBits & 0x0f) {
            var w1 = this._tileWidth / 2;
            var h1 = this._tileHeight / 2;
            var color = 'rgba(0,0,0,0.5)';
            for (var i = 0; i < 4; i++) {
                if (shadowBits & (1 << i)) {
                    var dx1 = dx + (i % 2) * w1;
                    var dy1 = dy + Math.floor(i / 2) * h1;
                    bitmap.fillRect(dx1, dy1, w1, h1, color);
                }
            }
        }
    };

    /**
     * @method _readMapData
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @return {Number}
     * @private
     */
    Tilemap.prototype._readMapData = function(x, y, z) {
        if (this._mapData) {
            var width = this._mapWidth;
            var height = this._mapHeight;
            if (this.horizontalWrap) {
                x = x.mod(width);
            }
            if (this.verticalWrap) {
                y = y.mod(height);
            }
            if (x >= 0 && x < width && y >= 0 && y < height) {
                return this._mapData[(z * height + y) * width + x] || 0;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    };

    /**
     * @method _isHigherTile
     * @param {Number} tileId
     * @return {Boolean}
     * @private
     */
    Tilemap.prototype._isHigherTile = function(tileId) {
        return this.flags[tileId] & 0x10;
    };

    /**
     * @method _isTableTile
     * @param {Number} tileId
     * @return {Boolean}
     * @private
     */
    Tilemap.prototype._isTableTile = function(tileId) {
        return Tilemap.isTileA2(tileId) && (this.flags[tileId] & 0x80);
    };

    /**
     * @method _isOverpassPosition
     * @param {Number} mx
     * @param {Number} my
     * @return {Boolean}
     * @private
     */
    Tilemap.prototype._isOverpassPosition = function(mx, my) {
        return false;
    };

    /**
     * @method _sortChildren
     * @private
     */
    Tilemap.prototype._sortChildren = function() {
        this.children.sort(this._compareChildOrder.bind(this));
    };

    /**
     * @method _compareChildOrder
     * @param {Object} a
     * @param {Object} b
     * @private
     */
    Tilemap.prototype._compareChildOrder = function(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    };

// Tile type checkers

    Tilemap.TILE_ID_B      = 0;
    Tilemap.TILE_ID_C      = 256;
    Tilemap.TILE_ID_D      = 512;
    Tilemap.TILE_ID_E      = 768;
    Tilemap.TILE_ID_A5     = 1536;
    Tilemap.TILE_ID_A1     = 2048;
    Tilemap.TILE_ID_A2     = 2816;
    Tilemap.TILE_ID_A3     = 4352;
    Tilemap.TILE_ID_A4     = 5888;
    Tilemap.TILE_ID_MAX    = 8192;

    Tilemap.isVisibleTile = function(tileId) {
        return tileId > 0 && tileId < this.TILE_ID_MAX;
    };

    Tilemap.isAutotile = function(tileId) {
        return tileId >= this.TILE_ID_A1;
    };

    Tilemap.getAutotileKind = function(tileId) {
        return Math.floor((tileId - this.TILE_ID_A1) / 48);
    };

    Tilemap.getAutotileShape = function(tileId) {
        return (tileId - this.TILE_ID_A1) % 48;
    };

    Tilemap.makeAutotileId = function(kind, shape) {
        return this.TILE_ID_A1 + kind * 48 + shape;
    };

    Tilemap.isSameKindTile = function(tileID1, tileID2) {
        if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
            return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
        } else {
            return tileID1 === tileID2;
        }
    };

    Tilemap.isTileA1 = function(tileId) {
        return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
    };

    Tilemap.isTileA2 = function(tileId) {
        return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
    };

    Tilemap.isTileA3 = function(tileId) {
        return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
    };

    Tilemap.isTileA4 = function(tileId) {
        return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
    };

    Tilemap.isTileA5 = function(tileId) {
        return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
    };

    Tilemap.isWaterTile = function(tileId) {
        if (this.isTileA1(tileId)) {
            return !(tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192);
        } else {
            return false;
        }
    };

    Tilemap.isWaterfallTile = function(tileId) {
        if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
            return this.getAutotileKind(tileId) % 2 === 1;
        } else {
            return false;
        }
    };

    Tilemap.isGroundTile = function(tileId) {
        return this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId);
    };

    Tilemap.isShadowingTile = function(tileId) {
        return this.isTileA3(tileId) || this.isTileA4(tileId);
    };

    Tilemap.isRoofTile = function(tileId) {
        return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    };

    Tilemap.isWallTopTile = function(tileId) {
        return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    };

    Tilemap.isWallSideTile = function(tileId) {
        return (this.isTileA3(tileId) || this.isTileA4(tileId)) &&
            getAutotileKind(tileId) % 16 >= 8;
    };

    Tilemap.isWallTile = function(tileId) {
        return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
    };

    Tilemap.isFloorTypeAutotile = function(tileId) {
        return (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) ||
            this.isTileA2(tileId) || this.isWallTopTile(tileId);
    };

    Tilemap.isWallTypeAutotile = function(tileId) {
        return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
    };

    Tilemap.isWaterfallTypeAutotile = function(tileId) {
        return this.isWaterfallTile(tileId);
    };

// Autotile shape number to coordinates of tileset images

    Tilemap.FLOOR_AUTOTILE_TABLE = [
        [[2,4],[1,4],[2,3],[1,3]],[[2,0],[1,4],[2,3],[1,3]],
        [[2,4],[3,0],[2,3],[1,3]],[[2,0],[3,0],[2,3],[1,3]],
        [[2,4],[1,4],[2,3],[3,1]],[[2,0],[1,4],[2,3],[3,1]],
        [[2,4],[3,0],[2,3],[3,1]],[[2,0],[3,0],[2,3],[3,1]],
        [[2,4],[1,4],[2,1],[1,3]],[[2,0],[1,4],[2,1],[1,3]],
        [[2,4],[3,0],[2,1],[1,3]],[[2,0],[3,0],[2,1],[1,3]],
        [[2,4],[1,4],[2,1],[3,1]],[[2,0],[1,4],[2,1],[3,1]],
        [[2,4],[3,0],[2,1],[3,1]],[[2,0],[3,0],[2,1],[3,1]],
        [[0,4],[1,4],[0,3],[1,3]],[[0,4],[3,0],[0,3],[1,3]],
        [[0,4],[1,4],[0,3],[3,1]],[[0,4],[3,0],[0,3],[3,1]],
        [[2,2],[1,2],[2,3],[1,3]],[[2,2],[1,2],[2,3],[3,1]],
        [[2,2],[1,2],[2,1],[1,3]],[[2,2],[1,2],[2,1],[3,1]],
        [[2,4],[3,4],[2,3],[3,3]],[[2,4],[3,4],[2,1],[3,3]],
        [[2,0],[3,4],[2,3],[3,3]],[[2,0],[3,4],[2,1],[3,3]],
        [[2,4],[1,4],[2,5],[1,5]],[[2,0],[1,4],[2,5],[1,5]],
        [[2,4],[3,0],[2,5],[1,5]],[[2,0],[3,0],[2,5],[1,5]],
        [[0,4],[3,4],[0,3],[3,3]],[[2,2],[1,2],[2,5],[1,5]],
        [[0,2],[1,2],[0,3],[1,3]],[[0,2],[1,2],[0,3],[3,1]],
        [[2,2],[3,2],[2,3],[3,3]],[[2,2],[3,2],[2,1],[3,3]],
        [[2,4],[3,4],[2,5],[3,5]],[[2,0],[3,4],[2,5],[3,5]],
        [[0,4],[1,4],[0,5],[1,5]],[[0,4],[3,0],[0,5],[1,5]],
        [[0,2],[3,2],[0,3],[3,3]],[[0,2],[1,2],[0,5],[1,5]],
        [[0,4],[3,4],[0,5],[3,5]],[[2,2],[3,2],[2,5],[3,5]],
        [[0,2],[3,2],[0,5],[3,5]],[[0,0],[1,0],[0,1],[1,1]]
    ];

    Tilemap.WALL_AUTOTILE_TABLE = [
        [[2,2],[1,2],[2,1],[1,1]],[[0,2],[1,2],[0,1],[1,1]],
        [[2,0],[1,0],[2,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],
        [[2,2],[3,2],[2,1],[3,1]],[[0,2],[3,2],[0,1],[3,1]],
        [[2,0],[3,0],[2,1],[3,1]],[[0,0],[3,0],[0,1],[3,1]],
        [[2,2],[1,2],[2,3],[1,3]],[[0,2],[1,2],[0,3],[1,3]],
        [[2,0],[1,0],[2,3],[1,3]],[[0,0],[1,0],[0,3],[1,3]],
        [[2,2],[3,2],[2,3],[3,3]],[[0,2],[3,2],[0,3],[3,3]],
        [[2,0],[3,0],[2,3],[3,3]],[[0,0],[3,0],[0,3],[3,3]]
    ];

    Tilemap.WATERFALL_AUTOTILE_TABLE = [
        [[2,0],[1,0],[2,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],
        [[2,0],[3,0],[2,1],[3,1]],[[0,0],[3,0],[0,1],[3,1]]
    ];

    //-----------------------------------------------------------------------------
    /**
     * The tilemap which displays 2D tile-based game map using shaders
     *
     * @class Tilemap
     * @constructor
     */
    class ShaderTilemap extends Tilemap {
        constructor() {
            super(arguments)
            this.roundPixels = true;
            this.tileAnim = [0, 0];
        }

        onAnimChange() {
            var af = this.animationFrame % 4;
            if (af === 3) af = 1;
            if (this.lowerLayer) {

                const tileAnim = this.tileAnim;

                tileAnim[0] = af * this._tileWidth;
                tileAnim[1] = (this.animationFrame % 3) * this._tileHeight;

                this.lowerLayer.tileAnim = this.upperLayer.tileAnim = tileAnim;
            }
        }
    }



    /**
     * PIXI render method
     *
     * @method render
     * @param {Object} pixi renderer
     */
    ShaderTilemap.prototype.render = function(renderer) {
        this._hackRenderer(renderer);
        PIXI.Container.prototype.render.call(this, renderer);
    };

    /**
     * Forces to repaint the entire tilemap AND update bitmaps list if needed
     *
     * @method refresh
     */
    ShaderTilemap.prototype.refresh = function() {
        if (this._lastBitmapLength != this.bitmaps.length) {
            this._lastBitmapLength = this.bitmaps.length;
            this._updateBitmaps();
        };
        this._needsRepaint = true;
    };

    /**
     * Updates bitmaps list
     *
     * @method refresh
     * @private
     */
    ShaderTilemap.prototype._updateBitmaps = function() {
        var bitmaps = this.bitmaps.map(function(x) { return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x; } );
        this.lowerLayer.setBitmaps(bitmaps);
        this.upperLayer.setBitmaps(bitmaps);
    };

    /**
     * @method updateTransform
     * @private
     */
    ShaderTilemap.prototype.updateTransformTick = function() {
        if (this.roundPixels) {
            var ox = Math.floor(this.origin.x);
            var oy = Math.floor(this.origin.y);
        } else {
            ox = this.origin.x;
            oy = this.origin.y;
        }
        var startX = Math.floor((ox - this._margin) / this._tileWidth);
        var startY = Math.floor((oy - this._margin) / this._tileHeight);
        this._updateLayerPositions(startX, startY);
        if (this._needsRepaint ||
            this._lastStartX !== startX || this._lastStartY !== startY) {
            this._lastStartX = startX;
            this._lastStartY = startY;
            this._paintAllTiles(startX, startY);
            this._needsRepaint = false;
        }
        this._sortChildren();
    };

    /**
     * @method _createLayers
     * @private
     */
    ShaderTilemap.prototype._createLayers = function() {
        var width = this._width;
        var height = this._height;
        var margin = this._margin;
        var tileCols = Math.ceil(width / this._tileWidth) + 1;
        var tileRows = Math.ceil(height / this._tileHeight) + 1;
        var layerWidth = this._layerWidth = tileCols * this._tileWidth;
        var layerHeight = this._layerHeight = tileRows * this._tileHeight;
        this._needsRepaint = true;

        if (!this.lowerLayer) {
            // var parameters = PluginManager.parameters('ShaderTilemap');
            // var useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? parameters['squareShader'] : 1);

            this.addChild(this.lowerLayer = new PIXI.tilemap.CompositeTilemap(0, []));
            this.lowerLayer.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
            this.addChild(this.upperLayer = new PIXI.tilemap.CompositeTilemap(4, []));
        }
    };

    /**
     * @method _updateLayerPositions
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    ShaderTilemap.prototype._updateLayerPositions = function(startX, startY) {
        if (this.roundPixels) {
            var ox = Math.floor(this.origin.x);
            var oy = Math.floor(this.origin.y);
        } else {
            ox = this.origin.x;
            oy = this.origin.y;
        }
        this.lowerLayer.position.x = startX * this._tileWidth - ox;
        this.lowerLayer.position.y = startY * this._tileHeight - oy;
        this.upperLayer.position.x = startX * this._tileWidth - ox;
        this.upperLayer.position.y = startY * this._tileHeight - oy;
    };

    /**
     * @method _paintAllTiles
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    ShaderTilemap.prototype._paintAllTiles = function(startX, startY) {
        this.lowerLayer.clear()
        this.upperLayer.clear()
        var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
        var tileRows = Math.ceil(this._height / this._tileHeight) + 1;
        for (var y = 0; y < tileRows; y++) {
            for (var x = 0; x < tileCols; x++) {
                this._paintTiles(startX, startY, x, y);
            }
        }
    };

    /**
     * @method _paintTiles
     * @param {Number} startX
     * @param {Number} startY
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    ShaderTilemap.prototype._paintTiles = function(startX, startY, x, y) {
        var mx = startX + x;
        var my = startY + y;
        var dx = x * this._tileWidth, dy = y * this._tileHeight;
        var tileId0 = this._readMapData(mx, my, 0);
        var tileId1 = this._readMapData(mx, my, 1);
        var tileId2 = this._readMapData(mx, my, 2);
        var tileId3 = this._readMapData(mx, my, 3);
        var shadowBits = this._readMapData(mx, my, 4);
        var upperTileId1 = this._readMapData(mx, my - 1, 1);
        var lowerLayer = this.lowerLayer.children[0];
        var upperLayer = this.upperLayer.children[0];

        if (this._isHigherTile(tileId0)) {
            this._drawTile(upperLayer, tileId0, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId0, dx, dy);
        }
        if (this._isHigherTile(tileId1)) {
            this._drawTile(upperLayer, tileId1, dx, dy);
        } else {
            this._drawTile(lowerLayer, tileId1, dx, dy);
        }

        this._drawShadow(lowerLayer, shadowBits, dx, dy);
        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) {
                this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
            }
        }

        if (this._isOverpassPosition(mx, my)) {
            this._drawTile(upperLayer, tileId2, dx, dy);
            this._drawTile(upperLayer, tileId3, dx, dy);
        } else {
            if (this._isHigherTile(tileId2)) {
                this._drawTile(upperLayer, tileId2, dx, dy);
            } else {
                this._drawTile(lowerLayer, tileId2, dx, dy);
            }
            if (this._isHigherTile(tileId3)) {
                this._drawTile(upperLayer, tileId3, dx, dy);
            } else {
                this._drawTile(lowerLayer, tileId3, dx, dy);
            }
        }
    };

    /**
     * @method _drawTile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    ShaderTilemap.prototype._drawTile = function(layer, tileId, dx, dy) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this._drawAutotile(layer, tileId, dx, dy);
            } else {
                this._drawNormalTile(layer, tileId, dx, dy);
            }
        }
    };

    /**
     * @method _drawNormalTile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    ShaderTilemap.prototype._drawNormalTile = function(layer, tileId, dx, dy) {
        var setNumber = 0;

        if (Tilemap.isTileA5(tileId)) {
            setNumber = 4;
        } else {
            setNumber = 5 + Math.floor(tileId / 256);
        }

        var w = this._tileWidth;
        var h = this._tileHeight;
        var sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
        var sy = (Math.floor(tileId % 256 / 8) % 16) * h;

        layer.addRect(setNumber, sx, sy, dx, dy, w, h);
    };

    /**
     * @method _drawAutotile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    ShaderTilemap.prototype._drawAutotile = function(layer, tileId, dx, dy) {
        var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        var kind = Tilemap.getAutotileKind(tileId);
        var shape = Tilemap.getAutotileShape(tileId);
        var tx = kind % 8;
        var ty = Math.floor(kind / 8);
        var bx = 0;
        var by = 0;
        var setNumber = 0;
        var isTable = false;
        var animX = 0, animY = 0;

        if (Tilemap.isTileA1(tileId)) {
            setNumber = 0;
            if (kind === 0) {
                animX = 2;
                by = 0;
            } else if (kind === 1) {
                animX = 2;
                by = 3;
            } else if (kind === 2) {
                bx = 6;
                by = 0;
            } else if (kind === 3) {
                bx = 6;
                by = 3;
            } else {
                bx = Math.floor(tx / 4) * 8;
                by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
                if (kind % 2 === 0) {
                    animX = 2;
                }
                else {
                    bx += 6;
                    autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                    animY = 1;
                }
            }
        } else if (Tilemap.isTileA2(tileId)) {
            setNumber = 1;
            bx = tx * 2;
            by = (ty - 2) * 3;
            isTable = this._isTableTile(tileId);
        } else if (Tilemap.isTileA3(tileId)) {
            setNumber = 2;
            bx = tx * 2;
            by = (ty - 6) * 2;
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        } else if (Tilemap.isTileA4(tileId)) {
            setNumber = 3;
            bx = tx * 2;
            by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
            if (ty % 2 === 1) {
                autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
            }
        }

        var table = autotileTable[shape];
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        for (var i = 0; i < 4; i++) {
            var qsx = table[i][0];
            var qsy = table[i][1];
            var sx1 = (bx * 2 + qsx) * w1;
            var sy1 = (by * 2 + qsy) * h1;
            var dx1 = dx + (i % 2) * w1;
            var dy1 = dy + Math.floor(i / 2) * h1;
            if (isTable && (qsy === 1 || qsy === 5)) {
                var qsx2 = qsx;
                var qsy2 = 3;
                if (qsy === 1) {
                    //qsx2 = [0, 3, 2, 1][qsx];
                    qsx2 = (4-qsx)%4;
                }
                var sx2 = (bx * 2 + qsx2) * w1;
                var sy2 = (by * 2 + qsy2) * h1;
                layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1, animX, animY);
                layer.addRect(setNumber, sx1, sy1, dx1, dy1+h1/2, w1, h1/2, animX, animY);
            } else {
                layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1, animX, animY);
            }
        }
    };

    /**
     * @method _drawTableEdge
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    ShaderTilemap.prototype._drawTableEdge = function(layer, tileId, dx, dy) {
        if (Tilemap.isTileA2(tileId)) {
            var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
            var kind = Tilemap.getAutotileKind(tileId);
            var shape = Tilemap.getAutotileShape(tileId);
            var tx = kind % 8;
            var ty = Math.floor(kind / 8);
            var setNumber = 1;
            var bx = tx * 2;
            var by = (ty - 2) * 3;
            var table = autotileTable[shape];
            var w1 = this._tileWidth / 2;
            var h1 = this._tileHeight / 2;
            for (var i = 0; i < 2; i++) {
                var qsx = table[2 + i][0];
                var qsy = table[2 + i][1];
                var sx1 = (bx * 2 + qsx) * w1;
                var sy1 = (by * 2 + qsy) * h1 + h1 / 2;
                var dx1 = dx + (i % 2) * w1;
                var dy1 = dy + Math.floor(i / 2) * h1;
                layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1/2);
            }
        }
    };

    /**
     * @method _drawShadow
     * @param {Number} shadowBits
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    ShaderTilemap.prototype._drawShadow = function(layer, shadowBits, dx, dy) {
        if (shadowBits & 0x0f) {
            var w1 = this._tileWidth / 2;
            var h1 = this._tileHeight / 2;
            for (var i = 0; i < 4; i++) {
                if (shadowBits & (1 << i)) {
                    var dx1 = dx + (i % 2) * w1;
                    var dy1 = dy + Math.floor(i / 2) * h1;
                    layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
                }
            }
        }
    };

    function LevelLoader() {
        this.initialize.apply(this, arguments);
    }

    LevelLoader.prototype = {
        initialize: function() {

        },
        load : async function(name) {
            var tileset = null;
            var tilesetNames = null;
            var assets = PIXI.Assets;

            assets.add({
                alias: 'tilesets',
                src: 'rpgmaker/data/Tilesets.json'
            })

            const tilesets = await assets.load('tilesets');
            assets.add({ alias: name, src: 'rpgmaker/data/'+name+'.json' })

            const map = await assets.load(name)
            tileset = tilesets[map['tilesetId']];
            tilesetNames = tileset['tilesetNames'];
            const all_tiles = [];
            tilesetNames.forEach(function(name) {
                if (name.length>0 && !PIXI.Cache.has(name)) {
                    assets.add({ alias: name, src: 'rpgmaker/img/' + name + ".png" });
                    all_tiles.push(name);
                }
            })

            await assets.load(all_tiles);

            var result = new ShaderTilemap(300, 300);
            for (var i=0;i<tilesetNames.length;i++) {
                const name = tilesetNames[i];
                if (!name) {
                    //TODO: allow to miss some bitmaps
                    continue;
                }
                var tex = PIXI.Cache.get(name);
                result.bitmaps.push(tex);
                if (tex) tex.source.mipmap = true;
            }
            while (result.bitmaps.length>0 && !result.bitmaps[result.bitmaps.length-1]) {
                result.bitmaps.pop();
            }
            result.flags = tileset.flags;
            result.setData(map.width, map.height, map.data);
            result.refresh();

            return result;
        }
    };

    return new LevelLoader();
};
