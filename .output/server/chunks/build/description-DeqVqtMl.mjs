import * as e from 'vue';
import { cloneVNode, h, defineComponent, ref, computed, provide, Fragment, onMounted, onUnmounted, unref, inject } from 'vue';

var r;
let n = Symbol("headlessui.useid"), o$2 = 0;
const i = (r = e.useId) != null ? r : function() {
  return e.inject(n, () => `${++o$2}`)();
};
function o$1(e2) {
  var l;
  if (e2 == null || e2.value == null) return null;
  let n2 = (l = e2.value.$el) != null ? l : e2.value;
  return n2 instanceof Node ? n2 : null;
}
function u$2(r2, n2, ...a) {
  if (r2 in n2) {
    let e2 = n2[r2];
    return typeof e2 == "function" ? e2(...a) : e2;
  }
  let t = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t, u$2), t;
}
var N = ((o2) => (o2[o2.None = 0] = "None", o2[o2.RenderStrategy = 1] = "RenderStrategy", o2[o2.Static = 2] = "Static", o2))(N || {}), S = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(S || {});
function A({ visible: r2 = true, features: t = 0, ourProps: e2, theirProps: o2, ...i2 }) {
  var a;
  let n2 = j(o2, e2), l = Object.assign(i2, { props: n2 });
  if (r2 || t & 2 && n2.static) return y(l);
  if (t & 1) {
    let d = (a = n2.unmount) == null || a ? 0 : 1;
    return u$2(d, { [0]() {
      return null;
    }, [1]() {
      return y({ ...i2, props: { ...n2, hidden: true, style: { display: "none" } } });
    } });
  }
  return y(l);
}
function y({ props: r2, attrs: t, slots: e2, slot: o2, name: i2 }) {
  var m, h$1;
  let { as: n2, ...l } = T(r2, ["unmount", "static"]), a = (m = e2.default) == null ? void 0 : m.call(e2, o2), d = {};
  if (o2) {
    let u2 = false, c = [];
    for (let [p, f2] of Object.entries(o2)) typeof f2 == "boolean" && (u2 = true), f2 === true && c.push(p);
    u2 && (d["data-headlessui-state"] = c.join(" "));
  }
  if (n2 === "template") {
    if (a = b(a != null ? a : []), Object.keys(l).length > 0 || Object.keys(t).length > 0) {
      let [u2, ...c] = a != null ? a : [];
      if (!v(u2) || c.length > 0) throw new Error(['Passing props on "template"!', "", `The current component <${i2} /> is rendering a "template".`, "However we need to passthrough the following props:", Object.keys(l).concat(Object.keys(t)).map((s) => s.trim()).filter((s, g, R) => R.indexOf(s) === g).sort((s, g) => s.localeCompare(g)).map((s) => `  - ${s}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', "Render a single element as the child so that we can forward the props onto that element."].map((s) => `  - ${s}`).join(`
`)].join(`
`));
      let p = j((h$1 = u2.props) != null ? h$1 : {}, l, d), f2 = cloneVNode(u2, p, true);
      for (let s in p) s.startsWith("on") && (f2.props || (f2.props = {}), f2.props[s] = p[s]);
      return f2;
    }
    return Array.isArray(a) && a.length === 1 ? a[0] : a;
  }
  return h(n2, Object.assign({}, l, d), { default: () => a });
}
function b(r2) {
  return r2.flatMap((t) => t.type === Fragment ? b(t.children) : [t]);
}
function j(...r2) {
  if (r2.length === 0) return {};
  if (r2.length === 1) return r2[0];
  let t = {}, e2 = {};
  for (let i2 of r2) for (let n2 in i2) n2.startsWith("on") && typeof i2[n2] == "function" ? (e2[n2] != null || (e2[n2] = []), e2[n2].push(i2[n2])) : t[n2] = i2[n2];
  if (t.disabled || t["aria-disabled"]) return Object.assign(t, Object.fromEntries(Object.keys(e2).map((i2) => [i2, void 0])));
  for (let i2 in e2) Object.assign(t, { [i2](n2, ...l) {
    let a = e2[i2];
    for (let d of a) {
      if (n2 instanceof Event && n2.defaultPrevented) return;
      d(n2, ...l);
    }
  } });
  return t;
}
function E(r2) {
  let t = Object.assign({}, r2);
  for (let e2 in t) t[e2] === void 0 && delete t[e2];
  return t;
}
function T(r2, t = []) {
  let e2 = Object.assign({}, r2);
  for (let o2 of t) o2 in e2 && delete e2[o2];
  return e2;
}
function v(r2) {
  return r2 == null ? false : typeof r2.type == "string" || typeof r2.type == "object" || typeof r2.type == "function";
}
var u$1 = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(u$1 || {});
let f = defineComponent({ name: "Hidden", props: { as: { type: [Object, String], default: "div" }, features: { type: Number, default: 1 } }, setup(t, { slots: n2, attrs: i2 }) {
  return () => {
    var r2;
    let { features: e2, ...d } = t, o2 = { "aria-hidden": (e2 & 2) === 2 ? true : (r2 = d["aria-hidden"]) != null ? r2 : void 0, hidden: (e2 & 4) === 4 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(e2 & 4) === 4 && (e2 & 2) !== 2 && { display: "none" } } };
    return A({ ourProps: o2, theirProps: d, slot: {}, attrs: i2, slots: n2, name: "Hidden" });
  };
} });
var o = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o || {});
let u = Symbol("DescriptionContext");
function w() {
  let t = inject(u, null);
  if (t === null) throw new Error("Missing parent");
  return t;
}
function k({ slot: t = ref({}), name: o2 = "Description", props: s = {} } = {}) {
  let e2 = ref([]);
  function r2(n2) {
    return e2.value.push(n2), () => {
      let i2 = e2.value.indexOf(n2);
      i2 !== -1 && e2.value.splice(i2, 1);
    };
  }
  return provide(u, { register: r2, slot: t, name: o2, props: s }), computed(() => e2.value.length > 0 ? e2.value.join(" ") : void 0);
}
defineComponent({ name: "Description", props: { as: { type: [Object, String], default: "p" }, id: { type: String, default: null } }, setup(t, { attrs: o2, slots: s }) {
  var n2;
  let e2 = (n2 = t.id) != null ? n2 : `headlessui-description-${i()}`, r2 = w();
  return onMounted(() => onUnmounted(r2.register(e2))), () => {
    let { name: i2 = "Description", slot: l = ref({}), props: d = {} } = r2, { ...c } = t, f2 = { ...Object.entries(d).reduce((a, [g, m]) => Object.assign(a, { [g]: unref(m) }), {}), id: e2 };
    return A({ ourProps: f2, theirProps: c, slot: l.value, attrs: o2, slots: s, name: i2 });
  };
} });

export { A, E, N, S, T, o as a, u$2 as b, f, i, k, o$1 as o, u$1 as u };
//# sourceMappingURL=description-DeqVqtMl.mjs.map
