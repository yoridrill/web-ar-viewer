var webArViewer=webArViewer||{};!function(e){webArViewer.scene=document.querySelector("a-scene");var t={C:{arNum:5},init:function(){if(this.setArg(),this.setArData()){this.setWrap(),this.createModel();var e={Touch:void 0!==document.ontouchstart,Pointer:window.navigator.pointerEnabled,MSPointer:window.navigator.msPointerEnabled};this.eventNames={start:e.Pointer?"pointerdown":e.MSPointer?"MSPointerDown":e.Touch?"touchstart":"mousedown",move:e.Pointer?"pointermove":e.MSPointer?"MSPointerMove":e.Touch?"touchmove":"mousemove",end:e.Pointer?"pointerup":e.MSPointer?"MSPointerUp":e.Touch?"touchend":"mouseup"},this.setScene(),this.setTapEvents()}this.setSwitcher()},setArg:function(){for(var e=this,t={},a=location.search.substring(1).split("&"),r=0;a[r];r++){var i=a[r].split("=");t[i[0]]=decodeURIComponent(i[1])}t.gyro&&!location.pathname.match("gyro")&&location.replace(location.pathname+"gyro.html"+location.search);var n=new Array(e.C.arNum).join("0");t.warpList=t.fw&&(n+parseInt(t.fw,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.shodowList=t.fs&&(n+parseInt(t.fs,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.poyoList=t.fp&&(n+parseInt(t.fp,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.kiraList=t.fk&&(n+parseInt(t.fk,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.turnList=t.ft&&(n+parseInt(t.ft,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.guniList=t.fg&&(n+parseInt(t.fg,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.decaList=t.fd&&(n+parseInt(t.fd,16).toString(2)).slice(-1*e.C.arNum).split("").reverse(),t.sizeList=t.wh&&(n+n+parseInt(t.wh,16).toString(10)).slice(-2*e.C.arNum).match(/.{2}/g).reverse(),e.arg=t},setArData:function(){var e=this,t=document.createElement("a-assets");t.setAttribute("timeout","9000");for(var a=new Array(e.C.arNum),r=0;r<e.C.arNum;r=r+1|0){var i={path:e.arg["i"+r]};if(i.map=e.arg["m"+r],i.tap=e.arg["t"+r],i.isWarp=e.arg.warpList&&!!Number(e.arg.warpList[r]),i.isShadow=e.arg.shodowList&&!!Number(e.arg.shodowList[r]),i.isPoyo=e.arg.poyoList&&!!Number(e.arg.poyoList[r]),i.isKira=e.arg.kiraList&&!!Number(e.arg.kiraList[r]),i.isTurn=e.arg.turnList&&!!Number(e.arg.turnList[r]),i.isGuni=e.arg.guniList&&!!Number(e.arg.guniList[r]),i.isDeca=e.arg.decaList&&!!Number(e.arg.decaList[r]),i.size=e.arg.sizeList?{w:.9*Number(e.arg.sizeList[r][0]),h:Number(e.arg.sizeList[r][1])}:{w:1.8,h:2},i.isDeca&&(i.size={w:10*i.size.w,h:10*i.size.h}),i.isGif=!!(e.arg["i"+r]||"").match(/\.gif$/i),i.hasMp4=!!(e.arg["t"+r]||"").match(/\.mp4$/i),i.path){var n=document.createElement("img");if(n.setAttribute("crossorigin","anonymous"),n.setAttribute("id","source"+r),n.setAttribute("src",i.path),t.appendChild(n),i.map){var s=document.createElement("img");s.setAttribute("crossorigin","anonymous"),s.setAttribute("id","map"+r),s.setAttribute("src",i.map),t.appendChild(s)}if(i.tap){if(e.tap=!0,i.hasMp4){var o=document.createElement("video");o.setAttribute("webkit-playsinline","true"),o.setAttribute("playsinline","true"),i.tapEl=o,i.keyColor=e.arg["kc"+r]?decodeURI(e.arg["kc"+r]):"0.1 0.9 0.2"}else var o=document.createElement("img");o.setAttribute("crossorigin","anonymous"),o.setAttribute("id","tap"+r),o.setAttribute("src",i.tap),t.appendChild(o)}}a[r]=i}return a.some(function(e){return e.path})?(webArViewer.scene.appendChild(t),e.arData=a,!0):(window.confirm("画像情報が1つも取得できませんでした。\nジェネレータで再度作り直してください。")&&(location.href="https://web-ar-generator.firebaseapp.com/"),!1)},setSwitcher:function(){var e=this,t=document.getElementById("swMarker"),a=document.getElementById("swGyro"),r=document.getElementById("swPreview"),i=document.getElementById("swHelp"),n=document.getElementById("helpContent"),s=document.getElementById("toggleCamera");if(i.addEventListener("click",function(){n.classList.toggle("show"),i.classList.toggle("current")}),!e.arData||location.pathname.match(/vr/))return!1;e.arg.preview?r.classList.add("current"):e.arg.gyro?a.classList.add("current"):t.classList.add("current"),t.addEventListener("click",function(){this.classList.contains("current")||location.replace(location.pathname.replace("gyro.html","")+location.search.replace("&gyro=1","").replace("&preview=1",""))}),a.addEventListener("click",function(){this.classList.contains("current")||location.replace("gyro.html"+location.search.replace("&preview=1","")+"&gyro=1")}),r.addEventListener("click",function(){this.classList.contains("current")||location.replace(location.pathname.replace("gyro.html","")+location.search.replace("&gyro=1","")+"&preview=1")}),s&&s.addEventListener("click",function(){location.pathname=location.pathname.match(/face/)?"":"/face/"})},setWrap:function(){var e=this;e.offsetPos=e.arg.offset?decodeURI(e.arg.offset):"0 0 0",e.wrap=document.createElement("a-entity"),e.wrap.setAttribute("position",e.offsetPos)},createModel:function(){for(var e=this,t=0;t<e.C.arNum;t=t+1|0){var a=e.arData[t];if(a.path)if(4!==t){if(t&&a.isShadow){var r=document.createElement("a-entity");r.setAttribute("position",AFRAME.utils.coordinates.stringify(e.positionVec3(t,"shadow"))),r.setAttribute("rotation","-90 0 0"),AFRAME.utils.entity.setComponentProperty(r,"geometry",{primitive:"plane",height:a.size.h,width:a.size.w}),AFRAME.utils.entity.setComponentProperty(r,"material",{shader:a.isGif?"gif":"flat",npot:!0,src:"#source"+t,transparent:!0,alphaTest:.1,color:"black",opacity:.3,depthTest:!1}),a.isPoyo&&(AFRAME.utils.entity.setComponentProperty(r,"animation__alpha",{property:"material.opacity",dir:"alternate",dur:400,easing:"easeInOutQuart",loop:!0,to:"0.1"}),AFRAME.utils.entity.setComponentProperty(r,"animation__scale",{property:"scale",dir:"alternate",dur:400,easing:"easeInOutQuart",loop:!0,to:"0.8 0.7 1"})),a.isTurn&&AFRAME.utils.entity.setComponentProperty(r,"animation__turn",{property:"scale",dir:"alternate",dur:100,loop:4,from:"1 1 1",to:"0.1 1 1",startEvents:"turn"}),a.isGuni&&(AFRAME.utils.entity.setComponentProperty(r,"animation__guni",{property:"scale",dur:600,easing:"easeOutBack",to:"1.3 0.95 1",startEvents:"guni"}),AFRAME.utils.entity.setComponentProperty(r,"animation__guniback",{property:"scale",dur:1e3,easing:"easeOutElastic",elasticity:600,from:"1.35 0.9 1",to:"1 1 1",startEvents:"guniback"})),e.arData[t].shadow=r}var i=document.createElement("a-entity"),n=e.positionVec3(t,"main");i.setAttribute("position",AFRAME.utils.coordinates.stringify(n)),i.setAttribute("rotation",(0!==t||a.isWarp?0:-90)+" 0 0");var s={shader:a.isGif?"gif":"standard",npot:!0,src:"#source"+t,side:"double",transparent:!0,alphaTest:.1,metalness:a.isKira?.1:0,roughness:a.isKira?.3:.5};if(a.map&&(s.displacementMap="#map"+t,s.displacementBias=-.5),AFRAME.utils.entity.setComponentProperty(i,"material",s),a.isWarp)if(t){var o,p;1!==t||e.arg.multi?(o=-32,p=64):(o=212,p=-64),AFRAME.utils.entity.setComponentProperty(i,"geometry",{primitive:"cylinder",openEnded:!0,thetaStart:o,thetaLength:p,height:a.size.h,radius:a.size.w,segmentsHeight:a.map?180:18,segmentsRadial:a.map?360:36})}else AFRAME.utils.entity.setComponentProperty(i,"geometry",{primitive:"sphere",radius:a.size.w/2,phiStart:-90,segmentsHeight:a.map?180:18,segmentsWidth:a.map?360:36});else AFRAME.utils.entity.setComponentProperty(i,"geometry",{primitive:"plane",height:a.size.h,width:a.size.w,segmentsHeight:a.map?180:1,segmentsWidth:a.map?180:1});a.isPoyo&&(AFRAME.utils.entity.setComponentProperty(i,"animation__pos",{property:"position",dir:"alternate",dur:400,easing:"easeInOutQuart",loop:!0,to:n.x+" "+(n.y+a.size.h/3)+" "+n.z}),AFRAME.utils.entity.setComponentProperty(i,"animation__scale",{property:"scale",dir:"alternate",dur:400,easing:"easeOutQuad",loop:!0,to:"0.94 1.06 1"})),0===t&&a.isShadow&&AFRAME.utils.entity.setComponentProperty(i,"animation__rot",{property:"rotation",dur:2e4,easing:"linear",loop:!0,to:(a.isWarp?0:-90)+" 360 0"}),a.isTurn&&(0===t&&a.isWarp?AFRAME.utils.entity.setComponentProperty(i,"animation__turn",{property:"rotation",dur:3e3,easing:"easeOutElastic",elasticity:300,from:"-90 0 0",to:"-90 0 360",startEvents:"turn"}):AFRAME.utils.entity.setComponentProperty(i,"animation__turn",{property:"rotation",dur:3e3,easing:"easeOutElastic",elasticity:300,from:"0 0 0",to:"0 360 0",startEvents:"turn"})),a.isGuni&&(AFRAME.utils.entity.setComponentProperty(i,"animation__guni",{property:"scale",dur:600,easing:"easeOutBack",to:"1.3 0.95 1",startEvents:"guni"}),AFRAME.utils.entity.setComponentProperty(i,"animation__guniback",{property:"scale",dur:1e3,easing:"easeOutElastic",elasticity:600,from:"1.35 0.9 1",to:"1 1 1",startEvents:"guniback"})),e.arData[t].main=i}else{var l=document.createElement("a-sky");if(AFRAME.utils.entity.setComponentProperty(l,"material",{shader:a.isGif?"gif":"standard",src:"#source"+t,radius:a.isWarp?80:5e3}),a.isShadow&&AFRAME.utils.entity.setComponentProperty(l,"animation__rot",{property:"geometry.phiStart",dur:2e4,easing:"linear",loop:!0,to:-360}),webArViewer.scene.appendChild(l),a.isPoyo){var c=document.createElement("a-entity"),u=document.createElement("a-entity");c.setAttribute("light","type: hemisphere; color: #33F; groundColor: #BB3; intensity: 2"),u.setAttribute("light","type: directional; color: #FF3; intensity: 0.6"),u.setAttribute("position","-20 90 10"),webArViewer.scene.appendChild(c),webArViewer.scene.appendChild(u)}}}},setScene:function(){var e=this;if(e.arg.multi){if(!e.arg.gyro&&!e.arg.preview){for(var t=0;t<e.C.arNum;t=t+1|0)if(e.arData[t].path&&4!==t){var a=document.createElement("a-marker");a.setAttribute("preset","custom"),a.setAttribute("type","pattern"),a.setAttribute("url","https://yoridrill.github.io/web-ar-viewer/asset/ar"+t+".patt"),e.arData[t].shadow&&a.appendChild(e.arData[t].shadow),e.arData[t].main&&a.appendChild(e.arData[t].main),webArViewer.scene.appendChild(a)}return}for(var t=0;t<e.C.arNum;t=t+1|0)if(e.arData[t].path&&4!==t){var r=document.createElement("a-entity");r.setAttribute("position",["0 0 0","2 0 -2.1","0 0 -2.3","-2 0 -2.2"][t]),e.arData[t].shadow&&r.appendChild(e.arData[t].shadow),e.arData[t].main&&r.appendChild(e.arData[t].main),e.wrap.appendChild(r)}}else e.arData[0].main&&!e.arData[0].isWarp&&e.wrap.appendChild(e.arData[0].main),e.arData[1].shadow&&e.wrap.appendChild(e.arData[1].shadow),e.arData[2].shadow&&e.wrap.appendChild(e.arData[2].shadow),e.arData[3].shadow&&e.wrap.appendChild(e.arData[3].shadow),e.arData[1].main&&e.wrap.appendChild(e.arData[1].main),e.arData[2].main&&e.wrap.appendChild(e.arData[2].main),e.arData[0].main&&e.arData[0].isWarp&&e.wrap.appendChild(e.arData[0].main),e.arData[3].main&&e.wrap.appendChild(e.arData[3].main);if(location.pathname.match(/vr/)){var i=e.arg.vrPos?decodeURI(e.arg.vrPos):"0 0 -4";e.wrap.setAttribute("position",i)}else if(e.arg.preview){var n=AFRAME.utils.coordinates.parse(e.offsetPos);n.z-=15,e.wrap.setAttribute("position",AFRAME.utils.coordinates.stringify(n)),e.wrap.setAttribute("rotation","25 0 0");var s,o=1;webArViewer.scene.addEventListener(e.eventNames.start,function(e){var t=e.changedTouches?e.changedTouches[0]:e;s=t.pageY}),webArViewer.scene.addEventListener(e.eventNames.move,function(t){var a=t.changedTouches?t.changedTouches[0]:t;s&&(o+=(a.pageY-s)/webArViewer.scene.clientHeight/5,AFRAME.utils.entity.setComponentProperty(e.wrap,"animation__scale",{property:"scale",dur:5,easing:"linear",loop:!1,to:o+" "+o+" "+o}))}),webArViewer.scene.addEventListener(e.eventNames.end,function(e){s=null})}else if(e.arg.gyro){var p=document.querySelector("a-camera-static");p.setAttribute("look-controls","true");var n=AFRAME.utils.coordinates.parse(e.offsetPos);n.y-=5,n.z-=8,e.wrap.setAttribute("position",AFRAME.utils.coordinates.stringify(n))}else if(!e.arg.multi){var l=document.createElement("a-marker");return l.setAttribute("preset","custom"),l.setAttribute("type","pattern"),l.setAttribute("url","https://yoridrill.github.io/web-ar-viewer/asset/ar0.patt"),l.appendChild(e.wrap),void webArViewer.scene.appendChild(l)}webArViewer.scene.appendChild(e.wrap)},positionVec3:function(e,t){var a=this,r=a.arData[e].size.h/2,i=a.arData[e].size.w,n=a.arData[e].isWarp;if("shadow"===t){if(a.arg.multi)return{x:0,y:0,z:-r};var s={};return s[1]=function(){return{x:0,y:0,z:-a.arData[0].size.h/2-r-(n?.2:0)}},s[2]=function(){return{x:0,y:0,z:(n?.2:0)-r}},s[3]=function(){return{x:0,y:0,z:a.arData[0].size.h/2-r+(n?.2:0)}},s[e]()}if(0===e)return{x:0,y:n?i/2:0,z:0};if(a.arg.multi)return{x:0,y:r,z:-(n?i:0)};var s={};return s[1]=function(){return{x:0,y:r,z:(n?i-.2:0)-a.arData[0].size.h/2}},s[2]=function(){return{x:0,y:r,z:-(n?i-.2:0)}},s[3]=function(){return{x:0,y:r,z:-(n?i-.2:0)+a.arData[0].size.h/2}},s[e]()},setTapEvents:function(){var e=this;if(e.arg.ft||e.arg.fg||e.tap){var t=document.getElementById("touch"),a=new Image(40,54);if(a.src="https://yoridrill.github.io/web-ar-viewer/asset/touch.png",a.onload=function(){t.appendChild(a),t.classList.add("attention")},e.arg.ft&&webArViewer.scene.addEventListener("click",function(t){for(var a=0;a<e.C.arNum;a=a+1|0)e.arData[a].path&&e.arData[a].isTurn&&(e.arData[a].main.emit("turn"),e.arData[a].isShadow&&e.arData[a].shadow.emit("turn"))}),e.arg.fg&&(webArViewer.scene.addEventListener(e.eventNames.start,function(t){for(var a=0;a<e.C.arNum;a=a+1|0)e.arData[a].path&&e.arData[a].isGuni&&(e.arData[a].main.emit("guni"),e.arData[a].isShadow&&e.arData[a].shadow.emit("guni"))}),webArViewer.scene.addEventListener(e.eventNames.end,function(t){for(var a=0;a<e.C.arNum;a=a+1|0)e.arData[a].path&&e.arData[a].isGuni&&(e.arData[a].main.emit("guniback"),e.arData[a].isShadow&&e.arData[a].shadow.emit("guniback"))})),e.tap){for(var r=0;r<e.C.arNum;r=r+1|0){var i=e.arData[r];if(i.tap){i.mainTap=document.createElement("a-plane");var n={shader:i.tap.match(/\.gif$/i)?"gif":"standard",npot:!0,src:"#tap"+r,side:"double",transparent:!0,alphaTest:.1,metalness:i.isKira?.1:0,roughness:i.isKira?.3:.5};if(i.map&&(n.displacementMap="#map"+r,n.displacementBias=-.5),i.hasMp4&&(n.shader="chromakey",n.keyColor=i.keyColor),AFRAME.utils.entity.setComponentProperty(i.mainTap,"material",n),i.mainTap.setAttribute("visible",!1),webArViewer.scene.appendChild(i.mainTap),i.isShadow){i.shadowTap=document.createElement("a-plane");var s={shader:i.tap.match(/\.gif$/i)?"gif":"flat",npot:!0,src:"#tap"+r,transparent:!0,alphaTest:.1,color:"black",opacity:.3,depthTest:!1};i.hasMp4&&(s.shader="chromakey",s.keyColor=i.keyColor),AFRAME.utils.entity.setComponentProperty(i.shadowTap,"material",s),i.shadowTap.setAttribute("visible",!1),webArViewer.scene.appendChild(i.shadowTap)}}}webArViewer.scene.addEventListener("click",function(t){for(var a=0;a<e.C.arNum;a=a+1|0){var r=e.arData[a];r.tap&&(r.tapVisible?(r.tapVisible=!1,r.main.object3DMap.mesh.material=r.mainDefaultMaterial,r.isShadow&&(r.shadow.object3DMap.mesh.material=r.shadowDefaultMaterial),r.hasMp4&&r.tapEl.pause()):(r.tapVisible=!0,r.mainDefaultMaterial||(r.mainDefaultMaterial=r.main.object3DMap.mesh.material,r.mainTapMaterial=r.mainTap.object3DMap.mesh.material,r.isShadow&&(r.shadowDefaultMaterial=r.shadow.object3DMap.mesh.material,r.shadowTapMaterial=r.shadowTap.object3DMap.mesh.material)),r.main.object3DMap.mesh.material=r.mainTapMaterial,r.isShadow&&(r.shadow.object3DMap.mesh.material=r.shadowTapMaterial),r.hasMp4&&(r.tapEl.currentTime=0,r.tapEl.play())))}},!0)}}}},a={cEle:null,videoDom:null,rLensTimer:null,init:function(){this.cEle=document.getElementById("rightlens"),this.cEle&&this.setEvents()},setEvents:function(){var e=this;webArViewer.scene.addEventListener("enter-vr",function(t){function a(){e.cEle.width=e.videoDom.clientWidth,e.cEle.height=e.videoDom.clientHeight,e.cEle.style.marginTop=e.videoDom.style.marginTop,e.cEle.style.top=e.videoDom.style.top,r.drawImage(e.videoDom,e.videoDom.videoWidth/10,0,9*e.videoDom.videoWidth/10,e.videoDom.videoHeight,0,0,9*e.videoDom.videoWidth/10,e.videoDom.videoHeight)}var r=e.cEle.getContext("2d");e.videoDom=document.querySelector("video"),e.videoDom.style.left="-20%",e.cEle.style.zIndex=-1,e.rLensTimer=setInterval(a,1e3/60)}),webArViewer.scene.addEventListener("exit-vr",function(t){e.videoDom.style.left="0px",e.cEle.style.zIndex=-5,clearInterval(e.rLensTimer)})}};webArViewer.ar=t,webArViewer.vr=a,webArViewer.ar.init(),webArViewer.vr.init()}();
