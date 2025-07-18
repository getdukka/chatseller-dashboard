import { _ as __nuxt_component_0 } from './nuxt-link-v8ty_PQD.mjs';
import { _ as _sfc_main$1 } from './IntegrationModal-BVOwlfnV.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderClass, ssrRenderVNode, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { ArrowPathIcon, Cog6ToothIcon, CheckCircleIcon, EyeIcon, ChatBubbleLeftRightIcon, ChartBarIcon, CurrencyDollarIcon, ShoppingBagIcon, BookOpenIcon, CodeBracketIcon, ShoppingCartIcon, UserIcon } from '@heroicons/vue/24/outline';
import { u as useAuth } from './useAuth-CgRQXKMP.mjs';
import { u as useSeoMeta } from './v3-D4nZQNuc.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import './transition-DyayiTxm.mjs';
import './description-DeqVqtMl.mjs';
import '@supabase/functions-js';
import '@supabase/postgrest-js';
import '@supabase/realtime-js';
import '@supabase/storage-js';
import '@supabase/node-fetch';
import '@supabase/auth-js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { userProfile } = useAuth();
    const loading = ref(false);
    const showIntegrationModal = ref(false);
    const metrics = ref({
      totalConversations: 127,
      conversationsGrowth: 12,
      conversionRate: 34,
      conversionGrowth: 2.1,
      revenue: 602e3,
      revenueGrowth: 15,
      averageOrderValue: 63953,
      aovGrowth: -1.2
    });
    const widgetStats = ref({
      impressions: 1547,
      clicks: 234
    });
    const widgetConfig = ref({
      agentName: "Sophie",
      primaryColor: "#ec4899"
    });
    const recentActivity = ref([
      {
        id: 1,
        type: "order",
        message: "Nouvelle commande de Marie Dubois",
        timestamp: new Date(Date.now() - 2 * 60 * 1e3),
        amount: 45e3
      },
      {
        id: 2,
        type: "conversation",
        message: "Conversation d\xE9marr\xE9e par client@example.com",
        timestamp: new Date(Date.now() - 10 * 60 * 1e3)
      },
      {
        id: 3,
        type: "visitor",
        message: "Nouveau visiteur sur la page produit iPhone",
        timestamp: new Date(Date.now() - 15 * 60 * 1e3)
      },
      {
        id: 4,
        type: "order",
        message: "Commande finalis\xE9e par Jean Martin",
        timestamp: new Date(Date.now() - 30 * 60 * 1e3),
        amount: 75e3
      },
      {
        id: 5,
        type: "conversation",
        message: "Conversation termin\xE9e avec succ\xE8s",
        timestamp: new Date(Date.now() - 45 * 60 * 1e3)
      }
    ]);
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 0
      }).format(amount);
    };
    const formatTime = (date) => {
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1e3 * 60));
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      if (minutes < 1) return "\xC0 l'instant";
      if (minutes < 60) return `Il y a ${minutes} min`;
      if (hours < 24) return `Il y a ${hours}h`;
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const getActivityIcon = (type) => {
      const icons = {
        conversation: ChatBubbleLeftRightIcon,
        order: ShoppingCartIcon,
        visitor: EyeIcon
      };
      return icons[type] || UserIcon;
    };
    useSeoMeta({
      title: "Dashboard - ChatSeller",
      description: "Tableau de bord de votre Agent IA Commercial"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_IntegrationModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg"><div class="flex items-center justify-between"><div><h1 class="text-3xl font-bold"> Bonjour ${ssrInterpolate(((_a = unref(userProfile)) == null ? void 0 : _a.firstName) || "Marchand")} ! \u{1F44B} </h1><p class="text-blue-100 mt-2 text-lg"> Voici un aper\xE7u de votre Agent IA Commercial aujourd&#39;hui </p></div><div class="flex items-center space-x-4"><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50">`);
      _push(ssrRenderComponent(unref(ArrowPathIcon), {
        class: ["h-5 w-5 mr-2", loading.value && "animate-spin"]
      }, null, _parent));
      _push(` Actualiser </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/settings",
        class: "inline-flex items-center px-6 py-3 bg-white text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 shadow-md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Cog6ToothIcon), { class: "h-5 w-5 mr-2" }, null, _parent2, _scopeId));
            _push2(` Configurer `);
          } else {
            return [
              createVNode(unref(Cog6ToothIcon), { class: "h-5 w-5 mr-2" }),
              createTextVNode(" Configurer ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-bold text-gray-900">Statut du widget</h2><div class="flex items-center space-x-2"><div class="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div><span class="text-sm font-medium text-green-600">En ligne</span></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="col-span-1 md:col-span-2"><div class="bg-green-50 rounded-lg p-6 border border-green-200"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(CheckCircleIcon), { class: "h-7 w-7 text-green-600" }, null, _parent));
      _push(`</div><div><h3 class="text-lg font-semibold text-green-800">Widget actif</h3><p class="text-sm text-green-600">Derni\xE8re activit\xE9 il y a 2 minutes</p></div></div><button class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(EyeIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
      _push(` Aper\xE7u </button></div></div></div><div class="space-y-4"><div class="text-center p-4 bg-gray-50 rounded-lg"><p class="text-3xl font-bold text-gray-900">${ssrInterpolate(widgetStats.value.impressions.toLocaleString())}</p><p class="text-sm text-gray-500">Vues aujourd&#39;hui</p></div><div class="text-center p-4 bg-gray-50 rounded-lg"><p class="text-3xl font-bold text-gray-900">${ssrInterpolate(widgetStats.value.clicks.toLocaleString())}</p><p class="text-sm text-gray-500">Clics aujourd&#39;hui</p></div></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"><div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"><div class="flex items-center justify-between"><div><p class="text-sm font-medium text-gray-600">Conversations totales</p><p class="text-3xl font-bold text-gray-900 mt-2">${ssrInterpolate(metrics.value.totalConversations.toLocaleString())}</p><div class="flex items-center mt-3"><div class="${ssrRenderClass([
        "flex items-center text-sm font-medium",
        metrics.value.conversationsGrowth >= 0 ? "text-green-600" : "text-red-600"
      ])}">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(metrics.value.conversationsGrowth >= 0 ? "ArrowTrendingUpIcon" : "ArrowTrendingDownIcon"), { class: "h-4 w-4 mr-1" }, null), _parent);
      _push(` ${ssrInterpolate(Math.abs(metrics.value.conversationsGrowth))}% </div><span class="text-sm text-gray-500 ml-2">vs hier</span></div></div><div class="p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(ChatBubbleLeftRightIcon), { class: "h-8 w-8 text-blue-600" }, null, _parent));
      _push(`</div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"><div class="flex items-center justify-between"><div><p class="text-sm font-medium text-gray-600">Taux de conversion</p><p class="text-3xl font-bold text-gray-900 mt-2">${ssrInterpolate(metrics.value.conversionRate)}% </p><div class="flex items-center mt-3"><div class="${ssrRenderClass([
        "flex items-center text-sm font-medium",
        metrics.value.conversionGrowth >= 0 ? "text-green-600" : "text-red-600"
      ])}">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(metrics.value.conversionGrowth >= 0 ? "ArrowTrendingUpIcon" : "ArrowTrendingDownIcon"), { class: "h-4 w-4 mr-1" }, null), _parent);
      _push(` ${ssrInterpolate(Math.abs(metrics.value.conversionGrowth))}% </div><span class="text-sm text-gray-500 ml-2">vs hier</span></div></div><div class="p-4 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(ChartBarIcon), { class: "h-8 w-8 text-green-600" }, null, _parent));
      _push(`</div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"><div class="flex items-center justify-between"><div><p class="text-sm font-medium text-gray-600">Revenus g\xE9n\xE9r\xE9s</p><p class="text-3xl font-bold text-gray-900 mt-2">${ssrInterpolate(formatCurrency(metrics.value.revenue))}</p><div class="flex items-center mt-3"><div class="${ssrRenderClass([
        "flex items-center text-sm font-medium",
        metrics.value.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
      ])}">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(metrics.value.revenueGrowth >= 0 ? "ArrowTrendingUpIcon" : "ArrowTrendingDownIcon"), { class: "h-4 w-4 mr-1" }, null), _parent);
      _push(` ${ssrInterpolate(Math.abs(metrics.value.revenueGrowth))}% </div><span class="text-sm text-gray-500 ml-2">vs hier</span></div></div><div class="p-4 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(CurrencyDollarIcon), { class: "h-8 w-8 text-purple-600" }, null, _parent));
      _push(`</div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"><div class="flex items-center justify-between"><div><p class="text-sm font-medium text-gray-600">Panier moyen</p><p class="text-3xl font-bold text-gray-900 mt-2">${ssrInterpolate(formatCurrency(metrics.value.averageOrderValue))}</p><div class="flex items-center mt-3"><div class="${ssrRenderClass([
        "flex items-center text-sm font-medium",
        metrics.value.aovGrowth >= 0 ? "text-green-600" : "text-red-600"
      ])}">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(metrics.value.aovGrowth >= 0 ? "ArrowTrendingUpIcon" : "ArrowTrendingDownIcon"), { class: "h-4 w-4 mr-1" }, null), _parent);
      _push(` ${ssrInterpolate(Math.abs(metrics.value.aovGrowth))}% </div><span class="text-sm text-gray-500 ml-2">vs hier</span></div></div><div class="p-4 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(ShoppingBagIcon), { class: "h-8 w-8 text-orange-600" }, null, _parent));
      _push(`</div></div></div></div><div class="grid grid-cols-1 xl:grid-cols-3 gap-8"><div class="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-bold text-gray-900">Activit\xE9 r\xE9cente</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/conversations",
        class: "text-sm text-blue-600 hover:text-blue-700 font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir tout \u2192 `);
          } else {
            return [
              createTextVNode(" Voir tout \u2192 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-4"><!--[-->`);
      ssrRenderList(recentActivity.value, (activity) => {
        _push(`<div class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"><div class="${ssrRenderClass([
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          activity.type === "conversation" && "bg-blue-100",
          activity.type === "order" && "bg-green-100",
          activity.type === "visitor" && "bg-purple-100"
        ])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getActivityIcon(activity.type)), {
          class: [
            "h-5 w-5",
            activity.type === "conversation" && "text-blue-600",
            activity.type === "order" && "text-green-600",
            activity.type === "visitor" && "text-purple-600"
          ]
        }, null), _parent);
        _push(`</div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-gray-900">${ssrInterpolate(activity.message)}</p><p class="text-xs text-gray-500 mt-1">${ssrInterpolate(formatTime(activity.timestamp))}</p></div>`);
        if (activity.amount) {
          _push(`<span class="text-sm font-semibold text-green-600">${ssrInterpolate(formatCurrency(activity.amount))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h2 class="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2><div class="space-y-4"><button class="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group text-left"><div class="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(Cog6ToothIcon), { class: "h-6 w-6 text-blue-600" }, null, _parent));
      _push(`</div><div class="ml-4"><h3 class="text-sm font-medium text-gray-900 group-hover:text-blue-700"> Configurer l&#39;agent </h3><p class="text-xs text-gray-500 mt-1"> Personnalisez votre IA </p></div></button><button class="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 group text-left"><div class="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(BookOpenIcon), { class: "h-6 w-6 text-green-600" }, null, _parent));
      _push(`</div><div class="ml-4"><h3 class="text-sm font-medium text-gray-900 group-hover:text-green-700"> Base de connaissance </h3><p class="text-xs text-gray-500 mt-1"> Ajouter du contenu </p></div></button><button class="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group text-left"><div class="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(CodeBracketIcon), { class: "h-6 w-6 text-purple-600" }, null, _parent));
      _push(`</div><div class="ml-4"><h3 class="text-sm font-medium text-gray-900 group-hover:text-purple-700"> Code d&#39;int\xE9gration </h3><p class="text-xs text-gray-500 mt-1"> Installer le widget </p></div></button><button class="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group text-left"><div class="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(ChartBarIcon), { class: "h-6 w-6 text-orange-600" }, null, _parent));
      _push(`</div><div class="ml-4"><h3 class="text-sm font-medium text-gray-900 group-hover:text-orange-700"> Analytics d\xE9taill\xE9es </h3><p class="text-xs text-gray-500 mt-1"> Voir les performances </p></div></button></div><div class="mt-8 pt-6 border-t border-gray-200"><h3 class="text-sm font-medium text-gray-900 mb-4">Configuration actuelle</h3><div class="space-y-3 text-sm"><div class="flex justify-between items-center"><span class="text-gray-500">Agent :</span><span class="font-medium">${ssrInterpolate(widgetConfig.value.agentName)}</span></div><div class="flex justify-between items-center"><span class="text-gray-500">Couleur :</span><div class="flex items-center"><div class="w-4 h-4 rounded-full mr-2" style="${ssrRenderStyle({ backgroundColor: widgetConfig.value.primaryColor })}"></div><span class="font-medium">${ssrInterpolate(widgetConfig.value.primaryColor)}</span></div></div><div class="flex justify-between items-center"><span class="text-gray-500">Statut :</span><span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div> Actif </span></div></div></div></div></div>`);
      _push(ssrRenderComponent(_component_IntegrationModal, {
        show: showIntegrationModal.value,
        onClose: ($event) => showIntegrationModal.value = false,
        "user-id": (_b = unref(userProfile)) == null ? void 0 : _b.id
      }, null, _parent));
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

export { _sfc_main as default };
//# sourceMappingURL=index-D8emTnif.mjs.map
