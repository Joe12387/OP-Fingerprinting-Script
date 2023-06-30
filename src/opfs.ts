/**
 *
 * Overpowered Browser Fingerprinting Script v1.0.2 - (c) 2023 Joe Rutkowski <Joe@dreggle.com> (https://github.com/Joe12387/OP-Fingerprinting-Script)
 *
 **/
const fingerprint = (): Promise<{
  fingerprint: number;
  fingerprints: {
    uniqueFp: number;
    persistentFp: number;
  };
  profile: any[];
}> => {
  function murmurhash3_32_gc(key: string, seed: number): number {
    const remainder = key.length & 3;
    const bytes = key.length - remainder;
    let h1 = seed;
    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;
    let i = 0;

    while (i < bytes) {
      let k1 =
        ((key.charCodeAt(i) & 0xff)) |
        ((key.charCodeAt(++i) & 0xff) << 8) |
        ((key.charCodeAt(++i) & 0xff) << 16) |
        ((key.charCodeAt(++i) & 0xff) << 24);
      ++i;

      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
      h1 = (h1 << 13) | (h1 >>> 19);
      const h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
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

  function isSafari(): boolean {
    const v = navigator.vendor;
    return v !== undefined && v.indexOf("Apple") === 0;
  }

  function isChrome(): boolean {
    const v = navigator.vendor;
    return v !== undefined && v.indexOf("Google") === 0;
  }

  function isFirefox(): boolean {
    return document.documentElement !== undefined && (document.documentElement as any).style.MozAppearance !== undefined;
  }

  function isMSIE(): boolean {
    return (navigator as any).msSaveBlob !== undefined;
  }

  function isBrave(): boolean {
    return isChrome() && (navigator as any).brave !== undefined;
  }

  return new Promise((resolve, reject): void => {
    const fingerprints = {
      platform: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const np = navigator.platform;
          if (np === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, np]);
          }
        });        
      },
      vendor: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const nv = navigator.vendor;
          if (nv === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, nv]);
          }
        });        
      },
      productSub: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const ps = navigator.productSub;
          if (ps === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, ps]);
          }
        });        
      },
      colorDepth: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const cd = window.screen.colorDepth;
          if (cd === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, cd]);
          }
        });        
      },
      pixelDepth: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const pd = window.screen.pixelDepth;
          if (pd === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, pd]);
          }
        });        
      },
      devicePixelRatio: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          // if (isChrome() && !isBrave()) resolve([-2, null]);
          const dpr = window.devicePixelRatio;
          if (dpr === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, dpr]);
          }
        });        
      },
      evalToString: (): Promise<[number, number]> => {
        return Promise.resolve([0, eval.toString().length]);
      },
      maxTouchPoints: (): Promise<[number, any]> => {
        const n = navigator as any;
        return Promise.resolve(n.maxTouchPoints !== undefined ? [0, n.maxTouchPoints] : n.msMaxTouchPoints !== undefined ? [1, n.msMaxTouchPoints] : [-1, null]);
      },
      cpuClass: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const cpu = (navigator as any).cpuClass;
          if (cpu === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, cpu]);
          }
        });        
      },
      hardwareConcurrency: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (isBrave()) {
            return resolve([-2, null]);
          }
          const hc = navigator.hardwareConcurrency;
          if (hc === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, hc]);
          }
        });
      },
      deviceMemory: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (isBrave()) {
            return resolve([-2, null]);
          }
          const dm = (navigator as any).deviceMemory;
          if (dm === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, dm]);
          }
        });
      },
      oscpu: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const os = (navigator as any).oscpu;
          if (os === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, os]);
          }
        });        
      },
      doNotTrack: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const dnt = navigator.doNotTrack;
          if (dnt === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, dnt]);
          }
        });        
      },
      sourceBuffer: (): Promise<[number, string[]]> => {
        return Promise.resolve([0, [typeof SourceBuffer, typeof SourceBufferList]]);
      },
      colorGamut: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const colorGamuts = ["rec2020", "p3", "srgb"];

          for (let i = 0; i < colorGamuts.length; i++) {
            const gamut = colorGamuts[i];
            if (matchMedia("(color-gamut: " + gamut + ")").matches) resolve([0, gamut]);
          }

          resolve([-1, null]);
        });
      },
      reducedMotion: (): Promise<[number, boolean]> => {
        return new Promise((resolve): void => {
          function prm(x: string): boolean {
            return Boolean(matchMedia("(prefers-reduced-motion: " + x + ")").matches);
          }
          resolve([0, prm("reduce") || !prm("no-preference")]);
        });
      },
      hdr: (): Promise<[number, boolean]> => {
        return new Promise((resolve): void => {
          function dr(x: string): boolean {
            return Boolean(matchMedia("(dynamic-range: " + x + ")").matches);
          }
          resolve([0, dr("high") || !dr("standard")]);
        });
      },
      contrast: (): Promise<[number, number]> => {
        return new Promise((resolve): void => {
          function pc(x: string): boolean {
            return Boolean(matchMedia("(prefers-contrast: " + x + ")").matches);
          }
          resolve([0, pc("no-preference") ? 0 : pc("high") || pc("more") ? 1 : pc("low") || pc("less") ? -1 : pc("forced") ? 10 : -1]);
        });
      },
      invertedColors: (): Promise<[number, boolean]> => {
        return new Promise((resolve): void => {
          function ic(x: string): boolean {
            return Boolean(matchMedia("(inverted-colors: " + x + ")").matches);
          }
          resolve([0, ic("inverted") || !ic("none")]);
        });
      },
      forcedColors: (): Promise<[number, boolean]> => {
        return new Promise((resolve): void => {
          function fc(x: string): boolean {
            return Boolean(matchMedia("(forced-colors: " + x + ")").matches);
          }
          resolve([0, fc("active") || !fc("none")]);
        });
      },
      monochrome: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (matchMedia("(min-monochrome: 0)").matches) {
            for (let i = 0; i <= 100; ++i) {
              if (matchMedia("(max-monochrome: " + i + ")").matches) resolve([0, i]);
            }
            resolve([-2, null]);
          }
          resolve([-1, null]);
        });
      },
      browserObjects: (): Promise<[number, string[]]> => {
        return new Promise((resolve): void => {
          const foundObjects = [] as string[];

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
            "opr",
          ] as string[];

          for (let i = 0; i < objects.length; i++) {
            if (typeof window[objects[i]] === "object") foundObjects.push(objects[i]);
          }

          resolve([0, foundObjects.sort()]);
        });
      },
      timezone: (): Promise<[number, string]> => {
        return new Promise((resolve): void => {
          const intl = window.Intl;
          const date = intl.DateTimeFormat;
          if (typeof date === "function") {
            const tz = (new date).resolvedOptions().timeZone;
            if (tz) resolve([0, tz]);
          }
          const year = (new Date).getFullYear();
          const utc = -Math.max(parseFloat(String(new Date(year, 0, 1).getTimezoneOffset())), parseFloat(String(new Date(year, 6, 1).getTimezoneOffset())));
          resolve([1, "UTC" + (utc >= 0 ? "+" : "-") + Math.abs(utc)]);
        });
      },
      timezoneOffset: (): Promise<[number, number]> => {
        return new Promise((resolve): void => {
          const year = (new Date).getFullYear();
          resolve([0, -Math.max(parseFloat(String(new Date(year, 0, 1).getTimezoneOffset())), parseFloat(String(new Date(year, 6, 1).getTimezoneOffset())))]);
        });
      },
      language: (): Promise<[number, string[]]> => {
        return new Promise((resolve): void => {
          const n = navigator as any;
          const lang_str = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
          let lang_arr = [];

          if (!isChrome() && Array.isArray(n.languages)) {
            lang_arr = n.languages;
          }

          resolve([0, [lang_str, lang_arr]]);
        });
      },
      screenResolution: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (isBrave()) resolve([-2, null]);
          resolve([0, [screen.width || 0, screen.height || 0]]);
        });
      },
      jsHeapSizeLimit: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const perf = window.performance as any;
          if (perf == undefined) resolve([-1, null]);
          const memory = perf.memory;
          if (memory === undefined) resolve([-2, null]);
          const jsHeapSizeLimit = memory.jsHeapSizeLimit;
          if (jsHeapSizeLimit === undefined) resolve([-3, null]);
          resolve([0, jsHeapSizeLimit]);
        });
      },
      audioContext: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (isBrave()) resolve([-1, null]);

          let context = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;

          if (typeof context !== "function") resolve([-2, null]);

          context = new(context)(1, 44100, 44100) as any;

          const pxi_oscillator = (context as any).createOscillator();
          pxi_oscillator.type = "triangle";
          pxi_oscillator.frequency.value = 1e4;

          const pxi_compressor = (context as any).createDynamicsCompressor();
          pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
          pxi_compressor.knee && (pxi_compressor.knee.value = 40);
          pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
          pxi_compressor.reduction && (pxi_compressor.reduction.value = -20);
          pxi_compressor.attack && (pxi_compressor.attack.value = 0);
          pxi_compressor.release && (pxi_compressor.release.value = .25);

          pxi_oscillator.connect(pxi_compressor);
          pxi_compressor.connect((context as any).destination);

          pxi_oscillator.start(0);
          (context as any).startRendering();
          (context as any).oncomplete = (evnt: any) => {
            let pxi_output = 0;
            for (let i = 4500; 5e3 > i; i++) {
              pxi_output += Math.abs(evnt.renderedBuffer.getChannelData(0)[i]);
            }
            pxi_compressor.disconnect();
            resolve([0, pxi_output]);
          }
        });
      },
      userAgentData: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          function parseBrand(arr: any[]): string[] {
            const brands = [] as string[];
            if (!arr) return [];
            for (let i = 0; i < arr.length; i++) {
              if (!!arr[i].brand) {
                const brand = arr[i].brand;
                if (!(new RegExp("Brand", "i").test(brand))) {
                  brands.push(brand);
                }
              }
            }
            return brands.sort();
          }

          const uad = (navigator as any).userAgentData;
          if (!uad) resolve([-1, null]);
          if (typeof uad.getHighEntropyValues !== "function") resolve([-2, null]);
          uad.getHighEntropyValues(["brands", "mobile", "platform", "architecture", "bitness", "model"]).then((s: any): void => {
            resolve([0, [parseBrand(s.brands), s.mobile, s.platform, s.architecture, s.bitness, s.model]]);
          });
        });
      },
      canvasAPI: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if ((isSafari() && navigator.maxTouchPoints !== undefined) || isBrave() /*|| isFirefoxResistFingerprinting()*/) resolve([-1, null]);

          const asciiString = unescape("%uD83D%uDE00abcdefghijklmnopqrstuvwxyz%uD83D%uDD2B%uD83C%uDFF3%uFE0F%u200D%uD83C%uDF08%uD83C%uDDF9%uD83C%uDDFC%uD83C%uDFF3%uFE0F%u200D%u26A7%uFE0F0123456789");

          function canvas_geometry(ctx: any): boolean {
            ctx.globalCompositeOperation = "multiply";

            const a = [
              ["#f0f", 100, 50],
              ["#0ff", 50, 50],
              ["#ff0", 75, 100]
            ];

            for (let o = 0; o < a.length; o++) {
              const u = a[o];
              const s = u[0];
              const c = u[1];
              const l = u[2];

              ctx.fillStyle = s;
              ctx.beginPath();
              ctx.arc(c, l, 50, 0, 2 * Math.PI, !0);
              ctx.closePath();
              ctx.fill();
            }

            const r = [
              ["#f2f", 190, 40],
              ["#2ff", 230, 40],
              ["#ff2", 210, 80]
            ];

            for (let n = 0; n < r.length; n++) {
              const i = r[n];
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

          function canvas_text(ctx: any): boolean {
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

            const grd = ctx.createLinearGradient(0, 0, 200, 0.2);
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

          const geometry_winding = canvas_geometry(ctx);
          const canvas_geometry_fp = murmurhash3_32_gc(canvas.toDataURL(), 420);
          const combined_winding = canvas_text(ctx);
          const canvas_combined_fp = murmurhash3_32_gc(canvas.toDataURL(), 420);

          canvas = document.createElement('canvas');
          ctx = canvas.getContext('2d');

          canvas.width = 300;
          canvas.height = 150;

          const text_winding = canvas_text(ctx);
          const canvas_text_fp = murmurhash3_32_gc(canvas.toDataURL(), 420);

          resolve([0, {
            "geometry": {
              "hash": canvas_geometry_fp,
              "winding": geometry_winding,
            },
            "text": {
              "hash": canvas_text_fp,
              "winding": text_winding,
            },
            "combined": {
              "hash": canvas_combined_fp,
              "winding": combined_winding,
            },
          }]);
        });
      },
      performance: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (!isChrome() || isBrave()) resolve([-1, null]);

          const perf = window.performance;

          if (perf === undefined) resolve([-2, null]);
          if (typeof perf.now !== "function") resolve([-3, null]);

          let valueA = 1;
          let valueB = 1;

          let now = perf.now();

          let newNow = now;

          for (let i = 0; i < 5000; i++) {
            if ((now = newNow) < (newNow = perf.now())) {
              const difference = newNow - now;
              if (difference > valueA) {
                if (difference < valueB) {
                  valueB = difference;
                }
              } else if (difference < valueA) {
                valueB = valueA;
                valueA = difference;
              }
            }
          }

          resolve([0, valueA]);
        });
      },
      speechSynthesis: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (isBrave() || isFirefox() || isSafari()) resolve([-1, null]);

          let tripped = false;
          const synth = window.speechSynthesis;
          if (synth === undefined) resolve([-2, null]);

          function populateVoiceList(): void {
            const voices = synth.getVoices();
            const output = [] as any[];
            for (let i = 0; i < voices.length; i++) {
              const voice = voices[i];
              output.push([voice.name, voice.voiceURI, voice.default, voice.lang, voice.localService]);
            }
            if (output.length > 0 || tripped) {
              resolve(output.length > 0 ? [0, murmurhash3_32_gc(JSON.stringify(output), 420)] : [-3, null]);
            }
            tripped = true;
          }

          populateVoiceList();
          if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
          }
        });
      },
      applePay: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (typeof (window as any).ApplePaySession !== "function") resolve([-1, null]);
          const enabled = (window as any).ApplePaySession.canMakePayments();
          resolve([0, enabled]);
        });
      },
      attributionsourceid: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const a = (document.createElement("a") as any).attributionsourceid;
          if (a !== undefined) {
            resolve([0, String(a)]);
          } else {
            resolve([-1, null]);
          }
        });
      },
      webglInfo: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const canvas = document.createElement('canvas');

          try {
            var context = canvas.getContext("webgl") as any || canvas.getContext("experimental-webgl") as any || resolve([-1, null]);
          } catch (e) {
            resolve([-2, null]);
          }

          const output = {} as any;

          const debugExtension = context.getExtension('WEBGL_debug_renderer_info');

          if (!debugExtension) resolve([-3, null]);

          output.unmaskedVendor = isBrave() ? null : context.getParameter(debugExtension.UNMASKED_VENDOR_WEBGL);
          output.unmaskedRenderer = isBrave() ? null : context.getParameter(debugExtension.UNMASKED_RENDERER_WEBGL);
          output.version = context.getParameter(context.VERSION);
          output.shaderVersion = context.getParameter(context.SHADING_LANGUAGE_VERSION);
          output.vendor = context.getParameter(context.VENDOR);
          output.renderer = context.getParameter(context.RENDERER);

          output.attributes = [];

          const glContextAttributes = context.getContextAttributes();
          for (let att in glContextAttributes) {
            if (glContextAttributes.hasOwnProperty(att)) {
              output.attributes.push(att + "=" + glContextAttributes[att]);
            }
          }

          const parameterNames = ["ACTIVE_TEXTURE", "ALIASED_LINE_WIDTH_RANGE", "ALIASED_POINT_SIZE_RANGE", "ALPHA_BITS", "ARRAY_BUFFER_BINDING", "BLEND", "BLEND_COLOR", "BLEND_DST_ALPHA", "BLEND_DST_RGB", "BLEND_EQUATION", "BLEND_EQUATION_ALPHA", "BLEND_EQUATION_RGB", "BLEND_SRC_ALPHA", "BLEND_SRC_RGB", "BLUE_BITS", "COLOR_CLEAR_VALUE", "COLOR_WRITEMASK", "COMPRESSED_TEXTURE_FORMATS", "CULL_FACE", "CULL_FACE_MODE", "CURRENT_PROGRAM", "DEPTH_BITS", "DEPTH_CLEAR_VALUE", "DEPTH_FUNC", "DEPTH_RANGE", "DEPTH_TEST", "DEPTH_WRITEMASK", "DITHER", "ELEMENT_ARRAY_BUFFER_BINDING", "FRAMEBUFFER_BINDING", "FRONT_FACE", "GENERATE_MIPMAP_HINT", "GREEN_BITS", "IMPLEMENTATION_COLOR_READ_FORMAT", "IMPLEMENTATION_COLOR_READ_TYPE", "LINE_WIDTH", "MAX_COMBINED_TEXTURE_IMAGE_UNITS", "MAX_CUBE_MAP_TEXTURE_SIZE", "MAX_FRAGMENT_UNIFORM_VECTORS", "MAX_RENDERBUFFER_SIZE", "MAX_TEXTURE_IMAGE_UNITS", "MAX_TEXTURE_SIZE", "MAX_VARYING_VECTORS", "MAX_VERTEX_ATTRIBS", "MAX_VERTEX_TEXTURE_IMAGE_UNITS", "MAX_VERTEX_UNIFORM_VECTORS", "MAX_VIEWPORT_DIMS", "PACK_ALIGNMENT", "POLYGON_OFFSET_FACTOR", "POLYGON_OFFSET_FILL", "POLYGON_OFFSET_UNITS", "RED_BITS", "RENDERBUFFER_BINDING", "SAMPLE_BUFFERS", "SAMPLE_COVERAGE_INVERT", "SAMPLE_COVERAGE_VALUE", "SAMPLES", "SCISSOR_BOX", "SCISSOR_TEST", "STENCIL_BACK_FAIL", "STENCIL_BACK_FUNC", "STENCIL_BACK_PASS_DEPTH_FAIL", "STENCIL_BACK_PASS_DEPTH_PASS", "STENCIL_BACK_REF", "STENCIL_BACK_VALUE_MASK", "STENCIL_BACK_WRITEMASK", "STENCIL_BITS", "STENCIL_CLEAR_VALUE", "STENCIL_FAIL", "STENCIL_FUNC", "STENCIL_PASS_DEPTH_FAIL", "STENCIL_PASS_DEPTH_PASS", "STENCIL_REF", "STENCIL_TEST", "STENCIL_VALUE_MASK", "STENCIL_WRITEMASK", "SUBPIXEL_BITS", "TEXTURE_BINDING_2D", "TEXTURE_BINDING_CUBE_MAP", "UNPACK_ALIGNMENT", "UNPACK_COLORSPACE_CONVERSION_WEBGL", "UNPACK_FLIP_Y_WEBGL", "UNPACK_PREMULTIPLY_ALPHA_WEBGL", "VIEWPORT"];

          output.parameters = [];
          for (let i = 0; i < parameterNames.length; i++) {
            output.parameters.push(parameterNames[i] + "=" + context.getParameter(context[parameterNames[i]]));
          }

          function getShaderPrecision(shaderType: string, precisionType: string): any[] {
            const shaderPrecision = context.getShaderPrecisionFormat(context[shaderType], context[precisionType]);
            return [shaderPrecision.rangeMin, shaderPrecision.rangeMax, shaderPrecision.precision];
          }

          const shaderTypes = ["FRAGMENT_SHADER", "VERTEX_SHADER"];
          const precisionTypes = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT", "LOW_INT", "MEDIUM_INT", "HIGH_INT"];

          output.shaderPrecision = [];
          for (let i = 0; i < shaderTypes.length; i++) {
            const shaderType = shaderTypes[i];
            for (let j = 0; j < precisionTypes.length; j++) {
              output.shaderPrecision.push(getShaderPrecision(shaderType, precisionTypes[j]));
            }
          }

          output.extensions = [];
          const extensions = context.getSupportedExtensions();
          for (let i = 0; i < extensions.length; i++) {
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
          } as any;

          const vendorPrefixes = ["", "WEBKIT_", "MOZ_", "O_", "MS_"];

          output.constants = [];
          for (let i = 0; i < vendorPrefixes.length; i++) {
            const vendorPrefix = vendorPrefixes[i];
            for (let extension in extensionList) {
              if (extensionList.hasOwnProperty(extension)) {
                const extensionParameters = extensionList[extension];
                const supported = context.getExtension(vendorPrefix + extension);
                if (supported) {
                  for (let j = 0; j < extensionParameters.length; j++) {
                    const extensionParameter = extensionParameters[j];
                    const extensionParameterValue = supported[extensionParameter];
                    output.constants.push(vendorPrefix + extension + '_' + extensionParameter + "=" + extensionParameterValue);
                  }
                }
              }
            }
          }

          // output.attributes = murmurhash3_32_gc(JSON.stringify(output.attributes), 420);
          // output.parameters = murmurhash3_32_gc(JSON.stringify(output.parameters), 420);
          // output.shaderPrecision = murmurhash3_32_gc(JSON.stringify(output.shaderPrecision), 420);
          // output.extensions = murmurhash3_32_gc(JSON.stringify(output.extensions), 420);
          // output.constants = murmurhash3_32_gc(JSON.stringify(output.constants), 420);

          resolve([0, output]);
        });
      },
      webglProgram: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (isBrave()) resolve([-3, null]);

          const canvas = document.createElement('canvas');

          let context: any;
          try {
            context = canvas.getContext("webgl") as any || canvas.getContext("experimental-webgl") as any || resolve([-1, null]);
          } catch (e: any) {
            resolve([-2, null]);
          }

          context.clearColor(0, 0, 1, 1);

          const program = context.createProgram();

          function helper(x: number, y: string) {
            const shader = context.createShader(35633 - x);
            context.shaderSource(shader, y);
            context.compileShader(shader);
            context.attachShader(program, shader);
          }

          helper(0, 'attribute vec2 p;uniform float t;void main(){float s=sin(t);float c=cos(t);gl_Position=vec4(p*mat2(c,s,-s,c),1,1);}');
          helper(1, 'void main(){gl_FragColor=vec4(1,0,0,1);}');

          context.linkProgram(program);
          context.useProgram(program);
          context.enableVertexAttribArray(0);
          const uniform = context.getUniformLocation(program, 't');

          const buffer = context.createBuffer();
          context.bindBuffer(34962, buffer);
          context.bufferData(34962, new Float32Array([0, 1, -1, -1, 1, -1]), 35044);
          context.vertexAttribPointer(0, 2, 5126, false, 0, 0);

          context.clear(16384);
          context.uniform1f(uniform, 3.65);
          context.drawArrays(4, 0, 3);

          resolve([0, murmurhash3_32_gc(canvas.toDataURL(), 420)]);
        });
      },
      fonts: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (isBrave()) resolve([-1, null]);

          const fontMode = (isSafari() && !isFirefox()) || isMSIE();
          const fontList = fontMode ? ["fakefont", "Apple Color Emoji", "sans-serif-thin", "ARNO PRO", "Agency FB", "Arabic Typesetting", "Arial Unicode MS", "AvantGarde Bk BT", "BankGothic Md BT", "Batang", "Bitstream Vera Sans Mono", "Calibri", "Century", "Century Gothic", "Clarendon", "EUROSTILE", "Franklin Gothic", "Futura Bk BT", "Futura Md BT", "GOTHAM", "Gill Sans", "HELV", "Haettenschweiler", "Helvetica Neue", "Humanst521 BT", "Leelawadee", "Letter Gothic", "Levenim MT", "Lucida Bright", "Lucida Sans", "Menlo", "MS Mincho", "MS Outlook", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MYRIAD PRO", "Marlett", "Meiryo UI", "Microsoft Uighur", "Minion Pro", "Monotype Corsiva", "PMingLiU", "Pristina", "SCRIPTINA", "Segoe UI Light", "Serifa", "SimHei", "Small Fonts", "Staccato222 BT", "TRAJAN PRO", "Univers CE 55 Medium", "Vrinda", "ZWAdobeF", "Bauhaus 93", "FORTE", "Book Antiqua", "Liberation Sans", "Liberation Serif", "Liberation Mono", "Liberation Sans Narrow", "Droid Naskh Shift", "Droid Naskh Shift Alt", "Droid Naskh System UI", "Droid Naskh UI", "Droid Robot Regular", "Droid Sans", "Droid Sans Fallback", "Droid Sans Hebrew", "Droid Sans Japanese", "Droid Sans Mono", "Droid Sans Thai", "Droid Serif", "DroidSansFallback", "Noto Naskh Arabic", "Ubuntu Mono derivative Powerline", "Ubuntu Mono derivative Powerline Bold", "Ubuntu Mono derivative Powerline Bold Italic", "Ubuntu Mono derivative Powerline Italic", "Adobe Caslon", "Adobe Caslon Pro", "Adobe Caslon Pro Bold", "Adobe Devanagari", "Adobe Fan Heiti Std B", "Adobe Fangsong Std", "Adobe Fangsong Std R", "Adobe Garamond", "Adobe Garamond Pro", "Adobe Garamond Pro Bold", "Adobe Gothic Std", "Adobe Gothic Std B", "Adobe Hebrew", "Adobe Heiti Std R", "Adobe Jenson", "Adobe Kaiti Std R", "Adobe Ming Std L", "Adobe Myungjo Std M", "Adobe Naskh Medium", "Adobe Song Std L", "Orator Std Slanted", "Poplar Std", "Prestige Elite Std Bd", "Rosewood Std Regular", "Giddyup Std", "Hobo Std", "Hobo Std Medium", "Birch Std", "Blackoak Std", "TeamViewer13", "TeamViewer14", "TeamViewer15", "TeamViewer16"] : ["fakefont", "TeamViewer10", "TeamViewer11", "TeamViewer12", "TeamViewer13", "TeamViewer7", "TeamViewer8", "TeamViewer9", ".Mondulkiri U GR 1.5", "AIGDT", "AMGDT", "Abel", "Aboriginal Sans", "Aboriginal Serif", "Abyssinica SIL", "AcadEref", "Acumin", "Adobe Arabic", "Adobe Caslon", "Adobe Caslon Pro", "Adobe Caslon Pro Bold", "Adobe Devanagari", "Adobe Fan Heiti Std B", "Adobe Fangsong Std", "Adobe Fangsong Std R", "Adobe Garamond", "Adobe Garamond Pro", "Adobe Garamond Pro Bold", "Adobe Gothic Std", "Adobe Gothic Std B", "Adobe Hebrew", "Adobe Heiti Std R", "Adobe Jenson", "Adobe Kaiti Std R", "Adobe Ming Std L", "Adobe Myungjo Std M", "Adobe Naskh Medium", "Adobe Song Std L", "Agency FB", "Aharoni", "Akaash", "Akshar Unicode", "AksharUnicode", "Al Bayan", "Alexandra Script", "Algerian", "Amadeus", "AmdtSymbols", "AnastasiaScript", "Andale Mono", "Andalus", "Angsana New", "AngsanaUPC", "AnjaliOldLipi", "Annabelle", "Aparajita", "Apple Casual", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "AppleGothic", "AppleMyungjo", "Arabic Transparent", "Arabic Typesetting", "Arial", "Arial AMU", "Arial Baltic", "Arial CE", "Arial CYR", "Arial Cyr", "Arial Greek", "Arial Hebrew", "Arial MT", "Arial Rounded MT Bold", "Arial TUR", "Arial Unicode MS", "Ariston", "Arno Pro", "Arno Pro Caption", "Arno Pro Display", "Arno Pro Light Display", "Arno Pro SmText", "Arno Pro Smbd", "Arno Pro Smbd Caption", "Arno Pro Smbd Display", "Arno Pro Smbd SmText", "Arno Pro Smbd Subhead", "Arno Pro Subhead", "Asana Math", "Ayuthaya", "BJCree Uni", "BPG Classic 99U", "BPG Paata Khutsuri U", "Bangla MN", "Bangla Sangam MN", "BankGothic Lt BT", "BankGothic Md BT", "Baskerville Old Face", "Batang", "BatangChe", "Bauhaus 93", "Bell Gothic Std Black", "Bell Gothic Std Light", "Bell MT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "Bickham Script One", "Bickham Script Pro Regular", "Bickham Script Pro Semibold", "Bickham Script Two", "Birch Std", "Bitstream Vera Sans Mono", "Blackadder ITC", "Blackoak Std", "Bernard Condensed", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Poster Compressed", "Book Antiqua", "Bookman Old Style", "Bookshelf Symbol 7", "Bradley Hand ITC", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Brush Script Std", "CDT Khmer", "Calibri", "Calibri Light", "Californian FB", "Calisto MT", "Calligraph", "Cambria", "Cambria Math", "Candara", "Carolina", "Castellar", "Centaur", "Century", "Century Gothic", "Century Schoolbook", "Ceremonious Two", "Chaparral Pro", "Chaparral Pro Light", "Charcoal CY", "Charis SIL Compact", "Charlemagne Std", "Chiller", "CityBlueprint", "Clarendon BT", "Clarendon Blk BT", "Clarendon Lt BT", "Clear Sans", "Code2000", "Colonna MT", "Comic Sans", "Comic Sans MS", "CommercialPi BT", "CommercialScript BT", "Complex", "Consolas", "Constantia", "Cooper Black", "Cooper Std Black", "Copperplate Gothic Bold", "Copperplate Gothic Light", "Copyist", "Corbel", "Cordia New", "CordiaUPC", "CountryBlueprint", "Courier", "Courier New", "Courier New Baltic", "Courier New CE", "Courier New CYR", "Courier New Cyr", "Courier New Greek", "Courier New TUR", "Curlz MT", "DFKai-SB", "DaunPenh", "David", "DecoType Naskh", "Decor", "DejaVu Math TeX Gyre", "DejaVu Sans", "DejaVu Sans Condensed", "DejaVu Sans Light", "DejaVu Sans Mono", "DejaVu Serif", "DejaVu Serif Condensed", "Devanagari MT", "Devanagari Sangam MN", "DilleniaUPC", "DokChampa", "Dotum", "DotumChe", "Droid Naskh Shift", "Droid Naskh Shift Alt", "Droid Naskh System UI", "Droid Naskh UI", "Droid Robot Regular", "Droid Sans", "Droid Sans Fallback", "Droid Sans Hebrew", "Droid Sans Japanese", "Droid Sans Mono", "Droid Sans Thai", "Droid Serif", "DroidSansFallback", "Dutch801 Rm BT", "Dutch801 XBd BT", "Ebrima", "Eccentric Std", "Edwardian Script ITC", "Ekushey Punarbhaba", "Elephant", "Engravers MT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "Estrangelo Edessa", "Ethiopia Jiret", "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EuroRoman", "Eurostile", "FTEasci1", "FTEasci1-f", "FTEasci2", "FTEasci2-f", "FTEbaudo", "FTEbaudo-f", "FTEebcd1", "FTEebcd1-f", "FTEebcd2", "FTEebcd2-f", "FTEspec", "FTEspec-f", "FangSong", "Felix Titling", "Fira Code", "Fira Mono", "Fira Sans", "Fixed Miriam Transparent", "Fixedsys", "Footlight MT Light", "Forte", "FrankRuehl", "Franklin Gothic Book", "Franklin Gothic Demi", "Franklin Gothic Demi Cond", "Franklin Gothic Heavy", "Franklin Gothic Medium", "Franklin Gothic Medium Cond", "Freehand521 BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "Futura Md BT", "GDT", "GENISO", "GF Zemen Unicode", "Gabriola", "Gadugi", "Garamond", "Garamond Premr Pro", "Garamond Premr Pro Smbd", "Gautami", "Geeza Pro", "Geneva", "Gentium Basic", "Gentium Book Basic", "Georgia", "Giddyup Std", "Gigi", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GothicE", "GothicG", "GothicI", "Goudy Old Style", "Goudy Stout", "GreekC", "GreekS", "Gujarati MT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MT", "Guttman Yad", "HYSerif", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather Script One", "Heiti SC", "Heiti TC", "Helvetica", "Helvetica Neue", "High Tower Text", "Hiragino Kaku Gothic Pro", "Hiragino Kaku Gothic ProN", "Hiragino Mincho Pro", "Hiragino Mincho ProN", "Hobo Std", "Hoefler Text", "ISOCP", "ISOCP2", "ISOCP3", "ISOCPEUR", "ISOCT", "ISOCT2", "ISOCT3", "ISOCTEUR", "Impact", "Imprint MT Shadow", "InaiMathi", "Informal Roman", "IrisUPC", "Iskoola Pota", "Italic", "ItalicC", "ItalicT", "JasmineUPC", "Jokerman", "Jomolhari", "Juice ITC", "KaiTi", "KaiTi_GB2312", "Kailasa", "Kaiti SC", "Kaiti TC", "Kalinga", "Kannada MN", "Kannada Sangam MN", "Kartika", "Kedage", "Kefa", "Kh-SrokKhleang", "Khmer MN", "Khmer OS", "Khmer OS Fasthand", "Khmer OS Freehand", "Khmer OS Metal Chrieng", "Khmer OS Muol", "Khmer OS System", "Khmer Sangam MN", "Khmer UI", "KodchiangUPC", "Kokila", "Kozuka Gothic Pr6N B", "Kozuka Gothic Pr6N EL", "Kozuka Gothic Pr6N H", "Kozuka Gothic Pr6N L", "Kozuka Gothic Pr6N M", "Kozuka Gothic Pr6N R", "Kozuka Gothic Pro B", "Kozuka Gothic Pro EL", "Kozuka Gothic Pro H", "Kozuka Gothic Pro L", "Kozuka Gothic Pro M", "Kozuka Gothic Pro R", "Kozuka Mincho Pr6N B", "Kozuka Mincho Pr6N EL", "Kozuka Mincho Pr6N H", "Kozuka Mincho Pr6N L", "Kozuka Mincho Pr6N M", "Kozuka Mincho Pr6N R", "Kozuka Mincho Pro B", "Kozuka Mincho Pro EL", "Kozuka Mincho Pro H", "Kozuka Mincho Pro L", "Kozuka Mincho Pro M", "Kozuka Mincho Pro R", "Kristen ITC", "Ktav", "KufiStandardGK", "Kunstler Script", "LUCIDA GRANDE", "Lao UI", "Latha", "Latin Modern Math", "Leelawadee", "Letter Gothic Std", "Levenim MT", "LiHei Pro", "LiSong Pro", "Liberation Sans", "Liberation Serfi", "Liberation Mono", "Liberation Sans Narrow", "Libertinus Math", "Likhan", "LilyUPC", "Lithos Pro Regular", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "Lucida Grande", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "MS Gothic", "MS Mincho", "MS Outlook", "MS PGothic", "MS PMincho", "MS Reference Sans Serif", "MS Reference Specialty", "MS Sans Serif", "MS Serif", "fakefont2", "MS Song", "MS UI Gothic", "MT Extra", "MV Boli", "MYRIAD", "MYRIAD PRO", "Magneto", "Maiandra GD", "Malayalam MN", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marlett", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Mesquite Std", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft JhengHei UI", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft YaHei UI", "Microsoft Yi Baiti", "Ming(for ISO10646)", "MingLiU", "MingLiU-ExtB", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiu_HKSCS", "Minion Pro", "Minion Pro Cond", "Minion Pro Med", "Minion Pro SmBd", "Miriam", "Miriam Fixed", "Mistral", "Mitra Mono", "Modern", "Modern No. 20", "Monaco", "Mongolian Baiti", "Monospac821 BT", "Monotxt", "Monotype Corsiva", "MoolBoran", "MotoyaLCedar", "MotoyaLMaru", "Mshtakan", "Mukti Narrow", "Myriad Arabic", "Myriad Hebrew", "Myriad Pro", "Myriad Pro Cond", "Myriad Pro Light", "Myriad Web Pro", "NSimSun", "NanumGothic", "Narkisim", "Niagara Engraved", "Niagara Solid", "Nirmala UI", "Noto Mono", "Noto Color Emoji", "Noto Emoji", "Noto Kufi Arabic ", "Noto Naskh Arabic", "Noto Sans", "Noto Sans CJK JP", "Noto Sans CJK KR", "Noto Sans CJK SC", "Noto Sans CJK TC", "Noto Sans JP", "Noto Sans KR", "Noto Sans Mono CJK JP", "Noto Sans Lao ", "Noto Sans Mono CJK KR", "Noto Sans Mono CJK SC", "Noto Sans Mono CJK TC", "Noto Sans SC", "Noto Sans TC", "Noto Serif", "Noto Serif CJK JP", "Noto Serif CJK KR", "Noto Serif CJK SC", "Noto Serif CJK TC", "Noto Serif Ahom", "Nueva Std", "Nueva Std Cond", "Nyala", "OCR A Extended", "OCR A Std", "OCR-A BT", "OCR-B 10 BT", "Old English Text MT", "Onyx", "OpenSymbol", "Orator Std", "Orator Std Slanted", "Oriya MN", "Oriya Sangam MN", "Osaka-Mono", "OskiDakelh", "Ouverture script", "PMingLiU", "PMingLiU-ExtB", "PMingLiu", "Palace Script MT", "Palatino", "Palatino Linotype", "PanRoman", "Papyrus", "Parchment", "Perpetua", "Perpetua Titling MT", "PhnomPenh OT", "Pigiarniq", "PingFang SC", "PingFang TC", "Plantagenet Cherokee", "Playbill", "Poor Richard", "Poplar Std", "Pothana", "Power Clear", "Power Green", "Power Green Narrow", "Power Green Small", "Power Red and Blue", "Power Red and Blue Intl", "Power Red and Green", "Prestige Elite Std", "Prestige Elite Std Bd", "Pristina", "Proxy 1", "Proxy 2", "Proxy 3", "Proxy 4", "Proxy 5", "Proxy 6", "Proxy 7", "Proxy 8", "Proxy 9", "Raavi", "Rachana_w01", "Rage Italic", "Raghindi", "Ravie", "Roboto", "Roboto Slab", "Roboto Mono", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "RomanC", "RomanD", "RomanS", "RomanT", "Romantic", "Rosewood Std Regular", "STHeiti", "STIX Math", "STIX Two Math", "STIXGeneral", "STSong", "Saab", "Sakkal Majalla", "San Francisco", "SansSerif", "Script", "Script MT Bold", "ScriptC", "ScriptS", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Emoji", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Semilight", "Segoe UI Symbol", "Shonar Bangla", "Showcard Gothic", "Shruti", "SimHei", "SimSun", "SimSun-ExtB", "Simplex", "Simplified Arabic", "Simplified Arabic Fixed", "Sinhala MN", "Sinhala Sangam MN", "Skype UI Symbol", "Small Fonts", "SmartGothic", "Snap ITC", "Songti SC", "Songti TC", "Square721 BT", "Stencil", "Stencil Std", "Stylus BT", "Sun-ExtA", "SuperFrench", "Swis721 BT", "Swis721 BdCnOul BT", "Swis721 BdOul BT", "Swis721 Blk BT", "Swis721 BlkCn BT", "Swis721 BlkEx BT", "Swis721 BlkOul BT", "Swis721 Cn BT", "Swis721 Ex BT", "Swis721 Hv BT", "Swis721 Lt BT", "Swis721 LtCn BT", "Swis721 LtEx BT", "Syastro", "Sylfaen", "Symap", "Symath", "Symbol", "Symeteo", "Symusic", "System", "TITUS Cyberbit Basic", "Tahoma", "TeX Gyre Bonum Math", "TeX Gyre Pagella Math", "TeX Gyre Schola", "TeX Gyre Termes Math", "Technic", "TechnicBold", "TechnicLite", "Tekton Pro", "Tekton Pro Cond", "Tekton Pro Ext", "Telugu MN", "Telugu Sangam MN", "Tempus Sans ITC", "Terminal", "Thonburi", "ThoolikaUnicode", "Tibetan Machine Uni", "Times", "Times New Roman", "Times New Roman Baltic", "Times New Roman CE", "Times New Roman CYR", "Times New Roman Cyr", "Times New Roman Greek", "Times New Roman PS", "Times New Roman TUR", "Traditional Arabic", "Trajan Pro", "Trebuchet MS", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "Twemoji Mozilla", "Txt", "Ubuntu", "Ubuntu Light", "Ubuntu Bold", "Ubuntu Mono", "UniversalMath1 BT", "Uqammaq", "Utsaah", "VL Gothic", "VL PGothic", "Vani", "Verdana", "Vijaya", "Viner Hand ITC", "Vineta BT", "Visual Geez Unicode", "Visual Geez Unicode Agazian", "Visual Geez Unicode Title", "Vivaldi", "Vladimir Script", "Vrinda", "WP Arabic Sihafa", "WP ArabicScript Sihafa", "WP CyrillicA", "WP CyrillicB", "WP Greek Century", "WP Greek Courier", "WP Greek Helve", "WP Hebrew David", "WP MultinationalA Courier", "WP MultinationalA Helve", "WP MultinationalA Roman", "WP MultinationalB Courier", "WP MultinationalB Helve", "WP MultinationalB Roman", "WST_Czec", "WST_Engl", "WST_Fren", "WST_Germ", "WST_Ital", "WST_Span", "WST_Swed", "Webdings", "Wide Latin", "Wingdings", "Wingdings 2", "Wingdings 3", "XITS Math", "Yu Gothic", "Yu Mincho", "ZWAdobeF", "Zuzumbo", "cursive", "fantasy", "monospace", "ori1Uni", "sans-serif", "serif"];

          const list = [] as string[];
          const baseFonts = ['monospace', 'sans-serif', 'serif'] as string[];

          const body = document.getElementsByTagName("body")[0] as Element;

          const span = document.createElement("span") as any;
          span.style.fontSize = "72px";
          span.innerHTML = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz!@#$%^&*()_+-=";
          const defaultWidth = {} as any;
          const defaultHeight = {} as any;
          for (const index in baseFonts) {
            span.style.fontFamily = baseFonts[index];
            body.appendChild(span);
            defaultWidth[baseFonts[index]] = span.offsetWidth;
            defaultHeight[baseFonts[index]] = span.offsetHeight;
            body.removeChild(span);
          }

          function font_test(font: string): Promise<boolean> {
            return new Promise((resolve): void => {
              let detected = false;
              for (const index in baseFonts) {
                span.style.fontFamily = font + ',' + baseFonts[index];
                body.appendChild(span);
                detected = (span.offsetWidth != defaultWidth[baseFonts[index]] || span.offsetHeight != defaultHeight[baseFonts[index]]);
                body.removeChild(span);
                if (detected) {
                  if (list.indexOf(font) === -1) list.push(font);
                  resolve(true);
                }
              }
              resolve(false);
            });
          }

          const dfonts = [] as string[];

          for (let fi = 0; fi < fontList.length; fi++) {
            font_test(fontList[fi]).then((promise: any) => {
              dfonts.push(promise);
            });
          }

          Promise.all(dfonts).then(() => {
            resolve([0, list.sort()]);
          });
        });
      },
      plugins: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (isChrome()) resolve([-1, null]);
          const plugins = (navigator as any).plugins;
          const output = [] as any[];
          if (plugins) {
            for (let i = 0; i < (plugins as any).length; i++) {
              const plugin = plugins[i];
              if (plugin) {
                const mimes = [] as any[];
                for (let l = 0; l < plugin.length; l++) {
                  const mime = plugin[l];
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
          resolve([0, output]);
        });
      },
      pluginLengthIsZero: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const plugins = (navigator as any).plugins;
          if (plugins === undefined) resolve([-1, null]);
          resolve([0, plugins.length === 0]);
        });
      },
      sharedArrayBuffer: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if (typeof window.SharedArrayBuffer === "function") {
            const sab = new window.SharedArrayBuffer(1);
            if (sab.byteLength !== undefined) {
              resolve([0, sab.byteLength]);
            }
            resolve([-2, null]);
          }
          resolve([-1, null]);
        });
      },
      webdriver: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const webd = navigator.webdriver;
          if (webd === undefined) {
            resolve([-1, null]);
          } else {
            resolve([0, webd]);
          }
        });
      },
      getAttributeNames: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const de = document.documentElement;
          if (de === undefined) resolve([-1, null]);
          if (typeof de.getAttributeNames !== "function") resolve([-2, null]);
          resolve([0, de.getAttributeNames().length > 0]);
        });
      },
      errorToSource: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          try {
            throw "lol";
          } catch (e: any) {
            try {
              const tmp = e.toSource();
              resolve([0, true]);
           } catch (ee: any) {
              resolve([0, false]); 
            }
          }
          resolve([-1, null]);
        });
      },
      errors: (): Promise<[number, any[]]> => {
        return new Promise((resolve): void => {
          const errorTests = [
            () => new Function('alert(")'),
            () => new Function('const foo;foo.bar'),
            () => new Function('const a=1; const a=2;'),
            new Function('try{null.bar;return -1}catch(e){return e.message}'),
            new Function('try{abc.xyz=123;return -1}catch(e){return e.message}'),
            new Function('try{(1).toString(1000);return -1}catch(e){return e.message}'),
            new Function('try{[...undefined].length;return -1}catch(e){return e.message}'),
            new Function('try{var x=new Array(-1);return -1}catch(e){return e.message}'),
          ];
          const err = new Array();
          for (let i = 0; i < errorTests.length; i++) {
            try {
              const tmp = errorTests[i]();
              err.push(tmp);
            } catch(e: any) {
              err.push(e.message);
            }
          }
          resolve([0, err]);
        });
      },
      installTrigger: (): Promise<[number, boolean]> => {
        return Promise.resolve([0, (window as any).InstallTrigger !== undefined]);
      },
      math: (): Promise<[number, number]> => {
        return new Promise((resolve): void => {
          const m = Math;

          const returnZero = (): number => {
            return 0;
          };

          const e = 1e154;
      
          const fp = [
            (m.acos || returnZero)(.12312423423423424),
            (m.acosh || returnZero)(1e308),
            (m.log(e + m.sqrt(e * e - 1))),
            (m.asin || returnZero)(.12312423423423424),
            (m.asinh || returnZero)(1),
            m.log(m.sqrt(2) + 1),
            (m.atanh || returnZero)(.5),
            m.log(3) / 2,
            (m.atan || returnZero)(.5),
            (m.sin || returnZero)(-1e300),
            (m.sinh || returnZero)(1),
            m.exp(1) - 1 / m.exp(1) / 2,
            (m.cos || returnZero)(10.000000000123),
            (m.cosh || returnZero)(1),
            (m.exp(1) + 1 / m.exp(1)) / 2,
            (m.tan || returnZero)(-1e300),
            (m.tanh || returnZero)(1),
            (m.exp(2) - 1) / (m.exp(2) + 1),
            (m.exp || returnZero)(1),
            (m.expm1 || returnZero)(1),
            m.exp(1) - 1,
            (m.log1p || returnZero)(10),
            m.log(11),
            m.pow(m.PI, -100),
          ];
      
          resolve([0, murmurhash3_32_gc(JSON.stringify(fp), 420)]);
        });
      },
      notifications: (): Promise<[number, any]> => {
          return new Promise((resolve): void => {
            if (window.Notification === undefined) {
              resolve([-1, null]);
            }
            if (navigator.permissions === undefined) {
              resolve([-2, null]);
            }
            if (typeof navigator.permissions.query !== "function") {
              resolve([-3, null]);
            }
            navigator.permissions.query({name: "notifications"}).then((res): void => {
              resolve([0, window.Notification.permission === "denied" && res.state === "prompt"]);
            }).catch((res): void => {
              resolve([-4, null]);
            });
          });
      },
      webgpu: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          if ('gpu' in navigator) {
            (navigator.gpu as any).requestAdapter().then(function (adapter) {
              const { limits = {}, features = [] } = adapter || {};

                let data = {};
                for (let prop in limits) {
                    data[prop] = limits[prop];
                }

                adapter.requestDevice().then(device => {
                    // const startTime = performance.now();
                    // const gpuTestCommand = device.createCommandEncoder();
                    // const commandBuffer = gpuTestCommand.finish();
                    // device.defaultQueue.submit([commandBuffer]);
                    // const endTime = performance.now();
                    // data['executionTime'] = endTime - startTime;

                    adapter.requestAdapterInfo().then(function (info) {
                        data['info'] = {
                            'vendor': info.vendor,
                            'architecture': info.architecture,
                            'device': info.device,
                            'description': info.description
                        };
                        data['features'] = features;
                        data['limits'] = limits;

                        // data = murmurhash3_32_gc(JSON.stringify(data), 420);
                        resolve([0, data]);
                    });
                }).catch((error) => {
                  console.log('fail: requestDevice');
                  console.log(error);
                    resolve([-1, null]);
                });
            }).catch(() => {
              console.log('fail: requestAdapter');
                resolve([-1, null]);
            });
          } else {
            resolve([-1, null]);
          }
        });
      },
      webrtc: (): Promise<[number, any]> => {
        return new Promise((resolve): void => {
          const pc = new RTCPeerConnection({
            iceServers: [
              {
                urls: 'stun:stun.l.google.com:19302'
              }
            ]
          });
          let ips: string[] = [];
          pc.onicecandidate = (event) => {
            if (event.candidate && event.candidate.candidate) {
              const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
              console.log(event.candidate.candidate);
              const ipAddr = ipRegex.exec(event.candidate.candidate);
              if (ipAddr) {
                ips.push(ipAddr[0]);
              }
            } else if (ips.length == 0) {
              resolve([-1, null]);
            } else {
              resolve([0, ips.sort()]);
            }
          };
          pc.createDataChannel('');
          pc.createOffer().then((offer) => {
            pc.setLocalDescription(offer);
          });
          setTimeout(() => {
            if (ips.length == 0) {
              resolve([-1, null]);
            } else {
              resolve([0, ips]);
            }
          }, 500);   
        });
      },
    } as any;

    const index = [] as string[];
    const promises = [] as Promise<[number, any]>[];
    for (const method in fingerprints) {
      index.push(method);
      const exe = fingerprints[method]();
      promises.push(exe);
    }

    Promise.all(promises).then((k): void => {
      const profile = {} as any;
      for (let i = 0; i < index.length; i++) {
        profile[index[i]] = k[i];
      }
      const uniqueFp = murmurhash3_32_gc(JSON.stringify(profile), 420);
      const persistentFpComponetents = [
        profile.jsHeapSizeLimit,
        profile.audioContext,
        profile.canvasAPI,
        profile.performance,
        profile.speechSynthesis,
        profile.webglInfo,
        profile.webglProgram,
      ];
      const persistentFp = murmurhash3_32_gc(JSON.stringify(persistentFpComponetents), 420);
      const output = {
        fingerprint: uniqueFp,
        fingerprints: {
          uniqueFp: uniqueFp,
          persistentFp: persistentFp,
        },
        profile: profile,
      };
      resolve(output);
    }).catch((err) => {
      reject(err);
    });
  });
};