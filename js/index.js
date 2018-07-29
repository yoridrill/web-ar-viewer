var webArViewer = webArViewer || {};

(function (global) {
    webArViewer.scene = document.querySelector('a-scene');
    var ar = {
        C : {
            arNum: 5
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
            assets.setAttribute('timeout', '9000');
            var arData = new Array(self.C.arNum+1).join('0').split('');

            if (!arData.some(function(val, idx) {
                return self.arg['i' + idx];
            })) {
                // 画像一つもなかった
                if (window.confirm('画像情報が1つも取得できませんでした。\nジェネレータで再度作り直してください。')) {
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
                    };
                }
                arData[idx].isGif = !!(self.arg['i' + idx]||'').match(/\.gif$/i);

                // アセット読み込み
                if (self.arg['i' + idx]) {
                    var source = document.createElement('img');
                    source.setAttribute('crossorigin', 'anonymous');
                    source.setAttribute('id', 'source' + idx);
                    source.setAttribute('src', self.arg['i' + idx]);
                    assets.appendChild(source);
                }
            });

            webArViewer.scene.appendChild(assets);
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

            if(!self.arData  || location.pathname.match(/vr/)) {
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

            if (location.pathname.match(/vr/)) {
                var wrap = document.createElement('a-entity');
                var vrPos = self.arg.vrPos ? decodeURI(self.arg.vrPos) : '0 0 -4';
                wrap.setAttribute('position', vrPos);
            } else if (self.arg.preview) {
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
                            property: 'scale', dur: 5, easing: 'linear', loop: false, to: zoomRate + ' ' + zoomRate + ' ' + zoomRate
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
            } else if (self.arg.multi) {
                return;
            } else {
                var wrap = document.createElement('a-marker');
                wrap.setAttribute('preset', 'custom');
                wrap.setAttribute('type', 'pattern');
                wrap.setAttribute('url', 'asset/ar0.patt');
            }
            self.wrap = wrap;
        },
        createModel : function() {
            var self = this;

            self.arData.forEach(function(val, idx) {
                if (!val.path) {
                    return;
                }

                if (idx === 4) {
                    var sky = document.createElement('a-sky');
                    AFRAME.utils.entity.setComponentProperty(sky, 'material', {
                        shader: val.isGif ? 'gif' : 'standard', src: '#source' + idx, radius: val.isWarp ? 80 : 5000
                    });
                    if (val.isShadow) {
                        AFRAME.utils.entity.setComponentProperty(sky, 'animation__rot', {
                            property: 'geometry.phiStart', dur: 20000, easing: 'linear', loop: true, to: -360
                        });
                    }
                    webArViewer.scene.appendChild(sky);

                    if (val.isPoyo) {
                        var light1 = document.createElement('a-entity');
                        var light2 = document.createElement('a-entity');
                        light1.setAttribute('light', 'type: hemisphere; color: #33F; groundColor: #BB3; intensity: 2');
                        light2.setAttribute('light', 'type: directional; color: #FF3; intensity: 0.6');
                        light2.setAttribute('position', '-20 90 10');
                        webArViewer.scene.appendChild(light1);
                        webArViewer.scene.appendChild(light2);
                    }
                    return;
                }

                if (idx && val.isShadow) {
                    var shadow = document.createElement('a-entity');

                    shadow.setAttribute('position', AFRAME.utils.coordinates.stringify(self.positionVec3(idx, 'shadow')));
                    shadow.setAttribute('rotation', '-90 0 0');

                    AFRAME.utils.entity.setComponentProperty(shadow, 'geometry', {
                        primitive: 'plane', height: val.size.h, width: val.size.w
                    });
                    AFRAME.utils.entity.setComponentProperty(shadow, 'material', {
                        shader: val.isGif ? 'gif' : 'flat', npot: true, src: '#source' + idx, transparent: true, alphaTest: 0.1,
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
                    self.arData[idx].shadow = shadow;
                }

                var main = document.createElement('a-entity');
                var posVec3 = self.positionVec3(idx, 'main');

                main.setAttribute('position', AFRAME.utils.coordinates.stringify(posVec3));
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
                    var ts, tl;
                    if (idx === 1 && !self.arg.multi) {
                        ts = 212;
                        tl = -64;
                    } else {
                        ts = -32;
                        tl = 64;
                    }
                    AFRAME.utils.entity.setComponentProperty(main, 'geometry', {
                        primitive: 'cylinder', openEnded: true, thetaStart: ts, thetaLength: tl,
                        height: val.size.h, radius: val.size.w
                    });
                } else {
                    AFRAME.utils.entity.setComponentProperty(main, 'geometry', {
                        primitive: 'sphere', radius: val.size.w/2, phiStart: -90
                    });
                }

                // アニメーション
                if (val.isPoyo) {
                    AFRAME.utils.entity.setComponentProperty(main, 'animation__pos', {
                        property: 'position', dir: 'alternate', dur: 400, easing: 'easeInOutQuart', loop: true, to: posVec3.x + ' ' + (posVec3.y+val.size.h/3) + ' ' + posVec3.z
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
            });

            if (self.arg.multi) {
                self.arData.forEach(function(val, idx) {
                    if (!val.path || idx === 4) {
                        return;
                    }
                    if (self.arg.gyro || self.arg.preview) {
                        var arObj = document.createElement('a-entity');
                        arObj.setAttribute('position', ['0 0 0', '2 0 -2.1', '0 0 -2.3', '-2 0 -2.2'][idx]);

                        self.arData[idx].shadow && arObj.appendChild(self.arData[idx].shadow);
                        self.arData[idx].main && arObj.appendChild(self.arData[idx].main);

                        self.wrap.appendChild(arObj);
                    } else {
                        var arMarker = document.createElement('a-marker');
                        arMarker.setAttribute('preset', 'custom');
                        arMarker.setAttribute('type', 'pattern');
                        arMarker.setAttribute('url', 'asset/ar' + idx + '.patt');

                        self.arData[idx].shadow && arMarker.appendChild(self.arData[idx].shadow);
                        self.arData[idx].main && arMarker.appendChild(self.arData[idx].main);

                        webArViewer.scene.appendChild(arMarker);
                    }
                });
                if (self.arg.gyro || self.arg.preview) {
                    webArViewer.scene.appendChild(self.wrap);
                }
            } else {
                self.arData[0].main && !self.arData[0].isWarp && self.wrap.appendChild(self.arData[0].main);

                self.arData[1].shadow && self.wrap.appendChild(self.arData[1].shadow);
                self.arData[2].shadow && self.wrap.appendChild(self.arData[2].shadow);
                self.arData[3].shadow && self.wrap.appendChild(self.arData[3].shadow);

                self.arData[1].main && self.wrap.appendChild(self.arData[1].main);
                self.arData[2].main && self.wrap.appendChild(self.arData[2].main);
                self.arData[0].main && self.arData[0].isWarp && self.wrap.appendChild(self.arData[0].main);
                self.arData[3].main && self.wrap.appendChild(self.arData[3].main);

                webArViewer.scene.appendChild(self.wrap);
            }
        },
        // type: ['shadow' | 'main']
        positionVec3: function (idx, type) {
            var self = this;
            var h1_2 = self.arData[idx].size.h/2;
            var width = self.arData[idx].size.w;
            var isWarp = self.arData[idx].isWarp;

            if (type === 'shadow') {
                if (self.arg.multi) {
                    return {x: 0, y: -0.1, z: - h1_2};
                } else {
                    var p = {};
                    p[1] = function () {
                        return {x: 0, y: -0.2, z: - self.arData[0].size.h/2 - h1_2};
                    };
                    p[2] = function () {
                        return {x: 0, y: -0.1, z: - h1_2};
                    };
                    p[3] = function () {
                        return {x: 0, y: 0, z: self.arData[0].size.h/2 - h1_2};
                    };
                    return p[idx]();
                }
            } else {
                if (idx === 0) {
                    return {x: 0, y: isWarp ? width/2 : -0.2, z: 0};
                } else if (self.arg.multi) {
                    return {x: 0, y: h1_2, z: - (isWarp ? width : 0)};
                } else {
                    var p = {};
                    p[1] = function () {
                        return {x: 0, y: h1_2, z: (isWarp ? width : 0) - self.arData[0].size.h/2 - 0.1};
                    };
                    p[2] = function () {
                        return {x: 0, y: h1_2, z: - (isWarp ? width : 0)};
                    };
                    p[3] = function () {
                        return {x: 0, y: h1_2, z: - (isWarp ? width : 0) + self.arData[0].size.h/2 + 0.1};
                    };
                    return p[idx]();
                }
            }
        }
    };

    var vr = {
        cEle : null,
        videoDom : null,
        rLensTimer : null,

        init : function() {
            this.cEle = document.getElementById('rightlens');
            if (this.cEle) {
                this.setEvents();
            }
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
