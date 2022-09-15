"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fingerprint = void 0;
/**
 *
 * Overpowered Browser Fingerprinting Script v1.0.0b - (c) 2022 Joe Rutkowski <Joe@dreggle.com> (https://github.com/Joe12387/OP-Fingerprinting-Script)
 *
 **/
const fingerprint = function () {
    function murmurhash3_32_gc(key, seed) {
        let remainder = key.length & 3;
        let bytes = key.length - remainder;
        let h1 = seed;
        let c1 = 0xcc9e2d51;
        let c2 = 0x1b873593;
        let i = 0;
        while (i < bytes) {
            let k1 = ((key.charCodeAt(i) & 0xff)) |
                ((key.charCodeAt(++i) & 0xff) << 8) |
                ((key.charCodeAt(++i) & 0xff) << 16) |
                ((key.charCodeAt(++i) & 0xff) << 24);
            ++i;
            k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
            h1 ^= k1;
            h1 = (h1 << 13) | (h1 >>> 19);
            let h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
            h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
        }
        let k1 = 0;
        switch (remainder) {
            case 3:
                k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
            case 2:
                k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
            case 1:
                k1 ^= (key.charCodeAt(i) & 0xff);
                k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                h1 ^= k1;
        }
        h1 ^= key.length;
        h1 ^= h1 >>> 16;
        h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
        h1 ^= h1 >>> 13;
        h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
        h1 ^= h1 >>> 16;
        return h1 >>> 0;
    }
    function isSafari() {
        var v = navigator.vendor;
        return v !== undefined && v.indexOf("Apple") === 0;
    }
    function isChrome() {
        var v = navigator.vendor;
        return v !== undefined && v.indexOf("Google") === 0;
    }
    function isFirefox() {
        return document.documentElement !== undefined && document.documentElement.style.MozAppearance !== undefined;
    }
    function isFirefoxResistFingerprinting() {
        if (!isFirefox())
            return false;
        const intl = window.Intl;
        const date = intl.DateTimeFormat;
        if (typeof date === "function") {
            const tz = (new date).resolvedOptions().timeZone;
            if (tz === "UTC")
                return true;
        }
        return false;
    }
    function isMSIE() {
        return navigator.msSaveBlob !== undefined;
    }
    function isBrave() {
        return isChrome() && navigator.brave !== undefined;
    }
    return new Promise(function (resolve, reject) {
        var fingerprints = {
            platform: function () {
                return Promise.resolve(navigator.platform || -1);
            },
            vendor: function () {
                return Promise.resolve(navigator.vendor || -1);
            },
            productSub: function () {
                return Promise.resolve(navigator.productSub || -1);
            },
            appVersion: function () {
                return Promise.resolve(navigator.appVersion || -1);
            },
            colorDepth: function () {
                return Promise.resolve(window.screen.colorDepth);
            },
            devicePixelRatio: function () {
                return Promise.resolve(window.devicePixelRatio);
            },
            evalToString: function () {
                return Promise.resolve(eval.toString().length);
            },
            maxTouchPoints: function () {
                var n = navigator;
                return Promise.resolve(n.maxTouchPoints !== undefined ? n.maxTouchPoints : n.msMaxTouchPoints !== undefined ? n.msMaxTouchPoints : -1);
            },
            cpuClass: function () {
                return Promise.resolve(navigator.cpuClass || -1);
            },
            hardwareConcurrency: function () {
                if (isBrave() || isFirefoxResistFingerprinting()) {
                    return Promise.resolve([-1, null]);
                }
                ;
                let hc = navigator.hardwareConcurrency;
                return Promise.resolve(hc === undefined ? [0, hc] : [-2, null]);
            },
            deviceMemory: function () {
                return Promise.resolve((isBrave() ? 0 : navigator.deviceMemory) || -1);
            },
            oscpu: function () {
                return Promise.resolve(navigator.oscpu || -1);
            },
            doNotTrack: function () {
                return Promise.resolve(navigator.doNotTrack !== undefined ? navigator.doNotTrack : -1);
            },
            sourceBuffer: function () {
                return Promise.resolve([typeof SourceBuffer, typeof SourceBufferList]);
            },
            colorGamut: function () {
                return new Promise(function (resolve) {
                    let colorGamuts = ["rec2020", "p3", "srgb"];
                    for (let i = 0; i < colorGamuts.length; i++) {
                        let gamut = colorGamuts[i];
                        if (matchMedia("(color-gamut: " + gamut + ")").matches)
                            resolve(gamut);
                    }
                    resolve(-1);
                });
            },
            reducedMotion: function () {
                return new Promise(function (resolve) {
                    function prm(x) {
                        return Boolean(matchMedia("(prefers-reduced-motion: " + x + ")").matches);
                    }
                    resolve(prm("reduce") || !prm("no-preference"));
                });
            },
            hdr: function () {
                return new Promise(function (resolve) {
                    function dr(x) {
                        return Boolean(matchMedia("(dynamic-range: " + x + ")").matches);
                    }
                    resolve(dr("high") || !dr("standard"));
                });
            },
            contrast: function () {
                return new Promise(function (resolve) {
                    function pc(x) {
                        return Boolean(matchMedia("(prefers-contrast: " + x + ")").matches);
                    }
                    resolve(pc("no-preference") ? 0 : pc("high") || pc("more") ? 1 : pc("low") || pc("less") ? -1 : pc("forced") ? 10 : -1);
                });
            },
            invertedColors: function () {
                return new Promise(function (resolve) {
                    function ic(x) {
                        return Boolean(matchMedia("(inverted-colors: " + x + ")").matches);
                    }
                    resolve(ic("inverted") || !ic("none"));
                });
            },
            forcedColors: function () {
                return new Promise(function (resolve) {
                    function fc(x) {
                        return Boolean(matchMedia("(forced-colors: " + x + ")").matches);
                    }
                    resolve(fc("active") || !fc("none"));
                });
            },
            monochrome: function () {
                return new Promise(function (resolve) {
                    if (matchMedia("(min-monochrome: 0)").matches) {
                        for (var i = 0; i <= 100; ++i) {
                            if (matchMedia("(max-monochrome: " + i + ")").matches)
                                resolve(i);
                            throw new Error("Max monochrome value is over 100");
                        }
                    }
                    resolve(-1);
                });
            },
            browserObjects: function () {
                return new Promise(function (resolve) {
                    let foundObjects = [];
                    const objects = [
                        "chrome",
                        "safari",
                        "__crWeb",
                        "__gCrWeb",
                        "yandex",
                        "__yb",
                        "__ybro",
                        "__firefox__",
                        "__edgeTrackingPreventionStatistics",
                        "webkit",
                        "oprt",
                        "samsungAr",
                        "ucweb",
                        "UCShellJava",
                        "puffinDevice",
                        "opr"
                    ];
                    for (let i = 0; i < objects.length; i++) {
                        if (typeof window[objects[i]] === "object")
                            foundObjects.push(objects[i]);
                    }
                    resolve(foundObjects.sort());
                });
            },
            timezone: function () {
                return new Promise(function (resolve) {
                    const intl = window.Intl;
                    const date = intl.DateTimeFormat;
                    if (typeof date === "function") {
                        const tz = (new date).resolvedOptions().timeZone;
                        if (tz)
                            resolve([0, tz]);
                    }
                    const year = (new Date).getFullYear();
                    const utc = -Math.max(parseFloat(new Date(year, 0, 1).getTimezoneOffset()), parseFloat(new Date(year, 6, 1).getTimezoneOffset()));
                    resolve([1, "UTC" + (utc >= 0 ? "+" : "-") + Math.abs(utc)]);
                });
            },
            timezoneOffset: function () {
                return new Promise(function (resolve) {
                    const year = (new Date).getFullYear();
                    resolve([0, -Math.max(parseFloat(new Date(year, 0, 1).getTimezoneOffset()), parseFloat(new Date(year, 6, 1).getTimezoneOffset()))]);
                });
            },
            language: function () {
                return new Promise(function (resolve) {
                    const n = navigator;
                    const lang_str = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
                    let lang_arr = [];
                    if (!isChrome() && Array.isArray(n.languages)) {
                        lang_arr = n.languages;
                    }
                    resolve([lang_str, lang_arr]);
                });
            },
            screenResolution: function () {
                if (isFirefoxResistFingerprinting())
                    return [-1, null];
                return Promise.resolve([0, [screen.width, screen.height].sort().reverse().join("x")]);
            },
            jsHeapSizeLimit: function () {
                return new Promise(function (resolve) {
                    let perf = window.performance;
                    if (perf !== undefined) {
                        let memory = perf.memory;
                        if (memory !== undefined) {
                            let jsHeapSizeLimit = memory.jsHeapSizeLimit;
                            if (jsHeapSizeLimit !== undefined) {
                                resolve(jsHeapSizeLimit);
                            }
                        }
                    }
                    resolve(-1);
                });
            },
            audioContext: function () {
                return new Promise(function (resolve) {
                    if (isBrave())
                        resolve(0);
                    let context = window.OfflineAudioContext || window.webkitOfflineAudioContext;
                    if (typeof context !== "function")
                        resolve(-1);
                    context = new (context)(1, 44100, 44100);
                    // console.log(context);
                    let pxi_oscillator = context.createOscillator();
                    pxi_oscillator.type = "triangle";
                    pxi_oscillator.frequency.value = 1e4;
                    let pxi_compressor = context.createDynamicsCompressor();
                    pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
                    pxi_compressor.knee && (pxi_compressor.knee.value = 40);
                    pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
                    pxi_compressor.reduction && (pxi_compressor.reduction.value = -20);
                    pxi_compressor.attack && (pxi_compressor.attack.value = 0);
                    pxi_compressor.release && (pxi_compressor.release.value = .25);
                    pxi_oscillator.connect(pxi_compressor);
                    pxi_compressor.connect(context.destination);
                    pxi_oscillator.start(0);
                    context.startRendering();
                    context.oncomplete = function (evnt) {
                        var pxi_output = 0;
                        for (var i = 4500; 5e3 > i; i++) {
                            pxi_output += Math.abs(evnt.renderedBuffer.getChannelData(0)[i]);
                        }
                        pxi_compressor.disconnect();
                        resolve(pxi_output);
                    };
                });
            },
            userAgentData: function () {
                return new Promise(function (resolve) {
                    function parseBrand(arr) {
                        let brands = [];
                        if (!arr)
                            return [];
                        for (let i = 0; i < arr.length; i++) {
                            if (!!arr[i].brand) {
                                let brand = arr[i].brand;
                                if (!(new RegExp("Brand", "i").test(brand))) {
                                    brands.push(brand);
                                }
                            }
                        }
                        return brands.sort();
                    }
                    const uad = navigator.userAgentData;
                    if (!uad || typeof uad.getHighEntropyValues !== "function")
                        resolve(-1);
                    uad.getHighEntropyValues(["brands", "mobile", "platform", "architecture", "bitness", "model"]).then(function (s) {
                        resolve([parseBrand(s.brands), s.mobile, s.platform, s.architecture, s.bitness, s.model]);
                    });
                });
            },
            canvasAPI: function () {
                return new Promise(function (resolve) {
                    if ((isSafari() && navigator.maxTouchPoints !== undefined) || isBrave() || isFirefoxResistFingerprinting())
                        resolve(0);
                    const asciiString = unescape("%uD83D%uDE00abcdefghijklmnopqrstuvwxyz%uD83D%uDD2B%uD83C%uDFF3%uFE0F%u200D%uD83C%uDF08%uD83C%uDDF9%uD83C%uDDFC%uD83C%uDFF3%uFE0F%u200D%u26A7%uFE0F0123456789");
                    function canvas_geometry(ctx) {
                        ctx.globalCompositeOperation = "multiply";
                        let a = [
                            ["#f0f", 100, 50],
                            ["#0ff", 50, 50],
                            ["#ff0", 75, 100]
                        ];
                        for (let o = 0; o < a.length; o++) {
                            let u = a[o];
                            let s = u[0];
                            let c = u[1];
                            let l = u[2];
                            ctx.fillStyle = s;
                            ctx.beginPath();
                            ctx.arc(c, l, 50, 0, 2 * Math.PI, !0);
                            ctx.closePath();
                            ctx.fill();
                        }
                        let r = [
                            ["#f2f", 190, 40],
                            ["#2ff", 230, 40],
                            ["#ff2", 210, 80]
                        ];
                        for (let n = 0; n < r.length; n++) {
                            let i = r[n];
                            ctx.fillStyle = i[0];
                            ctx.beginPath();
                            ctx.arc(i[1], i[2], 40, 0, 2 * Math.PI, !0);
                            ctx.closePath();
                            ctx.fill();
                        }
                        ctx.fillStyle = "#f9c";
                        ctx.arc(210, 60, 60, 0, 2 * Math.PI, !0);
                        ctx.arc(210, 60, 20, 0, 2 * Math.PI, !0);
                        ctx.fill("evenodd");
                        return !ctx.isPointInPath(5, 5, "evenodd");
                    }
                    function canvas_text(ctx) {
                        ctx.globalCompositeOperation = "multiply";
                        ctx.textBaseline = "top";
                        ctx.font = "13px Arial";
                        ctx.textBaseline = "alphabetic";
                        ctx.fillStyle = "#f60";
                        ctx.fillRect(150, 1, 550, 25);
                        ctx.fillStyle = "#069";
                        ctx.fillText(asciiString, 2, 15);
                        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                        ctx.fillText(asciiString, 4, 17);
                        const fonts = ["Times New Roman", "Times", "Georgia", "Palatino", "Garamond", "Bookman", "Comic Sans MS", "Trebuchet MS", "Helvetica", "Baskerville", "Akzidenz Grotesk", "Gotham", "Bodoni", "Didot", "Futura", "Gill Sans", "Frutiger", "Apple Color Emoji", "MS Gothic", "fakefont"];
                        const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
                        for (let i = 0; i < fonts.length; i++) {
                            ctx.font = "12px " + fonts[i];
                            ctx.strokeStyle = colors[i % colors.length];
                            ctx.lineWidth = 2;
                            ctx.strokeText(asciiString, 10 * (Math.ceil(i / 13) * 2) - 10, 30 + ((i + 1) * 10 % 130));
                        }
                        let grd = ctx.createLinearGradient(0, 0, 200, 0.2);
                        grd.addColorStop(0, "rgba(102, 204, 0, 0.1)");
                        grd.addColorStop(1, "#FF0000");
                        ctx.fillStyle = grd;
                        ctx.fillRect(10, 10, 175, 100);
                        return !ctx.isPointInPath(5, 5, "evenodd");
                    }
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    canvas.width = 300;
                    canvas.height = 150;
                    let geometry_winding = canvas_geometry(ctx);
                    let canvas_geometry_fp = murmurhash3_32_gc(canvas.toDataURL(), 420);
                    let combined_winding = canvas_text(ctx);
                    let canvas_combined_fp = murmurhash3_32_gc(canvas.toDataURL(), 420);
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');
                    canvas.width = 300;
                    canvas.height = 150;
                    let text_winding = canvas_text(ctx);
                    let canvas_text_fp = murmurhash3_32_gc(canvas.toDataURL(), 420);
                    resolve({
                        "geometry": {
                            "hash": canvas_geometry_fp,
                            "winding": geometry_winding
                        },
                        "text": {
                            "hash": canvas_text_fp,
                            "winding": text_winding
                        },
                        "combined": {
                            "hash": canvas_combined_fp,
                            "winding": combined_winding
                        }
                    });
                });
            },
            performance: function () {
                return new Promise(function (resolve) {
                    if (!isChrome())
                        resolve([-1, null]);
                    const perf = window.performance;
                    if (perf === undefined)
                        resolve([-2, null]);
                    if (typeof perf.now !== "function")
                        resolve([-3, null]);
                    let valueA = 1;
                    let valueB = 1;
                    let now = perf.now();
                    let newNow = now;
                    for (let i = 0; i < 50000; i++) {
                        if ((now = newNow) < (newNow = perf.now())) {
                            let difference = newNow - now;
                            if (difference > valueA) {
                                if (difference < valueB) {
                                    valueB = difference;
                                }
                            }
                            else if (difference < valueA) {
                                valueB = valueA;
                                valueA = difference;
                            }
                        }
                    }
                    resolve([0, [valueA, valueB]]);
                });
            },
            speechSynthesis: function () {
                return new Promise(function (resolve) {
                    if (isBrave() || isFirefox())
                        resolve(-1);
                    let tripped = false;
                    let synth = window.speechSynthesis;
                    if (synth === undefined)
                        resolve(-2);
                    function populateVoiceList() {
                        let voices = synth.getVoices();
                        let output = [];
                        for (let i = 0; i < voices.length; i++) {
                            let voice = voices[i];
                            output.push([voice.name, voice.voiceURI, voice.default, voice.lang, voice.localService]);
                        }
                        if (output.length > 0 || tripped) {
                            resolve(output.length > 0 ? murmurhash3_32_gc(JSON.stringify(output), 420) : 0);
                        }
                        tripped = true;
                    }
                    populateVoiceList();
                    if (speechSynthesis.onvoiceschanged !== undefined) {
                        speechSynthesis.onvoiceschanged = populateVoiceList;
                    }
                });
            },
            applePay: function () {
                return new Promise(function (resolve) {
                    let ap = window.ApplePaySession;
                    if (typeof ap !== "function")
                        resolve([-1, null]);
                    let enabled = ap.canMakePayments();
                    resolve([0, enabled]);
                });
            },
            attributionsourceid: function () {
                return new Promise(function (resolve) {
                    const a = document.createElement("a").attributionsourceid;
                    if (a !== undefined) {
                        resolve([0, String(a)]);
                    }
                    else {
                        resolve([-1, null]);
                    }
                });
            },
            webglInfo: function () {
                return new Promise(function (resolve) {
                    const canvas = document.createElement('canvas');
                    try {
                        var context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") || resolve(-1);
                    }
                    catch (e) {
                        resolve(-2);
                    }
                    let output = {};
                    const debugExtension = context.getExtension('WEBGL_debug_renderer_info');
                    if (!debugExtension)
                        resolve(-1);
                    output.unmaskedVendor = isBrave() ? null : context.getParameter(debugExtension.UNMASKED_VENDOR_WEBGL);
                    output.unmaskedRenderer = isBrave() ? null : context.getParameter(debugExtension.UNMASKED_RENDERER_WEBGL);
                    output.version = context.getParameter(context.VERSION);
                    output.shaderVersion = context.getParameter(context.SHADING_LANGUAGE_VERSION);
                    output.vendor = context.getParameter(context.VENDOR);
                    output.renderer = context.getParameter(context.RENDERER);
                    output.attributes = [];
                    let glContextAttributes = context.getContextAttributes();
                    for (let att in glContextAttributes) {
                        if (glContextAttributes.hasOwnProperty(att)) {
                            output.attributes.push(att + "=" + glContextAttributes[att]);
                        }
                    }
                    let parameterNames = ["ACTIVE_TEXTURE", "ALIASED_LINE_WIDTH_RANGE", "ALIASED_POINT_SIZE_RANGE", "ALPHA_BITS", "ARRAY_BUFFER_BINDING", "BLEND", "BLEND_COLOR", "BLEND_DST_ALPHA", "BLEND_DST_RGB", "BLEND_EQUATION", "BLEND_EQUATION_ALPHA", "BLEND_EQUATION_RGB", "BLEND_SRC_ALPHA", "BLEND_SRC_RGB", "BLUE_BITS", "COLOR_CLEAR_VALUE", "COLOR_WRITEMASK", "COMPRESSED_TEXTURE_FORMATS", "CULL_FACE", "CULL_FACE_MODE", "CURRENT_PROGRAM", "DEPTH_BITS", "DEPTH_CLEAR_VALUE", "DEPTH_FUNC", "DEPTH_RANGE", "DEPTH_TEST", "DEPTH_WRITEMASK", "DITHER", "ELEMENT_ARRAY_BUFFER_BINDING", "FRAMEBUFFER_BINDING", "FRONT_FACE", "GENERATE_MIPMAP_HINT", "GREEN_BITS", "IMPLEMENTATION_COLOR_READ_FORMAT", "IMPLEMENTATION_COLOR_READ_TYPE", "LINE_WIDTH", "MAX_COMBINED_TEXTURE_IMAGE_UNITS", "MAX_CUBE_MAP_TEXTURE_SIZE", "MAX_FRAGMENT_UNIFORM_VECTORS", "MAX_RENDERBUFFER_SIZE", "MAX_TEXTURE_IMAGE_UNITS", "MAX_TEXTURE_SIZE", "MAX_VARYING_VECTORS", "MAX_VERTEX_ATTRIBS", "MAX_VERTEX_TEXTURE_IMAGE_UNITS", "MAX_VERTEX_UNIFORM_VECTORS", "MAX_VIEWPORT_DIMS", "PACK_ALIGNMENT", "POLYGON_OFFSET_FACTOR", "POLYGON_OFFSET_FILL", "POLYGON_OFFSET_UNITS", "RED_BITS", "RENDERBUFFER_BINDING", "SAMPLE_BUFFERS", "SAMPLE_COVERAGE_INVERT", "SAMPLE_COVERAGE_VALUE", "SAMPLES", "SCISSOR_BOX", "SCISSOR_TEST", "STENCIL_BACK_FAIL", "STENCIL_BACK_FUNC", "STENCIL_BACK_PASS_DEPTH_FAIL", "STENCIL_BACK_PASS_DEPTH_PASS", "STENCIL_BACK_REF", "STENCIL_BACK_VALUE_MASK", "STENCIL_BACK_WRITEMASK", "STENCIL_BITS", "STENCIL_CLEAR_VALUE", "STENCIL_FAIL", "STENCIL_FUNC", "STENCIL_PASS_DEPTH_FAIL", "STENCIL_PASS_DEPTH_PASS", "STENCIL_REF", "STENCIL_TEST", "STENCIL_VALUE_MASK", "STENCIL_WRITEMASK", "SUBPIXEL_BITS", "TEXTURE_BINDING_2D", "TEXTURE_BINDING_CUBE_MAP", "UNPACK_ALIGNMENT", "UNPACK_COLORSPACE_CONVERSION_WEBGL", "UNPACK_FLIP_Y_WEBGL", "UNPACK_PREMULTIPLY_ALPHA_WEBGL", "VIEWPORT"];
                    output.parameters = [];
                    for (let i = 0; i < parameterNames.length; i++) {
                        output.parameters.push(parameterNames[i] + "=" + context.getParameter(context[parameterNames[i]]));
                    }
                    function getShaderPrecision(shaderType, precisionType) {
                        let shaderPrecision = context.getShaderPrecisionFormat(context[shaderType], context[precisionType]);
                        return [shaderPrecision.rangeMin, shaderPrecision.rangeMax, shaderPrecision.precision];
                    }
                    let shaderTypes = ["FRAGMENT_SHADER", "VERTEX_SHADER"];
                    let precisionTypes = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT", "LOW_INT", "MEDIUM_INT", "HIGH_INT"];
                    output.shaderPrecision = [];
                    for (var i = 0; i < shaderTypes.length; i++) {
                        var shaderType = shaderTypes[i];
                        for (var j = 0; j < precisionTypes.length; j++) {
                            output.shaderPrecision.push(getShaderPrecision(shaderType, precisionTypes[j]));
                        }
                    }
                    output.extensions = [];
                    let extensions = context.getSupportedExtensions();
                    for (var i = 0; i < extensions.length; i++) {
                        output.extensions.push(extensions[i]);
                    }
                    const extensionList = {
                        WEBGL_compressed_texture_s3tc: ["COMPRESSED_RGB_S3TC_DXT1_EXT", "COMPRESSED_RGBA_S3TC_DXT1_EXT", "COMPRESSED_RGBA_S3TC_DXT3_EXT", "COMPRESSED_RGBA_S3TC_DXT5_EXT"],
                        WEBGL_compressed_texture_s3tc_srgb: ["COMPRESSED_SRGB_S3TC_DXT1_EXT", "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT"],
                        WEBGL_compressed_texture_etc: ["COMPRESSED_R11_EAC", "COMPRESSED_SIGNED_R11_EAC", "COMPRESSED_RG11_EAC", "COMPRESSED_SIGNED_RG11_EAC", "COMPRESSED_RGB8_ETC2", "COMPRESSED_RGBA8_ETC2_EAC", "COMPRESSED_SRGB8_ETC2",
                            "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2"
                        ],
                        WEBGL_compressed_texture_pvrtc: ["COMPRESSED_RGB_PVRTC_4BPPV1_IMG", "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG", "COMPRESSED_RGB_PVRTC_2BPPV1_IMG", "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG"],
                        WEBGL_compressed_texture_etc1: ["COMPRESSED_RGB_ETC1_WEBGL"],
                        WEBGL_compressed_texture_atc: ["COMPRESSED_RGB_ATC_WEBGL", "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL", "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL"],
                        WEBGL_compressed_texture_astc: ["COMPRESSED_RGBA_ASTC_4x4_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR", "COMPRESSED_RGBA_ASTC_5x4_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR", "COMPRESSED_RGBA_ASTC_5x5_KHR",
                            "COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR", "COMPRESSED_RGBA_ASTC_6x5_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR", "COMPRESSED_RGBA_ASTC_6x6_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR", "COMPRESSED_RGBA_ASTC_8x5_KHR",
                            "COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR", "COMPRESSED_RGBA_ASTC_8x6_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR", "COMPRESSED_RGBA_ASTC_8x8_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR", "COMPRESSED_RGBA_ASTC_10x5_KHR",
                            "COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR", "COMPRESSED_RGBA_ASTC_10x6_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR", "COMPRESSED_RGBA_ASTC_10x6_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR", "COMPRESSED_RGBA_ASTC_10x10_KHR",
                            "COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR", "COMPRESSED_RGBA_ASTC_12x10_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR", "COMPRESSED_RGBA_ASTC_12x12_KHR", "COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR"
                        ],
                        ANGLE_instanced_arrays: ["VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE"],
                        EXT_blend_minmax: ["MIN_EXT", "MAX_EXT"],
                        EXT_color_buffer_half_float: ["RGBA16F_EXT", "RGB16F_EXT", "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT", "UNSIGNED_NORMALIZED_EXT"],
                        EXT_disjoint_timer_query: ["GPU_DISJOINT_EXT"],
                        EXT_sRGB: ["SRGB_EXT", "SRGB_ALPHA_EXT", "SRGB8_ALPHA8_EXT", "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT"],
                        EXT_texture_filter_anisotropic: ["MAX_TEXTURE_MAX_ANISOTROPY_EXT", "TEXTURE_MAX_ANISOTROPY_EXT"],
                        OES_standard_derivatives: ["FRAGMENT_SHADER_DERIVATIVE_HINT_OES"],
                        OES_texture_half_float: ["HALF_FLOAT_OES"],
                        OES_vertex_array_object: ["VERTEX_ARRAY_BINDING_OES"],
                        WEBGL_color_buffer_float: ["RGBA32F_EXT", "RGB32F_EXT", "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT", "UNSIGNED_NORMALIZED_EXT"],
                        WEBGL_depth_texture: ["UNSIGNED_INT_24_8_WEBGL"],
                        WEBGL_draw_buffers: ["COLOR_ATTACHMENT0_WEBGL", "COLOR_ATTACHMENT1_WEBGL", "COLOR_ATTACHMENT15_WEBGL", "DRAW_BUFFER0_WEBGL", "DRAW_BUFFER1_WEBGL", "DRAW_BUFFER15_WEBGL", "MAX_COLOR_ATTACHMENTS_WEBGL", "MAX_DRAW_BUFFERS_WEBGL"]
                    };
                    const vendorPrefixes = ["", "WEBKIT_", "MOZ_", "O_", "MS_"];
                    output.constants = [];
                    for (let i = 0; i < vendorPrefixes.length; i++) {
                        let vendorPrefix = vendorPrefixes[i];
                        for (let extension in extensionList) {
                            if (extensionList.hasOwnProperty(extension)) {
                                let extensionParameters = extensionList[extension];
                                let supported = context.getExtension(vendorPrefix + extension);
                                if (supported) {
                                    for (let j = 0; j < extensionParameters.length; j++) {
                                        let extensionParameter = extensionParameters[j];
                                        let extensionParameterValue = supported[extensionParameter];
                                        output.constants.push(vendorPrefix + extension + '_' + extensionParameter + "=" + extensionParameterValue);
                                    }
                                }
                            }
                        }
                    }
                    output.attributes = murmurhash3_32_gc(JSON.stringify(output.attributes), 420);
                    output.parameters = murmurhash3_32_gc(JSON.stringify(output.parameters), 420);
                    output.shaderPrecision = isBrave() ? 0 : murmurhash3_32_gc(JSON.stringify(output.shaderPrecision), 420);
                    output.extensions = isBrave() ? 0 : murmurhash3_32_gc(JSON.stringify(output.extensions), 420);
                    output.constants = isBrave() ? 0 : murmurhash3_32_gc(JSON.stringify(output.constants), 420);
                    resolve(output);
                });
            },
            webglProgram: function () {
                return new Promise(function (resolve) {
                    if (isBrave())
                        resolve(0);
                    const canvas = document.createElement('canvas');
                    try {
                        var context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") || resolve(-1);
                    }
                    catch (e) {
                        resolve(-2);
                    }
                    context.clearColor(0, 0, 1, 1);
                    let program = context.createProgram();
                    function helper(x, y) {
                        let shader = context.createShader(35633 - x);
                        context.shaderSource(shader, y);
                        context.compileShader(shader);
                        context.attachShader(program, shader);
                    }
                    helper(0, 'attribute vec2 p;uniform float t;void main(){float s=sin(t);float c=cos(t);gl_Position=vec4(p*mat2(c,s,-s,c),1,1);}');
                    helper(1, 'void main(){gl_FragColor=vec4(1,0,0,1);}');
                    context.linkProgram(program);
                    context.useProgram(program);
                    context.enableVertexAttribArray(0);
                    let uniform = context.getUniformLocation(program, 't');
                    let buffer = context.createBuffer();
                    context.bindBuffer(34962, buffer);
                    context.bufferData(34962, new Float32Array([0, 1, -1, -1, 1, -1]), 35044);
                    context.vertexAttribPointer(0, 2, 5126, false, 0, 0);
                    context.clear(16384);
                    context.uniform1f(uniform, 3.65);
                    context.drawArrays(4, 0, 3);
                    resolve(murmurhash3_32_gc(canvas.toDataURL(), 420));
                });
            },
            fonts: function () {
                return new Promise(function (resolve) {
                    if (isBrave())
                        resolve(0);
                    const fontMode = (isSafari() && !isFirefox()) || isMSIE();
                    const fontList = fontMode ? ["fakefont", "Apple Color Emoji", "sans-serif-thin", "ARNO PRO", "Agency FB", "Arabic Typesetting", "Arial Unicode MS", "AvantGarde Bk BT", "BankGothic Md BT", "Batang", "Bitstream Vera Sans Mono", "Calibri", "Century", "Century Gothic", "Clarendon", "EUROSTILE", "Franklin Gothic", "Futura Bk BT", "Futura Md BT", "GOTHAM", "Gill Sans", "HELV", "Haettenschweiler", "Helvetica Neue", "Humanst521 BT", "Leelawadee", "Letter Gothic", "Levenim MT", "Lucida Bright", "Lucida Sans", "Menlo", "MS Mincho", "MS Outlook", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MYRIAD PRO", "Marlett", "Meiryo UI", "Microsoft Uighur", "Minion Pro", "Monotype Corsiva", "PMingLiU", "Pristina", "SCRIPTINA", "Segoe UI Light", "Serifa", "SimHei", "Small Fonts", "Staccato222 BT", "TRAJAN PRO", "Univers CE 55 Medium", "Vrinda", "ZWAdobeF", "Bauhaus 93", "FORTE", "Book Antiqua", "Liberation Sans", "Liberation Serif", "Liberation Mono", "Liberation Sans Narrow", "Droid Naskh Shift", "Droid Naskh Shift Alt", "Droid Naskh System UI", "Droid Naskh UI", "Droid Robot Regular", "Droid Sans", "Droid Sans Fallback", "Droid Sans Hebrew", "Droid Sans Japanese", "Droid Sans Mono", "Droid Sans Thai", "Droid Serif", "DroidSansFallback", "Noto Naskh Arabic", "Ubuntu Mono derivative Powerline", "Ubuntu Mono derivative Powerline Bold", "Ubuntu Mono derivative Powerline Bold Italic", "Ubuntu Mono derivative Powerline Italic", "Adobe Caslon", "Adobe Caslon Pro", "Adobe Caslon Pro Bold", "Adobe Devanagari", "Adobe Fan Heiti Std B", "Adobe Fangsong Std", "Adobe Fangsong Std R", "Adobe Garamond", "Adobe Garamond Pro", "Adobe Garamond Pro Bold", "Adobe Gothic Std", "Adobe Gothic Std B", "Adobe Hebrew", "Adobe Heiti Std R", "Adobe Jenson", "Adobe Kaiti Std R", "Adobe Ming Std L", "Adobe Myungjo Std M", "Adobe Naskh Medium", "Adobe Song Std L", "Orator Std Slanted", "Poplar Std", "Prestige Elite Std Bd", "Rosewood Std Regular", "Giddyup Std", "Hobo Std", "Hobo Std Medium", "Birch Std", "Blackoak Std", "TeamViewer13", "TeamViewer14", "TeamViewer15", "TeamViewer16"] : ["fakefont", "TeamViewer10", "TeamViewer11", "TeamViewer12", "TeamViewer13", "TeamViewer7", "TeamViewer8", "TeamViewer9", ".Mondulkiri U GR 1.5", "AIGDT", "AMGDT", "Abel", "Aboriginal Sans", "Aboriginal Serif", "Abyssinica SIL", "AcadEref", "Acumin", "Adobe Arabic", "Adobe Caslon", "Adobe Caslon Pro", "Adobe Caslon Pro Bold", "Adobe Devanagari", "Adobe Fan Heiti Std B", "Adobe Fangsong Std", "Adobe Fangsong Std R", "Adobe Garamond", "Adobe Garamond Pro", "Adobe Garamond Pro Bold", "Adobe Gothic Std", "Adobe Gothic Std B", "Adobe Hebrew", "Adobe Heiti Std R", "Adobe Jenson", "Adobe Kaiti Std R", "Adobe Ming Std L", "Adobe Myungjo Std M", "Adobe Naskh Medium", "Adobe Song Std L", "Agency FB", "Aharoni", "Akaash", "Akshar Unicode", "AksharUnicode", "Al Bayan", "Alexandra Script", "Algerian", "Amadeus", "AmdtSymbols", "AnastasiaScript", "Andale Mono", "Andalus", "Angsana New", "AngsanaUPC", "AnjaliOldLipi", "Annabelle", "Aparajita", "Apple Casual", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "AppleGothic", "AppleMyungjo", "Arabic Transparent", "Arabic Typesetting", "Arial", "Arial AMU", "Arial Baltic", "Arial Black", "Arial CE", "Arial CYR", "Arial Cyr", "Arial Greek", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial TUR", "Arial Unicode MS", "Ariston", "Arno Pro", "Arno Pro Caption", "Arno Pro Display", "Arno Pro Light Display", "Arno Pro SmText", "Arno Pro Smbd", "Arno Pro Smbd Caption", "Arno Pro Smbd Display", "Arno Pro Smbd SmText", "Arno Pro Smbd Subhead", "Arno Pro Subhead", "Asana Math", "Ayuthaya", "BJCree Uni", "BPG Classic 99U", "BPG Paata Khutsuri U", "Bangla MN", "Bangla Sangam MN", "BankGothic Lt BT", "BankGothic Md BT", "Baskerville Old Face", "Batang", "BatangChe", "Bauhaus 93", "Bell Gothic Std Black", "Bell Gothic Std Light", "Bell MT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "Bickham Script One", "Bickham Script Pro Regular", "Bickham Script Pro Semibold", "Bickham Script Two", "Birch Std", "Bitstream Vera Sans Mono", "Blackadder ITC", "Blackoak Std", "Bernard Condensed", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Book Antiqua", "Bookman Old Style", "Bookshelf Symbol 7", "Bradley Hand ITC", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Brush Script Std", "CDT Khmer", "Calibri", "Calibri Light", "Californian FB", "Calisto MT", "Calligraph", "Cambria", "Cambria Math", "Candara", "Carolina", "Castellar", "Centaur", "Century", "Century Gothic", "Century Schoolbook", "Ceremonious Two", "Chaparral Pro", "Chaparral Pro Light", "Charcoal CY", "Charis SIL Compact", "Charlemagne Std", "Chiller", "CityBlueprint", "Clarendon BT", "Clarendon Blk BT", "Clarendon Lt BT", "Clear Sans", "Code2000", "Colonna MT", "Comic Sans", "Comic Sans MS", "CommercialPi BT", "CommercialScript BT", "Complex", "Consolas", "Constantia", "Cooper Black", "Cooper Std Black", "Copperplate Gothic Bold", "Copperplate Gothic Light", "Copyist", "Corbel", "Cordia New", "CordiaUPC", "CountryBlueprint", "Courier", "Courier New", "Courier New Baltic", "Courier New CE", "Courier New CYR", "Courier New Cyr", "Courier New Greek", "Courier New TUR", "Curlz MT", "DFKai-SB", "DaunPenh", "David", "DecoType Naskh", "Decor", "DejaVu Math TeX Gyre", "DejaVu Sans", "DejaVu Sans Condensed", "DejaVu Sans Light", "DejaVu Sans Mono", "DejaVu Serif", "DejaVu Serif Condensed", "Devanagari MT", "Devanagari Sangam MN", "DilleniaUPC", "DokChampa", "Dotum", "DotumChe", "Droid Naskh Shift", "Droid Naskh Shift Alt", "Droid Naskh System UI", "Droid Naskh UI", "Droid Robot Regular", "Droid Sans", "Droid Sans Fallback", "Droid Sans Hebrew", "Droid Sans Japanese", "Droid Sans Mono", "Droid Sans Thai", "Droid Serif", "DroidSansFallback", "Dutch801 Rm BT", "Dutch801 XBd BT", "Ebrima", "Eccentric Std", "Edwardian Script ITC", "Ekushey Punarbhaba", "Elephant", "Engravers MT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "Estrangelo Edessa", "Ethiopia Jiret", "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EuroRoman", "Eurostile", "FTEasci1", "FTEasci1-f", "FTEasci2", "FTEasci2-f", "FTEbaudo", "FTEbaudo-f", "FTEebcd1", "FTEebcd1-f", "FTEebcd2", "FTEebcd2-f", "FTEspec", "FTEspec-f", "FangSong", "Felix Titling", "Fira Code", "Fira Mono", "Fira Sans", "Fixed Miriam Transparent", "Fixedsys", "Footlight MT Light", "Forte", "FrankRuehl", "Franklin Gothic Book", "Franklin Gothic Demi", "Franklin Gothic Demi Cond", "Franklin Gothic Heavy", "Franklin Gothic Medium", "Franklin Gothic Medium Cond", "Freehand521 BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "Futura Md BT", "GDT", "GENISO", "GF Zemen Unicode", "Gabriola", "Gadugi", "Garamond", "Garamond Premr Pro", "Garamond Premr Pro Smbd", "Gautami", "Geeza Pro", "Geneva", "Gentium Basic", "Gentium Book Basic", "Georgia", "Giddyup Std", "Gigi", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GothicE", "GothicG", "GothicI", "Goudy Old Style", "Goudy Stout", "GreekC", "GreekS", "Gujarati MT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MT", "Guttman Yad", "HYSerif", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather Script One", "Heiti SC", "Heiti TC", "Helvetica", "Helvetica Neue", "High Tower Text", "Hiragino Kaku Gothic Pro", "Hiragino Kaku Gothic ProN", "Hiragino Mincho Pro", "Hiragino Mincho ProN", "Hobo Std", "Hoefler Text", "ISOCP", "ISOCP2", "ISOCP3", "ISOCPEUR", "ISOCT", "ISOCT2", "ISOCT3", "ISOCTEUR", "Impact", "Imprint MT Shadow", "InaiMathi", "Informal Roman", "IrisUPC", "Iskoola Pota", "Italic", "ItalicC", "ItalicT", "JasmineUPC", "Jokerman", "Jomolhari", "Juice ITC", "KaiTi", "KaiTi_GB2312", "Kailasa", "Kaiti SC", "Kaiti TC", "Kalinga", "Kannada MN", "Kannada Sangam MN", "Kartika", "Kedage", "Kefa", "Kh-SrokKhleang", "Khmer MN", "Khmer OS", "Khmer OS Fasthand", "Khmer OS Freehand", "Khmer OS Metal Chrieng", "Khmer OS Muol", "Khmer OS System", "Khmer Sangam MN", "Khmer UI", "KodchiangUPC", "Kokila", "Kozuka Gothic Pr6N B", "Kozuka Gothic Pr6N EL", "Kozuka Gothic Pr6N H", "Kozuka Gothic Pr6N L", "Kozuka Gothic Pr6N M", "Kozuka Gothic Pr6N R", "Kozuka Gothic Pro B", "Kozuka Gothic Pro EL", "Kozuka Gothic Pro H", "Kozuka Gothic Pro L", "Kozuka Gothic Pro M", "Kozuka Gothic Pro R", "Kozuka Mincho Pr6N B", "Kozuka Mincho Pr6N EL", "Kozuka Mincho Pr6N H", "Kozuka Mincho Pr6N L", "Kozuka Mincho Pr6N M", "Kozuka Mincho Pr6N R", "Kozuka Mincho Pro B", "Kozuka Mincho Pro EL", "Kozuka Mincho Pro H", "Kozuka Mincho Pro L", "Kozuka Mincho Pro M", "Kozuka Mincho Pro R", "Kristen ITC", "Ktav", "KufiStandardGK", "Kunstler Script", "LUCIDA GRANDE", "Lao UI", "Latha", "Latin Modern Math", "Leelawadee", "Letter Gothic Std", "Levenim MT", "LiHei Pro", "LiSong Pro", "Liberation Sans", "Liberation Serfi", "Liberation Mono", "Liberation Sans Narrow", "Libertinus Math", "Likhan", "LilyUPC", "Lithos Pro Regular", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "Lucida Grande", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "MS Gothic", "MS Mincho", "MS Outlook", "MS PGothic", "MS PMincho", "MS Reference Sans Serif", "MS Reference Specialty", "MS Sans Serif", "MS Serif", "fakefont2", "MS Song", "MS UI Gothic", "MT Extra", "MV Boli", "MYRIAD", "MYRIAD PRO", "Magneto", "Maiandra GD", "Malayalam MN", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marlett", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Mesquite Std", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft JhengHei UI", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft YaHei UI", "Microsoft Yi Baiti", "Ming(for ISO10646)", "MingLiU", "MingLiU-ExtB", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiu_HKSCS", "Minion Pro", "Minion Pro Cond", "Minion Pro Med", "Minion Pro SmBd", "Miriam", "Miriam Fixed", "Mistral", "Mitra Mono", "Modern", "Modern No. 20", "Monaco", "Mongolian Baiti", "Monospac821 BT", "Monotxt", "Monotype Corsiva", "MoolBoran", "MotoyaLCedar", "MotoyaLMaru", "Mshtakan", "Mukti Narrow", "Myriad Arabic", "Myriad Hebrew", "Myriad Pro", "Myriad Pro Cond", "Myriad Pro Light", "Myriad Web Pro", "NSimSun", "NanumGothic", "Narkisim", "Niagara Engraved", "Niagara Solid", "Nirmala UI", "Noto Mono", "Noto Color Emoji", "Noto Emoji", "Noto Kufi Arabic ", "Noto Naskh Arabic", "Noto Sans", "Noto Sans CJK JP", "Noto Sans CJK KR", "Noto Sans CJK SC", "Noto Sans CJK TC", "Noto Sans JP", "Noto Sans KR", "Noto Sans Mono CJK JP", "Noto Sans Lao ", "Noto Sans Mono CJK KR", "Noto Sans Mono CJK SC", "Noto Sans Mono CJK TC", "Noto Sans SC", "Noto Sans TC", "Noto Serif", "Noto Serif CJK JP", "Noto Serif CJK KR", "Noto Serif CJK SC", "Noto Serif CJK TC", "Noto Serif Ahom", "Nueva Std", "Nueva Std Cond", "Nyala", "OCR A Extended", "OCR A Std", "OCR-A BT", "OCR-B 10 BT", "Old English Text MT", "Onyx", "OpenSymbol", "Orator Std", "Orator Std Slanted", "Oriya MN", "Oriya Sangam MN", "Osaka-Mono", "OskiDakelh", "Ouverture script", "PMingLiU", "PMingLiU-ExtB", "PMingLiu", "Palace Script MT", "Palatino", "Palatino Linotype", "PanRoman", "Papyrus", "Parchment", "Perpetua", "Perpetua Titling MT", "PhnomPenh OT", "Pigiarniq", "PingFang SC", "PingFang TC", "Plantagenet Cherokee", "Playbill", "Poor Richard", "Poplar Std", "Pothana", "Power Clear", "Power Green", "Power Green Narrow", "Power Green Small", "Power Red and Blue", "Power Red and Blue Intl", "Power Red and Green", "Prestige Elite Std", "Prestige Elite Std Bd", "Pristina", "Proxy 1", "Proxy 2", "Proxy 3", "Proxy 4", "Proxy 5", "Proxy 6", "Proxy 7", "Proxy 8", "Proxy 9", "Raavi", "Rachana_w01", "Rage Italic", "Raghindi", "Ravie", "Roboto", "Roboto Slab", "Roboto Mono", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "RomanC", "RomanD", "RomanS", "RomanT", "Romantic", "Rosewood Std Regular", "STHeiti", "STIX Math", "STIX Two Math", "STIXGeneral", "STSong", "Saab", "Sakkal Majalla", "San Francisco", "SansSerif", "Script", "Script MT Bold", "ScriptC", "ScriptS", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Emoji", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Semilight", "Segoe UI Symbol", "Shonar Bangla", "Showcard Gothic", "Shruti", "SimHei", "SimSun", "SimSun-ExtB", "Simplex", "Simplified Arabic", "Simplified Arabic Fixed", "Sinhala MN", "Sinhala Sangam MN", "Skype UI Symbol", "Small Fonts", "SmartGothic", "Snap ITC", "Songti SC", "Songti TC", "Square721 BT", "Stencil", "Stencil Std", "Stylus BT", "Sun-ExtA", "SuperFrench", "Swis721 BT", "Swis721 BdCnOul BT", "Swis721 BdOul BT", "Swis721 Blk BT", "Swis721 BlkCn BT", "Swis721 BlkEx BT", "Swis721 BlkOul BT", "Swis721 Cn BT", "Swis721 Ex BT", "Swis721 Hv BT", "Swis721 Lt BT", "Swis721 LtCn BT", "Swis721 LtEx BT", "Syastro", "Sylfaen", "Symap", "Symath", "Symbol", "Symeteo", "Symusic", "System", "TITUS Cyberbit Basic", "Tahoma", "TeX Gyre Bonum Math", "TeX Gyre Pagella Math", "TeX Gyre Schola", "TeX Gyre Termes Math", "Technic", "TechnicBold", "TechnicLite", "Tekton Pro", "Tekton Pro Cond", "Tekton Pro Ext", "Telugu MN", "Telugu Sangam MN", "Tempus Sans ITC", "Terminal", "Thonburi", "ThoolikaUnicode", "Tibetan Machine Uni", "Times", "Times New Roman", "Times New Roman Baltic", "Times New Roman CE", "Times New Roman CYR", "Times New Roman Cyr", "Times New Roman Greek", "Times New Roman PS", "Times New Roman TUR", "Traditional Arabic", "Trajan Pro", "Trebuchet MS", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "Twemoji Mozilla", "Txt", "Ubuntu", "Ubuntu Light", "Ubuntu Bold", "Ubuntu Mono", "UniversalMath1 BT", "Uqammaq", "Utsaah", "VL Gothic", "VL PGothic", "Vani", "Verdana", "Vijaya", "Viner Hand ITC", "Vineta BT", "Visual Geez Unicode", "Visual Geez Unicode Agazian", "Visual Geez Unicode Title", "Vivaldi", "Vladimir Script", "Vrinda", "WP Arabic Sihafa", "WP ArabicScript Sihafa", "WP CyrillicA", "WP CyrillicB", "WP Greek Century", "WP Greek Courier", "WP Greek Helve", "WP Hebrew David", "WP MultinationalA Courier", "WP MultinationalA Helve", "WP MultinationalA Roman", "WP MultinationalB Courier", "WP MultinationalB Helve", "WP MultinationalB Roman", "WST_Czec", "WST_Engl", "WST_Fren", "WST_Germ", "WST_Ital", "WST_Span", "WST_Swed", "Webdings", "Wide Latin", "Wingdings", "Wingdings 2", "Wingdings 3", "XITS Math", "Yu Gothic", "Yu Mincho", "ZWAdobeF", "Zuzumbo", "cursive", "fantasy", "monospace", "ori1Uni", "sans-serif", "serif"];
                    let list = [];
                    const baseFonts = ['monospace', 'sans-serif', 'serif'];
                    let body = document.getElementsByTagName("body")[0];
                    let span = document.createElement("span");
                    span.style.fontSize = "72px";
                    span.innerHTML = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz!@#$%^&*()_+-=";
                    let defaultWidth = {};
                    let defaultHeight = {};
                    for (let index in baseFonts) {
                        span.style.fontFamily = baseFonts[index];
                        body.appendChild(span);
                        defaultWidth[baseFonts[index]] = span.offsetWidth;
                        defaultHeight[baseFonts[index]] = span.offsetHeight;
                        body.removeChild(span);
                    }
                    function font_test(font) {
                        return new Promise(function (resolve, reject) {
                            let detected = false;
                            for (let index in baseFonts) {
                                span.style.fontFamily = font + ',' + baseFonts[index];
                                body.appendChild(span);
                                detected = (span.offsetWidth != defaultWidth[baseFonts[index]] || span.offsetHeight != defaultHeight[baseFonts[index]]);
                                body.removeChild(span);
                                if (detected) {
                                    if (list.indexOf(font) === -1)
                                        list.push(font);
                                    resolve(true);
                                }
                            }
                            resolve(false);
                        });
                    }
                    let dfonts = [];
                    for (var fi = 0; fi < fontList.length; fi++) {
                        font_test(fontList[fi]).then(function (promise) {
                            dfonts.push(promise);
                        });
                    }
                    return Promise.all(dfonts).then(new Promise(function () {
                        resolve(list.sort());
                    }));
                });
            },
            plugins: function () {
                return new Promise(function (resolve) {
                    if (isChrome())
                        resolve(0);
                    let plugins = navigator.plugins;
                    let output = [];
                    if (plugins) {
                        for (var i = 0; i < plugins.length; i++) {
                            var plugin = plugins[i];
                            if (plugin) {
                                var mimes = [];
                                for (var l = 0; l < plugin.length; l++) {
                                    var mime = plugin[l];
                                    mimes.push({
                                        type: mime.type,
                                        suffixes: mime.suffixes
                                    });
                                }
                                output.push({
                                    name: plugin.name,
                                    description: plugin.description,
                                    mimes: mimes
                                });
                            }
                        }
                    }
                    resolve(output);
                });
            },
            sharedArrayBuffer: () => {
                return new Promise((resolve) => {
                    if (typeof window.SharedArrayBuffer === "function") {
                        let sab = new window.SharedArrayBuffer(1);
                        if (sab.byteLength !== undefined) {
                            resolve([0, sab.byteLength]);
                        }
                        resolve([-2, null]);
                    }
                    resolve([-1, null]);
                });
            },
            webdriver: () => {
                return new Promise((resolve) => {
                    let webd = navigator.webdriver;
                    if (webd === undefined) {
                        resolve([-1, webd]);
                    }
                    else {
                        resolve([0, webd]);
                    }
                });
            },
            getAttributeNames: () => {
                return new Promise((resolve) => {
                    let de = document.documentElement;
                    if (de === undefined)
                        resolve([-1, null]);
                    if (typeof de.getAttributeNames !== "function")
                        resolve([-2, null]);
                    resolve([0, de.getAttributeNames()]);
                });
            },
            errorToSource: () => {
                return new Promise((resolve) => {
                    try {
                        throw "lol";
                        resolve(-1);
                    }
                    catch (e) {
                        try {
                            let tmp = e.toSource();
                            resolve(true);
                        }
                        catch (ee) {
                            resolve(false);
                        }
                    }
                });
            },
            errors: () => {
                return new Promise((resolve) => {
                    const errorTests = [
                        () => new Function('alert(")'),
                        () => new Function('const foo;foo.bar'),
                        () => new Function('null.bar'),
                        () => new Function('abc.xyz = 123'),
                        () => new Function('(1).toString(1000)'),
                        () => new Function('[...undefined].length'),
                        () => new Function('var x = new Array(-1)'),
                        () => new Function('const a=1; const a=2;')
                    ];
                    let err = [];
                    for (let i = 0; i < errorTests.length; i++) {
                        try {
                            errorTests[i]();
                            err.push(-1);
                        }
                        catch (e) {
                            err.push(e.message);
                        }
                    }
                    ;
                    resolve(err);
                });
            }
        };
        // console.log(fingerprints.speechSynthesis());
        let index = [];
        let promises = [];
        for (let method in fingerprints) {
            index.push(method);
            console.log(method);
            let exe = fingerprints[method]();
            console.log(exe);
            promises.push(exe);
        }
        Promise.all(promises).then((k) => {
            let profile = {};
            for (let i = 0; i < index.length; i++) {
                profile[index[i]] = k[i];
            }
            let output = {
                profile: profile,
                fingerprint: murmurhash3_32_gc(JSON.stringify(profile), 420)
            };
            // console.log(output);
            resolve(output);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
};
exports.fingerprint = fingerprint;
