import { defineComponent, computed, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { u as useAuthStore, a as useApi } from './auth-KgQDcdck.mjs';
import { u as useHead } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './useSupabase-CFkBc_As.mjs';
import '@supabase/supabase-js';
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
  __name: "analytics",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useApi();
    const planDetails = computed(() => authStore.planDetails);
    const isAdvancedPlan = computed(() => {
      const code = planDetails.value.code;
      return ["pro", "professional", "enterprise"].includes(code);
    });
    const loading = ref(false);
    const selectedPeriod = ref("30d");
    ref();
    ref();
    const analytics2 = ref({
      conversations: { current: 0, previous: 0, growth: 0 },
      orders: { current: 0, previous: 0, growth: 0 },
      revenue: { current: 0, previous: 0, growth: 0 },
      conversionRate: { current: 0, previous: 0 }
    });
    const detailedAnalytics = ref({
      performance: {
        totalConversations: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0
      },
      conversationHistory: [],
      orderHistory: []
    });
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
      }).format(amount);
    };
    const formatGrowth = (growth) => {
      const sign = growth >= 0 ? "+" : "";
      return `${sign}${growth.toFixed(1)}%`;
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short"
      });
    };
    const getGrowthClass = (growth) => {
      if (growth > 0) return "text-green-600";
      if (growth < 0) return "text-red-600";
      return "text-gray-500";
    };
    const getConversionGrowthClass = () => {
      var _a, _b;
      const current = ((_a = analytics2.value.conversionRate) == null ? void 0 : _a.current) || 0;
      const previous = ((_b = analytics2.value.conversionRate) == null ? void 0 : _b.previous) || 0;
      if (current > previous) return "text-green-600";
      if (current < previous) return "text-red-600";
      return "text-gray-500";
    };
    const getConversionGrowthText = () => {
      var _a, _b;
      const current = ((_a = analytics2.value.conversionRate) == null ? void 0 : _a.current) || 0;
      const previous = ((_b = analytics2.value.conversionRate) == null ? void 0 : _b.previous) || 0;
      if (previous === 0) return "Premi\xE8re p\xE9riode";
      const diff = current - previous;
      const sign = diff >= 0 ? "+" : "";
      return `${sign}${diff.toFixed(1)}% vs pr\xE9c\xE9dente`;
    };
    const getPeriodLabel = () => {
      switch (selectedPeriod.value) {
        case "7d":
          return "7 derniers jours";
        case "30d":
          return "30 derniers jours";
        case "90d":
          return "90 derniers jours";
        default:
          return "30 derniers jours";
      }
    };
    const getPerformanceClass = () => {
      var _a;
      const rate = ((_a = analytics2.value.conversionRate) == null ? void 0 : _a.current) || 0;
      if (rate >= 15) return "bg-green-50 border border-green-200";
      if (rate >= 5) return "bg-yellow-50 border border-yellow-200";
      return "bg-red-50 border border-red-200";
    };
    const getPerformanceIconClass = () => {
      var _a;
      const rate = ((_a = analytics2.value.conversionRate) == null ? void 0 : _a.current) || 0;
      if (rate >= 15) return "text-green-400";
      if (rate >= 5) return "text-yellow-400";
      return "text-red-400";
    };
    const getPerformanceTextClass = () => {
      var _a;
      const rate = ((_a = analytics2.value.conversionRate) == null ? void 0 : _a.current) || 0;
      if (rate >= 15) return "text-green-800";
      if (rate >= 5) return "text-yellow-800";
      return "text-red-800";
    };
    const getPerformanceSubTextClass = () => {
      var _a;
      const rate = ((_a = analytics2.value.conversionRate) == null ? void 0 : _a.current) || 0;
      if (rate >= 15) return "text-green-700";
      if (rate >= 5) return "text-yellow-700";
      return "text-red-700";
    };
    const getPerformanceStatus = () => {
      var _a;
      const rate = ((_a = analytics2.value.conversionRate) == null ? void 0 : _a.current) || 0;
      if (rate >= 15) return "Performance excellente";
      if (rate >= 5) return "Performance correcte";
      return "Performance \xE0 am\xE9liorer";
    };
    const getPerformanceMessage = () => {
      var _a;
      const rate = ((_a = analytics2.value.conversionRate) == null ? void 0 : _a.current) || 0;
      if (rate >= 15) return "Votre agent convertit tr\xE8s bien";
      if (rate >= 5) return "Il y a une marge d'am\xE9lioration";
      return "Optimisation fortement recommand\xE9e";
    };
    useHead({
      title: "Analytics - ChatSeller Dashboard",
      meta: [
        { name: "description", content: "Suivez les performances de vos vendeurs IA ChatSeller" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-edf6dd16><div class="bg-white shadow-sm border-b border-gray-200" data-v-edf6dd16><div class="px-8 py-6" data-v-edf6dd16><div class="flex items-center justify-between" data-v-edf6dd16><div data-v-edf6dd16><h1 class="text-3xl font-bold text-gray-900" data-v-edf6dd16>Analytics</h1><p class="mt-2 text-gray-600" data-v-edf6dd16> Suivez les performances de vos Vendeurs IA `);
      if (planDetails.value.code === "starter") {
        _push(`<span class="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded" data-v-edf6dd16> Plan ${ssrInterpolate(planDetails.value.name)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div><div class="flex items-center space-x-4" data-v-edf6dd16>`);
      if (isAdvancedPlan.value) {
        _push(`<select class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" data-v-edf6dd16><option value="7d" data-v-edf6dd16${ssrIncludeBooleanAttr(Array.isArray(selectedPeriod.value) ? ssrLooseContain(selectedPeriod.value, "7d") : ssrLooseEqual(selectedPeriod.value, "7d")) ? " selected" : ""}>7 derniers jours</option><option value="30d" data-v-edf6dd16${ssrIncludeBooleanAttr(Array.isArray(selectedPeriod.value) ? ssrLooseContain(selectedPeriod.value, "30d") : ssrLooseEqual(selectedPeriod.value, "30d")) ? " selected" : ""}>30 derniers jours</option><option value="90d" data-v-edf6dd16${ssrIncludeBooleanAttr(Array.isArray(selectedPeriod.value) ? ssrLooseContain(selectedPeriod.value, "90d") : ssrLooseEqual(selectedPeriod.value, "90d")) ? " selected" : ""}>90 derniers jours</option></select>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors" data-v-edf6dd16><svg class="${ssrRenderClass([{ "animate-spin": loading.value }, "w-4 h-4 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-edf6dd16><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-edf6dd16></path></svg> ${ssrInterpolate(loading.value ? "Actualisation..." : "Actualiser")}</button></div></div></div></div><div class="p-8" data-v-edf6dd16><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-v-edf6dd16><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow" data-v-edf6dd16><div class="flex items-center" data-v-edf6dd16><div class="p-3 bg-blue-100 rounded-xl" data-v-edf6dd16><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-edf6dd16><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-edf6dd16></path></svg></div><div class="ml-4 flex-1" data-v-edf6dd16><p class="text-sm font-medium text-gray-600" data-v-edf6dd16>Conversations</p><p class="text-2xl font-bold text-gray-900" data-v-edf6dd16>${ssrInterpolate(((_b = (_a = analytics2.value.conversations) == null ? void 0 : _a.current) == null ? void 0 : _b.toLocaleString()) || 0)}</p>`);
      if (((_c = analytics2.value.conversations) == null ? void 0 : _c.growth) !== void 0) {
        _push(`<p class="${ssrRenderClass([getGrowthClass(analytics2.value.conversations.growth), "text-xs mt-1"])}" data-v-edf6dd16>${ssrInterpolate(formatGrowth(analytics2.value.conversations.growth))} vs p\xE9riode pr\xE9c\xE9dente </p>`);
      } else {
        _push(`<p class="text-xs text-gray-500 mt-1" data-v-edf6dd16>Pas de donn\xE9es pr\xE9c\xE9dentes</p>`);
      }
      _push(`</div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow" data-v-edf6dd16><div class="flex items-center" data-v-edf6dd16><div class="p-3 bg-green-100 rounded-xl" data-v-edf6dd16><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-edf6dd16><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-edf6dd16></path></svg></div><div class="ml-4 flex-1" data-v-edf6dd16><p class="text-sm font-medium text-gray-600" data-v-edf6dd16>Commandes</p><p class="text-2xl font-bold text-gray-900" data-v-edf6dd16>${ssrInterpolate(((_e = (_d = analytics2.value.orders) == null ? void 0 : _d.current) == null ? void 0 : _e.toLocaleString()) || 0)}</p>`);
      if (((_f = analytics2.value.orders) == null ? void 0 : _f.growth) !== void 0) {
        _push(`<p class="${ssrRenderClass([getGrowthClass(analytics2.value.orders.growth), "text-xs mt-1"])}" data-v-edf6dd16>${ssrInterpolate(formatGrowth(analytics2.value.orders.growth))} vs p\xE9riode pr\xE9c\xE9dente </p>`);
      } else {
        _push(`<p class="text-xs text-gray-500 mt-1" data-v-edf6dd16>Pas de donn\xE9es pr\xE9c\xE9dentes</p>`);
      }
      _push(`</div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow" data-v-edf6dd16><div class="flex items-center" data-v-edf6dd16><div class="p-3 bg-yellow-100 rounded-xl" data-v-edf6dd16><svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-edf6dd16><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" data-v-edf6dd16></path></svg></div><div class="ml-4 flex-1" data-v-edf6dd16><p class="text-sm font-medium text-gray-600" data-v-edf6dd16>Revenus</p><p class="text-2xl font-bold text-gray-900" data-v-edf6dd16>${ssrInterpolate(formatCurrency(((_g = analytics2.value.revenue) == null ? void 0 : _g.current) || 0))}</p>`);
      if (((_h = analytics2.value.revenue) == null ? void 0 : _h.growth) !== void 0) {
        _push(`<p class="${ssrRenderClass([getGrowthClass(analytics2.value.revenue.growth), "text-xs mt-1"])}" data-v-edf6dd16>${ssrInterpolate(formatGrowth(analytics2.value.revenue.growth))} vs p\xE9riode pr\xE9c\xE9dente </p>`);
      } else {
        _push(`<p class="text-xs text-gray-500 mt-1" data-v-edf6dd16>Pas de donn\xE9es pr\xE9c\xE9dentes</p>`);
      }
      _push(`</div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow" data-v-edf6dd16><div class="flex items-center" data-v-edf6dd16><div class="p-3 bg-purple-100 rounded-xl" data-v-edf6dd16><svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-edf6dd16><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" data-v-edf6dd16></path></svg></div><div class="ml-4 flex-1" data-v-edf6dd16><p class="text-sm font-medium text-gray-600" data-v-edf6dd16>Taux de conversion</p><p class="text-2xl font-bold text-gray-900" data-v-edf6dd16>${ssrInterpolate((((_i = analytics2.value.conversionRate) == null ? void 0 : _i.current) || 0).toFixed(1))}%</p>`);
      if (((_j = analytics2.value.conversionRate) == null ? void 0 : _j.previous) !== void 0) {
        _push(`<p class="${ssrRenderClass([getConversionGrowthClass(), "text-xs mt-1"])}" data-v-edf6dd16>${ssrInterpolate(getConversionGrowthText())}</p>`);
      } else {
        _push(`<p class="text-xs text-gray-500 mt-1" data-v-edf6dd16>Pas de donn\xE9es pr\xE9c\xE9dentes</p>`);
      }
      _push(`</div></div></div></div>`);
      if (isAdvancedPlan.value) {
        _push(`<div data-v-edf6dd16><div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-v-edf6dd16><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-v-edf6dd16><div class="flex items-center justify-between mb-6" data-v-edf6dd16><h3 class="text-lg font-semibold text-gray-900" data-v-edf6dd16>\xC9volution des conversations</h3><div class="flex items-center space-x-2 text-sm text-gray-500" data-v-edf6dd16><div class="w-3 h-3 bg-blue-500 rounded-full" data-v-edf6dd16></div><span data-v-edf6dd16>Conversations quotidiennes</span></div></div><div class="h-64" data-v-edf6dd16><canvas data-v-edf6dd16></canvas></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-v-edf6dd16><div class="flex items-center justify-between mb-6" data-v-edf6dd16><h3 class="text-lg font-semibold text-gray-900" data-v-edf6dd16>\xC9volution des revenus</h3><div class="flex items-center space-x-2 text-sm text-gray-500" data-v-edf6dd16><div class="w-3 h-3 bg-green-500 rounded-full" data-v-edf6dd16></div><span data-v-edf6dd16>Revenus quotidiens (\u20AC)</span></div></div><div class="h-64" data-v-edf6dd16><canvas data-v-edf6dd16></canvas></div></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-v-edf6dd16><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-v-edf6dd16><h3 class="text-lg font-semibold text-gray-900 mb-6" data-v-edf6dd16>M\xE9triques de performance</h3><div class="space-y-6" data-v-edf6dd16><div class="flex items-center justify-between" data-v-edf6dd16><div data-v-edf6dd16><p class="text-sm font-medium text-gray-900" data-v-edf6dd16>Panier moyen</p><p class="text-xs text-gray-500" data-v-edf6dd16>Valeur commande</p></div><div class="text-right" data-v-edf6dd16><p class="text-lg font-bold text-purple-600" data-v-edf6dd16>${ssrInterpolate(formatCurrency(((_k = detailedAnalytics.value.performance) == null ? void 0 : _k.averageOrderValue) || 0))}</p></div></div><div class="flex items-center justify-between" data-v-edf6dd16><div data-v-edf6dd16><p class="text-sm font-medium text-gray-900" data-v-edf6dd16>Total conversations</p><p class="text-xs text-gray-500" data-v-edf6dd16>Toutes p\xE9riodes</p></div><div class="text-right" data-v-edf6dd16><p class="text-lg font-bold text-blue-600" data-v-edf6dd16>${ssrInterpolate((((_l = detailedAnalytics.value.performance) == null ? void 0 : _l.totalConversations) || 0).toLocaleString())}</p></div></div><div class="flex items-center justify-between" data-v-edf6dd16><div data-v-edf6dd16><p class="text-sm font-medium text-gray-900" data-v-edf6dd16>Total commandes</p><p class="text-xs text-gray-500" data-v-edf6dd16>Toutes p\xE9riodes</p></div><div class="text-right" data-v-edf6dd16><p class="text-lg font-bold text-green-600" data-v-edf6dd16>${ssrInterpolate((((_m = detailedAnalytics.value.performance) == null ? void 0 : _m.totalOrders) || 0).toLocaleString())}</p></div></div><div class="flex items-center justify-between" data-v-edf6dd16><div data-v-edf6dd16><p class="text-sm font-medium text-gray-900" data-v-edf6dd16>Revenus totaux</p><p class="text-xs text-gray-500" data-v-edf6dd16>Toutes p\xE9riodes</p></div><div class="text-right" data-v-edf6dd16><p class="text-lg font-bold text-yellow-600" data-v-edf6dd16>${ssrInterpolate(formatCurrency(((_n = detailedAnalytics.value.performance) == null ? void 0 : _n.totalRevenue) || 0))}</p></div></div></div><div class="${ssrRenderClass([getPerformanceClass(), "mt-6 p-4 rounded-lg"])}" data-v-edf6dd16><div class="flex items-center" data-v-edf6dd16><div class="flex-shrink-0" data-v-edf6dd16><svg class="${ssrRenderClass([getPerformanceIconClass(), "h-5 w-5"])}" fill="currentColor" viewBox="0 0 20 20" data-v-edf6dd16>`);
        if ((((_o = analytics2.value.conversionRate) == null ? void 0 : _o.current) || 0) >= 15) {
          _push(`<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-edf6dd16></path>`);
        } else if ((((_p = analytics2.value.conversionRate) == null ? void 0 : _p.current) || 0) >= 5) {
          _push(`<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" data-v-edf6dd16></path>`);
        } else {
          _push(`<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" data-v-edf6dd16></path>`);
        }
        _push(`</svg></div><div class="ml-3" data-v-edf6dd16><p class="${ssrRenderClass([getPerformanceTextClass(), "text-sm font-medium"])}" data-v-edf6dd16>${ssrInterpolate(getPerformanceStatus())}</p><p class="${ssrRenderClass([getPerformanceSubTextClass(), "text-xs"])}" data-v-edf6dd16>${ssrInterpolate(getPerformanceMessage())}</p></div></div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-v-edf6dd16><div class="flex items-center justify-between mb-6" data-v-edf6dd16><h3 class="text-lg font-semibold text-gray-900" data-v-edf6dd16>Activit\xE9 r\xE9cente</h3><span class="text-xs text-gray-500" data-v-edf6dd16>${ssrInterpolate(getPeriodLabel())}</span></div>`);
        if (((_q = detailedAnalytics.value.conversationHistory) == null ? void 0 : _q.length) > 0 || ((_r = detailedAnalytics.value.orderHistory) == null ? void 0 : _r.length) > 0) {
          _push(`<div class="space-y-4" data-v-edf6dd16>`);
          if (((_s = detailedAnalytics.value.conversationHistory) == null ? void 0 : _s.slice(-3).length) > 0) {
            _push(`<div data-v-edf6dd16><h4 class="text-sm font-medium text-gray-700 mb-2" data-v-edf6dd16>Conversations r\xE9centes</h4><!--[-->`);
            ssrRenderList(detailedAnalytics.value.conversationHistory.slice(-3), (day) => {
              _push(`<div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg" data-v-edf6dd16><span class="text-sm text-gray-900" data-v-edf6dd16>${ssrInterpolate(formatDate(day.date))}</span><span class="text-sm font-medium text-blue-600" data-v-edf6dd16>${ssrInterpolate(day.count)} conversations</span></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          if (((_t = detailedAnalytics.value.orderHistory) == null ? void 0 : _t.slice(-3).length) > 0) {
            _push(`<div data-v-edf6dd16><h4 class="text-sm font-medium text-gray-700 mb-2" data-v-edf6dd16>Commandes r\xE9centes</h4><!--[-->`);
            ssrRenderList(detailedAnalytics.value.orderHistory.slice(-3), (day) => {
              _push(`<div class="flex items-center justify-between p-3 bg-green-50 rounded-lg" data-v-edf6dd16><span class="text-sm text-gray-900" data-v-edf6dd16>${ssrInterpolate(formatDate(day.date))}</span><div class="text-right" data-v-edf6dd16><span class="text-sm font-medium text-green-600" data-v-edf6dd16>${ssrInterpolate(day.count)} commandes</span><p class="text-xs text-green-700" data-v-edf6dd16>${ssrInterpolate(formatCurrency(day.revenue))}</p></div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="text-center py-8" data-v-edf6dd16><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" data-v-edf6dd16><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" data-v-edf6dd16></path></svg><p class="mt-2 text-sm text-gray-500" data-v-edf6dd16>Aucune activit\xE9 r\xE9cente</p><p class="text-xs text-gray-400" data-v-edf6dd16>L&#39;activit\xE9 appara\xEEtra ici</p></div>`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (planDetails.value.code === "starter") {
        _push(`<div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white" data-v-edf6dd16><div class="flex items-center space-x-6" data-v-edf6dd16><div class="flex-shrink-0" data-v-edf6dd16><svg class="h-12 w-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-edf6dd16><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" data-v-edf6dd16></path></svg></div><div class="flex-1" data-v-edf6dd16><h3 class="text-xl font-bold mb-2" data-v-edf6dd16>\u{1F680} D\xE9bloquez les Analytics Avanc\xE9es</h3><p class="text-blue-100 mb-4" data-v-edf6dd16> Passez au plan Pro pour acc\xE9der aux graphiques d\xE9taill\xE9s, historiques de performance, m\xE9triques avanc\xE9es et bien plus. </p><div class="flex flex-wrap gap-2 mb-4" data-v-edf6dd16><span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm" data-v-edf6dd16>\u{1F4CA} Graphiques historiques</span><span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm" data-v-edf6dd16>\u{1F4C8} M\xE9triques avanc\xE9es</span><span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm" data-v-edf6dd16>\u23F1\uFE0F Activit\xE9 en temps r\xE9el</span><span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm" data-v-edf6dd16>\u{1F4CB} Rapports d\xE9taill\xE9s</span></div><button class="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors" data-v-edf6dd16> Passer au Pro - ${ssrInterpolate(formatCurrency(29))}/mois </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (planDetails.value.hasExpired) {
        _push(`<div class="bg-red-50 border border-red-200 rounded-xl p-6" data-v-edf6dd16><div class="flex items-center space-x-4" data-v-edf6dd16><div class="flex-shrink-0" data-v-edf6dd16><svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-edf6dd16><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" data-v-edf6dd16></path></svg></div><div class="flex-1" data-v-edf6dd16><h3 class="text-lg font-medium text-red-800" data-v-edf6dd16>Essai gratuit expir\xE9</h3><p class="text-red-700 text-sm" data-v-edf6dd16> Votre essai gratuit de 7 jours est termin\xE9. Choisissez un plan pour continuer \xE0 utiliser ChatSeller. </p><button class="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors" data-v-edf6dd16> Choisir un plan </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center" data-v-edf6dd16><div class="bg-white rounded-xl p-6 shadow-xl" data-v-edf6dd16><div class="flex items-center space-x-3" data-v-edf6dd16><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" data-v-edf6dd16></div><span class="text-gray-700" data-v-edf6dd16>Chargement des analytics...</span></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/analytics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const analytics = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-edf6dd16"]]);

export { analytics as default };
//# sourceMappingURL=analytics-DjWauu9F.mjs.map
