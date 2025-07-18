import { _ as __nuxt_component_0 } from './nuxt-link-v8ty_PQD.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { u as useNuxtApp, a as useRouter } from './server.mjs';
import { u as useSeoMeta } from './v3-D4nZQNuc.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Connexion - ChatSeller",
      description: "Connectez-vous \xE0 votre dashboard ChatSeller"
    });
    const loading = ref(false);
    const error = ref("");
    const form = ref({
      email: "",
      password: "",
      rememberMe: false
    });
    const { $supabase } = useNuxtApp();
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" }, _attrs))}><div class="max-w-md w-full space-y-8"><div><div class="flex justify-center"><div class="flex items-center space-x-2"><div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-lg">CS</span></div><span class="text-2xl font-bold text-gray-900">ChatSeller</span></div></div><h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900"> Connexion \xE0 votre dashboard </h2><p class="mt-2 text-center text-sm text-gray-600"> Acc\xE9dez \xE0 votre Agent IA Commercial </p></div><form class="mt-8 space-y-6"><div class="rounded-md shadow-sm space-y-4"><div><label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Adresse email </label><input id="email"${ssrRenderAttr("value", form.value.email)} name="email" type="email" autocomplete="email" required class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="votre@email.com"></div><div><label for="password" class="block text-sm font-medium text-gray-700 mb-1"> Mot de passe </label><input id="password"${ssrRenderAttr("value", form.value.password)} name="password" type="password" autocomplete="current-password" required class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Mot de passe"></div></div><div class="flex items-center justify-between"><div class="flex items-center"><input id="remember-me"${ssrIncludeBooleanAttr(Array.isArray(form.value.rememberMe) ? ssrLooseContain(form.value.rememberMe, null) : form.value.rememberMe) ? " checked" : ""} name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"><label for="remember-me" class="ml-2 block text-sm text-gray-900"> Se souvenir de moi </label></div><div class="text-sm">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/forgot-password",
        class: "font-medium text-blue-600 hover:text-blue-500"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Mot de passe oubli\xE9 ? `);
          } else {
            return [
              createTextVNode(" Mot de passe oubli\xE9 ? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">`);
      if (loading.value) {
        _push(ssrRenderComponent(unref(ArrowPathIcon), { class: "animate-spin -ml-1 mr-3 h-5 w-5" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(loading.value ? "Connexion..." : "Se connecter")}</button></div>`);
      if (error.value) {
        _push(`<div class="bg-red-50 border border-red-200 rounded-lg p-4"><div class="flex">`);
        _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "h-5 w-5 text-red-400" }, null, _parent));
        _push(`<div class="ml-3"><p class="text-sm text-red-800">${ssrInterpolate(error.value)}</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="text-center"><p class="text-sm text-gray-600"> Pas encore de compte ? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "font-medium text-blue-600 hover:text-blue-500"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cr\xE9er un compte `);
          } else {
            return [
              createTextVNode(" Cr\xE9er un compte ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-CROdEHmT.mjs.map
