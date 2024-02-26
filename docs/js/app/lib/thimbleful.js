!function (t) { var e = {}; function s(r) { if (e[r]) return e[r].exports; var n = e[r] = { i: r, l: !1, exports: {} }; return t[r].call(n.exports, n, n.exports, s), n.l = !0, n.exports } s.m = t, s.c = e, s.d = function (t, e, r) { s.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r }) }, s.r = function (t) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, s.t = function (t, e) { if (1 & e && (t = s(t)), 8 & e) return t; if (4 & e && "object" == typeof t && t && t.__esModule) return t; var r = Object.create(null); if (s.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var n in t) s.d(r, n, function (e) { return t[e] }.bind(null, n)); return r }, s.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return s.d(e, "a", e), e }, s.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, s.p = "", s(s.s = 4) }([function (t, e, s) { "use strict"; s.r(e); class r { constructor() { this._handlers = {}, document.addEventListener("click", t => this._callHandler("click", t)), document.addEventListener("mousedown", t => this._callHandler("mousedown", t)), document.addEventListener("mouseup", t => this._callHandler("mouseup", t)) } register(t, e = { click: null, mousedown: null, mouseup: null }) { "function" == typeof e && (e = { click: e }), this._handlers[t] = this._handlers[t] || [], this._handlers[t].push(e) } _callHandler(t, e) { Object.keys(this._handlers).forEach(s => { if (null !== e.target.closest(s)) { this._handlers[s].map(e => e[t]).forEach(t => { "function" != typeof t || e.defaultPrevented || t(e, s) }) } }) } } r.instance = function () { return r._instance ? r._instance : r._instance = new r }, e.default = r }, function (t, e, s) { "use strict"; s.r(e); var r = s(0); class n { constructor(t = "dragging") { this._dragClass = t, this._handlers = {}, document.addEventListener("dragover", t => this._dragOver(t)), document.addEventListener("dragleave", t => this._dragLeave(t)), document.addEventListener("drop", t => this._drop(t)) } register(t, e) { this._handlers[t] = e, r.default.instance().register(t, (t, e) => this._openFileDialog(t, e)) } _dragOver(t) { this._isDropTarget(t.target) && (t.stopPropagation(), t.preventDefault(), t.dataTransfer.dropEffect = "copy", t.target.classList.add(this._dragClass)) } _dragLeave(t) { this._isDropTarget(t.target) && (t.stopPropagation(), t.preventDefault(), t.target.classList.remove(this._dragClass)) } _drop(t) { let e = this._isDropTarget(t.target); e && (t.stopPropagation(), t.preventDefault(), t.target.classList.remove(this._dragClass), this._handleFile(e, t, t.dataTransfer.files[0])) } _isDropTarget(t) { return Object.keys(this._handlers).find(e => { if (t.closest(e)) return e }) || !1 } _openFileDialog(t, e) { const s = document.createElement("input"); s.type = "file", s.addEventListener("change", s => this._handleFile(e, t, s.target.files[0])), s.click() } _handleFile(t, e, s) { this._readFile(s).then(r => this._handlers[t](s, r, e)) } _readFile(t) { return new Promise((e, s) => { var r = new FileReader; r.addEventListener("load", t => e(t.target.result)), r.readAsDataURL(t) }) } } n.instance = function () { return n._instance ? n._instance : n._instance = new n }, e.default = n }, function (t, e, s) { "use strict"; s.r(e), s.d(e, "default", (function () { return n })); var r = s(0); class n { constructor(t = !1, e = null) { this._routes = [], t && this.addRoutes(t, e) } install() { return r.default.instance().register("a[href]", t => this._handleClick(t)), window.addEventListener("hashchange", t => this._handleNavigationEvent(t)), window.addEventListener("load", t => this._handleNavigationEvent(t)), this } addRoute(t, e) { return this._routes.push([t, e]), this } addRoutes(t, e = null) { return Array.isArray(t) ? t.forEach(t => this.addRoute(t, e)) : Object.keys(t).forEach(e => this.addRoute(e, t[e])), this } route(t, e) { const s = this._matchingRoute(t); return s && s.router ? s.router.route(s.subpath, e) : s && s.handler ? s.handler(s.route, s.matches, e) : void 0 } _handleClick(t) { let e = t.target.getAttribute("href"); e.startsWith("#") && (e = e.substr(1), this._matchingRoute(e) && (window.location.hash = e, t.preventDefault())) } _handleNavigationEvent(t) { let e = window.location.hash; e.startsWith("#") && (e = e.substr(1)), this.route(e, t) } _matchingRoute(t) { return t && (this._subRouterMatch(t) || this._stringMatch(t) || this._regExpMatch(t)) } _subRouterMatch(t) { const e = this._routes.filter(t => t[1] instanceof n).find(e => t.startsWith(e[0] + "/") || t == e[0]); return e && { router: e[1], subpath: t.substr(e[0].length + 1) } } _stringMatch(t) { const e = this._routes.find(e => t == e[0]); return e && { route: e[0], handler: e[1] } } _regExpMatch(t) { const e = this._routes.filter(t => t[0] instanceof RegExp).find(e => t.match(e[0])); return e && { route: e[0], handler: e[1], matches: t.match(e[0]) } } } }, function (t, e, s) { "use strict"; s.r(e), s.d(e, "default", (function () { return n })); var r = s(0); class n { constructor(t, e = {}) { this._scope = t, this._options = this._normalizeOptions(e), r.default.instance().register(`${t} [${this._options.open}], ${t} [${this._options.close}], ${t} [${this._options.toggle}]`, t => this._handleClick(t)) } _normalizeOptions(t) { return Object.assign({ class: "active", open: "data-open", close: "data-close", toggle: "data-toggle", group: "data-group", timer: "data-timer", follower: "data-follower" }, t) } _handleClick(t) { const e = t.target.closest(`[${this._options.open}], [${this._options.close}], [${this._options.toggle}]`), s = e.getAttribute(this._options.close), r = e.getAttribute(this._options.open), n = e.getAttribute(this._options.toggle); let o = s ? document.querySelectorAll(`${this._scope} ${s}`) : [], i = r ? document.querySelectorAll(`${this._scope} ${r}`) : []; o = [...o, ...n ? document.querySelectorAll(`${this._scope} ${n}.${this._options.class}`) : []], i = [...i, ...n ? document.querySelectorAll(`${this._scope} ${n}:not(.${this._options.class})`) : []], this._close(o), this._open(i), t.preventDefault(), t.stopPropagation() } _close(t) { t.forEach(t => { t.classList.remove(this._options.class), this._close(this._followers(t)) }) } _open(t) { t.forEach(t => { this._close(this._group(t)), t.classList.add(this._options.class), this._open(this._followers(t)); const e = t.getAttribute(this._options.timer); e && window.setTimeout(() => this._close([t]), e) }) } _group(t) { const e = t.getAttribute(this._options.group); return e ? [...document.querySelectorAll(`${this._scope} [${this._options.group}=${e}]`)] : [] } _followers(t) { const e = t.getAttribute(this._options.follower); return e ? [...document.querySelectorAll(`${this._scope} ${e}`)] : [] } } }, function (t, e, s) { "use strict"; s.r(e); var r = s(0), n = s(1), o = s(2), i = s(3); const a = { Click: r.default, FileTarget: n.default, Router: o.default, Energize: i.default }; e.default = a, window.Thimbleful = a }]);