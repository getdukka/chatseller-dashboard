import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, createVNode, createBlock, openBlock, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-CAs-0VL3.mjs';
import { u as useHead } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import './auth-KgQDcdck.mjs';
import './useSupabase-CFkBc_As.mjs';
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
  __name: "reset-password",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const loading = ref(false);
    const error = ref("");
    const emailSent = ref(false);
    const resendCooldown = ref(0);
    const form = ref({
      email: ""
    });
    watch(() => form.value.email, () => {
      if (error.value) {
        error.value = "";
      }
    });
    useHead({
      title: "R\xE9initialiser le mot de passe - ChatSeller",
      meta: [
        {
          name: "description",
          content: "R\xE9initialisez votre mot de passe ChatSeller en quelques clics."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50" }, _attrs))}><div class="sm:mx-auto sm:w-full sm:max-w-md"><div class="flex justify-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg"${_scopeId}><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"${_scopeId}></path></svg></div><span class="ml-3 text-xl font-bold text-gray-900"${_scopeId}>ChatSeller</span>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg" }, [
                (openBlock(), createBlock("svg", {
                  class: "w-8 h-8 text-white",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  })
                ]))
              ]),
              createVNode("span", { class: "ml-3 text-xl font-bold text-gray-900" }, "ChatSeller")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><h2 class="mt-6 text-center text-3xl font-bold text-gray-900"> R\xE9initialiser votre mot de passe </h2><p class="mt-2 text-center text-sm text-gray-600"> Entrez votre adresse email et nous vous enverrons un lien pour r\xE9initialiser votre mot de passe. </p></div><div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md"><div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">`);
      if (unref(emailSent)) {
        _push(`<div class="mb-6"><div class="rounded-md bg-green-50 p-4"><div class="flex"><div class="flex-shrink-0"><svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg></div><div class="ml-3"><h3 class="text-sm font-medium text-green-800"> Email envoy\xE9 ! </h3><div class="mt-2 text-sm text-green-700"><p> Nous avons envoy\xE9 un lien de r\xE9initialisation \xE0 <strong>${ssrInterpolate(unref(form).email)}</strong>. V\xE9rifiez votre bo\xEEte de r\xE9ception et suivez les instructions. </p></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(emailSent)) {
        _push(`<form class="space-y-6"><div><label for="email" class="block text-sm font-medium text-gray-700"> Adresse email </label><div class="mt-1 relative"><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" autocomplete="email" required${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="${ssrRenderClass([{ "border-red-300": unref(error) }, "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"])}" placeholder="votre@email.com">`);
        if (unref(loading)) {
          _push(`<div class="absolute inset-y-0 right-0 flex items-center pr-3"><svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(error)) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><button type="submit"${ssrIncludeBooleanAttr(unref(loading) || !unref(form).email) ? " disabled" : ""} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(loading)) {
          _push(`<span class="absolute left-0 inset-y-0 flex items-center pl-3"><svg class="animate-spin h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(loading) ? "Envoi en cours..." : "Envoyer le lien de r\xE9initialisation")}</button></div></form>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-6"><div class="relative"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300"></div></div><div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">ou</span></div></div><div class="mt-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg> Retour \xE0 la connexion `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-5 h-5 text-gray-400 mr-2",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                })
              ])),
              createTextVNode(" Retour \xE0 la connexion ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(emailSent)) {
        _push(`<div class="mt-6 text-center"><p class="text-sm text-gray-600"> Vous n&#39;avez pas re\xE7u l&#39;email ? </p><button${ssrIncludeBooleanAttr(unref(resendCooldown) > 0) ? " disabled" : ""} class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed">${ssrInterpolate(unref(resendCooldown) > 0 ? `Renvoyer dans ${unref(resendCooldown)}s` : "Renvoyer l'email")}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reset-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=reset-password-CDUUwzDz.mjs.map
