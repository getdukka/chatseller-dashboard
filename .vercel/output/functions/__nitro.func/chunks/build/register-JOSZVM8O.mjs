import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, reactive, unref, withCtx, createBlock, createTextVNode, openBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderDynamicModel, ssrLooseContain, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-CAs-0VL3.mjs';
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
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const loading = ref(false);
    const showPassword = ref(false);
    const registerError = ref("");
    const registrationSuccess = ref(false);
    const resendLoading = ref(false);
    const resendCooldown = ref(0);
    const form = reactive({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptTerms: false
    });
    const getGmailUrl = (email) => {
      const domain = email.split("@")[1];
      if (domain === "gmail.com") {
        return "https://mail.google.com/mail/u/0/#inbox";
      }
      return "https://mail.google.com/";
    };
    const getOutlookUrl = (email) => {
      const domain = email.split("@")[1];
      if (["outlook.com", "hotmail.com", "live.com"].includes(domain)) {
        return "https://outlook.live.com/mail/0/inbox";
      }
      return "https://outlook.office.com/mail/";
    };
    useHead({
      title: "Cr\xE9er un compte - ChatSeller",
      meta: [
        { name: "description", content: "Cr\xE9ez votre compte ChatSeller et d\xE9ployez votre vendeur IA en quelques minutes." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-beb3a082><div class="text-center mb-8" data-v-beb3a082><div class="flex justify-center mb-4" data-v-beb3a082><div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg" data-v-beb3a082><span class="text-lg font-bold text-white" data-v-beb3a082>CS</span></div></div><h2 class="text-3xl font-bold text-gray-900" data-v-beb3a082> Cr\xE9er votre compte ChatSeller </h2><p class="mt-2 text-sm text-gray-600" data-v-beb3a082> D\xE9ployez votre Vendeur IA en quelques minutes </p></div>`);
      if (unref(registrationSuccess)) {
        _push(`<div class="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100" data-v-beb3a082><div class="text-center" data-v-beb3a082><div class="flex justify-center mb-4" data-v-beb3a082><div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center" data-v-beb3a082><svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-beb3a082><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-v-beb3a082></path></svg></div></div><h3 class="text-xl font-semibold text-gray-900 mb-4" data-v-beb3a082> V\xE9rifiez votre bo\xEEte mail ! </h3><p class="text-gray-600 mb-6" data-v-beb3a082> Un email de confirmation a \xE9t\xE9 envoy\xE9 \xE0<br data-v-beb3a082><strong class="text-gray-900" data-v-beb3a082>${ssrInterpolate(unref(form).email)}</strong></p><div class="space-y-3 mb-6" data-v-beb3a082><p class="text-sm text-gray-500 mb-4" data-v-beb3a082>Ouvrir votre bo\xEEte mail :</p><div class="flex flex-col sm:flex-row gap-3 justify-center" data-v-beb3a082><a${ssrRenderAttr("href", getGmailUrl(unref(form).email))} target="_blank" class="inline-flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium" data-v-beb3a082><svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" data-v-beb3a082><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" data-v-beb3a082></path></svg> Ouvrir Gmail </a><a${ssrRenderAttr("href", getOutlookUrl(unref(form).email))} target="_blank" class="inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-v-beb3a082><svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" data-v-beb3a082><path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.83 0-.46.1-.87.1-.41.33-.74.22-.33.57-.52.36-.19.85-.19t.87.19q.36.19.58.52.22.33.33.74.11.41.11.87zM21.5 12v.13q0 2.06-1.32 3.54-1.32 1.48-3.5 1.48-2.04 0-3.44-1.48Q12 14.19 12 12.13v-.26q0-2.06 1.24-3.54 1.24-1.48 3.44-1.48 2.18 0 3.5 1.48Q21.5 9.81 21.5 12z" data-v-beb3a082></path></svg> Ouvrir Outlook </a></div></div><div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-v-beb3a082><div class="text-sm text-blue-800" data-v-beb3a082><p class="font-medium mb-2" data-v-beb3a082>\u{1F4E7} \xC9tapes suivantes :</p><ol class="text-left space-y-1" data-v-beb3a082><li data-v-beb3a082>1. Ouvrez votre bo\xEEte mail</li><li data-v-beb3a082>2. Cherchez l&#39;email de <strong data-v-beb3a082>ChatSeller</strong> (v\xE9rifiez les spams)</li><li data-v-beb3a082>3. Cliquez sur <strong data-v-beb3a082>&quot;Confirmer mon email&quot;</strong></li><li data-v-beb3a082>4. Vous serez redirig\xE9 pour finaliser votre profil</li></ol></div></div><div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6" data-v-beb3a082><div class="text-sm text-yellow-800" data-v-beb3a082><p class="font-medium mb-2" data-v-beb3a082>\u{1F6A8} Vous ne recevez pas l&#39;email ?</p><ul class="text-left space-y-1" data-v-beb3a082><li data-v-beb3a082>\u2022 V\xE9rifiez votre dossier spam/courrier ind\xE9sirable</li><li data-v-beb3a082>\u2022 L&#39;email peut prendre quelques minutes \xE0 arriver</li><li data-v-beb3a082>\u2022 V\xE9rifiez que l&#39;adresse email est correcte</li></ul></div></div><div class="text-center" data-v-beb3a082><button${ssrIncludeBooleanAttr(unref(resendLoading) || unref(resendCooldown) > 0) ? " disabled" : ""} class="${ssrRenderClass([unref(resendCooldown) > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800", "text-sm font-medium transition-colors"])}" data-v-beb3a082>${ssrInterpolate(unref(resendCooldown) > 0 ? `Renvoyer dans ${unref(resendCooldown)}s` : unref(resendLoading) ? "Renvoi en cours..." : "Renvoyer l'email de confirmation")}</button></div></div></div>`);
      } else {
        _push(`<div class="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100" data-v-beb3a082><form class="space-y-6" data-v-beb3a082><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-beb3a082><div data-v-beb3a082><label for="firstName" class="block text-sm font-medium text-gray-700 mb-2" data-v-beb3a082> Pr\xE9nom * </label><input id="firstName"${ssrRenderAttr("value", unref(form).firstName)} type="text" required autocomplete="given-name" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Jean" data-v-beb3a082></div><div data-v-beb3a082><label for="lastName" class="block text-sm font-medium text-gray-700 mb-2" data-v-beb3a082> Nom * </label><input id="lastName"${ssrRenderAttr("value", unref(form).lastName)} type="text" required autocomplete="family-name" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Dupont" data-v-beb3a082></div></div><div data-v-beb3a082><label for="email" class="block text-sm font-medium text-gray-700 mb-2" data-v-beb3a082> Adresse email professionnelle * </label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" required autocomplete="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="jean.dupont@entreprise.com" data-v-beb3a082></div><div data-v-beb3a082><label for="password" class="block text-sm font-medium text-gray-700 mb-2" data-v-beb3a082> Mot de passe * </label><div class="relative" data-v-beb3a082><input id="password"${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(form).password, null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} required autocomplete="new-password" class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" data-v-beb3a082><button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center" data-v-beb3a082>`);
        if (!unref(showPassword)) {
          _push(`<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-beb3a082><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-beb3a082></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" data-v-beb3a082></path></svg>`);
        } else {
          _push(`<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-beb3a082><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" data-v-beb3a082></path></svg>`);
        }
        _push(`</button></div><p class="mt-1 text-xs text-gray-500" data-v-beb3a082> Minimum 8 caract\xE8res avec lettres et chiffres </p></div><div class="flex items-start" data-v-beb3a082><div class="flex items-center h-5" data-v-beb3a082><input id="terms"${ssrIncludeBooleanAttr(Array.isArray(unref(form).acceptTerms) ? ssrLooseContain(unref(form).acceptTerms, null) : unref(form).acceptTerms) ? " checked" : ""} type="checkbox" required class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" data-v-beb3a082></div><div class="ml-3 text-sm" data-v-beb3a082><label for="terms" class="text-gray-700" data-v-beb3a082> J&#39;accepte les <a href="https://chatseller.app/terms" class="font-medium text-blue-600 hover:text-blue-500" target="_blank" data-v-beb3a082> conditions d&#39;utilisation </a> et la <a href="https://chatseller.app/privacy" class="font-medium text-blue-600 hover:text-blue-500" target="_blank" data-v-beb3a082> politique de confidentialit\xE9 </a></label></div></div>`);
        if (unref(registerError)) {
          _push(`<div class="p-4 rounded-lg bg-red-50 border border-red-200" data-v-beb3a082><div class="flex" data-v-beb3a082><svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-beb3a082><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" data-v-beb3a082></path></svg><div class="ml-3" data-v-beb3a082><p class="text-sm text-red-800" data-v-beb3a082>${ssrInterpolate(unref(registerError))}</p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-v-beb3a082>`);
        if (unref(loading)) {
          _push(`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" data-v-beb3a082><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-beb3a082></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-beb3a082></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(loading) ? "Cr\xE9ation du compte..." : "Cr\xE9er mon compte")}</button></form><div class="mt-6" data-v-beb3a082><div class="relative" data-v-beb3a082><div class="absolute inset-0 flex items-center" data-v-beb3a082><div class="w-full border-t border-gray-300" data-v-beb3a082></div></div><div class="relative flex justify-center text-sm" data-v-beb3a082><span class="px-2 bg-white text-gray-500" data-v-beb3a082>D\xE9j\xE0 un compte ?</span></div></div><div class="mt-4 text-center" data-v-beb3a082>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-beb3a082${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-v-beb3a082${_scopeId}></path></svg> Se connecter `);
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
                    d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  })
                ])),
                createTextVNode(" Se connecter ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      }
      _push(`<div class="mt-8 text-center" data-v-beb3a082><p class="text-sm text-gray-600" data-v-beb3a082> Questions sur ChatSeller ? <a href="https://chatseller.app/support" class="font-medium text-blue-600 hover:text-blue-500 transition-colors" data-v-beb3a082> Contactez notre \xE9quipe </a></p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-beb3a082"]]);

export { register as default };
//# sourceMappingURL=register-JOSZVM8O.mjs.map
