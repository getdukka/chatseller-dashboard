import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useApi } from './auth-KgQDcdck.mjs';
import { f as useRoute, u as useHead } from './server.mjs';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useApi();
    const route = useRoute();
    const conversationId = route.params.id;
    const loading = ref(true);
    const error = ref(null);
    const showActionsMenu = ref(false);
    const newMessage = ref("");
    const sendingMessage = ref(false);
    const conversation = ref(null);
    const messages = ref([]);
    const notification = ref({
      show: false,
      message: "",
      type: "success"
    });
    const getInitials = (name) => {
      if (!name) return "??";
      return name.split(" ").map((n) => n.charAt(0)).join("").toUpperCase().slice(0, 2);
    };
    const getVisitorName = () => {
      if (!conversation.value) return "Visiteur";
      if (conversation.value.customer_data) {
        const data = conversation.value.customer_data;
        if (typeof data === "string") {
          try {
            const parsed = JSON.parse(data);
            if (parsed.name) return parsed.name;
            if (parsed.firstName && parsed.lastName) return `${parsed.firstName} ${parsed.lastName}`;
            if (parsed.firstName) return parsed.firstName;
          } catch (e) {
            if (data) return data;
          }
        } else if (typeof data === "object") {
          if (data.name) return data.name;
          if (data.firstName && data.lastName) return `${data.firstName} ${data.lastName}`;
          if (data.firstName) return data.firstName;
        }
      }
      return conversation.value.visitor_id ? `Visiteur ${conversation.value.visitor_id.slice(0, 8)}` : "Visiteur anonyme";
    };
    const getVisitorEmail = () => {
      var _a;
      if (!((_a = conversation.value) == null ? void 0 : _a.customer_data)) return null;
      const data = conversation.value.customer_data;
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          return parsed.email || null;
        } catch (e) {
          return null;
        }
      } else if (typeof data === "object") {
        return data.email || null;
      }
      return null;
    };
    const getVisitorPhone = () => {
      var _a;
      if (!((_a = conversation.value) == null ? void 0 : _a.customer_data)) return null;
      const data = conversation.value.customer_data;
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          return parsed.phone || null;
        } catch (e) {
          return null;
        }
      } else if (typeof data === "object") {
        return data.phone || null;
      }
      return null;
    };
    const getStatusLabel = (status) => {
      const labels = {
        active: "Active",
        pending: "En attente",
        completed: "Termin\xE9e",
        abandoned: "Abandonn\xE9e"
      };
      return labels[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        active: "badge-success",
        pending: "badge-warning",
        completed: "badge-primary",
        abandoned: "badge-gray"
      };
      return classes[status] || "badge-gray";
    };
    const getStatusTextClass = (status) => {
      const classes = {
        active: "text-green-600",
        pending: "text-yellow-600",
        completed: "text-blue-600",
        abandoned: "text-gray-600"
      };
      return classes[status] || "text-gray-600";
    };
    const getConfidenceColor = (confidence) => {
      if (confidence >= 80) return "bg-green-500";
      if (confidence >= 60) return "bg-yellow-500";
      return "bg-red-500";
    };
    const formatDate = (dateString) => {
      if (!dateString) return "Non renseign\xE9";
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const getConversationDuration = () => {
      if (!conversation.value || !conversation.value.started_at) return "N/A";
      const start = new Date(conversation.value.started_at);
      const end = conversation.value.completed_at ? new Date(conversation.value.completed_at) : /* @__PURE__ */ new Date();
      const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1e3 * 60));
      if (diffMinutes < 1) return "< 1min";
      if (diffMinutes < 60) return `${diffMinutes}min`;
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      return `${hours}h ${mins}min`;
    };
    useHead({
      title: `Conversation ${conversationId.slice(-8)} - ChatSeller Dashboard`
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-44ba4770><div class="bg-white shadow-sm border-b border-gray-200" data-v-44ba4770><div class="px-6 py-4" data-v-44ba4770><div class="flex items-center justify-between" data-v-44ba4770><div class="flex items-center space-x-4" data-v-44ba4770><button class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100" data-v-44ba4770><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" data-v-44ba4770></path></svg></button>`);
      if (conversation.value && !loading.value) {
        _push(`<div data-v-44ba4770><div class="flex items-center space-x-3" data-v-44ba4770><div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100" data-v-44ba4770><span class="text-sm font-medium text-blue-700" data-v-44ba4770>${ssrInterpolate(getInitials(getVisitorName()))}</span></div><div data-v-44ba4770><h1 class="text-xl font-bold text-gray-900" data-v-44ba4770>${ssrInterpolate(getVisitorName())}</h1><div class="flex items-center space-x-4 text-sm text-gray-600" data-v-44ba4770><span data-v-44ba4770>${ssrInterpolate(getVisitorEmail())}</span><span class="${ssrRenderClass([getStatusBadgeClass(conversation.value.status), "badge"])}" data-v-44ba4770>${ssrInterpolate(getStatusLabel(conversation.value.status))}</span><span data-v-44ba4770>${ssrInterpolate(formatDate(conversation.value.started_at))}</span></div></div></div></div>`);
      } else if (loading.value) {
        _push(`<div class="flex items-center space-x-3" data-v-44ba4770><div class="animate-pulse" data-v-44ba4770><div class="h-10 w-10 bg-gray-200 rounded-full" data-v-44ba4770></div></div><div class="animate-pulse" data-v-44ba4770><div class="h-4 bg-gray-200 rounded w-32 mb-2" data-v-44ba4770></div><div class="h-3 bg-gray-200 rounded w-24" data-v-44ba4770></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center space-x-3" data-v-44ba4770>`);
      if (conversation.value && conversation.value.unread_count > 0) {
        _push(`<button class="btn-secondary" data-v-44ba4770><svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-44ba4770></path></svg> Marquer comme lu </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative" data-v-44ba4770><button class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100" data-v-44ba4770><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" data-v-44ba4770></path></svg></button>`);
      if (showActionsMenu.value) {
        _push(`<div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10" data-v-44ba4770><div class="py-1" data-v-44ba4770>`);
        if (((_a = conversation.value) == null ? void 0 : _a.status) === "active") {
          _push(`<button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-v-44ba4770> Prendre en charge </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-v-44ba4770> Exporter </button><hr class="my-1" data-v-44ba4770><button class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50" data-v-44ba4770> Supprimer </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></div>`);
      if (error.value && !loading.value) {
        _push(`<div class="p-12 text-center" data-v-44ba4770><div class="text-red-600 mb-4" data-v-44ba4770><svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" data-v-44ba4770></path></svg></div><h3 class="text-lg font-medium text-gray-900 mb-2" data-v-44ba4770>Erreur de chargement</h3><p class="text-gray-500 mb-4" data-v-44ba4770>${ssrInterpolate(error.value)}</p><button class="btn-primary" data-v-44ba4770> R\xE9essayer </button></div>`);
      } else {
        _push(`<div class="flex h-screen pt-16" data-v-44ba4770><div class="flex-1 flex flex-col" data-v-44ba4770><div class="flex-1 overflow-y-auto bg-gray-50 p-4" data-v-44ba4770>`);
        if (loading.value) {
          _push(`<div class="flex justify-center items-center h-full" data-v-44ba4770><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-v-44ba4770></div><span class="ml-3 text-gray-600" data-v-44ba4770>Chargement de la conversation...</span></div>`);
        } else if (messages.value.length > 0) {
          _push(`<div class="space-y-4 max-w-4xl mx-auto" data-v-44ba4770><!--[-->`);
          ssrRenderList(messages.value, (message) => {
            _push(`<div class="${ssrRenderClass([message.sender === "visitor" ? "justify-end" : "justify-start", "flex"])}" data-v-44ba4770>`);
            if (message.sender === "agent") {
              _push(`<div class="flex items-start space-x-3 max-w-lg" data-v-44ba4770><div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 flex-shrink-0" data-v-44ba4770><svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09z" data-v-44ba4770></path></svg></div><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3" data-v-44ba4770><div class="text-sm font-medium text-gray-900 mb-1" data-v-44ba4770>Agent IA</div><div class="text-gray-800 whitespace-pre-wrap" data-v-44ba4770>${ssrInterpolate(message.content)}</div><div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100" data-v-44ba4770><div class="text-xs text-gray-500" data-v-44ba4770>${ssrInterpolate(formatTime(message.sent_at || message.created_at))}</div><div class="flex items-center space-x-2" data-v-44ba4770><button class="p-1 text-gray-400 hover:text-gray-600 rounded" title="Copier" data-v-44ba4770><svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" data-v-44ba4770></path></svg></button>`);
              if (message.confidence !== void 0) {
                _push(`<div class="flex items-center space-x-1"${ssrRenderAttr("title", `Confiance: ${message.confidence}%`)} data-v-44ba4770><div class="${ssrRenderClass([getConfidenceColor(message.confidence), "w-2 h-2 rounded-full"])}" data-v-44ba4770></div><span class="text-xs text-gray-500" data-v-44ba4770>${ssrInterpolate(message.confidence)}%</span></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div></div></div>`);
            } else {
              _push(`<div class="flex items-start space-x-3 max-w-lg" data-v-44ba4770><div class="bg-blue-600 text-white rounded-lg p-3" data-v-44ba4770><div class="text-white whitespace-pre-wrap" data-v-44ba4770>${ssrInterpolate(message.content)}</div><div class="text-blue-100 text-xs mt-2 text-right" data-v-44ba4770>${ssrInterpolate(formatTime(message.sent_at || message.created_at))}</div></div><div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0" data-v-44ba4770><span class="text-xs font-medium text-gray-600" data-v-44ba4770>${ssrInterpolate(getInitials(getVisitorName()))}</span></div></div>`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="flex justify-center items-center h-full" data-v-44ba4770><div class="text-center" data-v-44ba4770><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-44ba4770></path></svg><h3 class="mt-2 text-sm font-medium text-gray-900" data-v-44ba4770>Aucun message</h3><p class="mt-1 text-sm text-gray-500" data-v-44ba4770>Cette conversation n&#39;a pas encore de messages</p></div></div>`);
        }
        _push(`</div>`);
        if (((_b = conversation.value) == null ? void 0 : _b.status) === "active") {
          _push(`<div class="bg-white border-t border-gray-200 p-4" data-v-44ba4770><div class="max-w-4xl mx-auto" data-v-44ba4770><div class="flex items-end space-x-3" data-v-44ba4770><div class="flex-1" data-v-44ba4770><textarea rows="2" placeholder="Tapez votre message..." class="input-primary resize-none"${ssrIncludeBooleanAttr(sendingMessage.value) ? " disabled" : ""} data-v-44ba4770>${ssrInterpolate(newMessage.value)}</textarea></div><button${ssrIncludeBooleanAttr(!newMessage.value.trim() || sendingMessage.value) ? " disabled" : ""} class="btn-primary" data-v-44ba4770>`);
          if (sendingMessage.value) {
            _push(`<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" data-v-44ba4770><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-44ba4770></circle><path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-44ba4770></path></svg>`);
          } else {
            _push(`<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" data-v-44ba4770></path></svg>`);
          }
          _push(`</button></div><p class="text-xs text-gray-500 mt-2" data-v-44ba4770> Appuyez sur Entr\xE9e pour envoyer, Shift+Entr\xE9e pour une nouvelle ligne </p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="w-80 bg-white border-l border-gray-200" data-v-44ba4770><div class="p-6 space-y-6" data-v-44ba4770><div data-v-44ba4770><h3 class="text-lg font-medium text-gray-900 mb-4" data-v-44ba4770>Informations visiteur</h3>`);
        if (conversation.value && !loading.value) {
          _push(`<div class="space-y-3" data-v-44ba4770><div data-v-44ba4770><label class="text-sm font-medium text-gray-700" data-v-44ba4770>Nom</label><p class="text-sm text-gray-900 mt-1" data-v-44ba4770>${ssrInterpolate(getVisitorName())}</p></div><div data-v-44ba4770><label class="text-sm font-medium text-gray-700" data-v-44ba4770>Email</label><p class="text-sm text-gray-900 mt-1" data-v-44ba4770>${ssrInterpolate(getVisitorEmail() || "Non renseign\xE9")}</p></div><div data-v-44ba4770><label class="text-sm font-medium text-gray-700" data-v-44ba4770>T\xE9l\xE9phone</label><p class="text-sm text-gray-900 mt-1" data-v-44ba4770>${ssrInterpolate(getVisitorPhone() || "Non renseign\xE9")}</p></div><div data-v-44ba4770><label class="text-sm font-medium text-gray-700" data-v-44ba4770>Premi\xE8re visite</label><p class="text-sm text-gray-900 mt-1" data-v-44ba4770>${ssrInterpolate(formatDate(conversation.value.started_at))}</p></div><div data-v-44ba4770><label class="text-sm font-medium text-gray-700" data-v-44ba4770>Produit consult\xE9</label><p class="text-sm text-gray-900 mt-1" data-v-44ba4770>${ssrInterpolate(conversation.value.product_name || "Aucun produit")}</p></div></div>`);
        } else {
          _push(`<div class="space-y-3" data-v-44ba4770><div class="animate-pulse" data-v-44ba4770><div class="h-4 bg-gray-200 rounded w-16 mb-2" data-v-44ba4770></div><div class="h-3 bg-gray-200 rounded w-24" data-v-44ba4770></div></div></div>`);
        }
        _push(`</div><div data-v-44ba4770><h3 class="text-lg font-medium text-gray-900 mb-4" data-v-44ba4770>M\xE9triques</h3>`);
        if (conversation.value && !loading.value) {
          _push(`<div class="space-y-3" data-v-44ba4770><div class="flex justify-between" data-v-44ba4770><span class="text-sm text-gray-700" data-v-44ba4770>Messages \xE9chang\xE9s</span><span class="text-sm font-medium text-gray-900" data-v-44ba4770>${ssrInterpolate(conversation.value.message_count || messages.value.length)}</span></div><div class="flex justify-between" data-v-44ba4770><span class="text-sm text-gray-700" data-v-44ba4770>Dur\xE9e</span><span class="text-sm font-medium text-gray-900" data-v-44ba4770>${ssrInterpolate(getConversationDuration())}</span></div><div class="flex justify-between" data-v-44ba4770><span class="text-sm text-gray-700" data-v-44ba4770>Statut</span><span class="${ssrRenderClass([getStatusTextClass(conversation.value.status), "text-sm font-medium"])}" data-v-44ba4770>${ssrInterpolate(getStatusLabel(conversation.value.status))}</span></div><div class="flex justify-between" data-v-44ba4770><span class="text-sm text-gray-700" data-v-44ba4770>Conversion</span><span class="${ssrRenderClass([conversation.value.conversion_completed ? "text-green-600" : "text-gray-500", "text-sm font-medium"])}" data-v-44ba4770>${ssrInterpolate(conversation.value.conversion_completed ? "Oui" : "Non")}</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div data-v-44ba4770><h3 class="text-lg font-medium text-gray-900 mb-4" data-v-44ba4770>Actions rapides</h3><div class="space-y-2" data-v-44ba4770><button class="w-full btn-primary btn-sm"${ssrIncludeBooleanAttr(!conversation.value) ? " disabled" : ""} data-v-44ba4770><svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-44ba4770></path></svg> Cr\xE9er une commande </button><button class="w-full btn-secondary btn-sm"${ssrIncludeBooleanAttr(!conversation.value) ? " disabled" : ""} data-v-44ba4770><svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-44ba4770></path></svg> Exporter </button><button class="w-full btn-secondary btn-sm"${ssrIncludeBooleanAttr(!conversation.value) ? " disabled" : ""} data-v-44ba4770><svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-44ba4770></path></svg> Ajouter une note </button></div></div></div></div></div>`);
      }
      if (notification.value.show) {
        _push(`<div class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50" data-v-44ba4770><div class="p-4" data-v-44ba4770><div class="flex items-start" data-v-44ba4770><div class="flex-shrink-0" data-v-44ba4770>`);
        if (notification.value.type === "success") {
          _push(`<svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-44ba4770></path></svg>`);
        } else {
          _push(`<svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-44ba4770><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" data-v-44ba4770></path></svg>`);
        }
        _push(`</div><div class="ml-3 w-0 flex-1 pt-0.5" data-v-44ba4770><p class="text-sm font-medium text-gray-900" data-v-44ba4770>${ssrInterpolate(notification.value.message)}</p></div><div class="ml-4 flex-shrink-0 flex" data-v-44ba4770><button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500" data-v-44ba4770><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" data-v-44ba4770><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" data-v-44ba4770></path></svg></button></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/conversations/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-44ba4770"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-CMZd6tC7.mjs.map
