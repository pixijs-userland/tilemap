/* global PIXI, requireRpgMaker */
const searchParams = new URLSearchParams(location.search);
let _renderer;
const rpgMakerLoader = requireRpgMaker();
let stage = null;
let tilemap = null;
const scale = Number(searchParams.get('scale') || 1);
const resolution = Number(searchParams.get('resolution') || window.devicePixelRatio);
const ratio = window.devicePixelRatio / resolution;

(async () =>
{
    PIXI.tilemap.Constant.boundCountPerBuffer = 4;
    function resizeTilemap(width, height)
    {
        if (!tilemap) return;
        tilemap.width = (width + (2 * tilemap._margin)) * scale;
        tilemap.height = (height + (2 * tilemap._margin)) * scale;
        stage.scale.x = 1.0 / scale;
        stage.scale.y = 1.0 / scale;
        stage.filterArea = new PIXI.Rectangle(0, 0, width * scale, height * scale);
    }

    const app = new PIXI.Application();

    await app.init({
        preference: searchParams.get('preference') || 'webgl',
        hello: true,
        resizeTo: window
    });

    _renderer = app.renderer;

    document.body.appendChild(app.canvas);

    tilemap = await rpgMakerLoader.load('Map001');
    tilemap.roundPixels = (scale === 1);
    stage = app.stage;
    stage.addChild(tilemap);
    resizeTilemap(_renderer.width, _renderer.height);

    _renderer.on('resize', resizeTilemap);

    app.ticker.add(update);

    const dt = 0;
    let last = 0;
    let animTime = 0;

    function update()
    {
        const now = Date.now();
        let dt = Math.min(1000, now - last);

        dt /= 1000;
        last = now;

        tilemap.update();

        let dt2 = dt;
        const w1 = tilemap._tileWidth * tilemap._mapWidth;
        const h1 = tilemap._tileHeight * tilemap._mapHeight;
        const x1 = tilemap.origin.x; const
            y1 = tilemap.origin.y;
        let x2 = 0; let
            y2 = 0;

        for (let i = 0; i < 30; i++)
        {
            const at2 = animTime + dt2;

            x2 = Math.max(0, w1 - ((_renderer.width * scale) / resolution)) * (Math.cos(at2 * 0.5) + 1) / 2;
            y2 = Math.max(0, h1 - ((_renderer.height * scale) / resolution)) * (Math.sin(at2 * 0.4) + 1) / 2;
            const d = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

            if (d > 5 * scale / resolution)
            {
                dt2 = dt2 / (d / 5 / scale / ratio);
            }
            else break;
        }
        animTime += dt2;
        tilemap.origin.x = x2;
        tilemap.origin.y = y2;

        tilemap.updateTransformTick();
    }
})();
