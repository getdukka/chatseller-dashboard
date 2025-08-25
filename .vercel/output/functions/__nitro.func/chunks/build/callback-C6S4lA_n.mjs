import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useSupabase } from './useSupabase-CFkBc_As.mjs';
import { u as useHead } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@heroicons/vue/24/outline';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "callback",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabase();
    const loading = ref(true);
    const success = ref(false);
    const error = ref(false);
    const errorMessage = ref("");
    const countdown = ref(5);
    const countdownProgress = ref(0);
    const step = ref("init");
    const progressPercent = ref(0);
    useHead({
      title: "Confirmation de compte - ChatSeller",
      meta: [
        { name: "description", content: "Confirmation de votre compte ChatSeller" },
        { name: "robots", content: "noindex" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center" }, _attrs))} data-v-d72b71b0><div class="max-w-md w-full mx-4" data-v-d72b71b0>`);
      if (unref(loading)) {
        _push(`<div class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center" data-v-d72b71b0><div class="flex justify-center mb-4" data-v-d72b71b0><div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center" data-v-d72b71b0><svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" data-v-d72b71b0><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-d72b71b0></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-d72b71b0></path></svg></div></div><h2 class="text-xl font-semibold text-gray-900 mb-2" data-v-d72b71b0> Confirmation en cours... </h2><p class="text-gray-600 mb-4" data-v-d72b71b0> V\xE9rification de votre adresse email </p><div class="text-sm text-gray-500 space-y-1" data-v-d72b71b0>`);
        if (unref(step) === "parsing") {
          _push(`<p data-v-d72b71b0>\u{1F50D} Analyse du lien de confirmation...</p>`);
        } else if (unref(step) === "tokens") {
          _push(`<p data-v-d72b71b0>\u{1F511} R\xE9cup\xE9ration des informations...</p>`);
        } else if (unref(step) === "verification") {
          _push(`<p data-v-d72b71b0>\u2705 V\xE9rification de votre email...</p>`);
        } else if (unref(step) === "session") {
          _push(`<p data-v-d72b71b0>\u{1F510} Cr\xE9ation de votre session...</p>`);
        } else if (unref(step) === "store") {
          _push(`<p data-v-d72b71b0>\u{1F4BE} Pr\xE9paration de vos donn\xE9es...</p>`);
        } else if (unref(step) === "creating-shop") {
          _push(`<p data-v-d72b71b0>\u{1F3EA} Configuration de votre espace...</p>`);
        } else if (unref(step) === "finalizing") {
          _push(`<p data-v-d72b71b0>\u2728 Finalisation...</p>`);
        } else if (unref(step) === "redirect") {
          _push(`<p data-v-d72b71b0>\u{1F680} Pr\xE9paration de votre onboarding...</p>`);
        } else {
          _push(`<p data-v-d72b71b0>\u23F3 Initialisation...</p>`);
        }
        _push(`</div><div class="mt-4 w-full bg-gray-200 rounded-full h-2" data-v-d72b71b0><div class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="${ssrRenderStyle({ width: `${unref(progressPercent)}%` })}" data-v-d72b71b0></div></div><p class="text-xs text-gray-400 mt-2" data-v-d72b71b0>${ssrInterpolate(unref(progressPercent))}% termin\xE9</p></div>`);
      } else if (unref(success)) {
        _push(`<div class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center" data-v-d72b71b0><div class="flex justify-center mb-4" data-v-d72b71b0><div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center" data-v-d72b71b0><svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d72b71b0><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-d72b71b0></path></svg></div></div><h2 class="text-xl font-semibold text-gray-900 mb-2" data-v-d72b71b0> \u{1F389} Email confirm\xE9 avec succ\xE8s ! </h2><p class="text-gray-600 mb-4" data-v-d72b71b0> Votre compte ChatSeller est maintenant activ\xE9 </p><div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-v-d72b71b0><p class="text-blue-800 text-sm" data-v-d72b71b0><strong data-v-d72b71b0>Prochaine \xE9tape :</strong> Configurons ensemble votre espace de vente IA </p></div><div class="mb-6" data-v-d72b71b0><div class="w-full bg-gray-200 rounded-full h-2" data-v-d72b71b0><div class="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-100 ease-linear" style="${ssrRenderStyle({ width: `${unref(countdownProgress)}%` })}" data-v-d72b71b0></div></div><p class="text-sm text-gray-500 mt-2" data-v-d72b71b0> Configuration automatique dans ${ssrInterpolate(unref(countdown))} secondes... </p></div><button class="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all shadow-lg transform hover:scale-105" data-v-d72b71b0> Configurer mon espace maintenant </button></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center" data-v-d72b71b0><div class="flex justify-center mb-4" data-v-d72b71b0><div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center" data-v-d72b71b0><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d72b71b0><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-d72b71b0></path></svg></div></div><h2 class="text-xl font-semibold text-gray-900 mb-2" data-v-d72b71b0> Erreur de confirmation </h2><p class="text-gray-600 mb-6" data-v-d72b71b0>${ssrInterpolate(unref(errorMessage))}</p><div class="space-y-3" data-v-d72b71b0>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/register",
          class: "w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Cr\xE9er un nouveau compte `);
            } else {
              return [
                createTextVNode(" Cr\xE9er un nouveau compte ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Se connecter `);
            } else {
              return [
                createTextVNode(" Se connecter ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/callback.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const callback = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d72b71b0"]]);

export { callback as default };
//# sourceMappingURL=callback-C6S4lA_n.mjs.map
