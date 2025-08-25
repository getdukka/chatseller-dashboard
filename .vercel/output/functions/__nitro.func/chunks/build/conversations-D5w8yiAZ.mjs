import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
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
  __name: "conversations",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useApi();
    const loading = ref(true);
    const refreshing = ref(false);
    const error = ref(null);
    const conversations2 = ref([]);
    const stats = ref({
      active: 0,
      completed: 0,
      inProgress: 0,
      conversionRate: 0,
      newToday: 0,
      completionRate: 0,
      averageWaitTime: 0,
      conversionGrowth: 0
    });
    const notification = ref({
      show: false,
      message: "",
      type: "success"
    });
    const getVisitorInfo = (conversation) => {
      if (conversation.customer_data && typeof conversation.customer_data === "object") {
        const data = conversation.customer_data;
        if (data.name) return data.name;
        if (data.email) return data.email;
      }
      return conversation.visitor_id ? `Visiteur ${conversation.visitor_id.slice(0, 8)}` : "Visiteur anonyme";
    };
    const formatTimeAgo = (date) => {
      const now = /* @__PURE__ */ new Date();
      const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1e3 * 60));
      if (diffInMinutes < 1) return "\xC0 l'instant";
      if (diffInMinutes < 60) return `${diffInMinutes}min`;
      if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)}h`;
      return new Date(date).toLocaleDateString("fr-FR");
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
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
      }).format(amount);
    };
    const getStatusLabel = (status) => {
      const labels = {
        active: "Active",
        completed: "Termin\xE9e",
        abandoned: "Abandonn\xE9e"
      };
      return labels[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        active: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        abandoned: "bg-gray-100 text-gray-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    useHead({
      title: "Conversations - ChatSeller Dashboard"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-93503fc4><div class="bg-white shadow-sm border-b border-gray-200" data-v-93503fc4><div class="px-8 py-6" data-v-93503fc4><div class="flex items-center justify-between" data-v-93503fc4><div data-v-93503fc4><h1 class="text-3xl font-bold text-gray-900" data-v-93503fc4>Conversations</h1><p class="mt-2 text-gray-600" data-v-93503fc4> G\xE9rez toutes vos conversations en temps r\xE9el </p></div><div class="flex items-center space-x-4" data-v-93503fc4><div class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg" data-v-93503fc4><div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" data-v-93503fc4></div><span class="text-sm font-medium text-green-700" data-v-93503fc4>En direct</span></div><button${ssrIncludeBooleanAttr(refreshing.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors" data-v-93503fc4><svg class="${ssrRenderClass([{ "animate-spin": refreshing.value }, "w-4 h-4 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-93503fc4></path></svg> ${ssrInterpolate(refreshing.value ? "Actualisation..." : "Actualiser")}</button></div></div></div></div><div class="p-8" data-v-93503fc4><div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-v-93503fc4><div class="card-modern-gradient from-green-500 to-green-600" data-v-93503fc4><div class="flex items-center justify-between text-white" data-v-93503fc4><div data-v-93503fc4><p class="text-green-100 text-sm font-medium" data-v-93503fc4>Actives</p><p class="text-3xl font-bold" data-v-93503fc4>${ssrInterpolate(stats.value.active)}</p><p class="text-green-100 text-sm mt-1" data-v-93503fc4> +${ssrInterpolate(stats.value.newToday)} aujourd&#39;hui </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-93503fc4><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-93503fc4></path></svg></div></div></div><div class="card-modern-gradient from-blue-500 to-blue-600" data-v-93503fc4><div class="flex items-center justify-between text-white" data-v-93503fc4><div data-v-93503fc4><p class="text-blue-100 text-sm font-medium" data-v-93503fc4>Termin\xE9es</p><p class="text-3xl font-bold" data-v-93503fc4>${ssrInterpolate(stats.value.completed)}</p><p class="text-blue-100 text-sm mt-1" data-v-93503fc4>${ssrInterpolate(stats.value.completionRate)}% r\xE9solution </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-93503fc4><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-93503fc4></path></svg></div></div></div><div class="card-modern-gradient from-yellow-500 to-orange-500" data-v-93503fc4><div class="flex items-center justify-between text-white" data-v-93503fc4><div data-v-93503fc4><p class="text-orange-100 text-sm font-medium" data-v-93503fc4>En cours</p><p class="text-3xl font-bold" data-v-93503fc4>${ssrInterpolate(stats.value.inProgress)}</p><p class="text-orange-100 text-sm mt-1" data-v-93503fc4>${ssrInterpolate(stats.value.averageWaitTime)}min moyenne </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-93503fc4><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-93503fc4></path></svg></div></div></div><div class="card-modern-gradient from-purple-500 to-purple-600" data-v-93503fc4><div class="flex items-center justify-between text-white" data-v-93503fc4><div data-v-93503fc4><p class="text-purple-100 text-sm font-medium" data-v-93503fc4>Conversion</p><p class="text-3xl font-bold" data-v-93503fc4>${ssrInterpolate(stats.value.conversionRate)}%</p><p class="text-purple-100 text-sm mt-1" data-v-93503fc4> +${ssrInterpolate(stats.value.conversionGrowth)}% ce mois </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-93503fc4><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-v-93503fc4></path></svg></div></div></div></div><div class="card-modern" data-v-93503fc4><div class="px-6 py-4 border-b border-gray-200" data-v-93503fc4><div class="flex items-center justify-between" data-v-93503fc4><h3 class="text-lg font-semibold text-gray-900" data-v-93503fc4> Conversations r\xE9centes </h3><span class="text-sm text-gray-500" data-v-93503fc4>${ssrInterpolate(conversations2.value.length)} conversation(s) </span></div></div>`);
      if (loading.value) {
        _push(`<div class="p-12" data-v-93503fc4><div class="flex items-center justify-center" data-v-93503fc4><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-v-93503fc4></div><span class="ml-3 text-gray-600" data-v-93503fc4>Chargement des conversations...</span></div></div>`);
      } else if (error.value) {
        _push(`<div class="p-12 text-center" data-v-93503fc4><div class="text-red-600 mb-4" data-v-93503fc4><svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" data-v-93503fc4></path></svg></div><h3 class="text-lg font-medium text-gray-900 mb-2" data-v-93503fc4>Erreur de chargement</h3><p class="text-gray-500 mb-4" data-v-93503fc4>${ssrInterpolate(error.value)}</p><button class="btn-primary" data-v-93503fc4> R\xE9essayer </button></div>`);
      } else if (conversations2.value.length > 0) {
        _push(`<div class="overflow-x-auto" data-v-93503fc4><table class="min-w-full divide-y divide-gray-200" data-v-93503fc4><thead class="bg-gray-50" data-v-93503fc4><tr data-v-93503fc4><th class="table-header" data-v-93503fc4>Conversation</th><th class="table-header" data-v-93503fc4>Visiteur</th><th class="table-header" data-v-93503fc4>Produit</th><th class="table-header" data-v-93503fc4>Messages</th><th class="table-header" data-v-93503fc4>Statut</th><th class="table-header" data-v-93503fc4>Date</th><th class="table-header text-right" data-v-93503fc4>Actions</th></tr></thead><tbody class="bg-white divide-y divide-gray-200" data-v-93503fc4><!--[-->`);
        ssrRenderList(conversations2.value, (conversation) => {
          _push(`<tr class="hover:bg-gray-50 transition-colors" data-v-93503fc4><td class="table-cell" data-v-93503fc4><div class="text-sm font-medium text-gray-900" data-v-93503fc4> #${ssrInterpolate(conversation.id.slice(-8).toUpperCase())}</div>`);
          if (conversation.conversion_completed) {
            _push(`<div class="text-xs text-green-600 font-medium" data-v-93503fc4> \u2713 Convertie </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="table-cell" data-v-93503fc4><div class="text-sm text-gray-900" data-v-93503fc4>${ssrInterpolate(getVisitorInfo(conversation))}</div>`);
          if (conversation.visitor_ip) {
            _push(`<div class="text-xs text-gray-500" data-v-93503fc4>${ssrInterpolate(conversation.visitor_ip)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="table-cell" data-v-93503fc4><div class="text-sm text-gray-900" data-v-93503fc4>${ssrInterpolate(conversation.product_name || "Aucun produit")}</div>`);
          if (conversation.product_price) {
            _push(`<div class="text-sm text-gray-500" data-v-93503fc4>${ssrInterpolate(formatCurrency(conversation.product_price))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="table-cell" data-v-93503fc4><div class="text-sm font-medium text-gray-900" data-v-93503fc4>${ssrInterpolate(conversation.message_count || 0)}</div><div class="text-xs text-gray-500" data-v-93503fc4> messages </div></td><td class="table-cell" data-v-93503fc4><span class="${ssrRenderClass([getStatusBadgeClass(conversation.status), "status-badge"])}" data-v-93503fc4>${ssrInterpolate(getStatusLabel(conversation.status))}</span></td><td class="table-cell" data-v-93503fc4><div class="text-sm text-gray-900" data-v-93503fc4>${ssrInterpolate(formatDate(conversation.started_at))}</div><div class="text-xs text-gray-500" data-v-93503fc4>${ssrInterpolate(formatTimeAgo(conversation.last_activity))}</div></td><td class="table-cell text-right" data-v-93503fc4><div class="flex items-center justify-end space-x-2" data-v-93503fc4><button class="action-button-primary" title="Voir les d\xE9tails" data-v-93503fc4> Voir </button>`);
          if (conversation.status === "active") {
            _push(`<button class="action-button-secondary" title="Prendre en charge" data-v-93503fc4><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-93503fc4></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      } else {
        _push(`<div class="text-center py-12" data-v-93503fc4><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-93503fc4></path></svg><h3 class="mt-4 text-lg font-medium text-gray-900" data-v-93503fc4>Aucune conversation</h3><p class="mt-2 text-gray-500" data-v-93503fc4> Les nouvelles conversations appara\xEEtront ici </p></div>`);
      }
      _push(`</div></div>`);
      if (notification.value.show) {
        _push(`<div class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50" data-v-93503fc4><div class="p-4" data-v-93503fc4><div class="flex items-start" data-v-93503fc4><div class="flex-shrink-0" data-v-93503fc4>`);
        if (notification.value.type === "success") {
          _push(`<svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-93503fc4></path></svg>`);
        } else {
          _push(`<svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-93503fc4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" data-v-93503fc4></path></svg>`);
        }
        _push(`</div><div class="ml-3 w-0 flex-1 pt-0.5" data-v-93503fc4><p class="text-sm font-medium text-gray-900" data-v-93503fc4>${ssrInterpolate(notification.value.message)}</p></div><div class="ml-4 flex-shrink-0 flex" data-v-93503fc4><button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500" data-v-93503fc4><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" data-v-93503fc4><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" data-v-93503fc4></path></svg></button></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/conversations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const conversations = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-93503fc4"]]);

export { conversations as default };
//# sourceMappingURL=conversations-D5w8yiAZ.mjs.map
