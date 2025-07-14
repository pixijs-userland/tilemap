/*!
 * @pixi/tilemap - v5.0.2
 * Compiled Mon, 14 Jul 2025 00:24:17 UTC
 *
 * @pixi/tilemap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2025, Ivan Popelyshev, All Rights Reserved
 */this.PIXI=this.PIXI||{},this.PIXI.tilemap=function(M,u){"use strict";const B={TEXTURES_PER_TILEMAP:16,TEXTILE_SCALE_MODE:"linear",use32bitIndex:!1},oe=B;var ue=Object.defineProperty,le=(i,e,t)=>e in i?ue(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,E=(i,e,t)=>(le(i,typeof e!="symbol"?e+"":e,t),t);const D=class S extends u.Geometry{constructor(e){const t=new u.Buffer({data:new Float32Array(2),label:"tilemap-buffer",usage:u.BufferUsage.VERTEX|u.BufferUsage.COPY_DST,shrinkToFit:!1}),r=S.stride;super({indexBuffer:e,attributes:{aVertexPosition:{buffer:t,format:"float32x2",stride:r,offset:0},aTextureCoord:{buffer:t,format:"float32x2",stride:r,offset:2*4},aFrame:{buffer:t,format:"float32x4",stride:r,offset:4*4},aAnim:{buffer:t,format:"float32x2",stride:r,offset:8*4},aTextureId:{buffer:t,format:"sint32",stride:r,offset:10*4},aAnimDivisor:{buffer:t,format:"float32",stride:r,offset:11*4},aAlpha:{buffer:t,format:"float32",stride:r,offset:12*4}}}),E(this,"lastTimeAccess",0),E(this,"vertSize",S.vertSize),E(this,"vertPerQuad",S.vertPerQuad),E(this,"stride",S.stride),E(this,"buf"),this.buf=t}};E(D,"vertSize",13),E(D,"vertPerQuad",4),E(D,"stride",D.vertSize*4);let ie=D;var he=Object.defineProperty,de=(i,e,t)=>e in i?he(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,C=(i,e,t)=>(de(i,typeof e!="symbol"?e+"":e,t),t);class N{constructor(){C(this,"pipe_uniforms",new u.UniformGroup({u_proj_trans:{value:new u.Matrix,type:"mat3x3<f32>"},u_anim_frame:{value:new Float32Array(2),type:"vec2<f32>"}}))}}class ${constructor(e,t){C(this,"renderer"),C(this,"tileAnim",[0,0]),C(this,"ibLen",0),C(this,"indexBuffer",null),C(this,"shader"),C(this,"adaptor"),this.renderer=e,this.adaptor=t,this.adaptor.init(),this.indexBuffer=new u.Buffer({data:new Uint16Array([0,1,2,0,2,3]),label:"index-tilemap-buffer",usage:u.BufferUsage.INDEX|u.BufferUsage.COPY_DST}),this.indexBuffer.destroy=u.NOOP,this.checkIndexBuffer(2e3)}start(){}createVb(){const e=new ie(this.indexBuffer);return e.lastTimeAccess=Date.now(),e}getShader(){return this.shader}destroy(){this.shader=null}checkIndexBuffer(e){const t=e*6;if(t<=this.ibLen)return;let r=t;for(;r<t;)r<<=1;this.ibLen=t,this.indexBuffer.data=fe(e,B.use32bitIndex?new Uint32Array(t):new Uint16Array(t))}destroyRenderable(e){e.vb.destroy(!0),e.vb=null}addRenderable(e,t){const r=this.renderer.renderPipes.batch;e.updateBuffer(this),e.checkValid(),e.getTileset().update(),e.is_valid&&(r.break(t),t.add(e._instruction))}updateRenderable(e,t){e.updateBuffer(this),e.getTileset().update()}validateRenderable(e){return e.checkValid()}execute({tilemap:e}){if(!e.isRenderable)return;e.state.blendMode=e.groupBlendMode;const{pipe_uniforms:t}=this.adaptor,r=t.uniforms.u_proj_trans,s=this.renderer.globalUniforms._activeUniforms.at(-1).uniforms;let n=this.tileAnim;const{u_anim_frame:l}=t.uniforms;s.uProjectionMatrix.copyTo(r).append(s.uWorldTransformMatrix).append(e.worldTransform),e.compositeParent&&(n=e.parent.tileAnim||n),l[0]=n[0],l[1]=n[1],t.update(),this.adaptor.execute(this,e)}}C($,"extension",{type:[u.ExtensionType.WebGLPipes,u.ExtensionType.WebGPUPipes],name:"tilemap"});function fe(i,e){const t=i*6;if(e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,s=0;r<t;r+=6,s+=4)e[r+0]=s+0,e[r+1]=s+1,e[r+2]=s+2,e[r+3]=s+0,e[r+4]=s+2,e[r+5]=s+3;return e}var me=Object.defineProperty,ce=(i,e,t)=>e in i?me(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,I=(i,e,t)=>(ce(i,typeof e!="symbol"?e+"":e,t),t);class U{constructor(e){I(this,"max_textures"),I(this,"arr",[]),I(this,"count",0),I(this,"dirty",!1),I(this,"dirty_gpu",!1),I(this,"bind_group",null),I(this,"bind_group_resources",{}),I(this,"tex_sizes",null),I(this,"null_color",new Float32Array([0,0,0,.5])),I(this,"tex_buf",null),this.max_textures=e,this.tex_sizes=new Float32Array(this.max_textures*4+4),this.tex_buf=new u.Buffer({usage:u.BufferUsage.UNIFORM|u.BufferUsage.COPY_DST})}get length(){return this.count}push(e){this.arr[this.count++]=e,this.dirty=!0}at(e){return this.arr[e]}update(){if(!this.dirty)return;this.dirty=!1,this.dirty_gpu=!0;const{tex_sizes:e,arr:t,count:r,max_textures:s,null_color:n}=this;for(let l=0;l<r;l++){const h=t[l];h&&(e[l*4]=h.pixelWidth,e[l*4+1]=h.pixelHeight,e[l*4+2]=1/h.pixelWidth,e[l*4+3]=1/h.pixelHeight)}e[s*4]=n[0],e[s*4+1]=n[1],e[s*4+2]=n[2],e[s*4+3]=n[3]}markDirty(){this.dirty=!0}getBindGroup(){if(this.update(),!this.dirty_gpu)return this.bind_group;const{bind_group_resources:e,max_textures:t,arr:r,count:s}=this;let n=0;e[n++]=new u.UniformGroup({u_texture_size:{value:this.tex_sizes,type:"vec4<f32>",size:t},u_null_color:{value:this.null_color,type:"vec4<f32>"}});for(let l=0;l<t;l++){const h=(l<s?r[l]:null)||u.Texture.EMPTY.source;e[n++]=h.source,e[n++]=h.style}return this.bind_group||(this.bind_group=new u.BindGroup(e)),this.bind_group}static generate_gpu_textures(e){const t=[];t.push("struct TextureArrayFields {"),t.push(`    u_texture_size: array<vec4f, ${e}>,`),t.push("    u_null_color: vec4f"),t.push("}"),t.push("@group(1) @binding(0) var<uniform> taf: TextureArrayFields;");for(let r=0;r<e;r++)t.push(`@group(1) @binding(${r*2+1}) var u_texture_${r}: texture_2d<f32>;`),t.push(`@group(1) @binding(${r*2+2}) var u_sampler_${r}: sampler;`);t.push("fn sampleMultiTexture(texture_id: i32, uv: vec2f, dx: vec2f, dy: vec2f) -> vec4f {"),t.push("switch texture_id {");for(let r=0;r<e;r++)t.push(`  case ${r}: { return textureSampleGrad(u_texture_${r}, u_sampler_${r}, uv, dx, dy); }`);return t.push("  default: { return taf.u_null_color; }"),t.push("} }"),t.join(`
`)}static generate_gl_textures(e){const t=[];t.push(`uniform vec4 u_texture_size[${e+1}];`),t.push(`uniform sampler2D u_textures[${e}];`),t.push("uniform vec4 u_null_color;"),t.push("vec4 sampleMultiTexture(float texture_id, vec2 uv) {"),t.push(`if(texture_id < -0.5) return u_texture_size[${e}];`);for(let r=0;r<e;r++)t.push(`if(texture_id < ${r}.5) return texture(u_textures[${r}], uv * u_texture_size[${r}].zw);`);return t.push(`return u_texture_size[${e}];`),t.push("}"),t.join(`
`)}static gl_gen_resources(e){const t=[];for(let s=0;s<e;s++)t[s]=s;const r=[];for(let s=0;s<e;s++)r.push(2048),r.push(2048),r.push(1/2048),r.push(1/2048);return{u_textures:{value:t,type:"i32",size:e},u_texture_size:{value:r,type:"vec4<f32>",size:e}}}}var pe=Object.defineProperty,ve=(i,e,t)=>e in i?pe(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,L=(i,e,t)=>(ve(i,typeof e!="symbol"?e+"":e,t),t);const Te=`
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
`,_e=`
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
`;class se extends N{constructor(){super(...arguments),L(this,"_shader",null),L(this,"max_textures",B.TEXTURES_PER_TILEMAP)}destroy(){this._shader.destroy(!0),this._shader=null}execute(e,t){const r=e.renderer,s=this._shader,n=t.getTileset(),l=s.resources.texture_uniforms;l.uniforms.u_texture_size!==n.tex_sizes&&(l.uniforms.u_texture_size=n.tex_sizes,l.update());for(let h=0;h<n.length;h++)r.texture.bind(n.arr[h],h);r.encoder.draw({geometry:t.vb,shader:s,state:t.state,size:t.rects_count*6})}init(){this._shader=new u.Shader({glProgram:u.GlProgram.from({vertex:Te,fragment:_e.replace("//include_textures",U.generate_gl_textures(this.max_textures))}),resources:{texture_uniforms:new u.UniformGroup(U.gl_gen_resources(this.max_textures),{isStatic:!0}),pipe_uniforms:this.pipe_uniforms.uniformStructures}})}}L(se,"extension",{type:[u.ExtensionType.WebGLPipesAdaptor],name:"tilemap"});var ge=Object.defineProperty,be=(i,e,t)=>e in i?ge(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,Y=(i,e,t)=>(be(i,typeof e!="symbol"?e+"":e,t),t);const xe=`
struct GlobalUniforms {
  uProjectionMatrix:mat3x3f,
  uWorldTransformMatrix:mat3x3f,
  uWorldColorAlpha: vec4f,
  uResolution: vec2f,
}

struct TilemapUniforms {
  u_proj_trans:mat3x3f,
  u_anim_frame:vec2f
}

@group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
@group(2) @binding(0) var<uniform> loc: TilemapUniforms;

struct VSOutput {
  @builtin(position) vPosition: vec4f,
  @location(0) @interpolate(flat) vTextureId : i32,
  @location(1) vTextureCoord : vec2f,
  @location(2) @interpolate(flat) vFrame : vec4f,
  @location(3) vAlpha : f32
};

@vertex
fn mainVert(
   @location(6) aVertexPosition: vec2f,
   @location(4) aTextureCoord: vec2f,
   @location(3) aFrame: vec4f,
   @location(1) aAnim: vec2f,
   @location(2) aAnimDivisor: f32,
   @location(5) aTextureId: i32,
   @location(0) aAlpha: f32,
 ) -> VSOutput {

  var vPosition = vec4((loc.u_proj_trans * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  var animCount = floor((aAnim + 0.5) / 2048.0);
  var animFrameOffset = aAnim - animCount * 2048.0;
  var currentFrame = floor(loc.u_anim_frame / aAnimDivisor);
  var loop_num = floor((currentFrame + 0.5) / animCount);
  var animOffset = animFrameOffset * floor(currentFrame - loop_num * animCount);
  var vTextureCoord = aTextureCoord + animOffset;
  var vFrame = aFrame + vec4(animOffset, animOffset);

  return VSOutput(vPosition, aTextureId, vTextureCoord, vFrame, aAlpha);
};
`,ye=`
//include_textures

@fragment
fn mainFrag(
  @location(0) @interpolate(flat) vTextureId : i32,
  @location(1) vTextureCoord : vec2f,
  @location(2) @interpolate(flat) vFrame : vec4f,
  @location(3) vAlpha : f32,
  ) -> @location(0) vec4f {
  var textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);
  var uv = textureCoord * taf.u_texture_size[vTextureId].zw;
  var dx = dpdx(uv);
  var dy = dpdy(uv);
  var color = sampleMultiTexture(vTextureId, uv, dx, dy);
  return color * vAlpha;
};
`;class ae extends N{constructor(){super(...arguments),Y(this,"_shader",null),Y(this,"max_textures",B.TEXTURES_PER_TILEMAP),Y(this,"bind_group",null)}destroy(){this._shader.destroy(!0),this._shader=null}execute(e,t){const r=e.renderer,s=this._shader;s.groups[0]=r.globalUniforms.bindGroup,s.groups[1]=t.getTileset().getBindGroup(),s.groups[2]=this.bind_group,r.encoder.draw({geometry:t.vb,shader:s,state:t.state,size:t.rects_count*6})}init(){this._shader=new u.Shader({gpuProgram:u.GpuProgram.from({vertex:{source:xe,entryPoint:"mainVert"},fragment:{source:ye.replace("//include_textures",U.generate_gpu_textures(this.max_textures))}})}),this.bind_group=new u.BindGroup({ut:this.pipe_uniforms})}}Y(ae,"extension",{type:[u.ExtensionType.WebGPUPipesAdaptor],name:"tilemap"});var Ae=Object.defineProperty,Pe=(i,e,t)=>e in i?Ae(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,m=(i,e,t)=>(Pe(i,typeof e!="symbol"?e+"":e,t),t),ne=(i=>(i[i.U=0]="U",i[i.V=1]="V",i[i.X=2]="X",i[i.Y=3]="Y",i[i.TILE_WIDTH=4]="TILE_WIDTH",i[i.TILE_HEIGHT=5]="TILE_HEIGHT",i[i.ROTATE=6]="ROTATE",i[i.ANIM_X=7]="ANIM_X",i[i.ANIM_Y=8]="ANIM_Y",i[i.TEXTURE_INDEX=9]="TEXTURE_INDEX",i[i.ANIM_COUNT_X=10]="ANIM_COUNT_X",i[i.ANIM_COUNT_Y=11]="ANIM_COUNT_Y",i[i.ANIM_DIVISOR=12]="ANIM_DIVISOR",i[i.ALPHA=13]="ALPHA",i))(ne||{});const x=Object.keys(ne).length/2;class k extends u.ViewContainer{constructor(e){super({}),m(this,"shadowColor",new Float32Array([0,0,0,.5])),m(this,"state",u.State.for2d()),m(this,"is_valid",!1),m(this,"renderPipeId","tilemap"),m(this,"canBundle",!0),m(this,"_instruction",{renderPipeId:"tilemap",tilemap:this}),m(this,"tileAnim",null),m(this,"rects_count",0),m(this,"compositeParent",!1),m(this,"tileset",new U(B.TEXTURES_PER_TILEMAP)),m(this,"tilemapBounds",new u.Bounds),m(this,"hasAnimatedTile",!1),m(this,"pointsBuf",[]),m(this,"batched"),m(this,"vbId",0),m(this,"vb",null),m(this,"vbBuffer",null),m(this,"vbArray",null),m(this,"vbInts",null),this.setTileset(e)}checkValid(){const e=this.tileset.count>0&&this.pointsBuf.length>0,t=this.is_valid!==e;return this.is_valid=e,t!==e}updateBounds(){const e=this.tilemapBounds;this._bounds.minX=e.minX,this._bounds.maxX=e.maxX,this._bounds.minY=e.minY,this._bounds.maxY=e.maxY}getTileset(){return this.tileset}setTileset(e=[]){var t,r;let s=this.tileset;if(e instanceof U)this.tileset=e,this.didViewUpdate=!0;else if(e instanceof u.TextureSource){if(s.count===1&&s.arr[0]===e)return this;s=this.tileset=new U(B.TEXTURES_PER_TILEMAP),s.push(e),this.didViewUpdate=!0}else{if(e.length===s.count){let n=!0;for(let l=0;l<e.length;l++)if(((t=e[l])==null?void 0:t.source)!==s.arr[l]){n=!1;break}if(n)return this}s=this.tileset=new U(B.TEXTURES_PER_TILEMAP);for(let n=0;n<e.length;n++)s.push((r=e[n])==null?void 0:r.source);this.didViewUpdate=!0}return this}clear(){return this.pointsBuf.length=0,this.rects_count=0,this.tilemapBounds.clear(),this.hasAnimatedTile=!1,this}tile(e,t,r,s={}){var n,l,h,a;this.didViewUpdate=!0;let c,o=-1,y=!1;if(typeof e=="number")o=e,y=!0,c=this.tileset.arr[o];else{let _;typeof e=="string"?_=u.Texture.from(e):_=e;const X=this.tileset;for(let w=0;w<X.count;w++)if(X.arr[w]===_.source){o=w;break}"frame"in _&&(s.u=(n=s.u)!=null?n:_.frame.x,s.v=(l=s.v)!=null?l:_.frame.y,s.tileWidth=(h=s.tileWidth)!=null?h:_.orig.width,s.tileHeight=(a=s.tileHeight)!=null?a:_.orig.height),c=_.source}if(!y&&!c)return console.error("The tile texture was not found in the tilemap tileset."),this;const{u:d=0,v:A=0,tileWidth:P=c.width,tileHeight:g=c.height,animX:b=0,animY:p=0,rotate:T=0,animCountX:f=1024,animCountY:H=1024,animDivisor:W=1,alpha:Q=1}=s,v=this.pointsBuf;return this.hasAnimatedTile=this.hasAnimatedTile||b>0||p>0,v.push(d),v.push(A),v.push(t),v.push(r),v.push(P),v.push(g),v.push(T),v.push(b|0),v.push(p|0),v.push(o),v.push(f),v.push(H),v.push(W),v.push(Q),this.tilemapBounds.addFrame(t,r,t+P,r+g),this}tileRotate(e){const t=this.pointsBuf;t[t.length-(x-9)]=e}tileAnimX(e,t){const r=this.pointsBuf;r[r.length-(x-7)]=e,r[r.length-(x-10)]=t}tileAnimY(e,t){const r=this.pointsBuf;r[r.length-(x-8)]=e,r[r.length-(x-11)]=t}tileAnimDivisor(e){const t=this.pointsBuf;t[t.length-(x-12)]=e}tileAlpha(e){const t=this.pointsBuf;t[t.length-(x-13)]=e}destroyVb(){this.vb&&(this.vb.destroy(),this.vb=null)}updateBuffer(e){const t=this.pointsBuf,r=t.length/x;let s=this.vb;if(this.tileset.count===0||r===0||this.rects_count===r&&s)return;this.rects_count=r,s||(s=e.createVb(),this.vb=s,this.vbId=s.id,this.vbBuffer=null);const n=r*s.vertPerQuad;e.checkIndexBuffer(r);const l=s.getBuffer("aVertexPosition"),h=s.stride*n;if(!this.vbBuffer||this.vbBuffer.byteLength<h){let d=s.stride;for(;d<h;)d*=2;this.vbBuffer=new ArrayBuffer(d),this.vbArray=new Float32Array(this.vbBuffer),this.vbInts=new Uint32Array(this.vbBuffer)}const a=this.vbArray,c=this.vbInts;let o=0,y=0;for(let d=0;d<t.length;d+=x){this.compositeParent&&(y=t[d+9]);const A=t[d+2],P=t[d+3],g=t[d+4],b=t[d+5],p=t[d+0],T=t[d+1];let f=t[d+6];const H=t[d+7],W=t[d+8],Q=t[d+10]||1024,v=t[d+11]||1024,_=H+Q*2048,X=W+v*2048,w=t[d+12],z=t[d+13];let Z,q,J,K,j,ee,te,re;if(f===0)Z=p,q=T,J=p+g,K=T,j=p+g,ee=T+b,te=p,re=T+b;else{let F=g/2,O=b/2;f%4!==0&&(F=b/2,O=g/2);const V=p+F,G=T+O;f=u.groupD8.add(f,u.groupD8.NW),Z=V+F*u.groupD8.uX(f),q=G+O*u.groupD8.uY(f),f=u.groupD8.add(f,2),J=V+F*u.groupD8.uX(f),K=G+O*u.groupD8.uY(f),f=u.groupD8.add(f,2),j=V+F*u.groupD8.uX(f),ee=G+O*u.groupD8.uY(f),f=u.groupD8.add(f,2),te=V+F*u.groupD8.uX(f),re=G+O*u.groupD8.uY(f)}a[o++]=A,a[o++]=P,a[o++]=Z,a[o++]=q,a[o++]=p+.5,a[o++]=T+.5,a[o++]=p+g-.5,a[o++]=T+b-.5,a[o++]=_,a[o++]=X,c[o++]=y,a[o++]=w,a[o++]=z,a[o++]=A+g,a[o++]=P,a[o++]=J,a[o++]=K,a[o++]=p+.5,a[o++]=T+.5,a[o++]=p+g-.5,a[o++]=T+b-.5,a[o++]=_,a[o++]=X,c[o++]=y,a[o++]=w,a[o++]=z,a[o++]=A+g,a[o++]=P+b,a[o++]=j,a[o++]=ee,a[o++]=p+.5,a[o++]=T+.5,a[o++]=p+g-.5,a[o++]=T+b-.5,a[o++]=_,a[o++]=X,c[o++]=y,a[o++]=w,a[o++]=z,a[o++]=A,a[o++]=P+b,a[o++]=te,a[o++]=re,a[o++]=p+.5,a[o++]=T+.5,a[o++]=p+g-.5,a[o++]=T+b-.5,a[o++]=_,a[o++]=X,c[o++]=y,a[o++]=w,a[o++]=z}l.data=a}isModified(e){return!!(this.rects_count*x!==this.pointsBuf.length||e&&this.hasAnimatedTile)}clearModify(){this.rects_count=this.pointsBuf.length/x}addBounds(e){const t=this.tilemapBounds;e.addFrame(t.minX,t.minY,t.maxX,t.maxY)}get bounds(){return this.tilemapBounds}destroy(e){super.destroy(e),this.destroyVb()}addFrame(e,t,r,s,n){return this.tile(e,t,r,{animX:s,animY:n}),!0}addRect(e,t,r,s,n,l,h,a=0,c=0,o=0,y=1024,d=1024,A=1,P=1){return this.tile(e,s,n,{u:t,v:r,tileWidth:l,tileHeight:h,animX:a,animY:c,rotate:o,animCountX:y,animCountY:d,animDivisor:A,alpha:P})}}var Ie=Object.defineProperty,Me=(i,e,t)=>e in i?Ie(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,R=(i,e,t)=>(Me(i,typeof e!="symbol"?e+"":e,t),t);class Be extends u.Container{constructor(e){super(),R(this,"texturesPerTilemap"),R(this,"tileAnim",null),R(this,"lastModifiedTilemap",null),R(this,"modificationMarker",0),R(this,"setBitmaps",this.tileset),this.texturesPerTilemap=B.TEXTURES_PER_TILEMAP,this.tileset(e)}tileset(e){e||(e=[]);const t=this.texturesPerTilemap,r=this.children.length,s=Math.ceil(e.length/t);for(let n=0;n<Math.min(r,s);n++)this.children[n].setTileset(e.slice(n*t,(n+1)*t));for(let n=r;n<s;n++){const l=new k(e.slice(n*t,(n+1)*t));l.compositeParent=!0,this.addChild(l)}return this}clear(){for(let e=0;e<this.children.length;e++)this.children[e].clear();return this.modificationMarker=0,this}tileRotate(e){return this.lastModifiedTilemap&&this.lastModifiedTilemap.tileRotate(e),this}tileAnimX(e,t){return this.lastModifiedTilemap&&this.lastModifiedTilemap.tileAnimX(e,t),this}tileAnimY(e,t){return this.lastModifiedTilemap&&this.lastModifiedTilemap.tileAnimY(e,t),this}tileAnimDivisor(e){return this.lastModifiedTilemap&&this.lastModifiedTilemap.tileAnimDivisor(e),this}tile(e,t,r,s={}){let n=null;const l=this.children;if(this.lastModifiedTilemap=null,typeof e=="number"){const h=e/this.texturesPerTilemap>>0;let a=0;if(n=l[h],n)a=e%this.texturesPerTilemap;else{if(n=l[0],!n)return this;a=0}n.tile(a,t,r,s)}else{typeof e=="string"&&(e=u.Texture.from(e));for(let h=0;h<l.length;h++){const a=l[h],c=a.getTileset().arr;for(let o=0;o<c.length;o++)if(c[o]===e.source){n=a;break}if(n)break}if(!n){for(let h=l.length-1;h>=0;h--){const a=l[h];if(a.getTileset().count<this.texturesPerTilemap){n=a,a.getTileset().push(e.source);break}}n||(n=new k(e.source),n.compositeParent=!0,this.addChild(n))}n.tile(e,t,r,s)}return this.lastModifiedTilemap=n,this}isModified(e){const t=this.children;if(this.modificationMarker!==t.length)return!0;for(let r=0;r<t.length;r++)if(t[r].isModified(e))return!0;return!1}clearModify(){const e=this.children;this.modificationMarker=e.length;for(let t=0;t<e.length;t++)e[t].clearModify()}addFrame(e,t,r,s,n,l,h,a,c){return this.tile(e,t,r,{animX:s,animY:n,animCountX:l,animCountY:h,animDivisor:a,alpha:c})}addRect(e,t,r,s,n,l,h,a,c,o,y,d){const A=e/this.texturesPerTilemap>>0,P=e%this.texturesPerTilemap;return this.children[A]&&this.children[A].getTileset().count>0?(this.lastModifiedTilemap=this.children[A],this.lastModifiedTilemap.addRect(P,t,r,s,n,l,h,a,c,o,y,d)):this.lastModifiedTilemap=null,this}get texPerChild(){return this.texturesPerTilemap}}return u.extensions.add($),u.extensions.add(se),u.extensions.add(ae),M.CompositeTilemap=Be,M.Constant=oe,M.POINT_STRUCT_SIZE=x,M.Tilemap=k,M.TilemapAdaptor=N,M.TilemapGeometry=ie,M.TilemapPipe=$,M.settings=B,M}({},PIXI);
//# sourceMappingURL=pixi-tilemap.js.map
