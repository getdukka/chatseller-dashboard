import { defineComponent, ref, reactive, mergeProps, createVNode, resolveDynamicComponent, unref, computed, withCtx, toDisplayString, inject, onMounted, watch, h, Fragment, onUnmounted, provide, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { i, o as o$1, A, f, E as E$1, T, a as o, k, u as u$1 } from './description-DeqVqtMl.mjs';
import { s } from './use-resolve-button-type-DvynZEma.mjs';
import { UserIcon, CogIcon, CodeBracketIcon, BellIcon, PhotoIcon, TrashIcon, PlusIcon, ClipboardIcon, PaperAirplaneIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { u as useAuth } from './useAuth-CgRQXKMP.mjs';
import { u as useSeoMeta } from './v3-D4nZQNuc.mjs';
import '@supabase/functions-js';
import '@supabase/postgrest-js';
import '@supabase/realtime-js';
import '@supabase/storage-js';
import '@supabase/node-fetch';
import '@supabase/auth-js';
import './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

function d$1(u2, e, r) {
  let i2 = ref(r == null ? void 0 : r.value), f2 = computed(() => u2.value !== void 0);
  return [computed(() => f2.value ? u2.value : i2.value), function(t) {
    return f2.value || (i2.value = t), e == null ? void 0 : e(t);
  }];
}
function p(i2) {
  var t, r;
  let s2 = (t = i2 == null ? void 0 : i2.form) != null ? t : i2.closest("form");
  if (s2) {
    for (let n of s2.elements) if (n !== i2 && (n.tagName === "INPUT" && n.type === "submit" || n.tagName === "BUTTON" && n.type === "submit" || n.nodeName === "INPUT" && n.type === "image")) {
      n.click();
      return;
    }
    (r = s2.requestSubmit) == null || r.call(s2);
  }
}
let a = Symbol("LabelContext");
function d() {
  let t = inject(a, null);
  if (t === null) {
    let n = new Error("You used a <Label /> component, but it is not inside a parent.");
    throw Error.captureStackTrace && Error.captureStackTrace(n, d), n;
  }
  return t;
}
function E({ slot: t = {}, name: n = "Label", props: i2 = {} } = {}) {
  let e = ref([]);
  function o2(r) {
    return e.value.push(r), () => {
      let l = e.value.indexOf(r);
      l !== -1 && e.value.splice(l, 1);
    };
  }
  return provide(a, { register: o2, slot: t, name: n, props: i2 }), computed(() => e.value.length > 0 ? e.value.join(" ") : void 0);
}
defineComponent({ name: "Label", props: { as: { type: [Object, String], default: "label" }, passive: { type: [Boolean], default: false }, id: { type: String, default: null } }, setup(t, { slots: n, attrs: i$1 }) {
  var r;
  let e = (r = t.id) != null ? r : `headlessui-label-${i()}`, o2 = d();
  return onMounted(() => onUnmounted(o2.register(e))), () => {
    let { name: l = "Label", slot: p2 = {}, props: c = {} } = o2, { passive: f2, ...s2 } = t, u2 = { ...Object.entries(c).reduce((b, [g, m]) => Object.assign(b, { [g]: unref(m) }), {}), id: e };
    return f2 && (delete u2.onClick, delete u2.htmlFor, delete s2.onClick), A({ ourProps: u2, theirProps: s2, slot: p2, attrs: i$1, slots: n, name: l });
  };
} });
let C = Symbol("GroupContext");
defineComponent({ name: "SwitchGroup", props: { as: { type: [Object, String], default: "template" } }, setup(l, { slots: c, attrs: i2 }) {
  let r = ref(null), f2 = E({ name: "SwitchLabel", props: { htmlFor: computed(() => {
    var t;
    return (t = r.value) == null ? void 0 : t.id;
  }), onClick(t) {
    r.value && (t.currentTarget.tagName === "LABEL" && t.preventDefault(), r.value.click(), r.value.focus({ preventScroll: true }));
  } } }), p2 = k({ name: "SwitchDescription" });
  return provide(C, { switchRef: r, labelledby: f2, describedby: p2 }), () => A({ theirProps: l, ourProps: {}, slot: {}, slots: c, attrs: i2, name: "SwitchGroup" });
} });
let ue = defineComponent({ name: "Switch", emits: { "update:modelValue": (l) => true }, props: { as: { type: [Object, String], default: "button" }, modelValue: { type: Boolean, default: void 0 }, defaultChecked: { type: Boolean, optional: true }, form: { type: String, optional: true }, name: { type: String, optional: true }, value: { type: String, optional: true }, id: { type: String, default: null }, disabled: { type: Boolean, default: false }, tabIndex: { type: Number, default: 0 } }, inheritAttrs: false, setup(l, { emit: c, attrs: i$1, slots: r, expose: f$1 }) {
  var h$1;
  let p$1 = (h$1 = l.id) != null ? h$1 : `headlessui-switch-${i()}`, n = inject(C, null), [t, s$1] = d$1(computed(() => l.modelValue), (e) => c("update:modelValue", e), computed(() => l.defaultChecked));
  function m() {
    s$1(!t.value);
  }
  let E2 = ref(null), o$2 = n === null ? E2 : n.switchRef, L = s(computed(() => ({ as: l.as, type: i$1.type })), o$2);
  f$1({ el: o$2, $el: o$2 });
  function D(e) {
    e.preventDefault(), m();
  }
  function R(e) {
    e.key === o.Space ? (e.preventDefault(), m()) : e.key === o.Enter && p(e.currentTarget);
  }
  function x(e) {
    e.preventDefault();
  }
  let d2 = computed(() => {
    var e, a2;
    return (a2 = (e = o$1(o$2)) == null ? void 0 : e.closest) == null ? void 0 : a2.call(e, "form");
  });
  return onMounted(() => {
    watch([d2], () => {
      if (!d2.value || l.defaultChecked === void 0) return;
      function e() {
        s$1(l.defaultChecked);
      }
      return d2.value.addEventListener("reset", e), () => {
        var a2;
        (a2 = d2.value) == null || a2.removeEventListener("reset", e);
      };
    }, { immediate: true });
  }), () => {
    let { name: e, value: a2, form: K, tabIndex: y, ...b } = l, T$1 = { checked: t.value }, B = { id: p$1, ref: o$2, role: "switch", type: L.value, tabIndex: y === -1 ? 0 : y, "aria-checked": t.value, "aria-labelledby": n == null ? void 0 : n.labelledby.value, "aria-describedby": n == null ? void 0 : n.describedby.value, onClick: D, onKeyup: R, onKeypress: x };
    return h(Fragment, [e != null && t.value != null ? h(f, E$1({ features: u$1.Hidden, as: "input", type: "checkbox", hidden: true, readOnly: true, checked: t.value, form: K, disabled: b.disabled, name: e, value: a2 })) : null, A({ ourProps: B, theirProps: { ...i$1, ...T(b, ["modelValue", "defaultChecked"]) }, slot: T$1, attrs: i$1, slots: r, name: "Switch" })]);
  };
} });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ToggleSwitch",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    label: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const enabled = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ue), mergeProps({
        modelValue: enabled.value,
        "onUpdate:modelValue": ($event) => enabled.value = $event,
        class: [
          enabled.value ? "bg-blue-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        ]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="sr-only"${_scopeId}>${ssrInterpolate(_ctx.label)}</span><span class="${ssrRenderClass([
              enabled.value ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            ])}"${_scopeId}></span>`);
          } else {
            return [
              createVNode("span", { class: "sr-only" }, toDisplayString(_ctx.label), 1),
              createVNode("span", {
                class: [
                  enabled.value ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                ]
              }, null, 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ToggleSwitch.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const { userProfile } = useAuth();
    const activeTab = ref("agent");
    const saving = ref(false);
    const tabs = [
      { id: "agent", name: "Agent IA", icon: UserIcon },
      { id: "widget", name: "Widget", icon: CogIcon },
      { id: "integrations", name: "Int\xE9grations", icon: CodeBracketIcon },
      { id: "notifications", name: "Notifications", icon: BellIcon }
    ];
    const agentConfig = reactive({
      name: "Sophie",
      avatarUrl: "",
      welcomeMessage: "Bonjour ! Je suis Sophie, votre assistante virtuelle. Comment puis-je vous aider \xE0 trouver le produit parfait ?",
      language: "fr",
      responseStyle: "friendly",
      responseLength: "medium",
      proactiveMode: true,
      upsellEnabled: true,
      emailCollection: true
    });
    const widgetConfig = reactive({
      buttonText: "Parler \xE0 la vendeuse",
      primaryColor: "#ec4899",
      buttonPosition: "above-cart",
      buttonSize: "medium",
      quickButtons: [
        { text: "Je veux l'acheter maintenant" },
        { text: "J'ai des questions \xE0 poser" },
        { text: "Je veux en savoir plus" }
      ]
    });
    const integrationConfig = reactive({
      platform: "custom"
    });
    const notificationConfig = reactive({
      newConversations: true,
      newOrders: true,
      dailyReport: false,
      weeklyReport: true
    });
    useSeoMeta({
      title: "Configuration - ChatSeller",
      description: "Configurez votre Agent IA Commercial et personnalisez le widget"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_ToggleSwitch = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><div class="bg-white rounded-xl border border-gray-200 shadow-sm"><div class="border-b border-gray-200"><nav class="-mb-px flex space-x-8 px-6"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([
          activeTab.value === tab.id ? "border-blue-500 text-blue-600 bg-blue-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
          "flex items-center py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg"
        ])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "h-5 w-5 mr-2" }, null), _parent);
        _push(` ${ssrInterpolate(tab.name)}</button>`);
      });
      _push(`<!--]--></nav></div></div><div class="grid grid-cols-1 xl:grid-cols-3 gap-8"><div class="xl:col-span-2 space-y-8"><div style="${ssrRenderStyle(activeTab.value === "agent" ? null : { display: "none" })}" class="space-y-8"><div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"><h3 class="text-xl font-bold text-gray-900 mb-6">Apparence de l&#39;agent</h3><div class="space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Nom de l&#39;agent </label><input${ssrRenderAttr("value", agentConfig.name)} type="text" placeholder="ex: Sophie, Marc, A\xEFcha..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"><p class="text-xs text-gray-500 mt-2"> Le nom affich\xE9 dans le chat </p></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Avatar de l&#39;agent </label><div class="flex items-center space-x-6"><div class="flex-shrink-0"><img${ssrRenderAttr("src", agentConfig.avatarUrl || "/default-agent.png")}${ssrRenderAttr("alt", agentConfig.name)} class="h-20 w-20 rounded-full object-cover border-4 border-gray-200 shadow-sm"></div><div class="flex-1"><button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(PhotoIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
      _push(` Changer l&#39;avatar </button><p class="text-xs text-gray-500 mt-2"> JPG, PNG max 2MB </p></div></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Message de bienvenue </label><textarea rows="4" placeholder="Bonjour ! Je suis Sophie, votre assistante virtuelle. Comment puis-je vous aider \xE0 trouver le produit parfait ?" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">${ssrInterpolate(agentConfig.welcomeMessage)}</textarea><p class="text-xs text-gray-500 mt-2"> Premier message affich\xE9 aux visiteurs </p></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Langue principale </label><select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"><option value="fr"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.language) ? ssrLooseContain(agentConfig.language, "fr") : ssrLooseEqual(agentConfig.language, "fr")) ? " selected" : ""}>Fran\xE7ais</option><option value="en"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.language) ? ssrLooseContain(agentConfig.language, "en") : ssrLooseEqual(agentConfig.language, "en")) ? " selected" : ""}>English</option><option value="pt"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.language) ? ssrLooseContain(agentConfig.language, "pt") : ssrLooseEqual(agentConfig.language, "pt")) ? " selected" : ""}>Portugu\xEAs</option></select></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"><h3 class="text-xl font-bold text-gray-900 mb-6">Comportement de l&#39;agent</h3><div class="space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Style de r\xE9ponse </label><select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"><option value="friendly"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.responseStyle) ? ssrLooseContain(agentConfig.responseStyle, "friendly") : ssrLooseEqual(agentConfig.responseStyle, "friendly")) ? " selected" : ""}>Amical et d\xE9contract\xE9</option><option value="professional"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.responseStyle) ? ssrLooseContain(agentConfig.responseStyle, "professional") : ssrLooseEqual(agentConfig.responseStyle, "professional")) ? " selected" : ""}>Professionnel</option><option value="expert"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.responseStyle) ? ssrLooseContain(agentConfig.responseStyle, "expert") : ssrLooseEqual(agentConfig.responseStyle, "expert")) ? " selected" : ""}>Expert technique</option><option value="enthusiastic"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.responseStyle) ? ssrLooseContain(agentConfig.responseStyle, "enthusiastic") : ssrLooseEqual(agentConfig.responseStyle, "enthusiastic")) ? " selected" : ""}>Enthousiaste</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Longueur des r\xE9ponses </label><select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"><option value="short"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.responseLength) ? ssrLooseContain(agentConfig.responseLength, "short") : ssrLooseEqual(agentConfig.responseLength, "short")) ? " selected" : ""}>Courtes</option><option value="medium"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.responseLength) ? ssrLooseContain(agentConfig.responseLength, "medium") : ssrLooseEqual(agentConfig.responseLength, "medium")) ? " selected" : ""}>Moyennes</option><option value="long"${ssrIncludeBooleanAttr(Array.isArray(agentConfig.responseLength) ? ssrLooseContain(agentConfig.responseLength, "long") : ssrLooseEqual(agentConfig.responseLength, "long")) ? " selected" : ""}>D\xE9taill\xE9es</option></select></div><div class="space-y-4"><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="text-sm font-medium text-gray-700">Mode proactif</label><p class="text-xs text-gray-500">L&#39;agent propose des produits sans attendre qu&#39;on lui demande</p></div>`);
      _push(ssrRenderComponent(_component_ToggleSwitch, {
        modelValue: agentConfig.proactiveMode,
        "onUpdate:modelValue": ($event) => agentConfig.proactiveMode = $event
      }, null, _parent));
      _push(`</div><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="text-sm font-medium text-gray-700">Vente additionnelle automatique</label><p class="text-xs text-gray-500">L&#39;agent propose des produits compl\xE9mentaires</p></div>`);
      _push(ssrRenderComponent(_component_ToggleSwitch, {
        modelValue: agentConfig.upsellEnabled,
        "onUpdate:modelValue": ($event) => agentConfig.upsellEnabled = $event
      }, null, _parent));
      _push(`</div><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="text-sm font-medium text-gray-700">Collecte d&#39;email automatique</label><p class="text-xs text-gray-500">Demander l&#39;email avant de finaliser une commande</p></div>`);
      _push(ssrRenderComponent(_component_ToggleSwitch, {
        modelValue: agentConfig.emailCollection,
        "onUpdate:modelValue": ($event) => agentConfig.emailCollection = $event
      }, null, _parent));
      _push(`</div></div></div></div></div><div style="${ssrRenderStyle(activeTab.value === "widget" ? null : { display: "none" })}" class="space-y-8"><div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"><h3 class="text-xl font-bold text-gray-900 mb-6">Apparence du widget</h3><div class="space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Texte du bouton </label><input${ssrRenderAttr("value", widgetConfig.buttonText)} type="text" placeholder="Parler \xE0 la vendeuse" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Couleur principale </label><div class="flex items-center space-x-4"><input${ssrRenderAttr("value", widgetConfig.primaryColor)} type="color" class="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"><input${ssrRenderAttr("value", widgetConfig.primaryColor)} type="text" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-3"> Position du bouton </label><div class="grid grid-cols-2 gap-4"><label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"><input${ssrIncludeBooleanAttr(ssrLooseEqual(widgetConfig.buttonPosition, "above-cart")) ? " checked" : ""} type="radio" value="above-cart" class="text-blue-600 focus:ring-blue-500"><span class="ml-3 text-sm">Au-dessus du panier</span></label><label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"><input${ssrIncludeBooleanAttr(ssrLooseEqual(widgetConfig.buttonPosition, "below-cart")) ? " checked" : ""} type="radio" value="below-cart" class="text-blue-600 focus:ring-blue-500"><span class="ml-3 text-sm">En-dessous du panier</span></label></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Taille du bouton </label><select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"><option value="small"${ssrIncludeBooleanAttr(Array.isArray(widgetConfig.buttonSize) ? ssrLooseContain(widgetConfig.buttonSize, "small") : ssrLooseEqual(widgetConfig.buttonSize, "small")) ? " selected" : ""}>Petit</option><option value="medium"${ssrIncludeBooleanAttr(Array.isArray(widgetConfig.buttonSize) ? ssrLooseContain(widgetConfig.buttonSize, "medium") : ssrLooseEqual(widgetConfig.buttonSize, "medium")) ? " selected" : ""}>Moyen</option><option value="large"${ssrIncludeBooleanAttr(Array.isArray(widgetConfig.buttonSize) ? ssrLooseContain(widgetConfig.buttonSize, "large") : ssrLooseEqual(widgetConfig.buttonSize, "large")) ? " selected" : ""}>Grand</option></select></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"><h3 class="text-xl font-bold text-gray-900 mb-6">Boutons d&#39;action rapides</h3><div class="space-y-4"><!--[-->`);
      ssrRenderList(widgetConfig.quickButtons, (button, index) => {
        _push(`<div class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50"><input${ssrRenderAttr("value", button.text)} type="text" placeholder="Texte du bouton" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"><button class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200">`);
        _push(ssrRenderComponent(unref(TrashIcon), { class: "h-4 w-4" }, null, _parent));
        _push(`</button></div>`);
      });
      _push(`<!--]--><button class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-all duration-200">`);
      _push(ssrRenderComponent(unref(PlusIcon), { class: "h-5 w-5 mx-auto mb-1" }, null, _parent));
      _push(` Ajouter un bouton </button></div></div></div><div style="${ssrRenderStyle(activeTab.value === "integrations" ? null : { display: "none" })}" class="space-y-8"><div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"><h3 class="text-xl font-bold text-gray-900 mb-6">Plateforme e-commerce</h3><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><label class="flex flex-col items-center p-6 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"><input${ssrIncludeBooleanAttr(ssrLooseEqual(integrationConfig.platform, "shopify")) ? " checked" : ""} type="radio" value="shopify" class="text-blue-600 focus:ring-blue-500 mb-3"><div class="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200"><span class="text-white font-bold">S</span></div><span class="text-sm font-medium text-center">Shopify</span></label><label class="flex flex-col items-center p-6 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"><input${ssrIncludeBooleanAttr(ssrLooseEqual(integrationConfig.platform, "woocommerce")) ? " checked" : ""} type="radio" value="woocommerce" class="text-blue-600 focus:ring-blue-500 mb-3"><div class="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200"><span class="text-white font-bold">W</span></div><span class="text-sm font-medium text-center">WooCommerce</span></label><label class="flex flex-col items-center p-6 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"><input${ssrIncludeBooleanAttr(ssrLooseEqual(integrationConfig.platform, "custom")) ? " checked" : ""} type="radio" value="custom" class="text-blue-600 focus:ring-blue-500 mb-3"><div class="h-12 w-12 bg-gray-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">`);
      _push(ssrRenderComponent(unref(CodeBracketIcon), { class: "h-6 w-6 text-white" }, null, _parent));
      _push(`</div><span class="text-sm font-medium text-center">Site personnalis\xE9</span></label></div></div><div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"><h3 class="text-xl font-bold text-gray-900 mb-6">Code d&#39;int\xE9gration</h3><div class="bg-gray-900 rounded-lg p-6 text-sm text-gray-100 font-mono overflow-x-auto"><pre><code>&lt;!-- ChatSeller Widget --&gt;
&lt;script src=&quot;https://widget.chatseller.app/widget.js&quot; 
        data-shop-id=&quot;${ssrInterpolate(((_a = unref(userProfile)) == null ? void 0 : _a.id) || "YOUR_SHOP_ID")}&quot;
        data-button-text=&quot;${ssrInterpolate(widgetConfig.buttonText)}&quot;
        data-primary-color=&quot;${ssrInterpolate(widgetConfig.primaryColor)}&quot;
        data-position=&quot;${ssrInterpolate(widgetConfig.buttonPosition)}&quot;
        data-size=&quot;${ssrInterpolate(widgetConfig.buttonSize)}&quot;&gt;&lt;/script&gt;</code></pre></div><div class="mt-6 flex justify-end"><button class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(ClipboardIcon), { class: "mr-2 h-4 w-4" }, null, _parent));
      _push(` Copier le code </button></div></div></div><div style="${ssrRenderStyle(activeTab.value === "notifications" ? null : { display: "none" })}" class="space-y-8"><div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"><h3 class="text-xl font-bold text-gray-900 mb-6">Notifications email</h3><div class="space-y-4"><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="text-sm font-medium text-gray-700">Nouvelles conversations</label><p class="text-xs text-gray-500">Recevoir un email \xE0 chaque nouvelle conversation</p></div>`);
      _push(ssrRenderComponent(_component_ToggleSwitch, {
        modelValue: notificationConfig.newConversations,
        "onUpdate:modelValue": ($event) => notificationConfig.newConversations = $event
      }, null, _parent));
      _push(`</div><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="text-sm font-medium text-gray-700">Nouvelles commandes</label><p class="text-xs text-gray-500">Recevoir un email \xE0 chaque nouvelle commande</p></div>`);
      _push(ssrRenderComponent(_component_ToggleSwitch, {
        modelValue: notificationConfig.newOrders,
        "onUpdate:modelValue": ($event) => notificationConfig.newOrders = $event
      }, null, _parent));
      _push(`</div><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="text-sm font-medium text-gray-700">Rapport quotidien</label><p class="text-xs text-gray-500">R\xE9sum\xE9 quotidien des performances</p></div>`);
      _push(ssrRenderComponent(_component_ToggleSwitch, {
        modelValue: notificationConfig.dailyReport,
        "onUpdate:modelValue": ($event) => notificationConfig.dailyReport = $event
      }, null, _parent));
      _push(`</div><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="text-sm font-medium text-gray-700">Rapport hebdomadaire</label><p class="text-xs text-gray-500">Analyse hebdomadaire d\xE9taill\xE9e</p></div>`);
      _push(ssrRenderComponent(_component_ToggleSwitch, {
        modelValue: notificationConfig.weeklyReport,
        "onUpdate:modelValue": ($event) => notificationConfig.weeklyReport = $event
      }, null, _parent));
      _push(`</div></div></div></div></div><div class="xl:col-span-1"><div class="sticky top-6"><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-xl font-bold text-gray-900 mb-6">Aper\xE7u en temps r\xE9el</h3><div class="border border-gray-200 rounded-xl p-6 bg-gray-50"><div class="mb-6"><button style="${ssrRenderStyle({
        backgroundColor: widgetConfig.primaryColor,
        fontSize: widgetConfig.buttonSize === "small" ? "14px" : widgetConfig.buttonSize === "large" ? "18px" : "16px",
        padding: widgetConfig.buttonSize === "small" ? "8px 16px" : widgetConfig.buttonSize === "large" ? "16px 32px" : "12px 24px"
      })}" class="w-full text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 shadow-lg">${ssrInterpolate(widgetConfig.buttonText)}</button></div><div class="bg-white rounded-xl border border-gray-200 p-6 max-h-96 overflow-y-auto shadow-sm"><div class="flex items-center mb-6 pb-4 border-b border-gray-200"><img${ssrRenderAttr("src", agentConfig.avatarUrl || "/default-agent.png")}${ssrRenderAttr("alt", agentConfig.name)} class="h-10 w-10 rounded-full object-cover"><div class="ml-4"><p class="text-sm font-medium text-gray-900">${ssrInterpolate(agentConfig.name)}</p><p class="text-xs text-green-600 flex items-center"><div class="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div> En ligne </p></div></div><div class="mb-6"><div class="bg-gray-100 rounded-xl p-4"><p class="text-sm text-gray-800">${ssrInterpolate(agentConfig.welcomeMessage)}</p></div></div>`);
      if (widgetConfig.quickButtons.length > 0) {
        _push(`<div class="space-y-3 mb-6"><!--[-->`);
        ssrRenderList(widgetConfig.quickButtons, (button, index) => {
          _push(`<button class="w-full p-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors duration-200">${ssrInterpolate(button.text)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="pt-4 border-t border-gray-200"><div class="flex items-center space-x-3"><input type="text" placeholder="Tapez votre message..." class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm" disabled><button style="${ssrRenderStyle({ backgroundColor: widgetConfig.primaryColor })}" class="p-3 text-white rounded-lg" disabled>`);
      _push(ssrRenderComponent(unref(PaperAirplaneIcon), { class: "h-4 w-4" }, null, _parent));
      _push(`</button></div></div></div></div></div></div></div></div><div class="flex justify-between"><button class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"> Restaurer les valeurs par d\xE9faut </button><div class="flex space-x-4"><button class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(EyeIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
      _push(` Tester le widget </button><button${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200">`);
      if (saving.value) {
        _push(`<span class="mr-2"><div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(saving.value ? "Sauvegarde..." : "Sauvegarder les modifications")}</button></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-CcBbkL6s.mjs.map
