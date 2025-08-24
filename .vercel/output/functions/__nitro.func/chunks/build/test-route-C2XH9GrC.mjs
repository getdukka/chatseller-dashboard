import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { f as useRoute, u as useHead } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "test-route",
  __ssrInlineRender: true,
  setup(__props) {
    const timestamp = ref((/* @__PURE__ */ new Date()).toLocaleString());
    console.log("\u2705 ROUTE DE TEST SIMPLE CHARG\xC9E AVEC SUCC\xC8S!");
    console.log("\u{1F4CD} Route actuelle:", useRoute().path);
    console.log("\u{1F550} Timestamp:", timestamp.value);
    useHead({
      title: "Route de Test - ChatSeller"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-green-100 p-8" }, _attrs))}><div class="max-w-4xl mx-auto"><div class="bg-white rounded-xl shadow-lg p-8 text-center"><h1 class="text-4xl font-bold text-green-600 mb-4"> \u{1F389} ROUTE DE TEST FONCTIONNE ! </h1><p class="text-xl text-gray-700 mb-6"> Si vous voyez cette page, les routes Nuxt fonctionnent parfaitement. </p><div class="space-y-4 text-left max-w-md mx-auto"><p><strong>URL:</strong> /test-route</p><p><strong>Timestamp:</strong> ${ssrInterpolate(timestamp.value)}</p><p><strong>Route Path:</strong> ${ssrInterpolate(_ctx.$route.path)}</p><p><strong>Route Name:</strong> ${ssrInterpolate(_ctx.$route.name)}</p></div><div class="mt-8 space-x-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/vendeurs-ia",
        class: "inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u2192 Aller aux Vendeurs IA `);
          } else {
            return [
              createTextVNode(" \u2192 Aller aux Vendeurs IA ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u2192 Accueil `);
          } else {
            return [
              createTextVNode(" \u2192 Accueil ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/test-route.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=test-route-C2XH9GrC.mjs.map
