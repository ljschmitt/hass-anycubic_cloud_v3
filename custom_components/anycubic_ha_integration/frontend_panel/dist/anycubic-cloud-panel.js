!function (t) {
  var e = function (t, i) {
    return e = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
    }, e(t, i);
  };
  function i(t, i) {
    if ("function" != typeof i && null !== i) throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
    function r() {
      this.constructor = t;
    }
    e(t, i), t.prototype = null === i ? Object.create(i) : (r.prototype = i.prototype, new r());
  }
  var r = function () {
    return r = Object.assign || function (t) {
      for (var e, i = 1, r = arguments.length; i < r; i++) for (var n in e = arguments[i]) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
      return t;
    }, r.apply(this, arguments);
  };
  function n(t, e, i, r) {
    var n,
      o = arguments.length,
      s = o < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, i) : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, i, r);else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(e, i, s) : n(e, i)) || s);
    return o > 3 && s && Object.defineProperty(e, i, s), s;
  }
  function o(t, e, i) {
    if (i || 2 === arguments.length) for (var r, n = 0, o = e.length; n < o; n++) !r && n in e || (r || (r = Array.prototype.slice.call(e, 0, n)), r[n] = e[n]);
    return t.concat(r || Array.prototype.slice.call(e));
  }
  "function" == typeof SuppressedError && SuppressedError;
  /**
       * @license
       * Copyright 2019 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const s = globalThis,
    a = s.ShadowRoot && (void 0 === s.ShadyCSS || s.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
    l = Symbol(),
    h = new WeakMap();
  class c {
    constructor(t, e, i) {
      if (this._$cssResult$ = !0, i !== l) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t, this.t = e;
    }
    get styleSheet() {
      let t = this.o;
      const e = this.t;
      if (a && void 0 === t) {
        const i = void 0 !== e && 1 === e.length;
        i && (t = h.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && h.set(e, t));
      }
      return t;
    }
    toString() {
      return this.cssText;
    }
  }
  const d = t => new c("string" == typeof t ? t : t + "", void 0, l),
    p = (t, ...e) => {
      const i = 1 === t.length ? t[0] : e.reduce((e, i, r) => e + (t => {
        if (!0 === t._$cssResult$) return t.cssText;
        if ("number" == typeof t) return t;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(i) + t[r + 1], t[0]);
      return new c(i, t, l);
    },
    u = a ? t => t : t => t instanceof CSSStyleSheet ? (t => {
      let e = "";
      for (const i of t.cssRules) e += i.cssText;
      return d(e);
    })(t) : t
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    {
      is: g,
      defineProperty: A,
      getOwnPropertyDescriptor: m,
      getOwnPropertyNames: b,
      getOwnPropertySymbols: v,
      getPrototypeOf: f
    } = Object,
    y = globalThis,
    _ = y.trustedTypes,
    w = _ ? _.emptyScript : "",
    x = y.reactiveElementPolyfillSupport,
    P = (t, e) => t,
    E = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? w : null;
            break;
          case Object:
          case Array:
            t = null == t ? t : JSON.stringify(t);
        }
        return t;
      },
      fromAttribute(t, e) {
        let i = t;
        switch (e) {
          case Boolean:
            i = null !== t;
            break;
          case Number:
            i = null === t ? null : Number(t);
            break;
          case Object:
          case Array:
            try {
              i = JSON.parse(t);
            } catch (t) {
              i = null;
            }
        }
        return i;
      }
    },
    S = (t, e) => !g(t, e),
    C = {
      attribute: !0,
      type: String,
      converter: E,
      reflect: !1,
      hasChanged: S
    };
  Symbol.metadata ??= Symbol("metadata"), y.litPropertyMetadata ??= new WeakMap();
  class F extends HTMLElement {
    static addInitializer(t) {
      this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t, e = C) {
      if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
        const i = Symbol(),
          r = this.getPropertyDescriptor(t, i, e);
        void 0 !== r && A(this.prototype, t, r);
      }
    }
    static getPropertyDescriptor(t, e, i) {
      const {
        get: r,
        set: n
      } = m(this.prototype, t) ?? {
        get() {
          return this[e];
        },
        set(t) {
          this[e] = t;
        }
      };
      return {
        get() {
          return r?.call(this);
        },
        set(e) {
          const o = r?.call(this);
          n.call(this, e), this.requestUpdate(t, o, i);
        },
        configurable: !0,
        enumerable: !0
      };
    }
    static getPropertyOptions(t) {
      return this.elementProperties.get(t) ?? C;
    }
    static _$Ei() {
      if (this.hasOwnProperty(P("elementProperties"))) return;
      const t = f(this);
      t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(P("finalized"))) return;
      if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
        const t = this.properties,
          e = [...b(t), ...v(t)];
        for (const i of e) this.createProperty(i, t[i]);
      }
      const t = this[Symbol.metadata];
      if (null !== t) {
        const e = litPropertyMetadata.get(t);
        if (void 0 !== e) for (const [t, i] of e) this.elementProperties.set(t, i);
      }
      this._$Eh = new Map();
      for (const [t, e] of this.elementProperties) {
        const i = this._$Eu(t, e);
        void 0 !== i && this._$Eh.set(i, t);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(t) {
      const e = [];
      if (Array.isArray(t)) {
        const i = new Set(t.flat(1 / 0).reverse());
        for (const t of i) e.unshift(u(t));
      } else void 0 !== t && e.push(u(t));
      return e;
    }
    static _$Eu(t, e) {
      const i = e.attribute;
      return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise(t => this.enableUpdating = t), this._$AL = new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(t => t(this));
    }
    addController(t) {
      (this._$EO ??= new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
    }
    removeController(t) {
      this._$EO?.delete(t);
    }
    _$E_() {
      const t = new Map(),
        e = this.constructor.elementProperties;
      for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
      t.size > 0 && (this._$Ep = t);
    }
    createRenderRoot() {
      const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return ((t, e) => {
        if (a) t.adoptedStyleSheets = e.map(t => t instanceof CSSStyleSheet ? t : t.styleSheet);else for (const i of e) {
          const e = document.createElement("style"),
            r = s.litNonce;
          void 0 !== r && e.setAttribute("nonce", r), e.textContent = i.cssText, t.appendChild(e);
        }
      })(t, this.constructor.elementStyles), t;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach(t => t.hostConnected?.());
    }
    enableUpdating(t) {}
    disconnectedCallback() {
      this._$EO?.forEach(t => t.hostDisconnected?.());
    }
    attributeChangedCallback(t, e, i) {
      this._$AK(t, i);
    }
    _$EC(t, e) {
      const i = this.constructor.elementProperties.get(t),
        r = this.constructor._$Eu(t, i);
      if (void 0 !== r && !0 === i.reflect) {
        const n = (void 0 !== i.converter?.toAttribute ? i.converter : E).toAttribute(e, i.type);
        this._$Em = t, null == n ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
      }
    }
    _$AK(t, e) {
      const i = this.constructor,
        r = i._$Eh.get(t);
      if (void 0 !== r && this._$Em !== r) {
        const t = i.getPropertyOptions(r),
          n = "function" == typeof t.converter ? {
            fromAttribute: t.converter
          } : void 0 !== t.converter?.fromAttribute ? t.converter : E;
        this._$Em = r, this[r] = n.fromAttribute(e, t.type), this._$Em = null;
      }
    }
    requestUpdate(t, e, i) {
      if (void 0 !== t) {
        if (i ??= this.constructor.getPropertyOptions(t), !(i.hasChanged ?? S)(this[t], e)) return;
        this.P(t, e, i);
      }
      !1 === this.isUpdatePending && (this._$ES = this._$ET());
    }
    P(t, e, i) {
      this._$AL.has(t) || this._$AL.set(t, e), !0 === i.reflect && this._$Em !== t && (this._$Ej ??= new Set()).add(t);
    }
    async _$ET() {
      this.isUpdatePending = !0;
      try {
        await this._$ES;
      } catch (t) {
        Promise.reject(t);
      }
      const t = this.scheduleUpdate();
      return null != t && (await t), !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
          for (const [t, e] of this._$Ep) this[t] = e;
          this._$Ep = void 0;
        }
        const t = this.constructor.elementProperties;
        if (t.size > 0) for (const [e, i] of t) !0 !== i.wrapped || this._$AL.has(e) || void 0 === this[e] || this.P(e, this[e], i);
      }
      let t = !1;
      const e = this._$AL;
      try {
        t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach(t => t.hostUpdate?.()), this.update(e)) : this._$EU();
      } catch (e) {
        throw t = !1, this._$EU(), e;
      }
      t && this._$AE(e);
    }
    willUpdate(t) {}
    _$AE(t) {
      this._$EO?.forEach(t => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
    }
    _$EU() {
      this._$AL = new Map(), this.isUpdatePending = !1;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t) {
      return !0;
    }
    update(t) {
      this._$Ej &&= this._$Ej.forEach(t => this._$EC(t, this[t])), this._$EU();
    }
    updated(t) {}
    firstUpdated(t) {}
  }
  F.elementStyles = [], F.shadowRootOptions = {
    mode: "open"
  }, F[P("elementProperties")] = new Map(), F[P("finalized")] = new Map(), x?.({
    ReactiveElement: F
  }), (y.reactiveElementVersions ??= []).push("2.0.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const T = globalThis,
    K = T.trustedTypes,
    D = K ? K.createPolicy("lit-html", {
      createHTML: t => t
    }) : void 0,
    H = "$lit$",
    U = `lit$${Math.random().toFixed(9).slice(2)}$`,
    B = "?" + U,
    k = `<${B}>`,
    M = document,
    I = () => M.createComment(""),
    R = t => null === t || "object" != typeof t && "function" != typeof t,
    N = Array.isArray,
    O = t => N(t) || "function" == typeof t?.[Symbol.iterator],
    L = "[ \t\n\f\r]",
    z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    $ = /-->/g,
    j = />/g,
    V = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
    X = /'/g,
    G = /"/g,
    Q = /^(?:script|style|textarea|title)$/i,
    W = (t => (e, ...i) => ({
      _$litType$: t,
      strings: e,
      values: i
    }))(1),
    q = Symbol.for("lit-noChange"),
    Z = Symbol.for("lit-nothing"),
    Y = new WeakMap(),
    J = M.createTreeWalker(M, 129);
  function tt(t, e) {
    if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== D ? D.createHTML(e) : e;
  }
  const et = (t, e) => {
    const i = t.length - 1,
      r = [];
    let n,
      o = 2 === e ? "<svg>" : "",
      s = z;
    for (let e = 0; e < i; e++) {
      const i = t[e];
      let a,
        l,
        h = -1,
        c = 0;
      for (; c < i.length && (s.lastIndex = c, l = s.exec(i), null !== l);) c = s.lastIndex, s === z ? "!--" === l[1] ? s = $ : void 0 !== l[1] ? s = j : void 0 !== l[2] ? (Q.test(l[2]) && (n = RegExp("</" + l[2], "g")), s = V) : void 0 !== l[3] && (s = V) : s === V ? ">" === l[0] ? (s = n ?? z, h = -1) : void 0 === l[1] ? h = -2 : (h = s.lastIndex - l[2].length, a = l[1], s = void 0 === l[3] ? V : '"' === l[3] ? G : X) : s === G || s === X ? s = V : s === $ || s === j ? s = z : (s = V, n = void 0);
      const d = s === V && t[e + 1].startsWith("/>") ? " " : "";
      o += s === z ? i + k : h >= 0 ? (r.push(a), i.slice(0, h) + H + i.slice(h) + U + d) : i + U + (-2 === h ? e : d);
    }
    return [tt(t, o + (t[i] || "<?>") + (2 === e ? "</svg>" : "")), r];
  };
  class it {
    constructor({
      strings: t,
      _$litType$: e
    }, i) {
      let r;
      this.parts = [];
      let n = 0,
        o = 0;
      const s = t.length - 1,
        a = this.parts,
        [l, h] = et(t, e);
      if (this.el = it.createElement(l, i), J.currentNode = this.el.content, 2 === e) {
        const t = this.el.content.firstChild;
        t.replaceWith(...t.childNodes);
      }
      for (; null !== (r = J.nextNode()) && a.length < s;) {
        if (1 === r.nodeType) {
          if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(H)) {
            const e = h[o++],
              i = r.getAttribute(t).split(U),
              s = /([.?@])?(.*)/.exec(e);
            a.push({
              type: 1,
              index: n,
              name: s[2],
              strings: i,
              ctor: "." === s[1] ? at : "?" === s[1] ? lt : "@" === s[1] ? ht : st
            }), r.removeAttribute(t);
          } else t.startsWith(U) && (a.push({
            type: 6,
            index: n
          }), r.removeAttribute(t));
          if (Q.test(r.tagName)) {
            const t = r.textContent.split(U),
              e = t.length - 1;
            if (e > 0) {
              r.textContent = K ? K.emptyScript : "";
              for (let i = 0; i < e; i++) r.append(t[i], I()), J.nextNode(), a.push({
                type: 2,
                index: ++n
              });
              r.append(t[e], I());
            }
          }
        } else if (8 === r.nodeType) if (r.data === B) a.push({
          type: 2,
          index: n
        });else {
          let t = -1;
          for (; -1 !== (t = r.data.indexOf(U, t + 1));) a.push({
            type: 7,
            index: n
          }), t += U.length - 1;
        }
        n++;
      }
    }
    static createElement(t, e) {
      const i = M.createElement("template");
      return i.innerHTML = t, i;
    }
  }
  function rt(t, e, i = t, r) {
    if (e === q) return e;
    let n = void 0 !== r ? i._$Co?.[r] : i._$Cl;
    const o = R(e) ? void 0 : e._$litDirective$;
    return n?.constructor !== o && (n?._$AO?.(!1), void 0 === o ? n = void 0 : (n = new o(t), n._$AT(t, i, r)), void 0 !== r ? (i._$Co ??= [])[r] = n : i._$Cl = n), void 0 !== n && (e = rt(t, n._$AS(t, e.values), n, r)), e;
  }
  class nt {
    constructor(t, e) {
      this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t) {
      const {
          el: {
            content: e
          },
          parts: i
        } = this._$AD,
        r = (t?.creationScope ?? M).importNode(e, !0);
      J.currentNode = r;
      let n = J.nextNode(),
        o = 0,
        s = 0,
        a = i[0];
      for (; void 0 !== a;) {
        if (o === a.index) {
          let e;
          2 === a.type ? e = new ot(n, n.nextSibling, this, t) : 1 === a.type ? e = new a.ctor(n, a.name, a.strings, this, t) : 6 === a.type && (e = new ct(n, this, t)), this._$AV.push(e), a = i[++s];
        }
        o !== a?.index && (n = J.nextNode(), o++);
      }
      return J.currentNode = M, r;
    }
    p(t) {
      let e = 0;
      for (const i of this._$AV) void 0 !== i && (void 0 !== i.strings ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
    }
  }
  class ot {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, i, r) {
      this.type = 2, this._$AH = Z, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
    }
    get parentNode() {
      let t = this._$AA.parentNode;
      const e = this._$AM;
      return void 0 !== e && 11 === t?.nodeType && (t = e.parentNode), t;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t, e = this) {
      t = rt(this, t, e), R(t) ? t === Z || null == t || "" === t ? (this._$AH !== Z && this._$AR(), this._$AH = Z) : t !== this._$AH && t !== q && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : O(t) ? this.k(t) : this._(t);
    }
    S(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
    }
    _(t) {
      this._$AH !== Z && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(M.createTextNode(t)), this._$AH = t;
    }
    $(t) {
      const {
          values: e,
          _$litType$: i
        } = t,
        r = "number" == typeof i ? this._$AC(t) : (void 0 === i.el && (i.el = it.createElement(tt(i.h, i.h[0]), this.options)), i);
      if (this._$AH?._$AD === r) this._$AH.p(e);else {
        const t = new nt(r, this),
          i = t.u(this.options);
        t.p(e), this.T(i), this._$AH = t;
      }
    }
    _$AC(t) {
      let e = Y.get(t.strings);
      return void 0 === e && Y.set(t.strings, e = new it(t)), e;
    }
    k(t) {
      N(this._$AH) || (this._$AH = [], this._$AR());
      const e = this._$AH;
      let i,
        r = 0;
      for (const n of t) r === e.length ? e.push(i = new ot(this.S(I()), this.S(I()), this, this.options)) : i = e[r], i._$AI(n), r++;
      r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
    }
    _$AR(t = this._$AA.nextSibling, e) {
      for (this._$AP?.(!1, !0, e); t && t !== this._$AB;) {
        const e = t.nextSibling;
        t.remove(), t = e;
      }
    }
    setConnected(t) {
      void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
    }
  }
  class st {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, i, r, n) {
      this.type = 1, this._$AH = Z, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || "" !== i[0] || "" !== i[1] ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = Z;
    }
    _$AI(t, e = this, i, r) {
      const n = this.strings;
      let o = !1;
      if (void 0 === n) t = rt(this, t, e, 0), o = !R(t) || t !== this._$AH && t !== q, o && (this._$AH = t);else {
        const r = t;
        let s, a;
        for (t = n[0], s = 0; s < n.length - 1; s++) a = rt(this, r[i + s], e, s), a === q && (a = this._$AH[s]), o ||= !R(a) || a !== this._$AH[s], a === Z ? t = Z : t !== Z && (t += (a ?? "") + n[s + 1]), this._$AH[s] = a;
      }
      o && !r && this.j(t);
    }
    j(t) {
      t === Z ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
    }
  }
  class at extends st {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t) {
      this.element[this.name] = t === Z ? void 0 : t;
    }
  }
  class lt extends st {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== Z);
    }
  }
  class ht extends st {
    constructor(t, e, i, r, n) {
      super(t, e, i, r, n), this.type = 5;
    }
    _$AI(t, e = this) {
      if ((t = rt(this, t, e, 0) ?? Z) === q) return;
      const i = this._$AH,
        r = t === Z && i !== Z || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive,
        n = t !== Z && (i === Z || r);
      r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  }
  class ct {
    constructor(t, e, i) {
      this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      rt(this, t);
    }
  }
  const dt = {
      P: H,
      A: U,
      C: B,
      M: 1,
      L: et,
      R: nt,
      D: O,
      V: rt,
      I: ot,
      H: st,
      N: lt,
      U: ht,
      B: at,
      F: ct
    },
    pt = T.litHtmlPolyfillSupport;
  pt?.(it, ot), (T.litHtmlVersions ??= []).push("3.1.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  class ut extends F {
    constructor() {
      super(...arguments), this.renderOptions = {
        host: this
      }, this._$Do = void 0;
    }
    createRenderRoot() {
      const t = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= t.firstChild, t;
    }
    update(t) {
      const e = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ((t, e, i) => {
        const r = i?.renderBefore ?? e;
        let n = r._$litPart$;
        if (void 0 === n) {
          const t = i?.renderBefore ?? null;
          r._$litPart$ = n = new ot(e.insertBefore(I(), t), t, void 0, i ?? {});
        }
        return n._$AI(t), n;
      })(e, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(!0);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(!1);
    }
    render() {
      return q;
    }
  }
  ut._$litElement$ = !0, ut.finalized = !0, globalThis.litElementHydrateSupport?.({
    LitElement: ut
  });
  const gt = globalThis.litElementPolyfillSupport;
  gt?.({
    LitElement: ut
  }), (globalThis.litElementVersions ??= []).push("4.0.6");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const At = {
      attribute: !0,
      type: String,
      converter: E,
      reflect: !1,
      hasChanged: S
    },
    mt = (t = At, e, i) => {
      const {
        kind: r,
        metadata: n
      } = i;
      let o = globalThis.litPropertyMetadata.get(n);
      if (void 0 === o && globalThis.litPropertyMetadata.set(n, o = new Map()), o.set(i.name, t), "accessor" === r) {
        const {
          name: r
        } = i;
        return {
          set(i) {
            const n = e.get.call(this);
            e.set.call(this, i), this.requestUpdate(r, n, t);
          },
          init(e) {
            return void 0 !== e && this.P(r, void 0, t), e;
          }
        };
      }
      if ("setter" === r) {
        const {
          name: r
        } = i;
        return function (i) {
          const n = this[r];
          e.call(this, i), this.requestUpdate(r, n, t);
        };
      }
      throw Error("Unsupported decorator location: " + r);
    };
  function bt(t) {
    return (e, i) => "object" == typeof i ? mt(t, e, i) : ((t, e, i) => {
      const r = e.hasOwnProperty(i);
      return e.constructor.createProperty(i, r ? {
        ...t,
        wrapped: !0
      } : t), r ? Object.getOwnPropertyDescriptor(e, i) : void 0;
    })(t, e, i);
  }
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function vt(t) {
    return bt({
      ...t,
      state: !0,
      attribute: !1
    });
  }
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const ft = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && "object" != typeof e && Object.defineProperty(t, e, i), i)
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */;
  function yt(t, e) {
    return (i, r, n) => {
      const o = e => e.renderRoot?.querySelector(t) ?? null;
      if (e) {
        const {
          get: t,
          set: e
        } = "object" == typeof r ? i : n ?? (() => {
          const t = Symbol();
          return {
            get() {
              return this[t];
            },
            set(e) {
              this[t] = e;
            }
          };
        })();
        return ft(i, r, {
          get() {
            let i = t.call(this);
            return void 0 === i && (i = o(this), (null !== i || this.hasUpdated) && e.call(this, i)), i;
          }
        });
      }
      return ft(i, r, {
        get() {
          return o(this);
        }
      });
    };
  }
  class _t extends Date {
    constructor() {
      super(), this.setTime(0 === arguments.length ? Date.now() : 1 === arguments.length ? "string" == typeof arguments[0] ? +new Date(arguments[0]) : arguments[0] : Date.UTC(...arguments));
    }
    getTimezoneOffset() {
      return 0;
    }
  }
  const wt = /^(get|set)(?!UTC)/;
  Object.getOwnPropertyNames(Date.prototype).forEach(t => {
    if (wt.test(t)) {
      const e = Date.prototype[t.replace(wt, "$1UTC")];
      e && (_t.prototype[t] = e);
    }
  });
  class xt extends _t {
    toString() {
      return `${this.toDateString()} ${this.toTimeString()}`;
    }
    toDateString() {
      return `${Pt.format(this)} ${Et.format(this)} ${this.getFullYear()}`;
    }
    toTimeString() {
      return `${St.format(this)} GMT+0000 (Coordinated Universal Time)`;
    }
    toLocaleString(t, e) {
      return Date.prototype.toLocaleString.call(this, t, {
        timeZone: "UTC",
        ...e
      });
    }
    toLocaleDateString(t, e) {
      return Date.prototype.toLocaleDateString.call(this, t, {
        timeZone: "UTC",
        ...e
      });
    }
    toLocaleTimeString(t, e) {
      return Date.prototype.toLocaleTimeString.call(this, t, {
        timeZone: "UTC",
        ...e
      });
    }
  }
  var Pt = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "UTC"
    }),
    Et = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    }),
    St = new Intl.DateTimeFormat("en-GB", {
      hour12: !1,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC"
    });
  const Ct = t => new xt(+new Date(t)),
    Ft = 6048e5,
    Tt = 864e5,
    Kt = 6e4,
    Dt = 36e5,
    Ht = Symbol.for("constructDateFrom");
  function Ut(t, e) {
    return "function" == typeof t ? t(e) : t && "object" == typeof t && Ht in t ? t[Ht](e) : t instanceof Date ? new t.constructor(e) : new Date(e);
  }
  function Bt(t, e) {
    return Ut(e || t, t);
  }
  function kt(t, e, i) {
    const {
        years: r = 0,
        months: n = 0,
        weeks: o = 0,
        days: s = 0,
        hours: a = 0,
        minutes: l = 0,
        seconds: h = 0
      } = e,
      c = Bt(t, i?.in),
      d = n || r ? function (t, e, i) {
        const r = Bt(t, i?.in);
        if (isNaN(e)) return Ut(i?.in || t, NaN);
        if (!e) return r;
        const n = r.getDate(),
          o = Ut(i?.in || t, r.getTime());
        return o.setMonth(r.getMonth() + e + 1, 0), n >= o.getDate() ? o : (r.setFullYear(o.getFullYear(), o.getMonth(), n), r);
      }(c, n + 12 * r) : c,
      p = s || o ? function (t, e, i) {
        const r = Bt(t, i?.in);
        return isNaN(e) ? Ut(i?.in || t, NaN) : e ? (r.setDate(r.getDate() + e), r) : r;
      }(d, s + 7 * o) : d,
      u = 1e3 * (h + 60 * (l + 60 * a));
    return Ut(i?.in || t, +p + u);
  }
  let Mt = {};
  function It() {
    return Mt;
  }
  function Rt(t, e) {
    const i = It(),
      r = e?.weekStartsOn ?? e?.locale?.options?.weekStartsOn ?? i.weekStartsOn ?? i.locale?.options?.weekStartsOn ?? 0,
      n = Bt(t, e?.in),
      o = n.getDay(),
      s = (o < r ? 7 : 0) + o - r;
    return n.setDate(n.getDate() - s), n.setHours(0, 0, 0, 0), n;
  }
  function Nt(t, e) {
    return Rt(t, {
      ...e,
      weekStartsOn: 1
    });
  }
  function Ot(t, e) {
    const i = Bt(t, e?.in),
      r = i.getFullYear(),
      n = Ut(i, 0);
    n.setFullYear(r + 1, 0, 4), n.setHours(0, 0, 0, 0);
    const o = Nt(n),
      s = Ut(i, 0);
    s.setFullYear(r, 0, 4), s.setHours(0, 0, 0, 0);
    const a = Nt(s);
    return i.getTime() >= o.getTime() ? r + 1 : i.getTime() >= a.getTime() ? r : r - 1;
  }
  function Lt(t) {
    const e = Bt(t),
      i = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()));
    return i.setUTCFullYear(e.getFullYear()), +t - +i;
  }
  function zt(t, ...e) {
    const i = Ut.bind(null, t || e.find(t => "object" == typeof t));
    return e.map(i);
  }
  function $t(t, e) {
    const i = Bt(t, e?.in);
    return i.setHours(0, 0, 0, 0), i;
  }
  function jt(t, e, i) {
    const [r, n] = zt(i?.in, t, e),
      o = $t(r),
      s = $t(n),
      a = +o - Lt(o),
      l = +s - Lt(s);
    return Math.round((a - l) / Tt);
  }
  function Vt(t, e) {
    const i = +Bt(t) - +Bt(e);
    return i < 0 ? -1 : i > 0 ? 1 : i;
  }
  function Xt(t) {
    return !(!((e = t) instanceof Date || "object" == typeof e && "[object Date]" === Object.prototype.toString.call(e)) && "number" != typeof t || isNaN(+Bt(t)));
    var e;
  }
  function Gt(t, e) {
    const i = t.getFullYear() - e.getFullYear() || t.getMonth() - e.getMonth() || t.getDate() - e.getDate() || t.getHours() - e.getHours() || t.getMinutes() - e.getMinutes() || t.getSeconds() - e.getSeconds() || t.getMilliseconds() - e.getMilliseconds();
    return i < 0 ? -1 : i > 0 ? 1 : i;
  }
  function Qt(t) {
    return e => {
      const i = (t ? Math[t] : Math.trunc)(e);
      return 0 === i ? 0 : i;
    };
  }
  function Wt(t, e) {
    return +Bt(t) - +Bt(e);
  }
  function qt(t, e) {
    const i = Bt(t, e?.in);
    return +function (t, e) {
      const i = Bt(t, e?.in);
      return i.setHours(23, 59, 59, 999), i;
    }(i, e) == +function (t, e) {
      const i = Bt(t, e?.in),
        r = i.getMonth();
      return i.setFullYear(i.getFullYear(), r + 1, 0), i.setHours(23, 59, 59, 999), i;
    }(i, e);
  }
  function Zt(t, e, i) {
    const [r, n, o] = zt(i?.in, t, t, e),
      s = Vt(n, o),
      a = Math.abs(function (t, e, i) {
        const [r, n] = zt(i?.in, t, e);
        return 12 * (r.getFullYear() - n.getFullYear()) + (r.getMonth() - n.getMonth());
      }(n, o));
    if (a < 1) return 0;
    1 === n.getMonth() && n.getDate() > 27 && n.setDate(30), n.setMonth(n.getMonth() - s * a);
    let l = Vt(n, o) === -s;
    qt(r) && 1 === a && 1 === Vt(r, o) && (l = !1);
    const h = s * (a - +l);
    return 0 === h ? 0 : h;
  }
  function Yt(t, e, i) {
    const [r, n] = zt(i?.in, t, e),
      o = Vt(r, n),
      s = Math.abs(function (t, e, i) {
        const [r, n] = zt(i?.in, t, e);
        return r.getFullYear() - n.getFullYear();
      }(r, n));
    r.setFullYear(1584), n.setFullYear(1584);
    const a = o * (s - +(Vt(r, n) === -o));
    return 0 === a ? 0 : a;
  }
  const Jt = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds"
    },
    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes"
    },
    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes"
    },
    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours"
    },
    xHours: {
      one: "1 hour",
      other: "{{count}} hours"
    },
    xDays: {
      one: "1 day",
      other: "{{count}} days"
    },
    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks"
    },
    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks"
    },
    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months"
    },
    xMonths: {
      one: "1 month",
      other: "{{count}} months"
    },
    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years"
    },
    xYears: {
      one: "1 year",
      other: "{{count}} years"
    },
    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years"
    },
    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years"
    }
  };
  function te(t) {
    return (e = {}) => {
      const i = e.width ? String(e.width) : t.defaultWidth;
      return t.formats[i] || t.formats[t.defaultWidth];
    };
  }
  const ee = {
      date: te({
        formats: {
          full: "EEEE, MMMM do, y",
          long: "MMMM do, y",
          medium: "MMM d, y",
          short: "MM/dd/yyyy"
        },
        defaultWidth: "full"
      }),
      time: te({
        formats: {
          full: "h:mm:ss a zzzz",
          long: "h:mm:ss a z",
          medium: "h:mm:ss a",
          short: "h:mm a"
        },
        defaultWidth: "full"
      }),
      dateTime: te({
        formats: {
          full: "{{date}} 'at' {{time}}",
          long: "{{date}} 'at' {{time}}",
          medium: "{{date}}, {{time}}",
          short: "{{date}}, {{time}}"
        },
        defaultWidth: "full"
      })
    },
    ie = {
      lastWeek: "'last' eeee 'at' p",
      yesterday: "'yesterday at' p",
      today: "'today at' p",
      tomorrow: "'tomorrow at' p",
      nextWeek: "eeee 'at' p",
      other: "P"
    };
  function re(t) {
    return (e, i) => {
      let r;
      if ("formatting" === (i?.context ? String(i.context) : "standalone") && t.formattingValues) {
        const e = t.defaultFormattingWidth || t.defaultWidth,
          n = i?.width ? String(i.width) : e;
        r = t.formattingValues[n] || t.formattingValues[e];
      } else {
        const e = t.defaultWidth,
          n = i?.width ? String(i.width) : t.defaultWidth;
        r = t.values[n] || t.values[e];
      }
      return r[t.argumentCallback ? t.argumentCallback(e) : e];
    };
  }
  function ne(t) {
    return (e, i = {}) => {
      const r = i.width,
        n = r && t.matchPatterns[r] || t.matchPatterns[t.defaultMatchWidth],
        o = e.match(n);
      if (!o) return null;
      const s = o[0],
        a = r && t.parsePatterns[r] || t.parsePatterns[t.defaultParseWidth],
        l = Array.isArray(a) ? function (t, e) {
          for (let i = 0; i < t.length; i++) if (e(t[i])) return i;
          return;
        }(a, t => t.test(s)) : function (t, e) {
          for (const i in t) if (Object.prototype.hasOwnProperty.call(t, i) && e(t[i])) return i;
          return;
        }(a, t => t.test(s));
      let h;
      h = t.valueCallback ? t.valueCallback(l) : l, h = i.valueCallback ? i.valueCallback(h) : h;
      return {
        value: h,
        rest: e.slice(s.length)
      };
    };
  }
  var oe;
  const se = {
    code: "en-US",
    formatDistance: (t, e, i) => {
      let r;
      const n = Jt[t];
      return r = "string" == typeof n ? n : 1 === e ? n.one : n.other.replace("{{count}}", e.toString()), i?.addSuffix ? i.comparison && i.comparison > 0 ? "in " + r : r + " ago" : r;
    },
    formatLong: ee,
    formatRelative: (t, e, i, r) => ie[t],
    localize: {
      ordinalNumber: (t, e) => {
        const i = Number(t),
          r = i % 100;
        if (r > 20 || r < 10) switch (r % 10) {
          case 1:
            return i + "st";
          case 2:
            return i + "nd";
          case 3:
            return i + "rd";
        }
        return i + "th";
      },
      era: re({
        values: {
          narrow: ["B", "A"],
          abbreviated: ["BC", "AD"],
          wide: ["Before Christ", "Anno Domini"]
        },
        defaultWidth: "wide"
      }),
      quarter: re({
        values: {
          narrow: ["1", "2", "3", "4"],
          abbreviated: ["Q1", "Q2", "Q3", "Q4"],
          wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
        },
        defaultWidth: "wide",
        argumentCallback: t => t - 1
      }),
      month: re({
        values: {
          narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        },
        defaultWidth: "wide"
      }),
      day: re({
        values: {
          narrow: ["S", "M", "T", "W", "T", "F", "S"],
          short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
          abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        },
        defaultWidth: "wide"
      }),
      dayPeriod: re({
        values: {
          narrow: {
            am: "a",
            pm: "p",
            midnight: "mi",
            noon: "n",
            morning: "morning",
            afternoon: "afternoon",
            evening: "evening",
            night: "night"
          },
          abbreviated: {
            am: "AM",
            pm: "PM",
            midnight: "midnight",
            noon: "noon",
            morning: "morning",
            afternoon: "afternoon",
            evening: "evening",
            night: "night"
          },
          wide: {
            am: "a.m.",
            pm: "p.m.",
            midnight: "midnight",
            noon: "noon",
            morning: "morning",
            afternoon: "afternoon",
            evening: "evening",
            night: "night"
          }
        },
        defaultWidth: "wide",
        formattingValues: {
          narrow: {
            am: "a",
            pm: "p",
            midnight: "mi",
            noon: "n",
            morning: "in the morning",
            afternoon: "in the afternoon",
            evening: "in the evening",
            night: "at night"
          },
          abbreviated: {
            am: "AM",
            pm: "PM",
            midnight: "midnight",
            noon: "noon",
            morning: "in the morning",
            afternoon: "in the afternoon",
            evening: "in the evening",
            night: "at night"
          },
          wide: {
            am: "a.m.",
            pm: "p.m.",
            midnight: "midnight",
            noon: "noon",
            morning: "in the morning",
            afternoon: "in the afternoon",
            evening: "in the evening",
            night: "at night"
          }
        },
        defaultFormattingWidth: "wide"
      })
    },
    match: {
      ordinalNumber: (oe = {
        matchPattern: /^(\d+)(th|st|nd|rd)?/i,
        parsePattern: /\d+/i,
        valueCallback: t => parseInt(t, 10)
      }, (t, e = {}) => {
        const i = t.match(oe.matchPattern);
        if (!i) return null;
        const r = i[0],
          n = t.match(oe.parsePattern);
        if (!n) return null;
        let o = oe.valueCallback ? oe.valueCallback(n[0]) : n[0];
        return o = e.valueCallback ? e.valueCallback(o) : o, {
          value: o,
          rest: t.slice(r.length)
        };
      }),
      era: ne({
        matchPatterns: {
          narrow: /^(b|a)/i,
          abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
          wide: /^(before christ|before common era|anno domini|common era)/i
        },
        defaultMatchWidth: "wide",
        parsePatterns: {
          any: [/^b/i, /^(a|c)/i]
        },
        defaultParseWidth: "any"
      }),
      quarter: ne({
        matchPatterns: {
          narrow: /^[1234]/i,
          abbreviated: /^q[1234]/i,
          wide: /^[1234](th|st|nd|rd)? quarter/i
        },
        defaultMatchWidth: "wide",
        parsePatterns: {
          any: [/1/i, /2/i, /3/i, /4/i]
        },
        defaultParseWidth: "any",
        valueCallback: t => t + 1
      }),
      month: ne({
        matchPatterns: {
          narrow: /^[jfmasond]/i,
          abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
          wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
        },
        defaultMatchWidth: "wide",
        parsePatterns: {
          narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
          any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
        },
        defaultParseWidth: "any"
      }),
      day: ne({
        matchPatterns: {
          narrow: /^[smtwf]/i,
          short: /^(su|mo|tu|we|th|fr|sa)/i,
          abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
          wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
        },
        defaultMatchWidth: "wide",
        parsePatterns: {
          narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
          any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
        },
        defaultParseWidth: "any"
      }),
      dayPeriod: ne({
        matchPatterns: {
          narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
          any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
        },
        defaultMatchWidth: "any",
        parsePatterns: {
          any: {
            am: /^a/i,
            pm: /^p/i,
            midnight: /^mi/i,
            noon: /^no/i,
            morning: /morning/i,
            afternoon: /afternoon/i,
            evening: /evening/i,
            night: /night/i
          }
        },
        defaultParseWidth: "any"
      })
    },
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  };
  function ae(t, e) {
    const i = Bt(t, e?.in),
      r = jt(i, function (t, e) {
        const i = Bt(t, e?.in);
        return i.setFullYear(i.getFullYear(), 0, 1), i.setHours(0, 0, 0, 0), i;
      }(i));
    return r + 1;
  }
  function le(t, e) {
    const i = Bt(t, e?.in),
      r = +Nt(i) - +function (t, e) {
        const i = Ot(t, e),
          r = Ut(e?.in || t, 0);
        return r.setFullYear(i, 0, 4), r.setHours(0, 0, 0, 0), Nt(r);
      }(i);
    return Math.round(r / Ft) + 1;
  }
  function he(t, e) {
    const i = Bt(t, e?.in),
      r = i.getFullYear(),
      n = It(),
      o = e?.firstWeekContainsDate ?? e?.locale?.options?.firstWeekContainsDate ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1,
      s = Ut(e?.in || t, 0);
    s.setFullYear(r + 1, 0, o), s.setHours(0, 0, 0, 0);
    const a = Rt(s, e),
      l = Ut(e?.in || t, 0);
    l.setFullYear(r, 0, o), l.setHours(0, 0, 0, 0);
    const h = Rt(l, e);
    return +i >= +a ? r + 1 : +i >= +h ? r : r - 1;
  }
  function ce(t, e) {
    const i = Bt(t, e?.in),
      r = +Rt(i, e) - +function (t, e) {
        const i = It(),
          r = e?.firstWeekContainsDate ?? e?.locale?.options?.firstWeekContainsDate ?? i.firstWeekContainsDate ?? i.locale?.options?.firstWeekContainsDate ?? 1,
          n = he(t, e),
          o = Ut(e?.in || t, 0);
        return o.setFullYear(n, 0, r), o.setHours(0, 0, 0, 0), Rt(o, e);
      }(i, e);
    return Math.round(r / Ft) + 1;
  }
  function de(t, e) {
    return (t < 0 ? "-" : "") + Math.abs(t).toString().padStart(e, "0");
  }
  const pe = {
      y(t, e) {
        const i = t.getFullYear(),
          r = i > 0 ? i : 1 - i;
        return de("yy" === e ? r % 100 : r, e.length);
      },
      M(t, e) {
        const i = t.getMonth();
        return "M" === e ? String(i + 1) : de(i + 1, 2);
      },
      d: (t, e) => de(t.getDate(), e.length),
      a(t, e) {
        const i = t.getHours() / 12 >= 1 ? "pm" : "am";
        switch (e) {
          case "a":
          case "aa":
            return i.toUpperCase();
          case "aaa":
            return i;
          case "aaaaa":
            return i[0];
          default:
            return "am" === i ? "a.m." : "p.m.";
        }
      },
      h: (t, e) => de(t.getHours() % 12 || 12, e.length),
      H: (t, e) => de(t.getHours(), e.length),
      m: (t, e) => de(t.getMinutes(), e.length),
      s: (t, e) => de(t.getSeconds(), e.length),
      S(t, e) {
        const i = e.length,
          r = t.getMilliseconds();
        return de(Math.trunc(r * Math.pow(10, i - 3)), e.length);
      }
    },
    ue = "midnight",
    ge = "noon",
    Ae = "morning",
    me = "afternoon",
    be = "evening",
    ve = "night",
    fe = {
      G: function (t, e, i) {
        const r = t.getFullYear() > 0 ? 1 : 0;
        switch (e) {
          case "G":
          case "GG":
          case "GGG":
            return i.era(r, {
              width: "abbreviated"
            });
          case "GGGGG":
            return i.era(r, {
              width: "narrow"
            });
          default:
            return i.era(r, {
              width: "wide"
            });
        }
      },
      y: function (t, e, i) {
        if ("yo" === e) {
          const e = t.getFullYear(),
            r = e > 0 ? e : 1 - e;
          return i.ordinalNumber(r, {
            unit: "year"
          });
        }
        return pe.y(t, e);
      },
      Y: function (t, e, i, r) {
        const n = he(t, r),
          o = n > 0 ? n : 1 - n;
        if ("YY" === e) {
          return de(o % 100, 2);
        }
        return "Yo" === e ? i.ordinalNumber(o, {
          unit: "year"
        }) : de(o, e.length);
      },
      R: function (t, e) {
        return de(Ot(t), e.length);
      },
      u: function (t, e) {
        return de(t.getFullYear(), e.length);
      },
      Q: function (t, e, i) {
        const r = Math.ceil((t.getMonth() + 1) / 3);
        switch (e) {
          case "Q":
            return String(r);
          case "QQ":
            return de(r, 2);
          case "Qo":
            return i.ordinalNumber(r, {
              unit: "quarter"
            });
          case "QQQ":
            return i.quarter(r, {
              width: "abbreviated",
              context: "formatting"
            });
          case "QQQQQ":
            return i.quarter(r, {
              width: "narrow",
              context: "formatting"
            });
          default:
            return i.quarter(r, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      q: function (t, e, i) {
        const r = Math.ceil((t.getMonth() + 1) / 3);
        switch (e) {
          case "q":
            return String(r);
          case "qq":
            return de(r, 2);
          case "qo":
            return i.ordinalNumber(r, {
              unit: "quarter"
            });
          case "qqq":
            return i.quarter(r, {
              width: "abbreviated",
              context: "standalone"
            });
          case "qqqqq":
            return i.quarter(r, {
              width: "narrow",
              context: "standalone"
            });
          default:
            return i.quarter(r, {
              width: "wide",
              context: "standalone"
            });
        }
      },
      M: function (t, e, i) {
        const r = t.getMonth();
        switch (e) {
          case "M":
          case "MM":
            return pe.M(t, e);
          case "Mo":
            return i.ordinalNumber(r + 1, {
              unit: "month"
            });
          case "MMM":
            return i.month(r, {
              width: "abbreviated",
              context: "formatting"
            });
          case "MMMMM":
            return i.month(r, {
              width: "narrow",
              context: "formatting"
            });
          default:
            return i.month(r, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      L: function (t, e, i) {
        const r = t.getMonth();
        switch (e) {
          case "L":
            return String(r + 1);
          case "LL":
            return de(r + 1, 2);
          case "Lo":
            return i.ordinalNumber(r + 1, {
              unit: "month"
            });
          case "LLL":
            return i.month(r, {
              width: "abbreviated",
              context: "standalone"
            });
          case "LLLLL":
            return i.month(r, {
              width: "narrow",
              context: "standalone"
            });
          default:
            return i.month(r, {
              width: "wide",
              context: "standalone"
            });
        }
      },
      w: function (t, e, i, r) {
        const n = ce(t, r);
        return "wo" === e ? i.ordinalNumber(n, {
          unit: "week"
        }) : de(n, e.length);
      },
      I: function (t, e, i) {
        const r = le(t);
        return "Io" === e ? i.ordinalNumber(r, {
          unit: "week"
        }) : de(r, e.length);
      },
      d: function (t, e, i) {
        return "do" === e ? i.ordinalNumber(t.getDate(), {
          unit: "date"
        }) : pe.d(t, e);
      },
      D: function (t, e, i) {
        const r = ae(t);
        return "Do" === e ? i.ordinalNumber(r, {
          unit: "dayOfYear"
        }) : de(r, e.length);
      },
      E: function (t, e, i) {
        const r = t.getDay();
        switch (e) {
          case "E":
          case "EE":
          case "EEE":
            return i.day(r, {
              width: "abbreviated",
              context: "formatting"
            });
          case "EEEEE":
            return i.day(r, {
              width: "narrow",
              context: "formatting"
            });
          case "EEEEEE":
            return i.day(r, {
              width: "short",
              context: "formatting"
            });
          default:
            return i.day(r, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      e: function (t, e, i, r) {
        const n = t.getDay(),
          o = (n - r.weekStartsOn + 8) % 7 || 7;
        switch (e) {
          case "e":
            return String(o);
          case "ee":
            return de(o, 2);
          case "eo":
            return i.ordinalNumber(o, {
              unit: "day"
            });
          case "eee":
            return i.day(n, {
              width: "abbreviated",
              context: "formatting"
            });
          case "eeeee":
            return i.day(n, {
              width: "narrow",
              context: "formatting"
            });
          case "eeeeee":
            return i.day(n, {
              width: "short",
              context: "formatting"
            });
          default:
            return i.day(n, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      c: function (t, e, i, r) {
        const n = t.getDay(),
          o = (n - r.weekStartsOn + 8) % 7 || 7;
        switch (e) {
          case "c":
            return String(o);
          case "cc":
            return de(o, e.length);
          case "co":
            return i.ordinalNumber(o, {
              unit: "day"
            });
          case "ccc":
            return i.day(n, {
              width: "abbreviated",
              context: "standalone"
            });
          case "ccccc":
            return i.day(n, {
              width: "narrow",
              context: "standalone"
            });
          case "cccccc":
            return i.day(n, {
              width: "short",
              context: "standalone"
            });
          default:
            return i.day(n, {
              width: "wide",
              context: "standalone"
            });
        }
      },
      i: function (t, e, i) {
        const r = t.getDay(),
          n = 0 === r ? 7 : r;
        switch (e) {
          case "i":
            return String(n);
          case "ii":
            return de(n, e.length);
          case "io":
            return i.ordinalNumber(n, {
              unit: "day"
            });
          case "iii":
            return i.day(r, {
              width: "abbreviated",
              context: "formatting"
            });
          case "iiiii":
            return i.day(r, {
              width: "narrow",
              context: "formatting"
            });
          case "iiiiii":
            return i.day(r, {
              width: "short",
              context: "formatting"
            });
          default:
            return i.day(r, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      a: function (t, e, i) {
        const r = t.getHours() / 12 >= 1 ? "pm" : "am";
        switch (e) {
          case "a":
          case "aa":
            return i.dayPeriod(r, {
              width: "abbreviated",
              context: "formatting"
            });
          case "aaa":
            return i.dayPeriod(r, {
              width: "abbreviated",
              context: "formatting"
            }).toLowerCase();
          case "aaaaa":
            return i.dayPeriod(r, {
              width: "narrow",
              context: "formatting"
            });
          default:
            return i.dayPeriod(r, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      b: function (t, e, i) {
        const r = t.getHours();
        let n;
        switch (n = 12 === r ? ge : 0 === r ? ue : r / 12 >= 1 ? "pm" : "am", e) {
          case "b":
          case "bb":
            return i.dayPeriod(n, {
              width: "abbreviated",
              context: "formatting"
            });
          case "bbb":
            return i.dayPeriod(n, {
              width: "abbreviated",
              context: "formatting"
            }).toLowerCase();
          case "bbbbb":
            return i.dayPeriod(n, {
              width: "narrow",
              context: "formatting"
            });
          default:
            return i.dayPeriod(n, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      B: function (t, e, i) {
        const r = t.getHours();
        let n;
        switch (n = r >= 17 ? be : r >= 12 ? me : r >= 4 ? Ae : ve, e) {
          case "B":
          case "BB":
          case "BBB":
            return i.dayPeriod(n, {
              width: "abbreviated",
              context: "formatting"
            });
          case "BBBBB":
            return i.dayPeriod(n, {
              width: "narrow",
              context: "formatting"
            });
          default:
            return i.dayPeriod(n, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      h: function (t, e, i) {
        if ("ho" === e) {
          let e = t.getHours() % 12;
          return 0 === e && (e = 12), i.ordinalNumber(e, {
            unit: "hour"
          });
        }
        return pe.h(t, e);
      },
      H: function (t, e, i) {
        return "Ho" === e ? i.ordinalNumber(t.getHours(), {
          unit: "hour"
        }) : pe.H(t, e);
      },
      K: function (t, e, i) {
        const r = t.getHours() % 12;
        return "Ko" === e ? i.ordinalNumber(r, {
          unit: "hour"
        }) : de(r, e.length);
      },
      k: function (t, e, i) {
        let r = t.getHours();
        return 0 === r && (r = 24), "ko" === e ? i.ordinalNumber(r, {
          unit: "hour"
        }) : de(r, e.length);
      },
      m: function (t, e, i) {
        return "mo" === e ? i.ordinalNumber(t.getMinutes(), {
          unit: "minute"
        }) : pe.m(t, e);
      },
      s: function (t, e, i) {
        return "so" === e ? i.ordinalNumber(t.getSeconds(), {
          unit: "second"
        }) : pe.s(t, e);
      },
      S: function (t, e) {
        return pe.S(t, e);
      },
      X: function (t, e, i) {
        const r = t.getTimezoneOffset();
        if (0 === r) return "Z";
        switch (e) {
          case "X":
            return _e(r);
          case "XXXX":
          case "XX":
            return we(r);
          default:
            return we(r, ":");
        }
      },
      x: function (t, e, i) {
        const r = t.getTimezoneOffset();
        switch (e) {
          case "x":
            return _e(r);
          case "xxxx":
          case "xx":
            return we(r);
          default:
            return we(r, ":");
        }
      },
      O: function (t, e, i) {
        const r = t.getTimezoneOffset();
        switch (e) {
          case "O":
          case "OO":
          case "OOO":
            return "GMT" + ye(r, ":");
          default:
            return "GMT" + we(r, ":");
        }
      },
      z: function (t, e, i) {
        const r = t.getTimezoneOffset();
        switch (e) {
          case "z":
          case "zz":
          case "zzz":
            return "GMT" + ye(r, ":");
          default:
            return "GMT" + we(r, ":");
        }
      },
      t: function (t, e, i) {
        return de(Math.trunc(+t / 1e3), e.length);
      },
      T: function (t, e, i) {
        return de(+t, e.length);
      }
    };
  function ye(t, e = "") {
    const i = t > 0 ? "-" : "+",
      r = Math.abs(t),
      n = Math.trunc(r / 60),
      o = r % 60;
    return 0 === o ? i + String(n) : i + String(n) + e + de(o, 2);
  }
  function _e(t, e) {
    if (t % 60 == 0) {
      return (t > 0 ? "-" : "+") + de(Math.abs(t) / 60, 2);
    }
    return we(t, e);
  }
  function we(t, e = "") {
    const i = t > 0 ? "-" : "+",
      r = Math.abs(t);
    return i + de(Math.trunc(r / 60), 2) + e + de(r % 60, 2);
  }
  const xe = (t, e) => {
      switch (t) {
        case "P":
          return e.date({
            width: "short"
          });
        case "PP":
          return e.date({
            width: "medium"
          });
        case "PPP":
          return e.date({
            width: "long"
          });
        default:
          return e.date({
            width: "full"
          });
      }
    },
    Pe = (t, e) => {
      switch (t) {
        case "p":
          return e.time({
            width: "short"
          });
        case "pp":
          return e.time({
            width: "medium"
          });
        case "ppp":
          return e.time({
            width: "long"
          });
        default:
          return e.time({
            width: "full"
          });
      }
    },
    Ee = {
      p: Pe,
      P: (t, e) => {
        const i = t.match(/(P+)(p+)?/) || [],
          r = i[1],
          n = i[2];
        if (!n) return xe(t, e);
        let o;
        switch (r) {
          case "P":
            o = e.dateTime({
              width: "short"
            });
            break;
          case "PP":
            o = e.dateTime({
              width: "medium"
            });
            break;
          case "PPP":
            o = e.dateTime({
              width: "long"
            });
            break;
          default:
            o = e.dateTime({
              width: "full"
            });
        }
        return o.replace("{{date}}", xe(r, e)).replace("{{time}}", Pe(n, e));
      }
    },
    Se = /^D+$/,
    Ce = /^Y+$/,
    Fe = ["D", "DD", "YY", "YYYY"];
  const Te = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
    Ke = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
    De = /^'([^]*?)'?$/,
    He = /''/g,
    Ue = /[a-zA-Z]/;
  function Be(t, e, i) {
    const r = It(),
      n = i?.locale ?? r.locale ?? se,
      o = i?.firstWeekContainsDate ?? i?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1,
      s = i?.weekStartsOn ?? i?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0,
      a = Bt(t, i?.in);
    if (!Xt(a)) throw new RangeError("Invalid time value");
    let l = e.match(Ke).map(t => {
      const e = t[0];
      if ("p" === e || "P" === e) {
        return (0, Ee[e])(t, n.formatLong);
      }
      return t;
    }).join("").match(Te).map(t => {
      if ("''" === t) return {
        isToken: !1,
        value: "'"
      };
      const e = t[0];
      if ("'" === e) return {
        isToken: !1,
        value: ke(t)
      };
      if (fe[e]) return {
        isToken: !0,
        value: t
      };
      if (e.match(Ue)) throw new RangeError("Format string contains an unescaped latin alphabet character `" + e + "`");
      return {
        isToken: !1,
        value: t
      };
    });
    n.localize.preprocessor && (l = n.localize.preprocessor(a, l));
    const h = {
      firstWeekContainsDate: o,
      weekStartsOn: s,
      locale: n
    };
    return l.map(r => {
      if (!r.isToken) return r.value;
      const o = r.value;
      (!i?.useAdditionalWeekYearTokens && function (t) {
        return Ce.test(t);
      }(o) || !i?.useAdditionalDayOfYearTokens && function (t) {
        return Se.test(t);
      }(o)) && function (t, e, i) {
        const r = function (t, e, i) {
          const r = "Y" === t[0] ? "years" : "days of the month";
          return `Use \`${t.toLowerCase()}\` instead of \`${t}\` (in \`${e}\`) for formatting ${r} to the input \`${i}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
        }(t, e, i);
        if (console.warn(r), Fe.includes(t)) throw new RangeError(r);
      }(o, e, String(t));
      return (0, fe[o[0]])(a, o, n.localize, h);
    }).join("");
  }
  function ke(t) {
    const e = t.match(De);
    return e ? e[1].replace(He, "'") : t;
  }
  function Me(t, e) {
    const {
        start: i,
        end: r
      } = function (t, e) {
        const [i, r] = zt(t, e.start, e.end);
        return {
          start: i,
          end: r
        };
      }(e?.in, t),
      n = {},
      o = Yt(r, i);
    o && (n.years = o);
    const s = kt(i, {
        years: n.years
      }),
      a = Zt(r, s);
    a && (n.months = a);
    const l = kt(s, {
        months: n.months
      }),
      h = function (t, e, i) {
        const [r, n] = zt(i?.in, t, e),
          o = Gt(r, n),
          s = Math.abs(jt(r, n));
        r.setDate(r.getDate() - o * s);
        const a = o * (s - Number(Gt(r, n) === -o));
        return 0 === a ? 0 : a;
      }(r, l);
    h && (n.days = h);
    const c = kt(l, {
        days: n.days
      }),
      d = function (t, e, i) {
        const [r, n] = zt(i?.in, t, e),
          o = (+r - +n) / Dt;
        return Qt(i?.roundingMethod)(o);
      }(r, c);
    d && (n.hours = d);
    const p = kt(c, {
        hours: n.hours
      }),
      u = function (t, e, i) {
        const r = Wt(t, e) / Kt;
        return Qt(i?.roundingMethod)(r);
      }(r, p);
    u && (n.minutes = u);
    const g = function (t, e, i) {
      const r = Wt(t, e) / 1e3;
      return Qt(i?.roundingMethod)(r);
    }(r, kt(p, {
      minutes: n.minutes
    }));
    return g && (n.seconds = g), n;
  }
  const Ie = (t, e, i, r) => {
    const n = r || {},
      o = i ?? {},
      s = new Event(e, {
        bubbles: void 0 === n.bubbles || n.bubbles,
        cancelable: Boolean(n.cancelable),
        composed: void 0 === n.composed || n.composed
      });
    return s.detail = o, t.dispatchEvent(s), s;
  };
  var Re, Ne, Oe, Le, ze, $e;
  !function (t) {
    t.ETA = "ETA", t.Elapsed = "Elapsed", t.Remaining = "Remaining";
  }(Re || (Re = {})), function (t) {
    t.F = "F", t.C = "C";
  }(Ne || (Ne = {})), function (t) {
    t.Status = "Status", t.PrinterOnline = "Online", t.Availability = "Availability", t.ProjectName = "Project", t.CurrentLayer = "Layer";
  }(Oe || (Oe = {})), function (t) {
    t.HotendCurrent = "Hotend", t.BedCurrent = "Bed", t.HotendTarget = "T Hotend", t.BedTarget = "T Bed", t.DryingStatus = "Dry Status", t.DryingTime = "Dry Time", t.SpeedMode = "Speed Mode", t.FanSpeed = "Fan Speed";
  }(Le || (Le = {})), function (t) {
    t.DryingStatus = "Dry Status", t.DryingTime = "Dry Time";
  }(ze || (ze = {})), function (t) {
    t.OnTime = "On Time", t.OffTime = "Off Time", t.BottomTime = "Bottom Time", t.ModelHeight = "Model Height", t.BottomLayers = "Bottom Layers", t.ZUpHeight = "Z Up Height", t.ZUpSpeed = "Z Up Speed", t.ZDownSpeed = "Z Down Speed";
  }($e || ($e = {}));
  const je = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, Re), Oe), Le), ze), $e);
  var Ve, Xe;
  !function (t) {
    t.PLA = "PLA", t.PETG = "PETG", t.ABS = "ABS", t.PACF = "PACF", t.PC = "PC", t.ASA = "ASA", t.HIPS = "HIPS", t.PA = "PA", t.PLA_SE = "PLA_SE";
  }(Ve || (Ve = {})), function (t) {
    t.PAUSE = "pause", t.RESUME = "resume", t.CANCEL = "cancel";
  }(Xe || (Xe = {}));
  const Ge = {
    ace_firmware: ["multi_color_box_fw_version"],
    drying_active: ["dry_status_is_drying"],
    drying_remaining_time: ["dry_status_remaining_time"],
    drying_total_duration: ["dry_status_total_duration"],
    fan_speed: ["fan_speed_pct"],
    hotbed_temperature: ["curr_hotbed_temp"],
    nozzle_temperature: ["curr_nozzle_temp"],
    printer_firmware: ["fw_version"],
    secondary_multi_color_box_spools: ["secondary_ace_spools"],
    target_hotbed_temperature: ["target_hotbed_temp"],
    target_nozzle_temperature: ["target_nozzle_temp"]
  };
  function Qe(t) {
    var e;
    return [t, ...(null !== (e = Ge[t]) && void 0 !== e ? e : [])];
  }
  const We = ["width", "height", "left", "top"];
  function qe(t, e) {
    Object.keys(e).forEach(t => {
      We.includes(t) && !isNaN(e[t]) && (e[t] = e[t].toString() + "px");
    }), t && Object.assign(t.style, e);
  }
  function Ze(t) {
    return {
      state: t.state,
      attributes: t.attributes,
      entity_id: "invalid_domain.invalid_entity",
      last_changed: "",
      last_updated: "",
      context: {
        id: "",
        parent_id: null,
        user_id: null
      }
    };
  }
  function Ye(t) {
    return t.toLowerCase().split(" ").map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
  }
  function Je(t, e) {
    return e ? t.states[e.entity_id] : void 0;
  }
  function ti(t, e) {
    const i = Je(t, e);
    return i ? String(i.state) : "";
  }
  function ei(t, e, i, r) {
    return "on" === ti(t, e) ? i : r;
  }
  function ii(t, e) {
    const i = {};
    if (e) for (const r in t.entities) {
      const n = t.entities[r];
      n.device_id === e && (i[n.entity_id] = n);
    }
    return i;
  }
  function ri(t, e, i) {
    var r;
    const n = Qe(i);
    for (const o in t) {
      const s = t[o],
        a = o.split("."),
        l = a[0],
        h = a[1];
      if (l === e && n.includes(null !== (r = s.translation_key) && void 0 !== r ? r : "")) return s;
      if (l === e && h.endsWith(i)) return s;
    }
  }
  function ni(t, e, i) {
    return e + "." + String(t) + i;
  }
  function oi(t, e, i, r) {
    var n;
    const o = Qe(r);
    for (const e in t) {
      const r = t[e];
      if (e.split(".")[0] === i && o.includes(null !== (n = r.translation_key) && void 0 !== n ? n : "")) return r;
    }
    if (e) for (const n in t) {
      const o = t[n],
        s = n.split("."),
        a = s[0],
        l = s[1].split(e)[1];
      if (a === i && l === r) return o;
    }
  }
  function si(t) {
    for (const e in t) {
      const t = e.split("."),
        i = t[0],
        r = t[1];
      if ("binary_sensor" === i && r.endsWith("printer_online")) return r.split("printer_online")[0];
    }
  }
  function ai(t, e, i, r) {
    return function (t, e, i, r, n = "unavailable", o = {}) {
      return Je(t, oi(e, i, "button", r)) || Ze({
        state: String(n),
        attributes: o
      });
    }(t, e, i, r, "unavailable", {
      duration: 0,
      temperature: 0
    });
  }
  function li(t) {
    return !["unavailable"].includes(t.state);
  }
  function hi(t, e, i, r) {
    const n = Je(t, oi(e, i, "image", r));
    return n ? function (t) {
      const e = t.attributes.access_token;
      return `${window.location.origin}/api/image_proxy/${t.entity_id}?token=${e}`;
    }(n) : void 0;
  }
  function ci(t, e, i, r, n = "unavailable", o = {}) {
    return Je(t, oi(e, i, "sensor", r)) || Ze({
      state: String(n),
      attributes: o
    });
  }
  function di(t, e, i, r) {
    const n = oi(e, i, "sensor", r);
    return n ? function (t, e) {
      const i = Je(t, e),
        r = i ? parseFloat(i.state) : 0;
      return isNaN(r) ? 0 : r;
    }(t, n) : void 0;
  }
  function pi(t, e, i, r, n, o, s = void 0) {
    const a = oi(e, i, "binary_sensor", r);
    return a ? ei(t, a, n, o) : s;
  }
  function ui(t, e, i, r) {
    const n = oi(e, i, "update", r);
    return n ? ei(t, n, "Update Available", "Up To Date") : void 0;
  }
  function gi(t, e, i) {
    return "Filament" === ci(t, e, i, "current_status").attributes.material_type;
  }
  function Ai(t) {
    const e = t.path.split("/");
    return e.length > 1 ? e[1] : void 0;
  }
  function mi(t) {
    const e = t.path.split("/");
    return e.length > 2 ? e[2] : "main";
  }
  function bi(t) {
    return ["printing", "preheating", "paused", "downloading", "checking"].includes(t);
  }
  function vi(t) {
    return e = 1e3 * t, Me({
      start: new Date(0),
      end: new Date(e)
    });
    var e;
  }
  const fi = (t, e) => {
      if (0 !== t && (!t || isNaN(t))) return "invalid duration";
      const i = vi(e ? 60 * Math.ceil(Number(t) / 60) : Number(t));
      return `${i.days && i.days > 0 ? `${i.days}d` : ""}${i.hours && i.hours > 0 ? `${i.hours}h` : ""}${i.minutes && i.minutes > 0 ? `${i.minutes}m` : ""}${i.seconds && i.seconds > 0 ? `${i.seconds}s` : e ? "" : "0s"}`;
    },
    yi = (t, e, i = !1, r = !1) => {
      switch (e) {
        case Re.Remaining:
          return fi(t, i);
        case Re.ETA:
          return ((t, e, i) => {
            if (0 !== t && (!t || isNaN(t))) return "invalid time";
            const r = e ? "" : ":ss",
              n = i ? `HH:mm${r}` : `h:mm${r} a`,
              o = new Date();
            return o.setSeconds(o.getSeconds() + Number(t)), Be(o, n, {
              in: Ct
            });
          })(t, i, r);
        case Re.Elapsed:
          return fi(t, i);
        default:
          return "<unknown>";
      }
    };
  const _i = {
      [Ne.C]: {
        [Ne.C]: t => t,
        [Ne.F]: t => 9 * t / 5 + 32
      },
      [Ne.F]: {
        [Ne.C]: t => 5 * (t - 32) / 9,
        [Ne.F]: t => t
      }
    },
    wi = (t, e, i = !1) => {
      const r = parseFloat(t.state),
        n = (t => {
          switch (t.attributes.unit_of_measurement) {
            case "°C":
            default:
              return Ne.C;
            case "°F":
              return Ne.F;
          }
        })(t),
        o = (s = r, l = e || n, _i[a = n] && _i[a][l] ? _i[a][l](s) : -1);
      var s, a, l;
      return `${i ? Math.round(o) : o.toFixed(2)}°${e || n}`;
    };
  function xi() {
    return [je.Status, je.ETA, je.Elapsed, je.Remaining];
  }
  function Pi() {
    return [...xi(), je.HotendCurrent, je.BedCurrent, je.HotendTarget, je.BedTarget, je.PrinterOnline, je.Availability, je.ProjectName, je.CurrentLayer];
  }
  function Ei(t) {
    var e;
    return (null !== (e = t.attributes.available_modes) && void 0 !== e ? e : []).reduce((t, e) => Object.assign(Object.assign({}, t), {
      [e.mode]: e.description
    }), {});
  }
  function Si(t) {
    return t && Object.values(Ve).includes(t) ? Ve[t.toUpperCase()] : void 0;
  }
  const Ci = t => e => "function" == typeof e ? ((t, e) => (window.customElements.get(t) || window.customElements.define(t, e), e))(t, e) : ((t, e) => {
    const {
      kind: i,
      elements: r
    } = e;
    return {
      kind: i,
      elements: r,
      finisher(e) {
        window.customElements.get(t) || window.customElements.define(t, e);
      }
    };
  })(t, e);
  let Fi = class extends ut {
    willUpdate(t) {
      super.willUpdate(t), t.has("selectedPrinterID") && (this.printerEntities = ii(this.hass, this.selectedPrinterID));
    }
    render() {
      return W`
      <debug-data elevation="2">
        <p>There are ${Object.keys(this.hass.states).length} entities.</p>
        <p>The screen is${this.narrow ? "" : " not"} narrow.</p>
        Configured panel config
        <pre>${JSON.stringify(this.panel, void 0, 2)}</pre>
        Current route
        <pre>${JSON.stringify(this.route, void 0, 2)}</pre>
        Printers
        <pre>${JSON.stringify(this.printers, void 0, 2)}</pre>
        Printer Entities
        <pre>${JSON.stringify(this.printerEntities, void 0, 2)}</pre>
        Selected Printer
        <pre>${JSON.stringify(this.selectedPrinterDevice, void 0, 2)}</pre>
      </debug-data>
    `;
    }
    static get styles() {
      return p`
      :host {
        padding: 16px;
        display: block;
      }
      debug-data {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
      }
    `;
    }
  };
  n([bt()], Fi.prototype, "hass", void 0), n([bt()], Fi.prototype, "language", void 0), n([bt({
    type: Boolean,
    reflect: !0
  })], Fi.prototype, "narrow", void 0), n([bt()], Fi.prototype, "route", void 0), n([bt()], Fi.prototype, "panel", void 0), n([bt()], Fi.prototype, "printers", void 0), n([bt({
    attribute: "selected-printer-id"
  })], Fi.prototype, "selectedPrinterID", void 0), n([bt({
    attribute: "selected-printer-device"
  })], Fi.prototype, "selectedPrinterDevice", void 0), n([vt()], Fi.prototype, "printerEntities", void 0), Fi = n([Ci("anycubic-view-debug")], Fi);
  var Ti,
    Ki,
    Di,
    Hi = "Anycubic Cloud",
    Ui = {
      actions: {
        cancel: "Cancel",
        pause: "Pause",
        print: "Print",
        resume: "Resume",
        yes: "Yes",
        no: "No",
        save: "Save"
      },
      messages: {
        mqtt_unsupported: "This feature requires MQTT to retrieve data but unfortunately MQTT is not supported with the configured authentication mode."
      }
    },
    Bi = {
      buttons: {
        print_settings: "Print Settings",
        dry: "Dry",
        runout_refill: "Refill"
      },
      configure: {
        tabs: {
          main: "Main",
          stats: "Stats",
          colours: "ACE Colour Presets"
        },
        labels: {
          printer_id: "Select Printer",
          vertical: "Vertical Layout?",
          round: "Round Stats?",
          use_24hr: "Use 24hr Time?",
          show_settings_button: "Always show print settings button?",
          always_show: "Always show card?",
          temperature_unit: "Temperature Unit",
          light_entity_id: "Light Entity",
          power_entity_id: "Power Entity",
          camera_entity_id: "Camera Entity",
          scale_factor: "Scale Factor",
          slot_colors: "Slot Colour Presets"
        }
      },
      print_settings: {
        confirm_message: "Are you sure you want to {action} the print?",
        label_nozzle_temp: "Nozzle Temperature",
        label_hotbed_temp: "Hotbed Temperature",
        label_fan_speed: "Fan Speed",
        label_aux_fan_speed: "AUX Fan Speed",
        label_box_fan_speed: "Box Fan Speed",
        print_pause: "Pause Print",
        print_resume: "Resume Print",
        print_cancel: "Cancel Print",
        save_speed_mode: "Save Speed Mode",
        save_target_nozzle: "Save Target Nozzle",
        save_target_hotbed: "Save Target Hotbed",
        save_fan_speed: "Save Fan Speed",
        save_aux_fan_speed: "Save AUX Fan Speed",
        save_box_fan_speed: "Save Box Fan Speed"
      },
      drying_settings: {
        heading: "Drying Options",
        button_preset: "Preset",
        button_stop_drying: "Stop Drying",
        button_minutes: "Mins"
      },
      spool_settings: {
        heading: "Editing Slot",
        label_select_material: "Select Material",
        label_select_colour: "Manually select colour"
      },
      monitored_stats: {
        ETA: "ETA",
        Elapsed: "Elapsed",
        Remaining: "Remaining",
        Status: "Status",
        Online: "Online",
        Availability: "Availability",
        Project: "Project",
        Layer: "Layer",
        Hotend: "Hotend",
        Bed: "Bed",
        "T Hotend": "T Hotend",
        "T Bed": "T Bed",
        "Dry Status": "Dry Status",
        "Dry Time": "Dry Time",
        "Speed Mode": "Speed Mode",
        "Fan Speed": "Fan Speed",
        "On Time": "On Time",
        "Off Time": "Off Time",
        "Bottom Time": "Bottom Time",
        "Model Height": "Model Height",
        "Bottom Layers": "Bottom Layers",
        "Z Up Height": "Z Up Height",
        "Z Up Speed": "Z Up Speed",
        "Z Down Speed": "Z Down Speed"
      }
    },
    ki = {
      initial: {
        printer_select: "Select a printer."
      },
      main: {
        title: "Main",
        cards: {
          main: {
            description: "General information about the printer.",
            fields: {
              printer_name: "Name",
              printer_id: "ID",
              printer_mac: "MAC",
              printer_model: "Model",
              printer_fw_version: "FW Version",
              printer_fw_update_available: "FW Status",
              printer_online: "Online",
              printer_available: "Available",
              curr_nozzle_temp: "Current Nozzle Temperature",
              curr_hotbed_temp: "Current Hotbed Temperature",
              target_nozzle_temp: "Target Nozzle Temperature",
              target_hotbed_temp: "Target Hotbed Temperature",
              job_state: "Job State",
              job_progress: "Job Progress",
              ace_fw_version: "ACE FW Version",
              ace_fw_update_available: "ACE FW Status",
              drying_active: "ACE Drying Status",
              drying_progress: "ACE Drying Progress"
            }
          }
        }
      },
      files_cloud: {
        title: "Cloud Files",
        cards: {}
      },
      files_local: {
        title: "Local Files",
        cards: {}
      },
      files_udisk: {
        title: "USB Files",
        cards: {}
      },
      print_save_in_cloud: {
        title: "Print (Save in user cloud)",
        cards: {}
      },
      print_no_cloud_save: {
        title: "Print (No Cloud Save)",
        cards: {}
      },
      debug: {
        title: "Debug",
        cards: {}
      }
    },
    Mi = {
      title: Hi,
      common: Ui,
      card: Bi,
      panels: ki
    },
    Ii = Object.freeze({
      __proto__: null,
      title: Hi,
      common: Ui,
      card: Bi,
      panels: ki,
      default: Mi
    });
  function Ri(t) {
    return t.type === Ki.literal;
  }
  function Ni(t) {
    return t.type === Ki.argument;
  }
  function Oi(t) {
    return t.type === Ki.number;
  }
  function Li(t) {
    return t.type === Ki.date;
  }
  function zi(t) {
    return t.type === Ki.time;
  }
  function $i(t) {
    return t.type === Ki.select;
  }
  function ji(t) {
    return t.type === Ki.plural;
  }
  function Vi(t) {
    return t.type === Ki.pound;
  }
  function Xi(t) {
    return t.type === Ki.tag;
  }
  function Gi(t) {
    return !(!t || "object" != typeof t || t.type !== Di.number);
  }
  function Qi(t) {
    return !(!t || "object" != typeof t || t.type !== Di.dateTime);
  }
  !function (t) {
    t[t.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", t[t.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", t[t.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", t[t.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", t[t.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", t[t.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", t[t.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", t[t.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", t[t.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", t[t.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", t[t.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", t[t.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", t[t.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", t[t.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", t[t.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", t[t.INVALID_TAG = 23] = "INVALID_TAG", t[t.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", t[t.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", t[t.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
  }(Ti || (Ti = {})), function (t) {
    t[t.literal = 0] = "literal", t[t.argument = 1] = "argument", t[t.number = 2] = "number", t[t.date = 3] = "date", t[t.time = 4] = "time", t[t.select = 5] = "select", t[t.plural = 6] = "plural", t[t.pound = 7] = "pound", t[t.tag = 8] = "tag";
  }(Ki || (Ki = {})), function (t) {
    t[t.number = 0] = "number", t[t.dateTime = 1] = "dateTime";
  }(Di || (Di = {}));
  var Wi = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
    qi = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
  function Zi(t) {
    var e = {};
    return t.replace(qi, function (t) {
      var i = t.length;
      switch (t[0]) {
        case "G":
          e.era = 4 === i ? "long" : 5 === i ? "narrow" : "short";
          break;
        case "y":
          e.year = 2 === i ? "2-digit" : "numeric";
          break;
        case "Y":
        case "u":
        case "U":
        case "r":
          throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
        case "q":
        case "Q":
          throw new RangeError("`q/Q` (quarter) patterns are not supported");
        case "M":
        case "L":
          e.month = ["numeric", "2-digit", "short", "long", "narrow"][i - 1];
          break;
        case "w":
        case "W":
          throw new RangeError("`w/W` (week) patterns are not supported");
        case "d":
          e.day = ["numeric", "2-digit"][i - 1];
          break;
        case "D":
        case "F":
        case "g":
          throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
        case "E":
          e.weekday = 4 === i ? "long" : 5 === i ? "narrow" : "short";
          break;
        case "e":
          if (i < 4) throw new RangeError("`e..eee` (weekday) patterns are not supported");
          e.weekday = ["short", "long", "narrow", "short"][i - 4];
          break;
        case "c":
          if (i < 4) throw new RangeError("`c..ccc` (weekday) patterns are not supported");
          e.weekday = ["short", "long", "narrow", "short"][i - 4];
          break;
        case "a":
          e.hour12 = !0;
          break;
        case "b":
        case "B":
          throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
        case "h":
          e.hourCycle = "h12", e.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "H":
          e.hourCycle = "h23", e.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "K":
          e.hourCycle = "h11", e.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "k":
          e.hourCycle = "h24", e.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "j":
        case "J":
        case "C":
          throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
        case "m":
          e.minute = ["numeric", "2-digit"][i - 1];
          break;
        case "s":
          e.second = ["numeric", "2-digit"][i - 1];
          break;
        case "S":
        case "A":
          throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
        case "z":
          e.timeZoneName = i < 4 ? "short" : "long";
          break;
        case "Z":
        case "O":
        case "v":
        case "V":
        case "X":
        case "x":
          throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
      }
      return "";
    }), e;
  }
  var Yi = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
  var Ji = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
    tr = /^(@+)?(\+|#+)?[rs]?$/g,
    er = /(\*)(0+)|(#+)(0+)|(0+)/g,
    ir = /^(0+)$/;
  function rr(t) {
    var e = {};
    return "r" === t[t.length - 1] ? e.roundingPriority = "morePrecision" : "s" === t[t.length - 1] && (e.roundingPriority = "lessPrecision"), t.replace(tr, function (t, i, r) {
      return "string" != typeof r ? (e.minimumSignificantDigits = i.length, e.maximumSignificantDigits = i.length) : "+" === r ? e.minimumSignificantDigits = i.length : "#" === i[0] ? e.maximumSignificantDigits = i.length : (e.minimumSignificantDigits = i.length, e.maximumSignificantDigits = i.length + ("string" == typeof r ? r.length : 0)), "";
    }), e;
  }
  function nr(t) {
    switch (t) {
      case "sign-auto":
        return {
          signDisplay: "auto"
        };
      case "sign-accounting":
      case "()":
        return {
          currencySign: "accounting"
        };
      case "sign-always":
      case "+!":
        return {
          signDisplay: "always"
        };
      case "sign-accounting-always":
      case "()!":
        return {
          signDisplay: "always",
          currencySign: "accounting"
        };
      case "sign-except-zero":
      case "+?":
        return {
          signDisplay: "exceptZero"
        };
      case "sign-accounting-except-zero":
      case "()?":
        return {
          signDisplay: "exceptZero",
          currencySign: "accounting"
        };
      case "sign-never":
      case "+_":
        return {
          signDisplay: "never"
        };
    }
  }
  function or(t) {
    var e;
    if ("E" === t[0] && "E" === t[1] ? (e = {
      notation: "engineering"
    }, t = t.slice(2)) : "E" === t[0] && (e = {
      notation: "scientific"
    }, t = t.slice(1)), e) {
      var i = t.slice(0, 2);
      if ("+!" === i ? (e.signDisplay = "always", t = t.slice(2)) : "+?" === i && (e.signDisplay = "exceptZero", t = t.slice(2)), !ir.test(t)) throw new Error("Malformed concise eng/scientific notation");
      e.minimumIntegerDigits = t.length;
    }
    return e;
  }
  function sr(t) {
    var e = nr(t);
    return e || {};
  }
  function ar(t) {
    for (var e = {}, i = 0, n = t; i < n.length; i++) {
      var o = n[i];
      switch (o.stem) {
        case "percent":
        case "%":
          e.style = "percent";
          continue;
        case "%x100":
          e.style = "percent", e.scale = 100;
          continue;
        case "currency":
          e.style = "currency", e.currency = o.options[0];
          continue;
        case "group-off":
        case ",_":
          e.useGrouping = !1;
          continue;
        case "precision-integer":
        case ".":
          e.maximumFractionDigits = 0;
          continue;
        case "measure-unit":
        case "unit":
          e.style = "unit", e.unit = o.options[0].replace(/^(.*?)-/, "");
          continue;
        case "compact-short":
        case "K":
          e.notation = "compact", e.compactDisplay = "short";
          continue;
        case "compact-long":
        case "KK":
          e.notation = "compact", e.compactDisplay = "long";
          continue;
        case "scientific":
          e = r(r(r({}, e), {
            notation: "scientific"
          }), o.options.reduce(function (t, e) {
            return r(r({}, t), sr(e));
          }, {}));
          continue;
        case "engineering":
          e = r(r(r({}, e), {
            notation: "engineering"
          }), o.options.reduce(function (t, e) {
            return r(r({}, t), sr(e));
          }, {}));
          continue;
        case "notation-simple":
          e.notation = "standard";
          continue;
        case "unit-width-narrow":
          e.currencyDisplay = "narrowSymbol", e.unitDisplay = "narrow";
          continue;
        case "unit-width-short":
          e.currencyDisplay = "code", e.unitDisplay = "short";
          continue;
        case "unit-width-full-name":
          e.currencyDisplay = "name", e.unitDisplay = "long";
          continue;
        case "unit-width-iso-code":
          e.currencyDisplay = "symbol";
          continue;
        case "scale":
          e.scale = parseFloat(o.options[0]);
          continue;
        case "rounding-mode-floor":
          e.roundingMode = "floor";
          continue;
        case "rounding-mode-ceiling":
          e.roundingMode = "ceil";
          continue;
        case "rounding-mode-down":
          e.roundingMode = "trunc";
          continue;
        case "rounding-mode-up":
          e.roundingMode = "expand";
          continue;
        case "rounding-mode-half-even":
          e.roundingMode = "halfEven";
          continue;
        case "rounding-mode-half-down":
          e.roundingMode = "halfTrunc";
          continue;
        case "rounding-mode-half-up":
          e.roundingMode = "halfExpand";
          continue;
        case "integer-width":
          if (o.options.length > 1) throw new RangeError("integer-width stems only accept a single optional option");
          o.options[0].replace(er, function (t, i, r, n, o, s) {
            if (i) e.minimumIntegerDigits = r.length;else {
              if (n && o) throw new Error("We currently do not support maximum integer digits");
              if (s) throw new Error("We currently do not support exact integer digits");
            }
            return "";
          });
          continue;
      }
      if (ir.test(o.stem)) e.minimumIntegerDigits = o.stem.length;else if (Ji.test(o.stem)) {
        if (o.options.length > 1) throw new RangeError("Fraction-precision stems only accept a single optional option");
        o.stem.replace(Ji, function (t, i, r, n, o, s) {
          return "*" === r ? e.minimumFractionDigits = i.length : n && "#" === n[0] ? e.maximumFractionDigits = n.length : o && s ? (e.minimumFractionDigits = o.length, e.maximumFractionDigits = o.length + s.length) : (e.minimumFractionDigits = i.length, e.maximumFractionDigits = i.length), "";
        });
        var s = o.options[0];
        "w" === s ? e = r(r({}, e), {
          trailingZeroDisplay: "stripIfInteger"
        }) : s && (e = r(r({}, e), rr(s)));
      } else if (tr.test(o.stem)) e = r(r({}, e), rr(o.stem));else {
        var a = nr(o.stem);
        a && (e = r(r({}, e), a));
        var l = or(o.stem);
        l && (e = r(r({}, e), l));
      }
    }
    return e;
  }
  var lr,
    hr = {
      "001": ["H", "h"],
      AC: ["H", "h", "hb", "hB"],
      AD: ["H", "hB"],
      AE: ["h", "hB", "hb", "H"],
      AF: ["H", "hb", "hB", "h"],
      AG: ["h", "hb", "H", "hB"],
      AI: ["H", "h", "hb", "hB"],
      AL: ["h", "H", "hB"],
      AM: ["H", "hB"],
      AO: ["H", "hB"],
      AR: ["H", "h", "hB", "hb"],
      AS: ["h", "H"],
      AT: ["H", "hB"],
      AU: ["h", "hb", "H", "hB"],
      AW: ["H", "hB"],
      AX: ["H"],
      AZ: ["H", "hB", "h"],
      BA: ["H", "hB", "h"],
      BB: ["h", "hb", "H", "hB"],
      BD: ["h", "hB", "H"],
      BE: ["H", "hB"],
      BF: ["H", "hB"],
      BG: ["H", "hB", "h"],
      BH: ["h", "hB", "hb", "H"],
      BI: ["H", "h"],
      BJ: ["H", "hB"],
      BL: ["H", "hB"],
      BM: ["h", "hb", "H", "hB"],
      BN: ["hb", "hB", "h", "H"],
      BO: ["H", "hB", "h", "hb"],
      BQ: ["H"],
      BR: ["H", "hB"],
      BS: ["h", "hb", "H", "hB"],
      BT: ["h", "H"],
      BW: ["H", "h", "hb", "hB"],
      BY: ["H", "h"],
      BZ: ["H", "h", "hb", "hB"],
      CA: ["h", "hb", "H", "hB"],
      CC: ["H", "h", "hb", "hB"],
      CD: ["hB", "H"],
      CF: ["H", "h", "hB"],
      CG: ["H", "hB"],
      CH: ["H", "hB", "h"],
      CI: ["H", "hB"],
      CK: ["H", "h", "hb", "hB"],
      CL: ["H", "h", "hB", "hb"],
      CM: ["H", "h", "hB"],
      CN: ["H", "hB", "hb", "h"],
      CO: ["h", "H", "hB", "hb"],
      CP: ["H"],
      CR: ["H", "h", "hB", "hb"],
      CU: ["H", "h", "hB", "hb"],
      CV: ["H", "hB"],
      CW: ["H", "hB"],
      CX: ["H", "h", "hb", "hB"],
      CY: ["h", "H", "hb", "hB"],
      CZ: ["H"],
      DE: ["H", "hB"],
      DG: ["H", "h", "hb", "hB"],
      DJ: ["h", "H"],
      DK: ["H"],
      DM: ["h", "hb", "H", "hB"],
      DO: ["h", "H", "hB", "hb"],
      DZ: ["h", "hB", "hb", "H"],
      EA: ["H", "h", "hB", "hb"],
      EC: ["H", "hB", "h", "hb"],
      EE: ["H", "hB"],
      EG: ["h", "hB", "hb", "H"],
      EH: ["h", "hB", "hb", "H"],
      ER: ["h", "H"],
      ES: ["H", "hB", "h", "hb"],
      ET: ["hB", "hb", "h", "H"],
      FI: ["H"],
      FJ: ["h", "hb", "H", "hB"],
      FK: ["H", "h", "hb", "hB"],
      FM: ["h", "hb", "H", "hB"],
      FO: ["H", "h"],
      FR: ["H", "hB"],
      GA: ["H", "hB"],
      GB: ["H", "h", "hb", "hB"],
      GD: ["h", "hb", "H", "hB"],
      GE: ["H", "hB", "h"],
      GF: ["H", "hB"],
      GG: ["H", "h", "hb", "hB"],
      GH: ["h", "H"],
      GI: ["H", "h", "hb", "hB"],
      GL: ["H", "h"],
      GM: ["h", "hb", "H", "hB"],
      GN: ["H", "hB"],
      GP: ["H", "hB"],
      GQ: ["H", "hB", "h", "hb"],
      GR: ["h", "H", "hb", "hB"],
      GT: ["H", "h", "hB", "hb"],
      GU: ["h", "hb", "H", "hB"],
      GW: ["H", "hB"],
      GY: ["h", "hb", "H", "hB"],
      HK: ["h", "hB", "hb", "H"],
      HN: ["H", "h", "hB", "hb"],
      HR: ["H", "hB"],
      HU: ["H", "h"],
      IC: ["H", "h", "hB", "hb"],
      ID: ["H"],
      IE: ["H", "h", "hb", "hB"],
      IL: ["H", "hB"],
      IM: ["H", "h", "hb", "hB"],
      IN: ["h", "H"],
      IO: ["H", "h", "hb", "hB"],
      IQ: ["h", "hB", "hb", "H"],
      IR: ["hB", "H"],
      IS: ["H"],
      IT: ["H", "hB"],
      JE: ["H", "h", "hb", "hB"],
      JM: ["h", "hb", "H", "hB"],
      JO: ["h", "hB", "hb", "H"],
      JP: ["H", "K", "h"],
      KE: ["hB", "hb", "H", "h"],
      KG: ["H", "h", "hB", "hb"],
      KH: ["hB", "h", "H", "hb"],
      KI: ["h", "hb", "H", "hB"],
      KM: ["H", "h", "hB", "hb"],
      KN: ["h", "hb", "H", "hB"],
      KP: ["h", "H", "hB", "hb"],
      KR: ["h", "H", "hB", "hb"],
      KW: ["h", "hB", "hb", "H"],
      KY: ["h", "hb", "H", "hB"],
      KZ: ["H", "hB"],
      LA: ["H", "hb", "hB", "h"],
      LB: ["h", "hB", "hb", "H"],
      LC: ["h", "hb", "H", "hB"],
      LI: ["H", "hB", "h"],
      LK: ["H", "h", "hB", "hb"],
      LR: ["h", "hb", "H", "hB"],
      LS: ["h", "H"],
      LT: ["H", "h", "hb", "hB"],
      LU: ["H", "h", "hB"],
      LV: ["H", "hB", "hb", "h"],
      LY: ["h", "hB", "hb", "H"],
      MA: ["H", "h", "hB", "hb"],
      MC: ["H", "hB"],
      MD: ["H", "hB"],
      ME: ["H", "hB", "h"],
      MF: ["H", "hB"],
      MG: ["H", "h"],
      MH: ["h", "hb", "H", "hB"],
      MK: ["H", "h", "hb", "hB"],
      ML: ["H"],
      MM: ["hB", "hb", "H", "h"],
      MN: ["H", "h", "hb", "hB"],
      MO: ["h", "hB", "hb", "H"],
      MP: ["h", "hb", "H", "hB"],
      MQ: ["H", "hB"],
      MR: ["h", "hB", "hb", "H"],
      MS: ["H", "h", "hb", "hB"],
      MT: ["H", "h"],
      MU: ["H", "h"],
      MV: ["H", "h"],
      MW: ["h", "hb", "H", "hB"],
      MX: ["H", "h", "hB", "hb"],
      MY: ["hb", "hB", "h", "H"],
      MZ: ["H", "hB"],
      NA: ["h", "H", "hB", "hb"],
      NC: ["H", "hB"],
      NE: ["H"],
      NF: ["H", "h", "hb", "hB"],
      NG: ["H", "h", "hb", "hB"],
      NI: ["H", "h", "hB", "hb"],
      NL: ["H", "hB"],
      NO: ["H", "h"],
      NP: ["H", "h", "hB"],
      NR: ["H", "h", "hb", "hB"],
      NU: ["H", "h", "hb", "hB"],
      NZ: ["h", "hb", "H", "hB"],
      OM: ["h", "hB", "hb", "H"],
      PA: ["h", "H", "hB", "hb"],
      PE: ["H", "hB", "h", "hb"],
      PF: ["H", "h", "hB"],
      PG: ["h", "H"],
      PH: ["h", "hB", "hb", "H"],
      PK: ["h", "hB", "H"],
      PL: ["H", "h"],
      PM: ["H", "hB"],
      PN: ["H", "h", "hb", "hB"],
      PR: ["h", "H", "hB", "hb"],
      PS: ["h", "hB", "hb", "H"],
      PT: ["H", "hB"],
      PW: ["h", "H"],
      PY: ["H", "h", "hB", "hb"],
      QA: ["h", "hB", "hb", "H"],
      RE: ["H", "hB"],
      RO: ["H", "hB"],
      RS: ["H", "hB", "h"],
      RU: ["H"],
      RW: ["H", "h"],
      SA: ["h", "hB", "hb", "H"],
      SB: ["h", "hb", "H", "hB"],
      SC: ["H", "h", "hB"],
      SD: ["h", "hB", "hb", "H"],
      SE: ["H"],
      SG: ["h", "hb", "H", "hB"],
      SH: ["H", "h", "hb", "hB"],
      SI: ["H", "hB"],
      SJ: ["H"],
      SK: ["H"],
      SL: ["h", "hb", "H", "hB"],
      SM: ["H", "h", "hB"],
      SN: ["H", "h", "hB"],
      SO: ["h", "H"],
      SR: ["H", "hB"],
      SS: ["h", "hb", "H", "hB"],
      ST: ["H", "hB"],
      SV: ["H", "h", "hB", "hb"],
      SX: ["H", "h", "hb", "hB"],
      SY: ["h", "hB", "hb", "H"],
      SZ: ["h", "hb", "H", "hB"],
      TA: ["H", "h", "hb", "hB"],
      TC: ["h", "hb", "H", "hB"],
      TD: ["h", "H", "hB"],
      TF: ["H", "h", "hB"],
      TG: ["H", "hB"],
      TH: ["H", "h"],
      TJ: ["H", "h"],
      TL: ["H", "hB", "hb", "h"],
      TM: ["H", "h"],
      TN: ["h", "hB", "hb", "H"],
      TO: ["h", "H"],
      TR: ["H", "hB"],
      TT: ["h", "hb", "H", "hB"],
      TW: ["hB", "hb", "h", "H"],
      TZ: ["hB", "hb", "H", "h"],
      UA: ["H", "hB", "h"],
      UG: ["hB", "hb", "H", "h"],
      UM: ["h", "hb", "H", "hB"],
      US: ["h", "hb", "H", "hB"],
      UY: ["H", "h", "hB", "hb"],
      UZ: ["H", "hB", "h"],
      VA: ["H", "h", "hB"],
      VC: ["h", "hb", "H", "hB"],
      VE: ["h", "H", "hB", "hb"],
      VG: ["h", "hb", "H", "hB"],
      VI: ["h", "hb", "H", "hB"],
      VN: ["H", "h"],
      VU: ["h", "H"],
      WF: ["H", "hB"],
      WS: ["h", "H"],
      XK: ["H", "hB", "h"],
      YE: ["h", "hB", "hb", "H"],
      YT: ["H", "hB"],
      ZA: ["H", "h", "hb", "hB"],
      ZM: ["h", "hb", "H", "hB"],
      ZW: ["H", "h"],
      "af-ZA": ["H", "h", "hB", "hb"],
      "ar-001": ["h", "hB", "hb", "H"],
      "ca-ES": ["H", "h", "hB"],
      "en-001": ["h", "hb", "H", "hB"],
      "es-BO": ["H", "h", "hB", "hb"],
      "es-BR": ["H", "h", "hB", "hb"],
      "es-EC": ["H", "h", "hB", "hb"],
      "es-ES": ["H", "h", "hB", "hb"],
      "es-GQ": ["H", "h", "hB", "hb"],
      "es-PE": ["H", "h", "hB", "hb"],
      "fr-CA": ["H", "h", "hB"],
      "gl-ES": ["H", "h", "hB"],
      "gu-IN": ["hB", "hb", "h", "H"],
      "hi-IN": ["hB", "h", "H"],
      "it-CH": ["H", "h", "hB"],
      "it-IT": ["H", "h", "hB"],
      "kn-IN": ["hB", "h", "H"],
      "ml-IN": ["hB", "h", "H"],
      "mr-IN": ["hB", "hb", "h", "H"],
      "pa-IN": ["hB", "hb", "h", "H"],
      "ta-IN": ["hB", "h", "hb", "H"],
      "te-IN": ["hB", "h", "H"],
      "zu-ZA": ["H", "hB", "hb", "h"]
    };
  function cr(t) {
    var e = t.hourCycle;
    if (void 0 === e && t.hourCycles && t.hourCycles.length && (e = t.hourCycles[0]), e) switch (e) {
      case "h24":
        return "k";
      case "h23":
        return "H";
      case "h12":
        return "h";
      case "h11":
        return "K";
      default:
        throw new Error("Invalid hourCycle");
    }
    var i,
      r = t.language;
    return "root" !== r && (i = t.maximize().region), (hr[i || ""] || hr[r || ""] || hr["".concat(r, "-001")] || hr["001"])[0];
  }
  var dr = new RegExp("^".concat(Wi.source, "*")),
    pr = new RegExp("".concat(Wi.source, "*$"));
  function ur(t, e) {
    return {
      start: t,
      end: e
    };
  }
  var gr = !!String.prototype.startsWith && "_a".startsWith("a", 1),
    Ar = !!String.fromCodePoint,
    mr = !!Object.fromEntries,
    br = !!String.prototype.codePointAt,
    vr = !!String.prototype.trimStart,
    fr = !!String.prototype.trimEnd,
    yr = !!Number.isSafeInteger ? Number.isSafeInteger : function (t) {
      return "number" == typeof t && isFinite(t) && Math.floor(t) === t && Math.abs(t) <= 9007199254740991;
    },
    _r = !0;
  try {
    _r = "a" === (null === (lr = Tr("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec("a")) || void 0 === lr ? void 0 : lr[0]);
  } catch (j) {
    _r = !1;
  }
  var wr,
    xr = gr ? function (t, e, i) {
      return t.startsWith(e, i);
    } : function (t, e, i) {
      return t.slice(i, i + e.length) === e;
    },
    Pr = Ar ? String.fromCodePoint : function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      for (var i, r = "", n = t.length, o = 0; n > o;) {
        if ((i = t[o++]) > 1114111) throw RangeError(i + " is not a valid code point");
        r += i < 65536 ? String.fromCharCode(i) : String.fromCharCode(55296 + ((i -= 65536) >> 10), i % 1024 + 56320);
      }
      return r;
    },
    Er = mr ? Object.fromEntries : function (t) {
      for (var e = {}, i = 0, r = t; i < r.length; i++) {
        var n = r[i],
          o = n[0],
          s = n[1];
        e[o] = s;
      }
      return e;
    },
    Sr = br ? function (t, e) {
      return t.codePointAt(e);
    } : function (t, e) {
      var i = t.length;
      if (!(e < 0 || e >= i)) {
        var r,
          n = t.charCodeAt(e);
        return n < 55296 || n > 56319 || e + 1 === i || (r = t.charCodeAt(e + 1)) < 56320 || r > 57343 ? n : r - 56320 + (n - 55296 << 10) + 65536;
      }
    },
    Cr = vr ? function (t) {
      return t.trimStart();
    } : function (t) {
      return t.replace(dr, "");
    },
    Fr = fr ? function (t) {
      return t.trimEnd();
    } : function (t) {
      return t.replace(pr, "");
    };
  function Tr(t, e) {
    return new RegExp(t, e);
  }
  if (_r) {
    var Kr = Tr("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
    wr = function (t, e) {
      var i;
      return Kr.lastIndex = e, null !== (i = Kr.exec(t)[1]) && void 0 !== i ? i : "";
    };
  } else wr = function (t, e) {
    for (var i = [];;) {
      var r = Sr(t, e);
      if (void 0 === r || Br(r) || kr(r)) break;
      i.push(r), e += r >= 65536 ? 2 : 1;
    }
    return Pr.apply(void 0, i);
  };
  var Dr = function () {
    function t(t, e) {
      void 0 === e && (e = {}), this.message = t, this.position = {
        offset: 0,
        line: 1,
        column: 1
      }, this.ignoreTag = !!e.ignoreTag, this.locale = e.locale, this.requiresOtherClause = !!e.requiresOtherClause, this.shouldParseSkeletons = !!e.shouldParseSkeletons;
    }
    return t.prototype.parse = function () {
      if (0 !== this.offset()) throw Error("parser can only be used once");
      return this.parseMessage(0, "", !1);
    }, t.prototype.parseMessage = function (t, e, i) {
      for (var r = []; !this.isEOF();) {
        var n = this.char();
        if (123 === n) {
          if ((o = this.parseArgument(t, i)).err) return o;
          r.push(o.val);
        } else {
          if (125 === n && t > 0) break;
          if (35 !== n || "plural" !== e && "selectordinal" !== e) {
            if (60 === n && !this.ignoreTag && 47 === this.peek()) {
              if (i) break;
              return this.error(Ti.UNMATCHED_CLOSING_TAG, ur(this.clonePosition(), this.clonePosition()));
            }
            if (60 === n && !this.ignoreTag && Hr(this.peek() || 0)) {
              if ((o = this.parseTag(t, e)).err) return o;
              r.push(o.val);
            } else {
              var o;
              if ((o = this.parseLiteral(t, e)).err) return o;
              r.push(o.val);
            }
          } else {
            var s = this.clonePosition();
            this.bump(), r.push({
              type: Ki.pound,
              location: ur(s, this.clonePosition())
            });
          }
        }
      }
      return {
        val: r,
        err: null
      };
    }, t.prototype.parseTag = function (t, e) {
      var i = this.clonePosition();
      this.bump();
      var r = this.parseTagName();
      if (this.bumpSpace(), this.bumpIf("/>")) return {
        val: {
          type: Ki.literal,
          value: "<".concat(r, "/>"),
          location: ur(i, this.clonePosition())
        },
        err: null
      };
      if (this.bumpIf(">")) {
        var n = this.parseMessage(t + 1, e, !0);
        if (n.err) return n;
        var o = n.val,
          s = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !Hr(this.char())) return this.error(Ti.INVALID_TAG, ur(s, this.clonePosition()));
          var a = this.clonePosition();
          return r !== this.parseTagName() ? this.error(Ti.UNMATCHED_CLOSING_TAG, ur(a, this.clonePosition())) : (this.bumpSpace(), this.bumpIf(">") ? {
            val: {
              type: Ki.tag,
              value: r,
              children: o,
              location: ur(i, this.clonePosition())
            },
            err: null
          } : this.error(Ti.INVALID_TAG, ur(s, this.clonePosition())));
        }
        return this.error(Ti.UNCLOSED_TAG, ur(i, this.clonePosition()));
      }
      return this.error(Ti.INVALID_TAG, ur(i, this.clonePosition()));
    }, t.prototype.parseTagName = function () {
      var t = this.offset();
      for (this.bump(); !this.isEOF() && Ur(this.char());) this.bump();
      return this.message.slice(t, this.offset());
    }, t.prototype.parseLiteral = function (t, e) {
      for (var i = this.clonePosition(), r = "";;) {
        var n = this.tryParseQuote(e);
        if (n) r += n;else {
          var o = this.tryParseUnquoted(t, e);
          if (o) r += o;else {
            var s = this.tryParseLeftAngleBracket();
            if (!s) break;
            r += s;
          }
        }
      }
      var a = ur(i, this.clonePosition());
      return {
        val: {
          type: Ki.literal,
          value: r,
          location: a
        },
        err: null
      };
    }, t.prototype.tryParseLeftAngleBracket = function () {
      return this.isEOF() || 60 !== this.char() || !this.ignoreTag && (Hr(t = this.peek() || 0) || 47 === t) ? null : (this.bump(), "<");
      var t;
    }, t.prototype.tryParseQuote = function (t) {
      if (this.isEOF() || 39 !== this.char()) return null;
      switch (this.peek()) {
        case 39:
          return this.bump(), this.bump(), "'";
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if ("plural" === t || "selectordinal" === t) break;
          return null;
        default:
          return null;
      }
      this.bump();
      var e = [this.char()];
      for (this.bump(); !this.isEOF();) {
        var i = this.char();
        if (39 === i) {
          if (39 !== this.peek()) {
            this.bump();
            break;
          }
          e.push(39), this.bump();
        } else e.push(i);
        this.bump();
      }
      return Pr.apply(void 0, e);
    }, t.prototype.tryParseUnquoted = function (t, e) {
      if (this.isEOF()) return null;
      var i = this.char();
      return 60 === i || 123 === i || 35 === i && ("plural" === e || "selectordinal" === e) || 125 === i && t > 0 ? null : (this.bump(), Pr(i));
    }, t.prototype.parseArgument = function (t, e) {
      var i = this.clonePosition();
      if (this.bump(), this.bumpSpace(), this.isEOF()) return this.error(Ti.EXPECT_ARGUMENT_CLOSING_BRACE, ur(i, this.clonePosition()));
      if (125 === this.char()) return this.bump(), this.error(Ti.EMPTY_ARGUMENT, ur(i, this.clonePosition()));
      var r = this.parseIdentifierIfPossible().value;
      if (!r) return this.error(Ti.MALFORMED_ARGUMENT, ur(i, this.clonePosition()));
      if (this.bumpSpace(), this.isEOF()) return this.error(Ti.EXPECT_ARGUMENT_CLOSING_BRACE, ur(i, this.clonePosition()));
      switch (this.char()) {
        case 125:
          return this.bump(), {
            val: {
              type: Ki.argument,
              value: r,
              location: ur(i, this.clonePosition())
            },
            err: null
          };
        case 44:
          return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(Ti.EXPECT_ARGUMENT_CLOSING_BRACE, ur(i, this.clonePosition())) : this.parseArgumentOptions(t, e, r, i);
        default:
          return this.error(Ti.MALFORMED_ARGUMENT, ur(i, this.clonePosition()));
      }
    }, t.prototype.parseIdentifierIfPossible = function () {
      var t = this.clonePosition(),
        e = this.offset(),
        i = wr(this.message, e),
        r = e + i.length;
      return this.bumpTo(r), {
        value: i,
        location: ur(t, this.clonePosition())
      };
    }, t.prototype.parseArgumentOptions = function (t, e, i, n) {
      var o,
        s = this.clonePosition(),
        a = this.parseIdentifierIfPossible().value,
        l = this.clonePosition();
      switch (a) {
        case "":
          return this.error(Ti.EXPECT_ARGUMENT_TYPE, ur(s, l));
        case "number":
        case "date":
        case "time":
          this.bumpSpace();
          var h = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var c = this.clonePosition();
            if ((v = this.parseSimpleArgStyleIfPossible()).err) return v;
            if (0 === (g = Fr(v.val)).length) return this.error(Ti.EXPECT_ARGUMENT_STYLE, ur(this.clonePosition(), this.clonePosition()));
            h = {
              style: g,
              styleLocation: ur(c, this.clonePosition())
            };
          }
          if ((f = this.tryParseArgumentClose(n)).err) return f;
          var d = ur(n, this.clonePosition());
          if (h && xr(null == h ? void 0 : h.style, "::", 0)) {
            var p = Cr(h.style.slice(2));
            if ("number" === a) return (v = this.parseNumberSkeletonFromString(p, h.styleLocation)).err ? v : {
              val: {
                type: Ki.number,
                value: i,
                location: d,
                style: v.val
              },
              err: null
            };
            if (0 === p.length) return this.error(Ti.EXPECT_DATE_TIME_SKELETON, d);
            var u = p;
            this.locale && (u = function (t, e) {
              for (var i = "", r = 0; r < t.length; r++) {
                var n = t.charAt(r);
                if ("j" === n) {
                  for (var o = 0; r + 1 < t.length && t.charAt(r + 1) === n;) o++, r++;
                  var s = 1 + (1 & o),
                    a = o < 2 ? 1 : 3 + (o >> 1),
                    l = cr(e);
                  for ("H" != l && "k" != l || (a = 0); a-- > 0;) i += "a";
                  for (; s-- > 0;) i = l + i;
                } else i += "J" === n ? "H" : n;
              }
              return i;
            }(p, this.locale));
            var g = {
              type: Di.dateTime,
              pattern: u,
              location: h.styleLocation,
              parsedOptions: this.shouldParseSkeletons ? Zi(u) : {}
            };
            return {
              val: {
                type: "date" === a ? Ki.date : Ki.time,
                value: i,
                location: d,
                style: g
              },
              err: null
            };
          }
          return {
            val: {
              type: "number" === a ? Ki.number : "date" === a ? Ki.date : Ki.time,
              value: i,
              location: d,
              style: null !== (o = null == h ? void 0 : h.style) && void 0 !== o ? o : null
            },
            err: null
          };
        case "plural":
        case "selectordinal":
        case "select":
          var A = this.clonePosition();
          if (this.bumpSpace(), !this.bumpIf(",")) return this.error(Ti.EXPECT_SELECT_ARGUMENT_OPTIONS, ur(A, r({}, A)));
          this.bumpSpace();
          var m = this.parseIdentifierIfPossible(),
            b = 0;
          if ("select" !== a && "offset" === m.value) {
            if (!this.bumpIf(":")) return this.error(Ti.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ur(this.clonePosition(), this.clonePosition()));
            var v;
            if (this.bumpSpace(), (v = this.tryParseDecimalInteger(Ti.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, Ti.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE)).err) return v;
            this.bumpSpace(), m = this.parseIdentifierIfPossible(), b = v.val;
          }
          var f,
            y = this.tryParsePluralOrSelectOptions(t, a, e, m);
          if (y.err) return y;
          if ((f = this.tryParseArgumentClose(n)).err) return f;
          var _ = ur(n, this.clonePosition());
          return "select" === a ? {
            val: {
              type: Ki.select,
              value: i,
              options: Er(y.val),
              location: _
            },
            err: null
          } : {
            val: {
              type: Ki.plural,
              value: i,
              options: Er(y.val),
              offset: b,
              pluralType: "plural" === a ? "cardinal" : "ordinal",
              location: _
            },
            err: null
          };
        default:
          return this.error(Ti.INVALID_ARGUMENT_TYPE, ur(s, l));
      }
    }, t.prototype.tryParseArgumentClose = function (t) {
      return this.isEOF() || 125 !== this.char() ? this.error(Ti.EXPECT_ARGUMENT_CLOSING_BRACE, ur(t, this.clonePosition())) : (this.bump(), {
        val: !0,
        err: null
      });
    }, t.prototype.parseSimpleArgStyleIfPossible = function () {
      for (var t = 0, e = this.clonePosition(); !this.isEOF();) {
        switch (this.char()) {
          case 39:
            this.bump();
            var i = this.clonePosition();
            if (!this.bumpUntil("'")) return this.error(Ti.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, ur(i, this.clonePosition()));
            this.bump();
            break;
          case 123:
            t += 1, this.bump();
            break;
          case 125:
            if (!(t > 0)) return {
              val: this.message.slice(e.offset, this.offset()),
              err: null
            };
            t -= 1;
            break;
          default:
            this.bump();
        }
      }
      return {
        val: this.message.slice(e.offset, this.offset()),
        err: null
      };
    }, t.prototype.parseNumberSkeletonFromString = function (t, e) {
      var i = [];
      try {
        i = function (t) {
          if (0 === t.length) throw new Error("Number skeleton cannot be empty");
          for (var e = t.split(Yi).filter(function (t) {
              return t.length > 0;
            }), i = [], r = 0, n = e; r < n.length; r++) {
            var o = n[r].split("/");
            if (0 === o.length) throw new Error("Invalid number skeleton");
            for (var s = o[0], a = o.slice(1), l = 0, h = a; l < h.length; l++) if (0 === h[l].length) throw new Error("Invalid number skeleton");
            i.push({
              stem: s,
              options: a
            });
          }
          return i;
        }(t);
      } catch (t) {
        return this.error(Ti.INVALID_NUMBER_SKELETON, e);
      }
      return {
        val: {
          type: Di.number,
          tokens: i,
          location: e,
          parsedOptions: this.shouldParseSkeletons ? ar(i) : {}
        },
        err: null
      };
    }, t.prototype.tryParsePluralOrSelectOptions = function (t, e, i, r) {
      for (var n, o = !1, s = [], a = new Set(), l = r.value, h = r.location;;) {
        if (0 === l.length) {
          var c = this.clonePosition();
          if ("select" === e || !this.bumpIf("=")) break;
          var d = this.tryParseDecimalInteger(Ti.EXPECT_PLURAL_ARGUMENT_SELECTOR, Ti.INVALID_PLURAL_ARGUMENT_SELECTOR);
          if (d.err) return d;
          h = ur(c, this.clonePosition()), l = this.message.slice(c.offset, this.offset());
        }
        if (a.has(l)) return this.error("select" === e ? Ti.DUPLICATE_SELECT_ARGUMENT_SELECTOR : Ti.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, h);
        "other" === l && (o = !0), this.bumpSpace();
        var p = this.clonePosition();
        if (!this.bumpIf("{")) return this.error("select" === e ? Ti.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : Ti.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, ur(this.clonePosition(), this.clonePosition()));
        var u = this.parseMessage(t + 1, e, i);
        if (u.err) return u;
        var g = this.tryParseArgumentClose(p);
        if (g.err) return g;
        s.push([l, {
          value: u.val,
          location: ur(p, this.clonePosition())
        }]), a.add(l), this.bumpSpace(), l = (n = this.parseIdentifierIfPossible()).value, h = n.location;
      }
      return 0 === s.length ? this.error("select" === e ? Ti.EXPECT_SELECT_ARGUMENT_SELECTOR : Ti.EXPECT_PLURAL_ARGUMENT_SELECTOR, ur(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !o ? this.error(Ti.MISSING_OTHER_CLAUSE, ur(this.clonePosition(), this.clonePosition())) : {
        val: s,
        err: null
      };
    }, t.prototype.tryParseDecimalInteger = function (t, e) {
      var i = 1,
        r = this.clonePosition();
      this.bumpIf("+") || this.bumpIf("-") && (i = -1);
      for (var n = !1, o = 0; !this.isEOF();) {
        var s = this.char();
        if (!(s >= 48 && s <= 57)) break;
        n = !0, o = 10 * o + (s - 48), this.bump();
      }
      var a = ur(r, this.clonePosition());
      return n ? yr(o *= i) ? {
        val: o,
        err: null
      } : this.error(e, a) : this.error(t, a);
    }, t.prototype.offset = function () {
      return this.position.offset;
    }, t.prototype.isEOF = function () {
      return this.offset() === this.message.length;
    }, t.prototype.clonePosition = function () {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column
      };
    }, t.prototype.char = function () {
      var t = this.position.offset;
      if (t >= this.message.length) throw Error("out of bound");
      var e = Sr(this.message, t);
      if (void 0 === e) throw Error("Offset ".concat(t, " is at invalid UTF-16 code unit boundary"));
      return e;
    }, t.prototype.error = function (t, e) {
      return {
        val: null,
        err: {
          kind: t,
          message: this.message,
          location: e
        }
      };
    }, t.prototype.bump = function () {
      if (!this.isEOF()) {
        var t = this.char();
        10 === t ? (this.position.line += 1, this.position.column = 1, this.position.offset += 1) : (this.position.column += 1, this.position.offset += t < 65536 ? 1 : 2);
      }
    }, t.prototype.bumpIf = function (t) {
      if (xr(this.message, t, this.offset())) {
        for (var e = 0; e < t.length; e++) this.bump();
        return !0;
      }
      return !1;
    }, t.prototype.bumpUntil = function (t) {
      var e = this.offset(),
        i = this.message.indexOf(t, e);
      return i >= 0 ? (this.bumpTo(i), !0) : (this.bumpTo(this.message.length), !1);
    }, t.prototype.bumpTo = function (t) {
      if (this.offset() > t) throw Error("targetOffset ".concat(t, " must be greater than or equal to the current offset ").concat(this.offset()));
      for (t = Math.min(t, this.message.length);;) {
        var e = this.offset();
        if (e === t) break;
        if (e > t) throw Error("targetOffset ".concat(t, " is at invalid UTF-16 code unit boundary"));
        if (this.bump(), this.isEOF()) break;
      }
    }, t.prototype.bumpSpace = function () {
      for (; !this.isEOF() && Br(this.char());) this.bump();
    }, t.prototype.peek = function () {
      if (this.isEOF()) return null;
      var t = this.char(),
        e = this.offset(),
        i = this.message.charCodeAt(e + (t >= 65536 ? 2 : 1));
      return null != i ? i : null;
    }, t;
  }();
  function Hr(t) {
    return t >= 97 && t <= 122 || t >= 65 && t <= 90;
  }
  function Ur(t) {
    return 45 === t || 46 === t || t >= 48 && t <= 57 || 95 === t || t >= 97 && t <= 122 || t >= 65 && t <= 90 || 183 == t || t >= 192 && t <= 214 || t >= 216 && t <= 246 || t >= 248 && t <= 893 || t >= 895 && t <= 8191 || t >= 8204 && t <= 8205 || t >= 8255 && t <= 8256 || t >= 8304 && t <= 8591 || t >= 11264 && t <= 12271 || t >= 12289 && t <= 55295 || t >= 63744 && t <= 64975 || t >= 65008 && t <= 65533 || t >= 65536 && t <= 983039;
  }
  function Br(t) {
    return t >= 9 && t <= 13 || 32 === t || 133 === t || t >= 8206 && t <= 8207 || 8232 === t || 8233 === t;
  }
  function kr(t) {
    return t >= 33 && t <= 35 || 36 === t || t >= 37 && t <= 39 || 40 === t || 41 === t || 42 === t || 43 === t || 44 === t || 45 === t || t >= 46 && t <= 47 || t >= 58 && t <= 59 || t >= 60 && t <= 62 || t >= 63 && t <= 64 || 91 === t || 92 === t || 93 === t || 94 === t || 96 === t || 123 === t || 124 === t || 125 === t || 126 === t || 161 === t || t >= 162 && t <= 165 || 166 === t || 167 === t || 169 === t || 171 === t || 172 === t || 174 === t || 176 === t || 177 === t || 182 === t || 187 === t || 191 === t || 215 === t || 247 === t || t >= 8208 && t <= 8213 || t >= 8214 && t <= 8215 || 8216 === t || 8217 === t || 8218 === t || t >= 8219 && t <= 8220 || 8221 === t || 8222 === t || 8223 === t || t >= 8224 && t <= 8231 || t >= 8240 && t <= 8248 || 8249 === t || 8250 === t || t >= 8251 && t <= 8254 || t >= 8257 && t <= 8259 || 8260 === t || 8261 === t || 8262 === t || t >= 8263 && t <= 8273 || 8274 === t || 8275 === t || t >= 8277 && t <= 8286 || t >= 8592 && t <= 8596 || t >= 8597 && t <= 8601 || t >= 8602 && t <= 8603 || t >= 8604 && t <= 8607 || 8608 === t || t >= 8609 && t <= 8610 || 8611 === t || t >= 8612 && t <= 8613 || 8614 === t || t >= 8615 && t <= 8621 || 8622 === t || t >= 8623 && t <= 8653 || t >= 8654 && t <= 8655 || t >= 8656 && t <= 8657 || 8658 === t || 8659 === t || 8660 === t || t >= 8661 && t <= 8691 || t >= 8692 && t <= 8959 || t >= 8960 && t <= 8967 || 8968 === t || 8969 === t || 8970 === t || 8971 === t || t >= 8972 && t <= 8991 || t >= 8992 && t <= 8993 || t >= 8994 && t <= 9e3 || 9001 === t || 9002 === t || t >= 9003 && t <= 9083 || 9084 === t || t >= 9085 && t <= 9114 || t >= 9115 && t <= 9139 || t >= 9140 && t <= 9179 || t >= 9180 && t <= 9185 || t >= 9186 && t <= 9254 || t >= 9255 && t <= 9279 || t >= 9280 && t <= 9290 || t >= 9291 && t <= 9311 || t >= 9472 && t <= 9654 || 9655 === t || t >= 9656 && t <= 9664 || 9665 === t || t >= 9666 && t <= 9719 || t >= 9720 && t <= 9727 || t >= 9728 && t <= 9838 || 9839 === t || t >= 9840 && t <= 10087 || 10088 === t || 10089 === t || 10090 === t || 10091 === t || 10092 === t || 10093 === t || 10094 === t || 10095 === t || 10096 === t || 10097 === t || 10098 === t || 10099 === t || 10100 === t || 10101 === t || t >= 10132 && t <= 10175 || t >= 10176 && t <= 10180 || 10181 === t || 10182 === t || t >= 10183 && t <= 10213 || 10214 === t || 10215 === t || 10216 === t || 10217 === t || 10218 === t || 10219 === t || 10220 === t || 10221 === t || 10222 === t || 10223 === t || t >= 10224 && t <= 10239 || t >= 10240 && t <= 10495 || t >= 10496 && t <= 10626 || 10627 === t || 10628 === t || 10629 === t || 10630 === t || 10631 === t || 10632 === t || 10633 === t || 10634 === t || 10635 === t || 10636 === t || 10637 === t || 10638 === t || 10639 === t || 10640 === t || 10641 === t || 10642 === t || 10643 === t || 10644 === t || 10645 === t || 10646 === t || 10647 === t || 10648 === t || t >= 10649 && t <= 10711 || 10712 === t || 10713 === t || 10714 === t || 10715 === t || t >= 10716 && t <= 10747 || 10748 === t || 10749 === t || t >= 10750 && t <= 11007 || t >= 11008 && t <= 11055 || t >= 11056 && t <= 11076 || t >= 11077 && t <= 11078 || t >= 11079 && t <= 11084 || t >= 11085 && t <= 11123 || t >= 11124 && t <= 11125 || t >= 11126 && t <= 11157 || 11158 === t || t >= 11159 && t <= 11263 || t >= 11776 && t <= 11777 || 11778 === t || 11779 === t || 11780 === t || 11781 === t || t >= 11782 && t <= 11784 || 11785 === t || 11786 === t || 11787 === t || 11788 === t || 11789 === t || t >= 11790 && t <= 11798 || 11799 === t || t >= 11800 && t <= 11801 || 11802 === t || 11803 === t || 11804 === t || 11805 === t || t >= 11806 && t <= 11807 || 11808 === t || 11809 === t || 11810 === t || 11811 === t || 11812 === t || 11813 === t || 11814 === t || 11815 === t || 11816 === t || 11817 === t || t >= 11818 && t <= 11822 || 11823 === t || t >= 11824 && t <= 11833 || t >= 11834 && t <= 11835 || t >= 11836 && t <= 11839 || 11840 === t || 11841 === t || 11842 === t || t >= 11843 && t <= 11855 || t >= 11856 && t <= 11857 || 11858 === t || t >= 11859 && t <= 11903 || t >= 12289 && t <= 12291 || 12296 === t || 12297 === t || 12298 === t || 12299 === t || 12300 === t || 12301 === t || 12302 === t || 12303 === t || 12304 === t || 12305 === t || t >= 12306 && t <= 12307 || 12308 === t || 12309 === t || 12310 === t || 12311 === t || 12312 === t || 12313 === t || 12314 === t || 12315 === t || 12316 === t || 12317 === t || t >= 12318 && t <= 12319 || 12320 === t || 12336 === t || 64830 === t || 64831 === t || t >= 65093 && t <= 65094;
  }
  function Mr(t) {
    t.forEach(function (t) {
      if (delete t.location, $i(t) || ji(t)) for (var e in t.options) delete t.options[e].location, Mr(t.options[e].value);else Oi(t) && Gi(t.style) || (Li(t) || zi(t)) && Qi(t.style) ? delete t.style.location : Xi(t) && Mr(t.children);
    });
  }
  function Ir(t, e) {
    void 0 === e && (e = {}), e = r({
      shouldParseSkeletons: !0,
      requiresOtherClause: !0
    }, e);
    var i = new Dr(t, e).parse();
    if (i.err) {
      var n = SyntaxError(Ti[i.err.kind]);
      throw n.location = i.err.location, n.originalMessage = i.err.message, n;
    }
    return (null == e ? void 0 : e.captureLocation) || Mr(i.val), i.val;
  }
  function Rr(t, e) {
    var i = e && e.cache ? e.cache : Xr,
      r = e && e.serializer ? e.serializer : $r;
    return (e && e.strategy ? e.strategy : zr)(t, {
      cache: i,
      serializer: r
    });
  }
  function Nr(t, e, i, r) {
    var n,
      o = null == (n = r) || "number" == typeof n || "boolean" == typeof n ? r : i(r),
      s = e.get(o);
    return void 0 === s && (s = t.call(this, r), e.set(o, s)), s;
  }
  function Or(t, e, i) {
    var r = Array.prototype.slice.call(arguments, 3),
      n = i(r),
      o = e.get(n);
    return void 0 === o && (o = t.apply(this, r), e.set(n, o)), o;
  }
  function Lr(t, e, i, r, n) {
    return i.bind(e, t, r, n);
  }
  function zr(t, e) {
    return Lr(t, this, 1 === t.length ? Nr : Or, e.cache.create(), e.serializer);
  }
  var $r = function () {
    return JSON.stringify(arguments);
  };
  function jr() {
    this.cache = Object.create(null);
  }
  jr.prototype.get = function (t) {
    return this.cache[t];
  }, jr.prototype.set = function (t, e) {
    this.cache[t] = e;
  };
  var Vr,
    Xr = {
      create: function () {
        return new jr();
      }
    },
    Gr = {
      variadic: function (t, e) {
        return Lr(t, this, Or, e.cache.create(), e.serializer);
      },
      monadic: function (t, e) {
        return Lr(t, this, Nr, e.cache.create(), e.serializer);
      }
    };
  !function (t) {
    t.MISSING_VALUE = "MISSING_VALUE", t.INVALID_VALUE = "INVALID_VALUE", t.MISSING_INTL_API = "MISSING_INTL_API";
  }(Vr || (Vr = {}));
  var Qr,
    Wr = function (t) {
      function e(e, i, r) {
        var n = t.call(this, e) || this;
        return n.code = i, n.originalMessage = r, n;
      }
      return i(e, t), e.prototype.toString = function () {
        return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
      }, e;
    }(Error),
    qr = function (t) {
      function e(e, i, r, n) {
        return t.call(this, 'Invalid values for "'.concat(e, '": "').concat(i, '". Options are "').concat(Object.keys(r).join('", "'), '"'), Vr.INVALID_VALUE, n) || this;
      }
      return i(e, t), e;
    }(Wr),
    Zr = function (t) {
      function e(e, i, r) {
        return t.call(this, 'Value for "'.concat(e, '" must be of type ').concat(i), Vr.INVALID_VALUE, r) || this;
      }
      return i(e, t), e;
    }(Wr),
    Yr = function (t) {
      function e(e, i) {
        return t.call(this, 'The intl string context variable "'.concat(e, '" was not provided to the string "').concat(i, '"'), Vr.MISSING_VALUE, i) || this;
      }
      return i(e, t), e;
    }(Wr);
  function Jr(t) {
    return "function" == typeof t;
  }
  function tn(t, e, i, r, n, o, s) {
    if (1 === t.length && Ri(t[0])) return [{
      type: Qr.literal,
      value: t[0].value
    }];
    for (var a = [], l = 0, h = t; l < h.length; l++) {
      var c = h[l];
      if (Ri(c)) a.push({
        type: Qr.literal,
        value: c.value
      });else if (Vi(c)) "number" == typeof o && a.push({
        type: Qr.literal,
        value: i.getNumberFormat(e).format(o)
      });else {
        var d = c.value;
        if (!n || !(d in n)) throw new Yr(d, s);
        var p = n[d];
        if (Ni(c)) p && "string" != typeof p && "number" != typeof p || (p = "string" == typeof p || "number" == typeof p ? String(p) : ""), a.push({
          type: "string" == typeof p ? Qr.literal : Qr.object,
          value: p
        });else if (Li(c)) {
          var u = "string" == typeof c.style ? r.date[c.style] : Qi(c.style) ? c.style.parsedOptions : void 0;
          a.push({
            type: Qr.literal,
            value: i.getDateTimeFormat(e, u).format(p)
          });
        } else if (zi(c)) {
          u = "string" == typeof c.style ? r.time[c.style] : Qi(c.style) ? c.style.parsedOptions : r.time.medium;
          a.push({
            type: Qr.literal,
            value: i.getDateTimeFormat(e, u).format(p)
          });
        } else if (Oi(c)) {
          (u = "string" == typeof c.style ? r.number[c.style] : Gi(c.style) ? c.style.parsedOptions : void 0) && u.scale && (p *= u.scale || 1), a.push({
            type: Qr.literal,
            value: i.getNumberFormat(e, u).format(p)
          });
        } else {
          if (Xi(c)) {
            var g = c.children,
              A = c.value,
              m = n[A];
            if (!Jr(m)) throw new Zr(A, "function", s);
            var b = m(tn(g, e, i, r, n, o).map(function (t) {
              return t.value;
            }));
            Array.isArray(b) || (b = [b]), a.push.apply(a, b.map(function (t) {
              return {
                type: "string" == typeof t ? Qr.literal : Qr.object,
                value: t
              };
            }));
          }
          if ($i(c)) {
            if (!(v = c.options[p] || c.options.other)) throw new qr(c.value, p, Object.keys(c.options), s);
            a.push.apply(a, tn(v.value, e, i, r, n));
          } else if (ji(c)) {
            var v;
            if (!(v = c.options["=".concat(p)])) {
              if (!Intl.PluralRules) throw new Wr('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', Vr.MISSING_INTL_API, s);
              var f = i.getPluralRules(e, {
                type: c.pluralType
              }).select(p - (c.offset || 0));
              v = c.options[f] || c.options.other;
            }
            if (!v) throw new qr(c.value, p, Object.keys(c.options), s);
            a.push.apply(a, tn(v.value, e, i, r, n, p - (c.offset || 0)));
          } else ;
        }
      }
    }
    return function (t) {
      return t.length < 2 ? t : t.reduce(function (t, e) {
        var i = t[t.length - 1];
        return i && i.type === Qr.literal && e.type === Qr.literal ? i.value += e.value : t.push(e), t;
      }, []);
    }(a);
  }
  function en(t, e) {
    return e ? Object.keys(t).reduce(function (i, n) {
      var o, s;
      return i[n] = (o = t[n], (s = e[n]) ? r(r(r({}, o || {}), s || {}), Object.keys(o).reduce(function (t, e) {
        return t[e] = r(r({}, o[e]), s[e] || {}), t;
      }, {})) : o), i;
    }, r({}, t)) : t;
  }
  function rn(t) {
    return {
      create: function () {
        return {
          get: function (e) {
            return t[e];
          },
          set: function (e, i) {
            t[e] = i;
          }
        };
      }
    };
  }
  !function (t) {
    t[t.literal = 0] = "literal", t[t.object = 1] = "object";
  }(Qr || (Qr = {}));
  var nn = function () {
      function t(e, i, n, s) {
        var a,
          l = this;
        if (void 0 === i && (i = t.defaultLocale), this.formatterCache = {
          number: {},
          dateTime: {},
          pluralRules: {}
        }, this.format = function (t) {
          var e = l.formatToParts(t);
          if (1 === e.length) return e[0].value;
          var i = e.reduce(function (t, e) {
            return t.length && e.type === Qr.literal && "string" == typeof t[t.length - 1] ? t[t.length - 1] += e.value : t.push(e.value), t;
          }, []);
          return i.length <= 1 ? i[0] || "" : i;
        }, this.formatToParts = function (t) {
          return tn(l.ast, l.locales, l.formatters, l.formats, t, void 0, l.message);
        }, this.resolvedOptions = function () {
          var t;
          return {
            locale: (null === (t = l.resolvedLocale) || void 0 === t ? void 0 : t.toString()) || Intl.NumberFormat.supportedLocalesOf(l.locales)[0]
          };
        }, this.getAst = function () {
          return l.ast;
        }, this.locales = i, this.resolvedLocale = t.resolveLocale(i), "string" == typeof e) {
          if (this.message = e, !t.__parse) throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
          var h = s || {};
          h.formatters;
          var c = function (t, e) {
            var i = {};
            for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (i[r] = t[r]);
            if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
              var n = 0;
              for (r = Object.getOwnPropertySymbols(t); n < r.length; n++) e.indexOf(r[n]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[n]) && (i[r[n]] = t[r[n]]);
            }
            return i;
          }(h, ["formatters"]);
          this.ast = t.__parse(e, r(r({}, c), {
            locale: this.resolvedLocale
          }));
        } else this.ast = e;
        if (!Array.isArray(this.ast)) throw new TypeError("A message must be provided as a String or AST.");
        this.formats = en(t.formats, n), this.formatters = s && s.formatters || (void 0 === (a = this.formatterCache) && (a = {
          number: {},
          dateTime: {},
          pluralRules: {}
        }), {
          getNumberFormat: Rr(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.NumberFormat).bind.apply(t, o([void 0], e, !1)))();
          }, {
            cache: rn(a.number),
            strategy: Gr.variadic
          }),
          getDateTimeFormat: Rr(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.DateTimeFormat).bind.apply(t, o([void 0], e, !1)))();
          }, {
            cache: rn(a.dateTime),
            strategy: Gr.variadic
          }),
          getPluralRules: Rr(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.PluralRules).bind.apply(t, o([void 0], e, !1)))();
          }, {
            cache: rn(a.pluralRules),
            strategy: Gr.variadic
          })
        });
      }
      return Object.defineProperty(t, "defaultLocale", {
        get: function () {
          return t.memoizedDefaultLocale || (t.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale), t.memoizedDefaultLocale;
        },
        enumerable: !1,
        configurable: !0
      }), t.memoizedDefaultLocale = null, t.resolveLocale = function (t) {
        if (void 0 !== Intl.Locale) {
          var e = Intl.NumberFormat.supportedLocalesOf(t);
          return e.length > 0 ? new Intl.Locale(e[0]) : new Intl.Locale("string" == typeof t ? t : t[0]);
        }
      }, t.__parse = Ir, t.formats = {
        number: {
          integer: {
            maximumFractionDigits: 0
          },
          currency: {
            style: "currency"
          },
          percent: {
            style: "percent"
          }
        },
        date: {
          short: {
            month: "numeric",
            day: "numeric",
            year: "2-digit"
          },
          medium: {
            month: "short",
            day: "numeric",
            year: "numeric"
          },
          long: {
            month: "long",
            day: "numeric",
            year: "numeric"
          },
          full: {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          }
        },
        time: {
          short: {
            hour: "numeric",
            minute: "numeric"
          },
          medium: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
          },
          long: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short"
          },
          full: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short"
          }
        }
      }, t;
    }(),
    on = nn,
    sn = {
      en: Ii
    };
  function an(t, e, ...i) {
    const r = e.replace(/['"]+/g, "");
    var n;
    try {
      n = t.split(".").reduce((t, e) => t[e], sn[r]);
    } catch (e) {
      n = t.split(".").reduce((t, e) => t[e], sn.en);
    }
    if (void 0 === n && (n = t.split(".").reduce((t, e) => t[e], sn.en)), !i.length) return n;
    const o = {};
    for (let t = 0; t < i.length; t += 2) {
      let e = i[t];
      e = e.replace(/^{([^}]+)?}$/, "$1"), o[e] = i[t + 1];
    }
    try {
      return new on(n, e).format(o);
    } catch (t) {
      return "Translation " + t;
    }
  }
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const ln = 1,
    hn = 2,
    cn = t => (...e) => ({
      _$litDirective$: t,
      values: e
    });
  class dn {
    constructor(t) {}
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t, e, i) {
      this._$Ct = t, this._$AM = e, this._$Ci = i;
    }
    _$AS(t, e) {
      return this.update(t, e);
    }
    update(t, e) {
      return this.render(...e);
    }
  }
  /**
       * @license
       * Copyright 2018 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const pn = cn(class extends dn {
      constructor(t) {
        if (super(t), t.type !== ln || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
      }
      render(t) {
        return " " + Object.keys(t).filter(e => t[e]).join(" ") + " ";
      }
      update(t, [e]) {
        if (void 0 === this.st) {
          this.st = new Set(), void 0 !== t.strings && (this.nt = new Set(t.strings.join(" ").split(/\s/).filter(t => "" !== t)));
          for (const t in e) e[t] && !this.nt?.has(t) && this.st.add(t);
          return this.render(e);
        }
        const i = t.element.classList;
        for (const t of this.st) t in e || (i.remove(t), this.st.delete(t));
        for (const t in e) {
          const r = !!e[t];
          r === this.st.has(t) || this.nt?.has(t) || (r ? (i.add(t), this.st.add(t)) : (i.remove(t), this.st.delete(t)));
        }
        return q;
      }
    }),
    un = "important",
    gn = " !" + un,
    An = cn(class extends dn {
      constructor(t) {
        if (super(t), t.type !== ln || "style" !== t.name || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
      }
      render(t) {
        return Object.keys(t).reduce((e, i) => {
          const r = t[i];
          return null == r ? e : e + `${i = i.includes("-") ? i : i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
        }, "");
      }
      update(t, [e]) {
        const {
          style: i
        } = t.element;
        if (void 0 === this.ft) return this.ft = new Set(Object.keys(e)), this.render(e);
        for (const t of this.ft) null == e[t] && (this.ft.delete(t), t.includes("-") ? i.removeProperty(t) : i[t] = null);
        for (const t in e) {
          const r = e[t];
          if (null != r) {
            this.ft.add(t);
            const e = "string" == typeof r && r.endsWith(gn);
            t.includes("-") || e ? i.setProperty(t, e ? r.slice(0, -11) : r, e ? un : "") : i[t] = r;
          }
        }
        return q;
      }
    }),
    {
      I: mn
    } = dt,
    bn = () => document.createComment(""),
    vn = (t, e, i) => {
      const r = t._$AA.parentNode,
        n = void 0 === e ? t._$AB : e._$AA;
      if (void 0 === i) {
        const e = r.insertBefore(bn(), n),
          o = r.insertBefore(bn(), n);
        i = new mn(e, o, t, t.options);
      } else {
        const e = i._$AB.nextSibling,
          o = i._$AM,
          s = o !== t;
        if (s) {
          let e;
          i._$AQ?.(t), i._$AM = t, void 0 !== i._$AP && (e = t._$AU) !== o._$AU && i._$AP(e);
        }
        if (e !== n || s) {
          let t = i._$AA;
          for (; t !== e;) {
            const e = t.nextSibling;
            r.insertBefore(t, n), t = e;
          }
        }
      }
      return i;
    },
    fn = (t, e, i = t) => (t._$AI(e, i), t),
    yn = {},
    _n = t => {
      t._$AP?.(!1, !0);
      let e = t._$AA;
      const i = t._$AB.nextSibling;
      for (; e !== i;) {
        const t = e.nextSibling;
        e.remove(), e = t;
      }
    },
    wn = (t, e) => {
      const i = t._$AN;
      if (void 0 === i) return !1;
      for (const t of i) t._$AO?.(e, !1), wn(t, e);
      return !0;
    },
    xn = t => {
      let e, i;
      do {
        if (void 0 === (e = t._$AM)) break;
        i = e._$AN, i.delete(t), t = e;
      } while (0 === i?.size);
    },
    Pn = t => {
      for (let e; e = t._$AM; t = e) {
        let i = e._$AN;
        if (void 0 === i) e._$AN = i = new Set();else if (i.has(t)) break;
        i.add(t), Cn(e);
      }
    };
  /**
       * @license
       * Copyright 2018 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function En(t) {
    void 0 !== this._$AN ? (xn(this), this._$AM = t, Pn(this)) : this._$AM = t;
  }
  function Sn(t, e = !1, i = 0) {
    const r = this._$AH,
      n = this._$AN;
    if (void 0 !== n && 0 !== n.size) if (e) {
      if (Array.isArray(r)) for (let t = i; t < r.length; t++) wn(r[t], !1), xn(r[t]);else null != r && (wn(r, !1), xn(r));
    } else wn(this, t);
  }
  const Cn = t => {
    t.type == hn && (t._$AP ??= Sn, t._$AQ ??= En);
  };
  class Fn extends dn {
    constructor() {
      super(...arguments), this._$AN = void 0;
    }
    _$AT(t, e, i) {
      super._$AT(t, e, i), Pn(this), this.isConnected = t._$AU;
    }
    _$AO(t, e = !0) {
      t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), e && (wn(this, t), xn(this));
    }
    setValue(t) {
      if ((t => void 0 === t.strings)(this._$Ct)) this._$Ct._$AI(t, this);else {
        const e = [...this._$Ct._$AH];
        e[this._$Ci] = t, this._$Ct._$AI(e, this, 0);
      }
    }
    disconnected() {}
    reconnected() {}
  }
  const Tn = new WeakMap();
  let Kn = 0;
  const Dn = new Map(),
    Hn = new WeakSet(),
    Un = () => new Promise(t => requestAnimationFrame(t)),
    Bn = (t, e) => {
      const i = t - e;
      return 0 === i ? void 0 : i;
    },
    kn = (t, e) => {
      const i = t / e;
      return 1 === i ? void 0 : i;
    },
    Mn = {
      left: (t, e) => {
        const i = Bn(t, e);
        return {
          value: i,
          transform: null == i || isNaN(i) ? void 0 : `translateX(${i}px)`
        };
      },
      top: (t, e) => {
        const i = Bn(t, e);
        return {
          value: i,
          transform: null == i || isNaN(i) ? void 0 : `translateY(${i}px)`
        };
      },
      width: (t, e) => {
        let i;
        0 === e && (e = 1, i = {
          width: "1px"
        });
        const r = kn(t, e);
        return {
          value: r,
          overrideFrom: i,
          transform: null == r || isNaN(r) ? void 0 : `scaleX(${r})`
        };
      },
      height: (t, e) => {
        let i;
        0 === e && (e = 1, i = {
          height: "1px"
        });
        const r = kn(t, e);
        return {
          value: r,
          overrideFrom: i,
          transform: null == r || isNaN(r) ? void 0 : `scaleY(${r})`
        };
      }
    },
    In = {
      duration: 333,
      easing: "ease-in-out"
    },
    Rn = ["left", "top", "width", "height", "opacity", "color", "background"],
    Nn = new WeakMap();
  const On = cn(class extends Fn {
    constructor(t) {
      if (super(t), this.t = !1, this.i = null, this.o = null, this.h = !0, this.shouldLog = !1, t.type === hn) throw Error("The `animate` directive must be used in attribute position.");
      this.createFinished();
    }
    createFinished() {
      this.resolveFinished?.(), this.finished = new Promise(t => {
        this.l = t;
      });
    }
    async resolveFinished() {
      this.l?.(), this.l = void 0;
    }
    render(t) {
      return Z;
    }
    getController() {
      return Tn.get(this.u);
    }
    isDisabled() {
      return this.options.disabled || this.getController()?.disabled;
    }
    update(t, [e]) {
      const i = void 0 === this.u;
      return i && (this.u = t.options?.host, this.u.addController(this), this.u.updateComplete.then(t => this.t = !0), this.element = t.element, Nn.set(this.element, this)), this.optionsOrCallback = e, (i || "function" != typeof e) && this.p(e), this.render(e);
    }
    p(t) {
      t = t ?? {};
      const e = this.getController();
      void 0 !== e && ((t = {
        ...e.defaultOptions,
        ...t
      }).keyframeOptions = {
        ...e.defaultOptions.keyframeOptions,
        ...t.keyframeOptions
      }), t.properties ??= Rn, this.options = t;
    }
    m() {
      const t = {},
        e = this.element.getBoundingClientRect(),
        i = getComputedStyle(this.element);
      return this.options.properties.forEach(r => {
        const n = e[r] ?? (Mn[r] ? void 0 : i[r]),
          o = Number(n);
        t[r] = isNaN(o) ? n + "" : o;
      }), t;
    }
    v() {
      let t,
        e = !0;
      return this.options.guard && (t = this.options.guard(), e = ((t, e) => {
        if (Array.isArray(t)) {
          if (Array.isArray(e) && e.length === t.length && t.every((t, i) => t === e[i])) return !1;
        } else if (e === t) return !1;
        return !0;
      })(t, this._)), this.h = this.t && !this.isDisabled() && !this.isAnimating() && e && this.element.isConnected, this.h && (this._ = Array.isArray(t) ? Array.from(t) : t), this.h;
    }
    hostUpdate() {
      "function" == typeof this.optionsOrCallback && this.p(this.optionsOrCallback()), this.v() && (this.A = this.m(), this.i = this.i ?? this.element.parentNode, this.o = this.element.nextSibling);
    }
    async hostUpdated() {
      if (!this.h || !this.element.isConnected || this.options.skipInitial && !this.isHostRendered) return;
      let t;
      this.prepare(), await Un;
      const e = this.O(),
        i = this.j(this.options.keyframeOptions, e),
        r = this.m();
      if (void 0 !== this.A) {
        const {
          from: i,
          to: n
        } = this.N(this.A, r, e);
        this.log("measured", [this.A, r, i, n]), t = this.calculateKeyframes(i, n);
      } else {
        const i = Dn.get(this.options.inId);
        if (i) {
          Dn.delete(this.options.inId);
          const {
            from: n,
            to: o
          } = this.N(i, r, e);
          t = this.calculateKeyframes(n, o), t = this.options.in ? [{
            ...this.options.in[0],
            ...t[0]
          }, ...this.options.in.slice(1), t[1]] : t, Kn++, t.forEach(t => t.zIndex = Kn);
        } else this.options.in && (t = [...this.options.in, {}]);
      }
      this.animate(t, i);
    }
    resetStyles() {
      void 0 !== this.P && (this.element.setAttribute("style", this.P ?? ""), this.P = void 0);
    }
    commitStyles() {
      this.P = this.element.getAttribute("style"), this.webAnimation?.commitStyles(), this.webAnimation?.cancel();
    }
    reconnected() {}
    async disconnected() {
      if (!this.h) return;
      if (void 0 !== this.options.id && Dn.set(this.options.id, this.A), void 0 === this.options.out) return;
      if (this.prepare(), await Un(), this.i?.isConnected) {
        const t = this.o && this.o.parentNode === this.i ? this.o : null;
        if (this.i.insertBefore(this.element, t), this.options.stabilizeOut) {
          const t = this.m();
          this.log("stabilizing out");
          const e = this.A.left - t.left,
            i = this.A.top - t.top;
          !("static" === getComputedStyle(this.element).position) || 0 === e && 0 === i || (this.element.style.position = "relative"), 0 !== e && (this.element.style.left = e + "px"), 0 !== i && (this.element.style.top = i + "px");
        }
      }
      const t = this.j(this.options.keyframeOptions);
      await this.animate(this.options.out, t), this.element.remove();
    }
    prepare() {
      this.createFinished();
    }
    start() {
      this.options.onStart?.(this);
    }
    didFinish(t) {
      t && this.options.onComplete?.(this), this.A = void 0, this.animatingProperties = void 0, this.frames = void 0, this.resolveFinished();
    }
    O() {
      const t = [];
      for (let e = this.element.parentNode; e; e = e?.parentNode) {
        const i = Nn.get(e);
        i && !i.isDisabled() && i && t.push(i);
      }
      return t;
    }
    get isHostRendered() {
      const t = Hn.has(this.u);
      return t || this.u.updateComplete.then(() => {
        Hn.add(this.u);
      }), t;
    }
    j(t, e = this.O()) {
      const i = {
        ...In
      };
      return e.forEach(t => Object.assign(i, t.options.keyframeOptions)), Object.assign(i, t), i;
    }
    N(t, e, i) {
      t = {
        ...t
      }, e = {
        ...e
      };
      const r = i.map(t => t.animatingProperties).filter(t => void 0 !== t);
      let n = 1,
        o = 1;
      return r.length > 0 && (r.forEach(t => {
        t.width && (n /= t.width), t.height && (o /= t.height);
      }), void 0 !== t.left && void 0 !== e.left && (t.left = n * t.left, e.left = n * e.left), void 0 !== t.top && void 0 !== e.top && (t.top = o * t.top, e.top = o * e.top)), {
        from: t,
        to: e
      };
    }
    calculateKeyframes(t, e, i = !1) {
      const r = {},
        n = {};
      let o = !1;
      const s = {};
      for (const i in e) {
        const a = t[i],
          l = e[i];
        if (i in Mn) {
          const t = Mn[i];
          if (void 0 === a || void 0 === l) continue;
          const e = t(a, l);
          void 0 !== e.transform && (s[i] = e.value, o = !0, r.transform = `${r.transform ?? ""} ${e.transform}`, void 0 !== e.overrideFrom && Object.assign(r, e.overrideFrom));
        } else a !== l && void 0 !== a && void 0 !== l && (o = !0, r[i] = a, n[i] = l);
      }
      return r.transformOrigin = n.transformOrigin = i ? "center center" : "top left", this.animatingProperties = s, o ? [r, n] : void 0;
    }
    async animate(t, e = this.options.keyframeOptions) {
      this.start(), this.frames = t;
      let i = !1;
      if (!this.isAnimating() && !this.isDisabled() && (this.options.onFrames && (this.frames = t = this.options.onFrames(this), this.log("modified frames", t)), void 0 !== t)) {
        this.log("animate", [t, e]), i = !0, this.webAnimation = this.element.animate(t, e);
        const r = this.getController();
        r?.add(this);
        try {
          await this.webAnimation.finished;
        } catch (t) {}
        r?.remove(this);
      }
      return this.didFinish(i), i;
    }
    isAnimating() {
      return "running" === this.webAnimation?.playState || this.webAnimation?.pending;
    }
    log(t, e) {
      this.shouldLog && !this.isDisabled() && console.log(t, this.options.id, e);
    }
  });
  let Ln = class extends ut {
    constructor() {
      super(...arguments), this.camImgString = "none", this._handleToggleClick = () => {
        this.toggleVideo && this.toggleVideo();
      };
    }
    willUpdate(t) {
      super.willUpdate(t), (t.has("showVideo") || t.has("cameraEntity")) && (this.camImgString = this.showVideo && this.cameraEntity ? `url('${function (t) {
        const e = t.attributes.access_token;
        return `${window.location.origin}/api/camera_proxy_stream/${t.entity_id}?token=${e}`;
      }(this.cameraEntity)}')` : "none");
    }
    render() {
      const t = {
        display: this.showVideo ? "block" : "none"
      };
      return W`
      <div
        class="ac-printercard-cameraview"
        style=${An(t)}
        @click=${this._handleToggleClick}
      >
        ${this.showVideo ? this._renderInner() : Z}
      </div>
    `;
    }
    _renderInner() {
      const t = {
        "background-image": this.camImgString
      };
      return W` <div
      class="ac-camera-wrapper"
      style=${An(t)}
    ></div>`;
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        display: block;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
      }

      .ac-printercard-cameraview {
        background-color: black;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }

      .ac-camera-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        background-size: cover;
        background-position: center;
      }
    `;
    }
  };
  /**
       * @license
       * Copyright 2021 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function* zn(t, e) {
    if (void 0 !== t) {
      let i = 0;
      for (const r of t) yield e(r, i++);
    }
  }
  n([bt({
    attribute: "show-video"
  })], Ln.prototype, "showVideo", void 0), n([bt({
    attribute: "toggle-video"
  })], Ln.prototype, "toggleVideo", void 0), n([bt({
    attribute: "camera-entity"
  })], Ln.prototype, "cameraEntity", void 0), n([vt()], Ln.prototype, "camImgString", void 0), Ln = n([Ci("anycubic-printercard-camera_view")], Ln);
  const $n = "secondary_",
    jn = "ace_run_out_refill",
    Vn = $n + jn,
    Xn = "ace_spools",
    Gn = $n + Xn;
  let Qn = class extends ut {
    constructor() {
      super(...arguments), this.box_id = 0, this.showControls = !0, this.allowSpoolEdit = !0, this._runoutRefillId = jn, this._spoolsEntityId = Xn, this.spoolList = [], this.selectedIndex = -1, this.selectedMaterialType = "", this.selectedColor = [0, 0, 0], this._changingRunout = !1, this._openDryingModal = () => {
        Ie(this, "ac-mcbdry-modal", {
          modalOpen: !0,
          box_id: this.box_id
        });
      }, this._handleRunoutRefillChanged = t => {
        this._changingRunout || (this._changingRunout = !0, this.hass.callService("switch", "toggle", {
          entity_id: ni(this.printerEntityIdPart, "switch", this._runoutRefillId)
        }).then(() => {
          this._changingRunout = !1;
        }).catch(t => {
          this._changingRunout = !1;
        }));
      }, this._editSpool = t => {
        var e, i, r;
        if (!this.allowSpoolEdit) return;
        const n = t.currentTarget.index,
          o = null !== (e = t.currentTarget.local_slot) && void 0 !== e ? e : n + 1,
          s = null !== (i = t.currentTarget.display_slot) && void 0 !== i ? i : o,
          a = null !== (r = t.currentTarget.box_id) && void 0 !== r ? r : this.box_id,
          l = t.currentTarget.material_type,
          h = t.currentTarget.color;
        Ie(this, "ac-mcb-modal", {
          modalOpen: !0,
          box_id: a,
          spool_index: o - 1,
          display_slot: s,
          material_type: l,
          color: h
        });
      };
    }
    willUpdate(t) {
      var e, i, r, n;
      super.willUpdate(t), t.has("language") && (this._buttonRefill = an("card.buttons.runout_refill", this.language), this._buttonDry = an("card.buttons.dry", this.language)), (t.has("box_id") || t.has("spoolsEntityId")) && (this.spoolsEntityId ? this._spoolsEntityId = this.spoolsEntityId : 1 === this.box_id ? (this._runoutRefillId = Vn, this._spoolsEntityId = Gn) : (this._runoutRefillId = jn, this._spoolsEntityId = Xn)), (t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart") || t.has("spoolsEntityId")) && (this.spoolList = ci(this.hass, this.printerEntities, this.printerEntityIdPart, this._spoolsEntityId, "not loaded", {
        spool_info: []
      }).attributes.spool_info, this._runoutRefillState = (e = this.hass, i = this.printerEntities, r = this.printerEntityIdPart, n = this._runoutRefillId, Je(e, oi(i, r, "switch", n))));
    }
    render() {
      return W`
      <div class="ac-printercard-mcbview">
        ${this.showControls ? W`
              <div class="ac-printercard-mcbmenu ac-printercard-menuleft">
                <div class="ac-switch" @click=${this._handleRunoutRefillChanged}>
                  <div class="ac-switch-label">${this._buttonRefill}</div>
                  <ha-entity-toggle
                    .hass=${this.hass}
                    .stateObj=${this._runoutRefillState}
                  ></ha-entity-toggle>
                </div>
              </div>
            ` : W`<div class="ac-printercard-mcbmenu"></div>`}
        <div class="ac-printercard-spoolcont">${this._renderSpools()}</div>
        ${this.showControls ? W`
              <div class="ac-printercard-mcbmenu ac-printercard-menuright">
                <ha-control-button @click=${this._openDryingModal}>
                  <ha-svg-icon .path=${"M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z"}></ha-svg-icon>
                  ${this._buttonDry}
                </ha-control-button>
              </div>
            ` : W`<div class="ac-printercard-mcbmenu"></div>`}
      </div>
    `;
    }
    _renderSpools() {
      return zn(this.spoolList, (t, e) => {
        var i, r, n, o;
        const s = null !== (r = null !== (i = t.display_slot) && void 0 !== i ? i : t.slot) && void 0 !== r ? r : e + 1,
          a = {
            "background-color": t.spool_loaded ? `rgb(${t.color[0]}, ${t.color[1]}, ${t.color[2]})` : "#aaa"
          };
        return W`
          <div
            class="ac-spool-info"
            .index=${e}
            .local_slot=${null !== (n = t.local_slot) && void 0 !== n ? n : e + 1}
            .display_slot=${s}
            .box_id=${null !== (o = t.box_id) && void 0 !== o ? o : this.box_id}
            .material_type=${t.material_type}
            .color=${t.color}
            @click=${this._editSpool}
          >
            <div class="ac-spool-color-ring-cont">
              <div
                class="ac-spool-color-ring-inner"
                style=${An(a)}
              >
                <div class="ac-spool-color-num">${s}</div>
              </div>
            </div>
            <div class="ac-spool-material-type">
              ${t.spool_loaded ? t.material_type : "---"}
            </div>
          </div>
        `;
      });
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-mcbview {
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-mcbmenu {
        height: 100%;
        position: relative;
        width: 10.42%;
      }

      .ac-printercard-spoolcont {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 62.5%;
      }

      .ac-spool-info {
        box-sizing: border-box;
        height: auto;
        cursor: pointer;
        width: 25%;
        padding: 5px;
      }

      .ac-spool-color-ring-cont {
        position: relative;
        width: 100%;
        box-sizing: border-box;
      }

      .ac-spool-color-ring-cont:before {
        content: "";
        display: block;
        padding-top: 100%;
      }

      .ac-spool-color-ring-inner {
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background-color: #aaa;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ac-spool-color-num {
        font-weight: 900;
        box-sizing: border-box;
        border-radius: 50%;
        background-color: #eee;
        width: 46.5%;
        height: 46.5%;
        color: #222;
        text-align: center;
      }

      .ac-spool-color-num:before {
        content: "";
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        padding-top: 2.5px;
      }

      .ac-spool-material-type {
        height: auto;
        text-align: center;
        font-weight: 900;
      }

      .ac-printercard-mcbmenu ha-control-button {
        font-size: 12px;
        margin: 0px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        min-width: 48px;
        min-height: 48px;
        width: 100%;
      }

      .ac-printercard-menuright ha-control-button {
        right: 0px;
      }

      .ac-printercard-mcbmenu .ac-switch-label {
        font-size: 12px;
      }

      .ac-printercard-mcbmenu .ac-switch {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
        margin: 0px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        box-sizing: border-box;
        padding: 4px 4px;
        justify-content: center;
        background-color: #8686862e;
        border-radius: 8px;
      }

      .ac-printercard-mcbmenu .ac-switch:hover {
        background-color: #86868669;
      }
    `;
    }
  };
  n([bt()], Qn.prototype, "hass", void 0), n([bt()], Qn.prototype, "language", void 0), n([bt({
    attribute: "printer-entities"
  })], Qn.prototype, "printerEntities", void 0), n([bt({
    attribute: "printer-entity-id-part"
  })], Qn.prototype, "printerEntityIdPart", void 0), n([bt()], Qn.prototype, "box_id", void 0), n([bt({
    attribute: "spools-entity-id"
  })], Qn.prototype, "spoolsEntityId", void 0), n([bt({
    attribute: "show-controls",
    type: Boolean
  })], Qn.prototype, "showControls", void 0), n([bt({
    attribute: "allow-spool-edit",
    type: Boolean
  })], Qn.prototype, "allowSpoolEdit", void 0), n([vt()], Qn.prototype, "_runoutRefillId", void 0), n([vt()], Qn.prototype, "_spoolsEntityId", void 0), n([vt()], Qn.prototype, "spoolList", void 0), n([vt()], Qn.prototype, "selectedIndex", void 0), n([vt()], Qn.prototype, "selectedMaterialType", void 0), n([vt()], Qn.prototype, "selectedColor", void 0), n([vt()], Qn.prototype, "_runoutRefillState", void 0), n([vt()], Qn.prototype, "_buttonRefill", void 0), n([vt()], Qn.prototype, "_buttonDry", void 0), n([vt()], Qn.prototype, "_changingRunout", void 0), Qn = n([Ci("anycubic-printercard-multicolorbox_view")], Qn);
  class Wn {
    constructor(t) {
      this.scale_factor = t;
    }
    val(t) {
      return this.scale_factor * t;
    }
    og(t) {
      return t / this.scale_factor;
    }
    scaleFactor() {
      return this.scale_factor;
    }
  }
  const qn = {
    top: {
      width: 340,
      height: 20
    },
    bottom: {
      width: 340,
      height: 52.3
    },
    left: {
      width: 30,
      height: 400
    },
    right: {
      width: 30,
      height: 380
    },
    buildplate: {
      maxWidth: 250,
      maxHeight: 260,
      verticalOffset: 55
    },
    xAxis: {
      stepper: !0,
      width: 400,
      offsetLeft: -30,
      height: 30,
      extruder: {
        width: 60,
        height: 100
      }
    }
  };
  class Zn {
    constructor(t, {
      target: e,
      config: i,
      callback: r,
      skipInitial: n
    }) {
      this.t = new Set(), this.o = !1, this.i = !1, this.h = t, null !== e && this.t.add(e ?? t), this.l = i, this.o = n ?? this.o, this.callback = r, window.ResizeObserver ? (this.u = new ResizeObserver(t => {
        this.handleChanges(t), this.h.requestUpdate();
      }), t.addController(this)) : console.warn("ResizeController error: browser does not support ResizeObserver.");
    }
    handleChanges(t) {
      this.value = this.callback?.(t, this.u);
    }
    hostConnected() {
      for (const t of this.t) this.observe(t);
    }
    hostDisconnected() {
      this.disconnect();
    }
    async hostUpdated() {
      !this.o && this.i && this.handleChanges([]), this.i = !1;
    }
    observe(t) {
      this.t.add(t), this.u.observe(t, this.l), this.i = !0, this.h.requestUpdate();
    }
    unobserve(t) {
      this.t.delete(t), this.u.unobserve(t);
    }
    disconnect() {
      this.u.disconnect();
    }
  }
  const Yn = {
      keyframeOptions: {
        duration: 2e3,
        direction: "alternate",
        composite: "add"
      },
      properties: ["left"]
    },
    Jn = {
      keyframeOptions: {
        duration: 100,
        composite: "add"
      },
      properties: ["top"]
    };
  let to = class extends ut {
    constructor() {
      super(...arguments), this._progressNum = 0, this.animKeyframeGantry = 0, this._isPrinting = !1, this._gantryAnimOptions = () => Object.assign(Object.assign({}, Yn), {
        onComplete: this._moveGantry,
        disabled: !(this.dimensions && this._isPrinting)
      }), this._onResizeEvent = () => {
        if (this._rootElement) {
          const t = this._rootElement.clientHeight,
            e = this._rootElement.clientWidth;
          this._setDimensions(e, t);
        }
      }, this._moveGantry = () => {
        this.animKeyframeGantry = this._isPrinting ? Number(!this.animKeyframeGantry) : 0;
      };
    }
    connectedCallback() {
      super.connectedCallback(), this.resizeObserver = new Zn(this, {
        callback: this._onResizeEvent
      }), this.dimensions && this._isPrinting && this._moveGantry();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("scaleFactor") && this._onResizeEvent(), t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) {
        const t = hi(this.hass, this.printerEntities, this.printerEntityIdPart, "job_preview");
        this.imagePreviewUrl !== t && (this.imagePreviewUrl = t, this.imagePreviewBgUrl = this.imagePreviewUrl ? `url('${t}')` : void 0), this._progressNum = Number(ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_progress", 0).state) / 100;
        const e = bi(ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_state").state.toLowerCase());
        this.dimensions && !this._isPrinting && e && this._moveGantry(), this._isPrinting = e;
      }
    }
    update(t) {
      if (super.update(t), (t.has("dimensions") || t.has("animKeyframeGantry") || t.has("hass")) && this.dimensions) {
        const e = -1 * this._progressNum * this.dimensions.BuildArea.height;
        qe(this._elAcAPr_xaxis, Object.assign(Object.assign({}, this.dimensions.XAxis), {
          top: this.dimensions.XAxis.top + e
        })), qe(this._elAcAPr_gantry, Object.assign(Object.assign({}, this.dimensions.Gantry), {
          left: 0 !== this.animKeyframeGantry ? this.dimensions.Gantry.left + this.dimensions.BuildPlate.width : this.dimensions.Gantry.left,
          top: this.dimensions.Gantry.top + e
        })), qe(this._elAcAPr_animprint, {
          height: 100 * this._progressNum + "%"
        }), t.has("dimensions") && this.dimensions && (qe(this._elAcAPr_scalable, Object.assign({}, this.dimensions.Scalable)), qe(this._elAcAPr_frame, Object.assign({}, this.dimensions.Frame)), qe(this._elAcAPr_hole, Object.assign({}, this.dimensions.Hole)), qe(this._elAcAPr_buildarea, Object.assign({}, this.dimensions.BuildArea)), qe(this._elAcAPr_buildplate, Object.assign({}, this.dimensions.BuildPlate)), qe(this._elAcAPr_nozzle, Object.assign({}, this.dimensions.Nozzle)));
      }
    }
    render() {
      const t = {
        "background-image": this.imagePreviewBgUrl
      };
      return W`
      <div class="ac-printercard-animatedprinter">
        ${this.dimensions ? W` <div class="ac-apr-scalable">
              <div class="ac-apr-frame">
                <div class="ac-apr-hole"></div>
              </div>
              <div class="ac-apr-buildarea">
                <div class="ac-apr-animprint">
                  ${this.imagePreviewBgUrl ? W`
                        <div
                          class="ac-apr-imgprev"
                          style=${An(t)}
                        ></div>
                      ` : Z}
                </div>
              </div>
              <div class="ac-apr-buildplate"></div>
              <div
                class="ac-apr-xaxis"
                ${On(Object.assign({}, Jn))}
              ></div>
              <div
                class="ac-apr-gantry"
                ${On(Object.assign({}, Jn))}
                ${On(this._gantryAnimOptions)}
              >
                <div class="ac-apr-nozzle"></div>
              </div>
            </div>` : Z}
      </div>
    `;
    }
    _setDimensions(t, e) {
      this.dimensions = function (t, e, i) {
        const r = e.height / (t.top.height + t.bottom.height + t.left.height),
          n = e.width / (t.top.width + t.left.width + t.right.width),
          o = new Wn(Math.min(r, n) * i),
          s = o.val(t.top.width),
          a = o.val(t.top.height + t.bottom.height + t.left.height),
          l = o.val(t.top.width - (t.left.width + t.right.width)),
          h = o.val(t.left.height),
          c = o.val(t.left.width),
          d = o.val(t.top.height),
          p = o.val(t.top.height - t.buildplate.verticalOffset) + h,
          u = p + o.val((t.xAxis.extruder.height - t.xAxis.height) / 2 - (t.xAxis.extruder.height + 12)),
          g = o.val(t.buildplate.maxWidth),
          A = o.val(t.buildplate.maxHeight),
          m = o.val(t.left.width + (o.og(l) - t.buildplate.maxWidth) / 2),
          b = p - o.val(t.buildplate.maxHeight),
          v = g,
          f = m,
          y = p,
          _ = o.val(t.xAxis.width),
          w = o.val(t.xAxis.height),
          x = o.val(t.xAxis.offsetLeft),
          P = _,
          E = w,
          S = o.val(t.xAxis.extruder.width),
          C = o.val(t.xAxis.extruder.height),
          F = f - S / 2,
          T = F + g,
          K = o.val(12),
          D = o.val(12),
          H = y - C - D;
        return {
          Scalable: {
            width: s,
            height: a
          },
          Frame: {
            width: s,
            height: a
          },
          Hole: {
            width: l,
            height: h,
            left: c,
            top: d
          },
          BuildArea: {
            width: g,
            height: A,
            left: m,
            top: b
          },
          BuildPlate: {
            width: v,
            left: f,
            top: y
          },
          XAxis: {
            width: _,
            height: w,
            left: x,
            top: H + .7 * C - w / 2
          },
          Track: {
            width: P,
            height: E
          },
          Basis: {
            Y: p,
            X: u
          },
          Gantry: {
            width: S,
            height: C,
            left: F,
            top: H
          },
          Nozzle: {
            width: K,
            height: D,
            left: (S - K) / 2,
            top: C
          },
          GantryMaxLeft: T
        };
      }(this.printerConfig, {
        width: t,
        height: e
      }, this.scaleFactor || 1);
    }
    static get styles() {
      return p`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }

      .ac-printercard-animatedprinter {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ac-apr-scalable {
        position: relative;
      }

      .ac-apr-frame {
        top: 0px;
        left: 0px;
        border-radius: 8px;
        background-color: #bbbbbb;
        position: absolute;
      }

      .ac-apr-hole {
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        border-radius: 8px;
      }

      .ac-apr-buildarea {
        background-color: rgba(0, 0, 0, 0.075);
        box-sizing: border-box;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        border-radius: 8px;
        overflow: hidden;
      }

      .ac-apr-buildplate {
        box-sizing: border-box;
        border-radius: 8px;
        position: absolute;
        background-color: #333333;
        height: 8px;
      }

      .ac-apr-xaxis {
        position: absolute;
        border-radius: 8px;
        background-color: #aaaaaa;
      }

      .ac-apr-animprint {
        background-color: var(--primary-text-color);
        width: 100%;
      }

      .ac-apr-imgprev {
        height: 100%;
        width: 100%;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position-y: 100%;
      }

      .ac-apr-gantry {
        background-color: #333333;
        border-radius: 4px;
        box-sizing: border-box;
        position: absolute;
      }

      .ac-apr-nozzle {
        background-color: #aaaaaa;
        position: absolute;
        width: 12px;
        height: 12px;
        clip-path: polygon(100% 0, 100% 50%, 50% 75%, 0 50%, 0 0);
      }
    `;
    }
  };
  n([yt(".ac-printercard-animatedprinter")], to.prototype, "_rootElement", void 0), n([yt(".ac-apr-scalable")], to.prototype, "_elAcAPr_scalable", void 0), n([yt(".ac-apr-frame")], to.prototype, "_elAcAPr_frame", void 0), n([yt(".ac-apr-hole")], to.prototype, "_elAcAPr_hole", void 0), n([yt(".ac-apr-buildarea")], to.prototype, "_elAcAPr_buildarea", void 0), n([yt(".ac-apr-animprint")], to.prototype, "_elAcAPr_animprint", void 0), n([yt(".ac-apr-buildplate")], to.prototype, "_elAcAPr_buildplate", void 0), n([yt(".ac-apr-xaxis")], to.prototype, "_elAcAPr_xaxis", void 0), n([yt(".ac-apr-gantry")], to.prototype, "_elAcAPr_gantry", void 0), n([yt(".ac-apr-nozzle")], to.prototype, "_elAcAPr_nozzle", void 0), n([bt()], to.prototype, "hass", void 0), n([bt({
    attribute: "scale-factor"
  })], to.prototype, "scaleFactor", void 0), n([bt({
    attribute: "printer-config"
  })], to.prototype, "printerConfig", void 0), n([bt({
    attribute: "printer-entities"
  })], to.prototype, "printerEntities", void 0), n([bt({
    attribute: "printer-entity-id-part"
  })], to.prototype, "printerEntityIdPart", void 0), n([vt()], to.prototype, "dimensions", void 0), n([vt()], to.prototype, "resizeObserver", void 0), n([vt()], to.prototype, "_progressNum", void 0), n([vt()], to.prototype, "animKeyframeGantry", void 0), n([vt()], to.prototype, "_isPrinting", void 0), n([vt()], to.prototype, "imagePreviewUrl", void 0), n([vt()], to.prototype, "imagePreviewBgUrl", void 0), to = n([Ci("anycubic-printercard-animated_printer")], to);
  let eo = class extends ut {
    constructor() {
      super(...arguments), this._viewClick = () => {
        this.toggleVideo && this.toggleVideo();
      };
    }
    render() {
      return W`
      <div class="ac-printercard-printerview" @click=${this._viewClick}>
        <anycubic-printercard-animated_printer
          .hass=${this.hass}
          .scaleFactor=${this.scaleFactor}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
          .printerConfig=${qn}
        ></anycubic-printercard-animated_printer>
      </div>
    `;
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-printerview {
        height: 100%;
        box-sizing: border-box;
      }
    `;
    }
  };
  n([bt()], eo.prototype, "hass", void 0), n([bt({
    attribute: "toggle-video",
    type: Function
  })], eo.prototype, "toggleVideo", void 0), n([bt({
    attribute: "printer-entities"
  })], eo.prototype, "printerEntities", void 0), n([bt({
    attribute: "printer-entity-id-part"
  })], eo.prototype, "printerEntityIdPart", void 0), n([bt({
    attribute: "scale-factor"
  })], eo.prototype, "scaleFactor", void 0), eo = n([Ci("anycubic-printercard-printer_view")], eo);
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const io = (t, e, i) => {
      const r = new Map();
      for (let n = e; n <= i; n++) r.set(t[n], n);
      return r;
    },
    ro = cn(class extends dn {
      constructor(t) {
        if (super(t), t.type !== hn) throw Error("repeat() can only be used in text expressions");
      }
      dt(t, e, i) {
        let r;
        void 0 === i ? i = e : void 0 !== e && (r = e);
        const n = [],
          o = [];
        let s = 0;
        for (const e of t) n[s] = r ? r(e, s) : s, o[s] = i(e, s), s++;
        return {
          values: o,
          keys: n
        };
      }
      render(t, e, i) {
        return this.dt(t, e, i).values;
      }
      update(t, [e, i, r]) {
        const n = (t => t._$AH)(t),
          {
            values: o,
            keys: s
          } = this.dt(e, i, r);
        if (!Array.isArray(n)) return this.ut = s, o;
        const a = this.ut ??= [],
          l = [];
        let h,
          c,
          d = 0,
          p = n.length - 1,
          u = 0,
          g = o.length - 1;
        for (; d <= p && u <= g;) if (null === n[d]) d++;else if (null === n[p]) p--;else if (a[d] === s[u]) l[u] = fn(n[d], o[u]), d++, u++;else if (a[p] === s[g]) l[g] = fn(n[p], o[g]), p--, g--;else if (a[d] === s[g]) l[g] = fn(n[d], o[g]), vn(t, l[g + 1], n[d]), d++, g--;else if (a[p] === s[u]) l[u] = fn(n[p], o[u]), vn(t, n[d], n[p]), p--, u++;else if (void 0 === h && (h = io(s, u, g), c = io(a, d, p)), h.has(a[d])) {
          if (h.has(a[p])) {
            const e = c.get(s[u]),
              i = void 0 !== e ? n[e] : null;
            if (null === i) {
              const e = vn(t, n[d]);
              fn(e, o[u]), l[u] = e;
            } else l[u] = fn(i, o[u]), vn(t, n[d], i), n[e] = null;
            u++;
          } else _n(n[p]), p--;
        } else _n(n[d]), d++;
        for (; u <= g;) {
          const e = vn(t, l[g + 1]);
          fn(e, o[u]), l[u++] = e;
        }
        for (; d <= p;) {
          const t = n[d++];
          null !== t && _n(t);
        }
        return this.ut = s, ((t, e = yn) => {
          t._$AH = e;
        })(t, l), q;
      }
    });
  let no = class extends ut {
    render() {
      const t = {
        width: String(this.progress) + "%"
      };
      return W`
      <div class="ac-stat-line">
        <p class="ac-stat-heading">${this.name}</p>
        <div class="ac-stat-value">
          <div class="ac-progress-bar">
            <div class="ac-stat-text">${this.value}</div>
            <div
              class="ac-progress-line"
              style=${An(t)}
            ></div>
          </div>
        </div>
      </div>
    `;
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stat-line {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 2px 0;
      }

      .ac-stat-value {
        margin: 0;
        display: inline-block;
        max-width: calc(100% - 120px);
        width: 100%;
        position: relative;
      }

      .ac-stat-text {
        margin: 0;
        font-size: 16px;
        display: block;
        position: relative;
        top: 3px;
        left: 0px;
        z-index: 1;
        text-align: center;
      }

      .ac-stat-heading {
        margin: 0;
        font-size: 16px;
        display: block;
        font-weight: bold;
      }

      .ac-progress-bar {
        display: block;
        width: 100%;
        height: 30px;
        background-color: #8b8b8b6e;
        position: relative;
      }

      .ac-progress-line {
        position: absolute;
        top: 0px;
        left: 0px;
        display: block;
        height: 100%;
        background-color: #ee8f36e6;
        border-right: 2px solid #ffd151e6;
        box-shadow: 4px 0px 6px 0px rgb(255 245 126 / 25%);
      }
    `;
    }
  };
  n([bt({
    type: String
  })], no.prototype, "name", void 0), n([bt({
    type: Number
  })], no.prototype, "value", void 0), n([bt({
    type: Number
  })], no.prototype, "progress", void 0), no = n([Ci("anycubic-printercard-progress-line")], no);
  let oo = class extends ut {
    constructor() {
      super(...arguments), this.unit = "";
    }
    render() {
      return W`
      <div class="ac-stat-line">
        <p class="ac-stat-text ac-stat-heading">${this.name}</p>
        <p class="ac-stat-text">${this.value}${this.unit}</p>
      </div>
    `;
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stat-line {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 2px 0;
      }

      .ac-stat-text {
        margin: 0;
        font-size: 16px;
        display: inline-block;
        max-width: calc(100% - 120px);
        text-align: right;
        word-wrap: break-word;
      }

      .ac-stat-heading {
        font-weight: bold;
        max-width: unset;
        overflow: unset;
      }
    `;
    }
  };
  n([bt({
    type: String
  })], oo.prototype, "name", void 0), n([bt({
    type: String
  })], oo.prototype, "value", void 0), n([bt({
    type: String
  })], oo.prototype, "unit", void 0), oo = n([Ci("anycubic-printercard-stat-line")], oo);
  let so = class extends ut {
    render() {
      return W`<anycubic-printercard-stat-line
      .name=${this.name}
      .value=${wi(this.temperatureEntity, this.temperatureUnit, this.round)}
    ></anycubic-printercard-stat-line>`;
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
    }
  };
  n([bt({
    type: String
  })], so.prototype, "name", void 0), n([bt({
    attribute: "temperature-entity"
  })], so.prototype, "temperatureEntity", void 0), n([bt({
    type: Boolean
  })], so.prototype, "round", void 0), n([bt({
    attribute: "temperature-unit",
    type: String
  })], so.prototype, "temperatureUnit", void 0), so = n([Ci("anycubic-printercard-stat-temperature")], so);
  let ao = class extends ut {
    constructor() {
      super(...arguments), this.running = !0, this.currentTime = 0, this.lastIntervalId = -1;
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("timeEntity") && (-1 !== this.lastIntervalId && clearInterval(this.lastIntervalId), this.currentTime = function (t, e = !1) {
        let i;
        if (t.state) {
          if (t.state.includes(", ")) {
            const [e, r] = t.state.split(", "),
              [n, o, s] = r.split(":"),
              a = e.match(/\d+/);
            i = 60 * +(a ? a[0] : 0) * 60 * 24 + 60 * +n * 60 + 60 * +o + +s;
          } else if (t.state.includes(":")) {
            const [e, r, n] = t.state.split(":");
            i = 60 * +e * 60 + 60 * +r + +n;
          } else i = e ? +t.state : 60 * +t.state;
        } else i = 0;
        return i;
      }(this.timeEntity), this._updateInterval());
    }
    connectedCallback() {
      super.connectedCallback(), this._updateInterval();
    }
    updated(t) {
      super.updated(t), t.has("running") && this._updateInterval();
    }
    _updateInterval() {
      this.running ? -1 === this.lastIntervalId && (this.lastIntervalId = setInterval(() => {
        this._incTime();
      }, 1e3)) : -1 !== this.lastIntervalId && (clearInterval(this.lastIntervalId), this.lastIntervalId = -1);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), -1 !== this.lastIntervalId && (clearInterval(this.lastIntervalId), this.lastIntervalId = -1);
    }
    render() {
      return W`<anycubic-printercard-stat-line
      .name=${this.name}
      .value=${yi(this.currentTime, this.timeType, this.round, this.use_24hr)}
    ></anycubic-printercard-stat-line>`;
    }
    _incTime() {
      (0 === this.currentTime || this.currentTime && !isNaN(this.currentTime)) && (this.currentTime = Number(this.currentTime) + this.direction);
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
    }
  };
  n([bt({
    attribute: "time-entity"
  })], ao.prototype, "timeEntity", void 0), n([bt({
    attribute: "time-type"
  })], ao.prototype, "timeType", void 0), n([bt({
    type: String
  })], ao.prototype, "name", void 0), n([bt({
    type: Number
  })], ao.prototype, "direction", void 0), n([bt({
    type: Boolean
  })], ao.prototype, "round", void 0), n([bt({
    type: Boolean
  })], ao.prototype, "use_24hr", void 0), n([bt({
    attribute: "is-seconds",
    type: Boolean
  })], ao.prototype, "isSeconds", void 0), n([bt({
    type: Boolean
  })], ao.prototype, "running", void 0), n([vt()], ao.prototype, "currentTime", void 0), n([vt()], ao.prototype, "lastIntervalId", void 0), ao = n([Ci("anycubic-printercard-stat-time")], ao);
  let lo = class extends ut {
    constructor() {
      super(...arguments), this.round = !0, this.temperatureUnit = Ne.C, this.progressPercent = 0, this._valDryProgress = 0, this._timersRunning = !1;
    }
    willUpdate(t) {
      var e;
      if (super.willUpdate(t), t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) {
        this._entETA = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_time_remaining"), this._entElapsed = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_time_elapsed"), this._entRemaining = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_time_remaining"), this._entBedCurrent = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "hotbed_temperature"), this._entHotendCurrent = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "nozzle_temperature"), this._entBedTarget = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "target_hotbed_temperature"), this._entHotendTarget = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "target_nozzle_temperature");
        const t = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_state");
        this._valStatus = Ye(t.state), this._timersRunning = bi(t.state.toLowerCase()), this._valOnline = pi(this.hass, this.printerEntities, this.printerEntityIdPart, "printer_online", "Online", "Offline", "unknown"), this._valAvailability = Ye(ci(this.hass, this.printerEntities, this.printerEntityIdPart, "current_status").state), this._valJobName = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_name").state, this._valCurrentLayer = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_current_layer").state;
        const i = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_speed_mode", "", {
            available_modes: [],
            print_speed_mode_code: -1
          }),
          r = Ei(i),
          n = null !== (e = i.attributes.print_speed_mode_code) && void 0 !== e ? e : 0;
        this._valSpeedMode = n >= 0 && n in r ? r[n] : "Unknown", this._valFanSpeed = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "fan_speed", 0).state, this._valDryStatus = pi(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_active", "Drying", "Not Drying", "unknown");
        const o = Number(ci(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_total_duration", 0).state),
          s = Number(ci(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_remaining_time", 0).state);
        this._valDryRemain = isNaN(s) ? "" : `${s} Mins`, this._valDryProgress = !isNaN(o) && o > 0 ? s / o * 100 : 0, this._valOnTime = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_on_time", 0).state, this._valOffTime = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_off_time", 0).state, this._valBottomTime = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_bottom_time", 0).state, this._valModelHeight = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_model_height", 0).state, this._valBottomLayers = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_bottom_layers", 0).state, this._valZUpHeight = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_z_up_height", 0).state, this._valZUpSpeed = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_z_up_speed", 0).state, this._valZDownSpeed = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_z_down_speed", 0).state;
      }
      (t.has("language") || t.has("monitoredStats")) && (this._statTranslations = this.monitoredStats.reduce((t, e) => (t[e] = an(`card.monitored_stats.${e}`, this.language), t), {}));
    }
    render() {
      return W`
      <div class="ac-stats-box ac-stats-section">
        ${this.showPercent ? W`
              <div class="ac-stats-box ac-stats-part-percent">
                <p class="ac-stats-part-percent-text">
                  ${this.round ? Math.round(this.progressPercent) : this.progressPercent}%
                </p>
              </div>
            ` : null}
        <div class="ac-stats-box ac-stats-section">${this._renderStats()}</div>
      </div>
    `;
    }
    _renderStats() {
      return ro(this.monitoredStats, t => t, (t, e) => {
        switch (t) {
          case je.Status:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valStatus}
              ></anycubic-printercard-stat-line>
            `;
          case je.ETA:
            return this._timersRunning ? W`
              <anycubic-printercard-stat-time
                .timeEntity=${this._entETA}
                .timeType=${t}
                .name=${this._statTranslations[t]}
                .direction=${0}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
                .running=${this._timersRunning}
              ></anycubic-printercard-stat-time>
            ` : W`
                <anycubic-printercard-stat-line
                  .name=${this._statTranslations[t]}
                  .value=${"-"}
                ></anycubic-printercard-stat-line>
              `;
          case je.Elapsed:
            return W`
              <anycubic-printercard-stat-time
                .timeEntity=${this._entElapsed}
                .timeType=${t}
                .name=${this._statTranslations[t]}
                .direction=${1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
                .running=${this._timersRunning}
              ></anycubic-printercard-stat-time>
            `;
          case je.Remaining:
            return W`
              <anycubic-printercard-stat-time
                .timeEntity=${this._entRemaining}
                .timeType=${t}
                .name=${this._statTranslations[t]}
                .direction=${-1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
                .running=${this._timersRunning}
              ></anycubic-printercard-stat-time>
            `;
          case je.BedCurrent:
            return W`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[t]}
                .temperatureEntity=${this._entBedCurrent}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case je.HotendCurrent:
            return W`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[t]}
                .temperatureEntity=${this._entHotendCurrent}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case je.BedTarget:
            return W`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[t]}
                .temperatureEntity=${this._entBedTarget}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case je.HotendTarget:
            return W`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[t]}
                .temperatureEntity=${this._entHotendTarget}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case je.PrinterOnline:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valOnline}
              ></anycubic-printercard-stat-line>
            `;
          case je.Availability:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valAvailability}
              ></anycubic-printercard-stat-line>
            `;
          case je.ProjectName:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valJobName}
              ></anycubic-printercard-stat-line>
            `;
          case je.CurrentLayer:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valCurrentLayer}
              ></anycubic-printercard-stat-line>
            `;
          case je.SpeedMode:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valSpeedMode}
              ></anycubic-printercard-stat-line>
            `;
          case je.FanSpeed:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valFanSpeed}
                .unit=${"%"}
              ></anycubic-printercard-stat-line>
            `;
          case je.DryingStatus:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valDryStatus}
              ></anycubic-printercard-stat-line>
            `;
          case je.DryingTime:
            return W`
              <anycubic-printercard-progress-line
                .name=${this._statTranslations[t]}
                .value=${this._valDryRemain}
                .progress=${this._valDryProgress}
              ></anycubic-printercard-progress-line>
            `;
          case je.OnTime:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valOnTime}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;
          case je.OffTime:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valOffTime}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;
          case je.BottomTime:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valBottomTime}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;
          case je.ModelHeight:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valModelHeight}
                .unit=${"mm"}
              ></anycubic-printercard-stat-line>
            `;
          case je.BottomLayers:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valBottomLayers}
                .unit=${"layers"}
              ></anycubic-printercard-stat-line>
            `;
          case je.ZUpHeight:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valZUpHeight}
                .unit=${"mm"}
              ></anycubic-printercard-stat-line>
            `;
          case je.ZUpSpeed:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valZUpSpeed}
              ></anycubic-printercard-stat-line>
            `;
          case je.ZDownSpeed:
            return W`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valZDownSpeed}
              ></anycubic-printercard-stat-line>
            `;
          default:
            return W`
              <anycubic-printercard-stat-line
                .name=${"Unknown"}
                .value=${"<unknown>"}
              ></anycubic-printercard-stat-line>
            `;
        }
      });
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stats-box {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }

      .ac-stats-section {
        flex-direction: column;
        justify-content: center;
      }

      .ac-stats-part-percent {
        justify-content: center;
        margin-bottom: 20px;
      }
      .ac-stats-part-percent-text {
        margin: 0px;
        font-size: 42px;
        font-weight: bold;
        height: 44px;
        line-height: 44px;
      }
    `;
    }
  };
  n([bt()], lo.prototype, "hass", void 0), n([bt()], lo.prototype, "language", void 0), n([bt({
    attribute: "monitored-stats"
  })], lo.prototype, "monitoredStats", void 0), n([bt({
    attribute: "show-percent",
    type: Boolean
  })], lo.prototype, "showPercent", void 0), n([bt({
    type: Boolean
  })], lo.prototype, "round", void 0), n([bt({
    type: Boolean
  })], lo.prototype, "use_24hr", void 0), n([bt({
    attribute: "temperature-unit",
    type: String
  })], lo.prototype, "temperatureUnit", void 0), n([bt({
    attribute: "printer-entities"
  })], lo.prototype, "printerEntities", void 0), n([bt({
    attribute: "printer-entity-id-part"
  })], lo.prototype, "printerEntityIdPart", void 0), n([bt({
    attribute: "progress-percent"
  })], lo.prototype, "progressPercent", void 0), n([vt()], lo.prototype, "_statTranslations", void 0), n([vt()], lo.prototype, "_entETA", void 0), n([vt()], lo.prototype, "_entElapsed", void 0), n([vt()], lo.prototype, "_entRemaining", void 0), n([vt()], lo.prototype, "_entBedCurrent", void 0), n([vt()], lo.prototype, "_entHotendCurrent", void 0), n([vt()], lo.prototype, "_entBedTarget", void 0), n([vt()], lo.prototype, "_entHotendTarget", void 0), n([vt()], lo.prototype, "_valStatus", void 0), n([vt()], lo.prototype, "_valOnline", void 0), n([vt()], lo.prototype, "_valAvailability", void 0), n([vt()], lo.prototype, "_valJobName", void 0), n([vt()], lo.prototype, "_valCurrentLayer", void 0), n([vt()], lo.prototype, "_valSpeedMode", void 0), n([vt()], lo.prototype, "_valFanSpeed", void 0), n([vt()], lo.prototype, "_valDryStatus", void 0), n([vt()], lo.prototype, "_valDryRemain", void 0), n([vt()], lo.prototype, "_valDryProgress", void 0), n([vt()], lo.prototype, "_valOnTime", void 0), n([vt()], lo.prototype, "_valOffTime", void 0), n([vt()], lo.prototype, "_valBottomTime", void 0), n([vt()], lo.prototype, "_valModelHeight", void 0), n([vt()], lo.prototype, "_valBottomLayers", void 0), n([vt()], lo.prototype, "_valZUpHeight", void 0), n([vt()], lo.prototype, "_valZUpSpeed", void 0), n([vt()], lo.prototype, "_valZDownSpeed", void 0), n([vt()], lo.prototype, "_timersRunning", void 0), lo = n([Ci("anycubic-printercard-stats-component")], lo);
  const ho = p`
  :host {
    display: none;
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(3px);
  }

  .ac-modal-container {
    border-radius: 16px;
    background-color: var(--primary-background-color);
    margin: auto;
    padding: 50px;
    width: 80%;
    min-height: 150px;
    max-width: 600px;
    margin-top: 50px;
    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.3);
  }

  .ac-modal-card {
    padding: 20px;
  }
  .ac-modal-close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .ac-modal-close:hover,
  .ac-modal-close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  .ac-modal-label {
  }

  @media (max-width: 599px) {
    .ac-modal-container {
      width: 95%;
      padding: 6px;
    }
  }
`;
  let co = class extends ut {
    constructor() {
      super(...arguments), this._isActive = !1, this._setActive = () => {
        this._isActive = !0;
      }, this._setInactive = () => {
        this._isActive = !1;
      };
    }
    render() {
      const t = {
        filter: this._isActive ? "brightness(80%)" : "brightness(100%)"
      };
      return W`
      <button
        class="ac-ui-seld-select"
        style=${An(t)}
        @mouseenter=${this._setActive}
        @mousedown=${this._setActive}
        @mouseup=${this._setInactive}
        @mouseleave=${this._setInactive}
      >
        ${this.item}
      </button>
    `;
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-ui-seld-select {
        width: 100%;
        border: none;
        outline: none;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        padding: 0 16px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        line-height: 48px;
        text-align: left;
        cursor: pointer;
        color: var(--primary-text-color);
      }
    `;
    }
  };
  n([bt()], co.prototype, "item", void 0), n([vt()], co.prototype, "_isActive", void 0), co = n([Ci("anycubic-ui-select-dropdown-item")], co);
  let po = class extends ut {
    constructor() {
      super(...arguments), this._active = !1, this._hidden = !1, this._showOptions = () => {
        this._hidden = !1;
      }, this._hideOptions = () => {
        this._hidden = !0;
      }, this._setActive = () => {
        this._active = !0;
      }, this._setInactive = () => {
        this._active = !1;
      }, this._selectItem = t => {
        if (!this.availableOptions) return;
        const e = t.currentTarget.item_key;
        this._selectedItem = this.availableOptions[e], Ie(this, "ac-select-dropdown", {
          key: e,
          value: this.availableOptions[e]
        }), this._hidden = !0;
      };
    }
    async firstUpdated() {
      this._selectedItem = this.initialItem, this._hidden = !0, this._active = !1, this.requestUpdate();
    }
    render() {
      const t = {
          backgroundColor: this._active ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)"
        },
        e = {
          opacity: this._hidden ? 0 : 1,
          transform: this._hidden ? "scaleY(0.0)" : "scaleY(1.0)"
        };
      return this.availableOptions ? W`
          <button
            class="ac-ui-select-button"
            style=${An(t)}
            @click=${this._showOptions}
            @mouseenter=${this._setActive}
            @mouseleave=${this._setInactive}
          >
            ${this._selectedItem ? this._selectedItem : this.placeholder}
            <ha-svg-icon .path=${"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"}></ha-svg-icon>
          </button>
          <div class="ac-ui-select-options" style=${An(e)}>
            ${this._renderOptions()}
          </div>
        ` : Z;
    }
    _renderOptions() {
      return zn(Object.keys(this.availableOptions), (t, e) => W`
          <anycubic-ui-select-dropdown-item
            .item=${this.availableOptions[t]}
            .item_key=${t}
            @click=${this._selectItem}
          ></anycubic-ui-select-dropdown-item>
        `);
    }
    static get styles() {
      return p`
      :host {
        box-sizing: border-box;
        width: 100%;
        position: relative;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        border-radius: 8px;
      }

      .ac-ui-select-button {
        width: 100%;
        border: none;
        outline: none;
        padding: 0 16px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        line-height: 48px;
        border-radius: 8px;
        text-align: left;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: rgba(0, 0, 0, 0.05);
        align-items: center;
        color: var(--primary-text-color);
      }

      .ac-ui-select-options {
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        overflow: hidden;
        box-shadow:
          0px 10px 20px rgba(0, 0, 0, 0.19),
          0px 6px 6px rgba(0, 0, 0, 0.23);
        z-index: 11;
        opacity: 0;
        transform: scaleY(0);
        transform-origin: top center;
      }
    `;
    }
  };
  n([bt({
    attribute: "available-options"
  })], po.prototype, "availableOptions", void 0), n([bt()], po.prototype, "placeholder", void 0), n([bt({
    attribute: "initial-item"
  })], po.prototype, "initialItem", void 0), n([vt()], po.prototype, "_selectedItem", void 0), n([vt()], po.prototype, "_active", void 0), n([vt()], po.prototype, "_hidden", void 0), po = n([Ci("anycubic-ui-select-dropdown")], po);
  const uo = {
      keyframeOptions: {
        duration: 250,
        direction: "alternate",
        easing: "ease-in-out"
      },
      properties: ["height", "opacity", "scale"]
    },
    go = "drying_preset_1",
    Ao = "drying_preset_2",
    mo = "drying_preset_3",
    bo = "drying_preset_4",
    vo = "drying_stop",
    fo = "secondary_",
    yo = fo + go,
    _o = fo + Ao,
    wo = fo + mo,
    xo = fo + bo,
    Po = fo + vo;
  let Eo = class extends ut {
    constructor() {
      super(...arguments), this.box_id = 0, this._dryingPresetId1 = go, this._dryingPresetId2 = Ao, this._dryingPresetId3 = mo, this._dryingPresetId4 = bo, this._dryingStopId = vo, this._hasDryingPreset1 = !1, this._hasDryingPreset2 = !1, this._hasDryingPreset3 = !1, this._hasDryingPreset4 = !1, this._hasDryingStop = !1, this._dryingPresetTemp1 = "", this._dryingPresetDur1 = "", this._dryingPresetTemp2 = "", this._dryingPresetDur2 = "", this._dryingPresetTemp3 = "", this._dryingPresetDur3 = "", this._dryingPresetTemp4 = "", this._dryingPresetDur4 = "", this._isOpen = !1, this._handleDryingPreset1 = () => {
        this._pressHassButton(this._dryingPresetId1), this._closeModal();
      }, this._handleDryingPreset2 = () => {
        this._pressHassButton(this._dryingPresetId2), this._closeModal();
      }, this._handleDryingPreset3 = () => {
        this._pressHassButton(this._dryingPresetId3), this._closeModal();
      }, this._handleDryingPreset4 = () => {
        this._pressHassButton(this._dryingPresetId4), this._closeModal();
      }, this._handleDryingStop = () => {
        this._pressHassButton(this._dryingStopId), this._closeModal();
      }, this._handleModalEvent = t => {
        const e = t;
        e.stopPropagation(), e.detail.modalOpen && (this._isOpen = !0, this.box_id = Number(e.detail.box_id));
      }, this._closeModal = t => {
        t && t.stopPropagation(), this._isOpen = !1, this.box_id = 0;
      }, this._cardClick = t => {
        t.stopPropagation();
      };
    }
    async firstUpdated() {
      this.addEventListener("click", t => {
        this._closeModal(t);
      });
    }
    connectedCallback() {
      var t;
      super.connectedCallback(), null === (t = this.parentElement) || void 0 === t || t.addEventListener("ac-mcbdry-modal", this._handleModalEvent);
    }
    disconnectedCallback() {
      var t;
      null === (t = this.parentElement) || void 0 === t || t.removeEventListener("ac-mcbdry-modal", this._handleModalEvent), super.disconnectedCallback();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("language") && (this._heading = an("card.drying_settings.heading", this.language), this._buttonTextPreset = an("card.drying_settings.button_preset", this.language), this._buttonTextMinutes = an("card.drying_settings.button_minutes", this.language), this._buttonStopDrying = an("card.drying_settings.button_stop_drying", this.language)), t.has("box_id") && (1 === this.box_id ? (this._dryingPresetId1 = yo, this._dryingPresetId2 = _o, this._dryingPresetId3 = wo, this._dryingPresetId4 = xo, this._dryingStopId = Po) : (this._dryingPresetId1 = go, this._dryingPresetId2 = Ao, this._dryingPresetId3 = mo, this._dryingPresetId4 = bo, this._dryingStopId = vo)), t.has("hass") || t.has("selectedPrinterDevice")) {
        const t = ai(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingPresetId1);
        this._hasDryingPreset1 = li(t), this._dryingPresetTemp1 = String(t.attributes.temperature), this._dryingPresetDur1 = String(t.attributes.duration);
        const e = ai(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingPresetId2);
        this._hasDryingPreset2 = li(e), this._dryingPresetTemp2 = String(e.attributes.temperature), this._dryingPresetDur2 = String(e.attributes.duration);
        const i = ai(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingPresetId3);
        this._hasDryingPreset3 = li(i), this._dryingPresetTemp3 = String(i.attributes.temperature), this._dryingPresetDur3 = String(i.attributes.duration);
        const r = ai(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingPresetId4);
        this._hasDryingPreset4 = li(r), this._dryingPresetTemp4 = String(r.attributes.temperature), this._dryingPresetDur4 = String(r.attributes.duration);
        const n = ai(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingStopId);
        this._hasDryingStop = li(n);
      }
    }
    update(t) {
      super.update(t), this._isOpen ? this.style.display = "block" : this.style.display = "none";
    }
    render() {
      return W`
      <div
        class="ac-modal-container"
        style=${An({
        height: "auto",
        opacity: 1,
        scale: 1
      })}
        ${On(Object.assign({}, uo))}
      >
        <span class="ac-modal-close" @click=${this._closeModal}>&times;</span>
        <div class="ac-modal-card" @click=${this._cardClick}>
          ${this._renderCard()}
        </div>
      </div>
    `;
    }
    _renderCard() {
      return W`
      <div>
        <div class="ac-drying-header">${this._heading}</div>
        <div class="ac-drying-buttonscont">
          ${this._hasDryingPreset1 ? W`
                <div class="ac-drying-buttoncont">
                  <ha-control-button @click=${this._handleDryingPreset1}>
                    ${this._buttonTextPreset} 1<br />
                    ${this._dryingPresetDur1} ${this._buttonTextMinutes} @
                    ${this._dryingPresetTemp1}°C
                  </ha-control-button>
                </div>
              ` : Z}
          ${this._hasDryingPreset2 ? W`
                <div class="ac-drying-buttoncont">
                  <ha-control-button @click=${this._handleDryingPreset2}>
                    ${this._buttonTextPreset} 2<br />
                    ${this._dryingPresetDur2} ${this._buttonTextMinutes} @
                    ${this._dryingPresetTemp2}°C
                  </ha-control-button>
                </div>
              ` : Z}
          ${this._hasDryingPreset3 ? W`
                <div class="ac-drying-buttoncont">
                  <ha-control-button @click=${this._handleDryingPreset3}>
                    ${this._buttonTextPreset} 3<br />
                    ${this._dryingPresetDur3} ${this._buttonTextMinutes} @
                    ${this._dryingPresetTemp3}°C
                  </ha-control-button>
                </div>
              ` : Z}
          ${this._hasDryingPreset4 ? W`
                <div class="ac-drying-buttoncont">
                  <ha-control-button @click=${this._handleDryingPreset4}>
                    ${this._buttonTextPreset} 4<br />
                    ${this._dryingPresetDur4} ${this._buttonTextMinutes} @
                    ${this._dryingPresetTemp4}°C
                  </ha-control-button>
                </div>
              ` : Z}
          ${this._hasDryingStop ? W`
                <div class="ac-flex-break"></div>
                <div class="ac-drying-buttoncont">
                  <ha-control-button @click=${this._handleDryingStop}>
                    ${this._buttonStopDrying}
                  </ha-control-button>
                </div>
              ` : Z}
        </div>
      </div>
    `;
    }
    _pressHassButton(t) {
      this.printerEntityIdPart && this.hass.callService("button", "press", {
        entity_id: ni(this.printerEntityIdPart, "button", t)
      }).then().catch(t => {});
    }
    static get styles() {
      return p`
      ${ho}

      .ac-drying-header {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
      }

      ha-control-button {
        min-width: 150px;
        font-size: 14px;
        min-height: 55px;
        width: 100%;
        box-sizing: border-box;
      }

      .ac-flex-break {
        flex-basis: 100%;
        height: 0;
      }

      .ac-drying-buttonscont {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
        align-items: center;
        justify-content: center;
      }

      .ac-drying-buttoncont {
        width: 50%;
        margin: 0;
        position: relative;
        box-sizing: border-box;
        padding: 10px;
      }
    `;
    }
  };
  n([bt()], Eo.prototype, "hass", void 0), n([bt()], Eo.prototype, "language", void 0), n([bt({
    attribute: "selected-printer-device"
  })], Eo.prototype, "selectedPrinterDevice", void 0), n([bt({
    attribute: "printer-entities"
  })], Eo.prototype, "printerEntities", void 0), n([bt({
    attribute: "printer-entity-id-part"
  })], Eo.prototype, "printerEntityIdPart", void 0), n([vt()], Eo.prototype, "box_id", void 0), n([vt()], Eo.prototype, "_dryingPresetId1", void 0), n([vt()], Eo.prototype, "_dryingPresetId2", void 0), n([vt()], Eo.prototype, "_dryingPresetId3", void 0), n([vt()], Eo.prototype, "_dryingPresetId4", void 0), n([vt()], Eo.prototype, "_dryingStopId", void 0), n([vt()], Eo.prototype, "_hasDryingPreset1", void 0), n([vt()], Eo.prototype, "_hasDryingPreset2", void 0), n([vt()], Eo.prototype, "_hasDryingPreset3", void 0), n([vt()], Eo.prototype, "_hasDryingPreset4", void 0), n([vt()], Eo.prototype, "_hasDryingStop", void 0), n([vt()], Eo.prototype, "_dryingPresetTemp1", void 0), n([vt()], Eo.prototype, "_dryingPresetDur1", void 0), n([vt()], Eo.prototype, "_dryingPresetTemp2", void 0), n([vt()], Eo.prototype, "_dryingPresetDur2", void 0), n([vt()], Eo.prototype, "_dryingPresetTemp3", void 0), n([vt()], Eo.prototype, "_dryingPresetDur3", void 0), n([vt()], Eo.prototype, "_dryingPresetTemp4", void 0), n([vt()], Eo.prototype, "_dryingPresetDur4", void 0), n([vt()], Eo.prototype, "_isOpen", void 0), n([vt()], Eo.prototype, "_heading", void 0), n([vt()], Eo.prototype, "_buttonTextPreset", void 0), n([vt()], Eo.prototype, "_buttonTextMinutes", void 0), n([vt()], Eo.prototype, "_buttonStopDrying", void 0), Eo = n([Ci("anycubic-printercard-multicolorbox_modal_drying")], Eo);
  const So = t => To(255, Math.round(Number(t))),
    Co = t => So(255 * t),
    Fo = t => To(1, t / 255),
    To = (t, e) => Math.max(0, Math.min(t, e)),
    Ko = t => void 0 === t ? 1 : ("string" == typeof t && t.indexOf("%") > 0 && (t = Number(t.split("%")[0]) / 100), t = Number(Number(t).toFixed(3)), isNaN(t) ? 1 : To(1, t)),
    Do = {
      aliceblue: "#F0F8FF",
      antiquewhite: "#FAEBD7",
      aqua: "#00FFFF",
      aquamarine: "#7FFFD4",
      azure: "#F0FFFF",
      beige: "#F5F5DC",
      bisque: "#FFE4C4",
      black: "#000000",
      blanchedalmond: "#FFEBCD",
      blue: "#0000FF",
      blueviolet: "#8A2BE2",
      brown: "#A52A2A",
      burlywood: "#DEB887",
      cadetblue: "#5F9EA0",
      chartreuse: "#7FFF00",
      chocolate: "#D2691E",
      coral: "#FF7F50",
      cornflowerblue: "#6495ED",
      cornsilk: "#FFF8DC",
      crimson: "#DC143C",
      cyan: "#00FFFF",
      darkblue: "#00008B",
      darkcyan: "#008B8B",
      darkgoldenrod: "#B8860B",
      darkgray: "#A9A9A9",
      darkgrey: "#A9A9A9",
      darkgreen: "#006400",
      darkkhaki: "#BDB76B",
      darkmagenta: "#8B008B",
      darkolivegreen: "#556B2F",
      darkorange: "#FF8C00",
      darkorchid: "#9932CC",
      darkred: "#8B0000",
      darksalmon: "#E9967A",
      darkseagreen: "#8FBC8F",
      darkslateblue: "#483D8B",
      darkslategray: "#2F4F4F",
      darkslategrey: "#2F4F4F",
      darkturquoise: "#00CED1",
      darkviolet: "#9400D3",
      deeppink: "#FF1493",
      deepskyblue: "#00BFFF",
      dimgray: "#696969",
      dimgrey: "#696969",
      dodgerblue: "#1E90FF",
      firebrick: "#B22222",
      floralwhite: "#FFFAF0",
      forestgreen: "#228B22",
      fuchsia: "#FF00FF",
      gainsboro: "#DCDCDC",
      ghostwhite: "#F8F8FF",
      gold: "#FFD700",
      goldenrod: "#DAA520",
      gray: "#808080",
      grey: "#808080",
      green: "#008000",
      greenyellow: "#ADFF2F",
      honeydew: "#F0FFF0",
      hotpink: "#FF69B4",
      indianred: "#CD5C5C",
      indigo: "#4B0082",
      ivory: "#FFFFF0",
      khaki: "#F0E68C",
      lavender: "#E6E6FA",
      lavenderblush: "#FFF0F5",
      lawngreen: "#7CFC00",
      lemonchiffon: "#FFFACD",
      lightblue: "#ADD8E6",
      lightcoral: "#F08080",
      lightcyan: "#E0FFFF",
      lightgoldenrodyellow: "#FAFAD2",
      lightgray: "#D3D3D3",
      lightgrey: "#D3D3D3",
      lightgreen: "#90EE90",
      lightpink: "#FFB6C1",
      lightsalmon: "#FFA07A",
      lightseagreen: "#20B2AA",
      lightskyblue: "#87CEFA",
      lightslategray: "#778899",
      lightslategrey: "#778899",
      lightsteelblue: "#B0C4DE",
      lightyellow: "#FFFFE0",
      lime: "#00FF00",
      limegreen: "#32CD32",
      linen: "#FAF0E6",
      magenta: "#FF00FF",
      maroon: "#800000",
      mediumaquamarine: "#66CDAA",
      mediumblue: "#0000CD",
      mediumorchid: "#BA55D3",
      mediumpurple: "#9370DB",
      mediumseagreen: "#3CB371",
      mediumslateblue: "#7B68EE",
      mediumspringgreen: "#00FA9A",
      mediumturquoise: "#48D1CC",
      mediumvioletred: "#C71585",
      midnightblue: "#191970",
      mintcream: "#F5FFFA",
      mistyrose: "#FFE4E1",
      moccasin: "#FFE4B5",
      navajowhite: "#FFDEAD",
      navy: "#000080",
      oldlace: "#FDF5E6",
      olive: "#808000",
      olivedrab: "#6B8E23",
      orange: "#FFA500",
      orangered: "#FF4500",
      orchid: "#DA70D6",
      palegoldenrod: "#EEE8AA",
      palegreen: "#98FB98",
      paleturquoise: "#AFEEEE",
      palevioletred: "#DB7093",
      papayawhip: "#FFEFD5",
      peachpuff: "#FFDAB9",
      peru: "#CD853F",
      pink: "#FFC0CB",
      plum: "#DDA0DD",
      powderblue: "#B0E0E6",
      purple: "#800080",
      rebeccapurple: "#663399",
      red: "#FF0000",
      rosybrown: "#BC8F8F",
      royalblue: "#4169E1",
      saddlebrown: "#8B4513",
      salmon: "#FA8072",
      sandybrown: "#F4A460",
      seagreen: "#2E8B57",
      seashell: "#FFF5EE",
      sienna: "#A0522D",
      silver: "#C0C0C0",
      skyblue: "#87CEEB",
      slateblue: "#6A5ACD",
      slategray: "#708090",
      slategrey: "#708090",
      snow: "#FFFAFA",
      springgreen: "#00FF7F",
      steelblue: "#4682B4",
      tan: "#D2B48C",
      teal: "#008080",
      thistle: "#D8BFD8",
      tomato: "#FF6347",
      turquoise: "#40E0D0",
      violet: "#EE82EE",
      wheat: "#F5DEB3",
      white: "#FFFFFF",
      whitesmoke: "#F5F5F5",
      yellow: "#FFFF00",
      yellowgreen: "#9ACD32"
    };
  class Ho {
    constructor(t, e, i, r) {
      return Ho.isBaseConstructor(t) ? (this.r = So(t.r), this.g = So(t.g), this.b = So(t.b), void 0 !== t.a && (this.a = Ko(t.a)), this) : Ho.parse(t, e, i, r);
    }
    static parse(t, e, i, r) {
      if (Ho.isBaseConstructor(t)) return new Ho(t);
      if (void 0 !== e && void 0 !== i) {
        let n = So(t);
        return e = So(e), i = So(i), void 0 !== r && (r = Ko(r)), new Ho({
          r: n,
          g: e,
          b: i,
          a: r
        });
      }
      if (Array.isArray(t)) return Ho.fromArray(t);
      if ("string" == typeof t) {
        let i;
        if (void 0 !== e && Number(e) <= 1 && Number(e) >= 0 && (i = Number(e)), t.startsWith("#")) return Ho.fromHex(t, i);
        if (Do[t.toLowerCase()]) return Ho.fromNamed(t, i);
        if (t.startsWith("rgb")) return Ho.fromRgbString(t);
        if ("transparent" === t) {
          let t, e, i, r;
          return t = e = i = r = 0, new Ho({
            r: t,
            g: e,
            b: i,
            a: r
          });
        }
        return null;
      }
      if ("object" == typeof t) {
        if (void 0 !== t.a && (this.a = Ko(t.a)), void 0 !== t.h) {
          let e = {};
          if (void 0 !== t.v) e = Ho.fromHsv(t);else {
            if (void 0 === t.l) return Ho.fromArray([0, 0, 0]);
            e = Ho.fromHsl(t);
          }
          return e.a = void 0 !== t.a ? Ko(t.a) : void 0, new Ho(e);
        }
        return void 0 !== t.c ? Ho.fromCMYK(t) : this;
      }
      return Ho.fromArray([0, 0, 0]);
    }
    static isBaseConstructor(t) {
      return "object" == typeof t && void 0 !== t.r && void 0 !== t.g && void 0 !== t.b;
    }
    static fromNamed(t, e) {
      return Ho.fromHex(Do[t.toLowerCase()], e);
    }
    static fromArray(t) {
      t = t.filter(t => "" !== t && isFinite(t));
      const e = {
        r: So(t[0]),
        g: So(t[1]),
        b: So(t[2])
      };
      return void 0 !== t[3] && (e.a = Ko(t[3])), new Ho(e);
    }
    static fromHex(t, e) {
      3 !== (t = t.replace("#", "")).length && 4 !== t.length || (t = t.split("").map(t => t + t).join(""));
      let i = t.match(/[A-Za-z0-9]{2}/g).map(t => parseInt(t, 16));
      return 4 === i.length ? i[3] /= 255 : void 0 !== e && (i[3] = e), Ho.fromArray(i);
    }
    static fromRgbString(t) {
      if (t.includes(",")) return Ho.fromArray(t.split("(")[1].split(")")[0].split(","));
      const e = t.replace("/", " ").split("(")[1].replace(")", "").split(" ").filter(t => "" !== t && isFinite(Number(t)));
      return Ho.fromArray(e);
    }
    static fromHsv({
      h: t,
      s: e,
      v: i
    }) {
      e /= 100, i /= 100;
      const r = Math.floor(t / 60 % 6),
        n = t / 60 - r,
        o = i * (1 - e),
        s = i * (1 - n * e),
        a = i * (1 - (1 - n) * e),
        l = [[i, a, o], [s, i, o], [o, i, a], [o, s, i], [a, o, i], [i, o, s]][r].map(t => Math.round(256 * t));
      return new Ho({
        r: So(l[0]),
        g: So(l[1]),
        b: So(l[2])
      });
    }
    static fromHsl({
      h: t,
      s: e,
      l: i
    }) {
      e /= 100, i /= 100;
      const r = (1 - Math.abs(2 * i - 1)) * e,
        n = r * (1 - Math.abs(t / 60 % 2 - 1)),
        o = i - r / 2;
      let s = 0,
        a = 0,
        l = 0;
      return 0 <= t && t < 60 ? (s = r, a = n, l = 0) : 60 <= t && t < 120 ? (s = n, a = r, l = 0) : 120 <= t && t < 180 ? (s = 0, a = r, l = n) : 180 <= t && t < 240 ? (s = 0, a = n, l = r) : 240 <= t && t < 300 ? (s = n, a = 0, l = r) : 300 <= t && t < 360 && (s = r, a = 0, l = n), new Ho({
        r: Co(o + s),
        g: Co(o + a),
        b: Co(o + l)
      });
    }
    static fromCMYK({
      c: t,
      m: e,
      y: i,
      k: r,
      a: n
    }) {
      const o = t => Co(1 - Math.min(1, t / 100 * (1 - r) + r));
      return new Ho({
        r: o(t),
        b: o(e),
        g: o(i),
        a: n
      });
    }
    get alpha() {
      return void 0 === this.a ? 1 : this.a;
    }
    get rgb() {
      return [this.r, this.g, this.b];
    }
    get rgba() {
      return [this.r, this.g, this.b, this.alpha];
    }
    get rgbObj() {
      let {
        r: t,
        g: e,
        b: i
      } = this;
      return {
        r: t,
        g: e,
        b: i,
        a: this.alpha
      };
    }
    get css() {
      return this.rgbString;
    }
    get rgbString() {
      return void 0 === this.a ? `rgb(${this.rgb.join(",")})` : `rgba(${this.rgba.join(",")})`;
    }
    get rgbaString() {
      return `rgba(${this.rgba.join(",")})`;
    }
    get hex() {
      return `#${this.rgb.map(t => t.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
    }
    get hexa() {
      return this.rgbaHex;
    }
    get rgbaHex() {
      let t = this.rgba;
      return t[3] = Co(t[3]), `#${t.map(t => t.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
    }
    get hsv() {
      const t = Fo(this.r),
        e = Fo(this.g),
        i = Fo(this.b),
        r = Math.min(t, e, i),
        n = Math.max(t, e, i);
      let o;
      const s = n,
        a = n - r;
      o = 0 === a ? 0 : n === t ? (e - i) / a * 60 % 360 : n === e ? (i - t) / a * 60 + 120 : n === i ? (t - e) / a * 60 + 240 : 0, o < 0 && (o += 360);
      const l = 0 === n ? 0 : 1 - r / n;
      return {
        h: Math.round(o),
        s: Math.round(100 * l),
        v: Math.round(100 * s),
        a: this.alpha
      };
    }
    get hsl() {
      const t = Fo(this.r),
        e = Fo(this.g),
        i = Fo(this.b),
        r = Math.max(t, e, i),
        n = Math.min(t, e, i);
      let o, s;
      const a = (r + n) / 2;
      if (r === n) o = s = 0;else {
        const l = r - n;
        switch (s = a > .5 ? l / (2 - r - n) : l / (r + n), r) {
          case t:
            o = (e - i) / l + (e < i ? 6 : 0);
            break;
          case e:
            o = (i - t) / l + 2;
            break;
          case i:
            o = (t - e) / l + 4;
        }
        o /= 6;
      }
      return {
        h: Math.round(360 * o),
        s: Math.round(100 * s),
        l: Math.round(100 * a),
        a: this.alpha
      };
    }
    get cmyk() {
      let t, e, i, r;
      const n = parseFloat(this.r) / 255,
        o = parseFloat(this.g) / 255,
        s = parseFloat(this.b) / 255;
      return r = 1 - Math.max(n, o, s), 1 === r ? t = e = i = 0 : (t = (1 - n - r) / (1 - r), e = (1 - o - r) / (1 - r), i = (1 - s - r) / (1 - r)), t = Math.round(100 * t), e = Math.round(100 * e), i = Math.round(100 * i), r = Math.round(100 * r), this.alpha ? {
        c: t,
        m: e,
        y: i,
        k: r,
        a: this.alpha
      } : {
        c: t,
        m: e,
        y: i,
        k: r
      };
    }
    get hslString() {
      const t = this.hsl;
      return `hsl(${t.h}, ${t.s}%, ${t.l}%)`;
    }
    get hslaString() {
      const t = this.hsl;
      return `hsla(${t.h}, ${t.s}%, ${t.l}%, ${t.a})`;
    }
    get cmykString() {
      const t = this.cmyk;
      return `cmyk(${t.c}%, ${t.m}%, ${t.y}%, ${t.k}%)`;
    }
    get cmykaString() {
      const t = this.cmyk;
      return `cmyka(${t.c}%, ${t.m}%, ${t.y}%, ${t.k}%, ${t.a})`;
    }
    toString(t = "rgb") {
      let e;
      switch (t) {
        case "rgb":
        default:
          e = this.rgbString;
          break;
        case "hex":
          e = this.hex;
          break;
        case "rgbaHex":
          e = this.hexa;
          break;
        case "hsl":
          e = this.hslString;
          break;
        case "hsla":
          e = this.hslaString;
          break;
        case "cmyk":
          e = this.cmykString;
          break;
        case "cmyka":
          e = this.cmykaString;
      }
      return e;
    }
    mix(t, e = .5) {
      const i = this.rgba;
      i[3] = Co(i[3]);
      const r = new Ho(t).rgba;
      r[3] = Co(r[3]), e = Ko(e);
      const n = i.map((t, i) => {
        const n = r[i],
          o = n < t,
          s = o ? t - n : n - t,
          a = Math.round(s * e);
        return o ? t - a : a + t;
      });
      return n[3] = Fo(n[3]), Ho.fromArray(n);
    }
    adjustSatLum(t, e, i) {
      const r = this.hsl;
      let n = r[t],
        o = (i ? n : 100 - n) * e;
      return r[t] = To(100, i ? n - o : n + o), r.a = this.a, new Ho(r);
    }
    lighten(t, e = !1) {
      return this.adjustSatLum("l", t, e);
    }
    darken(t) {
      return this.lighten(t, !0);
    }
    saturate(t, e = !1) {
      return this.adjustSatLum("s", t, e);
    }
    desaturate(t) {
      return this.saturate(t, !0);
    }
    grayscale() {
      return this.desaturate(1);
    }
    rotate(t) {
      return this.hue(t);
    }
    hue(t) {
      const e = this.hsl;
      return e.h = Math.round(e.h + t) % 360, e.a = this.a, new Ho(e);
    }
    fadeIn(t, e) {
      let i = this.alpha;
      const {
        r,
        g: n,
        b: o
      } = this;
      let s = (1 - i) * t;
      return i = e ? i - s : i + s, Ho({
        r,
        g: n,
        b: o,
        a: i
      });
    }
    fadeOut(t) {
      return this.fadeIn(t, !0);
    }
    negate() {
      let t = this.rgb.map(t => 255 - t);
      return void 0 !== this.a && t.push(this.alpha), Ho.fromArray(t);
    }
  }
  const Uo = (t, e, i = "color-update") => {
      const r = i.includes("color") ? {
          color: e
        } : e,
        n = new CustomEvent(i, {
          bubbles: !0,
          composed: !0,
          detail: r
        });
      t.dispatchEvent(n);
    },
    Bo = (t = 3, e) => {
      let i = 0,
        r = 100,
        n = 50,
        o = null,
        s = !1;
      e && (r = e.s, e.hasOwnProperty("v") ? (o = e.v, n = null, s = !0) : n = e.l);
      const a = [];
      let l, h;
      const c = (t, e) => `${t.css} ${(100 * e).toFixed(1)}%`;
      for (; i < 360;) l = Ho.parse(s ? {
        h: i,
        s: r,
        v: o
      } : {
        h: i,
        s: r,
        l: n
      }), h = i / 360, a.push(c(l, h)), i += t;
      return i = 359, l = Ho.parse(s ? {
        h: i,
        s: r,
        v: o
      } : {
        h: i,
        s: r,
        l: n
      }), h = 1, a.push(c(l, h)), a.join(", ");
    },
    ko = W`<svg
  stroke="currentColor"
  fill="none"
  stroke-width="0"
  viewBox="0 0 24 24"
>
  <path d="M13 7H7V5H13V7Z" fill="currentColor"></path>
  <path d="M13 11H7V9H13V11Z" fill="currentColor"></path>
  <path d="M7 15H13V13H7V15Z" fill="currentColor"></path>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z"
    fill="currentColor"
  ></path>
</svg>`;
  class Mo extends ut {
    static properties = {
      hue: {
        type: Number
      },
      color: {
        type: Object
      },
      gradient: {
        type: String,
        attribute: !1
      },
      sliderStyle: {
        type: String,
        attribute: !1
      },
      sliderBounds: {
        type: Object
      },
      width: {
        type: Number,
        attribute: !1
      }
    };
    static styles = p`
    :host > div {
      display: block;
      width: ${d(this.width)}px;
      height: 15px;
      cursor: pointer;
      position: relative;
    }

    :host .slider {
      position: absolute;
      top: -1px;
      height: 17px;
      width: 8px;
      margin-left: -4px;
      box-shadow:
        0 0 3px #111,
        inset 0 0 2px white;
    }
  `;
    constructor() {
      super(), this.gradient = {
        backgroundImage: `linear-gradient(90deg, ${Bo(24)})`
      }, this.width = 400, this.sliderStyle = {
        display: "none"
      };
    }
    firstUpdated() {
      const t = this.renderRoot.querySelector("lit-movable");
      t.onmovestart = () => {
        Uo(this.renderRoot, {
          sliding: !0
        }, "sliding-hue");
      }, t.onmoveend = () => {
        Uo(this.renderRoot, {
          sliding: !1
        }, "sliding-hue");
      }, t.onmove = ({
        posLeft: t
      }) => this.selectHue({
        offsetX: t
      }), this.sliderStyle = this.sliderCss(this.hue);
    }
    get sliderBounds() {
      const t = this.width / 360,
        e = Number(this.hue) * t;
      return {
        min: 0 - e,
        max: this.width - e,
        posLeft: e
      };
    }
    get sliderCss() {
      return t => {
        this.color.hsx && (t = this.color.hsx.h), void 0 === t && (t = this.color.hsl.h);
        return {
          backgroundColor: Ho.parse({
            h: t,
            s: 100,
            l: 50
          }).css
        };
      };
    }
    willUpdate(t) {
      if (t.get("hue") && isFinite(this.hue)) {
        if (this.color?.hsx) return;
        const t = this.hue;
        this.sliderStyle = this.sliderCss(t);
      }
    }
    selectHue(t) {
      const e = 360 / this.width,
        i = t.offsetX,
        r = Math.max(0, Math.min(359, Math.round(i * e))),
        n = this.renderRoot.querySelector("a"),
        o = new CustomEvent("hue-update", {
          bubbles: !0,
          composed: !0,
          detail: {
            h: r
          }
        });
      n.dispatchEvent(o), this.sliderStyle = this.sliderCss(r);
    }
    render() {
      return W` <div
      style=${An(this.gradient)}
      class="bar"
      @click="${this.selectHue}"
    >
      <lit-movable
        horizontal="${this.sliderBounds.min}, ${this.sliderBounds.max}"
        posLeft="${this.sliderBounds.posLeft}"
      >
        <a class="slider" style=${An(this.sliderCss(this.h))}></a>
      </lit-movable>
    </div>`;
    }
  }
  customElements.get("hue-bar") || customElements.define("hue-bar", Mo);
  const Io = p`
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -1;
  background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.125) 25%,
      transparent 0,
      transparent 75%,
      rgba(0, 0, 0, 0.125) 0,
      rgba(0, 0, 0, 0.125) 0
    ),
    linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.125) 25%,
      transparent 0,
      transparent 75%,
      rgba(0, 0, 0, 0.125) 0,
      rgba(0, 0, 0, 0.125) 0
    ),
    #fff;
  background-repeat: repeat, repeat;
  background-position:
    0 0,
    6px 6px;
  background-size:
    12px 12px,
    12px 12px;
`,
    Ro = p`
  display: inline-block;
  width: 69px;
  padding: 0.325rem 0.5rem;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--input-color);
  appearance: none;
  background-color: var(--input-bg);
  background-clip: padding-box;
  border: 1px solid var(--form-border-color);
  border-radius: 3px;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
`,
    No = p`
  color: var(--input-active-color);
  background-color: var(--input-active-bg);
  border-color: var(--input-active-border-color);
  outline: 0;
  box-shadow: var(--input-active-box-shadow);
`,
    Oo = p`
  :host {
    --font-fam: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
      "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --bg-color: rgb(30 41 59);
    --label-color: #ccc;
    --form-border-color: #495057;
    --input-active-border-color: #86b7fe;
    --input-bg: #020617;
    --input-active-bg: #4682b4;
    --input-color: #ccc;
    --input-active-color: #333;
    --input-active-box-shadow: 0 2px 5px #ccc;
    --button-active-bg: #0c5b9d;
    --button-active-color: white;
    --outer-box-shadow: 0 4px 12px #111;
  }
  :host > .outer {
    position: relative;
    background-color: var(--bg-color);
    height: 250px;
    width: 400px;
    display: block;
    padding: 10px;
    margin: 10px;
    box-shadow: var(--outer-box-shadow);
  }
  .d-flex {
    display: flex;
    width: 100%;
    margin-top: 15px;
  }
  .w-30 {
    width: 30%;
  }
  .w-40 {
    width: 40%;
    position: relative;
    height: 210px;
  }
  :host .form-control {
    ${Ro}
  }
  :host .form-control:focus {
    ${No}
  }
  :host label {
    width: 12px;
    display: inline-block;
    color: var(--label-color);
    font-family: var(--font-fam);
  }
  :host .hsl-mode {
    padding-left: 16px;
    margin-top: 18px;
  }
  :host .button {
    padding: 0.325rem 0.5rem;
    background-color: var(--input-bg);
    border: 1px solid var(--form-border-color);
    font-family: var(--font-fam);
    color: var(--input-color);
    cursor: pointer;
    font-size: 0.9rem;
  }
  :host div.hex {
    margin-top: 27px;
    white-space: nowrap;
    position: relative;
  }
  :host dialog {
    opacity: 0;
    width: 177px;
    position: absolute;
    bottom: 30px;
    left: 0px;
    z-index: 3;
    border: 1px solid transparent;
    outline: transparent;
    box-shadow: var(--outer-box-shadow);
    background-color: var(--input-bg);
    transition: opacity 0.3s;
  }
  :host dialog.open {
    opacity: 1;
  }
  :host dialog * {
    color: var(--input-color);
  }
  :host dialog a.copy-item {
    margin-bottom: 5px;
    white-space: nowrap;
    display: block;
    width: 180px;
    cursor: pointer;
  }
  :host dialog input.form-control {
    font-size: 12px;
    display: inline-block;
    vertical-align: middle;
    width: 132px;
    padding-bottom: 2px;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    pointer-events: none;
  }
  :host dialog button.button {
    display: inline-block;
    vertical-align: middle;
    margin-left: -5px;
    font-size: 12px;
    height: 27px;
    width: 27px;
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
    background-color: transparent;
  }
  :host dialog a.copy-item:hover .button,
  :host dialog a.copy-item:hover input.form-control,
  :host dialog a.copy-item:hover path {
    color: var(--button-active-color);
    background-color: var(--button-active-bg);
    fill: var(--button-active-color);
    cursor: pointer;
  }
  :host dialog .button svg {
    height: 15px;
    width: 15px;
    margin-left: -3px;
  }
  :host div.hex input {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    vertical-align: middle;
    display: inline-block;
  }
  :host .button.copy {
    padding: 8px 6px 5px 5px;
    position: relative;
    position: relative;
    border-left: 0;
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
    height: 34px;
    display: inline-block;
    box-sizing: border-box;
    overflow: hidden;
    vertical-align: middle;
  }
  :host .button.copy svg {
    height: 16px;
    width: 15px;
    margin-right: -2px;
  }
  :host .button.copy span {
    font-size: 10px;
    position: relative;
    top: -3px;
  }
  :host a.button.l {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  :host a.button.r {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-left: none;
  }
  :host a.button.active {
    color: #eee;
    background-color: var(--button-active-bg);
    cursor: default;
  }
  :host .ok {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  :host .ok a {
    border-radius: 3px;
    padding: 6px 12px;
  }
  :host .swatch {
    height: 14px;
    width: 14px;
    display: inline-block;
    position: relative;
    top: 2px;
    margin-left: 3px;
  }
  :host .swatch span {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  :host .swatch span.checky {
    ${Io}
    z-index: 0;
  }
`,
    Lo = p`
  :host > div {
    margin-bottom: 8px;
    display: block;
    position: relative;
  }

  :host label {
    width: 12px;
    display: inline-block;
    color: var(--label-color);
    font-family: var(--font-fam);
  }

  :host .form-control {
    ${Ro}
  }

  :host .form-control:focus {
    ${No}
  }

  :host .preview-bar {
    height: 4px;
    width: 85.5px;
    position: absolute;
    bottom: 0px;
    right: 17.5px;
    --pct: 0;
    pointer-events: none;
    z-index: 2;
  }

  :host .preview-bar:after {
    position: absolute;
    content: "";
    background-image: var(--preview);
    background-color: transparent;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    box-shadow: inset 0 -1px 1px var(--form-border-color);
    height: 100%;
    width: 100%;
  }

  :host > div.active .preview-bar {
    width: 128px;
    bottom: -23px;
    right: -9px;
    height: 10px;
    border: 8px solid var(--input-bg);
    box-shadow: var(--input-active-box-shadow);
    pointer-events: all;
    z-index: 2;
    cursor: pointer;
  }
  :host > div.active .preview-bar:after {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  :host .preview-bar .pct {
    bottom: -3px;
    margin-top: -0.75px;
    position: absolute;
    width: 3px;
    height: 11px;
    background: 0 0;
    left: var(--pct);
    display: inline-block;
    z-index: 3;
    pointer-events: none;
  }

  :host .preview-bar .pct:before {
    content: "";
    height: 7px;
    width: 5px;
    position: absolute;
    left: -2.5px;
    top: 2.5px;
    background-color: #fff;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
  :host .active .preview-bar .pct:before {
    width: 7px;
    height: 11px;
    left: -3.5px;
    top: -1px;
  }
  :host .transparent-checks {
    ${Io}
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  :host div.active .transparent-checks {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`,
    zo = {
      r: "R (red) channel",
      g: "G (green) channel",
      b: "B (blue) channel",
      h: "H (hue) channel",
      s: "S (saturation) channel",
      v: "V (value / brightness) channel",
      l: "L (luminosity) channel",
      a: "A (alpha / opacity) channel"
    };
  class $o extends ut {
    static properties = {
      group: {
        type: String
      },
      channel: {
        type: String
      },
      color: {
        type: Object
      },
      isHsl: {
        type: Boolean
      },
      c: {
        type: Object,
        state: !0,
        attribute: !1
      },
      previewGradient: {
        type: Object,
        state: !0,
        attribute: !1
      },
      active: {
        type: Boolean,
        state: !0,
        attribute: !1
      },
      max: {
        type: Number,
        state: !0,
        attribute: !1
      },
      v: {
        type: Number,
        state: !0,
        attribute: !1
      }
    };
    static styles = Lo;
    clickPreview(t) {
      const e = Math.max(0, Math.min(t.offsetX, 128));
      let i = Math.round(e / 128 * this.max);
      "a" === this.channel && (i = Number((e / 127).toFixed(2))), this.valueChange(null, i), this.setActive(!1);
    }
    valueChange = (t, e = null) => {
      e = e ?? Number(this.renderRoot.querySelector("input").value), "a" === this.channel && (e /= 100), this.c[this.channel] = e;
      const i = Ho.parse(this.c);
      "rgb" !== this.group && (i.hsx = this.c), this.c = "rgb" === this.group ? this.color.rgbObj : this.isHsl ? this.color.hsl : this.color.hsv, Uo(this.renderRoot, i);
    };
    setActive(t) {
      this.active = t, t && this.renderRoot.querySelector("input").select();
    }
    constructor() {
      super();
    }
    setPreviewGradient() {
      let t;
      t = "rgb" === this.group ? this.color.rgbObj : this.color.hsx ? this.color.hsx : this.isHsl ? this.color.hsl : this.color.hsv, this.c = t;
      const e = this.group,
        i = this.channel,
        r = "a" === i;
      this.v = t[i], r && (this.v *= 100);
      let n,
        o,
        s = 255;
      if ("rgb" !== e || "a" === i) {
        if ("h" === i) return s = this.max = 359, void (this.previewGradient = {
          "--preview": `linear-gradient(90deg, ${Bo(24, t)})`,
          "--pct": t.h / s * 100 + "%"
        });
        s = r ? 1 : 100;
      }
      if (this.max = s, n = {
        ...t
      }, o = n, n[this.channel] = 0, n = Ho.parse(n), o[this.channel] = s, o = Ho.parse(o), "l" === this.channel) {
        const e = {
          ...t
        };
        e.l = 50, this.previewGradient = {
          "--preview": `linear-gradient(90deg, ${n.hex}, ${Ho.parse(e).hex}, ${o.hex})`,
          "--pct": t[this.channel] / s * 100 + "%"
        };
      } else this.previewGradient = {
        "--preview": `linear-gradient(90deg, ${r ? n.css : n.hex}, ${r ? o.css : o.hex})`,
        "--pct": t[this.channel] / s * 100 + "%"
      };
    }
    willUpdate(t) {
      this.setPreviewGradient();
    }
    render() {
      const t = "a" === this.channel ? W`<div class="transparent-checks"></div>` : null,
        e = "a" === this.channel ? 100 : this.max;
      return W` <div class="${pn({
        active: this.active
      })}">
      <label for="channel_${this.ch}">${this.channel.toUpperCase()}</label>
      <input
        id="channel_${this.ch}"
        aria-label="${zo[this.channel]}"
        class="form-control"
        .value="${Math.round(this.v)}"
        type="number"
        min="0"
        max="${e}"
        @input="${this.valueChange}"
        @focus="${() => this.setActive(!0)}"
        @blur="${() => this.setActive(!1)}"
      />
      <div
        class="preview-bar"
        style="${An(this.previewGradient)}"
        @mousedown="${this.clickPreview}"
      >
        <div class="pct"></div>
        ${t}
      </div>
    </div>`;
    }
  }
  customElements.get("color-input-channel") || customElements.define("color-input-channel", $o);
  class jo extends ut {
    static properties = {
      color: {
        type: Object
      },
      isHsl: {
        type: Boolean
      },
      size: {
        type: Number
      },
      debounceMode: {
        type: Boolean
      },
      ctx: {
        type: Object,
        state: !0,
        attribute: !1
      },
      hsw: {
        type: Object,
        state: !0,
        attribute: !1
      },
      circlePos: {
        type: Object,
        state: !0,
        attribute: !1
      }
    };
    static styles = p`
    :host .outer {
      position: absolute;
      top: 0;
      right: 0;
    }

    :host .outer canvas {
      height: inherit;
      width: inherit;
      cursor: pointer;
    }

    :host .circle {
      height: 12px;
      width: 12px;
      border: solid 2px #eee;
      border-radius: 50%;
      box-shadow:
        0 0 3px #000,
        inset 0 0 1px #fff;
      position: absolute;
      margin: -8px;
      mix-blend-mode: difference;
    }
  `;
    constructor() {
      super(), this.isHsl = !0, this.circlePos = {
        top: 0,
        left: 0,
        bounds: {
          x: "",
          y: ""
        }
      }, this.size = 160;
    }
    setColor(t) {
      Uo(this.renderRoot, t);
    }
    setCircleCss(t, e) {
      const i = `${t}`,
        r = `${e}`,
        n = {
          x: `0, ${this.size}`,
          y: `0,${this.size}`
        };
      this.circlePos = {
        top: r,
        left: i,
        bounds: n
      };
    }
    pickCoord({
      offsetX: t,
      offsetY: e
    }) {
      const i = t,
        r = e,
        {
          size: n,
          hsw: o,
          isHsl: s,
          color: a
        } = this;
      let l = (n - r) / n;
      l = Math.round(100 * l);
      const h = Math.round(i / n * 100),
        c = {
          h: o.h,
          s: h,
          [s ? "l" : "v"]: l
        },
        d = s ? Ho.fromHsl(c) : Ho.fromHsv(c);
      this.setCircleCss(i, r), d.a = a.alpha, d.hsx = c, d.fromHSLCanvas = !0, this.setColor(d);
    }
    debouncePaintDetail(t) {
      clearTimeout(this.bouncer), this.bouncer = setTimeout(() => this.paintHSL(t, !0), 50), this.paintHSL(t, !1);
    }
    paintHSL(t, e = null) {
      if (this.debounceMode && null === e) return this.debouncePaintDetail(t);
      const {
        ctx: i,
        color: r,
        isHsl: n,
        size: o
      } = this;
      if (!i) return;
      const s = r;
      (t = t ?? n ? s.hsl : s.hsv).w = n ? t.l : t.v;
      const {
          h: a,
          s: l,
          w: h
        } = t,
        c = this.hsw = {
          h: a,
          s: l,
          w: h
        },
        d = o / 100,
        p = n ? (t, e, i) => `hsl(${t}, ${e}%, ${100 - i}%)` : (t, e, i) => Ho.fromHsv({
          h: t,
          s: e,
          v: 100 - i
        }).hex,
        u = !1 === e ? 4 : 1;
      for (let t = 0; t < 100; t += u) for (let e = 0; e < 100; e += u) i.fillStyle = p(a, t, e), i.fillRect(t, e, t + u, e + u);
      this.setCircleCss(c.s * d, o - t.w * d);
    }
    willUpdate(t) {
      if (t.has("color") || t.has("isHsl")) {
        if (this.color?.hsx) return this.color.fromHSLCanvas ? void delete this.color.fromHSLCanvas : this.paintHSL(this.color.hsx);
        this.paintHSL();
      }
    }
    firstUpdated(t) {
      const e = this.renderRoot.querySelector("canvas");
      this.ctx = e.getContext("2d"), this.paintHSL();
    }
    circleMove({
      posTop: t,
      posLeft: e
    }) {
      this.pickCoord({
        offsetX: e,
        offsetY: t
      });
    }
    render() {
      const t = {
          height: this.size + "p",
          width: this.size + "px"
        },
        {
          top: e,
          left: i,
          bounds: r
        } = this.circlePos;
      return W` <div
      class="outer"
      @click="${this.pickCoord}"
      style="${An(t)}"
    >
      <canvas height="100" width="100"></canvas>
      <lit-movable
        boundsX="${r.x}"
        boundsY="${r.y}"
        posTop="${e}"
        posLeft="${i}"
        .onmove="${t => this.circleMove(t)}"
      >
        <div class="circle"></div>
      </lit-movable>
    </div>`;
    }
  }
  customElements.get("hsl-canvas") || customElements.define("hsl-canvas", jo);
  const Vo = t => isFinite(t) ? Number(t) : Number(t.replace(/[^0-9.\-]/g, "")),
    Xo = t => (t = Number(t), (isNaN(t) || [void 0, null].includes(t)) && (t = 0), t);
  class Go {
    constructor(t, e) {
      this.x = Xo(t), this.y = Xo(e);
    }
    static fromPointerEvent(t) {
      const {
        pageX: e,
        pageY: i
      } = t;
      return new Go(e, i);
    }
    static fromElementStyle(t) {
      const e = Vo(t.style.left ?? 0),
        i = Vo(t.style.top ?? 0);
      return new Go(e, i);
    }
    static fromObject({
      x: t,
      y: e
    }) {
      return new Go(t, e);
    }
    get top() {
      return this.y;
    }
    set top(t) {
      this.y = t;
    }
    get left() {
      return this.x;
    }
    set left(t) {
      this.x = t;
    }
  }
  class Qo {
    constructor(t = -1 / 0, e = 1 / 0) {
      this.min = t, this.max = e, this.attr = "";
    }
    get constrained() {
      return this.min === this.max;
    }
    get unconstrained() {
      return this.min === -1 / 0 && this.max === 1 / 0;
    }
    static fromString(t = null, e = 0) {
      if (!t) return new Qo();
      if ("null" === t) return new Qo(0, 0);
      const [i, r] = t.split(",").map(t => Number(t.trim()) + e),
        n = new Qo(i, r);
      return n.attr = t, n;
    }
  }
  class Wo extends ut {
    _target;
    _targetSelector = null;
    _boundsX = new Qo();
    _boundsY = new Qo();
    isMoving = !1;
    moveState = {};
    _vertical = null;
    _horizontal = null;
    _posTop = null;
    _posLeft = null;
    _grid = 1;
    pointerId;
    constructor() {
      super();
    }
    get vertical() {
      return this._vertical;
    }
    set vertical(t) {
      this.boundsY = t, this.boundsX = "null", this._vertical = t;
    }
    get horizontal() {
      return this._horizontal;
    }
    set horizontal(t) {
      this.boundsX = t, this.boundsY = "null", this._horizontal = t;
    }
    set posTop(t) {
      t = Number(t), this._posTop = t, this.target && (this.target.style.top = t + "px");
    }
    get posTop() {
      return this._posTop;
    }
    set posLeft(t) {
      t = Number(t), this._posLeft = t, this.target && (this.target.style.left = t + "px");
    }
    get posLeft() {
      return this._posLeft;
    }
    get grid() {
      return this._grid;
    }
    set grid(t) {
      this._grid = t > 0 && t < 1 / 0 ? t : 1;
    }
    get bounds() {
      return {
        left: this._boundsX,
        top: this._boundsY
      };
    }
    set targetSelector(t) {
      this._targetSelector = t, this._retryTarget = null === document.querySelector(t), this._target = document.querySelector(t);
    }
    get targetSelector() {
      return this._targetSelector;
    }
    get target() {
      return this._target ?? this;
    }
    set target(t) {
      this._target = t;
    }
    get boundsX() {
      return this._boundsX;
    }
    set boundsX(t) {
      this._boundsX = Qo.fromString(t, Vo(this.target?.style.left ?? 0)), this.bounds.left = this._boundsX;
    }
    get boundsY() {
      return this._boundsY;
    }
    set boundsY(t) {
      this._boundsY = Qo.fromString(t, Vo(this.target?.style.top ?? 0)), this.bounds.top = this._boundsY;
    }
    static properties = {
      posLeft: {
        type: Number
      },
      posTop: {
        type: Number
      },
      target: {
        type: Object,
        attribute: !1,
        state: !0
      },
      targetSelector: {
        type: String
      },
      bounds: {
        type: Object,
        attribute: !1,
        state: !0
      },
      boundsX: {
        type: String
      },
      boundsY: {
        type: String
      },
      vertical: {
        type: String
      },
      horizontal: {
        type: String
      },
      grid: {
        type: Number
      },
      shiftBehavior: {
        type: Boolean
      },
      disabled: {
        type: Boolean
      },
      eventsOnly: {
        type: Boolean
      },
      listening: {
        type: Boolean
      },
      onmovestart: {
        type: Object
      },
      onmoveend: {
        type: Object
      },
      onmove: {
        type: Object
      }
    };
    firstUpdated(t) {
      this._retryTarget && (this.target = document.querySelector(this.targetSelector));
      const {
          bounds: e,
          target: i,
          posTop: r,
          posLeft: n
        } = this,
        {
          offsetLeft: o,
          offsetTop: s,
          style: {
            left: a,
            top: l
          }
        } = this.target;
      i.classList.add("--movable-base"), this.renderRoot.addEventListener("pointerdown", t => this.pointerdown(t)), i.style.position = "absolute", i.style.cursor = "pointer", n ? i.style.left = n + "px" : !a && o && (i.style.left = o + "px", e.left.constrained && (e.left.min = e.left.max = o)), r ? i.style.top = r + "px" : !l && s && (i.style.top = s + "px", e.top.constrained && (e.top.min = e.top.max = s));
    }
    reposition(t) {
      if ("object" == typeof t) {
        const {
          eventsOnly: e,
          target: i
        } = this;
        this.posTop = t.top, this.posLeft = t.left, i && !e && (i.style.left = t.left + "px", i.style.top = t.top + "px");
      } else this.isMoving = t;
    }
    moveInit(t) {
      const e = this.moveState,
        {
          target: i,
          bounds: r
        } = this;
      e.mouseCoord = Go.fromPointerEvent(t), e.startCoord = Go.fromElementStyle(i), e.moveDist = new Go(0, 0), e.totalDist = new Go(0, 0), e.clickOffset = (t => {
        const e = Go.fromPointerEvent(t),
          i = t.target.getBoundingClientRect(),
          r = e.x - (i.left + document.body.scrollLeft),
          n = e.y - (i.top + document.body.scrollTop);
        return new Go(r, n);
      })(t), e.coords = Go.fromObject(e.startCoord), e.maxX = isFinite(r.left.min) && isFinite(r.left.max) ? r.left.min + r.left.max : 1 / 0, e.maxY = isFinite(r.top.min) && isFinite(r.top.max) ? r.top.min + r.top.max : 1 / 0, this.isMoving = !0, this.reposition(!0), this.eventBroker("movestart", t);
    }
    eventBroker(t, e) {
      this.moveState.posTop = this.posTop, this.moveState.posLeft = this.posLeft;
      const i = new CustomEvent(t, {
        bubbles: !0,
        composed: !0,
        detail: {
          ...e,
          ...this.moveState,
          element: this
        }
      });
      this.renderRoot.dispatchEvent(i);
      const r = this[`on${t}`];
      r && r({
        ...e,
        ...this.moveState,
        me: this
      });
    }
    unbind(t) {
      this.pointerId = null, document.body.removeEventListener("pointermove", t => this.motionHandler(t)), this.moveEnd(t);
    }
    moveEnd(t) {
      this.isMoving && (this.isMoving = this.moveState.isMoving = !1, this.reposition(!1), this.eventBroker("moveend", t));
    }
    motionHandler(t) {
      t.stopPropagation();
      const e = Go.fromPointerEvent(t),
        i = this.moveState,
        {
          grid: r,
          bounds: n,
          shiftBehavior: o,
          boundsX: s,
          boundsY: a
        } = this;
      if (i.moveDist = Go.fromObject({
        x: e.x - i.mouseCoord.x,
        y: e.y - i.mouseCoord.y
      }), i.mouseCoord = e, i.totalDist = Go.fromObject({
        x: i.totalDist.x + i.moveDist.x,
        y: i.totalDist.y + i.moveDist.y
      }), i.coords = Go.fromObject({
        x: Math.round(i.totalDist.x / r) * r + i.startCoord.x,
        y: Math.round(i.totalDist.y / r) * r + i.startCoord.y
      }), o && t.shiftKey && s.unconstrained && a.unconstrained) {
        const {
          x: t,
          y: e
        } = i.totalDist;
        Math.abs(t) > Math.abs(e) ? i.coords.top = i.startCoord.y : i.coords.left = i.startCoord.x;
      } else i.coords.y = Math.min(Math.max(n.top.min, i.coords.top), n.top.max), i.coords.x = Math.min(Math.max(n.left.min, i.coords.left), n.left.max);
      isFinite(i.maxX) && (i.pctX = Math.max(n.left.min, i.coords.left) / i.maxX), isFinite(i.maxY) && (i.pctY = Math.max(n.top.min, i.coords.top) / i.maxY), this.reposition(i.coords), this.eventBroker("move", t);
    }
    pointerdown(t) {
      document.body.setPointerCapture(t.pointerId), t.preventDefault(), t.stopPropagation(), void 0 !== t.pointerId && (this.pointerId = t.pointerId), this.listening || (document.body.addEventListener("pointerup", t => {
        this.isMoving && this.unbind(t);
      }, !1), document.body.addEventListener("pointermove", t => {
        void 0 !== this.pointerId && t.pointerId === this.pointerId && this.motionHandler(t);
      }, !1)), this.listening = !0, this.moveInit(t);
    }
    render() {
      return W`<slot></slot>`;
    }
  }
  window.customElements.get("lit-movable") || window.customElements.define("lit-movable", Wo);
  class qo extends ut {
    static properties = {
      color: {
        type: Object,
        state: !0,
        attribute: !1
      },
      hex: {
        type: String,
        state: !0,
        attribute: !1
      },
      value: {
        type: String
      },
      isHsl: {
        type: Boolean,
        state: !0,
        attribute: !1
      },
      copied: {
        type: String
      },
      debounceMode: {
        type: Boolean
      },
      buttonDisabled: {
        attribute: "button-disabled",
        type: Boolean
      }
    };
    static styles = Oo;
    _color;
    constructor() {
      super(), this._color = Ho.parse(Do.slateblue), this.isHsl = !0, this.buttonDisabled = !1;
    }
    firstUpdated(t) {
      this.debounceMode = !1, t.has("value") && (this.color = Ho.parse(this.value));
    }
    get color() {
      return this._color;
    }
    set color(t) {
      (t = t.hsx ? t : t.rgba ? Ho.parse(...t.rgba) : Ho.parse(t)) && (this.hex = t.hex, this._color = t, Uo(this.renderRoot, t, "colorchanged"));
    }
    updateColor({
      detail: {
        color: t
      }
    }) {
      this.color = t;
    }
    setColor(t) {
      const e = this.renderRoot.querySelector("input#hex").value,
        i = Ho.parse(e);
      i ? this.color = i : console.log(`ignored unparsable input: ${e}`);
    }
    setHue({
      detail: {
        h: t
      }
    }) {
      let {
        s: e,
        l: i,
        a: r
      } = this.color.hsl;
      1 === r && (r = void 0), this.color = {
        h: t,
        s: e,
        l: i,
        a: r
      };
    }
    setHsl(t) {
      this.isHsl = t;
    }
    okColor() {
      Uo(this.renderRoot, this.color, "colorpicked");
    }
    showCopyDialog() {
      if (this.copied = null, this.dlg = this.dlg ?? this.renderRoot.querySelector("dialog"), this.dlg.open) return this.dlg.classList.remove("open"), this.dlg.close();
      this.dlg.show(), this.dlg.classList.add("open");
    }
    clipboard(t) {
      const e = this.color.toString(t);
      window.navigator.clipboard.writeText(e).then(() => {
        this.hideCopyDialog(e);
      });
    }
    hideCopyDialog(t) {
      if (t) return this.copied = t, setTimeout(() => this.dlg.classList.remove("open"), 400), void setTimeout(() => this.hideCopyDialog(), 1200);
      this.dlg.classList.remove("open"), this.dlg.close(), this.copied = null;
    }
    setSliding({
      detail: t
    }) {
      this.debounceMode = t.sliding;
    }
    render() {
      const t = this.isHsl ? ["h", "s", "l"] : ["h", "s", "v"],
        e = {
          button: !0,
          active: !this.isHsl,
          l: !0
        },
        i = {
          button: !0,
          active: this.isHsl,
          r: !0
        },
        r = {
          backgroundColor: this.color
        },
        n = this.copied ? {
          textAlign: "center",
          display: "block"
        } : {
          display: "none"
        },
        o = this.debounceMode;
      return W` <div class="outer">
      <hue-bar
        @sliding-hue="${this.setSliding}"
        hue="${this.color.hsx ? this.color.hsx.h : this.color.hsl.h}"
        @hue-update="${this.setHue}"
        .color="${this.color}"
      ></hue-bar>
      <div class="d-flex">
        <div class="col w-30">
          ${["r", "g", "b", "a"].map(t => W`
              <color-input-channel
                group="rgb"
                channel="${t}"
                isHsl="${this.isHsl}"
                .color="${this.color}"
                @color-update="${this.updateColor}"
              />
            `)}
          <div class="hex">
            <dialog @blur="${() => this.hideCopyDialog()}" tabindex="0">
              <sub class="copied" style="${An(n)}"
                >copied <em>${this.copied}</em></sub
              >
              ${this.copied ? W`` : W`
                    <a
                      class="copy-item"
                      @click=${t => this.clipboard("hex", t)}
                      id="copyHex"
                    >
                      <input
                        class="form-control"
                        disabled="disabled"
                        value="${this.color.hex}"
                      />
                      <button
                        title="Copy HEX String"
                        class="button"
                        tabindex="0"
                      >
                        ${ko}
                      </button>
                    </a>
                    <a
                      class="copy-item"
                      @click=${t => this.clipboard("css", t)}
                      id="copyRgb"
                    >
                      <input
                        class="form-control"
                        disabled="disabled"
                        value="${this.color.css}"
                      />
                      <button
                        title="Copy RGB String"
                        class="button"
                        tabindex="0"
                      >
                        ${ko}
                      </button>
                    </a>
                    <a
                      class="copy-item"
                      id="copyHsl"
                      @click=${t => this.clipboard(this.color.alpha < 1 ? "hsla" : "hsl", t)}
                    >
                      <input
                        class="form-control"
                        disabled="disabled"
                        value="${this.color.toString(this.color.alpha < 1 ? "hsla" : "hsl")}"
                      />
                      <button
                        title="Copy HSL String"
                        class="button"
                        tabindex="0"
                      >
                        ${ko}
                      </button>
                    </a>
                  `}
            </dialog>
            <label for="hex">#</label>
            <input
              aria-label="Hexadecimal value (editable - accepts any valid color string)"
              @input="${this.setColor}"
              class="form-control"
              id="hex"
              placeholder="Set color"
              value="${this.hex}"
            /><a
              title="Show copy to clipboard menu"
              @click="${this.showCopyDialog}"
              class="button copy"
            >
              ${ko}
              <span>&#11205;</span>
            </a>
          </div>
        </div>
        <div class="col w-30">
          ${t.map(t => W`
              <color-input-channel
                group="hsl"
                channel="${t}"
                .isHsl="${this.isHsl}"
                .color="${this.color}"
                @color-update="${this.updateColor}"
              />
            `)}
          <div class="hsl-mode">
            <a
              title="Use hue / saturation / value (brightness) mode"
              class="${pn(e)}"
              @click="${() => this.setHsl(!1)}"
              >HSV</a
            ><a
              title="Use hue / saturation / luminosity mode"
              class="${pn(i)}"
              @click="${() => this.setHsl(!0)}"
              >HSL</a
            >
          </div>
        </div>
        <div class="w-40">
          <hsl-canvas
            .debounceMode="${o}"
            size="${160}"
            .isHsl="${this.isHsl}"
            .color="${this.color}"
            @color-update="${this.updateColor}"
          ></hsl-canvas>
          <div class="ok">
            <a
              class="button"
              .disabled=${this.buttonDisabled}
              @click="${this.okColor}"
              >OK
              <span class="swatch">
                <span style="${An(r)}"></span>
                <span class="checky"></span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>`;
    }
  }
  window.customElements.get("color-picker") || window.customElements.define("color-picker", qo);
  const Zo = "anycubic_ha_integration",
    Yo = {
      keyframeOptions: {
        duration: 250,
        direction: "alternate",
        easing: "ease-in-out"
      },
      properties: ["height", "opacity", "scale"]
    };
  let Jo = class extends ut {
    constructor() {
      super(...arguments), this.box_id = 0, this.spoolList = [], this.spool_index = -1, this.display_slot = -1, this._isOpen = !1, this._changingSlot = !1, this._colourPresetChange = t => {
        this.color = t.currentTarget.preset, this._elColorPicker && (this._elColorPicker.color = this.color);
      }, this._handleModalEvent = t => {
        var e;
        const i = t;
        i.stopPropagation(), i.detail.modalOpen && (this._isOpen = !0, this.box_id = Number(i.detail.box_id), this.spool_index = Number(i.detail.spool_index), this.display_slot = Number(null !== (e = i.detail.display_slot) && void 0 !== e ? e : this.spool_index + 1), this.material_type = Si(i.detail.material_type), this.color = i.detail.color);
      }, this._handleDropdownEvent = t => {
        const e = t;
        e.stopPropagation(), e.detail.value && (this.material_type = Si(e.detail.value));
      }, this._handleColourEvent = t => {
        const e = t;
        e.stopPropagation(), e.detail.color && (this.color = e.detail.color.rgb);
      }, this._handleColourPickEvent = t => {
        this._handleColourEvent(t), this._changingSlot || this._submitSlotChanges();
      }, this._handleSaveButton = () => {
        this._submitSlotChanges();
      }, this._closeModal = t => {
        t && t.stopPropagation(), this._isOpen = !1, this.spool_index = -1, this.display_slot = -1, this.material_type = void 0, this.color = void 0, this.box_id = 0;
      }, this._cardClick = t => {
        t.stopPropagation();
      };
    }
    async firstUpdated() {
      this.addEventListener("click", t => {
        this._closeModal(t);
      }), this.addEventListener("ac-select-dropdown", this._handleDropdownEvent), this.addEventListener("colorchanged", this._handleColourEvent), this.addEventListener("colorpicked", this._handleColourPickEvent);
    }
    connectedCallback() {
      var t;
      super.connectedCallback(), null === (t = this.parentElement) || void 0 === t || t.addEventListener("ac-mcb-modal", this._handleModalEvent);
    }
    disconnectedCallback() {
      var t;
      null === (t = this.parentElement) || void 0 === t || t.removeEventListener("ac-mcb-modal", this._handleModalEvent), super.disconnectedCallback();
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("language") && (this._heading = an("card.spool_settings.heading", this.language), this._labelSelectMaterial = an("card.spool_settings.label_select_material", this.language), this._labelSelectColour = an("card.spool_settings.label_select_colour", this.language), this._buttonSave = an("common.actions.save", this.language));
    }
    update(t) {
      super.update(t), this._isOpen ? this.style.display = "block" : this.style.display = "none";
    }
    render() {
      return W`
      <div
        class="ac-modal-container"
        style=${An({
        height: "auto",
        opacity: 1,
        scale: 1
      })}
        ${On(Object.assign({}, Yo))}
      >
        <span class="ac-modal-close" @click=${this._closeModal}>&times;</span>
        <div class="ac-modal-card" @click=${this._cardClick}>
          ${this.color ? this._renderCard() : Z}
        </div>
      </div>
    `;
    }
    _renderCard() {
      return this.spool_index >= 0 ? W`
          <div>
            <div class="ac-slot-title">
              ${this._heading}: ${this.display_slot > 0 ? this.display_slot : this.spool_index + 1}
            </div>
            <div>
              <div>
                <p class="ac-modal-label">${this._labelSelectMaterial}:</p>
                <anycubic-ui-select-dropdown
                  .availableOptions=${Ve}
                  .placeholder=${Ve.PLA}
                  .initialItem=${this.material_type}
                ></anycubic-ui-select-dropdown>
              </div>
              ${this._renderPresets()}
              <div>
                <p class="ac-modal-label">${this._labelSelectColour}:</p>
                <color-picker .value=${this.color}></color-picker>
              </div>
            </div>
            <div class="ac-save-settings">
              <ha-control-button
                .disabled=${this._changingSlot}
                @click=${this._handleSaveButton}
              >
                ${this._buttonSave}
              </ha-control-button>
            </div>
          </div>
        ` : Z;
    }
    _renderPresets() {
      return W`
      <div>
        <p class="ac-modal-label">Choose Preset Colour:</p>
        <div class="ac-mcb-presets">
          ${this.slotColors ? zn(this.slotColors, (t, e) => W`
                  <div
                    class="ac-mcb-preset-color"
                    style=${An({
        "background-color": t
      })}
                    .preset=${t}
                    @click=${this._colourPresetChange}
                  >
                    &nbsp;
                  </div>
                `) : Z}
        </div>
      </div>
    `;
    }
    _submitSlotChanges() {
      if (this.selectedPrinterDevice && this.material_type && this.spool_index >= 0 && this.color && this.color.length >= 3) {
        const t = `multi_color_box_set_slot_${this.material_type.toLowerCase()}`;
        this._changingSlot = !0, this.hass.callService(Zo, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          box_id: this.box_id,
          slot_number: this.spool_index + 1,
          slot_color_red: this.color[0],
          slot_color_green: this.color[1],
          slot_color_blue: this.color[2]
        }).then(() => {
          this._changingSlot = !1;
        }).catch(t => {
          this._changingSlot = !1;
        }), this._closeModal();
      }
    }
    static get styles() {
      return p`
      ${ho}

      .ac-slot-title {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
      }

      .ac-mcb-presets {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
      }

      .ac-mcb-preset-color {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        margin: 20px 10px;
      }

      ha-control-button {
        min-width: 150px;
        margin: 30px auto 0px;
        font-size: 14px;
      }

      color-picker {
        --font-fam: var(--token-font-family-primary);
        --bg-color: var(--ha-card-background);
        --label-color: var(--secondary-text-color);
        --form-border-color: var(--ha-card-background);
        --input-active-border-color: var(--primary-color);
        --input-bg: var(--primary-background-color);
        --input-active-bg: var(--ha-card-background);
        --input-color: var(--secondary-text-color);
        --input-active-color: var(--primary-text-color);
        --input-active-box-shadow: 0 2px 5px #ccc;
        --button-active-bg: var(--state-active-color);
        --button-active-color: var(--token-color-icon-primary);
        --outer-box-shadow: 0 4px 12px #111;
      }
    `;
    }
  };
  n([yt("color-picker")], Jo.prototype, "_elColorPicker", void 0), n([bt()], Jo.prototype, "hass", void 0), n([bt()], Jo.prototype, "language", void 0), n([bt({
    attribute: "selected-printer-device"
  })], Jo.prototype, "selectedPrinterDevice", void 0), n([bt({
    attribute: "slot-colors"
  })], Jo.prototype, "slotColors", void 0), n([vt()], Jo.prototype, "box_id", void 0), n([vt()], Jo.prototype, "spoolList", void 0), n([vt()], Jo.prototype, "spool_index", void 0), n([vt()], Jo.prototype, "display_slot", void 0), n([vt()], Jo.prototype, "material_type", void 0), n([vt()], Jo.prototype, "color", void 0), n([vt()], Jo.prototype, "_isOpen", void 0), n([vt()], Jo.prototype, "_heading", void 0), n([vt()], Jo.prototype, "_labelSelectMaterial", void 0), n([vt()], Jo.prototype, "_labelSelectColour", void 0), n([vt()], Jo.prototype, "_buttonSave", void 0), n([vt()], Jo.prototype, "_changingSlot", void 0), Jo = n([Ci("anycubic-printercard-multicolorbox_modal_spool")], Jo);
  const ts = {
    keyframeOptions: {
      duration: 250,
      direction: "alternate",
      easing: "ease-in-out"
    },
    properties: ["height", "opacity", "scale"]
  };
  let es = class extends ut {
    constructor() {
      super(...arguments), this.availableSpeedModes = {}, this.isFDM = !1, this.currentSpeedModeKey = 0, this.currentSpeedModeDescr = void 0, this._userEditSpeedMode = !1, this.currentFanSpeed = 0, this._userEditFanSpeed = !1, this.currentAuxFanSpeed = 0, this._userEditAuxFanSpeed = !1, this.currentBoxFanSpeed = 0, this._userEditBoxFanSpeed = !1, this.currentTargetTempNozzle = 0, this.minTargetTempNozzle = 0, this.maxTargetTempNozzle = 0, this._userEditTargetTempNozzle = !1, this.currentTargetTempHotbed = 0, this.minTargetTempHotbed = 0, this.maxTargetTempHotbed = 0, this._userEditTargetTempHotbed = !1, this._isOpen = !1, this._changingSettings = !1, this._setConfirmationMode = t => {
        this._confirmationType = t.currentTarget.confirmation_type, this._confirmMessage = an("card.print_settings.confirm_message", this.language, "action", an("common.actions." + this._confirmationType, this.language));
      }, this._handleConfirmApprove = () => {
        switch (this._confirmationType) {
          case Xe.PAUSE:
            this._pressHassButton("pause_print");
            break;
          case Xe.RESUME:
            this._pressHassButton("resume_print");
            break;
          case Xe.CANCEL:
            this._pressHassButton("cancel_print");
        }
        this._confirmationType = void 0, this._closeModal();
      }, this._handleConfirmCancel = () => {
        this._confirmationType = void 0;
      }, this._handleFanSpeedChange = t => {
        const e = t.currentTarget.value;
        this.currentFanSpeed = Number(e), this._userEditFanSpeed = !0;
      }, this._handleAuxFanSpeedChange = t => {
        const e = t.currentTarget.value;
        this.currentAuxFanSpeed = Number(e), this._userEditAuxFanSpeed = !0;
      }, this._handleBoxFanSpeedChange = t => {
        const e = t.currentTarget.value;
        this.currentBoxFanSpeed = Number(e), this._userEditBoxFanSpeed = !0;
      }, this._handleFanSpeedKeyDown = t => {
        "Enter" === t.code ? (t.preventDefault(), this._submitChangedFanSpeed()) : this._userEditFanSpeed = !0;
      }, this._handleAuxFanSpeedKeyDown = t => {
        "Enter" === t.code ? (t.preventDefault(), this._submitChangedAuxFanSpeed()) : this._userEditAuxFanSpeed = !0;
      }, this._handleBoxFanSpeedKeyDown = t => {
        "Enter" === t.code ? (t.preventDefault(), this._submitChangedBoxFanSpeed()) : this._userEditBoxFanSpeed = !0;
      }, this._handleTargetTempNozzleChange = t => {
        const e = t.currentTarget.value;
        this.currentTargetTempNozzle = Number(e), this._userEditTargetTempNozzle = !0;
      }, this._handleTargetTempHotbedChange = t => {
        const e = t.currentTarget.value;
        this.currentTargetTempHotbed = Number(e), this._userEditTargetTempHotbed = !0;
      }, this._handleTargetTempNozzleKeyDown = t => {
        "Enter" === t.code ? (t.preventDefault(), this._submitChangedTargetTempNozzle()) : this._userEditTargetTempNozzle = !0;
      }, this._handleTargetTempHotbedKeyDown = t => {
        "Enter" === t.code ? (t.preventDefault(), this._submitChangedTargetTempHotbed()) : this._userEditTargetTempHotbed = !0;
      }, this._handleModalEvent = t => {
        const e = t;
        e.stopPropagation(), e.detail.modalOpen && (this._isOpen = !0, this._resetUserEdits());
      }, this._handleDropdownEvent = t => {
        const e = t;
        e.stopPropagation(), this._userEditSpeedMode = !0, void 0 !== e.detail.key && (this.currentSpeedModeKey = e.detail.key, this.currentSpeedModeDescr = this.currentSpeedModeKey >= 0 && this.currentSpeedModeKey in this.availableSpeedModes ? this.availableSpeedModes[this.currentSpeedModeKey] : void 0);
      }, this._handleSaveFanSpeedButton = () => {
        this._submitChangedFanSpeed(), this._resetUserEdits();
      }, this._handleSaveAuxFanSpeedButton = () => {
        this._submitChangedAuxFanSpeed(), this._resetUserEdits();
      }, this._handleSaveBoxFanSpeedButton = () => {
        this._submitChangedBoxFanSpeed(), this._resetUserEdits();
      }, this._handleSaveSpeedModeButton = () => {
        this._submitChangedSpeedMode(), this._resetUserEdits();
      }, this._handleSaveTargetTempNozzleButton = () => {
        this._submitChangedTargetTempNozzle(), this._resetUserEdits();
      }, this._handleSaveTargetTempHotbedButton = () => {
        this._submitChangedTargetTempHotbed(), this._resetUserEdits();
      }, this._closeModal = t => {
        t && t.stopPropagation(), this._isOpen = !1, this._resetUserEdits();
      }, this._cardClick = t => {
        t.stopPropagation();
      };
    }
    async firstUpdated() {
      this.addEventListener("ac-select-dropdown", this._handleDropdownEvent), this.addEventListener("click", t => {
        this._closeModal(t);
      });
    }
    connectedCallback() {
      var t;
      super.connectedCallback(), null === (t = this.parentElement) || void 0 === t || t.addEventListener("ac-printset-modal", this._handleModalEvent);
    }
    disconnectedCallback() {
      var t;
      null === (t = this.parentElement) || void 0 === t || t.removeEventListener("ac-printset-modal", this._handleModalEvent), super.disconnectedCallback();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("language") && (this._labelNozzleTemperature = an("card.print_settings.label_nozzle_temp", this.language), this._labelHotbedTemperature = an("card.print_settings.label_hotbed_temp", this.language), this._labelFanSpeed = an("card.print_settings.label_fan_speed", this.language), this._labelAuxFanSpeed = an("card.print_settings.label_aux_fan_speed", this.language), this._labelBoxFanSpeed = an("card.print_settings.label_box_fan_speed", this.language), this._buttonYes = an("common.actions.yes", this.language), this._buttonNo = an("common.actions.no", this.language), this._buttonPrintPause = an("card.print_settings.print_pause", this.language), this._buttonPrintResume = an("card.print_settings.print_resume", this.language), this._buttonPrintCancel = an("card.print_settings.print_cancel", this.language), this._buttonSaveSpeedMode = an("card.print_settings.save_speed_mode", this.language), this._buttonSaveTargetNozzle = an("card.print_settings.save_target_nozzle", this.language), this._buttonSaveTargetHotbed = an("card.print_settings.save_target_hotbed", this.language), this._buttonSaveFanSpeed = an("card.print_settings.save_fan_speed", this.language), this._buttonSaveAuxFanSpeed = an("card.print_settings.save_aux_fan_speed", this.language), this._buttonSaveBoxFanSpeed = an("card.print_settings.save_box_fan_speed", this.language)), t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) {
        if (this.isFDM = gi(this.hass, this.printerEntities, this.printerEntityIdPart), this._userEditFanSpeed || (this.currentFanSpeed = Number(ci(this.hass, this.printerEntities, this.printerEntityIdPart, "fan_speed", 0).state)), !this._userEditTargetTempNozzle) {
          const t = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "target_nozzle_temperature", 0, {
            limit_min: 0,
            limit_max: 0
          });
          this.currentTargetTempNozzle = Number(t.state), this.minTargetTempNozzle = t.attributes.limit_min, this.maxTargetTempNozzle = t.attributes.limit_max;
        }
        if (!this._userEditTargetTempHotbed) {
          const t = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "target_hotbed_temperature", 0, {
            limit_min: 0,
            limit_max: 0
          });
          this.currentTargetTempHotbed = Number(t.state), this.minTargetTempHotbed = t.attributes.limit_min, this.maxTargetTempHotbed = t.attributes.limit_max;
        }
        if (!this._userEditSpeedMode) {
          const t = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_speed_mode", "", {
            available_modes: [],
            job_speed_mode_code: -1
          });
          this.availableSpeedModes = Ei(t), this.currentSpeedModeKey = t.attributes.print_speed_mode_code, this.currentSpeedModeDescr = this.currentSpeedModeKey >= 0 && this.currentSpeedModeKey in this.availableSpeedModes ? this.availableSpeedModes[this.currentSpeedModeKey] : void 0;
        }
      }
    }
    update(t) {
      super.update(t), this._isOpen ? this.style.display = "block" : this.style.display = "none";
    }
    render() {
      return W`
      <div
        class="ac-modal-container"
        style=${An({
        height: "auto",
        opacity: 1,
        scale: 1
      })}
        ${On(Object.assign({}, ts))}
      >
        <span class="ac-modal-close" @click=${this._closeModal}>&times;</span>
        <div class="ac-modal-card" @click=${this._cardClick}>
          ${this._renderCard()}
        </div>
      </div>
    `;
    }
    _renderCard() {
      return this._confirmationType ? this._renderConfirm() : this._renderSettings();
    }
    _renderConfirm() {
      return W`
      <div>
        <div class="ac-settings-header">Confirm Action</div>
        <div>
          <div class="ac-confirm-description">${this._confirmMessage}</div>
          <div class="ac-confirm-buttons">
            <ha-control-button
              @click=${this._handleConfirmApprove}
              .disabled=${this._changingSettings}
            >
              ${this._buttonYes}
            </ha-control-button>
            <ha-control-button @click=${this._handleConfirmCancel}>
              ${this._buttonNo}
            </ha-control-button>
          </div>
        </div>
      </div>
    `;
    }
    _renderSettings() {
      return W`
      <div>
        <div class="ac-settings-header">Print Settings</div>
        <div>
          <div class="ac-settings-row ac-settings-buttonrow">
            <ha-control-button
              .confirmation_type=${Xe.PAUSE}
              @click=${this._setConfirmationMode}
            >
              ${this._buttonPrintPause}
            </ha-control-button>
          </div>
          <div class="ac-settings-row ac-settings-buttonrow">
            <ha-control-button
              .confirmation_type=${Xe.RESUME}
              @click=${this._setConfirmationMode}
            >
              ${this._buttonPrintResume}
            </ha-control-button>
          </div>
          <div class="ac-settings-row ac-settings-buttonrow">
            <ha-control-button
              .confirmation_type=${Xe.CANCEL}
              @click=${this._setConfirmationMode}
            >
              ${this._buttonPrintCancel}
            </ha-control-button>
          </div>
          ${this.isFDM ? W`
                <div class="ac-settings-row">
                  <anycubic-ui-select-dropdown
                    .availableOptions=${this.availableSpeedModes}
                    .placeholder=${this.currentSpeedModeDescr}
                    .initialItem=${this.currentSpeedModeDescr}
                  ></anycubic-ui-select-dropdown>
                  <ha-control-button
                    .disabled=${this._changingSettings}
                    @click=${this._handleSaveSpeedModeButton}
                  >
                    ${this._buttonSaveSpeedMode}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row">
                  <ha-textfield
                    .value=${this.currentTargetTempNozzle}
                    .placeholder=${this.currentTargetTempNozzle}
                    .label=${this._labelNozzleTemperature}
                    .type=${"number"}
                    .min=${this.minTargetTempNozzle}
                    .max=${this.maxTargetTempNozzle}
                    @input=${this._handleTargetTempNozzleChange}
                    @keydown=${this._handleTargetTempNozzleKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    .disabled=${this._changingSettings}
                    @click=${this._handleSaveTargetTempNozzleButton}
                  >
                    ${this._buttonSaveTargetNozzle}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row">
                  <ha-textfield
                    .value=${this.currentTargetTempHotbed}
                    .placeholder=${this.currentTargetTempHotbed}
                    .label=${this._labelHotbedTemperature}
                    .type=${"number"}
                    .min=${this.minTargetTempHotbed}
                    .max=${this.maxTargetTempHotbed}
                    @input=${this._handleTargetTempHotbedChange}
                    @keydown=${this._handleTargetTempHotbedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    .disabled=${this._changingSettings}
                    @click=${this._handleSaveTargetTempHotbedButton}
                  >
                    ${this._buttonSaveTargetHotbed}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row">
                  <ha-textfield
                    .value=${this.currentFanSpeed}
                    .placeholder=${this.currentFanSpeed}
                    .label=${this._labelFanSpeed}
                    .type=${"number"}
                    .min=${0}
                    .max=${100}
                    @input=${this._handleFanSpeedChange}
                    @keydown=${this._handleFanSpeedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    .disabled=${this._changingSettings}
                    @click=${this._handleSaveFanSpeedButton}
                  >
                    ${this._buttonSaveFanSpeed}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row ac-disabled-feature">
                  <ha-textfield
                    .value=${this.currentAuxFanSpeed}
                    .placeholder=${this.currentAuxFanSpeed}
                    .label=${this._labelAuxFanSpeed}
                    .type=${"number"}
                    .min=${0}
                    .max=${100}
                    @input=${this._handleAuxFanSpeedChange}
                    @keydown=${this._handleAuxFanSpeedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    .disabled=${this._changingSettings}
                    @click=${this._handleSaveAuxFanSpeedButton}
                  >
                    ${this._buttonSaveAuxFanSpeed}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row ac-disabled-feature">
                  <ha-textfield
                    .value=${this.currentBoxFanSpeed}
                    .placeholder=${this.currentBoxFanSpeed}
                    .label=${this._labelBoxFanSpeed}
                    .type=${"number"}
                    .min=${0}
                    .max=${100}
                    @input=${this._handleBoxFanSpeedChange}
                    @keydown=${this._handleBoxFanSpeedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    .disabled=${this._changingSettings}
                    @click=${this._handleSaveBoxFanSpeedButton}
                  >
                    ${this._buttonSaveBoxFanSpeed}
                  </ha-control-button>
                </div>
              ` : Z}
        </div>
      </div>
    `;
    }
    _pressHassButton(t) {
      this._changingSettings = !0, this.hass.callService("button", "press", {
        entity_id: ni(this.printerEntityIdPart, "button", t)
      }).then(() => {
        this._changingSettings = !1;
      }).catch(t => {
        this._changingSettings = !1;
      });
    }
    _resetUserEdits() {
      this._userEditFanSpeed = !1, this._userEditAuxFanSpeed = !1, this._userEditBoxFanSpeed = !1, this._userEditTargetTempNozzle = !1, this._userEditTargetTempHotbed = !1, this._userEditSpeedMode = !1;
    }
    _submitChangedSpeedMode() {
      if (this._userEditSpeedMode && this.selectedPrinterDevice) {
        const t = "change_print_speed_mode";
        this._changingSettings = !0, this.hass.callService(Zo, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          speed_mode: this.currentSpeedModeKey
        }).then(() => {
          this._changingSettings = !1;
        }).catch(t => {
          this._changingSettings = !1;
        }), this._closeModal();
      }
    }
    _submitChangedFanSpeed() {
      if (this._userEditFanSpeed && this.selectedPrinterDevice) {
        const t = "change_print_fan_speed";
        this._changingSettings = !0, this.hass.callService(Zo, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          speed: this.currentFanSpeed
        }).then(() => {
          this._changingSettings = !1;
        }).catch(t => {
          this._changingSettings = !1;
        }), this._closeModal();
      }
    }
    _submitChangedAuxFanSpeed() {
      if (this._userEditAuxFanSpeed && this.selectedPrinterDevice) {
        const t = "change_print_aux_fan_speed";
        this._changingSettings = !0, this.hass.callService(Zo, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          speed: this.currentAuxFanSpeed
        }).then(() => {
          this._changingSettings = !1;
        }).catch(t => {
          this._changingSettings = !1;
        }), this._closeModal();
      }
    }
    _submitChangedBoxFanSpeed() {
      if (this._userEditBoxFanSpeed && this.selectedPrinterDevice) {
        const t = "change_print_box_fan_speed";
        this._changingSettings = !0, this.hass.callService(Zo, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          speed: this.currentBoxFanSpeed
        }).then(() => {
          this._changingSettings = !1;
        }).catch(t => {
          this._changingSettings = !1;
        }), this._closeModal();
      }
    }
    _submitChangedTargetTempNozzle() {
      if (this._userEditTargetTempNozzle && this.selectedPrinterDevice) {
        const t = "change_print_target_nozzle_temperature";
        this._changingSettings = !0, this.hass.callService(Zo, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          temperature: this.currentTargetTempNozzle
        }).then(() => {
          this._changingSettings = !1;
        }).catch(t => {
          this._changingSettings = !1;
        }), this._closeModal();
      }
    }
    _submitChangedTargetTempHotbed() {
      if (this._userEditTargetTempHotbed && this.selectedPrinterDevice) {
        const t = "change_print_target_hotbed_temperature";
        this._changingSettings = !0, this.hass.callService(Zo, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          temperature: this.currentTargetTempHotbed
        }).then(() => {
          this._changingSettings = !1;
        }).catch(t => {
          this._changingSettings = !1;
        }), this._closeModal();
      }
    }
    static get styles() {
      return p`
      ${ho}

      .ac-settings-header {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
        margin-bottom: 20px;
      }

      .ac-settings-row {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
      }

      .ac-disabled-feature {
        display: none;
      }

      ha-textfield {
        min-width: 150px;
        width: 100%;
      }

      ha-control-button {
        min-width: 150px;
        margin: 8px 0px 0px 8px;
        font-size: 14px;
      }

      .ac-settings-buttonrow ha-control-button {
        min-width: 100%;
        margin: 8px 0px 0px 8px;
        font-size: 14px;
      }

      .ac-confirm-description {
        font-size: 16px;
        text-align: center;
      }

      .ac-confirm-buttons {
        display: flex;
        justify-content: center;
      }

      .ac-confirm-buttons ha-control-button {
        margin: 20px 30px 0px 30px;
      }
    `;
    }
  };
  n([bt()], es.prototype, "hass", void 0), n([bt()], es.prototype, "language", void 0), n([bt({
    attribute: "selected-printer-device"
  })], es.prototype, "selectedPrinterDevice", void 0), n([bt({
    attribute: "printer-entities"
  })], es.prototype, "printerEntities", void 0), n([bt({
    attribute: "printer-entity-id-part"
  })], es.prototype, "printerEntityIdPart", void 0), n([vt()], es.prototype, "availableSpeedModes", void 0), n([vt()], es.prototype, "isFDM", void 0), n([vt()], es.prototype, "currentSpeedModeKey", void 0), n([vt()], es.prototype, "currentSpeedModeDescr", void 0), n([vt()], es.prototype, "_userEditSpeedMode", void 0), n([vt()], es.prototype, "currentFanSpeed", void 0), n([vt()], es.prototype, "_userEditFanSpeed", void 0), n([vt()], es.prototype, "currentAuxFanSpeed", void 0), n([vt()], es.prototype, "_userEditAuxFanSpeed", void 0), n([vt()], es.prototype, "currentBoxFanSpeed", void 0), n([vt()], es.prototype, "_userEditBoxFanSpeed", void 0), n([vt()], es.prototype, "currentTargetTempNozzle", void 0), n([vt()], es.prototype, "minTargetTempNozzle", void 0), n([vt()], es.prototype, "maxTargetTempNozzle", void 0), n([vt()], es.prototype, "_userEditTargetTempNozzle", void 0), n([vt()], es.prototype, "currentTargetTempHotbed", void 0), n([vt()], es.prototype, "minTargetTempHotbed", void 0), n([vt()], es.prototype, "maxTargetTempHotbed", void 0), n([vt()], es.prototype, "_userEditTargetTempHotbed", void 0), n([vt()], es.prototype, "_confirmationType", void 0), n([vt()], es.prototype, "_isOpen", void 0), n([vt()], es.prototype, "_confirmMessage", void 0), n([vt()], es.prototype, "_labelNozzleTemperature", void 0), n([vt()], es.prototype, "_labelHotbedTemperature", void 0), n([vt()], es.prototype, "_labelFanSpeed", void 0), n([vt()], es.prototype, "_labelAuxFanSpeed", void 0), n([vt()], es.prototype, "_labelBoxFanSpeed", void 0), n([vt()], es.prototype, "_buttonYes", void 0), n([vt()], es.prototype, "_buttonNo", void 0), n([vt()], es.prototype, "_buttonPrintPause", void 0), n([vt()], es.prototype, "_buttonPrintResume", void 0), n([vt()], es.prototype, "_buttonPrintCancel", void 0), n([vt()], es.prototype, "_buttonSaveSpeedMode", void 0), n([vt()], es.prototype, "_buttonSaveTargetNozzle", void 0), n([vt()], es.prototype, "_buttonSaveTargetHotbed", void 0), n([vt()], es.prototype, "_buttonSaveFanSpeed", void 0), n([vt()], es.prototype, "_buttonSaveAuxFanSpeed", void 0), n([vt()], es.prototype, "_buttonSaveBoxFanSpeed", void 0), n([vt()], es.prototype, "_changingSettings", void 0), es = n([Ci("anycubic-printercard-printsettings_modal")], es);
  const is = {
      keyframeOptions: {
        duration: 250,
        direction: "normal",
        easing: "ease-in-out"
      },
      properties: ["height", "opacity", "scale"]
    },
    rs = xi();
  let ns = class extends ut {
    constructor() {
      super(...arguments), this.monitoredStats = rs, this.round = !0, this.temperatureUnit = Ne.C, this._showVideo = !1, this.cameraEntityState = void 0, this.isHidden = !1, this.isPrinting = !1, this.hiddenOverride = !1, this.hasColorbox = !1, this.hasSecondaryColorbox = !1, this.hasMaterialRack = !1, this.lightIsOn = !1, this.statusColor = "#ffc107", this.progressPercent = 0, this._togglingLight = !1, this._togglingPower = !1, this._toggleVideo = () => {
        this._showVideo = !(!this.cameraEntityState || this._showVideo);
      }, this._openPrintSettingsModal = () => {
        Ie(this._printerCardContainer, "ac-printset-modal", {
          modalOpen: !0
        });
      }, this._toggleLightEntity = () => {
        this.lightEntityId && (this._togglingLight = !0, this.hass.callService("homeassistant", "toggle", {
          entity_id: this.lightEntityId
        }).then(() => {
          this._togglingLight = !1;
        }).catch(t => {
          this._togglingLight = !1;
        }));
      }, this._togglePowerEntity = () => {
        this.powerEntityId && (this._togglingPower = !0, this.hass.callService("homeassistant", "toggle", {
          entity_id: this.powerEntityId
        }).then(() => {
          this._togglingPower = !1;
        }).catch(t => {
          this._togglingPower = !1;
        }));
      }, this._toggleHiddenOveride = () => {
        this.hiddenOverride = !this.hiddenOverride;
      };
    }
    willUpdate(t) {
      var e, i, r, n;
      if (super.willUpdate(t), t.has("language") && (this._buttonPrintSettings = an("card.buttons.print_settings", this.language)), t.has("monitoredStats") && (this.monitoredStats = (r = this.monitoredStats, n = rs, void 0 === r ? n : r)), t.has("selectedPrinterID") && (this.printerEntities = ii(this.hass, this.selectedPrinterID), this.printerEntityIdPart = si(this.printerEntities)), t.has("hass") || t.has("alwaysShow") || t.has("hiddenOverride") || t.has("selectedPrinterID")) {
        this.progressPercent = this._percentComplete(), this.hasColorbox = "active" === ci(this.hass, this.printerEntities, this.printerEntityIdPart, "ace_spools", "inactive").state, this.hasMaterialRack = "active" === ci(this.hass, this.printerEntities, this.printerEntityIdPart, "material_rack_spools", "inactive").state, this.hasSecondaryColorbox = "active" === ci(this.hass, this.printerEntities, this.printerEntityIdPart, "secondary_multi_color_box_spools", "inactive").state, this.cameraEntityId && (this.cameraEntityState = Je(this.hass, {
          entity_id: this.cameraEntityId
        })), this.lightIsOn = ei(this.hass, {
          entity_id: null !== (e = this.lightEntityId) && void 0 !== e ? e : ""
        }, !0, !1);
        const t = ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_state", "unknown").state.toLowerCase();
        this.isPrinting = bi(t), this.isHidden = !this.alwaysShow && !this.hiddenOverride && !this.isPrinting, this.statusColor = function (t) {
          return "preheating" === t ? "#ffc107" : bi(t) ? "#4caf50" : "unknown" === t ? "#f44336" : "operational" === t || "finished" === t ? "#00bcd4" : "#f44336";
        }(t), this.lightIsOn = ei(this.hass, {
          entity_id: null !== (i = this.lightEntityId) && void 0 !== i ? i : ""
        }, !0, !1);
      }
    }
    render() {
      const t = {
        "ac-hidden": !this._showVideo
      };
      return W`
      <div class="ac-printer-card">
        <div class="ac-printer-card-mainview">
          ${this._renderHeader()} ${this._renderPrinterContainer()}
        </div>
        <anycubic-printercard-camera_view
          class=${pn(t)}
          .showVideo=${this._showVideo}
          .toggleVideo=${this._toggleVideo}
          .cameraEntity=${this.cameraEntityState}
        ></anycubic-printercard-camera_view>
        <anycubic-printercard-multicolorbox_modal_spool
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .slotColors=${this.slotColors}
        ></anycubic-printercard-multicolorbox_modal_spool>
        <anycubic-printercard-printsettings_modal
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
        ></anycubic-printercard-printsettings_modal>
        <anycubic-printercard-multicolorbox_modal_drying
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
        ></anycubic-printercard-multicolorbox_modal_drying>
      </div>
    `;
    }
    _renderHeader() {
      var t;
      const e = {
          "ac-h-justifycenter": !(this.powerEntityId && this.lightEntityId)
        },
        i = {
          "background-color": this.statusColor
        };
      return W`
      <div class="ac-printer-card-header ${pn(e)}">
        ${this.powerEntityId ? W`
              <button
                class="ac-printer-card-button-small"
                .disabled=${this._togglingPower}
                @click=${this._togglePowerEntity}
              >
                <ha-svg-icon .path=${"M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"}></ha-svg-icon>
              </button>
            ` : Z}

        <button
          class="ac-printer-card-button-name"
          @click=${this._toggleHiddenOveride}
        >
          <div
            class="ac-printer-card-header-status-dot"
            style=${An(i)}
          ></div>
          <p class="ac-printer-card-header-status-text">
            ${null === (t = this.selectedPrinterDevice) || void 0 === t ? void 0 : t.name}
          </p>
        </button>
        ${this.lightEntityId ? W`
              <button
                class="ac-printer-card-button-small"
                .disabled=${this._togglingLight}
                @click=${this._toggleLightEntity}
              >
                <ha-svg-icon
                  .path=${this.lightIsOn ? "M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z" : "M12,2C9.76,2 7.78,3.05 6.5,4.68L16.31,14.5C17.94,13.21 19,11.24 19,9A7,7 0 0,0 12,2M3.28,4L2,5.27L5.04,8.3C5,8.53 5,8.76 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H14.73L18.73,22L20,20.72L3.28,4M9,20V21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9Z"}
                ></ha-svg-icon>
              </button>
            ` : Z}
      </div>
    `;
    }
    _renderPrinterContainer() {
      const t = {
          "ac-card-vertical": !!this.vertical
        },
        e = {
          height: this.isHidden ? "1px" : "auto",
          opacity: this.isHidden ? 0 : 1,
          scale: this.isHidden ? 0 : 1
        },
        i = {
          width: this.vertical ? "100%" : this.scaleFactor ? String(50 * this.scaleFactor) + "%" : "50%"
        },
        r = {
          width: this.vertical ? "100%" : this.scaleFactor ? String(50 / this.scaleFactor) + "%" : "50%"
        };
      return W`
      <div
        class="ac-printer-card-infocontainer ${pn(t)}"
        style=${An(e)}
        ${On(Object.assign({}, is))}
      >
        <div
          class="ac-printer-card-info-animcontainer ${pn(t)}"
          style=${An(i)}
        >
          <anycubic-printercard-printer_view
            .hass=${this.hass}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .scaleFactor=${this.scaleFactor}
            .toggleVideo=${this._toggleVideo}
          ></anycubic-printercard-printer_view>
          ${this.vertical ? W`<p class="ac-printer-card-info-vertprog">
                ${this.round ? Math.round(this.progressPercent) : this.progressPercent}%
              </p>` : Z}
        </div>
        <div
          class="ac-printer-card-info-statscontainer ${pn(t)}"
          style=${An(r)}
        >
          <anycubic-printercard-stats-component
            .hass=${this.hass}
            .language=${this.language}
            .monitoredStats=${this.monitoredStats}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .progressPercent=${this.progressPercent}
            .showPercent=${!this.vertical}
            .round=${this.round}
            .use_24hr=${this.use_24hr}
            .temperatureUnit=${this.temperatureUnit}
          ></anycubic-printercard-stats-component>
        </div>
      </div>
      ${this._renderPrintSettingsContainer()}
      ${this._renderMaterialRackContainer()}
      ${this._renderMultiColorBoxContainer()}
      ${this._renderSecondaryMultiColorBoxContainer()}
    `;
    }
    _renderPrintSettingsContainer() {
      const t = {
          "ac-card-vertical": !!this.vertical
        },
        e = {
          height: this.isHidden ? "1px" : "auto",
          opacity: this.isHidden ? 0 : 1,
          scale: this.isHidden ? 0 : 1
        };
      return this.showSettingsButton || this.isPrinting ? W`
          <div
            class="ac-printer-card-infocontainer ${pn(t)}"
            style=${An(e)}
            ${On(Object.assign({}, is))}
          >
            <div
              class="ac-printer-card-settingssection ${pn(t)}"
            >
              <button
                class="ac-printer-card-button-settings"
                @click=${this._openPrintSettingsModal}
              >
                <ha-svg-icon .path=${"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"}></ha-svg-icon>
                ${this._buttonPrintSettings}
              </button>
            </div>
          </div>
        ` : Z;
    }
    _renderMaterialRackContainer() {
      const t = {
          "ac-card-vertical": !!this.vertical
        },
        e = {
          height: this.isHidden ? "1px" : "auto",
          opacity: this.isHidden ? 0 : 1,
          scale: this.isHidden ? 0 : 1
        };
      return this.hasMaterialRack ? W`
          <div
            class="ac-printer-card-infocontainer ${pn(t)}"
            style=${An(e)}
            ${On(Object.assign({}, is))}
          >
            <div class="ac-printer-card-mcbsection ${pn(t)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .spoolsEntityId=${"material_rack_spools"}
                .showControls=${!1}
                .allowSpoolEdit=${!0}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        ` : Z;
    }
    _renderMultiColorBoxContainer() {
      const t = {
          "ac-card-vertical": !!this.vertical
        },
        e = {
          height: this.isHidden ? "1px" : "auto",
          opacity: this.isHidden ? 0 : 1,
          scale: this.isHidden ? 0 : 1
        };
      return this.hasColorbox ? W`
          <div
            class="ac-printer-card-infocontainer ${pn(t)}"
            style=${An(e)}
            ${On(Object.assign({}, is))}
          >
            <div class="ac-printer-card-mcbsection ${pn(t)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .box_id=${0}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        ` : Z;
    }
    _renderSecondaryMultiColorBoxContainer() {
      const t = {
          "ac-card-vertical": !!this.vertical
        },
        e = {
          height: this.isHidden ? "1px" : "auto",
          opacity: this.isHidden ? 0 : 1,
          scale: this.isHidden ? 0 : 1
        };
      return this.hasSecondaryColorbox ? W`
          <div
            class="ac-printer-card-infocontainer ${pn(t)}"
            style=${An(e)}
            ${On(Object.assign({}, is))}
          >
            <div class="ac-printer-card-mcbsection ${pn(t)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .box_id=${1}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        ` : Z;
    }
    _percentComplete() {
      return Number(ci(this.hass, this.printerEntities, this.printerEntityIdPart, "job_progress", -1).state);
    }
    static get styles() {
      return p`
      :host {
        display: block;
      }

      .ac-printer-card {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        box-sizing: border-box;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        margin: 0px;
        box-shadow: var(
          --ha-card-box-shadow,
          0px 2px 1px -1px rgba(0, 0, 0, 0.2),
          0px 1px 1px 0px rgba(0, 0, 0, 0.14),
          0px 1px 3px 0px rgba(0, 0, 0, 0.12)
        );
      }

      .ac-printer-card-mainview {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printer-card-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        justify-content: space-between;
      }

      .ac-h-justifycenter {
        justify-content: center;
      }

      .ac-printer-card-button-small {
        border: none;
        outline: none;
        background-color: transparent;
        width: 32px;
        height: 32px;
        font-size: 22px;
        line-height: 22px;
        box-sizing: border-box;
        padding: 0px;
        margin-right: 24px;
        margin-left: 24px;
        cursor: pointer;
        color: var(--primary-text-color);
      }

      .ac-printer-card-button-settings {
        border: none;
        border-radius: 6px;
        outline: none;
        background-color: transparent;
        font-size: 18px;
        box-sizing: border-box;
        padding: 4px 12px;
        margin-right: 24px;
        margin-left: 24px;
        cursor: pointer;
        color: var(--primary-text-color);
      }

      .ac-printer-card-button-settings:hover {
        background-color: #7f7f7f36;
      }

      .ac-printer-card-button-settings:active {
        background-color: #7f7f7f5e;
      }

      .ac-printer-card-button-name {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: none;
        outline: none;
        background-color: transparent;
        padding: 24px;
      }
      .ac-printer-card-header-status-dot {
        margin: 0px 10px;
        height: 10px;
        width: 10px;
        border-radius: 5px;
        box-sizing: border-box;
      }

      .ac-printer-card-header-status-text {
        font-weight: bold;
        font-size: 22px;
        margin: 0px;
        color: var(--primary-text-color);
      }

      .ac-printer-card-infocontainer {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .ac-printer-card-infocontainer.ac-card-vertical {
        flex-direction: column;
      }

      .ac-printer-card-info-animcontainer {
        box-sizing: border-box;
        padding: 0px 8px 32px 8px;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .ac-printer-card-info-animcontainer.ac-card-vertical {
        width: 100%;
        height: auto;
        padding-left: 64px;
        padding-right: 64px;
      }

      anycubic-printercard-printer_view {
        width: 100%;
        flex-grow: 1;
      }

      .ac-printer-card-info-vertprog {
        width: 50%;
        font-size: 36px;
        text-align: center;
        font-weight: bold;
      }

      anycubic-printercard-printer_view.ac-card-vertical {
        width: auto;
      }

      .ac-printer-card-info-statscontainer {
        box-sizing: border-box;
        padding: 0px 16px 32px 8px;
        width: 50%;
        height: 100%;
      }

      .ac-printer-card-info-statscontainer.ac-card-vertical {
        padding-left: 32px;
        padding-right: 32px;
        width: 100%;
        height: auto;
      }

      .ac-printer-card-mcbsection {
        box-sizing: border-box;
        padding: 6px;
        width: 100%;
        height: 100%;
      }

      .ac-printer-card-mcbsection.ac-card-vertical {
        height: auto;
      }

      .ac-hidden {
        display: none;
      }
    `;
    }
  };
  n([yt(".ac-printer-card")], ns.prototype, "_printerCardContainer", void 0), n([bt()], ns.prototype, "hass", void 0), n([bt()], ns.prototype, "language", void 0), n([bt({
    attribute: "monitored-stats"
  })], ns.prototype, "monitoredStats", void 0), n([bt({
    attribute: "selected-printer-id"
  })], ns.prototype, "selectedPrinterID", void 0), n([bt({
    attribute: "selected-printer-device"
  })], ns.prototype, "selectedPrinterDevice", void 0), n([bt({
    type: Boolean
  })], ns.prototype, "round", void 0), n([bt({
    type: Boolean
  })], ns.prototype, "use_24hr", void 0), n([bt({
    attribute: "show-settings-button",
    type: Boolean
  })], ns.prototype, "showSettingsButton", void 0), n([bt({
    attribute: "always-show",
    type: Boolean
  })], ns.prototype, "alwaysShow", void 0), n([bt({
    attribute: "temperature-unit",
    type: String
  })], ns.prototype, "temperatureUnit", void 0), n([bt({
    attribute: "light-entity-id",
    type: String
  })], ns.prototype, "lightEntityId", void 0), n([bt({
    attribute: "power-entity-id",
    type: String
  })], ns.prototype, "powerEntityId", void 0), n([bt({
    attribute: "camera-entity-id",
    type: String
  })], ns.prototype, "cameraEntityId", void 0), n([bt({
    type: Boolean
  })], ns.prototype, "vertical", void 0), n([bt({
    attribute: "scale-factor"
  })], ns.prototype, "scaleFactor", void 0), n([bt({
    attribute: "slot-colors"
  })], ns.prototype, "slotColors", void 0), n([vt()], ns.prototype, "_showVideo", void 0), n([vt()], ns.prototype, "cameraEntityState", void 0), n([vt()], ns.prototype, "isHidden", void 0), n([vt()], ns.prototype, "isPrinting", void 0), n([vt()], ns.prototype, "hiddenOverride", void 0), n([vt()], ns.prototype, "hasColorbox", void 0), n([vt()], ns.prototype, "hasSecondaryColorbox", void 0), n([vt()], ns.prototype, "hasMaterialRack", void 0), n([vt()], ns.prototype, "lightIsOn", void 0), n([vt()], ns.prototype, "statusColor", void 0), n([vt()], ns.prototype, "printerEntities", void 0), n([vt()], ns.prototype, "printerEntityIdPart", void 0), n([vt()], ns.prototype, "progressPercent", void 0), n([vt()], ns.prototype, "_buttonPrintSettings", void 0), n([vt()], ns.prototype, "_togglingLight", void 0), n([vt()], ns.prototype, "_togglingPower", void 0), ns = n([Ci("anycubic-printercard-card")], ns);
  const os = [...Pi(), je.DryingStatus, je.DryingTime],
    ss = [...xi(), je.PrinterOnline, je.Availability, je.ProjectName, je.CurrentLayer],
    as = Pi(),
    ls = ["printer_name", "printer_id", "printer_mac", "printer_model", "printer_fw_version", "printer_fw_update_available", "printer_online", "printer_available", "curr_nozzle_temp", "curr_hotbed_temp", "target_nozzle_temp", "target_hotbed_temp", "job_state", "job_progress", "ace_fw_version", "ace_fw_update_available", "drying_active", "drying_progress"];
  let hs = class extends ut {
    constructor() {
      super(...arguments), this.isFDM = !1, this.monitoredStats = ss;
    }
    willUpdate(t) {
      var e;
      if (super.willUpdate(t), t.has("language") && (this._statTranslations = ls.reduce((t, e) => (t[e] = an(`panels.main.cards.main.fields.${e}`, this.language), t), {})), t.has("selectedPrinterDevice") && (this.printerID = (e = this.selectedPrinterDevice) ? e.serial_number : void 0, this.printerMAC = function (t) {
        return t && t.connections.length > 0 && t.connections[0].length > 1 ? t.connections[0][1] : null;
      }(this.selectedPrinterDevice)), t.has("selectedPrinterID") && (this.printerEntities = ii(this.hass, this.selectedPrinterID), this.printerEntityIdPart = si(this.printerEntities)), t.has("hass") || t.has("selectedPrinterID")) {
        this.isFDM = gi(this.hass, this.printerEntities, this.printerEntityIdPart), this.printerStateFwUpdateAvailable = ui(this.hass, this.printerEntities, this.printerEntityIdPart, "printer_firmware"), this.printerStateAvailable = pi(this.hass, this.printerEntities, this.printerEntityIdPart, "is_available", "Available", "Busy"), this.printerStateOnline = pi(this.hass, this.printerEntities, this.printerEntityIdPart, "printer_online", "Online", "Offline"), this.printerStateCurrNozzleTemp = di(this.hass, this.printerEntities, this.printerEntityIdPart, "nozzle_temperature"), this.printerStateCurrHotbedTemp = di(this.hass, this.printerEntities, this.printerEntityIdPart, "hotbed_temperature"), this.printerStateTargetNozzleTemp = di(this.hass, this.printerEntities, this.printerEntityIdPart, "target_nozzle_temperature"), this.printerStateTargetHotbedTemp = di(this.hass, this.printerEntities, this.printerEntityIdPart, "target_hotbed_temperature");
        const t = di(this.hass, this.printerEntities, this.printerEntityIdPart, "job_progress");
        this.jobStateProgress = void 0 !== t ? `${t}%` : "0%", this.jobStatePrintState = function (t, e, i, r, n = !1) {
          const o = oi(e, i, "sensor", r);
          if (o) {
            const e = ti(t, o);
            return n ? Ye(e) : e;
          }
        }(this.hass, this.printerEntities, this.printerEntityIdPart, "job_state", !0), this.aceStateFwUpdateAvailable = ui(this.hass, this.printerEntities, this.printerEntityIdPart, "ace_firmware"), this.aceStateDryingActive = pi(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_active", "Drying", "Not Drying"), this.aceStateDryingRemaining = di(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_remaining_time"), this.aceStateDryingTotal = di(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_total_duration"), this.aceDryingProgress = void 0 !== this.aceStateDryingRemaining && void 0 !== this.aceStateDryingTotal ? String((this.aceStateDryingTotal > 0 ? Math.round(1e4 * (1 - this.aceStateDryingRemaining / this.aceStateDryingTotal)) / 100 : 0).toFixed(2)) + "%" : void 0, this.aceStateFwUpdateAvailable ? this.monitoredStats = os : this.isFDM ? this.monitoredStats = as : this.monitoredStats = ss;
      }
    }
    _renderInfoRow(t, e) {
      return W`
      <div class="info-row">
        <span class="info-heading"> ${this._statTranslations[t]}:</span>
        <span class="info-detail">${e}</span>
      </div>
    `;
    }
    _renderOptionalInfoRow(t, e) {
      return void 0 !== e ? this._renderInfoRow(t, e) : null;
    }
    render() {
      var t, e, i, r, n;
      return W`
      <printer-card elevation="2">
        <anycubic-printercard-card
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterID=${this.selectedPrinterID}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .vertical=${null !== (t = this.panel.config.vertical) && void 0 !== t && t}
          .round=${null !== (e = this.panel.config.round) && void 0 !== e && e}
          .use_24hr=${null === (i = this.panel.config.use_24hr) || void 0 === i || i}
          .temperatureUnit=${this.panel.config.temperatureUnit}
          .lightEntityId=${this.panel.config.lightEntityId}
          .powerEntityId=${this.panel.config.powerEntityId}
          .cameraEntityId=${this.panel.config.cameraEntityId}
          .monitoredStats=${null !== (r = this.panel.config.monitoredStats) && void 0 !== r ? r : this.monitoredStats}
          .scaleFactor=${this.panel.config.scaleFactor}
          .slotColors=${this.panel.config.slotColors}
          .showSettingsButton=${null === (n = this.panel.config.showSettingsButton) || void 0 === n || n}
          .alwaysShow=${this.panel.config.alwaysShow}
        ></anycubic-printercard-card>
        <div class="ac-extra-printer-info">
          ${this._renderInfoRow("printer_name", this.selectedPrinterDevice ? this.selectedPrinterDevice.name : null)}
          ${this._renderInfoRow("printer_id", this.printerID)}
          ${this._renderInfoRow("printer_mac", this.printerMAC)}
          ${this._renderInfoRow("printer_model", this.selectedPrinterDevice ? this.selectedPrinterDevice.model : null)}
          ${this._renderInfoRow("printer_fw_version", this.selectedPrinterDevice ? this.selectedPrinterDevice.sw_version : null)}
          ${this._renderInfoRow("printer_fw_update_available", this.printerStateFwUpdateAvailable)}
          ${this._renderInfoRow("printer_online", this.printerStateOnline)}
          ${this._renderInfoRow("printer_available", this.printerStateAvailable)}
          ${this.isFDM ? W`
                ${this._renderInfoRow("curr_nozzle_temp", this.printerStateCurrNozzleTemp)}
                ${this._renderInfoRow("curr_hotbed_temp", this.printerStateCurrHotbedTemp)}
                ${this._renderInfoRow("target_nozzle_temp", this.printerStateTargetNozzleTemp)}
                ${this._renderInfoRow("target_hotbed_temp", this.printerStateTargetHotbedTemp)}
              ` : Z}
          ${this._renderInfoRow("job_state", this.jobStatePrintState)}
          ${this._renderInfoRow("job_progress", this.jobStateProgress)}
          ${this._renderOptionalInfoRow("ace_fw_update_available", this.aceStateFwUpdateAvailable)}
          ${this._renderOptionalInfoRow("drying_active", this.aceStateDryingActive)}
          ${this._renderOptionalInfoRow("drying_progress", this.aceDryingProgress)}
        </div>
      </printer-card>
    `;
    }
    static get styles() {
      return p`
      :host {
        padding: 16px;
        display: block;
      }
      printer-card {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
      }

      anycubic-printercard-card {
        margin: 24px;
      }

      .ac-extra-printer-info {
        padding: 20px 40px;
      }

      .info-row {
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        box-sizing: border-box;
        width: 100%;
      }

      .info-heading {
        margin-right: 10px;
        font-size: 0.85em;
      }

      .info-detail {
        font-weight: 700;
      }
    `;
    }
  };
  n([bt()], hs.prototype, "hass", void 0), n([bt()], hs.prototype, "language", void 0), n([bt({
    type: Boolean,
    reflect: !0
  })], hs.prototype, "narrow", void 0), n([bt()], hs.prototype, "route", void 0), n([bt()], hs.prototype, "panel", void 0), n([bt({
    attribute: "selected-printer-id"
  })], hs.prototype, "selectedPrinterID", void 0), n([bt({
    attribute: "selected-printer-device"
  })], hs.prototype, "selectedPrinterDevice", void 0), n([vt()], hs.prototype, "printerEntities", void 0), n([vt()], hs.prototype, "printerEntityIdPart", void 0), n([vt()], hs.prototype, "printerID", void 0), n([vt()], hs.prototype, "printerMAC", void 0), n([vt()], hs.prototype, "printerStateFwUpdateAvailable", void 0), n([vt()], hs.prototype, "printerStateAvailable", void 0), n([vt()], hs.prototype, "printerStateOnline", void 0), n([vt()], hs.prototype, "printerStateCurrNozzleTemp", void 0), n([vt()], hs.prototype, "printerStateCurrHotbedTemp", void 0), n([vt()], hs.prototype, "printerStateTargetNozzleTemp", void 0), n([vt()], hs.prototype, "printerStateTargetHotbedTemp", void 0), n([vt()], hs.prototype, "jobStateProgress", void 0), n([vt()], hs.prototype, "jobStatePrintState", void 0), n([vt()], hs.prototype, "aceStateFwUpdateAvailable", void 0), n([vt()], hs.prototype, "aceStateDryingActive", void 0), n([vt()], hs.prototype, "aceStateDryingRemaining", void 0), n([vt()], hs.prototype, "aceStateDryingTotal", void 0), n([vt()], hs.prototype, "aceDryingProgress", void 0), n([vt()], hs.prototype, "isFDM", void 0), n([vt()], hs.prototype, "monitoredStats", void 0), n([vt()], hs.prototype, "_statTranslations", void 0), hs = n([Ci("anycubic-view-main")], hs);
  const cs = p`
  :host {
    padding: 16px;
    display: block;
  }

  .files-card {
    padding: 16px;
    display: block;
    font-size: 18px;
    margin: 0 auto;
    text-align: center;
  }

  .files-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
  }

  .file-info {
    display: flex;
    min-height: 20px;
    min-width: 250px;
    border: 2px solid #ccc3;
    border-radius: 16px;
    padding: 16px 32px;
    line-height: 20px;
    text-align: center;
    font-weight: 900;
    margin: 6px;
    width: 100%;
    justify-content: space-between;
  }

  .file-name {
    display: block;
    line-height: 20px;
    text-align: center;
    font-weight: 900;
    margin: 6px;
    word-wrap: break-word;
    max-width: calc(100% - 58px);
  }

  .file-info:hover {
    background-color: #ccc3;
    border-color: #ccc9;
  }

  .file-refresh-button {
    padding: 10px;
    margin-bottom: 20px;
  }

  .file-refresh-icon {
    --mdc-icon-size: 50px;
  }

  .file-delete-button {
    padding: 4px;
    margin-left: 10px;
  }

  .file-delete-icon {
  }

  .no-mqtt-msg {
  }

  @media (max-width: 599px) {
    :host {
      padding: 6px;
    }

    .files-card {
      padding: 0px;
    }

    .file-info {
      padding: 6px 6px;
      margin: 6px 0px;
    }
  }
`;
  class ds extends ut {
    constructor() {
      super(...arguments), this._isRefreshing = !1, this._supportsMQTT = !1, this._httpResponse = !1, this.refreshList = () => {
        this._listRefreshEntity && (this._isRefreshing = !0, this.hass.callService("button", "press", {
          entity_id: this._listRefreshEntity.entity_id
        }).then(() => {
          this._isRefreshing = !1;
        }).catch(t => {
          this._isRefreshing = !1;
        }));
      }, this.deleteFile = t => {};
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("language") && (this._noMqttMessage = an("common.messages.mqtt_unsupported", this.language)), (t.has("hass") || t.has("selectedPrinterID")) && (this.printerEntities = ii(this.hass, this.selectedPrinterID), this.printerEntityIdPart = si(this.printerEntities), this._supportsMQTT = function (t, e, i) {
        const r = Je(t, oi(e, i, "binary_sensor", "mqtt_connection_active"));
        return !!r && !!r.attributes.supports_mqtt_login;
      }(this.hass, this.printerEntities, this.printerEntityIdPart));
    }
    render() {
      return W`
      <div class="files-card" elevation="2">
        <button
          .disabled=${!this._httpResponse && !this._supportsMQTT || this._isRefreshing}
          class="file-refresh-button"
          @click=${this.refreshList}
        >
          <ha-icon
            class="file-refresh-icon"
            icon="mdi:refresh"
          >
          </ha-icon>
        </button>
        ${this._httpResponse || this._supportsMQTT ? Z : W` <div class="no-mqtt-msg">${this._noMqttMessage}</div> `}
        <ul class="files-container">
        ${this._fileArray ? this._fileArray.map(t => W`
                  <li class="file-info">
                    <div class="file-name">${t.name}</div>
                    <button
                      class="file-delete-button"
                      .disabled=${this._isDeleting}
                      .file_info=${t}
                      @click=${this.deleteFile}
                    >
                      <ha-icon
                        class="file-delete-icon"
                        icon="mdi:delete"
                      ></ha-icon>
                    </button>
                  </li>
                `) : null}
      </div>
    `;
    }
    static get styles() {
      return p`
      ${cs}
    `;
    }
  }
  n([bt()], ds.prototype, "hass", void 0), n([bt()], ds.prototype, "language", void 0), n([bt({
    type: Boolean,
    reflect: !0
  })], ds.prototype, "narrow", void 0), n([bt()], ds.prototype, "route", void 0), n([bt()], ds.prototype, "panel", void 0), n([bt({
    attribute: "selected-printer-id"
  })], ds.prototype, "selectedPrinterID", void 0), n([bt({
    attribute: "selected-printer-device"
  })], ds.prototype, "selectedPrinterDevice", void 0), n([vt()], ds.prototype, "printerEntities", void 0), n([vt()], ds.prototype, "printerEntityIdPart", void 0), n([vt()], ds.prototype, "_fileArray", void 0), n([vt()], ds.prototype, "_listRefreshEntity", void 0), n([vt()], ds.prototype, "_isRefreshing", void 0), n([vt()], ds.prototype, "_isDeleting", void 0), n([vt()], ds.prototype, "_noMqttMessage", void 0), n([vt()], ds.prototype, "_supportsMQTT", void 0), n([vt()], ds.prototype, "_httpResponse", void 0);
  let ps = class extends ds {
    constructor() {
      super(...arguments), this._httpResponse = !0, this.deleteFile = t => {
        const e = t.currentTarget.file_info;
        this.selectedPrinterDevice && e.id && (this._isDeleting = !0, this.hass.callService(Zo, "delete_file_cloud", {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          file_id: e.id
        }).then(() => {
          this._isDeleting = !1;
        }).catch(t => {
          this._isDeleting = !1;
        }));
      };
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("hass") || t.has("selectedPrinterID")) {
        const t = Je(this.hass, ri(this.printerEntities, "sensor", "file_list_cloud"));
        this._fileArray = t ? t.attributes.file_info : void 0, this._listRefreshEntity = function (t) {
          return ri(t, "button", "request_file_list_cloud");
        }(this.printerEntities);
      }
    }
  };
  n([vt()], ps.prototype, "_fileArray", void 0), n([vt()], ps.prototype, "_httpResponse", void 0), ps = n([Ci("anycubic-view-files_cloud")], ps);
  let us = class extends ds {
    constructor() {
      super(...arguments), this.deleteFile = t => {
        const e = t.currentTarget.file_info;
        this.selectedPrinterDevice && e.name && (this._isDeleting = !0, this.hass.callService(Zo, "delete_file_local", {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          filename: e.name
        }).then(() => {
          this._isDeleting = !1;
        }).catch(t => {
          this._isDeleting = !1;
        }));
      };
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("hass") || t.has("selectedPrinterID")) {
        const t = Je(this.hass, ri(this.printerEntities, "sensor", "file_list_local"));
        this._fileArray = t ? t.attributes.file_info : void 0, this._listRefreshEntity = function (t) {
          return ri(t, "button", "request_file_list_local");
        }(this.printerEntities);
      }
    }
  };
  us = n([Ci("anycubic-view-files_local")], us);
  let gs = class extends ds {
    constructor() {
      super(...arguments), this.deleteFile = t => {
        const e = t.currentTarget.file_info;
        this.selectedPrinterDevice && e.name && (this._isDeleting = !0, this.hass.callService(Zo, "delete_file_udisk", {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          filename: e.name
        }).then(() => {
          this._isDeleting = !1;
        }).catch(t => {
          this._isDeleting = !1;
        }));
      };
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("hass") || t.has("selectedPrinterID")) {
        const t = Je(this.hass, ri(this.printerEntities, "sensor", "file_list_udisk"));
        this._fileArray = t ? t.attributes.file_info : void 0, this._listRefreshEntity = function (t) {
          return ri(t, "button", "request_file_list_udisk");
        }(this.printerEntities);
      }
    }
  };
  gs = n([Ci("anycubic-view-files_udisk")], gs);
  const As = p`
  :host {
    padding: 16px;
    display: block;
  }
  ac-print-view {
    padding: 16px;
    display: block;
    font-size: 18px;
    max-width: 1024px;
    margin: 0 auto;
  }

  ha-alert {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .print-button {
    margin: auto;
    width: 100px;
    height: 40px;
    display: block;
    margin-top: 20px;
  }
`;
  var ms;
  !function (t) {
    t.Light = "light", t.Medium = "medium", t.Heavy = "heavy";
  }(ms || (ms = {}));
  class bs extends ut {
    constructor() {
      super(...arguments), this._scriptData = {}, this._serviceName = "", this._buttonProgress = !1, this._scriptDataChanged = t => {
        this._scriptData = Object.assign(Object.assign({}, this._scriptData), t.detail.value), this._error = void 0;
      }, this._runScript = t => {
        const e = t.currentTarget;
        this._error = void 0, t.stopPropagation(), this._buttonProgress = !0, ((t = ms.Medium) => {
          const e = new Event("haptic");
          e.detail = t, window && window.dispatchEvent(e);
        })(), this.hass.callService(Zo, this._serviceName, this._scriptData.data).then(() => {
          e.actionSuccess(), this._buttonProgress = !1;
        }).catch(t => {
          this._error = t.message, e.actionError(), this._buttonProgress = !1;
        });
      };
    }
    async firstUpdated() {
      await (async () => {
        var t, e, i, r, n, o, s, a;
        if (customElements.get("ha-service-control")) return;
        const l = document.createElement("partial-panel-resolver").getRoutes([{
          component_name: "developer-tools",
          url_path: "a"
        }]);
        await (null === (i = null === (e = null === (t = null == l ? void 0 : l.routes) || void 0 === t ? void 0 : t.a) || void 0 === e ? void 0 : e.load) || void 0 === i ? void 0 : i.call(e));
        const h = document.createElement("developer-tools-router"),
          c = null === (r = null == h ? void 0 : h.routerOptions) || void 0 === r ? void 0 : r.routes;
        (null == c ? void 0 : c.service) && (await (null === (o = null === (n = null == c ? void 0 : c.service) || void 0 === n ? void 0 : n.load) || void 0 === o ? void 0 : o.call(n))), (null == c ? void 0 : c.action) && (await (null === (a = null === (s = null == c ? void 0 : c.action) || void 0 === s ? void 0 : s.load) || void 0 === a ? void 0 : a.call(s)));
      })();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("language") && (this._buttonPrint = an("common.actions.print", this.language)), t.has("selectedPrinterDevice") && this.selectedPrinterDevice) {
        const t = `${Zo}.${this._serviceName}`;
        this._scriptData = Object.assign(Object.assign({}, this._scriptData), {
          action: t,
          service: t,
          data: Object.assign(Object.assign({}, this._scriptData.data || {}), {
            config_entry: this.selectedPrinterDevice.primary_config_entry,
            device_id: this.selectedPrinterDevice.id
          })
        });
      }
    }
    render() {
      return W`
      <ac-print-view elevation="2">
        <ha-service-control
          hidePicker
          .hass=${this.hass}
          .value=${this._scriptData}
          .showAdvanced=${!0}
          .narrow=${this.narrow}
          @value-changed=${this._scriptDataChanged}
        ></ha-service-control>
        ${void 0 !== this._error ? W`<ha-alert alert-type="error">${this._error}</ha-alert>` : Z}
        <ha-progress-button
          class="print-button"
          raised
          @click=${this._runScript}
          .progress=${this._buttonProgress}
        >
          <ha-svg-icon .path=${"M8,5.14V19.14L19,12.14L8,5.14Z"}></ha-svg-icon>
          ${this._buttonPrint}
        </ha-progress-button>
      </ac-print-view>
    `;
    }
    static get styles() {
      return p`
      ${As}
    `;
    }
  }
  n([bt({
    attribute: !1
  })], bs.prototype, "hass", void 0), n([bt()], bs.prototype, "language", void 0), n([bt({
    type: Boolean,
    reflect: !0
  })], bs.prototype, "narrow", void 0), n([bt()], bs.prototype, "route", void 0), n([bt()], bs.prototype, "panel", void 0), n([bt({
    attribute: "selected-printer-id"
  })], bs.prototype, "selectedPrinterID", void 0), n([bt({
    attribute: "selected-printer-device"
  })], bs.prototype, "selectedPrinterDevice", void 0), n([vt()], bs.prototype, "_scriptData", void 0), n([vt()], bs.prototype, "_error", void 0), n([vt()], bs.prototype, "_serviceName", void 0), n([vt()], bs.prototype, "_buttonPrint", void 0), n([vt()], bs.prototype, "_buttonProgress", void 0);
  let vs = class extends bs {
    constructor() {
      super(...arguments), this._serviceName = "print_and_upload_no_cloud_save";
    }
  };
  n([vt()], vs.prototype, "_serviceName", void 0), vs = n([Ci("anycubic-view-print-no_cloud_save")], vs);
  let fs = class extends bs {
    constructor() {
      super(...arguments), this._serviceName = "print_and_upload_save_in_cloud";
    }
  };
  n([vt()], fs.prototype, "_serviceName", void 0), fs = n([Ci("anycubic-view-print-save_in_cloud")], fs);
  var ys = "0.0.74";
  window.console.info(`%c ANYCUBIC-PANEL %c v${ys} `, "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray"), t.AnycubicCloudPanel = class extends ut {
    constructor() {
      super(...arguments), this.selectedPage = "main", this._handleLocationChange = () => {
        window.location.pathname.includes("anycubic-cloud") && this.requestUpdate();
      }, this._handlePrinterClick = t => {
        ((t, e, i = !1) => {
          const r = `${t.route.prefix}/${e ? `${e}/main` : ""}`;
          i ? history.replaceState(null, "", r) : history.pushState(null, "", r), Ie(window, "location-changed", {
            replace: i
          });
        })(this, t.currentTarget.printer_id), this.requestUpdate();
      }, this.handlePageSelected = t => {
        const e = t.currentTarget.dataset.page;
        e !== mi(this.route) ? (((t, e, i = !1) => {
          const r = t.route.prefix,
            n = Ai(t.route),
            o = `${r}/${n ? `${n}/${e}` : ""}`;
          i ? history.replaceState(null, "", o) : history.pushState(null, "", o), Ie(window, "location-changed", {
            replace: i
          });
        })(this, e), this.requestUpdate()) : scrollTo(0, 0);
      };
    }
    connectedCallback() {
      super.connectedCallback(), window.addEventListener("location-changed", this._handleLocationChange);
    }
    disconnectedCallback() {
      window.removeEventListener("location-changed", this._handleLocationChange), super.disconnectedCallback();
    }
    willUpdate(t) {
      var e, i;
      super.willUpdate(t), t.has("hass") && this.hass.language !== this.language && (this.language = this.hass.language, this._tabMain = an("panels.main.title", this.language), this._tabFilesLocal = an("panels.files_local.title", this.language), this._tabFilesUdisk = an("panels.files_udisk.title", this.language), this._tabFilesCloud = an("panels.files_cloud.title", this.language), this._tabPrintNoSave = an("panels.print_no_cloud_save.title", this.language), this._tabPrintSave = an("panels.print_save_in_cloud.title", this.language), this._tabDebug = an("panels.debug.title", this.language), this._mainTitle = an("title", this.language), this._selectPrinter = an("panels.initial.printer_select", this.language)), t.has("route") && (this.printers = function (t) {
        const e = {};
        for (const i in t.devices) {
          const r = t.devices[i];
          "Anycubic" === r.manufacturer && (e[r.id] = r);
        }
        return e;
      }(this.hass), this.selectedPage = mi(this.route), this.selectedPrinterID = Ai(this.route), this.selectedPrinterDevice = (e = this.printers, i = this.selectedPrinterID, e && i ? e[i] : void 0));
    }
    render() {
      return this.getInitialView();
    }
    renderPrinterPage() {
      return W`
      <div class="header">
        ${this.renderToolbar()}
        <nav class="tabs" role="tablist">
          ${this._renderTab("main", this._tabMain)}
          ${this._renderTab("local-files", this._tabFilesLocal)}
          ${this._renderTab("udisk-files", this._tabFilesUdisk)}
          ${this._renderTab("cloud-files", this._tabFilesCloud)}
          ${this._renderTab("print-no_cloud_save", this._tabPrintNoSave)}
          ${this._renderTab("print-save_in_cloud", this._tabPrintSave)}
          ${null}
        </nav>
      </div>
      <div class="view">${this.getView(this.route)}</div>
    `;
    }
    _renderTab(t, e) {
      return W`
      <button
        class=${this.selectedPage === t ? "tab selected" : "tab"}
        data-page=${t}
        role="tab"
        aria-selected=${this.selectedPage === t ? "true" : "false"}
        @click=${this.handlePageSelected}
      >
        ${e}
      </button>
    `;
    }
    renderToolbar() {
      return W`
      <div class="toolbar">
        <ha-menu-button
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div class="main-title">${this._mainTitle}</div>
        <div class="version">v${ys}</div>
      </div>
    `;
    }
    _getPrinterImage(t) {
      var e, i;
      const r = `${null !== (e = null == t ? void 0 : t.name) && void 0 !== e ? e : ""} ${null !== (i = null == t ? void 0 : t.model) && void 0 !== i ? i : ""}`.toLowerCase();
      return r.includes("kobra x") ? "data:image/webp;base64,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" : r.includes("kobra 3") ? "data:image/webp;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAIAAgADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAor588Z/ELWrrxrqtjbTzWlpp0v2aNIZnQsQTudipGST09APrWH/wAJhr3/AEFb7/wMl/8AiqAPp+ivmJPGniOF1lg1e7WVCGQvcSOuRzgqzEEHoQa9/wDDHiMa54asNTuohaz3EW54s5AOSMg+hxke1AG9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pRQB4X/worV/+g3Y/wDfl/8AGgfArV/+g3Y/9+X/AMa90ooA8M/4UXq3/Qbsf+/L/wCNL/wozV/+g1Y/9+X/AMa9yooA8O/4Ubq//Qasf+/L/wCNL/wo7Vv+g1Zf9+X/AMa9wooA8Q/4Udq3/Qasv+/L/wCNH/Cj9W/6DVl/35f/ABr2+igDxH/hSGrf9Bmy/wC/L/40v/CkNW/6DNl/35f/ABr22igDxL/hSOrf9Bmy/wC/T/40D4I6sCD/AGzZf9+X/wAa9tooA+SdYvbjSNU1TTI1id9Pl8oynJDnOMgdq29DTz9c8Ned863GoQpMjD5XUnkEdMe1ex6z8JvCut6ld389vcxXF2wedoJyodh3xyB+FTaf8MfDunXVlcRrdyPZSiWHzJyQGHQnAGfxoA6i002xsAws7O3tg33vJiCZ+uKtUUUAZd/4b0PVZvO1DR7C6l/vzW6u35kZqp/wg3hT/oW9J/8AARP8K36KAMD/AIQbwn/0Lek/+Aif4Uf8IN4T/wChb0n/AMBE/wAK36KAMD/hBvCf/Qt6T/4CJ/hR/wAIN4T/AOhb0n/wET/Ct+igClp2j6ZpEbR6bp9rZo33hbwqmfrgc1doooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z" : void 0;
    }
    _renderPrinterSelectBox(t) {
      var e, i;
      const r = null === (e = this.printers) || void 0 === e ? void 0 : e[t],
        n = this._getPrinterImage(r);
      return W`<li
      class="printer-select-box"
      .printer_id=${t}
      @click=${this._handlePrinterClick}
    >
      ${n ? W`<img
            class="printer-select-image"
            src=${n}
            alt=""
            loading="lazy"
          />` : W`<div class="printer-select-placeholder"></div>`}
      <div class="printer-select-name">${null !== (i = null == r ? void 0 : r.name) && void 0 !== i ? i : ""}</div>
    </li>`;
    }
    getInitialView() {
      return this.selectedPrinterID ? this.renderPrinterPage() : W`
        <div class="header">${this.renderToolbar()}</div>
        <printer-select elevation="2">
          <p>${this._selectPrinter}</p>
          <ul class="printers-container">
            ${this.printers ? Object.keys(this.printers).map(t => this._renderPrinterSelectBox(t)) : null}
          </ul>
        </printer-select>
      `;
    }
    getView(t) {
      switch (this.selectedPage) {
        case "local-files":
          return W`
          <anycubic-view-files_local
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_local>
        `;
        case "udisk-files":
          return W`
          <anycubic-view-files_udisk
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_udisk>
        `;
        case "cloud-files":
          return W`
          <anycubic-view-files_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_cloud>
        `;
        case "print-no_cloud_save":
          return W`
          <anycubic-view-print-no_cloud_save
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-no_cloud_save>
        `;
        case "print-save_in_cloud":
          return W`
          <anycubic-view-print-save_in_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-save_in_cloud>
        `;
        case "main":
          return W`
          <anycubic-view-main
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-main>
        `;
        case "debug":
          return W`
          <anycubic-view-debug
            .hass=${this.hass}
            .language=${this.language}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .printers=${this.printers}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-debug>
        `;
        default:
          return W`
          <ha-card header="Page not found">
            <div class="card-content">
              The page you are trying to reach cannot be found. Please select a
              page from the menu above to continue.
            </div>
          </ha-card>
        `;
      }
    }
    static get styles() {
      return p`
      :host {
        padding: 16px;
        display: block;
      }
      .header {
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color, white);
        border-bottom: var(--app-header-border-bottom, none);
      }
      .toolbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        font-size: 20px;
        padding: 0 16px;
        font-weight: 400;
        box-sizing: border-box;
      }
      .main-title {
        margin: 0 0 0 24px;
        line-height: 20px;
        flex-grow: 1;
      }
      .tabs {
        margin-left: max(env(safe-area-inset-left), 24px);
        margin-right: max(env(safe-area-inset-right), 24px);
        display: flex;
        align-items: end;
        gap: 18px;
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .tab {
        position: relative;
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        font: inherit;
        font-size: 14px;
        font-weight: 500;
        min-height: 48px;
        padding: 0;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .tab:hover,
      .tab:focus-visible {
        color: var(--primary-text-color);
      }

      .tab.selected {
        color: var(--primary-text-color);
        font-weight: 700;
      }

      .tab.selected::after {
        background: var(--app-header-selection-bar-color, var(--primary-color));
        bottom: 0;
        content: "";
        height: 2px;
        left: 0;
        position: absolute;
        right: 0;
      }

      .version {
        font-size: 14px;
        font-weight: 500;
        color: rgba(var(--rgb-text-primary-color), 0.9);
      }

      printer-select {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 1024px;
        margin: 0 auto;
      }

      .view {
        height: calc(100vh - 112px);
        display: flex;
        justify-content: center;
      }

      .view > * {
        min-width: 600px;
        max-width: 1024px;
      }

      .view > *:last-child {
        margin-bottom: 20px;
      }

      .ac_wide_view {
        width: 100%;
      }

      .printers-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 16px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .printer-select-box {
        cursor: pointer;
        display: grid;
        grid-template-rows: 150px auto;
        gap: 12px;
        min-height: 218px;
        min-width: 250px;
        max-width: 280px;
        border: 2px solid #ccc3;
        border-radius: 16px;
        padding: 16px;
        text-align: center;
        font-weight: 900;
        box-sizing: border-box;
        overflow: hidden;
      }

      .printer-select-box:hover {
        background-color: #ccc3;
        border-color: #ccc9;
      }

      .printer-select-image,
      .printer-select-placeholder {
        width: 100%;
        height: 150px;
        border-radius: 10px;
      }

      .printer-select-image {
        display: block;
        object-fit: contain;
        background: #fff;
      }

      .printer-select-placeholder {
        background: rgba(var(--rgb-primary-text-color), 0.08);
      }

      .printer-select-name {
        align-self: center;
        line-height: 1.25;
        overflow-wrap: anywhere;
      }
      @media (max-width: 599px) {
        .view > * {
          min-width: 100%;
          max-width: 100%;
        }

        .printer-select-box {
          width: 100%;
          max-width: 320px;
        }
      }
    `;
    }
  }, n([bt()], t.AnycubicCloudPanel.prototype, "hass", void 0), n([bt({
    type: Boolean,
    reflect: !0
  })], t.AnycubicCloudPanel.prototype, "narrow", void 0), n([bt()], t.AnycubicCloudPanel.prototype, "route", void 0), n([bt()], t.AnycubicCloudPanel.prototype, "panel", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "printers", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "selectedPage", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "selectedPrinterID", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "selectedPrinterDevice", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "language", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "_tabMain", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "_tabFilesLocal", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "_tabFilesUdisk", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "_tabFilesCloud", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "_tabPrintNoSave", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "_tabPrintSave", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "_tabDebug", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "_mainTitle", void 0), n([vt()], t.AnycubicCloudPanel.prototype, "_selectPrinter", void 0), t.AnycubicCloudPanel = n([Ci("anycubic-cloud-panel")], t.AnycubicCloudPanel), Object.defineProperty(t, "__esModule", {
    value: !0
  });
}({});
