!function(i){var a={};function r(t){if(a[t])return a[t].exports;var e=a[t]={exports:{},id:t,loaded:!1};return i[t].call(e.exports,e,e.exports,r),e.loaded=!0,e.exports}r.m=i,r.c=a,r.p="",r(0)}([function(t,e,i){"use strict";var _="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},n=i(1);if("undefined"==typeof AFRAME)throw"Component attempted to register before AFRAME was available.";var h=AFRAME.utils.srcLoader.parseUrl,a=AFRAME.utils.debug;a.enable("shader:gif:warn");var r=a("shader:gif:warn"),o=a("shader:gif:debug"),u={};function c(t,e){return{status:"error",src:e,message:t,timestamp:Date.now()}}AFRAME.registerShader("gif",{schema:{color:{type:"color"},fog:{default:!0},src:{default:null},autoplay:{default:!0}},init:function(t){return o("init",t),o(this.el.components),this.__cnv=document.createElement("canvas"),this.__cnv.width=2,this.__cnv.height=2,this.__ctx=this.__cnv.getContext("2d"),this.__texture=new THREE.Texture(this.__cnv),this.__material={},this.__reset(),this.material=new THREE.MeshBasicMaterial({map:this.__texture}),this.el.sceneEl.addBehavior(this),this.__addPublicFunctions(),this.material},update:function(t){return o("update",t),this.__updateMaterial(t),this.__updateTexture(t),this.material},tick:function(t){this.__frames&&!this.paused()&&Date.now()-this.__startTime>=this.__nextFrameTime&&this.nextFrame()},__updateMaterial:function(t){var e=this.material,i=this.__getMaterialData(t);Object.keys(i).forEach(function(t){e[t]=i[t]})},__getMaterialData:function(t){return{fog:t.fog,color:new THREE.Color(t.color)}},__setTexure:function(t){o("__setTexure",t),"error"===t.status?(r("Error: "+t.message+"\nsrc: "+t.src),this.__reset()):"success"===t.status&&t.src!==this.__textureSrc&&(this.__reset(),this.__ready(t))},__updateTexture:function(t){var e=t.src,i=t.autoplay;"boolean"==typeof i?this.__autoplay=i:void 0===i&&(this.__autoplay=!0),this.__autoplay&&this.__frames&&this.play(),e?this.__validateSrc(e,this.__setTexure.bind(this)):this.__reset()},__validateSrc:function(t,e){var i=h(t);if(i)this.__getImageSrc(i,e);else{var a=void 0,r=this.__validateAndGetQuerySelector(t);if(r&&"object"===(void 0===r?"undefined":_(r))){if(r.error)a=r.error;else{var s=r.tagName.toLowerCase();if("video"===s)t=r.src,a="For video, please use `aframe-video-shader`";else{if("img"===s)return void this.__getImageSrc(r.src,e);a="For <"+s+"> element, please use `aframe-html-shader`"}}var n,o;a&&(n=u[t],o=c(a,t),n&&n.callbacks?n.callbacks.forEach(function(t){return t(o)}):e(o),u[t]=o)}}},__getImageSrc:function(r,t){var e=this;if(r!==this.__textureSrc){var s=u[r];if(s&&s.callbacks){if(s.src)return void t(s);if(s.callbacks)return void s.callbacks.push(t)}else(s=u[r]={callbacks:[]}).callbacks.push(t);var i=new Image;i.crossOrigin="Anonymous",i.addEventListener("load",function(t){e.__getUnit8Array(r,function(t){t?(0,n.parseGIF)(t,function(t,e,i){var a={status:"success",src:r,times:t,cnt:e,frames:i,timestamp:Date.now()};s.callbacks&&(s.callbacks.forEach(function(t){return t(a)}),u[r]=a)},function(t){return a(t)}):a("This is not gif. Please use `shader:flat` instead")})}),i.addEventListener("error",function(t){return a("Could be the following issue\n - Not Image\n - Not Found\n - Server Error\n - Cross-Origin Issue")}),i.src=r}function a(t){var e=c(t,r);s.callbacks&&(s.callbacks.forEach(function(t){return t(e)}),u[r]=e)}},__getUnit8Array:function(t,s){if("function"==typeof s){var e=new XMLHttpRequest;e.open("GET",t),e.responseType="arraybuffer",e.addEventListener("load",function(t){for(var e=new Uint8Array(t.target.response),i=e.subarray(0,4),a="",r=0;r<i.length;r++)a+=i[r].toString(16);"47494638"===a?s(e):s()}),e.addEventListener("error",function(t){o(t),s()}),e.send()}},__validateAndGetQuerySelector:function(t){try{var e=document.querySelector(t);return e||{error:"No element was found matching the selector"}}catch(t){return{error:"no valid selector"}}},__addPublicFunctions:function(){this.el.gif={play:this.play.bind(this),pause:this.pause.bind(this),togglePlayback:this.togglePlayback.bind(this),paused:this.paused.bind(this),nextFrame:this.nextFrame.bind(this)}},pause:function(){o("pause"),this.__paused=!0},play:function(){o("play"),this.__paused=!1},togglePlayback:function(){this.paused()?this.play():this.pause()},paused:function(){return this.__paused},nextFrame:function(){for(this.__draw();Date.now()-this.__startTime>=this.__nextFrameTime;)this.__nextFrameTime+=this.__delayTimes[this.__frameIdx++],(this.__infinity||this.__loopCnt)&&this.__frameCnt<=this.__frameIdx&&(this.__frameIdx=0)},__clearCanvas:function(){this.__ctx.clearRect(0,0,this.__width,this.__height),this.__texture.needsUpdate=!0},__draw:function(){this.__clearCanvas(),this.__ctx.drawImage(this.__frames[this.__frameIdx],0,0,this.__width,this.__height),this.__texture.needsUpdate=!0},__ready:function(t){var e=t.src,i=t.times,a=t.cnt,r=t.frames;o("__ready"),this.__textureSrc=e,this.__delayTimes=i,a?this.__loopCnt=a:this.__infinity=!0,this.__frames=r,this.__frameCnt=i.length,this.__startTime=Date.now(),this.__width=THREE.Math.floorPowerOfTwo(r[0].width),this.__height=THREE.Math.floorPowerOfTwo(r[0].height),this.__cnv.width=this.__width,this.__cnv.height=this.__height,this.__draw(),this.__autoplay?this.play():this.pause()},__reset:function(){this.pause(),this.__clearCanvas(),this.__startTime=0,this.__nextFrameTime=0,this.__frameIdx=0,this.__frameCnt=0,this.__delayTimes=null,this.__infinity=!1,this.__loopCnt=0,this.__frames=null,this.__textureSrc=null}})},function(t,e){"use strict";e.parseGIF=function(t,a,e){var i=0,r=[],s=0,n=null,o=null,_=[],h=0;if(71===t[0]&&73===t[1]&&70===t[2]&&56===t[3]&&57===t[4]&&97===t[5]){i+=+!!(128&t[10])*Math.pow(2,1+(7&t[10]))*3+13;for(var u=t.subarray(0,i);t[i]&&59!==t[i];){var c=i,l=t[i];if(33===l){var f=t[++i];if(-1===[1,254,249,255].indexOf(f)){e&&e("parseGIF: unknown label");break}for(249===f&&r.push(10*(t[i+3]+(t[i+4]<<8))),255===f&&(h=t[i+15]+(t[i+16]<<8));t[++i];)i+=t[i];249===f&&(n=t.subarray(c,i+1))}else{if(44!==l){e&&e("parseGIF: unknown blockId");break}for(i+=9,i+=+!!(128&t[i])*(3*Math.pow(2,1+(7&t[i])))+1;t[++i];)i+=t[i];o=t.subarray(c,i+1);_.push(URL.createObjectURL(new Blob([u,n,o])))}i++}}else e&&e("parseGIF: no GIF89a");if(_.length){var d=document.createElement("canvas"),m=function i(t){var e=new Image;e.onload=function(t,e){s++,_[e]=this,s===_.length?(d=null,a&&a(r,h,_)):i(++e)}.bind(e),e.src=d.toDataURL("image/gif")};_.forEach(function(t,e){var i=new Image;i.onload=function(t,e){0===e&&(d.width=i.width,d.height=i.height),s++,_[e]=this,s===_.length&&(s=0,m(1))}.bind(i,null,e),i.src=t})}}}]);