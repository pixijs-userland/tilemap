import {
    Buffer,
    BufferUsage, ExtensionType, GlobalUniformGroup,
    IndexBufferArray, Instruction, InstructionPipe, InstructionSet, Matrix, NOOP, Renderer,
    RenderPipe, UniformGroup
} from 'pixi.js';
import { CompositeTilemap } from './CompositeTilemap';
import { settings } from './settings';
import { TilemapGeometry } from './TilemapGeometry';

import type { Tilemap } from './Tilemap';

// For some reason, ESLint goes mad with indentation in this file ^&^
/* eslint-disable no-mixed-spaces-and-tabs, indent */

export abstract class TilemapAdaptor
{
    abstract init(): void;
    abstract execute(meshPipe: TilemapPipe, mesh: Tilemap): void;
    abstract destroy(): void;

    public pipe_uniforms = new UniformGroup({
        u_proj_trans: { value: new Matrix(), type: 'mat3x3<f32>' },
        u_anim_frame: { value: new Float32Array(2), type: 'vec2<f32>' },
    });
}

export interface TilemapInstruction extends Instruction
{
    renderPipeId: 'tilemap';
    tilemap: Tilemap;
}

/**
 * Rendering helper pipeline for tilemaps. This plugin is registered automatically.
 */
export class TilemapPipe implements RenderPipe<Tilemap>, InstructionPipe<TilemapInstruction>
{
    public static extension = {
        type: [
            ExtensionType.WebGLPipes,
            ExtensionType.WebGPUPipes,
        ],
        name: 'tilemap',
    } as const;
    /** The managing renderer */
    public readonly renderer: Renderer;

    /** The tile animation frame */
    public tileAnim = [0, 0];

    private ibLen = 0;// index buffer length

    /** The index buffer for the tilemaps to share. */
    private readonly indexBuffer: Buffer;

    /** The shader used to render tilemaps. */
    private shader: TilemapGeometry | null = null;

    private adaptor: TilemapAdaptor;

    constructor(renderer: Renderer, adaptor: TilemapAdaptor)
    {
        this.renderer = renderer;
        this.adaptor = adaptor;

        this.adaptor.init();

	    this.indexBuffer = new Buffer({
            data: new Uint16Array([0, 1, 2, 0, 2, 3]),
            label: 'index-tilemap-buffer',
            usage: BufferUsage.INDEX | BufferUsage.COPY_DST,
        });
        // Remove the destroy method from the index buffer to prevent it from being destroyed.
        // This is because the index buffer is shared between all tilemaps,
        // and .destroy will be called when destroying a tilemap.
        this.indexBuffer.destroy = NOOP;

	    this.checkIndexBuffer(2000);
    }

    start(): void
    {
	    // sorry, nothing
    }

    /**
	 * @internal
	 * @ignore
	 */
    createVb(): TilemapGeometry
    {
	    const geom = new TilemapGeometry(this.indexBuffer);

        geom.lastTimeAccess = Date.now();

	    return geom;
    }

    /** @return The {@link TilemapGeometry} shader that this rendering pipeline is using. */
    getShader(): TilemapGeometry | null { return this.shader; }

    destroy(): void
    {
	    // this.rectShader.destroy();
	    this.shader = null;
    }

    // eslint-disable-next-line no-unused-vars
    public checkIndexBuffer(size: number): void
    {
	    const totalIndices = size * 6;

	    if (totalIndices <= this.ibLen)
	    {
	        return;
	    }

	    let len = totalIndices;

	    while (len < totalIndices)
	    {
	        len <<= 1;
	    }

	    this.ibLen = totalIndices;
	    this.indexBuffer.data = createIndicesForQuads(size,
	        settings.use32bitIndex ? new Uint32Array(totalIndices) : new Uint16Array(totalIndices));
    }

    destroyRenderable(_renderable: Tilemap): void
    {
        _renderable.vb.destroy(true);
        _renderable.vb = null;
    }

    addRenderable(tilemap: Tilemap, instructionSet: InstructionSet | undefined): void
    {
        const batcher = this.renderer.renderPipes.batch;

        tilemap.updateBuffer(this);
        tilemap.checkValid();
        tilemap.getTileset().update();

        if (tilemap.is_valid)
        {
            batcher.break(instructionSet);
            instructionSet.add(tilemap._instruction);
        }
    }

    updateRenderable(tilemap: Tilemap, _instructionSet?: InstructionSet | undefined): void
    {
        tilemap.updateBuffer(this);
        tilemap.getTileset().update();
    }

    validateRenderable(renderable: Tilemap): boolean
    {
        return renderable.checkValid();
    }

    public execute({ tilemap }: TilemapInstruction)
    {
        if (!tilemap.isRenderable) return;

        tilemap.state.blendMode = tilemap.groupBlendMode;

        const { pipe_uniforms } = this.adaptor;

        const u_proj_trans = pipe_uniforms.uniforms.u_proj_trans;
        const u_global = ((this.renderer.globalUniforms as any)._activeUniforms.at(-1) as GlobalUniformGroup).uniforms;
        let anim_frame = this.tileAnim;
        const { u_anim_frame } = pipe_uniforms.uniforms;

        u_global.uProjectionMatrix.copyTo(u_proj_trans).append(u_global.uWorldTransformMatrix)
            .append(tilemap.worldTransform);
        if (tilemap.compositeParent)
        {
            anim_frame = (tilemap.parent as CompositeTilemap).tileAnim || anim_frame;
        }
        u_anim_frame[0] = anim_frame[0];
        u_anim_frame[1] = anim_frame[1];

        pipe_uniforms.update();

        this.adaptor.execute(this, tilemap);
    }
}

function createIndicesForQuads(
    size: number,
    outBuffer: IndexBufferArray
): IndexBufferArray
{
    // the total number of indices in our array, there are 6 points per quad.
    const totalIndices = size * 6;

    if (outBuffer.length !== totalIndices)
    {
        throw new Error(`Out buffer length is incorrect, got ${outBuffer.length} and expected ${totalIndices}`);
    }

    // fill the indices with the quads to draw
    for (let i = 0, j = 0; i < totalIndices; i += 6, j += 4)
    {
        outBuffer[i + 0] = j + 0;
        outBuffer[i + 1] = j + 1;
        outBuffer[i + 2] = j + 2;
        outBuffer[i + 3] = j + 0;
        outBuffer[i + 4] = j + 2;
        outBuffer[i + 5] = j + 3;
    }

    return outBuffer;
}
