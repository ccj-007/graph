// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"aY0XG":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "26db5e0afe361e17";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws;
    try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        if (e.message) console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"ahFs7":[function(require,module,exports) {
var _option = require("./option");
const { grid: { left, right, bottom, top }, area, xAxis, yAxis, series, global } = (0, _option.option);
const { upColor, downColor } = series[0].itemStyle;
const TIME_HALF_TEXT = 20;
const times = xAxis.data;
const kList = series[0].data;
const kLen = kList.length;
/** 是否是第一次渲染 */ let firstInto = true;
const view = {
    /** 时间集合 */ times: [],
    /** k线图集合 */ kList: [],
    /** y轴标签集合 */ yLabels: [],
    /** x轴刻度x坐标集合 */ xTicks: [],
    /** k线渲染个数 */ kLen: kList.length,
    /** k线区域坐标 */ lb: {
        x: 0,
        y: 0
    },
    rt: {
        x: 0,
        y: 0
    },
    rb: {
        x: 0,
        y: 0
    },
    lt: {
        x: 0,
        y: 0
    },
    /** k线区域尺寸 */ width: 0,
    height: 0,
    /** 实心宽度 */ solidWidth: 0,
    /** 绘图区域Y轴的val范围 */ yMaxVal: 0,
    yMinVal: 0,
    yAreaVal: 0,
    /** 安全区域Y轴的val范围 */ yMaxSafeVal: 0,
    yMinSafeVal: 0,
    /** 范围id */ start: area.start,
    end: area.end,
    /** 鼠标位置 */ pointer: {
        x: 0,
        y: 0,
        inner: false
    }
};
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;
const width = canvas.width;
const height = canvas.height;
canvas.width = canvas.width * dpr;
canvas.height = canvas.height * dpr;
// 原点设置为左下角
canvas.style.transform = "scaleY(-1)";
canvas.style.transform = `translate(${canvas.width})`;
function drawAxisX() {
    const { lb, rb } = view;
    drawLine(lb.x, lb.y, rb.x, rb.y, global.bgLineColor);
}
function drawAxisY() {
    const { lb, lt } = view;
    drawLine(lb.x, lb.y, lt.x, lt.y, global.bgLineColor);
}
function drawScaleX() {
    view.xTicks.forEach((x)=>{
        ctx.beginPath();
        ctx.moveTo(x, view.lb.y);
        ctx.lineTo(x, view.lb.y - 10);
        ctx.stroke();
    });
    ctx.save();
    // 垂直翻转
    ctx.scale(1, -1);
    view.xTicks.forEach((x, index)=>{
        ctx.fillStyle = global.textColor;
        ctx.fillText(view.times[index], x - TIME_HALF_TEXT, -(view.lb.y - 20));
    });
    ctx.restore();
}
function drawScaleY() {
    const { lb, height } = view;
    const divide = height / (view.yLabels.length - 1);
    ctx.save();
    // 垂直翻转
    ctx.scale(1, -1);
    view.yLabels.forEach((val, index)=>{
        ctx.fillStyle = global.textColor;
        ctx.fillText(val, 2, -(lb.y + index * divide - 3));
    });
    ctx.restore();
}
function drawGrid() {
    const divide = height / view.yLabels.length;
    const { lb, rb } = view;
    view.yLabels.forEach((val, index)=>{
        if (index) {
            const y = lb.y + index * divide;
            drawLine(lb.x, y, rb.x, y, global.bgLineColor);
        }
    });
}
function drawHelpLine() {
    const { pointer: { x, y, inner } } = view;
    if (inner) {
        ctx.save();
        ctx.setLineDash([
            5,
            5
        ]);
        drawLine(x, view.lb.y, x, view.lt.y, global.helpColor);
        drawLine(view.lb.x, y, view.rt.x, y, global.helpColor);
        ctx.restore();
    }
}
function drawK() {
    view.kList.forEach((item, index)=>{
        drawCandle(item, view.times[index]);
    });
}
function draw() {
    drawAxisX();
    drawAxisY();
    drawScaleX();
    drawScaleY();
    drawGrid();
    drawHelpLine();
    drawK();
}
function watchEvent() {
    firstInto = false;
    window.addEventListener("mousemove", (e)=>{
        const { clientX, clientY } = e;
        const pos = canvas.getBoundingClientRect();
        const leftInner = clientX - pos.left - left;
        const topInner = clientY - pos.top - top;
        if (leftInner >= 0 && leftInner <= view.width && topInner >= 0 && topInner <= view.height) {
            view.pointer.x = clientX - pos.left;
            view.pointer.y = height - (clientY - pos.top);
            view.pointer.inner = true;
            console.log("\uD83D\uDE80 ~ file: app.js:144 ~ window.addEventListener ~ view.pointer:", view.pointer);
        } else {
            view.pointer.inner = false;
            console.log("\u8D85\u51FA\u533A\u57DF");
        }
    });
}
function limitArea() {
    const start_id = Math.floor(view.start * kLen / 100);
    const end_id = Math.floor(view.end * kLen / 100);
    view.times = times.slice(start_id, end_id + 1);
    view.kList = kList.slice(start_id, end_id + 1);
    view.kLen = view.kList.length;
}
/**
 * 计算视口数据
 */ function calcView() {
    // 计算视口坐标
    view.lb = {
        x: left,
        y: bottom + xAxis.offset
    };
    view.rt = {
        x: width - right,
        y: height - top
    };
    view.rb = {
        x: width - right,
        y: bottom + xAxis.offset
    };
    view.lt = {
        x: left,
        y: height - top
    };
    view.width = view.rb.x - view.lb.x;
    view.height = view.rt.y - view.rb.y;
    // 计算 y 轴的范围值
    let max_value = 0, min_value = Infinity;
    view.kList.forEach((item)=>{
        max_value = Math.max(max_value, ...item);
        min_value = Math.min(min_value, ...item);
    });
    const step = 5;
    view.yMaxSafeVal = max_value;
    view.yMinSafeVal = min_value;
    const min_integer = Math.floor(min_value - min_value % 10);
    const max_integer = Math.floor(max_value + (10 - max_value % 10));
    const distance = 20;
    view.yMinVal = min_integer - distance;
    view.yMaxVal = max_integer + distance;
    view.yAreaVal = view.yMaxVal - view.yMinVal;
    const size = Math.floor(view.yAreaVal / step);
    // 计算y的label集合
    let yLabels = [
        view.yMinVal
    ];
    let curY = view.yMinVal;
    for(let i = 0; i < step; i++){
        curY = curY + size;
        yLabels.push(curY);
    }
    view.yLabels = yLabels;
    // 计算实体宽度
    view.solidWidth = +(view.width / (view.kLen * 2)).toFixed(2);
    // 计算 x 轴刻度坐标
    const xDivide = view.width / (view.times.length - 1);
    let xTicks = [];
    view.times.forEach((item, index)=>{
        xTicks.push(+(index * xDivide + view.lb.x).toFixed(2));
    });
    view.xTicks = xTicks;
}
function drawLine(x, y, X, Y, color = "#fff") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(X, Y);
    ctx.stroke();
    ctx.closePath();
}
// y 数值转为y轴坐标
function y_toPos(val) {
    const { height, yAreaVal, yMinSafeVal, yMaxSafeVal, yMinVal, yMaxVal, lb } = view;
    const safeBottomH = (yMinSafeVal - yMinVal) / yAreaVal * height;
    const safeTopH = (yMaxVal - yMaxSafeVal) / yAreaVal * height;
    const valH = (val - yMinSafeVal) / (yMaxSafeVal - yMinSafeVal) * (height - safeBottomH - safeTopH);
    return +(lb.y + safeBottomH + valH).toFixed(2);
}
// x 数值转为x轴坐标
function x_toPos(name) {
    const idx = view.times.findIndex((item)=>item === name);
    const x_divide = view.width / (view.kLen - 1);
    return +(view.lb.x + x_divide * idx).toFixed(2);
}
/**
 * 蜡烛图
 * 
 * @param {number} x  中心点x
 * @param {number} y  中心点y
 * @param {number} w  宽度
 * @param {Array} item [open，close，lowest，highest]
 */ function drawCandle(item, name) {
    // 缩放后的 实心底部， 实心顶部，lowest，highest的y值
    const solidBottom = Math.min(y_toPos(item[0]), y_toPos(item[1]));
    const solidTop = Math.max(y_toPos(item[0]), y_toPos(item[1]));
    const lowest = y_toPos(item[2]);
    const highest = y_toPos(item[3]);
    const h = Math.abs(solidTop - solidBottom);
    const w = view.solidWidth;
    const half_w = w * .5;
    const half_h = h * .5;
    const isUp = item[1] > item[0];
    const color = isUp ? upColor : downColor;
    // 实心区域中心点
    const center = {
        x: x_toPos(name),
        y: solidBottom + half_h
    };
    // 绘制蜡烛图的上下影线
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(center.x, highest);
    ctx.lineTo(center.x, lowest);
    ctx.stroke();
    // 绘制蜡烛图的实体部分
    ctx.fillStyle = color;
    ctx.fillRect(center.x - half_w, center.y - half_h, w, h);
}
function requestAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 背景色
    ctx.fillStyle = global.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    limitArea();
    calcView();
    // 监听事件
    if (firstInto) watchEvent();
    draw();
    requestAnimationFrame(requestAnimation);
}
requestAnimation();

},{"./option":"96cNx"}],"96cNx":[function(require,module,exports) {
// Each item: open，close，lowest，highest
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "option", ()=>option);
const data0 = splitData([
    [
        "2013/1/24",
        2320.26,
        2320.26,
        2287.3,
        2362.94
    ],
    [
        "2013/1/25",
        2300,
        2291.3,
        2218.26,
        2308.38
    ],
    [
        "2013/1/28",
        2295.35,
        2346.5,
        2215.35,
        2396.92
    ],
    [
        "2013/1/29",
        2347.22,
        2358.98,
        2337.35,
        2363.8
    ],
    [
        "2013/1/30",
        2360.75,
        2382.48,
        2347.89,
        2383.76
    ],
    [
        "2013/1/31",
        2383.43,
        2385.42,
        2371.23,
        2391.82
    ],
    [
        "2013/2/1",
        2377.41,
        2419.02,
        2369.57,
        2421.15
    ],
    [
        "2013/2/4",
        2425.92,
        2428.15,
        2417.58,
        2440.38
    ],
    [
        "2013/2/5",
        2411,
        2433.13,
        2403.3,
        2437.42
    ],
    [
        "2013/2/6",
        2432.68,
        2434.48,
        2427.7,
        2441.73
    ],
    [
        "2013/2/7",
        2430.69,
        2418.53,
        2394.22,
        2433.89
    ],
    [
        "2013/2/8",
        2416.62,
        2432.4,
        2414.4,
        2443.03
    ],
    [
        "2013/2/18",
        2441.91,
        2421.56,
        2415.43,
        2444.8
    ],
    [
        "2013/2/19",
        2420.26,
        2382.91,
        2373.53,
        2427.07
    ],
    [
        "2013/2/20",
        2383.49,
        2397.18,
        2370.61,
        2397.94
    ],
    [
        "2013/2/21",
        2378.82,
        2325.95,
        2309.17,
        2378.82
    ],
    [
        "2013/2/22",
        2322.94,
        2314.16,
        2308.76,
        2330.88
    ],
    [
        "2013/2/25",
        2320.62,
        2325.82,
        2315.01,
        2338.78
    ],
    [
        "2013/2/26",
        2313.74,
        2293.34,
        2289.89,
        2340.71
    ],
    [
        "2013/2/27",
        2297.77,
        2313.22,
        2292.03,
        2324.63
    ],
    [
        "2013/2/28",
        2322.32,
        2365.59,
        2308.92,
        2366.16
    ],
    [
        "2013/3/1",
        2364.54,
        2359.51,
        2330.86,
        2369.65
    ],
    [
        "2013/3/4",
        2332.08,
        2273.4,
        2259.25,
        2333.54
    ],
    [
        "2013/3/5",
        2274.81,
        2326.31,
        2270.1,
        2328.14
    ],
    [
        "2013/3/6",
        2333.61,
        2347.18,
        2321.6,
        2351.44
    ],
    [
        "2013/3/7",
        2340.44,
        2324.29,
        2304.27,
        2352.02
    ],
    [
        "2013/3/8",
        2326.42,
        2318.61,
        2314.59,
        2333.67
    ],
    [
        "2013/3/11",
        2314.68,
        2310.59,
        2296.58,
        2320.96
    ],
    [
        "2013/3/12",
        2309.16,
        2286.6,
        2264.83,
        2333.29
    ],
    [
        "2013/3/13",
        2282.17,
        2263.97,
        2253.25,
        2286.33
    ],
    [
        "2013/3/14",
        2255.77,
        2270.28,
        2253.31,
        2276.22
    ],
    [
        "2013/3/15",
        2269.31,
        2278.4,
        2250,
        2312.08
    ],
    [
        "2013/3/18",
        2267.29,
        2240.02,
        2239.21,
        2276.05
    ],
    [
        "2013/3/19",
        2244.26,
        2257.43,
        2232.02,
        2261.31
    ],
    [
        "2013/3/20",
        2257.74,
        2317.37,
        2257.42,
        2317.86
    ],
    [
        "2013/3/21",
        2318.21,
        2324.24,
        2311.6,
        2330.81
    ],
    [
        "2013/3/22",
        2321.4,
        2328.28,
        2314.97,
        2332
    ],
    [
        "2013/3/25",
        2334.74,
        2326.72,
        2319.91,
        2344.89
    ],
    [
        "2013/3/26",
        2318.58,
        2297.67,
        2281.12,
        2319.99
    ],
    [
        "2013/3/27",
        2299.38,
        2301.26,
        2289,
        2323.48
    ],
    [
        "2013/3/28",
        2273.55,
        2236.3,
        2232.91,
        2273.55
    ],
    [
        "2013/3/29",
        2238.49,
        2236.62,
        2228.81,
        2246.87
    ],
    [
        "2013/4/1",
        2229.46,
        2234.4,
        2227.31,
        2243.95
    ],
    [
        "2013/4/2",
        2234.9,
        2227.74,
        2220.44,
        2253.42
    ],
    [
        "2013/4/3",
        2232.69,
        2225.29,
        2217.25,
        2241.34
    ],
    [
        "2013/4/8",
        2196.24,
        2211.59,
        2180.67,
        2212.59
    ],
    [
        "2013/4/9",
        2215.47,
        2225.77,
        2215.47,
        2234.73
    ],
    [
        "2013/4/10",
        2224.93,
        2226.13,
        2212.56,
        2233.04
    ],
    [
        "2013/4/11",
        2236.98,
        2219.55,
        2217.26,
        2242.48
    ],
    [
        "2013/4/12",
        2218.09,
        2206.78,
        2204.44,
        2226.26
    ],
    [
        "2013/4/15",
        2199.91,
        2181.94,
        2177.39,
        2204.99
    ],
    [
        "2013/4/16",
        2169.63,
        2194.85,
        2165.78,
        2196.43
    ],
    [
        "2013/4/17",
        2195.03,
        2193.8,
        2178.47,
        2197.51
    ],
    [
        "2013/4/18",
        2181.82,
        2197.6,
        2175.44,
        2206.03
    ],
    [
        "2013/4/19",
        2201.12,
        2244.64,
        2200.58,
        2250.11
    ],
    [
        "2013/4/22",
        2236.4,
        2242.17,
        2232.26,
        2245.12
    ],
    [
        "2013/4/23",
        2242.62,
        2184.54,
        2182.81,
        2242.62
    ],
    [
        "2013/4/24",
        2187.35,
        2218.32,
        2184.11,
        2226.12
    ],
    [
        "2013/4/25",
        2213.19,
        2199.31,
        2191.85,
        2224.63
    ],
    [
        "2013/4/26",
        2203.89,
        2177.91,
        2173.86,
        2210.58
    ],
    [
        "2013/5/2",
        2170.78,
        2174.12,
        2161.14,
        2179.65
    ],
    [
        "2013/5/3",
        2179.05,
        2205.5,
        2179.05,
        2222.81
    ],
    [
        "2013/5/6",
        2212.5,
        2231.17,
        2212.5,
        2236.07
    ],
    [
        "2013/5/7",
        2227.86,
        2235.57,
        2219.44,
        2240.26
    ],
    [
        "2013/5/8",
        2242.39,
        2246.3,
        2235.42,
        2255.21
    ],
    [
        "2013/5/9",
        2246.96,
        2232.97,
        2221.38,
        2247.86
    ],
    [
        "2013/5/10",
        2228.82,
        2246.83,
        2225.81,
        2247.67
    ],
    [
        "2013/5/13",
        2247.68,
        2241.92,
        2231.36,
        2250.85
    ],
    [
        "2013/5/14",
        2238.9,
        2217.01,
        2205.87,
        2239.93
    ],
    [
        "2013/5/15",
        2217.09,
        2224.8,
        2213.58,
        2225.19
    ],
    [
        "2013/5/16",
        2221.34,
        2251.81,
        2210.77,
        2252.87
    ],
    [
        "2013/5/17",
        2249.81,
        2282.87,
        2248.41,
        2288.09
    ],
    [
        "2013/5/20",
        2286.33,
        2299.99,
        2281.9,
        2309.39
    ],
    [
        "2013/5/21",
        2297.11,
        2305.11,
        2290.12,
        2305.3
    ],
    [
        "2013/5/22",
        2303.75,
        2302.4,
        2292.43,
        2314.18
    ],
    [
        "2013/5/23",
        2293.81,
        2275.67,
        2274.1,
        2304.95
    ],
    [
        "2013/5/24",
        2281.45,
        2288.53,
        2270.25,
        2292.59
    ],
    [
        "2013/5/27",
        2286.66,
        2293.08,
        2283.94,
        2301.7
    ],
    [
        "2013/5/28",
        2293.4,
        2321.32,
        2281.47,
        2322.1
    ],
    [
        "2013/5/29",
        2323.54,
        2324.02,
        2321.17,
        2334.33
    ],
    [
        "2013/5/30",
        2316.25,
        2317.75,
        2310.49,
        2325.72
    ],
    [
        "2013/5/31",
        2320.74,
        2300.59,
        2299.37,
        2325.53
    ],
    [
        "2013/6/3",
        2300.21,
        2299.25,
        2294.11,
        2313.43
    ],
    [
        "2013/6/4",
        2297.1,
        2272.42,
        2264.76,
        2297.1
    ],
    [
        "2013/6/5",
        2270.71,
        2270.93,
        2260.87,
        2276.86
    ],
    [
        "2013/6/6",
        2264.43,
        2242.11,
        2240.07,
        2266.69
    ],
    [
        "2013/6/7",
        2242.26,
        2210.9,
        2205.07,
        2250.63
    ],
    [
        "2013/6/13",
        2190.1,
        2148.35,
        2126.22,
        2190.1
    ]
]);
// 转换数据
function splitData(rawData) {
    const categoryData = [];
    const values = [];
    for(var i = 0; i < rawData.length; i++){
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
    }
    return {
        categoryData: categoryData,
        values: values
    };
}
// 计算 MA 均线
function calculateMA(dayCount) {
    var result = [];
    for(var i = 0, len = data0.values.length; i < len; i++){
        // 必须超过最小天数
        if (i < dayCount) {
            result.push("-");
            continue;
        }
        var sum = 0;
        for(var j = 0; j < dayCount; j++)sum += +data0.values[i - j][1];
        result.push(sum / dayCount);
    }
    return result;
}
const option = {
    grid: {
        left: 30,
        right: 30,
        bottom: 15,
        top: 20
    },
    xAxis: {
        data: data0.categoryData,
        offset: 30
    },
    theme: {
        bgColor: "#171b26",
        bgLineColor: "#252834",
        textColor: "#aeb1ba",
        helpColor: "#fff",
        upColor: "#f23645",
        downColor: "#089981"
    },
    yAxis: {
        offset: 30
    },
    area: {
        start: 20,
        end: 30
    },
    series: [
        {
            name: "\u65E5K",
            data: data0.values
        },
        // 5 日均线
        {
            name: "MA5",
            type: "line",
            data: calculateMA(5),
            smooth: true,
            lineStyle: {
                opacity: 0.5
            }
        },
        // 10 日均线
        {
            name: "MA10",
            type: "line",
            data: calculateMA(10),
            smooth: true,
            lineStyle: {
                opacity: 0.5
            }
        },
        // 20 日均线
        {
            name: "MA20",
            type: "line",
            data: calculateMA(20),
            smooth: true,
            lineStyle: {
                opacity: 0.5
            }
        },
        // 30 日均线
        {
            name: "MA30",
            type: "line",
            data: calculateMA(30),
            smooth: true,
            lineStyle: {
                opacity: 0.5
            }
        }
    ]
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"fF8Uh"}],"fF8Uh":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["aY0XG","ahFs7"], "ahFs7", "parcelRequirefc75")

//# sourceMappingURL=index.fe361e17.js.map
