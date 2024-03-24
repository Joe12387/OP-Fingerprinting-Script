# OP JavaScript Browser Fingerprinting Script
 OPFS is a browser fingerprinting library for creating persistent, unique and long-lasting digital fingerprints without depending on ever-changing variables such as the user agent string commonly used in other browser fingerprinting libraries. As such, the fingerprint does not change most of the time when a user upgrades their browser to the current version.

[DEMO](https://detectincognito.com/opfs.html "DEMO")

## Usage

Get script from CDN

```html
<script src="https://cdn.jsdelivr.net/gh/Joe12387/op-fingerprinting-script@main/opfs.min.js"></script>
```

Or install from NPM

```
npm i op-fingerprinting-script
```

```javascript
import { fingerprint } from "op-fingerprinting-script";
```

Create the fingerprint

```javascript
fingerprint().then((result) => {
  console.log(result.fingerprints, result.profile);
});
```

## Overpowered?
 OPFS uses some novel methods not well known before the publishing of this repo that allow the creation of a likely completely unique device fingerprint in Google Chrome, Microsoft Edge and other Chromium-based browsers. This also applies to Firefox as long as it is not resisting fingerprinting.
 
 The library is able to detect and mitigate the effects of browser-based anti-fingerprinting technologies introduced to certain browsers in the past few years with the release of Brave Browser and Safari 13. The script will not use randomized fingerprints in such browsers and instead settle on a fingerprint that is to be persistent as long as possible at the expense of uniqueness.
 
 This mainly only applies to Safari 13 and up on both macOS and iOS, with Safari for iOS being the most difficult to create a unique identifier for due to the anti-fingerprinting methods used and the homogeneity of the hardware & software. This applies to Safari for macOS as well, but to a lesser extent for much the same reasons.
 
 This script cannot detect if certain browser extensions are present in the browser that may be blocking or jamming fingerprinting methods, such as CanvasAPI having added noise to its output, which will still result in a non-persistent fingerprint.
 
 ## How?
 I have compiled a list of 40+ individual fingerprinting methods to create an optimally unique fingerprint. While it does not contain all fingerprinting methods in use today, it does contain some that are not used in any other open source libraries I am aware of.
 
 OPFS contains these notable fingerprinting methods:
 * The classic fingerprints we all know and love: CanvasAPI and AudioContext.
 * jsHeapSizeLimit: the value of performance.memory.jsHeapSizeLimit in Chrome (7.2x more unique than CanvasAPI)
 * performance.now(): A previously unpublished method of using performance.now() to create a unique value (6.1x more unique than CanvasAPI)
 * speechSynthesis: A method of enumerating all synthetic voices available to the browser into a fingerprint.
 
 ## Specialty Fingerprints
 OPFS returns multiple fingerprints accessible via `result.fingerprints`. 
  * `result.fingerprints.uniqueFp` uses all available fingerprints and is most useful when you value uniqueness over persistence. While this fingerprint is unlikely to change often, it will still change eventually as browsers are updated.
  * `result.fingerprints.persistentFp` is useful if you value persistence over uniqueness. It will not be as unique but should rarely, if ever, change.

 ## Expected Behavior
 * The fingerprint should not change between page loads or if the browser is restarted.
 * The fingerprint should not change if the user is in incognito or private mode.
 * The fingerprint should not change if the network or IP address changes.

 If you are aware of a way to violate any of the three expected behaviors above, please create an issue.
 
 ## Implemented Fingerprinting Methods
 * platform
 * vendor
 * colorDepth
 * devicePixelRatio
 * evalToString
 * maxTouchPoints
 * cpuClass
 * hardwareConcurrency
 * deviceMemory
 * oscpu
 * doNotTrack
 * sourceBuffer
 * colorGamut
 * reducedMotion
 * hdr
 * contrast
 * invertedColors
 * forcedColors
 * monochrome
 * browserObjects
 * timezone
 * timezoneOffset
 * language
 * screenResolution
 * jsHeapSizeLimit
 * audioContext
 * userAgentData
 * canvasAPI
 * performance.now()
 * speechSynthesis
 * applePay
 * attributionsourceid
 * webglInfo
 * webglProgram
 * fonts
 * plugins
 * pluginLengthIsZero
 * sharedArrayBuffer
 * webdriver
 * getAttributeNames
 * errorToSource
 * errors
 * installTrigger
 * rtt
 * math
 * notifications
 
 ## TODO: Unimplemented Fingerprinting Methods
 * DOMRect
 * WebRTC
 
 ## Notes
 * The fingerprint may be inconsistent if the user is on a device that switches graphics hardware such as a MacBook Pro.

 ## Similar Projects

 - [detectIncognito](https://github.com/Joe12387/detectIncognito "detectIncognito")
 - [Browser Fingerprinting Resistance Research](https://github.com/Joe12387/browser-fingerprinting-resistance-research "Browser Fingerprinting Resistance Research")
