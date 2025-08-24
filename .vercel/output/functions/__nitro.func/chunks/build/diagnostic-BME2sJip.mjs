import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { c as useRuntimeConfig } from './server.mjs';
import { u as useAuthStore } from './auth-KgQDcdck.mjs';
import { u as useSupabase } from './useSupabase-CFkBc_As.mjs';
import { u as useDatabase } from './useDatabase-BoIpVxjJ.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@heroicons/vue/24/outline';
import '@supabase/supabase-js';

const _sfc_main = {
  __name: "diagnostic",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    useSupabase();
    useDatabase();
    const loading = ref({
      apiHealth: false,
      apiAuth: false,
      billing: false,
      supabase: false,
      database: false
    });
    const apiResults = ref([]);
    const dbResults = ref([]);
    const recommendations = ref([]);
    const authStatus = computed(() => {
      if (authStore.isAuthenticated) {
        return { text: "\u2705 Connect\xE9", color: "text-green-600" };
      }
      return { text: "\u274C Non connect\xE9", color: "text-red-600" };
    });
    const apiStatus = ref({ text: "\u23F3 Non test\xE9", color: "text-gray-600" });
    const dbStatus = ref({ text: "\u23F3 Non test\xE9", color: "text-gray-600" });
    const userInfo = computed(() => {
      var _a;
      return ((_a = authStore.user) == null ? void 0 : _a.email) || "Non connect\xE9";
    });
    const shopId = computed(() => {
      return authStore.userShopId || "Non d\xE9fini";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 py-8" }, _attrs))}><div class="max-w-4xl mx-auto px-4"><div class="bg-white rounded-lg shadow-sm p-6"><h1 class="text-2xl font-bold text-gray-900 mb-6"> \u{1F527} Diagnostic ChatSeller </h1><div class="mb-8"><h2 class="text-lg font-semibold mb-4">\u{1F4CA} Status G\xE9n\xE9ral</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="bg-blue-50 p-4 rounded-lg"><div class="text-sm text-blue-600">Authentification</div><div class="${ssrRenderClass([unref(authStatus).color, "text-lg font-semibold"])}">${ssrInterpolate(unref(authStatus).text)}</div></div><div class="bg-green-50 p-4 rounded-lg"><div class="text-sm text-green-600">API Backend</div><div class="${ssrRenderClass([unref(apiStatus).color, "text-lg font-semibold"])}">${ssrInterpolate(unref(apiStatus).text)}</div></div><div class="bg-purple-50 p-4 rounded-lg"><div class="text-sm text-purple-600">Base de Donn\xE9es</div><div class="${ssrRenderClass([unref(dbStatus).color, "text-lg font-semibold"])}">${ssrInterpolate(unref(dbStatus).text)}</div></div></div></div><div class="mb-8"><h2 class="text-lg font-semibold mb-4">\u{1F9EA} Tests API</h2><div class="space-y-4"><button${ssrIncludeBooleanAttr(unref(loading).apiHealth) ? " disabled" : ""} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">${ssrInterpolate(unref(loading).apiHealth ? "Test en cours..." : "Tester Health Check")}</button><button${ssrIncludeBooleanAttr(unref(loading).apiAuth) ? " disabled" : ""} class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2">${ssrInterpolate(unref(loading).apiAuth ? "Test en cours..." : "Tester Authentification")}</button><button${ssrIncludeBooleanAttr(unref(loading).billing) ? " disabled" : ""} class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 ml-2">${ssrInterpolate(unref(loading).billing ? "Test en cours..." : "Tester Diagnostic Billing")}</button></div>`);
      if (unref(apiResults).length > 0) {
        _push(`<div class="mt-4"><h3 class="font-semibold mb-2">R\xE9sultats :</h3><div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(apiResults), (result) => {
          _push(`<div class="${ssrRenderClass([result.success ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400", "p-3 rounded border-l-4"])}"><div class="font-medium">${ssrInterpolate(result.test)}</div><div class="text-sm text-gray-600">${ssrInterpolate(result.message)}</div>`);
          if (result.data) {
            _push(`<div class="text-xs text-gray-500 mt-1"><pre>${ssrInterpolate(JSON.stringify(result.data, null, 2))}</pre></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-8"><h2 class="text-lg font-semibold mb-4">\u{1F5C4}\uFE0F Tests Base de Donn\xE9es</h2><div class="space-y-4"><button${ssrIncludeBooleanAttr(unref(loading).supabase) ? " disabled" : ""} class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">${ssrInterpolate(unref(loading).supabase ? "Test en cours..." : "Tester Supabase Direct")}</button><button${ssrIncludeBooleanAttr(unref(loading).database) ? " disabled" : ""} class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50 ml-2">${ssrInterpolate(unref(loading).database ? "Test en cours..." : "Tester useDatabase")}</button></div>`);
      if (unref(dbResults).length > 0) {
        _push(`<div class="mt-4"><h3 class="font-semibold mb-2">R\xE9sultats :</h3><div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(dbResults), (result) => {
          _push(`<div class="${ssrRenderClass([result.success ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400", "p-3 rounded border-l-4"])}"><div class="font-medium">${ssrInterpolate(result.test)}</div><div class="text-sm text-gray-600">${ssrInterpolate(result.message)}</div>`);
          if (result.data) {
            _push(`<div class="text-xs text-gray-500 mt-1"> Donn\xE9es : ${ssrInterpolate(typeof result.data === "object" ? JSON.stringify(result.data).substring(0, 100) + "..." : result.data)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-8"><h2 class="text-lg font-semibold mb-4">\u2699\uFE0F Configuration</h2><div class="bg-gray-50 p-4 rounded"><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div><strong>API URL:</strong> ${ssrInterpolate(unref(config).apiUrl)}</div><div><strong>Supabase URL:</strong> ${ssrInterpolate(unref(config).supabaseUrl)}</div><div><strong>Utilisateur:</strong> ${ssrInterpolate(unref(userInfo))}</div><div><strong>Shop ID:</strong> ${ssrInterpolate(unref(shopId))}</div></div></div></div>`);
      if (unref(recommendations).length > 0) {
        _push(`<div><h2 class="text-lg font-semibold mb-4">\u{1F4A1} Recommandations</h2><div class="bg-yellow-50 border border-yellow-200 rounded p-4"><ul class="space-y-2"><!--[-->`);
        ssrRenderList(unref(recommendations), (rec) => {
          _push(`<li class="flex items-start"><span class="text-yellow-600 mr-2">\u26A0\uFE0F</span><span class="text-sm">${ssrInterpolate(rec)}</span></li>`);
        });
        _push(`<!--]--></ul></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/diagnostic.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=diagnostic-BME2sJip.mjs.map
