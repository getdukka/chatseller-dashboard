import { defineComponent, ref, computed, watch, resolveComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { ArrowDownTrayIcon, ArrowPathIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon, EyeIcon, UserIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import { u as useSeoMeta } from './v3-D4nZQNuc.mjs';
import './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "conversations",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const showConversationModal = ref(false);
    const selectedConversationId = ref("");
    const currentPage = ref(1);
    const filters = ref({
      status: "",
      period: "today",
      search: ""
    });
    const stats = ref({
      totalToday: 23,
      converted: 8,
      active: 3,
      averageTime: 12
    });
    const conversations = ref([
      {
        id: "1",
        visitor_email: "marie.dubois@email.com",
        visitor_ip: "192.168.1.1",
        status: "completed",
        message_count: 15,
        order_amount: 45e3,
        order_status: "confirm\xE9e",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
        last_activity: new Date(Date.now() - 10 * 60 * 1e3)
      },
      {
        id: "2",
        visitor_email: null,
        visitor_ip: "192.168.1.2",
        status: "active",
        message_count: 3,
        order_amount: null,
        order_status: null,
        created_at: new Date(Date.now() - 30 * 60 * 1e3).toISOString(),
        last_activity: new Date(Date.now() - 2 * 60 * 1e3)
      },
      {
        id: "3",
        visitor_email: "jean.martin@test.com",
        visitor_ip: "192.168.1.3",
        status: "abandoned",
        message_count: 8,
        order_amount: null,
        order_status: null,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString(),
        last_activity: new Date(Date.now() - 2 * 60 * 60 * 1e3)
      },
      {
        id: "4",
        visitor_email: "sophie.laurent@gmail.com",
        visitor_ip: "192.168.1.4",
        status: "completed",
        message_count: 12,
        order_amount: 75e3,
        order_status: "en traitement",
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString(),
        last_activity: new Date(Date.now() - 4 * 60 * 60 * 1e3)
      }
    ]);
    const filteredConversations = computed(() => {
      let filtered = conversations.value;
      if (filters.value.status) {
        filtered = filtered.filter((conv) => conv.status === filters.value.status);
      }
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase();
        filtered = filtered.filter(
          (conv) => {
            var _a;
            return ((_a = conv.visitor_email) == null ? void 0 : _a.toLowerCase().includes(search)) || conv.visitor_ip.includes(search);
          }
        );
      }
      return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });
    const totalPages = computed(() => Math.ceil(filteredConversations.value.length / perPage));
    const startIndex = computed(() => (currentPage.value - 1) * perPage + 1);
    const endIndex = computed(() => Math.min(currentPage.value * perPage, filteredConversations.value.length));
    const paginatedConversations = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      const end = start + perPage;
      return filteredConversations.value.slice(start, end);
    });
    const visiblePages = computed(() => {
      const pages = [];
      const start = Math.max(1, currentPage.value - 2);
      const end = Math.min(totalPages.value, start + 4);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });
    const getInitials = (name) => {
      return name.split(" ").map((n) => n.charAt(0)).join("").toUpperCase().slice(0, 2);
    };
    const getStatusClass = (status) => {
      const classes = {
        active: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
        completed: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
        abandoned: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
      };
      return classes[status] || classes.abandoned;
    };
    const getStatusText = (status) => {
      const texts = {
        active: "En cours",
        completed: "Termin\xE9e",
        abandoned: "Abandonn\xE9e"
      };
      return texts[status] || "Inconnue";
    };
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 0
      }).format(amount);
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const getTimeAgo = (date) => {
      const now = /* @__PURE__ */ new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1e3 * 60));
      if (diffInMinutes < 1) return "\xE0 l'instant";
      if (diffInMinutes < 60) return `${diffInMinutes} min`;
      const hours = Math.floor(diffInMinutes / 60);
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      return `${days}j`;
    };
    watch(filters, () => {
      currentPage.value = 1;
    }, { deep: true });
    useSeoMeta({
      title: "Conversations - ChatSeller",
      description: "G\xE9rez et supervisez toutes les conversations clients"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConversationMod = resolveComponent("ConversationMod");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"><div><h1 class="text-2xl font-bold text-gray-900">Conversations</h1><p class="text-sm text-gray-500 mt-1"> G\xE9rez et supervisez toutes les conversations clients en temps r\xE9el </p></div><div class="flex items-center gap-3"><button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(ArrowDownTrayIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
      _push(` Exporter CSV </button><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(ArrowPathIcon), {
        class: ["h-4 w-4 mr-2", loading.value && "animate-spin"]
      }, null, _parent));
      _push(` Actualiser </button></div></div><div class="flex flex-col sm:flex-row sm:items-center gap-4"><select class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "") : ssrLooseEqual(filters.value.status, "")) ? " selected" : ""}>Tous les statuts</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "active") : ssrLooseEqual(filters.value.status, "active")) ? " selected" : ""}>En cours</option><option value="completed"${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "completed") : ssrLooseEqual(filters.value.status, "completed")) ? " selected" : ""}>Termin\xE9es</option><option value="abandoned"${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "abandoned") : ssrLooseEqual(filters.value.status, "abandoned")) ? " selected" : ""}>Abandonn\xE9es</option></select><select class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"><option value="today"${ssrIncludeBooleanAttr(Array.isArray(filters.value.period) ? ssrLooseContain(filters.value.period, "today") : ssrLooseEqual(filters.value.period, "today")) ? " selected" : ""}>Aujourd&#39;hui</option><option value="week"${ssrIncludeBooleanAttr(Array.isArray(filters.value.period) ? ssrLooseContain(filters.value.period, "week") : ssrLooseEqual(filters.value.period, "week")) ? " selected" : ""}>Cette semaine</option><option value="month"${ssrIncludeBooleanAttr(Array.isArray(filters.value.period) ? ssrLooseContain(filters.value.period, "month") : ssrLooseEqual(filters.value.period, "month")) ? " selected" : ""}>Ce mois</option><option value="all"${ssrIncludeBooleanAttr(Array.isArray(filters.value.period) ? ssrLooseContain(filters.value.period, "all") : ssrLooseEqual(filters.value.period, "all")) ? " selected" : ""}>Toutes</option></select><div class="relative flex-1 max-w-md">`);
      _push(ssrRenderComponent(unref(MagnifyingGlassIcon), { class: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", filters.value.search)} type="text" placeholder="Rechercher un client..." class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"></div></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center"><div class="flex-shrink-0"><div class="p-3 bg-blue-50 rounded-xl">`);
      _push(ssrRenderComponent(unref(ChatBubbleLeftRightIcon), { class: "h-6 w-6 text-blue-600" }, null, _parent));
      _push(`</div></div><div class="ml-4"><p class="text-sm font-medium text-gray-600">Total aujourd&#39;hui</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(stats.value.totalToday)}</p></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center"><div class="flex-shrink-0"><div class="p-3 bg-green-50 rounded-xl">`);
      _push(ssrRenderComponent(unref(CheckCircleIcon), { class: "h-6 w-6 text-green-600" }, null, _parent));
      _push(`</div></div><div class="ml-4"><p class="text-sm font-medium text-gray-600">Converties</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(stats.value.converted)}</p></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center"><div class="flex-shrink-0"><div class="p-3 bg-yellow-50 rounded-xl">`);
      _push(ssrRenderComponent(unref(ClockIcon), { class: "h-6 w-6 text-yellow-600" }, null, _parent));
      _push(`</div></div><div class="ml-4"><p class="text-sm font-medium text-gray-600">En cours</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(stats.value.active)}</p></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center"><div class="flex-shrink-0"><div class="p-3 bg-purple-50 rounded-xl">`);
      _push(ssrRenderComponent(unref(ClockIcon), { class: "h-6 w-6 text-purple-600" }, null, _parent));
      _push(`</div></div><div class="ml-4"><p class="text-sm font-medium text-gray-600">Temps moyen</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(stats.value.averageTime)}min</p></div></div></div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"><div class="px-6 py-4 border-b border-gray-200"><h3 class="text-lg font-semibold text-gray-900"> Conversations r\xE9centes (${ssrInterpolate(filteredConversations.value.length)}) </h3></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Visiteur </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Statut </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Messages </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Commande </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> D\xE9marr\xE9e </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Actions </th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
      ssrRenderList(paginatedConversations.value, (conversation) => {
        _push(`<tr class="hover:bg-gray-50 transition-colors duration-200"><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="flex-shrink-0 h-10 w-10"><div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center"><span class="text-white font-medium text-sm">${ssrInterpolate(getInitials(conversation.visitor_email || "Visiteur"))}</span></div></div><div class="ml-4"><p class="text-sm font-medium text-gray-900">${ssrInterpolate(conversation.visitor_email || "Visiteur anonyme")}</p><p class="text-xs text-gray-500">${ssrInterpolate(conversation.visitor_ip)}</p></div></div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass(getStatusClass(conversation.status))}">${ssrInterpolate(getStatusText(conversation.status))}</span></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900"><span class="font-medium">${ssrInterpolate(conversation.message_count)}</span> messages </div><div class="text-xs text-gray-500"> Derni\xE8re activit\xE9 il y a ${ssrInterpolate(getTimeAgo(conversation.last_activity))}</div></td><td class="px-6 py-4 whitespace-nowrap">`);
        if (conversation.order_amount) {
          _push(`<div class="text-sm"><p class="font-medium text-green-600">${ssrInterpolate(formatCurrency(conversation.order_amount))}</p><p class="text-xs text-gray-500">${ssrInterpolate(conversation.order_status)}</p></div>`);
        } else {
          _push(`<span class="text-sm text-gray-400">Aucune commande</span>`);
        }
        _push(`</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(conversation.created_at))}</td><td class="px-6 py-4 whitespace-nowrap text-right"><div class="flex items-center space-x-2"><button class="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="Voir d\xE9tails">`);
        _push(ssrRenderComponent(unref(EyeIcon), { class: "h-4 w-4" }, null, _parent));
        _push(`</button>`);
        if (conversation.status === "active") {
          _push(`<button class="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200" title="Prendre le contr\xF4le">`);
          _push(ssrRenderComponent(unref(UserIcon), { class: "h-4 w-4" }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200" title="Supprimer">`);
        _push(ssrRenderComponent(unref(TrashIcon), { class: "h-4 w-4" }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"><div class="flex-1 flex justify-between sm:hidden"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> Pr\xE9c\xE9dent </button><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> Suivant </button></div><div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"><div><p class="text-sm text-gray-700"> Affichage de <span class="font-medium">${ssrInterpolate(startIndex.value)}</span> \xE0 <span class="font-medium">${ssrInterpolate(endIndex.value)}</span> sur <span class="font-medium">${ssrInterpolate(filteredConversations.value.length)}</span> r\xE9sultats </p></div><div><nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">`);
      _push(ssrRenderComponent(unref(ChevronLeftIcon), { class: "h-5 w-5" }, null, _parent));
      _push(`</button><!--[-->`);
      ssrRenderList(visiblePages.value, (page) => {
        _push(`<button class="${ssrRenderClass([
          page === currentPage.value ? "z-10 bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50",
          "relative inline-flex items-center px-4 py-2 border text-sm font-medium"
        ])}">${ssrInterpolate(page)}</button>`);
      });
      _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">`);
      _push(ssrRenderComponent(unref(ChevronRightIcon), { class: "h-5 w-5" }, null, _parent));
      _push(`</button></nav></div></div></div></div>`);
      _push(ssrRenderComponent(_component_ConversationMod, {
        show: showConversationModal.value,
        onClose: ($event) => showConversationModal.value = false,
        "conversation-id": selectedConversationId.value
      }, null, _parent));
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

export { _sfc_main as default };
//# sourceMappingURL=conversations-mGCbLrGP.mjs.map
