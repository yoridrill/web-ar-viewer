!function(a){var i={};function s(t){if(i[t])return i[t].exports;var e=i[t]={exports:{},id:t,loaded:!1};return a[t].call(e.exports,e,e.exports,s),e.loaded=!0,e.exports}s.m=a,s.c=i,s.p="",s(0)}([function(t,e,a){"use strict";var _="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},s=a(1);if("undefined"==typeof AFRAME)throw"Component attempted to register before AFRAME was available.";var h=AFRAME.utils.srcLoader.parseUrl,i=AFRAME.utils.debug;i.enable("shader:gif:warn");var r=i("shader:gif:warn"),n=i("shader:gif:debug"),c={};function u(t,e){return{status:"error",src:e,message:t,timestamp:Date.now()}}AFRAME.registerShader("gif",{schema:{color:{type:"color"},fog:{default:!0},metalness:{default:0},roughness:{default:.5},src:{default:null},autoplay:{default:!0}},init:function(t){return n("init",t),n(this.el.components),this.__cnv=document.createElement("canvas"),this.__cnv.width=2,this.__cnv.height=2,this.__ctx=this.__cnv.getContext("2d"),this.__texture=new THREE.Texture(this.__cnv),this.__material={},this.__reset(),this.material=new THREE.MeshStandardMaterial({map:this.__texture}),this.el.sceneEl.addBehavior(this),this.__addPublicFunctions(),this.material},update:function(t){return n("update",t),this.__updateMaterial(t),this.__updateTexture(t),this.material},tick:function(t){this.__frames&&!this.paused()&&Date.now()-this.__startTime>=this.__nextFrameTime&&this.nextFrame()},__updateMaterial:function(t){var e=this.material,a=this.__getMaterialData(t);Object.keys(a).forEach(function(t){e[t]=a[t]})},__getMaterialData:function(t){return{fog:t.fog,color:new THREE.Color(t.color),metalness:t.metalness,roughness:t.roughness}},__setTexure:function(t){n("__setTexure",t),"error"===t.status?(r("Error: "+t.message+"\nsrc: "+t.src),this.__reset()):"success"===t.status&&t.src!==this.__textureSrc&&(this.__reset(),this.__ready(t))},__updateTexture:function(t){var e=t.src,a=t.autoplay;"boolean"==typeof a?this.__autoplay=a:void 0===a&&(this.__autoplay=!0),this.__autoplay&&this.__frames&&this.play(),e?this.__validateSrc(e,this.__setTexure.bind(this)):this.__reset()},__validateSrc:function(t,e){var a=h(t);if(a)this.__getImageSrc(a,e);else{var i=void 0,s=this.__validateAndGetQuerySelector(t);if(s&&"object"===(void 0===s?"undefined":_(s))){if(s.error)i=s.error;else{var r=s.tagName.toLowerCase();if("video"===r)t=s.src,i="For video, please use `aframe-video-shader`";else{if("img"===r)return void this.__getImageSrc(s.src,e);i="For <"+r+"> element, please use `aframe-html-shader`"}}var n,o;i&&(n=c[t],o=u(i,t),n&&n.callbacks?n.callbacks.forEach(function(t){return t(o)}):e(o),c[t]=o)}}},__getImageSrc:function(r,t){var e=this;if(r!==this.__textureSrc){var n=c[r];if(n&&n.callbacks){if(n.src)return void t(n);if(n.callbacks)return void n.callbacks.push(t)}else(n=c[r]={callbacks:[]}).callbacks.push(t);var a=new Image;a.crossOrigin="Anonymous",a.addEventListener("load",function(t){e.__getUnit8Array(r,function(t){t?(0,s.parseGIF)(t,function(t,e,a,i){var s={status:"success",src:r,times:t,cnt:e,frames:a,compactFlg:i,timestamp:Date.now()};n.callbacks&&(n.callbacks.forEach(function(t){return t(s)}),c[r]=s)},function(t){return i(t)}):i("This is not gif. Please use `shader:flat` instead")})}),a.addEventListener("error",function(t){return i("Could be the following issue\n - Not Image\n - Not Found\n - Server Error\n - Cross-Origin Issue")}),a.src=r}function i(t){var e=u(t,r);n.callbacks&&(n.callbacks.forEach(function(t){return t(e)}),c[r]=e)}},__getUnit8Array:function(t,r){if("function"==typeof r){var e=new XMLHttpRequest;e.open("GET",t),e.responseType="arraybuffer",e.addEventListener("load",function(t){for(var e=new Uint8Array(t.target.response),a=e.subarray(0,4),i="",s=0;s<a.length;s++)i+=a[s].toString(16);"47494638"===i?r(e):r()}),e.addEventListener("error",function(t){n(t),r()}),e.send()}},__validateAndGetQuerySelector:function(t){try{var e=document.querySelector(t);return e||{error:"No element was found matching the selector"}}catch(t){return{error:"no valid selector"}}},__addPublicFunctions:function(){this.el.gif={play:this.play.bind(this),pause:this.pause.bind(this),togglePlayback:this.togglePlayback.bind(this),paused:this.paused.bind(this),nextFrame:this.nextFrame.bind(this)}},pause:function(){n("pause"),this.__paused=!0},play:function(){n("play"),this.__paused=!1},togglePlayback:function(){this.paused()?this.play():this.pause()},paused:function(){return this.__paused},nextFrame:function(){for(this.__draw();Date.now()-this.__startTime>=this.__nextFrameTime;)this.__nextFrameTime+=this.__delayTimes[this.__frameIdx++],(this.__infinity||this.__loopCnt)&&this.__frameCnt<=this.__frameIdx&&(this.__frameIdx=0)},__clearCanvas:function(){this.__ctx.clearRect(0,0,this.__width,this.__height),this.__texture.needsUpdate=!0},__draw:function(){this.__compactFlg||this.__clearCanvas(),this.__ctx.drawImage(this.__frames[this.__frameIdx],0,0,this.__width,this.__height),this.__texture.needsUpdate=!0},__ready:function(t){var e=t.src,a=t.times,i=t.cnt,s=t.frames,r=t.compactFlg;n("__ready"),this.__textureSrc=e,this.__delayTimes=a,i?this.__loopCnt=i:this.__infinity=!0,this.__frames=s,this.__frameCnt=a.length,this.__compactFlg=r,this.__startTime=Date.now(),this.__width=THREE.Math.floorPowerOfTwo(s[0].width),this.__height=THREE.Math.floorPowerOfTwo(s[0].height),this.__cnv.width=this.__width,this.__cnv.height=this.__height,this.__draw(),this.__autoplay&&1<this.__frames.length?this.play():this.pause()},__reset:function(){this.pause(),this.__clearCanvas(),this.__startTime=0,this.__nextFrameTime=0,this.__frameIdx=0,this.__frameCnt=0,this.__delayTimes=null,this.__infinity=!1,this.__loopCnt=0,this.__frames=null,this.__compactFlg=!1,this.__textureSrc=null}})},function(t,e){"use strict";e.parseGIF=function(t,i,e){var a=0,s=[],r=0,n=null,o=null,_=[],h=!1,c=0;if(71!==t[0]||73!==t[1]||70!==t[2]||56!==t[3]||57!==t[4]&&55!==t[4]||97!==t[5])e&&e("parseGIF: no GIF89a");else{a+=+!!(128&t[10])*Math.pow(2,1+(7&t[10]))*3+13;for(var u=t.subarray(0,a);t[a]&&59!==t[a];){var l=a,f=t[a];if(33===f){var d=t[++a];if(-1===[1,254,249,255].indexOf(d)){e&&e("parseGIF: unknown label");break}for(249===d&&s.push(10*(t[a+3]+(t[a+4]<<8))),255===d&&(c=t[a+15]+(t[a+16]<<8));t[++a];)a+=t[a];249===d&&(n=t.subarray(l,a+1),h=!!t[a+2])}else{if(44!==f){e&&e("parseGIF: unknown blockId");break}for(a+=9,a+=+!!(128&t[a])*(3*Math.pow(2,1+(7&t[a])))+1;t[++a];)a+=t[a];o=t.subarray(l,a+1);_.push(URL.createObjectURL(new Blob([u,n,o])))}a++}}if(_.length){var m=document.createElement("canvas"),p=function a(t){var e=new Image;e.onload=function(t,e){r++,_[e]=this,r===_.length?(m=null,i&&i(s,c,_,h)):a(++e)}.bind(e),e.src=m.toDataURL("image/gif")};_.forEach(function(t,e){var a=new Image;a.onload=function(t,e){0===e&&(m.width=a.width,m.height=a.height),r++,_[e]=this,r===_.length&&(r=0,p(1))}.bind(a,null,e),a.src=t})}}}]);