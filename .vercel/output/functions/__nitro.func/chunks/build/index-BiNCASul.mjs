import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createBlock, createTextVNode, openBlock, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-KgQDcdck.mjs';
import { u as useDatabase } from './useDatabase-BoIpVxjJ.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useDatabase();
    const refreshing = ref(false);
    const loadingStats = ref(true);
    const showSuccessMessage = ref(false);
    const successMessage = ref("");
    const showWelcomeModal = ref(false);
    const showWelcomeBanner = ref(false);
    ref(null);
    const canvasWidth = ref(0);
    const canvasHeight = ref(0);
    const dashboardStats = ref({
      conversations: { total: 0, active: 0 },
      orders: { total: 0, conversionRate: 0 },
      revenue: { total: 0, average: 0 },
      performance: { responseTime: "< 2s", uptime: 99.9 }
    });
    const recentConversations = ref([]);
    const recentOrders = ref([]);
    const setupStatus = ref({
      knowledgeBase: false,
      agentConfig: false,
      widgetIntegration: false
    });
    const stepStatus = ref({
      vendeurIA: false,
      knowledgeBase: false,
      widgetIntegration: false
    });
    const greeting = computed(() => {
      const hour = (/* @__PURE__ */ new Date()).getHours();
      if (hour >= 5 && hour < 12) return "Bonjour";
      if (hour >= 12 && hour < 18) return "Bon apr\xE8s-midi";
      if (hour >= 18 && hour < 22) return "Bonsoir";
      return "Bonne nuit";
    });
    const userFirstName = computed(() => {
      const userName = authStore.userName;
      const userEmail = authStore.userEmail;
      if (userName && !userName.includes("@")) {
        const firstName = userName.split(" ")[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      }
      if (userEmail) {
        const emailPrefix = userEmail.split("@")[0];
        const firstName = emailPrefix.split(/[._-]/)[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      }
      return "Utilisateur";
    });
    const configurationProgress = computed(() => {
      const total = Object.keys(setupStatus.value).length;
      const completed = Object.values(setupStatus.value).filter(Boolean).length;
      return Math.round(completed / total * 100);
    });
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
      }).format(amount);
    };
    const formatNumber = (num) => {
      return new Intl.NumberFormat("fr-FR").format(num);
    };
    const formatTime = (date) => {
      const now = /* @__PURE__ */ new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1e3 * 60));
      if (diffInMinutes < 1) return "\xC0 l'instant";
      if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
      if (diffInMinutes < 24 * 60) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
      return date.toLocaleDateString("fr-FR");
    };
    const getInitials = (name) => {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };
    useHead({
      title: "Dashboard - ChatSeller"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-8b6a9bcb>`);
      if (showWelcomeModal.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-hidden" data-v-8b6a9bcb><canvas class="absolute inset-0 pointer-events-none z-40"${ssrRenderAttr("width", canvasWidth.value)}${ssrRenderAttr("height", canvasHeight.value)} data-v-8b6a9bcb></canvas><div class="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden" data-v-8b6a9bcb><div class="px-8 py-6 border-b border-gray-200 flex-shrink-0" data-v-8b6a9bcb><div class="flex items-center justify-between" data-v-8b6a9bcb><div class="flex items-center space-x-3" data-v-8b6a9bcb><div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center" data-v-8b6a9bcb><span class="text-white font-bold text-lg" data-v-8b6a9bcb>CS</span></div><div data-v-8b6a9bcb><h2 class="text-2xl font-bold text-gray-900" data-v-8b6a9bcb> \u{1F389} Bienvenue sur ChatSeller, ${ssrInterpolate(userFirstName.value)} ! </h2><p class="text-gray-600" data-v-8b6a9bcb>Cr\xE9ez votre Vendeur IA et automatisez vos ventes</p></div></div><button class="text-gray-400 hover:text-gray-600 transition-colors" data-v-8b6a9bcb><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-8b6a9bcb></path></svg></button></div></div><div class="flex-1 overflow-y-auto" data-v-8b6a9bcb><div class="p-8" data-v-8b6a9bcb><div class="grid grid-cols-1 lg:grid-cols-2 gap-8" data-v-8b6a9bcb><div data-v-8b6a9bcb><h3 class="text-lg font-semibold text-gray-900 mb-6" data-v-8b6a9bcb>\u2728 Prochaines \xE9tapes pour d\xE9marrer</h3><div class="space-y-4" data-v-8b6a9bcb><div class="${ssrRenderClass([{ "completed": stepStatus.value.vendeurIA }, "welcome-step"])}" data-v-8b6a9bcb><div class="flex items-start space-x-4" data-v-8b6a9bcb><div class="step-number" data-v-8b6a9bcb>`);
        if (stepStatus.value.vendeurIA) {
          _push(`<span class="text-green-600" data-v-8b6a9bcb>\u2713</span>`);
        } else {
          _push(`<span class="text-blue-600 font-semibold" data-v-8b6a9bcb>1</span>`);
        }
        _push(`</div><div class="flex-1" data-v-8b6a9bcb><h4 class="font-medium text-gray-900" data-v-8b6a9bcb>\u{1F916} Cr\xE9er votre Vendeur IA</h4><p class="text-sm text-gray-600 mt-1" data-v-8b6a9bcb> Configurez un Agent IA intelligent qui r\xE9pond automatiquement \xE0 vos clients et collecte leurs commandes 24h/24. </p><button class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center" data-v-8b6a9bcb>${ssrInterpolate(stepStatus.value.vendeurIA ? "\u2699\uFE0F Modifier mon agent" : "\u{1F680} Configurer maintenant")} <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-8b6a9bcb></path></svg></button></div></div></div><div class="${ssrRenderClass([{ "completed": stepStatus.value.knowledgeBase }, "welcome-step"])}" data-v-8b6a9bcb><div class="flex items-start space-x-4" data-v-8b6a9bcb><div class="step-number" data-v-8b6a9bcb>`);
        if (stepStatus.value.knowledgeBase) {
          _push(`<span class="text-green-600" data-v-8b6a9bcb>\u2713</span>`);
        } else {
          _push(`<span class="text-blue-600 font-semibold" data-v-8b6a9bcb>2</span>`);
        }
        _push(`</div><div class="flex-1" data-v-8b6a9bcb><h4 class="font-medium text-gray-900" data-v-8b6a9bcb>\u{1F4DA} Former votre Vendeur IA</h4><p class="text-sm text-gray-600 mt-1" data-v-8b6a9bcb> Ajoutez des informations sur vos produits et votre entreprise pour que votre Vendeur IA r\xE9ponde avec pr\xE9cision. </p><button class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center" data-v-8b6a9bcb>${ssrInterpolate(stepStatus.value.knowledgeBase ? "\u{1F4D6} G\xE9rer mes documents" : "\u{1F4DD} Ajouter des connaissances")} <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-8b6a9bcb></path></svg></button></div></div></div><div class="${ssrRenderClass([{ "completed": stepStatus.value.widgetIntegration }, "welcome-step"])}" data-v-8b6a9bcb><div class="flex items-start space-x-4" data-v-8b6a9bcb><div class="step-number" data-v-8b6a9bcb>`);
        if (stepStatus.value.widgetIntegration) {
          _push(`<span class="text-green-600" data-v-8b6a9bcb>\u2713</span>`);
        } else {
          _push(`<span class="text-blue-600 font-semibold" data-v-8b6a9bcb>3</span>`);
        }
        _push(`</div><div class="flex-1" data-v-8b6a9bcb><h4 class="font-medium text-gray-900" data-v-8b6a9bcb>\u{1F517} Int\xE9grer sur votre site</h4><p class="text-sm text-gray-600 mt-1" data-v-8b6a9bcb> Copiez le code d&#39;int\xE9gration de votre Widget Chatseller et ajoutez-le sur votre site pour activer votre Vendeur IA. </p><button class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center" data-v-8b6a9bcb>${ssrInterpolate(stepStatus.value.widgetIntegration ? "\u{1F527} Voir l'int\xE9gration" : "\u{1F4BB} Obtenir le code")} <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-8b6a9bcb></path></svg></button></div></div></div></div><div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200" data-v-8b6a9bcb><div class="flex items-center justify-between mb-3" data-v-8b6a9bcb><span class="text-sm font-semibold text-blue-900" data-v-8b6a9bcb>\u{1F3AF} Progression de votre configuration</span><span class="text-lg font-bold text-blue-600" data-v-8b6a9bcb>${ssrInterpolate(configurationProgress.value)}%</span></div><div class="w-full bg-blue-200 rounded-full h-3" data-v-8b6a9bcb><div class="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 shadow-lg" style="${ssrRenderStyle({ width: `${configurationProgress.value}%` })}" data-v-8b6a9bcb></div></div><p class="text-xs text-blue-700 mt-2" data-v-8b6a9bcb>${ssrInterpolate(configurationProgress.value === 100 ? "\u{1F389} Configuration termin\xE9e !" : "Quelques \xE9tapes pour un Vendeur IA optimal")}</p></div></div><div data-v-8b6a9bcb><h3 class="text-lg font-semibold text-gray-900 mb-6" data-v-8b6a9bcb>\u{1F440} Aper\xE7u de votre futur Vendeur IA</h3><div class="chat-preview shadow-xl border-2 border-gray-200" data-v-8b6a9bcb><div class="chat-header" data-v-8b6a9bcb><div class="flex items-center space-x-3" data-v-8b6a9bcb><div class="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center animate-pulse" data-v-8b6a9bcb><span class="text-white text-sm font-bold" data-v-8b6a9bcb>\u{1F916}</span></div><div data-v-8b6a9bcb><p class="font-semibold text-gray-900" data-v-8b6a9bcb>Vendeur IA ChatSeller</p><p class="text-xs text-green-600 flex items-center" data-v-8b6a9bcb><span class="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" data-v-8b6a9bcb></span> En ligne \u2022 R\xE9pond en &lt; 10s </p></div></div><div class="text-xs text-gray-500" data-v-8b6a9bcb> \u26A1 Powered by ChatSeller </div></div><div class="chat-messages" data-v-8b6a9bcb><div class="ai-message" data-v-8b6a9bcb><div class="message-bubble ai" data-v-8b6a9bcb><p class="text-sm" data-v-8b6a9bcb>\u{1F44B} Bonjour ! Je vois que vous vous int\xE9ressez \xE0 <strong data-v-8b6a9bcb>[Produit]</strong>. Comment puis-je vous aider ?</p></div></div><div class="user-message" data-v-8b6a9bcb><div class="message-bubble user" data-v-8b6a9bcb><p class="text-sm" data-v-8b6a9bcb>J&#39;aimerais savoir comment il soulage les douleurs</p></div></div><div class="ai-message" data-v-8b6a9bcb><div class="message-bubble ai" data-v-8b6a9bcb><p class="text-sm" data-v-8b6a9bcb>Excellente question ! <strong data-v-8b6a9bcb>[Produit]</strong> soulage les douleurs en s&#39;attaquant \xE0 leur source. La chaleur liqu\xE9fie le sang et facilite son \xE9coulement, et le massage d\xE9tend les muscles. Souhaitez-vous le commander \xE0 pr\xE9sent ?</p><div class="mt-3 space-y-2" data-v-8b6a9bcb><button class="quick-reply" data-v-8b6a9bcb>Oui, je veux l&#39;acheter</button><button class="quick-reply" data-v-8b6a9bcb>J&#39;ai d&#39;autres questions</button><button class="quick-reply" data-v-8b6a9bcb>Je veux parler \xE0 un humain</button></div></div></div><div class="ai-message" data-v-8b6a9bcb><div class="typing-indicator" data-v-8b6a9bcb><span data-v-8b6a9bcb></span><span data-v-8b6a9bcb></span><span data-v-8b6a9bcb></span></div></div></div><div class="chat-input" data-v-8b6a9bcb><div class="flex items-center space-x-2" data-v-8b6a9bcb><input type="text" placeholder="\u{1F4AC} Posez votre question..." class="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" disabled data-v-8b6a9bcb><button class="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg" data-v-8b6a9bcb><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" data-v-8b6a9bcb></path></svg></button></div></div></div><div class="mt-6 grid grid-cols-2 gap-4" data-v-8b6a9bcb><div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center" data-v-8b6a9bcb><div class="text-2xl font-bold text-green-600" data-v-8b6a9bcb>+35%</div><div class="text-xs text-green-700" data-v-8b6a9bcb>Conversions moyennes</div></div><div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center" data-v-8b6a9bcb><div class="text-2xl font-bold text-blue-600" data-v-8b6a9bcb>24/7</div><div class="text-xs text-blue-700" data-v-8b6a9bcb>Disponibilit\xE9</div></div></div></div></div></div></div><div class="px-8 py-6 bg-gray-50 border-t border-gray-200 flex-shrink-0" data-v-8b6a9bcb><div class="flex items-center justify-between" data-v-8b6a9bcb><div class="text-sm text-gray-600" data-v-8b6a9bcb><span class="font-medium" data-v-8b6a9bcb>\u{1F4A1} Conseil :</span> Configurez votre Vendeur IA pour de meilleurs r\xE9sultats </div><div class="flex items-center space-x-3" data-v-8b6a9bcb><button class="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors" data-v-8b6a9bcb> Je le ferai plus tard </button><button class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg" data-v-8b6a9bcb> \u{1F680} Cr\xE9er mon Vendeur IA </button></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showWelcomeBanner.value && !showWelcomeModal.value) {
        _push(`<div class="m-8 mb-6" data-v-8b6a9bcb><div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden" data-v-8b6a9bcb><div class="px-8 py-6 text-white relative" data-v-8b6a9bcb><div class="flex items-center justify-between" data-v-8b6a9bcb><div data-v-8b6a9bcb><h2 class="text-2xl font-bold mb-2" data-v-8b6a9bcb>\u{1F389} Bon retour sur ChatSeller !</h2><p class="text-blue-100 text-lg" data-v-8b6a9bcb> Continuez la configuration de votre Vendeur IA pour maximiser vos conversions. </p><div class="mt-4 flex flex-wrap gap-3" data-v-8b6a9bcb>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/agent-config",
          class: "inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-8b6a9bcb${_scopeId}></path></svg> Configurer mon Vendeur IA `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  })
                ])),
                createTextVNode(" Configurer mon Vendeur IA ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/knowledge-base",
          class: "inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-v-8b6a9bcb${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-8b6a9bcb${_scopeId}></path></svg> Former mon Vendeur IA `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  }),
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  })
                ])),
                createTextVNode(" Former mon Vendeur IA ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><button class="text-white text-opacity-80 hover:text-opacity-100 transition-colors" data-v-8b6a9bcb><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-8b6a9bcb></path></svg></button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="px-8 py-6" data-v-8b6a9bcb><div class="flex items-center justify-between" data-v-8b6a9bcb><div data-v-8b6a9bcb><h1 class="text-3xl font-bold text-gray-900" data-v-8b6a9bcb>${ssrInterpolate(greeting.value)}, ${ssrInterpolate(userFirstName.value)} \u{1F44B}\u{1F3FC} </h1><p class="mt-2 text-gray-600" data-v-8b6a9bcb> Voici les performances de votre Vendeur IA </p></div><div class="flex items-center space-x-4" data-v-8b6a9bcb><button${ssrIncludeBooleanAttr(refreshing.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors" data-v-8b6a9bcb><svg class="${ssrRenderClass([{ "animate-spin": refreshing.value }, "w-4 h-4 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-8b6a9bcb></path></svg> ${ssrInterpolate(refreshing.value ? "Actualisation..." : "Actualiser")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/settings",
        class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-v-8b6a9bcb${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-8b6a9bcb${_scopeId}></path></svg> Configurer `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4 mr-2",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                }),
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                })
              ])),
              createTextVNode(" Configurer ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
      if (loadingStats.value) {
        _push(`<div class="px-8 pb-8" data-v-8b6a9bcb><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-v-8b6a9bcb><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="card-modern animate-pulse" data-v-8b6a9bcb><div class="h-24 bg-gray-200 rounded" data-v-8b6a9bcb></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="px-8 pb-8" data-v-8b6a9bcb><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-v-8b6a9bcb><div class="card-modern-gradient from-blue-500 to-blue-600" data-v-8b6a9bcb><div class="flex items-center justify-between" data-v-8b6a9bcb><div class="text-white" data-v-8b6a9bcb><p class="text-blue-100 text-sm font-medium" data-v-8b6a9bcb>Conversations</p><p class="text-3xl font-bold" data-v-8b6a9bcb>${ssrInterpolate(formatNumber(dashboardStats.value.conversations.total))}</p><p class="text-blue-100 text-sm mt-1" data-v-8b6a9bcb><span class="text-white font-medium" data-v-8b6a9bcb>${ssrInterpolate(dashboardStats.value.conversations.active)}</span> actives </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-8b6a9bcb><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-8b6a9bcb></path></svg></div></div><div class="mt-4" data-v-8b6a9bcb>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/conversations",
          class: "text-white text-sm font-medium hover:text-blue-100 transition-colors inline-flex items-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Voir tout <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-8b6a9bcb${_scopeId}></path></svg>`);
            } else {
              return [
                createTextVNode(" Voir tout "),
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 ml-1",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9 5l7 7-7 7"
                  })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="card-modern-gradient from-green-500 to-green-600" data-v-8b6a9bcb><div class="flex items-center justify-between" data-v-8b6a9bcb><div class="text-white" data-v-8b6a9bcb><p class="text-green-100 text-sm font-medium" data-v-8b6a9bcb>Commandes</p><p class="text-3xl font-bold" data-v-8b6a9bcb>${ssrInterpolate(formatNumber(dashboardStats.value.orders.total))}</p><p class="text-green-100 text-sm mt-1" data-v-8b6a9bcb><span class="text-white font-medium" data-v-8b6a9bcb>${ssrInterpolate(dashboardStats.value.orders.conversionRate)}%</span> conversion </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-8b6a9bcb><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-8b6a9bcb></path></svg></div></div><div class="mt-4" data-v-8b6a9bcb>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/orders",
          class: "text-white text-sm font-medium hover:text-green-100 transition-colors inline-flex items-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Voir tout <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-8b6a9bcb${_scopeId}></path></svg>`);
            } else {
              return [
                createTextVNode(" Voir tout "),
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 ml-1",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9 5l7 7-7 7"
                  })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="card-modern-gradient from-yellow-500 to-orange-500" data-v-8b6a9bcb><div class="flex items-center justify-between" data-v-8b6a9bcb><div class="text-white" data-v-8b6a9bcb><p class="text-orange-100 text-sm font-medium" data-v-8b6a9bcb>Chiffre d&#39;affaires</p><p class="text-3xl font-bold" data-v-8b6a9bcb>${ssrInterpolate(formatCurrency(dashboardStats.value.revenue.total))}</p><p class="text-orange-100 text-sm mt-1" data-v-8b6a9bcb><span class="text-white font-medium" data-v-8b6a9bcb>${ssrInterpolate(formatCurrency(dashboardStats.value.revenue.average))}</span> panier moyen </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-8b6a9bcb><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" data-v-8b6a9bcb></path></svg></div></div><div class="mt-4" data-v-8b6a9bcb>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/analytics",
          class: "text-white text-sm font-medium hover:text-orange-100 transition-colors inline-flex items-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Voir analytics <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-8b6a9bcb${_scopeId}></path></svg>`);
            } else {
              return [
                createTextVNode(" Voir analytics "),
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 ml-1",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9 5l7 7-7 7"
                  })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="card-modern-gradient from-purple-500 to-purple-600" data-v-8b6a9bcb><div class="flex items-center justify-between" data-v-8b6a9bcb><div class="text-white" data-v-8b6a9bcb><p class="text-purple-100 text-sm font-medium" data-v-8b6a9bcb>Performance</p><p class="text-3xl font-bold" data-v-8b6a9bcb>${ssrInterpolate(dashboardStats.value.performance.responseTime)}</p><p class="text-purple-100 text-sm mt-1" data-v-8b6a9bcb><span class="text-white font-medium" data-v-8b6a9bcb>${ssrInterpolate(dashboardStats.value.performance.uptime)}%</span> uptime </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-8b6a9bcb><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-8b6a9bcb></path></svg></div></div><div class="mt-4" data-v-8b6a9bcb><span class="text-purple-100 text-sm font-medium" data-v-8b6a9bcb>Syst\xE8me optimal</span></div></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-6" data-v-8b6a9bcb><div class="card-modern" data-v-8b6a9bcb><div class="flex items-center justify-between mb-6" data-v-8b6a9bcb><h3 class="text-lg font-semibold text-gray-900" data-v-8b6a9bcb>Conversations r\xE9centes</h3>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/conversations",
          class: "text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` G\xE9rer les discussions `);
            } else {
              return [
                createTextVNode(" G\xE9rer les discussions ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (recentConversations.value.length > 0) {
          _push(`<div class="space-y-4" data-v-8b6a9bcb><!--[-->`);
          ssrRenderList(recentConversations.value, (conversation) => {
            _push(`<div class="conversation-item" data-v-8b6a9bcb><div class="flex items-center space-x-3" data-v-8b6a9bcb><div class="avatar-circle" data-v-8b6a9bcb><span class="text-sm font-medium text-white" data-v-8b6a9bcb>${ssrInterpolate(getInitials(conversation.visitor))}</span></div><div class="flex-1 min-w-0" data-v-8b6a9bcb><p class="text-sm font-medium text-gray-900 truncate" data-v-8b6a9bcb>${ssrInterpolate(conversation.visitor)}</p><p class="text-xs text-gray-500 truncate" data-v-8b6a9bcb>${ssrInterpolate(conversation.lastMessage)}</p></div><div class="flex flex-col items-end" data-v-8b6a9bcb><div class="text-xs text-gray-400" data-v-8b6a9bcb>${ssrInterpolate(formatTime(conversation.time))}</div>`);
            if (conversation.unread) {
              _push(`<div class="w-2 h-2 bg-blue-500 rounded-full mt-1" data-v-8b6a9bcb></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="empty-state" data-v-8b6a9bcb><svg class="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-8b6a9bcb></path></svg><p class="text-gray-500 text-sm mt-2" data-v-8b6a9bcb>Aucune conversation r\xE9cente</p><p class="text-gray-400 text-xs mt-1" data-v-8b6a9bcb>Les nouvelles conversations appara\xEEtront ici</p></div>`);
        }
        _push(`</div><div class="card-modern" data-v-8b6a9bcb><div class="flex items-center justify-between mb-6" data-v-8b6a9bcb><h3 class="text-lg font-semibold text-gray-900" data-v-8b6a9bcb>Commandes r\xE9centes</h3>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/orders",
          class: "text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Suivi des ventes `);
            } else {
              return [
                createTextVNode(" Suivi des ventes ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (recentOrders.value.length > 0) {
          _push(`<div class="space-y-4" data-v-8b6a9bcb><!--[-->`);
          ssrRenderList(recentOrders.value, (order) => {
            _push(`<div class="order-item" data-v-8b6a9bcb><div class="flex items-center justify-between" data-v-8b6a9bcb><div class="flex items-center space-x-3" data-v-8b6a9bcb><div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center" data-v-8b6a9bcb><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-8b6a9bcb></path></svg></div><div data-v-8b6a9bcb><p class="text-sm font-medium text-gray-900" data-v-8b6a9bcb>${ssrInterpolate(order.customer)}</p><p class="text-xs text-gray-500" data-v-8b6a9bcb> Commande #${ssrInterpolate(order.id.slice(-6).toUpperCase())}</p></div></div><div class="text-right" data-v-8b6a9bcb><p class="text-sm font-medium text-gray-900" data-v-8b6a9bcb>${ssrInterpolate(formatCurrency(order.amount))}</p><p class="text-xs text-gray-500" data-v-8b6a9bcb>${ssrInterpolate(formatTime(order.time))}</p></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="empty-state" data-v-8b6a9bcb><svg class="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-8b6a9bcb></path></svg><p class="text-gray-500 text-sm mt-2" data-v-8b6a9bcb>Aucune commande r\xE9cente</p><p class="text-gray-400 text-xs mt-1" data-v-8b6a9bcb>Les nouvelles ventes appara\xEEtront ici</p></div>`);
        }
        _push(`</div><div class="card-modern" data-v-8b6a9bcb><div class="flex items-center justify-between mb-6" data-v-8b6a9bcb><h3 class="text-lg font-semibold text-gray-900" data-v-8b6a9bcb>Configuration rapide</h3><div class="progress-circle" data-v-8b6a9bcb><span class="text-xs text-gray-600" data-v-8b6a9bcb>${ssrInterpolate(configurationProgress.value)}%</span></div></div><div class="space-y-4" data-v-8b6a9bcb><div class="${ssrRenderClass([{ "completed": setupStatus.value.knowledgeBase }, "setup-item"])}" data-v-8b6a9bcb>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/knowledge-base",
          class: "flex items-center justify-between w-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center space-x-3" data-v-8b6a9bcb${_scopeId}><div class="${ssrRenderClass([setupStatus.value.knowledgeBase ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600", "setup-icon"])}" data-v-8b6a9bcb${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-8b6a9bcb${_scopeId}></path></svg></div><div data-v-8b6a9bcb${_scopeId}><p class="text-sm font-medium text-gray-900" data-v-8b6a9bcb${_scopeId}>Base de connaissance</p><p class="text-xs text-gray-500" data-v-8b6a9bcb${_scopeId}>Former le Vendeur IA</p></div></div><div class="flex items-center" data-v-8b6a9bcb${_scopeId}><span class="text-xs text-gray-400" data-v-8b6a9bcb${_scopeId}>${ssrInterpolate(setupStatus.value.knowledgeBase ? "Configur\xE9" : "Vide")}</span><svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-8b6a9bcb${_scopeId}></path></svg></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center space-x-3" }, [
                  createVNode("div", {
                    class: ["setup-icon", setupStatus.value.knowledgeBase ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"]
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      })
                    ]))
                  ], 2),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-medium text-gray-900" }, "Base de connaissance"),
                    createVNode("p", { class: "text-xs text-gray-500" }, "Former le Vendeur IA")
                  ])
                ]),
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(setupStatus.value.knowledgeBase ? "Configur\xE9" : "Vide"), 1),
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4 text-gray-400 ml-2",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M9 5l7 7-7 7"
                    })
                  ]))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="${ssrRenderClass([{ "completed": setupStatus.value.agentConfig }, "setup-item"])}" data-v-8b6a9bcb>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/agent-config",
          class: "flex items-center justify-between w-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center space-x-3" data-v-8b6a9bcb${_scopeId}><div class="${ssrRenderClass([setupStatus.value.agentConfig ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600", "setup-icon"])}" data-v-8b6a9bcb${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-v-8b6a9bcb${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-8b6a9bcb${_scopeId}></path></svg></div><div data-v-8b6a9bcb${_scopeId}><p class="text-sm font-medium text-gray-900" data-v-8b6a9bcb${_scopeId}>Param\xE8tres du Vendeur IA</p><p class="text-xs text-gray-500" data-v-8b6a9bcb${_scopeId}>Personnaliser le comportement</p></div></div><div class="flex items-center" data-v-8b6a9bcb${_scopeId}><span class="text-xs text-gray-400" data-v-8b6a9bcb${_scopeId}>${ssrInterpolate(setupStatus.value.agentConfig ? "Configur\xE9" : "\xC0 configurer")}</span><svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-8b6a9bcb${_scopeId}></path></svg></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center space-x-3" }, [
                  createVNode("div", {
                    class: ["setup-icon", setupStatus.value.agentConfig ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"]
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      }),
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      })
                    ]))
                  ], 2),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-medium text-gray-900" }, "Param\xE8tres du Vendeur IA"),
                    createVNode("p", { class: "text-xs text-gray-500" }, "Personnaliser le comportement")
                  ])
                ]),
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(setupStatus.value.agentConfig ? "Configur\xE9" : "\xC0 configurer"), 1),
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4 text-gray-400 ml-2",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M9 5l7 7-7 7"
                    })
                  ]))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="${ssrRenderClass([{ "completed": setupStatus.value.widgetIntegration }, "setup-item"])}" data-v-8b6a9bcb>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/agent-config?tab=integration",
          class: "flex items-center justify-between w-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center space-x-3" data-v-8b6a9bcb${_scopeId}><div class="${ssrRenderClass([setupStatus.value.widgetIntegration ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600", "setup-icon"])}" data-v-8b6a9bcb${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" data-v-8b6a9bcb${_scopeId}></path></svg></div><div data-v-8b6a9bcb${_scopeId}><p class="text-sm font-medium text-gray-900" data-v-8b6a9bcb${_scopeId}>Widget int\xE9gration</p><p class="text-xs text-gray-500" data-v-8b6a9bcb${_scopeId}>Code \xE0 int\xE9grer sur votre site</p></div></div><div class="flex items-center" data-v-8b6a9bcb${_scopeId}><span class="text-xs text-gray-400" data-v-8b6a9bcb${_scopeId}>${ssrInterpolate(setupStatus.value.widgetIntegration ? "Int\xE9gr\xE9" : "\xC0 int\xE9grer")}</span><svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-8b6a9bcb${_scopeId}></path></svg></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center space-x-3" }, [
                  createVNode("div", {
                    class: ["setup-icon", setupStatus.value.widgetIntegration ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"]
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      })
                    ]))
                  ], 2),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-medium text-gray-900" }, "Widget int\xE9gration"),
                    createVNode("p", { class: "text-xs text-gray-500" }, "Code \xE0 int\xE9grer sur votre site")
                  ])
                ]),
                createVNode("div", { class: "flex items-center" }, [
                  createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(setupStatus.value.widgetIntegration ? "Int\xE9gr\xE9" : "\xC0 int\xE9grer"), 1),
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4 text-gray-400 ml-2",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M9 5l7 7-7 7"
                    })
                  ]))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div>`);
      }
      if (showSuccessMessage.value) {
        _push(`<div class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300" data-v-8b6a9bcb><div class="flex items-center" data-v-8b6a9bcb><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8b6a9bcb><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-8b6a9bcb></path></svg> ${ssrInterpolate(successMessage.value)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8b6a9bcb"]]);

export { index as default };
//# sourceMappingURL=index-BiNCASul.mjs.map
