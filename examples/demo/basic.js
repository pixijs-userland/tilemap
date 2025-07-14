/* global PIXI */
(async () =>
{
    const searchParams = new URLSearchParams(window.location.search);
    const app = new PIXI.Application();

    await app.init({
        width: 800,
        height: 600,
        preference: searchParams.get('preference') || 'webgl',
        hello: true
    });
    const tilemap = new PIXI.tilemap.CompositeTilemap();

    document.body.appendChild(app.canvas);
    app.stage.addChild(tilemap);

    const loadAssets = async () =>
    {
        PIXI.Assets.add({ alias: 'atlas', src: 'assets/atlas.json' });
        PIXI.Assets.add({ alias: 'button', src: 'assets/button.png' });
        await PIXI.Assets.load(['atlas', 'button']);
    };

    const buildTilemap = () =>
    {
        // Clear everything, like a PIXI.Graphics
        tilemap.clear();

        const size = 32;

        // if you are too lazy, just specify filename and pixi will find it in cache
        for (let i = 0; i < 7; i++)
        {
            for (let j = 0; j < 5; j++)
            {
                tilemap.tile('grass.png', i * size, j * size);

                if (i % 2 === 1 && j % 2 === 1)
                {
                    tilemap.tile('tough.png', i * size, j * size);
                }
            }
        }

        // if you are lawful citizen, please use textures from
        const textures = PIXI.Assets.get('atlas').textures;

        tilemap.tile(textures['brick.png'], 2 * size, 2 * size);
        tilemap.tile(textures['brick_wall.png'], 2 * size, 3 * size, { alpha: 0.6 });

        // chest will be animated!
        // old way: animate on rebuild
        // tilemap.addFrame(textures[frame % 2 == 0 ? "chest.png" : "red_chest.png"], 4 * size, 4 * size);

        // new way: animate on shader: 2 frames , X offset is 32 , "red_chest" is exactly 34 pixels right in the atlas
        // Frame changes every 100ms because of `setInterval(animShader, 100)`, so the first animation
        // will change to the next frame every 100ms
        tilemap.tile(textures['chest.png'], 4 * size, 4 * size).tileAnimX(34, 2);

        // You can also set independent time for each tile.
        // In this second chest, we pass 3 to tileAnimDivisor
        // 3 multiplies the 100ms we have in setInterval by 3, making the duration 300ms
        tilemap.tile(textures['chest.png'], 5 * size, 4 * size).tileAnimX(34, 2).tileAnimDivisor(3);
        // You can alternatively set it by passing animDivisor option when creating the tile. Below a frame duration is 600ms
        tilemap.tile(textures['chest.png'], 8 * size, 4 * size, { animX: 34, animCountX: 2, animDivisor: 6 });

        // button does not appear in the atlas, but tilemap wont surrender, it will
        // create second layer for special for buttons buttons will appear above everything
        tilemap.tile(PIXI.Assets.get('button'), 6 * size, 2 * size);

        // if you want rotations:
        // https://pixijs.io/examples-v4/#/textures/texture-rotate.js
        // textures should have frame, orig and trim to do that
        // canvas in pixi-tilemap does not work with rotate!!!!
        const origTex = textures['chest.png'];

        for (let i = 0; i < 8; i++)
        {
            const frame = origTex.frame.clone();
            const orig = origTex.orig.clone();
            const trim = origTex.orig.clone();
            const rotate = i * 2;

            if (rotate % 4 === 2)
            {
                orig.width = frame.height;
                orig.height = frame.width;
            }

            const tmpTex = new PIXI.Texture(origTex.source, frame, orig, trim, rotate);

            // Swap W and H in orig if you rotate%4 is not 0
            tilemap.tile(tmpTex, i % 4 * size, ((i >> 2) * size) + (5 * size));
            // rotate is also last parameter in addFrame
        }
    };

    const initialize = () =>
    {
        buildTilemap();

        const pic = new PIXI.Sprite(PIXI.Assets.get('button'));

        pic.position.set(200, 100);
        app.stage.addChild(pic);

        let frame = 0;
        const animShader = () =>
        {
            // animate X and Y frames
            tilemap.tileAnim = [frame, frame];
            frame++;
            // if (useCanvas) {
            //     frame = frame > 1 ? 0 : 1;
            // }
        };

        setInterval(animShader, 100);
    };

    const runApp = async () =>
    {
        await loadAssets();
        initialize();
    };

    runApp();
})();
