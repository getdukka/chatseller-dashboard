import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, reactive, withCtx, createBlock, createTextVNode, openBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-CAs-0VL3.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@heroicons/vue/24/outline';
import './auth-KgQDcdck.mjs';
import './useSupabase-CFkBc_As.mjs';
import '@supabase/supabase-js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const loading = ref(false);
    const showPassword = ref(false);
    const loginError = ref("");
    const form = reactive({
      email: "",
      password: "",
      remember: false
    });
    const errors = reactive({
      email: "",
      password: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-d729dbe6><div class="text-center mb-8" data-v-d729dbe6><div class="flex justify-center mb-4" data-v-d729dbe6><div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg" data-v-d729dbe6><span class="text-lg font-bold text-white" data-v-d729dbe6>CS</span></div></div><h2 class="text-3xl font-bold text-gray-900" data-v-d729dbe6> Connexion \xE0 votre dashboard </h2><p class="mt-2 text-sm text-gray-600" data-v-d729dbe6> Configurez et G\xE9rez votre Vendeur IA </p></div><div class="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100" data-v-d729dbe6><form class="space-y-6" data-v-d729dbe6><div data-v-d729dbe6><label for="email" class="block text-sm font-medium text-gray-700 mb-2" data-v-d729dbe6> Adresse email </label><input id="email"${ssrRenderAttr("value", form.email)} type="email" required autocomplete="email" class="${ssrRenderClass([{ "border-red-500 focus:ring-red-500 focus:border-red-500": errors.email }, "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"])}" placeholder="votre.email@entreprise.com" data-v-d729dbe6>`);
      if (errors.email) {
        _push(`<p class="mt-1 text-sm text-red-600" data-v-d729dbe6>${ssrInterpolate(errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-d729dbe6><label for="password" class="block text-sm font-medium text-gray-700 mb-2" data-v-d729dbe6> Mot de passe </label><div class="relative" data-v-d729dbe6><input id="password"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.password, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} required autocomplete="current-password" class="${ssrRenderClass([{ "border-red-500 focus:ring-red-500 focus:border-red-500": errors.password }, "w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"])}" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" data-v-d729dbe6><button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center" data-v-d729dbe6>`);
      if (!showPassword.value) {
        _push(`<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-d729dbe6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-d729dbe6></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" data-v-d729dbe6></path></svg>`);
      } else {
        _push(`<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-d729dbe6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" data-v-d729dbe6></path></svg>`);
      }
      _push(`</button></div>`);
      if (errors.password) {
        _push(`<p class="mt-1 text-sm text-red-600" data-v-d729dbe6>${ssrInterpolate(errors.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-between" data-v-d729dbe6><div class="flex items-center" data-v-d729dbe6><input id="remember"${ssrIncludeBooleanAttr(Array.isArray(form.remember) ? ssrLooseContain(form.remember, null) : form.remember) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" data-v-d729dbe6><label for="remember" class="ml-2 block text-sm text-gray-700" data-v-d729dbe6> Se souvenir de moi </label></div><div class="text-sm" data-v-d729dbe6><a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors" data-v-d729dbe6> Mot de passe oubli\xE9 ? </a></div></div>`);
      if (loginError.value) {
        _push(`<div class="p-4 rounded-lg bg-red-50 border border-red-200" data-v-d729dbe6><div class="flex" data-v-d729dbe6><svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-d729dbe6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" data-v-d729dbe6></path></svg><div class="ml-3" data-v-d729dbe6><p class="text-sm text-red-800" data-v-d729dbe6>${ssrInterpolate(loginError.value)}</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-v-d729dbe6>`);
      if (loading.value) {
        _push(`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" data-v-d729dbe6><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-d729dbe6></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-d729dbe6></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(loading.value ? "Connexion..." : "Se connecter")}</button></form><div class="mt-6" data-v-d729dbe6><div class="relative" data-v-d729dbe6><div class="absolute inset-0 flex items-center" data-v-d729dbe6><div class="w-full border-t border-gray-300" data-v-d729dbe6></div></div><div class="relative flex justify-center text-sm" data-v-d729dbe6><span class="px-2 bg-white text-gray-500" data-v-d729dbe6>Nouveau sur ChatSeller ?</span></div></div><div class="mt-4 text-center" data-v-d729dbe6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-d729dbe6${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" data-v-d729dbe6${_scopeId}></path></svg> Cr\xE9er un compte `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "mr-2 h-4 w-4",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                })
              ])),
              createTextVNode(" Cr\xE9er un compte ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="mt-8 text-center" data-v-d729dbe6><p class="text-sm text-gray-600" data-v-d729dbe6> Besoin d&#39;aide ? <a href="https://chatseller.app/support" class="font-medium text-blue-600 hover:text-blue-500 transition-colors" data-v-d729dbe6> Contactez notre support </a></p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d729dbe6"]]);

export { login as default };
//# sourceMappingURL=login-DyCLDDqw.mjs.map
