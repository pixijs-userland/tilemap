/*!
 * @pixi/tilemap - v5.0.2
 * Compiled Mon, 14 Jul 2025 00:24:17 UTC
 *
 * @pixi/tilemap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2025, Ivan Popelyshev, All Rights Reserved
 */import{Geometry as me,Buffer as ee,BufferUsage as R,UniformGroup as te,Matrix as pe,NOOP as ve,ExtensionType as $,Texture as ie,BindGroup as ue,Shader as le,GlProgram as _e,GpuProgram as xe,ViewContainer as Te,State as be,Bounds as ge,TextureSource as ye,groupD8 as b,Container as Ae,extensions as re}from"pixi.js";const w={TEXTURES_PER_TILEMAP:16,TEXTILE_SCALE_MODE:"linear",use32bitIndex:!1},Pe=w;var Ie=Object.defineProperty,Me=(r,e,t)=>e in r?Ie(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,C=(r,e,t)=>(Me(r,typeof e!="symbol"?e+"":e,t),t);const U=class Y extends me{constructor(e){const t=new ee({data:new Float32Array(2),label:"tilemap-buffer",usage:R.VERTEX|R.COPY_DST,shrinkToFit:!1}),i=Y.stride;super({indexBuffer:e,attributes:{aVertexPosition:{buffer:t,format:"float32x2",stride:i,offset:0},aTextureCoord:{buffer:t,format:"float32x2",stride:i,offset:2*4},aFrame:{buffer:t,format:"float32x4",stride:i,offset:4*4},aAnim:{buffer:t,format:"float32x2",stride:i,offset:8*4},aTextureId:{buffer:t,format:"sint32",stride:i,offset:10*4},aAnimDivisor:{buffer:t,format:"float32",stride:i,offset:11*4},aAlpha:{buffer:t,format:"float32",stride:i,offset:12*4}}}),C(this,"lastTimeAccess",0),C(this,"vertSize",Y.vertSize),C(this,"vertPerQuad",Y.vertPerQuad),C(this,"stride",Y.stride),C(this,"buf"),this.buf=t}};C(U,"vertSize",13),C(U,"vertPerQuad",4),C(U,"stride",U.vertSize*4);let he=U;var we=Object.defineProperty,Ce=(r,e,t)=>e in r?we(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,E=(r,e,t)=>(Ce(r,typeof e!="symbol"?e+"":e,t),t);class se{constructor(){E(this,"pipe_uniforms",new te({u_proj_trans:{value:new pe,type:"mat3x3<f32>"},u_anim_frame:{value:new Float32Array(2),type:"vec2<f32>"}}))}}class ae{constructor(e,t){E(this,"renderer"),E(this,"tileAnim",[0,0]),E(this,"ibLen",0),E(this,"indexBuffer",null),E(this,"shader"),E(this,"adaptor"),this.renderer=e,this.adaptor=t,this.adaptor.init(),this.indexBuffer=new ee({data:new Uint16Array([0,1,2,0,2,3]),label:"index-tilemap-buffer",usage:R.INDEX|R.COPY_DST}),this.indexBuffer.destroy=ve,this.checkIndexBuffer(2e3)}start(){}createVb(){const e=new he(this.indexBuffer);return e.lastTimeAccess=Date.now(),e}getShader(){return this.shader}destroy(){this.shader=null}checkIndexBuffer(e){const t=e*6;if(t<=this.ibLen)return;let i=t;for(;i<t;)i<<=1;this.ibLen=t,this.indexBuffer.data=Ee(e,w.use32bitIndex?new Uint32Array(t):new Uint16Array(t))}destroyRenderable(e){e.vb.destroy(!0),e.vb=null}addRenderable(e,t){const i=this.renderer.renderPipes.batch;e.updateBuffer(this),e.checkValid(),e.getTileset().update(),e.is_valid&&(i.break(t),t.add(e._instruction))}updateRenderable(e,t){e.updateBuffer(this),e.getTileset().update()}validateRenderable(e){return e.checkValid()}execute({tilemap:e}){if(!e.isRenderable)return;e.state.blendMode=e.groupBlendMode;const{pipe_uniforms:t}=this.adaptor,i=t.uniforms.u_proj_trans,s=this.renderer.globalUniforms._activeUniforms.at(-1).uniforms;let n=this.tileAnim;const{u_anim_frame:u}=t.uniforms;s.uProjectionMatrix.copyTo(i).append(s.uWorldTransformMatrix).append(e.worldTransform),e.compositeParent&&(n=e.parent.tileAnim||n),u[0]=n[0],u[1]=n[1],t.update(),this.adaptor.execute(this,e)}}E(ae,"extension",{type:[$.WebGLPipes,$.WebGPUPipes],name:"tilemap"});function Ee(r,e){const t=r*6;if(e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let i=0,s=0;i<t;i+=6,s+=4)e[i+0]=s+0,e[i+1]=s+1,e[i+2]=s+2,e[i+3]=s+0,e[i+4]=s+2,e[i+5]=s+3;return e}var Be=Object.defineProperty,Fe=(r,e,t)=>e in r?Be(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,I=(r,e,t)=>(Fe(r,typeof e!="symbol"?e+"":e,t),t);class F{constructor(e){I(this,"max_textures"),I(this,"arr",[]),I(this,"count",0),I(this,"dirty",!1),I(this,"dirty_gpu",!1),I(this,"bind_group",null),I(this,"bind_group_resources",{}),I(this,"tex_sizes",null),I(this,"null_color",new Float32Array([0,0,0,.5])),I(this,"tex_buf",null),this.max_textures=e,this.tex_sizes=new Float32Array(this.max_textures*4+4),this.tex_buf=new ee({usage:R.UNIFORM|R.COPY_DST})}get length(){return this.count}push(e){this.arr[this.count++]=e,this.dirty=!0}at(e){return this.arr[e]}update(){if(!this.dirty)return;this.dirty=!1,this.dirty_gpu=!0;const{tex_sizes:e,arr:t,count:i,max_textures:s,null_color:n}=this;for(let u=0;u<i;u++){const l=t[u];l&&(e[u*4]=l.pixelWidth,e[u*4+1]=l.pixelHeight,e[u*4+2]=1/l.pixelWidth,e[u*4+3]=1/l.pixelHeight)}e[s*4]=n[0],e[s*4+1]=n[1],e[s*4+2]=n[2],e[s*4+3]=n[3]}markDirty(){this.dirty=!0}getBindGroup(){if(this.update(),!this.dirty_gpu)return this.bind_group;const{bind_group_resources:e,max_textures:t,arr:i,count:s}=this;let n=0;e[n++]=new te({u_texture_size:{value:this.tex_sizes,type:"vec4<f32>",size:t},u_null_color:{value:this.null_color,type:"vec4<f32>"}});for(let u=0;u<t;u++){const l=(u<s?i[u]:null)||ie.EMPTY.source;e[n++]=l.source,e[n++]=l.style}return this.bind_group||(this.bind_group=new ue(e)),this.bind_group}static generate_gpu_textures(e){const t=[];t.push("struct TextureArrayFields {"),t.push(`    u_texture_size: array<vec4f, ${e}>,`),t.push("    u_null_color: vec4f"),t.push("}"),t.push("@group(1) @binding(0) var<uniform> taf: TextureArrayFields;");for(let i=0;i<e;i++)t.push(`@group(1) @binding(${i*2+1}) var u_texture_${i}: texture_2d<f32>;`),t.push(`@group(1) @binding(${i*2+2}) var u_sampler_${i}: sampler;`);t.push("fn sampleMultiTexture(texture_id: i32, uv: vec2f, dx: vec2f, dy: vec2f) -> vec4f {"),t.push("switch texture_id {");for(let i=0;i<e;i++)t.push(`  case ${i}: { return textureSampleGrad(u_texture_${i}, u_sampler_${i}, uv, dx, dy); }`);return t.push("  default: { return taf.u_null_color; }"),t.push("} }"),t.join(`
`)}static generate_gl_textures(e){const t=[];t.push(`uniform vec4 u_texture_size[${e+1}];`),t.push(`uniform sampler2D u_textures[${e}];`),t.push("uniform vec4 u_null_color;"),t.push("vec4 sampleMultiTexture(float texture_id, vec2 uv) {"),t.push(`if(texture_id < -0.5) return u_texture_size[${e}];`);for(let i=0;i<e;i++)t.push(`if(texture_id < ${i}.5) return texture(u_textures[${i}], uv * u_texture_size[${i}].zw);`);return t.push(`return u_texture_size[${e}];`),t.push("}"),t.join(`
`)}static gl_gen_resources(e){const t=[];for(let s=0;s<e;s++)t[s]=s;const i=[];for(let s=0;s<e;s++)i.push(2048),i.push(2048),i.push(1/2048),i.push(1/2048);return{u_textures:{value:t,type:"i32",size:e},u_texture_size:{value:i,type:"vec4<f32>",size:e}}}}var Xe=Object.defineProperty,Oe=(r,e,t)=>e in r?Xe(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,ne=(r,e,t)=>(Oe(r,typeof e!="symbol"?e+"":e,t),t);const Re=`
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
`,Ue=`
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
`;class de extends se{constructor(){super(...arguments),ne(this,"_shader",null),ne(this,"max_textures",w.TEXTURES_PER_TILEMAP)}destroy(){this._shader.destroy(!0),this._shader=null}execute(e,t){const i=e.renderer,s=this._shader,n=t.getTileset(),u=s.resources.texture_uniforms;u.uniforms.u_texture_size!==n.tex_sizes&&(u.uniforms.u_texture_size=n.tex_sizes,u.update());for(let l=0;l<n.length;l++)i.texture.bind(n.arr[l],l);i.encoder.draw({geometry:t.vb,shader:s,state:t.state,size:t.rects_count*6})}init(){this._shader=new le({glProgram:_e.from({vertex:Re,fragment:Ue.replace("//include_textures",F.generate_gl_textures(this.max_textures))}),resources:{texture_uniforms:new te(F.gl_gen_resources(this.max_textures),{isStatic:!0}),pipe_uniforms:this.pipe_uniforms.uniformStructures}})}}ne(de,"extension",{type:[$.WebGLPipesAdaptor],name:"tilemap"});var Se=Object.defineProperty,Ye=(r,e,t)=>e in r?Se(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,N=(r,e,t)=>(Ye(r,typeof e!="symbol"?e+"":e,t),t);const ze=`
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
`,Ve=`
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
`;class fe extends se{constructor(){super(...arguments),N(this,"_shader",null),N(this,"max_textures",w.TEXTURES_PER_TILEMAP),N(this,"bind_group",null)}destroy(){this._shader.destroy(!0),this._shader=null}execute(e,t){const i=e.renderer,s=this._shader;s.groups[0]=i.globalUniforms.bindGroup,s.groups[1]=t.getTileset().getBindGroup(),s.groups[2]=this.bind_group,i.encoder.draw({geometry:t.vb,shader:s,state:t.state,size:t.rects_count*6})}init(){this._shader=new le({gpuProgram:xe.from({vertex:{source:ze,entryPoint:"mainVert"},fragment:{source:Ve.replace("//include_textures",F.generate_gpu_textures(this.max_textures))}})}),this.bind_group=new ue({ut:this.pipe_uniforms})}}N(fe,"extension",{type:[$.WebGPUPipesAdaptor],name:"tilemap"});var De=Object.defineProperty,$e=(r,e,t)=>e in r?De(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,c=(r,e,t)=>($e(r,typeof e!="symbol"?e+"":e,t),t),ce=(r=>(r[r.U=0]="U",r[r.V=1]="V",r[r.X=2]="X",r[r.Y=3]="Y",r[r.TILE_WIDTH=4]="TILE_WIDTH",r[r.TILE_HEIGHT=5]="TILE_HEIGHT",r[r.ROTATE=6]="ROTATE",r[r.ANIM_X=7]="ANIM_X",r[r.ANIM_Y=8]="ANIM_Y",r[r.TEXTURE_INDEX=9]="TEXTURE_INDEX",r[r.ANIM_COUNT_X=10]="ANIM_COUNT_X",r[r.ANIM_COUNT_Y=11]="ANIM_COUNT_Y",r[r.ANIM_DIVISOR=12]="ANIM_DIVISOR",r[r.ALPHA=13]="ALPHA",r))(ce||{});const A=Object.keys(ce).length/2;class oe extends Te{constructor(e){super({}),c(this,"shadowColor",new Float32Array([0,0,0,.5])),c(this,"state",be.for2d()),c(this,"is_valid",!1),c(this,"renderPipeId","tilemap"),c(this,"canBundle",!0),c(this,"_instruction",{renderPipeId:"tilemap",tilemap:this}),c(this,"tileAnim",null),c(this,"rects_count",0),c(this,"compositeParent",!1),c(this,"tileset",new F(w.TEXTURES_PER_TILEMAP)),c(this,"tilemapBounds",new ge),c(this,"hasAnimatedTile",!1),c(this,"pointsBuf",[]),c(this,"batched"),c(this,"vbId",0),c(this,"vb",null),c(this,"vbBuffer",null),c(this,"vbArray",null),c(this,"vbInts",null),this.setTileset(e)}checkValid(){const e=this.tileset.count>0&&this.pointsBuf.length>0,t=this.is_valid!==e;return this.is_valid=e,t!==e}updateBounds(){const e=this.tilemapBounds;this._bounds.minX=e.minX,this._bounds.maxX=e.maxX,this._bounds.minY=e.minY,this._bounds.maxY=e.maxY}getTileset(){return this.tileset}setTileset(e=[]){var t,i;let s=this.tileset;if(e instanceof F)this.tileset=e,this.didViewUpdate=!0;else if(e instanceof ye){if(s.count===1&&s.arr[0]===e)return this;s=this.tileset=new F(w.TEXTURES_PER_TILEMAP),s.push(e),this.didViewUpdate=!0}else{if(e.length===s.count){let n=!0;for(let u=0;u<e.length;u++)if(((t=e[u])==null?void 0:t.source)!==s.arr[u]){n=!1;break}if(n)return this}s=this.tileset=new F(w.TEXTURES_PER_TILEMAP);for(let n=0;n<e.length;n++)s.push((i=e[n])==null?void 0:i.source);this.didViewUpdate=!0}return this}clear(){return this.pointsBuf.length=0,this.rects_count=0,this.tilemapBounds.clear(),this.hasAnimatedTile=!1,this}tile(e,t,i,s={}){var n,u,l,a;this.didViewUpdate=!0;let f,o=-1,g=!1;if(typeof e=="number")o=e,g=!0,f=this.tileset.arr[o];else{let _;typeof e=="string"?_=ie.from(e):_=e;const B=this.tileset;for(let M=0;M<B.count;M++)if(B.arr[M]===_.source){o=M;break}"frame"in _&&(s.u=(n=s.u)!=null?n:_.frame.x,s.v=(u=s.v)!=null?u:_.frame.y,s.tileWidth=(l=s.tileWidth)!=null?l:_.orig.width,s.tileHeight=(a=s.tileHeight)!=null?a:_.orig.height),f=_.source}if(!g&&!f)return console.error("The tile texture was not found in the tilemap tileset."),this;const{u:h=0,v:y=0,tileWidth:P=f.width,tileHeight:x=f.height,animX:T=0,animY:m=0,rotate:v=0,animCountX:d=1024,animCountY:G=1024,animDivisor:L=1,alpha:k=1}=s,p=this.pointsBuf;return this.hasAnimatedTile=this.hasAnimatedTile||T>0||m>0,p.push(h),p.push(y),p.push(t),p.push(i),p.push(P),p.push(x),p.push(v),p.push(T|0),p.push(m|0),p.push(o),p.push(d),p.push(G),p.push(L),p.push(k),this.tilemapBounds.addFrame(t,i,t+P,i+x),this}tileRotate(e){const t=this.pointsBuf;t[t.length-(A-9)]=e}tileAnimX(e,t){const i=this.pointsBuf;i[i.length-(A-7)]=e,i[i.length-(A-10)]=t}tileAnimY(e,t){const i=this.pointsBuf;i[i.length-(A-8)]=e,i[i.length-(A-11)]=t}tileAnimDivisor(e){const t=this.pointsBuf;t[t.length-(A-12)]=e}tileAlpha(e){const t=this.pointsBuf;t[t.length-(A-13)]=e}destroyVb(){this.vb&&(this.vb.destroy(),this.vb=null)}updateBuffer(e){const t=this.pointsBuf,i=t.length/A;let s=this.vb;if(this.tileset.count===0||i===0||this.rects_count===i&&s)return;this.rects_count=i,s||(s=e.createVb(),this.vb=s,this.vbId=s.id,this.vbBuffer=null);const n=i*s.vertPerQuad;e.checkIndexBuffer(i);const u=s.getBuffer("aVertexPosition"),l=s.stride*n;if(!this.vbBuffer||this.vbBuffer.byteLength<l){let h=s.stride;for(;h<l;)h*=2;this.vbBuffer=new ArrayBuffer(h),this.vbArray=new Float32Array(this.vbBuffer),this.vbInts=new Uint32Array(this.vbBuffer)}const a=this.vbArray,f=this.vbInts;let o=0,g=0;for(let h=0;h<t.length;h+=A){this.compositeParent&&(g=t[h+9]);const y=t[h+2],P=t[h+3],x=t[h+4],T=t[h+5],m=t[h+0],v=t[h+1];let d=t[h+6];const G=t[h+7],L=t[h+8],k=t[h+10]||1024,p=t[h+11]||1024,_=G+k*2048,B=L+p*2048,M=t[h+12],z=t[h+13];let j,H,W,Q,Z,q,J,K;if(d===0)j=m,H=v,W=m+x,Q=v,Z=m+x,q=v+T,J=m,K=v+T;else{let X=x/2,O=T/2;d%4!==0&&(X=T/2,O=x/2);const V=m+X,D=v+O;d=b.add(d,b.NW),j=V+X*b.uX(d),H=D+O*b.uY(d),d=b.add(d,2),W=V+X*b.uX(d),Q=D+O*b.uY(d),d=b.add(d,2),Z=V+X*b.uX(d),q=D+O*b.uY(d),d=b.add(d,2),J=V+X*b.uX(d),K=D+O*b.uY(d)}a[o++]=y,a[o++]=P,a[o++]=j,a[o++]=H,a[o++]=m+.5,a[o++]=v+.5,a[o++]=m+x-.5,a[o++]=v+T-.5,a[o++]=_,a[o++]=B,f[o++]=g,a[o++]=M,a[o++]=z,a[o++]=y+x,a[o++]=P,a[o++]=W,a[o++]=Q,a[o++]=m+.5,a[o++]=v+.5,a[o++]=m+x-.5,a[o++]=v+T-.5,a[o++]=_,a[o++]=B,f[o++]=g,a[o++]=M,a[o++]=z,a[o++]=y+x,a[o++]=P+T,a[o++]=Z,a[o++]=q,a[o++]=m+.5,a[o++]=v+.5,a[o++]=m+x-.5,a[o++]=v+T-.5,a[o++]=_,a[o++]=B,f[o++]=g,a[o++]=M,a[o++]=z,a[o++]=y,a[o++]=P+T,a[o++]=J,a[o++]=K,a[o++]=m+.5,a[o++]=v+.5,a[o++]=m+x-.5,a[o++]=v+T-.5,a[o++]=_,a[o++]=B,f[o++]=g,a[o++]=M,a[o++]=z}u.data=a}isModified(e){return!!(this.rects_count*A!==this.pointsBuf.length||e&&this.hasAnimatedTile)}clearModify(){this.rects_count=this.pointsBuf.length/A}addBounds(e){const t=this.tilemapBounds;e.addFrame(t.minX,t.minY,t.maxX,t.maxY)}get bounds(){return this.tilemapBounds}destroy(e){super.destroy(e),this.destroyVb()}addFrame(e,t,i,s,n){return this.tile(e,t,i,{animX:s,animY:n}),!0}addRect(e,t,i,s,n,u,l,a=0,f=0,o=0,g=1024,h=1024,y=1,P=1){return this.tile(e,s,n,{u:t,v:i,tileWidth:u,tileHeight:l,animX:a,animY:f,rotate:o,animCountX:g,animCountY:h,animDivisor:y,alpha:P})}}var Ne=Object.defineProperty,Ge=(r,e,t)=>e in r?Ne(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,S=(r,e,t)=>(Ge(r,typeof e!="symbol"?e+"":e,t),t);class Le extends Ae{constructor(e){super(),S(this,"texturesPerTilemap"),S(this,"tileAnim",null),S(this,"lastModifiedTilemap",null),S(this,"modificationMarker",0),S(this,"setBitmaps",this.tileset),this.texturesPerTilemap=w.TEXTURES_PER_TILEMAP,this.tileset(e)}tileset(e){e||(e=[]);const t=this.texturesPerTilemap,i=this.children.length,s=Math.ceil(e.length/t);for(let n=0;n<Math.min(i,s);n++)this.children[n].setTileset(e.slice(n*t,(n+1)*t));for(let n=i;n<s;n++){const u=new oe(e.slice(n*t,(n+1)*t));u.compositeParent=!0,this.addChild(u)}return this}clear(){for(let e=0;e<this.children.length;e++)this.children[e].clear();return this.modificationMarker=0,this}tileRotate(e){return this.lastModifiedTilemap&&this.lastModifiedTilemap.tileRotate(e),this}tileAnimX(e,t){return this.lastModifiedTilemap&&this.lastModifiedTilemap.tileAnimX(e,t),this}tileAnimY(e,t){return this.lastModifiedTilemap&&this.lastModifiedTilemap.tileAnimY(e,t),this}tileAnimDivisor(e){return this.lastModifiedTilemap&&this.lastModifiedTilemap.tileAnimDivisor(e),this}tile(e,t,i,s={}){let n=null;const u=this.children;if(this.lastModifiedTilemap=null,typeof e=="number"){const l=e/this.texturesPerTilemap>>0;let a=0;if(n=u[l],n)a=e%this.texturesPerTilemap;else{if(n=u[0],!n)return this;a=0}n.tile(a,t,i,s)}else{typeof e=="string"&&(e=ie.from(e));for(let l=0;l<u.length;l++){const a=u[l],f=a.getTileset().arr;for(let o=0;o<f.length;o++)if(f[o]===e.source){n=a;break}if(n)break}if(!n){for(let l=u.length-1;l>=0;l--){const a=u[l];if(a.getTileset().count<this.texturesPerTilemap){n=a,a.getTileset().push(e.source);break}}n||(n=new oe(e.source),n.compositeParent=!0,this.addChild(n))}n.tile(e,t,i,s)}return this.lastModifiedTilemap=n,this}isModified(e){const t=this.children;if(this.modificationMarker!==t.length)return!0;for(let i=0;i<t.length;i++)if(t[i].isModified(e))return!0;return!1}clearModify(){const e=this.children;this.modificationMarker=e.length;for(let t=0;t<e.length;t++)e[t].clearModify()}addFrame(e,t,i,s,n,u,l,a,f){return this.tile(e,t,i,{animX:s,animY:n,animCountX:u,animCountY:l,animDivisor:a,alpha:f})}addRect(e,t,i,s,n,u,l,a,f,o,g,h){const y=e/this.texturesPerTilemap>>0,P=e%this.texturesPerTilemap;return this.children[y]&&this.children[y].getTileset().count>0?(this.lastModifiedTilemap=this.children[y],this.lastModifiedTilemap.addRect(P,t,i,s,n,u,l,a,f,o,g,h)):this.lastModifiedTilemap=null,this}get texPerChild(){return this.texturesPerTilemap}}re.add(ae),re.add(de),re.add(fe);export{Le as CompositeTilemap,Pe as Constant,A as POINT_STRUCT_SIZE,oe as Tilemap,se as TilemapAdaptor,he as TilemapGeometry,ae as TilemapPipe,w as settings};
//# sourceMappingURL=pixi-tilemap.mjs.map
