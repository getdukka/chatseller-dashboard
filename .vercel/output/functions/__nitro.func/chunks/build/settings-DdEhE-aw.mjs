import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuthStore, a as useApi } from './auth-KgQDcdck.mjs';
import { f as useRoute, u as useHead } from './server.mjs';
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
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const route = useRoute();
    useApi();
    const initialLoading = ref(true);
    const loading = ref(false);
    const updating = ref(false);
    const updatingShop = ref(false);
    const exporting = ref(false);
    const savingNotifications = ref(false);
    const editingProfile = ref(false);
    const editingShop = ref(false);
    const showSuccessToast = ref(false);
    const showDeleteConfirmation = ref(false);
    const successMessage = ref("");
    const connectionStatus = ref("Connect\xE9");
    const tabs = [
      {
        id: "profil",
        label: "Profil",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      },
      {
        id: "boutique",
        label: "Boutique",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      },
      {
        id: "securite",
        label: "S\xE9curit\xE9",
        icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      },
      {
        id: "donnees",
        label: "Donn\xE9es",
        icon: "M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      }
    ];
    const activeTab = ref("profil");
    const profileForm = reactive({
      firstName: "",
      lastName: "",
      email: ""
    });
    const shopForm = reactive({
      name: "",
      domain: ""
    });
    const notificationSettings = reactive({
      emailConversations: true,
      emailOrders: true,
      emailReports: false
    });
    const shopData = ref(null);
    const accountStats = ref({
      totalConversations: 0,
      totalOrders: 0,
      totalRevenue: 0,
      conversionRate: 0,
      activeAgents: 0,
      documentsCount: 0
    });
    const userDisplayName = computed(() => {
      var _a;
      if (profileForm.firstName && profileForm.lastName) {
        return `${profileForm.firstName} ${profileForm.lastName}`;
      }
      return authStore.userName || ((_a = authStore.userEmail) == null ? void 0 : _a.split("@")[0]) || "Utilisateur";
    });
    const userInitials = computed(() => {
      if (profileForm.firstName && profileForm.lastName) {
        return `${profileForm.firstName[0]}${profileForm.lastName[0]}`.toUpperCase();
      }
      return authStore.userInitials;
    });
    const memberSince = computed(() => {
      var _a;
      if ((_a = authStore.user) == null ? void 0 : _a.createdAt) {
        return new Date(authStore.user.createdAt).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long"
        });
      }
      return "N/A";
    });
    const planDisplayName = computed(() => {
      const plan = authStore.currentPlan;
      switch (plan) {
        case "free":
          return "Essai Gratuit";
        case "starter":
          return "Starter";
        case "pro":
        case "professional":
          return "Pro";
        case "enterprise":
          return "Enterprise";
        default:
          return "Aucun plan";
      }
    });
    const planBadgeClass = computed(() => {
      const plan = authStore.currentPlan;
      switch (plan) {
        case "free":
          return "bg-gray-100 text-gray-800";
        case "starter":
          return "bg-blue-100 text-blue-800";
        case "pro":
        case "professional":
          return "bg-purple-100 text-purple-800";
        case "enterprise":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    });
    const planLimits = computed(() => {
      const plan = authStore.currentPlan;
      switch (plan) {
        case "free":
          return { agents: 1, documents: 10 };
        case "starter":
          return { agents: 1, documents: 10 };
        case "pro":
        case "professional":
          return { agents: 3, documents: 50 };
        case "enterprise":
          return { agents: -1, documents: -1 };
        default:
          return { agents: 0, documents: 0 };
      }
    });
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
      }).format(amount);
    };
    watch(() => route.query.tab, (newTab) => {
      if (newTab && typeof newTab === "string" && tabs.some((tab) => tab.id === newTab)) {
        activeTab.value = newTab;
      }
    }, { immediate: true });
    useHead({
      title: "Param\xE8tres - ChatSeller Dashboard"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-21b15eab><div class="bg-white shadow-sm border-b border-gray-200" data-v-21b15eab><div class="px-8 py-6" data-v-21b15eab><div class="flex items-center justify-between" data-v-21b15eab><div data-v-21b15eab><h1 class="text-3xl font-bold text-gray-900" data-v-21b15eab>Param\xE8tres du compte</h1><p class="mt-2 text-gray-600" data-v-21b15eab> G\xE9rez votre profil, votre boutique et vos pr\xE9f\xE9rences </p></div><div class="flex items-center space-x-4" data-v-21b15eab><div class="flex items-center space-x-2" data-v-21b15eab><div class="w-2 h-2 bg-green-500 rounded-full" data-v-21b15eab></div><span class="text-sm text-gray-600" data-v-21b15eab>${ssrInterpolate(connectionStatus.value)}</span></div><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors" data-v-21b15eab><svg class="${ssrRenderClass([{ "animate-spin": loading.value }, "w-4 h-4 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-21b15eab></path></svg> Actualiser </button></div></div></div></div><div class="p-8" data-v-21b15eab><div class="border-b border-gray-200 mb-8" data-v-21b15eab><nav class="-mb-px flex space-x-8" data-v-21b15eab><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([
          "py-3 px-1 border-b-2 font-medium text-sm transition-colors",
          activeTab.value === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        ])}" data-v-21b15eab><svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", tab.icon)} data-v-21b15eab></path></svg> ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></nav></div>`);
      if (initialLoading.value) {
        _push(`<div class="flex items-center justify-center py-12" data-v-21b15eab><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-v-21b15eab></div></div>`);
      } else {
        _push(`<div class="max-w-6xl" data-v-21b15eab><div style="${ssrRenderStyle(activeTab.value === "profil" ? null : { display: "none" })}" class="space-y-8" data-v-21b15eab><div class="grid grid-cols-1 lg:grid-cols-3 gap-8" data-v-21b15eab><div class="lg:col-span-2" data-v-21b15eab><div class="card-modern" data-v-21b15eab><div class="flex items-center justify-between mb-6" data-v-21b15eab><h2 class="text-xl font-semibold text-gray-900" data-v-21b15eab>Informations personnelles</h2><button class="${ssrRenderClass([editingProfile.value ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-blue-50 text-blue-700 hover:bg-blue-100", "inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"])}" data-v-21b15eab><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-21b15eab></path></svg> ${ssrInterpolate(editingProfile.value ? "Annuler" : "Modifier")}</button></div><form class="space-y-6" data-v-21b15eab><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-21b15eab><div data-v-21b15eab><label for="firstName" class="block text-sm font-medium text-gray-700 mb-2" data-v-21b15eab> Pr\xE9nom </label><input id="firstName"${ssrRenderAttr("value", profileForm.firstName)} type="text"${ssrIncludeBooleanAttr(!editingProfile.value) ? " disabled" : ""} class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500" placeholder="Votre pr\xE9nom" data-v-21b15eab></div><div data-v-21b15eab><label for="lastName" class="block text-sm font-medium text-gray-700 mb-2" data-v-21b15eab> Nom </label><input id="lastName"${ssrRenderAttr("value", profileForm.lastName)} type="text"${ssrIncludeBooleanAttr(!editingProfile.value) ? " disabled" : ""} class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500" placeholder="Votre nom" data-v-21b15eab></div></div><div data-v-21b15eab><label for="email" class="block text-sm font-medium text-gray-700 mb-2" data-v-21b15eab> Adresse email </label><input id="email"${ssrRenderAttr("value", profileForm.email)} type="email" disabled class="input-modern w-full bg-gray-50 text-gray-500" placeholder="votre@email.com" data-v-21b15eab><p class="text-xs text-gray-500 mt-1" data-v-21b15eab>L&#39;email ne peut pas \xEAtre modifi\xE9</p></div>`);
        if (editingProfile.value) {
          _push(`<div class="flex items-center space-x-4 pt-4" data-v-21b15eab><button type="submit"${ssrIncludeBooleanAttr(updating.value) ? " disabled" : ""} class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" data-v-21b15eab>`);
          if (updating.value) {
            _push(`<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" data-v-21b15eab><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-21b15eab></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-21b15eab></path></svg>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(updating.value ? "Mise \xE0 jour..." : "Sauvegarder")}</button><button type="button" class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200" data-v-21b15eab> Annuler </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form></div></div><div class="space-y-6" data-v-21b15eab><div class="card-modern" data-v-21b15eab><h3 class="text-lg font-semibold text-gray-900 mb-4" data-v-21b15eab>Photo de profil</h3><div class="flex flex-col items-center space-y-4" data-v-21b15eab><div class="relative" data-v-21b15eab><div class="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg" data-v-21b15eab><span class="text-2xl font-bold text-white" data-v-21b15eab>${ssrInterpolate(userInitials.value)}</span></div></div><div class="text-center" data-v-21b15eab><h4 class="font-medium text-gray-900" data-v-21b15eab>${ssrInterpolate(userDisplayName.value)}</h4><p class="text-sm text-gray-500" data-v-21b15eab>${ssrInterpolate(unref(authStore).userEmail)}</p></div></div></div><div class="card-modern" data-v-21b15eab><h3 class="text-lg font-semibold text-gray-900 mb-4" data-v-21b15eab>Activit\xE9 du compte</h3><div class="space-y-4" data-v-21b15eab><div class="flex items-center justify-between" data-v-21b15eab><span class="text-sm text-gray-600" data-v-21b15eab>Membre depuis</span><span class="text-sm font-medium text-gray-900" data-v-21b15eab>${ssrInterpolate(memberSince.value)}</span></div><div class="flex items-center justify-between" data-v-21b15eab><span class="text-sm text-gray-600" data-v-21b15eab>Plan actuel</span><span class="${ssrRenderClass([planBadgeClass.value, "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"])}" data-v-21b15eab>${ssrInterpolate(planDisplayName.value)}</span></div><div class="flex items-center justify-between" data-v-21b15eab><span class="text-sm text-gray-600" data-v-21b15eab>Conversations</span><span class="text-sm font-medium text-gray-900" data-v-21b15eab>${ssrInterpolate(accountStats.value.totalConversations || 0)}</span></div><div class="flex items-center justify-between" data-v-21b15eab><span class="text-sm text-gray-600" data-v-21b15eab>Agents actifs</span><span class="text-sm font-medium text-gray-900" data-v-21b15eab>${ssrInterpolate(accountStats.value.activeAgents || 0)}</span></div></div></div></div></div></div><div style="${ssrRenderStyle(activeTab.value === "boutique" ? null : { display: "none" })}" class="space-y-8" data-v-21b15eab><div class="grid grid-cols-1 lg:grid-cols-2 gap-8" data-v-21b15eab><div class="card-modern" data-v-21b15eab><div class="flex items-center justify-between mb-6" data-v-21b15eab><h2 class="text-xl font-semibold text-gray-900" data-v-21b15eab>Informations de la boutique</h2><button class="${ssrRenderClass([editingShop.value ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-blue-50 text-blue-700 hover:bg-blue-100", "inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"])}" data-v-21b15eab><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-21b15eab></path></svg> ${ssrInterpolate(editingShop.value ? "Annuler" : "Modifier")}</button></div><form class="space-y-6" data-v-21b15eab><div data-v-21b15eab><label for="shopName" class="block text-sm font-medium text-gray-700 mb-2" data-v-21b15eab> Nom de la boutique </label><input id="shopName"${ssrRenderAttr("value", shopForm.name)} type="text"${ssrIncludeBooleanAttr(!editingShop.value) ? " disabled" : ""} class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500" placeholder="Nom de votre boutique" data-v-21b15eab></div><div data-v-21b15eab><label for="shopDomain" class="block text-sm font-medium text-gray-700 mb-2" data-v-21b15eab> Domaine (optionnel) </label><input id="shopDomain"${ssrRenderAttr("value", shopForm.domain)} type="url"${ssrIncludeBooleanAttr(!editingShop.value) ? " disabled" : ""} class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500" placeholder="https://votreboutique.com" data-v-21b15eab><p class="text-xs text-gray-500 mt-1" data-v-21b15eab>URL de votre site e-commerce</p></div><div data-v-21b15eab><label class="block text-sm font-medium text-gray-700 mb-2" data-v-21b15eab>ID de la boutique</label><div class="flex items-center space-x-2" data-v-21b15eab><input${ssrRenderAttr("value", ((_a = shopData.value) == null ? void 0 : _a.id) || unref(authStore).userShopId)} readonly class="flex-1 input-modern bg-gray-50 text-gray-500 text-sm font-mono" data-v-21b15eab><button type="button" class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200" title="Copier l&#39;ID" data-v-21b15eab><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" data-v-21b15eab></path></svg></button></div></div>`);
        if (editingShop.value) {
          _push(`<div class="flex items-center space-x-4 pt-4" data-v-21b15eab><button type="submit"${ssrIncludeBooleanAttr(updatingShop.value) ? " disabled" : ""} class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200" data-v-21b15eab>`);
          if (updatingShop.value) {
            _push(`<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" data-v-21b15eab><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-21b15eab></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-21b15eab></path></svg>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(updatingShop.value ? "Mise \xE0 jour..." : "Sauvegarder")}</button><button type="button" class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200" data-v-21b15eab> Annuler </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form></div><div class="card-modern" data-v-21b15eab><h2 class="text-xl font-semibold text-gray-900 mb-6" data-v-21b15eab>Statistiques de la boutique</h2><div class="space-y-6" data-v-21b15eab><div class="grid grid-cols-2 gap-4" data-v-21b15eab><div class="text-center p-4 bg-blue-50 rounded-lg" data-v-21b15eab><div class="text-2xl font-bold text-blue-600" data-v-21b15eab>${ssrInterpolate(accountStats.value.totalConversations || 0)}</div><div class="text-sm text-blue-600" data-v-21b15eab>Conversations</div></div><div class="text-center p-4 bg-green-50 rounded-lg" data-v-21b15eab><div class="text-2xl font-bold text-green-600" data-v-21b15eab>${ssrInterpolate(accountStats.value.totalOrders || 0)}</div><div class="text-sm text-green-600" data-v-21b15eab>Commandes</div></div></div><div class="grid grid-cols-2 gap-4" data-v-21b15eab><div class="text-center p-4 bg-purple-50 rounded-lg" data-v-21b15eab><div class="text-2xl font-bold text-purple-600" data-v-21b15eab>${ssrInterpolate(formatCurrency(accountStats.value.totalRevenue || 0))}</div><div class="text-sm text-purple-600" data-v-21b15eab>Revenus</div></div><div class="text-center p-4 bg-orange-50 rounded-lg" data-v-21b15eab><div class="text-2xl font-bold text-orange-600" data-v-21b15eab>${ssrInterpolate(accountStats.value.conversionRate || 0)}%</div><div class="text-sm text-orange-600" data-v-21b15eab>Conversion</div></div></div><div class="border-t pt-6" data-v-21b15eab><h3 class="font-medium text-gray-900 mb-3" data-v-21b15eab>Plan et utilisation</h3><div class="space-y-3" data-v-21b15eab><div class="flex items-center justify-between" data-v-21b15eab><span class="text-sm text-gray-600" data-v-21b15eab>Plan actuel</span><div class="flex items-center space-x-2" data-v-21b15eab><span class="${ssrRenderClass([planBadgeClass.value, "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"])}" data-v-21b15eab>${ssrInterpolate(planDisplayName.value)}</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/billing",
          class: "text-xs text-blue-600 hover:text-blue-700 font-medium"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` G\xE9rer `);
            } else {
              return [
                createTextVNode(" G\xE9rer ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="flex items-center justify-between" data-v-21b15eab><span class="text-sm text-gray-600" data-v-21b15eab>Agents utilis\xE9s</span><span class="text-sm font-medium text-gray-900" data-v-21b15eab>${ssrInterpolate(accountStats.value.activeAgents || 0)} / ${ssrInterpolate(planLimits.value.agents === -1 ? "\u221E" : planLimits.value.agents)}</span></div><div class="flex items-center justify-between" data-v-21b15eab><span class="text-sm text-gray-600" data-v-21b15eab>Documents</span><span class="text-sm font-medium text-gray-900" data-v-21b15eab>${ssrInterpolate(accountStats.value.documentsCount || 0)} / ${ssrInterpolate(planLimits.value.documents === -1 ? "\u221E" : planLimits.value.documents)}</span></div></div></div></div></div></div></div><div style="${ssrRenderStyle(activeTab.value === "securite" ? null : { display: "none" })}" class="space-y-8" data-v-21b15eab><div class="max-w-2xl" data-v-21b15eab><div class="card-modern" data-v-21b15eab><h2 class="text-xl font-semibold text-gray-900 mb-6" data-v-21b15eab>S\xE9curit\xE9 du compte</h2><div class="space-y-6" data-v-21b15eab><div class="flex items-center justify-between py-4 border-b border-gray-100" data-v-21b15eab><div data-v-21b15eab><h3 class="text-sm font-medium text-gray-900" data-v-21b15eab>Mot de passe</h3><p class="text-sm text-gray-500" data-v-21b15eab>Modifiez votre mot de passe pour s\xE9curiser votre compte</p></div><button class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200" data-v-21b15eab><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 018-8z" data-v-21b15eab></path></svg> Modifier </button></div><div class="flex items-center justify-between py-4 border-b border-gray-100" data-v-21b15eab><div data-v-21b15eab><h3 class="text-sm font-medium text-gray-900" data-v-21b15eab>Authentification \xE0 deux facteurs</h3><p class="text-sm text-gray-500" data-v-21b15eab>Ajoutez une couche de s\xE9curit\xE9 suppl\xE9mentaire</p></div><button class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-xl cursor-not-allowed" disabled data-v-21b15eab><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" data-v-21b15eab></path></svg> Bient\xF4t disponible </button></div><div class="flex items-center justify-between py-4" data-v-21b15eab><div data-v-21b15eab><h3 class="text-sm font-medium text-gray-900" data-v-21b15eab>Sessions actives</h3><p class="text-sm text-gray-500" data-v-21b15eab>G\xE9rez les appareils connect\xE9s \xE0 votre compte</p></div><button class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200" data-v-21b15eab><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" data-v-21b15eab></path></svg> Voir les sessions </button></div></div></div></div></div><div style="${ssrRenderStyle(activeTab.value === "notifications" ? null : { display: "none" })}" class="space-y-8" data-v-21b15eab><div class="max-w-2xl" data-v-21b15eab><div class="card-modern" data-v-21b15eab><h2 class="text-xl font-semibold text-gray-900 mb-6" data-v-21b15eab>Pr\xE9f\xE9rences de notifications</h2><div class="space-y-6" data-v-21b15eab><div data-v-21b15eab><h3 class="text-sm font-medium text-gray-900 mb-4" data-v-21b15eab>Notifications par email</h3><div class="space-y-4" data-v-21b15eab><div class="flex items-center justify-between" data-v-21b15eab><div data-v-21b15eab><p class="text-sm font-medium text-gray-700" data-v-21b15eab>Nouvelles conversations</p><p class="text-xs text-gray-500" data-v-21b15eab>Recevez un email quand un visiteur d\xE9marre une conversation</p></div><button class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          notificationSettings.emailConversations ? "bg-blue-600" : "bg-gray-200"
        ])}" data-v-21b15eab><span class="${ssrRenderClass([
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          notificationSettings.emailConversations ? "translate-x-5" : "translate-x-0"
        ])}" data-v-21b15eab></span></button></div><div class="flex items-center justify-between" data-v-21b15eab><div data-v-21b15eab><p class="text-sm font-medium text-gray-700" data-v-21b15eab>Nouvelles commandes</p><p class="text-xs text-gray-500" data-v-21b15eab>Recevez un email pour chaque nouvelle commande</p></div><button class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          notificationSettings.emailOrders ? "bg-blue-600" : "bg-gray-200"
        ])}" data-v-21b15eab><span class="${ssrRenderClass([
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          notificationSettings.emailOrders ? "translate-x-5" : "translate-x-0"
        ])}" data-v-21b15eab></span></button></div><div class="flex items-center justify-between" data-v-21b15eab><div data-v-21b15eab><p class="text-sm font-medium text-gray-700" data-v-21b15eab>Rapports hebdomadaires</p><p class="text-xs text-gray-500" data-v-21b15eab>R\xE9sum\xE9 des performances de vos agents IA</p></div><button class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          notificationSettings.emailReports ? "bg-blue-600" : "bg-gray-200"
        ])}" data-v-21b15eab><span class="${ssrRenderClass([
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          notificationSettings.emailReports ? "translate-x-5" : "translate-x-0"
        ])}" data-v-21b15eab></span></button></div></div></div><div class="pt-6 border-t border-gray-100" data-v-21b15eab><button${ssrIncludeBooleanAttr(savingNotifications.value) ? " disabled" : ""} class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200" data-v-21b15eab>`);
        if (savingNotifications.value) {
          _push(`<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" data-v-21b15eab><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-21b15eab></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-21b15eab></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(savingNotifications.value ? "Sauvegarde..." : "Sauvegarder les pr\xE9f\xE9rences")}</button></div></div></div></div></div><div style="${ssrRenderStyle(activeTab.value === "donnees" ? null : { display: "none" })}" class="space-y-8" data-v-21b15eab><div class="max-w-2xl" data-v-21b15eab><div class="card-modern" data-v-21b15eab><h2 class="text-xl font-semibold text-gray-900 mb-6" data-v-21b15eab>Gestion des donn\xE9es</h2><div class="space-y-6" data-v-21b15eab><div class="p-4 bg-blue-50 border border-blue-200 rounded-lg" data-v-21b15eab><div class="flex" data-v-21b15eab><div class="flex-shrink-0" data-v-21b15eab><svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" data-v-21b15eab><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" data-v-21b15eab></path></svg></div><div class="ml-3" data-v-21b15eab><h3 class="text-sm font-medium text-blue-800" data-v-21b15eab>Exportation des donn\xE9es</h3><div class="mt-2 text-sm text-blue-700" data-v-21b15eab><p data-v-21b15eab>T\xE9l\xE9chargez toutes vos donn\xE9es en format JSON. Inclut votre profil, conversations, commandes et param\xE8tres.</p></div></div></div></div><div class="flex items-center justify-between py-4 border-b border-gray-100" data-v-21b15eab><div data-v-21b15eab><h3 class="text-sm font-medium text-gray-900" data-v-21b15eab>Exporter mes donn\xE9es</h3><p class="text-sm text-gray-500" data-v-21b15eab>Obtenez une copie compl\xE8te de vos donn\xE9es</p></div><button${ssrIncludeBooleanAttr(exporting.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 disabled:opacity-50 transition-all duration-200" data-v-21b15eab>`);
        if (exporting.value) {
          _push(`<svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" data-v-21b15eab><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-21b15eab></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-21b15eab></path></svg>`);
        } else {
          _push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" data-v-21b15eab></path></svg>`);
        }
        _push(` ${ssrInterpolate(exporting.value ? "Export en cours..." : "T\xE9l\xE9charger mes donn\xE9es")}</button></div><div class="pt-6 border-t border-red-100" data-v-21b15eab><div class="p-4 bg-red-50 border border-red-200 rounded-lg" data-v-21b15eab><div class="flex" data-v-21b15eab><div class="flex-shrink-0" data-v-21b15eab><svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20" data-v-21b15eab><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" data-v-21b15eab></path></svg></div><div class="ml-3" data-v-21b15eab><h3 class="text-sm font-medium text-red-800" data-v-21b15eab>Zone dangereuse</h3><div class="mt-2 text-sm text-red-700" data-v-21b15eab><p data-v-21b15eab>La suppression de votre compte est irr\xE9versible. Toutes vos donn\xE9es seront d\xE9finitivement effac\xE9es.</p></div><div class="mt-4" data-v-21b15eab><button class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-xl hover:bg-red-200 transition-all duration-200" data-v-21b15eab><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-21b15eab></path></svg> Supprimer mon compte </button></div></div></div></div></div></div></div></div></div></div>`);
      }
      _push(`</div>`);
      if (showSuccessToast.value) {
        _push(`<div class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300" data-v-21b15eab><div class="flex items-center" data-v-21b15eab><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-21b15eab><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-21b15eab></path></svg> ${ssrInterpolate(successMessage.value)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showDeleteConfirmation.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-v-21b15eab><div class="bg-white rounded-lg p-6 max-w-md mx-4" data-v-21b15eab><h3 class="text-lg font-medium text-gray-900 mb-4" data-v-21b15eab>Confirmer la suppression</h3><p class="text-sm text-gray-600 mb-6" data-v-21b15eab> \xCAtes-vous s\xFBr de vouloir supprimer votre compte ? Cette action est irr\xE9versible et toutes vos donn\xE9es seront d\xE9finitivement effac\xE9es. </p><div class="flex space-x-4" data-v-21b15eab><button class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" data-v-21b15eab> Annuler </button><button class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors" data-v-21b15eab> Supprimer d\xE9finitivement </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-21b15eab"]]);

export { settings as default };
//# sourceMappingURL=settings-DdEhE-aw.mjs.map
