var webArViewer=webArViewer||{};!function(e){webArViewer.scene=document.querySelector("a-scene");var t={C:{arNum:5},init:function(){this.setArg(),this.setArData()&&(this.setWrap(),this.createModel()),this.setSwitcher()},setArg:function(){for(var e=this,t={},r=location.search.substring(1).split("&"),a=0;r[a];a++){var i=r[a].split("=");t[i[0]]=decodeURIComponent(i[1])}var n=new Array(e.C.arNum).join("0");t.warpList=t.fw&&(n+parseInt(t.fw,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.shodowList=t.fs&&(n+parseInt(t.fs,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.poyoList=t.fp&&(n+parseInt(t.fp,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.decaList=t.fd&&(n+parseInt(t.fd,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.sizeList=t.wh&&(n+n+parseInt(t.wh,16).toString(10)).slice(-2*e.C.arNum).match(/.{2}/g).reverse(),e.arg=t},setArData:function(){var a=this,i=document.createElement("a-assets");i.setAttribute("timeout","9000");var n=new Array(a.C.arNum+1).join("0").split("");return n.some(function(e,t){return a.arg["i"+t]})?(n.forEach(function(e,t){if(n[t]={path:a.arg["i"+t]},n[t].isWarp=a.arg.warpList&&!!Number(a.arg.warpList[t]),n[t].isShadow=a.arg.shodowList&&!!Number(a.arg.shodowList[t]),n[t].isPoyo=a.arg.poyoList&&!!Number(a.arg.poyoList[t]),n[t].isDeca=a.arg.decaList&&!!Number(a.arg.decaList[t]),n[t].size=a.arg.sizeList?{w:.9*Number(a.arg.sizeList[t][0]),h:Number(a.arg.sizeList[t][1])}:{w:1.8,h:2},n[t].isDeca&&(n[t].size={w:10*n[t].size.w,h:10*n[t].size.h}),n[t].isGif=!!(a.arg["i"+t]||"").match(/\.gif$/i),a.arg["i"+t]){var r=document.createElement("img");r.setAttribute("crossorigin","anonymous"),r.setAttribute("id","source"+t),r.setAttribute("src",a.arg["i"+t]),i.appendChild(r)}}),webArViewer.scene.appendChild(i),a.arData=n,!0):(window.confirm("画像情報が1つも取得できませんでした。\nジェネレータで再度作り直してください。")&&(location.href="https://web-ar-generator.firebaseapp.com/"),!1)},setSwitcher:function(){var e=this,t=document.getElementById("swMarker"),r=document.getElementById("swGyro"),a=document.getElementById("swPreview"),i=document.getElementById("swHelp"),n=document.getElementById("helpContent");if(i.addEventListener("click",function(){n.classList.toggle("hide"),i.classList.toggle("current")}),!e.arData||location.pathname.match(/vr/))return!1;e.arg.preview?a.classList.add("current"):e.arg.gyro?r.classList.add("current"):t.classList.add("current"),t.addEventListener("click",function(){this.classList.contains("current")||(location.href=location.search.replace("&gyro=1","").replace("&preview=1",""))}),r.addEventListener("click",function(){this.classList.contains("current")||(location.href=location.search.replace("&preview=1","")+"&gyro=1")}),a.addEventListener("click",function(){this.classList.contains("current")||(location.href=location.search.replace("&gyro=1","")+"&preview=1")})},setWrap:function(){var e=this;if(location.pathname.match(/vr/)){var r=document.createElement("a-entity"),t=e.arg.vrPos?decodeURI(e.arg.vrPos):"0 0 -4";r.setAttribute("position",t)}else if(e.arg.preview){(r=document.createElement("a-entity")).setAttribute("position","0 0 -15"),r.setAttribute("rotation","25 0 0");document.querySelector("a-camera-static");var a,i=void 0!==document.ontouchstart,n=window.navigator.pointerEnabled,o=window.navigator.msPointerEnabled,s={start:n?"pointerdown":o?"MSPointerDown":i?"touchstart":"mousedown",move:n?"pointermove":o?"MSPointerMove":i?"touchmove":"mousemove",end:n?"pointerup":o?"MSPointerUp":i?"touchend":"mouseup",click:"click"},c=1;webArViewer.scene.addEventListener(s.start,function(e){var t=e.changedTouches?e.changedTouches[0]:e;a=t.pageY}),webArViewer.scene.addEventListener(s.move,function(e){var t=e.changedTouches?e.changedTouches[0]:e;a&&(c+=(t.pageY-a)/webArViewer.scene.clientHeight/5,AFRAME.utils.entity.setComponentProperty(r,"animation__scale",{property:"scale",dur:5,easing:"linear",loop:!1,to:c+" "+c+" "+c}))}),webArViewer.scene.addEventListener(s.end,function(e){a=null})}else if(e.arg.gyro){(r=document.createElement("a-entity")).setAttribute("position","0 -5 -8"),document.querySelector("a-camera-static").setAttribute("look-controls","look-controls")}else{if(e.arg.multi)return;(r=document.createElement("a-marker")).setAttribute("preset","custom"),r.setAttribute("type","pattern"),r.setAttribute("url","asset/ar0.patt")}e.wrap=r},createModel:function(){var d=this;d.arData.forEach(function(e,t){if(e.path)if(4!==t){if(t&&e.isShadow){var r=document.createElement("a-entity");r.setAttribute("position",AFRAME.utils.coordinates.stringify(d.positionVec3(t,"shadow"))),r.setAttribute("rotation","-90 0 0"),AFRAME.utils.entity.setComponentProperty(r,"geometry",{primitive:"plane",height:e.size.h,width:e.size.w}),AFRAME.utils.entity.setComponentProperty(r,"material",{shader:e.isGif?"gif":"flat",npot:!0,src:"#source"+t,transparent:!0,alphaTest:.1,color:"black",opacity:.3}),e.isPoyo&&(AFRAME.utils.entity.setComponentProperty(r,"animation__alpha",{property:"material.opacity",dir:"alternate",dur:400,easing:"easeInOutQuart",loop:!0,to:"0.1"}),AFRAME.utils.entity.setComponentProperty(r,"animation__scale",{property:"scale",dir:"alternate",dur:400,easing:"easeInOutQuart",loop:!0,to:"0.8 0.7 1"})),d.arData[t].shadow=r}var a=document.createElement("a-entity"),i=d.positionVec3(t,"main");if(a.setAttribute("position",AFRAME.utils.coordinates.stringify(i)),a.setAttribute("rotation",(0!==t||e.isWarp?0:-90)+" 0 0"),AFRAME.utils.entity.setComponentProperty(a,"material",{shader:e.isGif?"gif":0===t?"flat":"standard",npot:!0,src:"#source"+t,side:"double",transparent:!0,alphaTest:.1}),e.isWarp)if(t){var n,o;1!==t||d.arg.multi?(n=-32,o=64):(n=212,o=-64),AFRAME.utils.entity.setComponentProperty(a,"geometry",{primitive:"cylinder",openEnded:!0,thetaStart:n,thetaLength:o,height:e.size.h,radius:e.size.w})}else AFRAME.utils.entity.setComponentProperty(a,"geometry",{primitive:"sphere",radius:e.size.w/2,phiStart:-90});else AFRAME.utils.entity.setComponentProperty(a,"geometry",{primitive:"plane",height:e.size.h,width:e.size.w});e.isPoyo&&(AFRAME.utils.entity.setComponentProperty(a,"animation__pos",{property:"position",dir:"alternate",dur:400,easing:"easeInOutQuart",loop:!0,to:i.x+" "+(i.y+e.size.h/3)+" "+i.z}),AFRAME.utils.entity.setComponentProperty(a,"animation__scale",{property:"scale",dir:"alternate",dur:400,easing:"easeOutQuad",loop:!0,to:"0.94 1.06 1"})),0===t&&e.isShadow&&AFRAME.utils.entity.setComponentProperty(a,"animation__rot",{property:"rotation",dur:2e4,easing:"linear",loop:!0,to:(e.isWarp?0:-90)+" 360 0"}),d.arData[t].main=a}else{var s=document.createElement("a-sky");if(AFRAME.utils.entity.setComponentProperty(s,"material",{shader:e.isGif?"gif":"standard",src:"#source"+t,radius:e.isWarp?80:5e3}),e.isShadow&&AFRAME.utils.entity.setComponentProperty(s,"animation__rot",{property:"geometry.phiStart",dur:2e4,easing:"linear",loop:!0,to:-360}),webArViewer.scene.appendChild(s),e.isPoyo){var c=document.createElement("a-entity"),p=document.createElement("a-entity");c.setAttribute("light","type: hemisphere; color: #33F; groundColor: #BB3; intensity: 2"),p.setAttribute("light","type: directional; color: #FF3; intensity: 0.6"),p.setAttribute("position","-20 90 10"),webArViewer.scene.appendChild(c),webArViewer.scene.appendChild(p)}}}),d.arg.multi?(d.arData.forEach(function(e,t){if(e.path&&4!==t)if(d.arg.gyro||d.arg.preview){var r=document.createElement("a-entity");r.setAttribute("position",["0 0 0","2 0 -2.1","0 0 -2.3","-2 0 -2.2"][t]),d.arData[t].shadow&&r.appendChild(d.arData[t].shadow),d.arData[t].main&&r.appendChild(d.arData[t].main),d.wrap.appendChild(r)}else{var a=document.createElement("a-marker");a.setAttribute("preset","custom"),a.setAttribute("type","pattern"),a.setAttribute("url","asset/ar"+t+".patt"),d.arData[t].shadow&&a.appendChild(d.arData[t].shadow),d.arData[t].main&&a.appendChild(d.arData[t].main),webArViewer.scene.appendChild(a)}}),(d.arg.gyro||d.arg.preview)&&webArViewer.scene.appendChild(d.wrap)):(d.arData[0].main&&!d.arData[0].isWarp&&d.wrap.appendChild(d.arData[0].main),d.arData[1].shadow&&d.wrap.appendChild(d.arData[1].shadow),d.arData[2].shadow&&d.wrap.appendChild(d.arData[2].shadow),d.arData[3].shadow&&d.wrap.appendChild(d.arData[3].shadow),d.arData[1].main&&d.wrap.appendChild(d.arData[1].main),d.arData[2].main&&d.wrap.appendChild(d.arData[2].main),d.arData[0].main&&d.arData[0].isWarp&&d.wrap.appendChild(d.arData[0].main),d.arData[3].main&&d.wrap.appendChild(d.arData[3].main),webArViewer.scene.appendChild(d.wrap))},positionVec3:function(e,t){var r=this,a=r.arData[e].size.h/2,i=r.arData[e].size.w,n=r.arData[e].isWarp;return"shadow"===t?r.arg.multi?{x:0,y:0,z:-a}:{1:function(){return{x:0,y:.02,z:-r.arData[0].size.h/2-a}},2:function(){return{x:0,y:.07,z:-a-.04}},3:function(){return{x:0,y:.03,z:r.arData[0].size.h/2-a-.03}}}[e]():0===e?{x:0,y:n?i/2:-.03,z:0}:r.arg.multi?{x:0,y:a,z:-(n?i:0)}:{1:function(){return{x:0,y:a+.08,z:(n?i:0)-r.arData[0].size.h/2-.01}},2:function(){return{x:0,y:a+.04,z:-(n?i:0)}},3:function(){return{x:0,y:a,z:-(n?i:0)+r.arData[0].size.h/2+.01}}}[e]()}},r={cEle:null,videoDom:null,rLensTimer:null,init:function(){this.cEle=document.getElementById("rightlens"),this.cEle&&this.setEvents()},setEvents:function(){var r=this;webArViewer.scene.addEventListener("enter-vr",function(e){var t=r.cEle.getContext("2d");r.videoDom=document.querySelector("video"),r.videoDom.style.left="-20%",r.cEle.style.zIndex=-1,r.rLensTimer=setInterval(function(){r.cEle.width=r.videoDom.clientWidth,r.cEle.height=r.videoDom.clientHeight,r.cEle.style.marginTop=r.videoDom.style.marginTop,r.cEle.style.top=r.videoDom.style.top,t.drawImage(r.videoDom,r.videoDom.videoWidth/10,0,9*r.videoDom.videoWidth/10,r.videoDom.videoHeight,0,0,9*r.videoDom.videoWidth/10,r.videoDom.videoHeight)},1e3/60)}),webArViewer.scene.addEventListener("exit-vr",function(e){r.videoDom.style.left="0px",r.cEle.style.zIndex=-5,clearInterval(r.rLensTimer)})}};webArViewer.ar=t,webArViewer.vr=r,webArViewer.ar.init(),webArViewer.vr.init()}();