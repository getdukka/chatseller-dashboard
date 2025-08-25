import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
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
  __name: "orders",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useApi();
    const loading = ref(true);
    const exporting = ref(false);
    const searchQuery = ref("");
    const error = ref(null);
    const filters = ref({
      status: ""
    });
    const orders2 = ref([]);
    const stats = ref({
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      revenueGrowth: 0
    });
    const notification = ref({
      show: false,
      message: "",
      type: "success"
    });
    const filteredOrders = computed(() => {
      let filtered = orders2.value;
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (order) => {
            var _a, _b, _c;
            return ((_a = order.customer_name) == null ? void 0 : _a.toLowerCase().includes(query)) || ((_b = order.customer_email) == null ? void 0 : _b.toLowerCase().includes(query)) || order.id.toLowerCase().includes(query) || ((_c = order.external_order_id) == null ? void 0 : _c.toLowerCase().includes(query));
          }
        );
      }
      if (filters.value.status) {
        filtered = filtered.filter((order) => order.status === filters.value.status);
      }
      return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });
    const hasActiveFilters = computed(() => {
      return filters.value.status !== "" || searchQuery.value !== "";
    });
    const getProductCount = (order) => {
      if (!order.product_items || !Array.isArray(order.product_items)) return 0;
      return order.product_items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    };
    const getUpsellCount = (order) => {
      if (!order.upsell_items || !Array.isArray(order.upsell_items)) return 0;
      return order.upsell_items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    };
    const hasUpsellItems = (order) => {
      return order.upsell_items && Array.isArray(order.upsell_items) && order.upsell_items.length > 0;
    };
    const getProductSummary = (order) => {
      if (!order.product_items || !Array.isArray(order.product_items) || order.product_items.length === 0) {
        return "Aucun produit";
      }
      const firstItem = order.product_items[0];
      const itemName = firstItem.name || firstItem.productName || "Produit";
      if (order.product_items.length === 1) {
        return itemName;
      }
      return `${itemName} et ${order.product_items.length - 1} autre(s)`;
    };
    const getTotalOrderAmount = (order) => {
      return (order.total_amount || 0) + (order.upsell_amount || 0);
    };
    const formatCurrency = (amount, currency = "EUR") => {
      if (currency === "XOF") {
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XOF",
          minimumFractionDigits: 0
        }).format(amount);
      }
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: currency || "EUR"
      }).format(amount);
    };
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const getStatusLabel = (status) => {
      const labels = {
        pending: "En attente",
        confirmed: "Confirm\xE9e",
        shipped: "Exp\xE9di\xE9e",
        delivered: "Livr\xE9e",
        cancelled: "Annul\xE9e"
      };
      return labels[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const getPaymentMethodLabel = (method) => {
      if (!method) return "Non sp\xE9cifi\xE9";
      const labels = {
        card: "Carte bancaire",
        paypal: "PayPal",
        bank_transfer: "Virement",
        cash: "Esp\xE8ces",
        mobile_money: "Mobile Money"
      };
      return labels[method] || method;
    };
    useHead({
      title: "Commandes - ChatSeller Dashboard"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-c50c5707><div class="bg-white shadow-sm border-b border-gray-200" data-v-c50c5707><div class="px-8 py-6" data-v-c50c5707><div class="flex items-center justify-between" data-v-c50c5707><div data-v-c50c5707><h1 class="text-3xl font-bold text-gray-900" data-v-c50c5707>Commandes</h1><p class="mt-2 text-gray-600" data-v-c50c5707> G\xE9rez toutes les commandes g\xE9n\xE9r\xE9es par votre agent IA </p></div><div class="flex items-center space-x-4" data-v-c50c5707><button${ssrIncludeBooleanAttr(exporting.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors" data-v-c50c5707><svg class="${ssrRenderClass([{ "animate-spin": exporting.value }, "w-4 h-4 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-c50c5707></path></svg> ${ssrInterpolate(exporting.value ? "Export en cours..." : "Exporter CSV")}</button><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors" data-v-c50c5707><svg class="${ssrRenderClass([{ "animate-spin": loading.value }, "w-4 h-4 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-c50c5707></path></svg> ${ssrInterpolate(loading.value ? "Actualisation..." : "Actualiser")}</button></div></div></div></div><div class="p-8" data-v-c50c5707><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-v-c50c5707><div class="card-modern" data-v-c50c5707><div class="flex items-center" data-v-c50c5707><div class="p-3 bg-blue-100 rounded-xl" data-v-c50c5707><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-c50c5707></path></svg></div><div class="ml-4" data-v-c50c5707><p class="text-sm font-medium text-gray-600" data-v-c50c5707>Total commandes</p><p class="text-2xl font-bold text-gray-900" data-v-c50c5707>${ssrInterpolate(stats.value.totalOrders)}</p><p class="text-xs text-gray-500 mt-1" data-v-c50c5707>Ce mois-ci</p></div></div></div><div class="card-modern" data-v-c50c5707><div class="flex items-center" data-v-c50c5707><div class="p-3 bg-green-100 rounded-xl" data-v-c50c5707><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" data-v-c50c5707></path></svg></div><div class="ml-4" data-v-c50c5707><p class="text-sm font-medium text-gray-600" data-v-c50c5707>Revenus totaux</p><p class="text-2xl font-bold text-gray-900" data-v-c50c5707>${ssrInterpolate(formatCurrency(stats.value.totalRevenue))}</p><p class="text-xs text-green-600 mt-1" data-v-c50c5707>+${ssrInterpolate(stats.value.revenueGrowth)}% vs mois dernier</p></div></div></div><div class="card-modern" data-v-c50c5707><div class="flex items-center" data-v-c50c5707><div class="p-3 bg-yellow-100 rounded-xl" data-v-c50c5707><svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" data-v-c50c5707></path></svg></div><div class="ml-4" data-v-c50c5707><p class="text-sm font-medium text-gray-600" data-v-c50c5707>Panier moyen</p><p class="text-2xl font-bold text-gray-900" data-v-c50c5707>${ssrInterpolate(formatCurrency(stats.value.averageOrderValue))}</p><p class="text-xs text-gray-500 mt-1" data-v-c50c5707>Par commande</p></div></div></div><div class="card-modern" data-v-c50c5707><div class="flex items-center" data-v-c50c5707><div class="p-3 bg-orange-100 rounded-xl" data-v-c50c5707><svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-c50c5707></path></svg></div><div class="ml-4" data-v-c50c5707><p class="text-sm font-medium text-gray-600" data-v-c50c5707>En attente</p><p class="text-2xl font-bold text-gray-900" data-v-c50c5707>${ssrInterpolate(stats.value.pendingOrders)}</p><p class="text-xs text-orange-600 mt-1" data-v-c50c5707>N\xE9cessitent une action</p></div></div></div></div><div class="card-modern mb-6" data-v-c50c5707><div class="p-6" data-v-c50c5707><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" data-v-c50c5707><div class="flex-1 max-w-lg" data-v-c50c5707><div class="relative" data-v-c50c5707><svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-c50c5707></path></svg><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Rechercher une commande..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" data-v-c50c5707></div></div><div class="flex flex-wrap items-center space-x-4" data-v-c50c5707><select class="input-modern" data-v-c50c5707><option value="" data-v-c50c5707${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "") : ssrLooseEqual(filters.value.status, "")) ? " selected" : ""}>Tous les statuts</option><option value="pending" data-v-c50c5707${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "pending") : ssrLooseEqual(filters.value.status, "pending")) ? " selected" : ""}>En attente</option><option value="confirmed" data-v-c50c5707${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "confirmed") : ssrLooseEqual(filters.value.status, "confirmed")) ? " selected" : ""}>Confirm\xE9e</option><option value="shipped" data-v-c50c5707${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "shipped") : ssrLooseEqual(filters.value.status, "shipped")) ? " selected" : ""}>Exp\xE9di\xE9e</option><option value="delivered" data-v-c50c5707${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "delivered") : ssrLooseEqual(filters.value.status, "delivered")) ? " selected" : ""}>Livr\xE9e</option><option value="cancelled" data-v-c50c5707${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "cancelled") : ssrLooseEqual(filters.value.status, "cancelled")) ? " selected" : ""}>Annul\xE9e</option></select>`);
      if (hasActiveFilters.value) {
        _push(`<button class="text-sm text-gray-500 hover:text-gray-700 underline" data-v-c50c5707> Effacer les filtres </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div><div class="card-modern" data-v-c50c5707><div class="px-6 py-4 border-b border-gray-200" data-v-c50c5707><div class="flex items-center justify-between" data-v-c50c5707><h3 class="text-lg font-semibold text-gray-900" data-v-c50c5707> Liste des commandes </h3><span class="text-sm text-gray-500" data-v-c50c5707>${ssrInterpolate(filteredOrders.value.length)} commande(s) </span></div></div>`);
      if (loading.value) {
        _push(`<div class="p-12" data-v-c50c5707><div class="flex items-center justify-center" data-v-c50c5707><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-v-c50c5707></div><span class="ml-3 text-gray-600" data-v-c50c5707>Chargement des commandes...</span></div></div>`);
      } else if (error.value) {
        _push(`<div class="p-12 text-center" data-v-c50c5707><div class="text-red-600 mb-4" data-v-c50c5707><svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" data-v-c50c5707></path></svg></div><h3 class="text-lg font-medium text-gray-900 mb-2" data-v-c50c5707>Erreur de chargement</h3><p class="text-gray-500 mb-4" data-v-c50c5707>${ssrInterpolate(error.value)}</p><button class="btn-primary" data-v-c50c5707> R\xE9essayer </button></div>`);
      } else if (filteredOrders.value.length > 0) {
        _push(`<div class="overflow-x-auto" data-v-c50c5707><table class="min-w-full divide-y divide-gray-200" data-v-c50c5707><thead class="bg-gray-50" data-v-c50c5707><tr data-v-c50c5707><th class="table-header" data-v-c50c5707>Commande</th><th class="table-header" data-v-c50c5707>Client</th><th class="table-header" data-v-c50c5707>Produits</th><th class="table-header" data-v-c50c5707>Montant</th><th class="table-header" data-v-c50c5707>Paiement</th><th class="table-header" data-v-c50c5707>Statut</th><th class="table-header" data-v-c50c5707>Date</th><th class="table-header text-right" data-v-c50c5707>Actions</th></tr></thead><tbody class="bg-white divide-y divide-gray-200" data-v-c50c5707><!--[-->`);
        ssrRenderList(filteredOrders.value, (order) => {
          _push(`<tr class="hover:bg-gray-50 transition-colors" data-v-c50c5707><td class="table-cell" data-v-c50c5707><div class="text-sm font-medium text-gray-900" data-v-c50c5707> #${ssrInterpolate(order.id.slice(-8).toUpperCase())}</div>`);
          if (order.external_order_id) {
            _push(`<div class="text-xs text-gray-500" data-v-c50c5707> Ext: ${ssrInterpolate(order.external_order_id)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="table-cell" data-v-c50c5707><div data-v-c50c5707><div class="text-sm font-medium text-gray-900" data-v-c50c5707>${ssrInterpolate(order.customer_name || "Client anonyme")}</div>`);
          if (order.customer_email) {
            _push(`<div class="text-sm text-gray-500" data-v-c50c5707>${ssrInterpolate(order.customer_email)}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (order.customer_phone) {
            _push(`<div class="text-sm text-gray-500" data-v-c50c5707>${ssrInterpolate(order.customer_phone)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="table-cell" data-v-c50c5707><div class="text-sm text-gray-900" data-v-c50c5707>${ssrInterpolate(getProductCount(order))} article(s) </div><div class="text-sm text-gray-500" data-v-c50c5707>${ssrInterpolate(getProductSummary(order))}</div>`);
          if (hasUpsellItems(order)) {
            _push(`<div class="text-xs text-green-600 mt-1" data-v-c50c5707> + ${ssrInterpolate(getUpsellCount(order))} upsell(s) </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="table-cell" data-v-c50c5707><div class="text-sm font-medium text-gray-900" data-v-c50c5707>${ssrInterpolate(formatCurrency(getTotalOrderAmount(order), order.currency))}</div>`);
          if (order.upsell_amount && order.upsell_amount > 0) {
            _push(`<div class="text-xs text-green-600" data-v-c50c5707> + ${ssrInterpolate(formatCurrency(order.upsell_amount, order.currency))} upsell </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="table-cell" data-v-c50c5707><div class="text-sm text-gray-900" data-v-c50c5707>${ssrInterpolate(getPaymentMethodLabel(order.payment_method))}</div></td><td class="table-cell" data-v-c50c5707><span class="${ssrRenderClass([getStatusBadgeClass(order.status), "status-badge"])}" data-v-c50c5707>${ssrInterpolate(getStatusLabel(order.status))}</span></td><td class="table-cell" data-v-c50c5707><div class="text-sm text-gray-900" data-v-c50c5707>${ssrInterpolate(formatDate(order.created_at))}</div>`);
          if (order.exported_at) {
            _push(`<div class="text-xs text-green-600" data-v-c50c5707> Export\xE9e ${ssrInterpolate(formatDate(order.exported_at))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="table-cell text-right" data-v-c50c5707><div class="flex items-center justify-end space-x-2" data-v-c50c5707><button class="action-button-primary" title="Voir les d\xE9tails" data-v-c50c5707> Voir </button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      } else {
        _push(`<div class="text-center py-12" data-v-c50c5707><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-c50c5707></path></svg><h3 class="mt-4 text-lg font-medium text-gray-900" data-v-c50c5707>Aucune commande trouv\xE9e</h3><p class="mt-2 text-gray-500" data-v-c50c5707>${ssrInterpolate(searchQuery.value || hasActiveFilters.value ? "Aucune commande ne correspond \xE0 vos crit\xE8res" : "Les commandes g\xE9n\xE9r\xE9es par votre Vendeur IA appara\xEEtront ici")}</p>`);
        if (searchQuery.value || hasActiveFilters.value) {
          _push(`<div class="mt-4" data-v-c50c5707><button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors" data-v-c50c5707> Effacer les filtres </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div>`);
      if (notification.value.show) {
        _push(`<div class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50" data-v-c50c5707><div class="p-4" data-v-c50c5707><div class="flex items-start" data-v-c50c5707><div class="flex-shrink-0" data-v-c50c5707>`);
        if (notification.value.type === "success") {
          _push(`<svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-c50c5707></path></svg>`);
        } else {
          _push(`<svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c50c5707><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" data-v-c50c5707></path></svg>`);
        }
        _push(`</div><div class="ml-3 w-0 flex-1 pt-0.5" data-v-c50c5707><p class="text-sm font-medium text-gray-900" data-v-c50c5707>${ssrInterpolate(notification.value.message)}</p></div><div class="ml-4 flex-shrink-0 flex" data-v-c50c5707><button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500" data-v-c50c5707><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" data-v-c50c5707><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" data-v-c50c5707></path></svg></button></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const orders = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c50c5707"]]);

export { orders as default };
//# sourceMappingURL=orders-BRPJ7qS4.mjs.map
