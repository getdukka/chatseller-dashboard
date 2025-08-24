import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useSupabase } from './useSupabase-CFkBc_As.mjs';
import { u as useAuthStore } from './auth-KgQDcdck.mjs';
import { c as useRuntimeConfig, u as useHead } from './server.mjs';
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
  __name: "debug-auth",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabase();
    useAuthStore();
    const config = useRuntimeConfig();
    const loading = ref(false);
    const apiResult = ref(null);
    const urlInfo = ref({
      full: "",
      path: "",
      hash: "",
      query: ""
    });
    const supabaseAuth = ref({
      isLoggedIn: false,
      hasValidSession: false,
      user: null,
      error: null
    });
    const storeAuth = ref({
      isAuthenticated: false,
      hasToken: false,
      user: null
    });
    computed(() => {
      var _a;
      return {
        supabaseUrl: ((_a = config.public.supabase) == null ? void 0 : _a.url) || "Non configur\xE9",
        apiBaseUrl: config.public.apiBaseUrl || "Non configur\xE9",
        environment: "Production"
      };
    });
    useHead({
      title: "Debug Auth - ChatSeller"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 py-8" }, _attrs))} data-v-8610f9b6><div class="max-w-4xl mx-auto px-4" data-v-8610f9b6><div class="bg-white rounded-lg shadow-lg p-6" data-v-8610f9b6><h1 class="text-2xl font-bold text-gray-900 mb-6" data-v-8610f9b6>\u{1F50D} Debug Tool - Authentification ChatSeller</h1><div class="mb-6 p-4 bg-blue-50 rounded-lg" data-v-8610f9b6><h2 class="text-lg font-semibold text-blue-900 mb-3" data-v-8610f9b6>\u{1F4CD} Informations URL</h2><div class="space-y-2 text-sm" data-v-8610f9b6><p data-v-8610f9b6><strong data-v-8610f9b6>URL compl\xE8te:</strong> <code class="bg-blue-100 px-2 py-1 rounded" data-v-8610f9b6>${ssrInterpolate(unref(urlInfo).full)}</code></p><p data-v-8610f9b6><strong data-v-8610f9b6>Path:</strong> <code class="bg-blue-100 px-2 py-1 rounded" data-v-8610f9b6>${ssrInterpolate(unref(urlInfo).path)}</code></p><p data-v-8610f9b6><strong data-v-8610f9b6>Hash:</strong> <code class="bg-blue-100 px-2 py-1 rounded" data-v-8610f9b6>${ssrInterpolate(unref(urlInfo).hash || "Aucun")}</code></p><p data-v-8610f9b6><strong data-v-8610f9b6>Query:</strong> <code class="bg-blue-100 px-2 py-1 rounded" data-v-8610f9b6>${ssrInterpolate(unref(urlInfo).query || "Aucun")}</code></p></div></div><div class="mb-6 p-4 bg-green-50 rounded-lg" data-v-8610f9b6><h2 class="text-lg font-semibold text-green-900 mb-3" data-v-8610f9b6>\u{1F510} \xC9tat Supabase Auth</h2><div class="space-y-2 text-sm" data-v-8610f9b6><p data-v-8610f9b6><strong data-v-8610f9b6>Utilisateur connect\xE9:</strong><span class="${ssrRenderClass(unref(supabaseAuth).isLoggedIn ? "text-green-600" : "text-red-600")}" data-v-8610f9b6>${ssrInterpolate(unref(supabaseAuth).isLoggedIn ? "Oui" : "Non")}</span></p>`);
      if (unref(supabaseAuth).user) {
        _push(`<p data-v-8610f9b6><strong data-v-8610f9b6>Email:</strong> ${ssrInterpolate(unref(supabaseAuth).user.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(supabaseAuth).user) {
        _push(`<p data-v-8610f9b6><strong data-v-8610f9b6>ID:</strong> ${ssrInterpolate(unref(supabaseAuth).user.id)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p data-v-8610f9b6><strong data-v-8610f9b6>Session valide:</strong><span class="${ssrRenderClass(unref(supabaseAuth).hasValidSession ? "text-green-600" : "text-red-600")}" data-v-8610f9b6>${ssrInterpolate(unref(supabaseAuth).hasValidSession ? "Oui" : "Non")}</span></p>`);
      if (unref(supabaseAuth).error) {
        _push(`<p class="text-red-600" data-v-8610f9b6><strong data-v-8610f9b6>Erreur:</strong> ${ssrInterpolate(unref(supabaseAuth).error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mb-6 p-4 bg-yellow-50 rounded-lg" data-v-8610f9b6><h2 class="text-lg font-semibold text-yellow-900 mb-3" data-v-8610f9b6>\u{1F4E6} \xC9tat Store Auth</h2><div class="space-y-2 text-sm" data-v-8610f9b6><p data-v-8610f9b6><strong data-v-8610f9b6>Authentifi\xE9:</strong><span class="${ssrRenderClass(unref(storeAuth).isAuthenticated ? "text-green-600" : "text-red-600")}" data-v-8610f9b6>${ssrInterpolate(unref(storeAuth).isAuthenticated ? "Oui" : "Non")}</span></p>`);
      if (unref(storeAuth).user) {
        _push(`<p data-v-8610f9b6><strong data-v-8610f9b6>Email:</strong> ${ssrInterpolate(unref(storeAuth).user.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(storeAuth).user) {
        _push(`<p data-v-8610f9b6><strong data-v-8610f9b6>Nom:</strong> ${ssrInterpolate(unref(storeAuth).user.name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(storeAuth).user) {
        _push(`<p data-v-8610f9b6><strong data-v-8610f9b6>Shop ID:</strong> ${ssrInterpolate(unref(storeAuth).user.shopId)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p data-v-8610f9b6><strong data-v-8610f9b6>Token pr\xE9sent:</strong><span class="${ssrRenderClass(unref(storeAuth).hasToken ? "text-green-600" : "text-red-600")}" data-v-8610f9b6>${ssrInterpolate(unref(storeAuth).hasToken ? "Oui" : "Non")}</span></p></div></div><div class="mb-6 p-4 bg-purple-50 rounded-lg" data-v-8610f9b6><h2 class="text-lg font-semibold text-purple-900 mb-3" data-v-8610f9b6>\u{1F310} Test API</h2><button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-4" data-v-8610f9b6>${ssrInterpolate(unref(loading) ? "Test en cours..." : "Tester la r\xE9cup\xE9ration des donn\xE9es")}</button>`);
      if (unref(apiResult)) {
        _push(`<div class="space-y-2 text-sm" data-v-8610f9b6><p data-v-8610f9b6><strong data-v-8610f9b6>Statut:</strong><span class="${ssrRenderClass(unref(apiResult).success ? "text-green-600" : "text-red-600")}" data-v-8610f9b6>${ssrInterpolate(unref(apiResult).success ? "Succ\xE8s" : "Erreur")}</span></p>`);
        if (unref(apiResult).error) {
          _push(`<p class="text-red-600" data-v-8610f9b6><strong data-v-8610f9b6>Erreur:</strong> ${ssrInterpolate(unref(apiResult).error)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(apiResult).data) {
          _push(`<div data-v-8610f9b6><p data-v-8610f9b6><strong data-v-8610f9b6>Donn\xE9es re\xE7ues:</strong></p><pre class="bg-purple-100 p-3 rounded mt-2 overflow-x-auto text-xs" data-v-8610f9b6>${ssrInterpolate(JSON.stringify(unref(apiResult).data, null, 2))}</pre></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-6 p-4 bg-indigo-50 rounded-lg" data-v-8610f9b6><h2 class="text-lg font-semibold text-indigo-900 mb-3" data-v-8610f9b6>\u2699\uFE0F Configuration d\xE9tect\xE9e</h2><div class="space-y-2 text-sm" data-v-8610f9b6><p data-v-8610f9b6><strong data-v-8610f9b6>Supabase URL:</strong> <code class="bg-indigo-100 px-2 py-1 rounded" data-v-8610f9b6>${ssrInterpolate(unref(config).supabaseUrl)}</code></p><p data-v-8610f9b6><strong data-v-8610f9b6>API Base URL:</strong> <code class="bg-indigo-100 px-2 py-1 rounded" data-v-8610f9b6>${ssrInterpolate(unref(config).apiBaseUrl)}</code></p><p data-v-8610f9b6><strong data-v-8610f9b6>Environnement:</strong> <code class="bg-indigo-100 px-2 py-1 rounded" data-v-8610f9b6>${ssrInterpolate(unref(config).environment)}</code></p></div></div><div class="p-4 bg-gray-50 rounded-lg" data-v-8610f9b6><h2 class="text-lg font-semibold text-gray-900 mb-3" data-v-8610f9b6>\u{1F6E0}\uFE0F Actions de test</h2><div class="flex flex-wrap gap-3" data-v-8610f9b6><button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" data-v-8610f9b6> Rafra\xEEchir Auth </button><button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" data-v-8610f9b6> Simuler Callback </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/callback",
        class: "bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Aller au Callback `);
          } else {
            return [
              createTextVNode(" Aller au Callback ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/onboarding",
        class: "bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Aller \xE0 Onboarding `);
          } else {
            return [
              createTextVNode(" Aller \xE0 Onboarding ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/debug-auth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const debugAuth = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8610f9b6"]]);

export { debugAuth as default };
//# sourceMappingURL=debug-auth-CCx2ls6A.mjs.map
