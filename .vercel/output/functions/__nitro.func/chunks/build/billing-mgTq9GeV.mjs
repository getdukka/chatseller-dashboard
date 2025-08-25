import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, mergeProps, withCtx, createBlock, createTextVNode, openBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-KgQDcdck.mjs';
import { a as useRouter, u as useHead } from './server.mjs';
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
  __name: "billing",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useRouter();
    const loading = ref({
      main: false,
      subscription: false
    });
    const selectedPlan = ref("");
    ref();
    const successModal = ref({
      show: false,
      planName: "",
      plan: ""
    });
    const subscriptionData = ref({
      plan: "free",
      isActive: true,
      trialDaysLeft: 7,
      trialEndDate: "",
      nextBillingDate: ""
    });
    const availablePlans = ref({});
    const notification = ref({
      show: false,
      type: "success",
      message: ""
    });
    const starterFeatures = [
      "1 Vendeur IA sp\xE9cialis\xE9",
      "1000 conversations/mois",
      "50 documents max",
      "Analytics de base",
      "Support email",
      "Int\xE9gration widget"
    ];
    const proFeatures = [
      "Tout du plan Starter",
      "3 Vendeurs IA sp\xE9cialis\xE9s",
      "Conversations illimit\xE9es",
      "Base de connaissance illimit\xE9e",
      "Upsell automatique intelligent",
      "Analytics avanc\xE9es & ROI",
      "Support prioritaire",
      "API & webhooks"
    ];
    const getCurrentPlanFeatures = () => {
      var _a, _b;
      const plan = subscriptionData.value.plan;
      if (isPlanPro(plan)) {
        return ((_a = availablePlans.value.pro) == null ? void 0 : _a.features) || proFeatures.slice(0, 4);
      } else if (isPlanStarter(plan)) {
        return ((_b = availablePlans.value.starter) == null ? void 0 : _b.features) || starterFeatures.slice(0, 3);
      } else {
        return ["Essai gratuit 7 jours", "Toutes les fonctionnalit\xE9s Starter", "Support par email"];
      }
    };
    const getPlanName = (plan) => {
      const names = {
        free: "Essai Gratuit",
        starter: "Starter",
        pro: "Pro"
      };
      return names[plan];
    };
    const getPlanPrice = (plan) => {
      if (plan === "free") {
        return subscriptionData.value.trialDaysLeft > 0 ? `${subscriptionData.value.trialDaysLeft} jours gratuits` : "Essai expir\xE9";
      }
      const prices = {
        starter: "14\u20AC/mois",
        pro: "29\u20AC/mois"
      };
      return prices[plan] || "";
    };
    const isPlanPro = (plan) => plan === "pro";
    const isPlanStarter = (plan) => plan === "starter";
    const isPlanFree = (plan) => plan === "free";
    const getPlanCardClass = (plan) => {
      const classes = {
        free: subscriptionData.value.trialDaysLeft > 0 ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200",
        starter: "bg-blue-50 border-blue-200",
        pro: "bg-purple-50 border-purple-200"
      };
      return classes[plan];
    };
    const getPlanIconClass = (plan) => {
      const classes = {
        free: subscriptionData.value.trialDaysLeft > 0 ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600",
        starter: "bg-blue-100 text-blue-600",
        pro: "bg-purple-100 text-purple-600"
      };
      return classes[plan];
    };
    const getPlanIcon = (plan) => {
      const icons = {
        free: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        starter: "M13 10V3L4 14h7v7l9-11h-7z",
        pro: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      };
      return icons[plan];
    };
    const getStatusLabel = (plan) => {
      if (isPlanFree(plan)) {
        return subscriptionData.value.trialDaysLeft > 0 ? "Essai gratuit" : "Expir\xE9";
      }
      return subscriptionData.value.isActive ? "Actif" : "Inactif";
    };
    const getStatusBadgeClass = (plan) => {
      if (isPlanFree(plan)) {
        return subscriptionData.value.trialDaysLeft > 0 ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800";
      }
      return subscriptionData.value.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    useHead({
      title: "Facturation - ChatSeller Dashboard"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-67660fcc><div class="bg-white shadow-sm border-b border-gray-200" data-v-67660fcc><div class="px-8 py-6" data-v-67660fcc><div class="flex items-center justify-between" data-v-67660fcc><div data-v-67660fcc><h1 class="text-3xl font-bold text-gray-900" data-v-67660fcc>Facturation &amp; Abonnement</h1><p class="mt-2 text-gray-600" data-v-67660fcc> G\xE9rez votre plan et vos paiements en toute s\xE9curit\xE9 </p></div><div class="flex items-center space-x-4" data-v-67660fcc>`);
      if (subscriptionData.value.isActive && !isPlanFree(subscriptionData.value.plan)) {
        _push(`<div class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg" data-v-67660fcc><div class="w-2 h-2 bg-green-500 rounded-full" data-v-67660fcc></div><span class="text-sm font-medium text-green-700" data-v-67660fcc>Abonnement actif</span></div>`);
      } else if (isPlanFree(subscriptionData.value.plan) && subscriptionData.value.trialDaysLeft > 0) {
        _push(`<div class="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg" data-v-67660fcc><div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" data-v-67660fcc></div><span class="text-sm font-medium text-blue-700" data-v-67660fcc>Essai gratuit - ${ssrInterpolate(subscriptionData.value.trialDaysLeft)} jour(s)</span></div>`);
      } else {
        _push(`<div class="flex items-center space-x-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg" data-v-67660fcc><div class="w-2 h-2 bg-red-500 rounded-full" data-v-67660fcc></div><span class="text-sm font-medium text-red-700" data-v-67660fcc>Acc\xE8s suspendu</span></div>`);
      }
      _push(`<button${ssrIncludeBooleanAttr(loading.value.main) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors" data-v-67660fcc><svg class="${ssrRenderClass([{ "animate-spin": loading.value.main }, "w-4 h-4 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-67660fcc></path></svg> ${ssrInterpolate(loading.value.main ? "Actualisation..." : "Actualiser")}</button></div></div></div></div><div class="p-8" data-v-67660fcc>`);
      if (isPlanFree(subscriptionData.value.plan) && subscriptionData.value.trialDaysLeft > 0) {
        _push(`<div class="mb-8" data-v-67660fcc><div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl overflow-hidden relative" data-v-67660fcc><div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse" data-v-67660fcc></div><div class="px-8 py-8 text-white relative" data-v-67660fcc><div class="flex items-center justify-between" data-v-67660fcc><div class="flex-1" data-v-67660fcc><div class="flex items-center mb-4" data-v-67660fcc><div class="mr-4" data-v-67660fcc><div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center" data-v-67660fcc><span class="text-2xl font-bold" data-v-67660fcc>${ssrInterpolate(subscriptionData.value.trialDaysLeft)}</span></div></div><div data-v-67660fcc><h2 class="text-3xl font-bold mb-2" data-v-67660fcc> \u{1F680} Essai gratuit : ${ssrInterpolate(subscriptionData.value.trialDaysLeft)} jour(s) restant(s) </h2><p class="text-blue-100 text-lg" data-v-67660fcc> Profitez de toutes les fonctionnalit\xE9s Starter gratuitement pendant 7 jours. <br data-v-67660fcc><span class="font-semibold text-yellow-200" data-v-67660fcc> Apr\xE8s ${ssrInterpolate(subscriptionData.value.trialDaysLeft)} jour(s), choisissez un plan pour continuer. </span></p></div></div><div class="flex flex-wrap gap-4" data-v-67660fcc><button class="inline-flex items-center px-8 py-4 bg-white bg-opacity-20 rounded-xl text-white font-bold text-lg hover:bg-opacity-30 transition-all backdrop-blur-sm shadow-lg" data-v-67660fcc><svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-v-67660fcc></path></svg> Choisir Starter (14\u20AC/mois) </button><button class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-gray-900 font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all shadow-lg" data-v-67660fcc><svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" data-v-67660fcc></path></svg> Passer au Pro (29\u20AC/mois) </button></div></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isPlanFree(subscriptionData.value.plan) && subscriptionData.value.trialDaysLeft === 0) {
        _push(`<div class="mb-8" data-v-67660fcc><div class="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-xl overflow-hidden" data-v-67660fcc><div class="px-8 py-8 text-white relative" data-v-67660fcc><div class="flex items-center justify-between" data-v-67660fcc><div class="flex-1" data-v-67660fcc><div class="flex items-center mb-4" data-v-67660fcc><div class="mr-4" data-v-67660fcc><div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center" data-v-67660fcc><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-67660fcc></path></svg></div></div><div data-v-67660fcc><h2 class="text-3xl font-bold mb-2" data-v-67660fcc>\u23F0 Essai gratuit termin\xE9</h2><p class="text-red-100 text-lg" data-v-67660fcc> Votre Vendeur IA et votre widget sont maintenant <span class="font-bold" data-v-67660fcc>d\xE9sactiv\xE9s</span>. <br data-v-67660fcc><span class="font-semibold text-yellow-200" data-v-67660fcc> Choisissez un plan pour r\xE9activer votre Vendeur IA ! </span></p></div></div><div class="bg-red-800 bg-opacity-50 rounded-lg p-4 mb-6" data-v-67660fcc><h3 class="font-semibold mb-2" data-v-67660fcc>\u{1F6AB} Fonctionnalit\xE9s d\xE9sactiv\xE9es :</h3><ul class="text-sm text-red-100 space-y-1" data-v-67660fcc><li data-v-67660fcc>\u2022 Votre Vendeur IA ne r\xE9pond plus aux visiteurs</li><li data-v-67660fcc>\u2022 Le widget ChatSeller est invisible sur votre site</li><li data-v-67660fcc>\u2022 Aucune nouvelle conversation ne peut \xEAtre cr\xE9\xE9e</li><li data-v-67660fcc>\u2022 L&#39;acc\xE8s \xE0 la configuration est restreint</li></ul></div><div class="flex flex-wrap gap-4" data-v-67660fcc><button class="inline-flex items-center px-8 py-4 bg-white bg-opacity-20 rounded-xl text-white font-bold text-lg hover:bg-opacity-30 transition-all backdrop-blur-sm shadow-lg" data-v-67660fcc><svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-v-67660fcc></path></svg> Choisir Starter (14\u20AC/mois) </button><button class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-gray-900 font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all shadow-lg" data-v-67660fcc><svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" data-v-67660fcc></path></svg> Passer au Pro (29\u20AC/mois) </button></div></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8" data-v-67660fcc><div class="lg:col-span-2 space-y-8" data-v-67660fcc><div class="card-modern" data-v-67660fcc><div class="flex items-center justify-between mb-6" data-v-67660fcc><h2 class="text-xl font-semibold text-gray-900" data-v-67660fcc>Plan actuel</h2>`);
      if (isPlanFree(subscriptionData.value.plan)) {
        _push(`<div class="plan-upgrade-badge" data-v-67660fcc><span class="text-xs font-medium" data-v-67660fcc>Choisissez un plan pour continuer</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="${ssrRenderClass([getPlanCardClass(subscriptionData.value.plan), "current-plan-card"])}" data-v-67660fcc><div class="flex items-center justify-between" data-v-67660fcc><div class="flex items-center space-x-4" data-v-67660fcc><div class="${ssrRenderClass([getPlanIconClass(subscriptionData.value.plan), "plan-icon"])}" data-v-67660fcc><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", getPlanIcon(subscriptionData.value.plan))} data-v-67660fcc></path></svg></div><div data-v-67660fcc><h3 class="text-xl font-bold capitalize" data-v-67660fcc>${ssrInterpolate(getPlanName(subscriptionData.value.plan))}</h3><p class="text-gray-600" data-v-67660fcc>${ssrInterpolate(getPlanPrice(subscriptionData.value.plan))}</p></div></div><div class="text-right" data-v-67660fcc><span class="${ssrRenderClass([getStatusBadgeClass(subscriptionData.value.plan), "plan-status-badge"])}" data-v-67660fcc>${ssrInterpolate(getStatusLabel(subscriptionData.value.plan))}</span>`);
      if (subscriptionData.value.nextBillingDate && subscriptionData.value.isActive && !isPlanFree(subscriptionData.value.plan)) {
        _push(`<p class="text-sm text-gray-500 mt-2" data-v-67660fcc> Prochain paiement : ${ssrInterpolate(formatDate(subscriptionData.value.nextBillingDate))}</p>`);
      } else if (subscriptionData.value.trialDaysLeft > 0) {
        _push(`<p class="text-sm text-blue-600 mt-2 font-medium" data-v-67660fcc> Fin d&#39;essai : ${ssrInterpolate(formatDate(subscriptionData.value.trialEndDate))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4" data-v-67660fcc><!--[-->`);
      ssrRenderList(getCurrentPlanFeatures(), (feature) => {
        _push(`<div class="flex items-center space-x-2" data-v-67660fcc><svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-67660fcc></path></svg><span class="text-sm text-gray-700" data-v-67660fcc>${ssrInterpolate(feature)}</span></div>`);
      });
      _push(`<!--]--></div><div class="mt-6 flex flex-wrap gap-3" data-v-67660fcc>`);
      if (subscriptionData.value.plan === "free") {
        _push(`<button class="btn-primary" data-v-67660fcc><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-v-67660fcc></path></svg> ${ssrInterpolate(subscriptionData.value.trialDaysLeft > 0 ? "Choisir un plan" : "R\xE9activer votre Vendeur IA")}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (subscriptionData.value.plan === "starter" && subscriptionData.value.isActive) {
        _push(`<button class="btn-primary" data-v-67660fcc><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-v-67660fcc></path></svg> Passer au Pro </button>`);
      } else {
        _push(`<!---->`);
      }
      if (subscriptionData.value.isActive && !isPlanFree(subscriptionData.value.plan)) {
        _push(`<button class="btn-secondary" data-v-67660fcc><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-v-67660fcc></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-67660fcc></path></svg> G\xE9rer l&#39;abonnement </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (!isPlanPro(subscriptionData.value.plan)) {
        _push(`<div class="card-modern" data-v-67660fcc><div class="mb-8 text-center" data-v-67660fcc><h2 class="text-3xl font-bold text-gray-900 mb-4" data-v-67660fcc>Choisissez votre plan</h2><p class="text-lg text-gray-600" data-v-67660fcc>D\xE9verrouillez tout le potentiel de ChatSeller</p></div><div class="grid md:grid-cols-2 gap-8" data-v-67660fcc><div class="plan-card" data-v-67660fcc><div class="plan-card-header" data-v-67660fcc><div class="text-center mb-6" data-v-67660fcc><div class="plan-icon-large bg-blue-600" data-v-67660fcc><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-67660fcc></path></svg></div><h3 class="text-2xl font-bold mb-2" data-v-67660fcc>Starter</h3><div class="pricing" data-v-67660fcc><span class="price" data-v-67660fcc>14\u20AC</span><span class="period" data-v-67660fcc>/mois</span></div><p class="text-gray-600" data-v-67660fcc>Pour d\xE9buter avec l&#39;IA commerciale</p></div></div><div class="plan-features" data-v-67660fcc><!--[-->`);
        ssrRenderList(((_a = availablePlans.value.starter) == null ? void 0 : _a.features) || starterFeatures, (feature) => {
          _push(`<div class="feature-item" data-v-67660fcc><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-67660fcc></path></svg><span data-v-67660fcc>${ssrInterpolate(feature)}</span></div>`);
        });
        _push(`<!--]--></div><div class="plan-card-footer" data-v-67660fcc><button${ssrIncludeBooleanAttr(loading.value.subscription || subscriptionData.value.plan === "starter") ? " disabled" : ""} class="btn-plan-secondary" data-v-67660fcc>`);
        if (loading.value.subscription && selectedPlan.value === "starter") {
          _push(`<span data-v-67660fcc><svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" data-v-67660fcc><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-67660fcc></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-67660fcc></path></svg> Traitement... </span>`);
        } else if (subscriptionData.value.plan === "starter") {
          _push(`<span data-v-67660fcc>Plan actuel</span>`);
        } else {
          _push(`<span data-v-67660fcc>Choisir Starter</span>`);
        }
        _push(`</button><div class="plan-guarantee" data-v-67660fcc><svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.065.01l.032.006M12 21a9 9 0 110-18 9 9 0 010 18z" data-v-67660fcc></path></svg><span class="text-xs text-gray-600" data-v-67660fcc>Annulation possible \xE0 tout moment</span></div></div></div><div class="plan-card plan-card-featured" data-v-67660fcc><div class="plan-card-header" data-v-67660fcc><div class="popular-badge" data-v-67660fcc><span class="text-sm font-bold" data-v-67660fcc>\u2B50 Recommand\xE9</span></div><div class="text-center mb-6" data-v-67660fcc><div class="plan-icon-large bg-purple-600" data-v-67660fcc><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" data-v-67660fcc></path></svg></div><h3 class="text-2xl font-bold mb-2" data-v-67660fcc>Pro</h3><div class="pricing" data-v-67660fcc><span class="price" data-v-67660fcc>29\u20AC</span><span class="period" data-v-67660fcc>/mois</span></div><p class="text-gray-600" data-v-67660fcc>Pour les e-commer\xE7ants ambitieux</p></div></div><div class="plan-features" data-v-67660fcc><!--[-->`);
        ssrRenderList(((_b = availablePlans.value.pro) == null ? void 0 : _b.features) || proFeatures, (feature) => {
          _push(`<div class="feature-item" data-v-67660fcc><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-67660fcc></path></svg><span data-v-67660fcc>${ssrInterpolate(feature)}</span></div>`);
        });
        _push(`<!--]--></div><div class="plan-card-footer" data-v-67660fcc><button${ssrIncludeBooleanAttr(loading.value.subscription || subscriptionData.value.plan === "pro") ? " disabled" : ""} class="btn-plan-primary" data-v-67660fcc>`);
        if (loading.value.subscription && selectedPlan.value === "pro") {
          _push(`<span data-v-67660fcc><svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" data-v-67660fcc><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-67660fcc></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-67660fcc></path></svg> Traitement... </span>`);
        } else if (subscriptionData.value.plan === "pro") {
          _push(`<span data-v-67660fcc>Plan actuel</span>`);
        } else {
          _push(`<span data-v-67660fcc>Passer au Pro</span>`);
        }
        _push(`</button><div class="plan-guarantee" data-v-67660fcc><svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.065.01l.032.006M12 21a9 9 0 110-18 9 9 0 010 18z" data-v-67660fcc></path></svg><span class="text-xs text-gray-600" data-v-67660fcc>Annulation possible \xE0 tout moment</span></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isPlanPro(subscriptionData.value.plan) && subscriptionData.value.isActive) {
        _push(`<div class="card-modern" data-v-67660fcc><div class="mb-6 text-center" data-v-67660fcc><h2 class="text-2xl font-bold text-gray-900 mb-4" data-v-67660fcc>\u{1F389} Vos fonctionnalit\xE9s Pro</h2><p class="text-gray-600" data-v-67660fcc>Profitez de toutes ces fonctionnalit\xE9s avanc\xE9es</p></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-v-67660fcc><!--[-->`);
        ssrRenderList(((_c = availablePlans.value.pro) == null ? void 0 : _c.features) || proFeatures, (feature) => {
          _push(`<div class="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6" data-v-67660fcc><div class="flex items-center space-x-3" data-v-67660fcc><div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center" data-v-67660fcc><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-67660fcc></path></svg></div><span class="text-sm font-medium text-gray-900" data-v-67660fcc>${ssrInterpolate(feature)}</span></div></div>`);
        });
        _push(`<!--]--></div><div class="mt-8 text-center" data-v-67660fcc>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/vendeurs-ia",
          class: "inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" data-v-67660fcc${_scopeId}></path></svg> Commencer \xE0 cr\xE9er vos Vendeurs IA `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  })
                ])),
                createTextVNode(" Commencer \xE0 cr\xE9er vos Vendeurs IA ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="lg:col-span-1 space-y-6" data-v-67660fcc>`);
      if (isPlanFree(subscriptionData.value.plan) && subscriptionData.value.trialDaysLeft > 0) {
        _push(`<div class="card-modern bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" data-v-67660fcc><h3 class="text-lg font-semibold text-gray-900 mb-4" data-v-67660fcc>\u{1F3AF} Votre essai gratuit</h3><div class="text-center mb-6" data-v-67660fcc><div class="relative inline-flex items-center justify-center w-24 h-24 mb-4" data-v-67660fcc><svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36" data-v-67660fcc><circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" stroke-width="2" data-v-67660fcc></circle><circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" stroke-width="2"${ssrRenderAttr("stroke-dasharray", `${(7 - subscriptionData.value.trialDaysLeft) * 14.28} 100`)} data-v-67660fcc></circle></svg><div class="absolute inset-0 flex items-center justify-center" data-v-67660fcc><span class="text-2xl font-bold text-blue-600" data-v-67660fcc>${ssrInterpolate(subscriptionData.value.trialDaysLeft)}</span></div></div><p class="text-sm text-gray-600" data-v-67660fcc>jour(s) restant(s)</p></div><div class="space-y-3" data-v-67660fcc><div class="flex items-center justify-between text-sm" data-v-67660fcc><span class="text-gray-600" data-v-67660fcc>Vendeur IA actif</span><span class="text-green-600 font-medium" data-v-67660fcc>\u2713 Oui</span></div><div class="flex items-center justify-between text-sm" data-v-67660fcc><span class="text-gray-600" data-v-67660fcc>Widget fonctionnel</span><span class="text-green-600 font-medium" data-v-67660fcc>\u2713 Oui</span></div><div class="flex items-center justify-between text-sm" data-v-67660fcc><span class="text-gray-600" data-v-67660fcc>Conversations illimit\xE9es</span><span class="text-green-600 font-medium" data-v-67660fcc>\u2713 Oui</span></div></div><button class="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors" data-v-67660fcc> Souscrire maintenant </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card-modern bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" data-v-67660fcc><h3 class="text-lg font-semibold text-gray-900 mb-4" data-v-67660fcc>Besoin d&#39;aide ?</h3><div class="space-y-3" data-v-67660fcc><button class="support-button" data-v-67660fcc><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-v-67660fcc></path></svg><span data-v-67660fcc>Contacter le support</span></button><button class="support-button" data-v-67660fcc><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-67660fcc></path></svg><span data-v-67660fcc>Documentation</span></button><button class="support-button" data-v-67660fcc><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-67660fcc></path></svg><span data-v-67660fcc>Planifier une d\xE9mo</span></button></div><div class="mt-4 p-3 bg-white bg-opacity-70 rounded-lg" data-v-67660fcc><p class="text-xs text-gray-600 text-center" data-v-67660fcc> \u{1F4A1} <strong data-v-67660fcc>Astuce :</strong> Consultez notre guide de d\xE9marrage pour optimiser vos conversions </p></div></div></div></div></div>`);
      if (successModal.value.show) {
        _push(`<div class="fixed inset-0 z-50 overflow-y-auto" data-v-67660fcc><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0" data-v-67660fcc><div class="fixed inset-0 transition-opacity" aria-hidden="true" data-v-67660fcc><div class="absolute inset-0 bg-gray-500 opacity-75" data-v-67660fcc></div></div><span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true" data-v-67660fcc>\u200B</span><div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" data-v-67660fcc><div data-v-67660fcc><div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100" data-v-67660fcc><svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-67660fcc></path></svg></div><div class="mt-3 text-center sm:mt-5" data-v-67660fcc><h3 class="text-2xl leading-6 font-bold text-gray-900" data-v-67660fcc> \u{1F389} Paiement confirm\xE9 ! </h3><div class="mt-4" data-v-67660fcc><p class="text-lg text-gray-600 mb-4" data-v-67660fcc> F\xE9licitations ! Vous \xEAtes maintenant abonn\xE9 au plan <strong data-v-67660fcc>${ssrInterpolate(successModal.value.planName)}</strong>. </p><div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4" data-v-67660fcc><h4 class="font-semibold text-green-800 mb-2" data-v-67660fcc>\u2705 Votre Vendeur IA est maintenant actif !</h4><ul class="text-sm text-green-700 space-y-1" data-v-67660fcc><li data-v-67660fcc>\u2022 Widget ChatSeller activ\xE9 sur votre site</li><li data-v-67660fcc>\u2022 Conversations illimit\xE9es disponibles</li><li data-v-67660fcc>\u2022 Acc\xE8s \xE0 toutes les fonctionnalit\xE9s du plan</li><li data-v-67660fcc>\u2022 Analytics d\xE9taill\xE9es activ\xE9es</li></ul></div><p class="text-sm text-gray-500" data-v-67660fcc> Un email de confirmation a \xE9t\xE9 envoy\xE9 \xE0 votre adresse. </p></div></div></div><div class="mt-6 sm:mt-8" data-v-67660fcc><div class="flex flex-col sm:flex-row gap-3" data-v-67660fcc><button class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm" data-v-67660fcc><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" data-v-67660fcc></path></svg> Configurer mon Vendeur IA </button><button class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm" data-v-67660fcc> Continuer sur le tableau de bord </button></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (notification.value.show) {
        _push(`<div class="${ssrRenderClass([{
          "border-green-200 bg-green-50": notification.value.type === "success",
          "border-red-200 bg-red-50": notification.value.type === "error"
        }, "fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4"])}" data-v-67660fcc><div class="flex items-center" data-v-67660fcc><div class="flex-shrink-0" data-v-67660fcc>`);
        if (notification.value.type === "success") {
          _push(`<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-67660fcc></path></svg>`);
        } else {
          _push(`<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-67660fcc></path></svg>`);
        }
        _push(`</div><div class="ml-3" data-v-67660fcc><p class="${ssrRenderClass([{
          "text-green-800": notification.value.type === "success",
          "text-red-800": notification.value.type === "error"
        }, "text-sm font-medium"])}" data-v-67660fcc>${ssrInterpolate(notification.value.message)}</p></div><div class="ml-auto pl-3" data-v-67660fcc><button class="text-gray-400 hover:text-gray-600" data-v-67660fcc><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-67660fcc><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-67660fcc></path></svg></button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/billing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const billing = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-67660fcc"]]);

export { billing as default };
//# sourceMappingURL=billing-mgTq9GeV.mjs.map
