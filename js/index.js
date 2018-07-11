try {
    var C = {
        arNum: 4
    };

    var arg = {};
    var pair = location.search.substring(1).split('&');
    for(var i=0; pair[i]; i++) {
        var kv = pair[i].split('=');
        arg[kv[0]] = decodeURIComponent(kv[1]);
    }
    var pad = new Array(C.arNum).join('0');

    arg.warpList = arg.fw && (pad + parseInt(arg.fw, 16).toString(2)).slice(-1 * C.arNum).split('').reverse();
    arg.shodowList = arg.fs && (pad + parseInt(arg.fs, 16).toString(2)).slice(-1 * C.arNum).split('').reverse();
    arg.poyoList = arg.fp && (pad + parseInt(arg.fp, 16).toString(2)).slice(-1 * C.arNum).split('').reverse();

    arg.sizeList = arg.wh && (pad + pad + parseInt(arg.wh, 16).toString(10)).slice(-2 * C.arNum).match(/.{2}/g).reverse();

    var arData = new Array(C.arNum+1).join('0').split('');

    if (!arData.some(function(val, idx) {
        return arg['i' + idx];
    })) {
        throw new Error('画像が取得できませんでした。');
    }

    var scene = document.querySelector('a-scene');
    var assets = document.createElement('a-assets');

    if (arg.preview) {
        var wrap = document.createElement('a-entity');
        wrap.setAttribute('position', '0 0 -15');
        wrap.setAttribute('rotation', '25 0 0');
    } else if (arg.gyro) {
        var wrap = document.createElement('a-entity');
        wrap.setAttribute('rotation', '0 0 0');
        wrap.setAttribute('position', '0 0 0');

        var camera = document.querySelector('a-entity');
        camera.setAttribute('look-controls', 'look-controls');
        camera.setAttribute('position', '0 4 10');
    } else {
        var wrap = document.createElement('a-marker');
        wrap.setAttribute('preset', 'custom');
        wrap.setAttribute('type', 'pattern');
        wrap.setAttribute('url', 'asset/pattern-marker.patt');
    }

    // データの準備・アセット読み込み
    arData.forEach(function(val, idx) {
        arData[idx] = { path: arg['i' + idx] };
        arData[idx].isWarp = arg.warpList && !!Number(arg.warpList[idx]);
        arData[idx].isShadow = arg.shodowList && !!Number(arg.shodowList[idx]);
        arData[idx].isPoyo = arg.poyoList && !!Number(arg.poyoList[idx]);
        arData[idx].size = arg.sizeList ? {w: Number(arg.sizeList[idx][0])*0.8, h: Number(arg.sizeList[idx][1])} : {w: 2*0.8, h: 2};

        arData[idx].isGif = !!(arg['i' + idx]||'').match(/\.gif$/i);

        if (arg['i' + idx]) {
            var source = document.createElement('img');
            source.setAttribute('id', 'source' + idx);
            source.setAttribute('src', arg['i' + idx]);
            assets.appendChild(source);
            scene.appendChild(assets);
        }
    });

    arData.forEach(function(val, idx) {
        if (val.path) {
            var h1_2 = val.size.h/2;

            if (idx && val.isShadow) {
                var shadow = document.createElement('a-entity');

                var pos = [
                    {x: 0, y: 0, z: 0},
                    {x: 0, y: -0.2, z: - arData[0].size.h/2 - h1_2},
                    {x: 0, y: -0.1, z: - h1_2},
                    {x: 0, y: 0, z: arData[0].size.h/2 - h1_2}
                ];
                shadow.setAttribute('position', AFRAME.utils.coordinates.stringify(pos[idx]));
                shadow.setAttribute('rotation', '-90 0 0');

                AFRAME.utils.entity.setComponentProperty(shadow, 'geometry', {
                    primitive: 'plane', height: val.size.h, width: val.size.w
                });
                AFRAME.utils.entity.setComponentProperty(shadow, 'material', {
                    shader: val.isGif ? 'gif' : 'standard', npot: true, src: '#source' + idx,
                    color: 'black', opacity: 0.3
                });

                if (val.isPoyo) {
                    var alphaAnim = document.createElement('a-animation');
                    alphaAnim.setAttribute('attribute', 'material.opacity');
                    alphaAnim.setAttribute('direction', 'alternate');
                    alphaAnim.setAttribute('dur', '400');
                    alphaAnim.setAttribute('to', '0.1');
                    alphaAnim.setAttribute('repeat', 'indefinite');
                    shadow.appendChild(alphaAnim);

                    var scaleAnim = document.createElement('a-animation');
                    scaleAnim.setAttribute('attribute', 'scale');
                    scaleAnim.setAttribute('direction', 'alternate');
                    scaleAnim.setAttribute('dur', '400');
                    scaleAnim.setAttribute('to', '0.8 0.7 1');
                    scaleAnim.setAttribute('easing', 'linear');
                    scaleAnim.setAttribute('repeat', 'indefinite');
                    shadow.appendChild(scaleAnim);
                }
                wrap.appendChild(shadow);
            }

            arData[idx].main = document.createElement('a-entity');

            var pos = [
                {x: 0, y: val.isWarp ? h1_2 : 0, z: 0},
                {x: 0, y: h1_2, z: (val.isWarp ? val.size.w : 0) - arData[0].size.h/2},
                {x: 0, y: h1_2, z: - (val.isWarp ? val.size.w : 0)},
                {x: 0, y: h1_2, z: arData[0].size.h/2 - (val.isWarp ? val.size.w : 0)}
            ];

            arData[idx].main.setAttribute('position', AFRAME.utils.coordinates.stringify(pos[idx]));
            arData[idx].main.setAttribute('rotation', ((idx === 0 && !val.isWarp) ? -90 : 0) + ' 0 0');

            AFRAME.utils.entity.setComponentProperty(arData[idx].main, 'material', {
                shader: val.isGif ? 'gif' : 'standard', npot: true, src: '#source' + idx,
                side: 'double', transparent: true, alphaTest: 0.1
            });

            AFRAME.utils.entity.setComponentProperty(arData[idx].main, 'geometry', {
                primitive: 'plane', height: val.size.h, width: val.size.w
            });

            if (!val.isWarp) {
                AFRAME.utils.entity.setComponentProperty(arData[idx].main, 'geometry', {
                    primitive: 'plane', height: val.size.h, width: val.size.w
                });
            } else if (idx) {
                var ts = [0, 212, -32, -32];
                AFRAME.utils.entity.setComponentProperty(arData[idx].main, 'geometry', {
                    primitive: 'cylinder', openEnded: true, thetaStart: ts[idx], thetaLength: idx===1 ? -64 : 64,
                    height: val.size.h, radius: val.size.w
                });
            } else {
                AFRAME.utils.entity.setComponentProperty(arData[idx].main, 'geometry', {
                    primitive: 'sphere', radius: h1_2 - 0.25, phiStart: -90
                });
            }

            if (val.isPoyo) {
                var posAnim = document.createElement('a-animation');
                posAnim.setAttribute('attribute', 'position');
                posAnim.setAttribute('direction', 'alternate');
                posAnim.setAttribute('dur', '400');
                posAnim.setAttribute('to', pos[idx].x + ' ' + (pos[idx].y+val.size.h/4) + ' ' + pos[idx].z);
                posAnim.setAttribute('repeat', 'indefinite');
                arData[idx].main.appendChild(posAnim);

                var scaleAnim = document.createElement('a-animation');
                scaleAnim.setAttribute('attribute', 'scale');
                scaleAnim.setAttribute('direction', 'alternate');
                scaleAnim.setAttribute('dur', '400');
                scaleAnim.setAttribute('to', '0.95 1.05 1');
                scaleAnim.setAttribute('easing', 'ease-out');
                scaleAnim.setAttribute('repeat', 'indefinite');
                arData[idx].main.appendChild(scaleAnim);
            } else if (idx === 0 && val.isShadow) {
                var rotateAnim = document.createElement('a-animation');
                rotateAnim.setAttribute('to', (val.isWarp ? 0 : -90) + ' 360 0');
                rotateAnim.setAttribute('dur', '20000');
                rotateAnim.setAttribute('easing', 'linear');
                rotateAnim.setAttribute('fill', 'backwards');
                rotateAnim.setAttribute('repeat', 'indefinite');
                arData[idx].main.appendChild(rotateAnim);
            }
        }
    });

    arData[1].main && wrap.appendChild(arData[1].main);
    arData[2].main && wrap.appendChild(arData[2].main);
    arData[3].main && wrap.appendChild(arData[3].main);
    arData[0].main && wrap.appendChild(arData[0].main);
    scene.appendChild(wrap);

} catch (e) {

    if (e.message === '画像が取得できませんでした。') {
        // 画像一つもなかった
        if (window.confirm('画像情報が1つも取得できませんでした。\nジェネレータで再度QRコードを発行し直してください。')) {
            location.href = "https://web-ar-generator.firebaseapp.com/";
        }
    } else {
        // それ以外
        alert(e + '\n \n処理中にエラーが発生しました。\nいずれ修正しますので、また日を改めてご確認お願いします。\nエラーの出たマーカーとエラーのスクショを @yoridrill 宛にいただけると助かります。');
    }
}
