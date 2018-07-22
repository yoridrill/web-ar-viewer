var webArViewer = webArViewer || {};

(function (global) {
    webArViewer.scene = document.querySelector('a-scene');
    var ar = {
        C : {
            arNum: 4
        },
        init : function() {
            this.setArg();
            if(this.setArData()) {
                this.setWrap();
                this.createModel();
            }
            this.setSwitcher();
        },
        setArg : function() {
            var self = this;

            var arg = {};
            var pair = location.search.substring(1).split('&');
            for(var i=0; pair[i]; i++) {
                var kv = pair[i].split('=');
                arg[kv[0]] = decodeURIComponent(kv[1]);
            }
            var pad = new Array(self.C.arNum).join('0');

            arg.warpList = arg.fw && (pad + parseInt(arg.fw, 16).toString(2)).slice(-1 * self.C.arNum).split('').reverse();
            arg.shodowList = arg.fs && (pad + parseInt(arg.fs, 16).toString(2)).slice(-1 * self.C.arNum).split('').reverse();
            arg.poyoList = arg.fp && (pad + parseInt(arg.fp, 16).toString(2)).slice(-1 * self.C.arNum).split('').reverse();
            arg.decaList = arg.fd && (pad + parseInt(arg.fd, 16).toString(2)).slice(-1 * self.C.arNum).split('').reverse();

            arg.sizeList = arg.wh && (pad + pad + parseInt(arg.wh, 16).toString(10)).slice(-2 * self.C.arNum).match(/.{2}/g).reverse();

            self.arg = arg;
        },
        setArData : function() {
            var self = this;

            var assets = document.createElement('a-assets');
            var arData = new Array(self.C.arNum+1).join('0').split('');

            if (!arData.some(function(val, idx) {
                return self.arg['i' + idx];
            })) {
                // 画像一つもなかった
                if (window.confirm('画像情報が1つも取得できませんでした。\nジェネレータで再度QRコードを発行し直してください。')) {
                    location.href = "https://web-ar-generator.firebaseapp.com/";
                }
                return false;
            }

            // データの準備
            arData.forEach(function(val, idx) {
                arData[idx] = { path: self.arg['i' + idx] };
                arData[idx].isWarp = self.arg.warpList && !!Number(self.arg.warpList[idx]);
                arData[idx].isShadow = self.arg.shodowList && !!Number(self.arg.shodowList[idx]);
                arData[idx].isPoyo = self.arg.poyoList && !!Number(self.arg.poyoList[idx]);
                arData[idx].isDeca = self.arg.decaList && !!Number(self.arg.decaList[idx]);
                arData[idx].size = self.arg.sizeList ? {
                    w: Number(self.arg.sizeList[idx][0])*0.9,
                    h: Number(self.arg.sizeList[idx][1])
                } : {
                    w: 2*0.9,
                    h: 2
                };
                if (arData[idx].isDeca) {
                    arData[idx].size = {
                        w: arData[idx].size.w * 10,
                        h: arData[idx].size.h * 10
                    }
                }
                arData[idx].isGif = !!(self.arg['i' + idx]||'').match(/\.gif$/i);

                // アセット読み込み
                if (self.arg['i' + idx]) {
                    var source = document.createElement('img');
                    source.setAttribute('crossorigin', 'anonymous');
                    source.setAttribute('id', 'source' + idx);
                    source.setAttribute('src', self.arg['i' + idx]);
                    assets.appendChild(source);
                    webArViewer.scene.appendChild(assets);
                }
            });
            self.arData = arData;
            return true;
        },
        setSwitcher : function() {
            var self = this;

            var swMarker = document.getElementById('swMarker');
            var swGyro = document.getElementById('swGyro');
            var swPreview = document.getElementById('swPreview');
            var swHelp = document.getElementById('swHelp');
            var helpContent = document.getElementById('helpContent');

            swHelp.addEventListener('click', function() {
                helpContent.classList.toggle('hide');
                swHelp.classList.toggle('current');
            });

            if(!self.arData) {
                return false;
            }

            if (self.arg.preview) {
                swPreview.classList.add('current');
            } else if (self.arg.gyro) {
                swGyro.classList.add('current');
            } else {
                swMarker.classList.add('current');
            }

            swMarker.addEventListener('click', function() {
                if(!this.classList.contains('current')) {
                    location.href = location.search.replace('&gyro=1', '').replace('&preview=1', '');
                }
            });
            swGyro.addEventListener('click', function() {
                if(!this.classList.contains('current')) {
                    location.href = location.search.replace('&preview=1', '') + '&gyro=1';
                }
            });
            swPreview.addEventListener('click', function() {
                if(!this.classList.contains('current')) {
                    location.href = location.search.replace('&gyro=1', '') + '&preview=1';
                }
            });
        },
        setWrap : function() {
            var self = this;

            if (self.arg.preview) {
                var wrap = document.createElement('a-entity');
                wrap.setAttribute('position', '0 0 -15');
                wrap.setAttribute('rotation', '25 0 0');

                var camera = document.querySelector('a-camera-static');

                var deviceEvents = {
                    Touch     : typeof document.ontouchstart !== 'undefined',
                    Pointer   : window.navigator.pointerEnabled,
                    MSPointer : window.navigator.msPointerEnabled
                };

                var eventNames = {
                    start     : deviceEvents.Pointer ? 'pointerdown' : deviceEvents.MSPointer ? 'MSPointerDown' : deviceEvents.Touch ? 'touchstart' : 'mousedown',
                    move      : deviceEvents.Pointer ? 'pointermove' : deviceEvents.MSPointer ? 'MSPointerMove' : deviceEvents.Touch ? 'touchmove'  : 'mousemove',
                    end       : deviceEvents.Pointer ? 'pointerup'   : deviceEvents.MSPointer ? 'MSPointerUp'   : deviceEvents.Touch ? 'touchend'   : 'mouseup',
                    click     : 'click'
                };

                var prevPageY;
                var zoomRate = 1;

                webArViewer.scene.addEventListener(eventNames.start, function(e) {
                    var event = e.changedTouches ? e.changedTouches[0] : e;
                    prevPageY = event.pageY;
                });
                webArViewer.scene.addEventListener(eventNames.move, function(e) {
                    var event = e.changedTouches ? e.changedTouches[0] : e;
                    if(prevPageY) {
                        zoomRate += (event.pageY - prevPageY) / webArViewer.scene.clientHeight / 5;

                        AFRAME.utils.entity.setComponentProperty(wrap, 'animation__scale', {
                            property: 'scale', dur: 400, easing: 'easeInOutQuad', loop: false, to: zoomRate + ' ' + zoomRate + ' ' + zoomRate
                        });
                    }
                });
                webArViewer.scene.addEventListener(eventNames.end, function(e) {
                    prevPageY = null;
                });
            } else if (self.arg.gyro) {
                var wrap = document.createElement('a-entity');
                wrap.setAttribute('position', '0 -5 -8');

                var camera = document.querySelector('a-camera-static');
                camera.setAttribute('look-controls', 'look-controls');
            } else {
                var wrap = document.createElement('a-marker');
                wrap.setAttribute('preset', 'custom');
                wrap.setAttribute('type', 'pattern');
                wrap.setAttribute('url', 'asset/pattern-marker.patt');
            }
            self.wrap = wrap;
        },
        createModel : function() {
            var self = this;

            self.arData.forEach(function(val, idx) {
                if (val.path) {
                    var h1_2 = val.size.h/2;

                    if (idx && val.isShadow) {
                        var shadow = document.createElement('a-entity');

                        var pos = [
                            {x: 0, y: 0, z: 0},
                            {x: 0, y: -0.2, z: - self.arData[0].size.h/2 - h1_2},
                            {x: 0, y: -0.1, z: - h1_2},
                            {x: 0, y: 0, z: self.arData[0].size.h/2 - h1_2}
                        ];
                        shadow.setAttribute('position', AFRAME.utils.coordinates.stringify(pos[idx]));
                        shadow.setAttribute('rotation', '-90 0 0');

                        AFRAME.utils.entity.setComponentProperty(shadow, 'geometry', {
                            primitive: 'plane', height: val.size.h, width: val.size.w
                        });
                        AFRAME.utils.entity.setComponentProperty(shadow, 'material', {
                            shader: val.isGif ? 'gif' : 'standard', npot: true, src: '#source' + idx, transparent: true, alphaTest: 0.1,
                            color: 'black', opacity: 0.3
                        });

                        // アニメーション
                        if (val.isPoyo) {
                            AFRAME.utils.entity.setComponentProperty(shadow, 'animation__alpha', {
                                property: 'material.opacity', dir: 'alternate', dur: 400, easing: 'easeInOutQuart', loop: true, to: '0.1'
                            });

                            AFRAME.utils.entity.setComponentProperty(shadow, 'animation__scale', {
                                property: 'scale', dir: 'alternate', dur: 400, easing: 'easeInOutQuart', loop: true, to: '0.8 0.7 1'
                            });
                        }
                        self.wrap.appendChild(shadow);
                    }

                    var main = document.createElement('a-entity');

                    var pos = [
                        {x: 0, y: val.isWarp ? h1_2 : -0.2, z: 0},
                        {x: 0, y: h1_2, z: (val.isWarp ? val.size.w : 0) - self.arData[0].size.h/2},
                        {x: 0, y: h1_2, z: - (val.isWarp ? val.size.w : 0)},
                        {x: 0, y: h1_2, z: self.arData[0].size.h/2 - (val.isWarp ? val.size.w : 0)}
                    ];

                    main.setAttribute('position', AFRAME.utils.coordinates.stringify(pos[idx]));
                    main.setAttribute('rotation', ((idx === 0 && !val.isWarp) ? -90 : 0) + ' 0 0');

                    AFRAME.utils.entity.setComponentProperty(main, 'material', {
                        shader: val.isGif ? 'gif' : 'standard', npot: true, src: '#source' + idx,
                        side: 'double', transparent: true, alphaTest: 0.1
                    });

                    if (!val.isWarp) {
                        AFRAME.utils.entity.setComponentProperty(main, 'geometry', {
                            primitive: 'plane', height: val.size.h, width: val.size.w
                        });
                    } else if (idx) {
                        var ts = [0, 212, -32, -32];
                        AFRAME.utils.entity.setComponentProperty(main, 'geometry', {
                            primitive: 'cylinder', openEnded: true, thetaStart: ts[idx], thetaLength: idx===1 ? -64 : 64,
                            height: val.size.h, radius: val.size.w
                        });
                    } else {
                        AFRAME.utils.entity.setComponentProperty(main, 'geometry', {
                            primitive: 'sphere', radius: h1_2 - 0.25, phiStart: -90
                        });
                    }

                    // アニメーション
                    if (val.isPoyo) {
                        AFRAME.utils.entity.setComponentProperty(main, 'animation__pos', {
                            property: 'position', dir: 'alternate', dur: 400, easing: 'easeInOutQuart', loop: true, to: pos[idx].x + ' ' + (pos[idx].y+val.size.h/3) + ' ' + pos[idx].z
                        });

                        AFRAME.utils.entity.setComponentProperty(main, 'animation__scale', {
                            property: 'scale', dir: 'alternate', dur: 400, easing: 'easeOutQuad', loop: true, to: '0.94 1.06 1'
                        });

                    }
                    if (idx === 0 && val.isShadow) {
                        AFRAME.utils.entity.setComponentProperty(main, 'animation__rot', {
                            property: 'rotation', dur: 20000, easing: 'linear', loop: true, to: (val.isWarp ? 0 : -90) + ' 360 0'
                        });
                    }

                    self.arData[idx].main = main;
                }
            });

            self.arData[1].main && self.wrap.appendChild(self.arData[1].main);
            self.arData[2].main && self.wrap.appendChild(self.arData[2].main);
            self.arData[3].main && self.wrap.appendChild(self.arData[3].main);
            self.arData[0].main && self.wrap.appendChild(self.arData[0].main);
            webArViewer.scene.appendChild(self.wrap);
        }
    };

    var vr = {
        cEle : document.getElementById('rightlens'),
        videoDom : null,
        rLensTimer : null,

        init : function() {
            this.setEvents();
        },
        setEvents : function() {
            var self = this;
            webArViewer.scene.addEventListener('enter-vr', function(e) {

                var cCtx = self.cEle.getContext('2d');
                self.videoDom = document.querySelector('video');

                self.videoDom.style.left = '-20%';
                self.cEle.style.zIndex = -1;

                function rLensUpgrade(){
                    self.cEle.width  = self.videoDom.clientWidth;
                    self.cEle.height = self.videoDom.clientHeight;
                    self.cEle.style.marginTop = self.videoDom.style.marginTop;
                    self.cEle.style.top = self.videoDom.style.top;
                    cCtx.drawImage(self.videoDom, self.videoDom.videoWidth/10, 0, 9*self.videoDom.videoWidth/10, self.videoDom.videoHeight, 0, 0, 9*self.videoDom.videoWidth/10, self.videoDom.videoHeight);
                };
                self.rLensTimer = setInterval(rLensUpgrade, 1000 / 60);
            });

            webArViewer.scene.addEventListener('exit-vr', function(e) {
                self.videoDom.style.left = '0px';
                self.cEle.style.zIndex = -5;
                clearInterval(self.rLensTimer);
            });
        }
    };
    webArViewer.ar = ar;
    webArViewer.vr = vr;
    webArViewer.ar.init();
    webArViewer.vr.init();
}());
