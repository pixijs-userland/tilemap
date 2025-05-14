import { ExtensionType, GlProgram, Shader, UniformGroup, WebGLRenderer } from 'pixi.js';
import { settings } from './settings';
import { Tilemap } from './Tilemap';
import { TilemapAdaptor, TilemapPipe } from './TilemapPipe';
import { TileTextureArray } from './TileTextureArray';

const gl_tilemap_vertex = `
in vec2 aVertexPosition;
in vec2 aTextureCoord;
in vec4 aFrame;
in vec2 aAnim;
in float aAnimDivisor;
in float aTextureId;
in float aAlpha;

uniform mat3 u_proj_trans;
uniform vec2 u_anim_frame;

out vec2 vTextureCoord;
out float vTextureId;
out vec4 vFrame;
out float vAlpha;

void main(void)
{
  gl_Position = vec4((u_proj_trans * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  vec2 animCount = floor((aAnim + 0.5) / 2048.0);
  vec2 animFrameOffset = aAnim - animCount * 2048.0;
  vec2 currentFrame = floor(u_anim_frame / aAnimDivisor);
  vec2 loop_num = floor((currentFrame + 0.5) / animCount);
  vec2 animOffset = animFrameOffset * floor(currentFrame - loop_num * animCount);

  vTextureCoord = aTextureCoord + animOffset;
  vFrame = aFrame + vec4(animOffset, animOffset);
  vTextureId = aTextureId;
  vAlpha = aAlpha;
}
`;

const gl_tilemap_fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
in vec2 vTextureCoord;
in vec4 vFrame;
in float vTextureId;
in float vAlpha;

//include_textures

void main(void)
{
  float textureId = floor(vTextureId + 0.5);
  vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);
  vec4 color = sampleMultiTexture(textureId, textureCoord);
  finalColor = color * vAlpha;
}
`;

export class GlTilemapAdaptor extends TilemapAdaptor
{
    public static extension = {
        type: [
            ExtensionType.WebGLPipesAdaptor,
        ],
        name: 'tilemap',
    } as const;

    _shader: Shader | null = null;
    max_textures: number = settings.TEXTURES_PER_TILEMAP;

    destroy(): void
    {
        this._shader?.destroy(true);
        this._shader = null;
    }

    execute(pipe: TilemapPipe, tilemap: Tilemap): void
    {
        const renderer = pipe.renderer as WebGLRenderer;
        const shader = this._shader;
        const tileset = tilemap.getTileset();

        const tu = shader?.resources.texture_uniforms;

        if (tu.uniforms.u_texture_size !== tileset.tex_sizes)
        {
            tu.uniforms.u_texture_size = tileset.tex_sizes;
            tu.update();
        }

        for (let i = 0; i < tileset.length; i++)
        {
            renderer.texture.bind(tileset.arr[i], i);
        }

        if (!shader || !tilemap.vb) return;

        renderer.encoder.draw({
            geometry: tilemap.vb,
            shader,
            state: tilemap.state,
            size: tilemap.rects_count * 6
        });

        // TODO: support several tilemaps here, without re-setting extra uniforms
    }

    init(): void
    {
        this._shader = new Shader({
            glProgram: GlProgram.from({
                vertex: gl_tilemap_vertex,
                fragment: gl_tilemap_fragment.replace('//include_textures',
                    TileTextureArray.generate_gl_textures(this.max_textures))
            }),
            resources: {
                texture_uniforms: new UniformGroup(TileTextureArray.gl_gen_resources(this.max_textures), { isStatic: true }),
                pipe_uniforms: this.pipe_uniforms.uniformStructures,
            },
        });
    }
}
