/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.')
	}

	AFRAME.registerShader('chromakey', {
	  schema: {
	    src: {type: 'map'},
	    keyColor: {default: {x: 0.1, y: 0.9, z: 0.2}, type: 'vec3', is: 'uniform'},
	    transparent: {default: true, is: 'uniform'},
        color: {is: 'uniform'}
	  },

	  init: function (data) {
	    var videoTexture = new THREE.VideoTexture(data.src)
	    videoTexture.minFilter = THREE.LinearFilter
	    this.material = new THREE.ShaderMaterial({
	      uniforms: {
	        keyColor: {
	          type: 'c',
	          value: data.keyColor
	        },
	        texture: {
	          type: 't',
	          value: videoTexture
            },
            shadow: {
                type: 'i',
                value: data.color ? 1 : 0
            }

	      },
	      vertexShader: this.vertexShader,
	      fragmentShader: this.fragmentShader
	    })
	  },

	  update: function (data) {
	    this.material.color = data.keyColor
	    this.material.src = data.src
	    this.material.transparent = data.transparent
	  },

	  vertexShader: [
	    'varying vec2 vUv;',
	    'void main(void)',
	    '{',
	    'vUv = uv;',
	    'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
	    'gl_Position = projectionMatrix * mvPosition;',
	    '}'
	  ].join('\n'),

	  fragmentShader: [
	    'uniform sampler2D texture;',
	    'uniform vec3 keyColor;',
        'uniform int shadow;',
	    'varying vec2 vUv;',
        'const vec3 mono = vec3(0,0,0);',
	    'void main(void)',
	    '{',
	    'vec3 tColor = texture2D( texture, vUv ).rgb;',
	    'float a = (length(tColor - keyColor) - 0.5) * 7.0;',
        'gl_FragColor = shadow == 1 ? vec4(mono, min(a, 0.3)) : vec4(tColor, a);',
	    '}'
	  ].join('\n')
	})


/***/ }
/******/ ]);
