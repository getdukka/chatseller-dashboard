import { _ as __nuxt_component_0$2 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, useSSRContext, computed, mergeProps, withCtx, createBlock, createVNode, createCommentVNode, openBlock, toDisplayString, ref, createTextVNode, watch } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useAuthStore, a as useApi } from './auth-KgQDcdck.mjs';
import { f as useRoute, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SidebarLink",
  __ssrInlineRender: true,
  props: {
    to: {},
    icon: {},
    label: {},
    isActive: { type: Boolean },
    badge: {}
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const linkClasses = computed(() => {
      const baseClasses = "relative cursor-pointer";
      return props.isActive ? `${baseClasses} bg-blue-50 text-blue-700 shadow-sm border border-blue-100` : `${baseClasses} text-gray-600 hover:bg-gray-50 hover:text-gray-900`;
    });
    const iconClasses = computed(() => {
      return props.isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600";
    });
    const handleClick = (event) => {
      console.log("\u{1F517} [SidebarLink] Click d\xE9tect\xE9 pour:", props.label, {
        to: props.to,
        isActive: props.isActive,
        target: event.target
      });
      try {
        emit("click", event);
        console.log("\u2705 [SidebarLink] \xC9v\xE9nement click \xE9mis pour:", props.label);
      } catch (error) {
        console.error("\u274C [SidebarLink] Erreur lors de l'\xE9mission du click:", error);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: _ctx.to,
        class: ["group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 sidebar-link", linkClasses.value],
        onClick: handleClick,
        tabindex: 0,
        "aria-current": _ctx.isActive ? "page" : void 0
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="${ssrRenderClass([iconClasses.value, "mr-3 h-5 w-5 transition-colors duration-200 sidebar-icon"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-465d3ab0${_scopeId}><path stroke-linecap="round" stroke-linejoin="round"${ssrRenderAttr("d", _ctx.icon)} data-v-465d3ab0${_scopeId}></path></svg><span class="flex-1 sidebar-label" data-v-465d3ab0${_scopeId}>${ssrInterpolate(_ctx.label)}</span>`);
            if (_ctx.badge) {
              _push2(`<span class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5 sidebar-badge"${ssrRenderAttr("aria-label", `${_ctx.badge} notification${_ctx.badge > 1 ? "s" : ""}`)} data-v-465d3ab0${_scopeId}>${ssrInterpolate(_ctx.badge > 99 ? "99+" : _ctx.badge)}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: ["mr-3 h-5 w-5 transition-colors duration-200 sidebar-icon", iconClasses.value],
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: _ctx.icon
                }, null, 8, ["d"])
              ], 2)),
              createVNode("span", { class: "flex-1 sidebar-label" }, toDisplayString(_ctx.label), 1),
              _ctx.badge ? (openBlock(), createBlock("span", {
                key: 0,
                class: "ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5 sidebar-badge",
                "aria-label": `${_ctx.badge} notification${_ctx.badge > 1 ? "s" : ""}`
              }, toDisplayString(_ctx.badge > 99 ? "99+" : _ctx.badge), 9, ["aria-label"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SidebarLink.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-465d3ab0"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SidebarContent",
  __ssrInlineRender: true,
  props: {
    unreadCount: {},
    userName: {},
    userEmail: {},
    userInitials: {},
    showProfileMenu: { type: Boolean },
    isMobile: { type: Boolean, default: false },
    userSubscriptionPlan: { default: "free" },
    userSubscriptionActive: { type: Boolean, default: false },
    trialDaysLeft: { default: 0 }
  },
  emits: ["toggle-profile", "close-profile", "logout", "close-mobile", "upgrade-to-plan"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const upgradingToPlan = ref(null);
    computed(() => false);
    const handleNavClick = (event) => {
      console.log("\u{1F5B1}\uFE0F [SidebarContent] Navigation click d\xE9tect\xE9", {
        isMobile: props.isMobile,
        target: event == null ? void 0 : event.target
      });
      if (event) {
        event.stopPropagation();
      }
      if (props.isMobile) {
        console.log("\u{1F4F1} [SidebarContent] Fermeture du menu mobile");
        setTimeout(() => {
          emit("close-mobile");
        }, 100);
      }
      if (props.showProfileMenu) {
        emit("close-profile");
      }
    };
    const handleCloseProfile = () => {
      console.log("\u274C [SidebarContent] Close profile menu");
      emit("close-profile");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SidebarLink = __nuxt_component_0$1;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col h-full bg-white" }, _attrs))} data-v-7b1ff1d4><div class="flex h-16 items-center justify-between px-6 border-b border-gray-100" data-v-7b1ff1d4><div class="flex items-center space-x-3" data-v-7b1ff1d4><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg" data-v-7b1ff1d4><span class="text-sm font-bold text-white" data-v-7b1ff1d4>CS</span></div><span class="text-xl font-bold text-gray-900" data-v-7b1ff1d4>ChatSeller</span></div>`);
      if (_ctx.isMobile) {
        _push(`<button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden" type="button" data-v-7b1ff1d4><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-7b1ff1d4></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto sidebar-navigation" data-v-7b1ff1d4>`);
      _push(ssrRenderComponent(_component_SidebarLink, {
        to: "/",
        isActive: _ctx.$route.path === "/",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z",
        label: "Dashboard",
        onClick: handleNavClick
      }, null, _parent));
      _push(ssrRenderComponent(_component_SidebarLink, {
        to: "/vendeurs-ia",
        isActive: _ctx.$route.path.startsWith("/vendeurs-ia"),
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
        label: "Vendeurs IA",
        onClick: handleNavClick
      }, null, _parent));
      _push(ssrRenderComponent(_component_SidebarLink, {
        to: "/conversations",
        isActive: _ctx.$route.path.startsWith("/conversations"),
        icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
        label: "Conversations",
        badge: _ctx.unreadCount > 0 ? _ctx.unreadCount : null,
        onClick: handleNavClick
      }, null, _parent));
      _push(ssrRenderComponent(_component_SidebarLink, {
        to: "/orders",
        isActive: _ctx.$route.path.startsWith("/orders"),
        icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
        label: "Commandes",
        onClick: handleNavClick
      }, null, _parent));
      _push(ssrRenderComponent(_component_SidebarLink, {
        to: "/products",
        isActive: _ctx.$route.path.startsWith("/products"),
        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
        label: "Produits",
        onClick: handleNavClick
      }, null, _parent));
      _push(ssrRenderComponent(_component_SidebarLink, {
        to: "/analytics",
        isActive: _ctx.$route.path.startsWith("/analytics"),
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z",
        label: "Analytics",
        onClick: handleNavClick
      }, null, _parent));
      _push(ssrRenderComponent(_component_SidebarLink, {
        to: "/knowledge-base",
        isActive: _ctx.$route.path.startsWith("/knowledge-base"),
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
        label: "Base de connaissance",
        onClick: handleNavClick
      }, null, _parent));
      _push(ssrRenderComponent(_component_SidebarLink, {
        to: "/billing",
        isActive: _ctx.$route.path.startsWith("/billing"),
        icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
        label: "Facturation",
        onClick: handleNavClick
      }, null, _parent));
      _push(ssrRenderComponent(_component_SidebarLink, {
        to: "/settings",
        isActive: _ctx.$route.path.startsWith("/settings"),
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
        label: "Param\xE8tres",
        onClick: handleNavClick
      }, null, _parent));
      _push(`</nav><div class="px-4 pb-4 border-t border-gray-100 pt-4" data-v-7b1ff1d4>`);
      if (_ctx.userSubscriptionPlan === "free" && _ctx.userSubscriptionActive && _ctx.trialDaysLeft > 0) {
        _push(`<button${ssrIncludeBooleanAttr(upgradingToPlan.value === "starter") ? " disabled" : ""} type="button" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3" data-v-7b1ff1d4>`);
        if (upgradingToPlan.value === "starter") {
          _push(`<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" data-v-7b1ff1d4><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-7b1ff1d4></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-7b1ff1d4></path></svg>`);
        } else {
          _push(`<svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-7b1ff1d4></path></svg>`);
        }
        _push(`<span data-v-7b1ff1d4>${ssrInterpolate(upgradingToPlan.value === "starter" ? "Redirection..." : "Passer \xE0 Starter")}</span></button>`);
      } else if (_ctx.userSubscriptionPlan === "free" && (!_ctx.userSubscriptionActive || _ctx.trialDaysLeft === 0)) {
        _push(`<button${ssrIncludeBooleanAttr(upgradingToPlan.value === "starter") ? " disabled" : ""} type="button" class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3" data-v-7b1ff1d4>`);
        if (upgradingToPlan.value === "starter") {
          _push(`<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" data-v-7b1ff1d4><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-7b1ff1d4></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-7b1ff1d4></path></svg>`);
        } else {
          _push(`<svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-7b1ff1d4></path></svg>`);
        }
        _push(`<span data-v-7b1ff1d4>${ssrInterpolate(upgradingToPlan.value === "starter" ? "Redirection..." : "R\xE9activer (Starter)")}</span></button>`);
      } else if (_ctx.userSubscriptionPlan === "starter" && _ctx.userSubscriptionActive) {
        _push(`<button${ssrIncludeBooleanAttr(upgradingToPlan.value === "pro") ? " disabled" : ""} type="button" class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3" data-v-7b1ff1d4>`);
        if (upgradingToPlan.value === "pro") {
          _push(`<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" data-v-7b1ff1d4><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-7b1ff1d4></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-7b1ff1d4></path></svg>`);
        } else {
          _push(`<svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" data-v-7b1ff1d4></path></svg>`);
        }
        _push(`<span data-v-7b1ff1d4>${ssrInterpolate(upgradingToPlan.value === "pro" ? "Redirection..." : "Passer au Pro")}</span></button>`);
      } else if (_ctx.userSubscriptionPlan === "pro" && _ctx.userSubscriptionActive) {
        _push(`<div class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 mb-3" data-v-7b1ff1d4><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-7b1ff1d4></path></svg><span data-v-7b1ff1d4>Plan Pro Actif</span></div>`);
      } else if (_ctx.userSubscriptionPlan === "starter" && !_ctx.userSubscriptionActive) {
        _push(`<button${ssrIncludeBooleanAttr(upgradingToPlan.value === "starter") ? " disabled" : ""} type="button" class="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3" data-v-7b1ff1d4>`);
        if (upgradingToPlan.value === "starter") {
          _push(`<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" data-v-7b1ff1d4><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-7b1ff1d4></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-7b1ff1d4></path></svg>`);
        } else {
          _push(`<svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-7b1ff1d4></path></svg>`);
        }
        _push(`<span data-v-7b1ff1d4>${ssrInterpolate(upgradingToPlan.value === "starter" ? "Redirection..." : "R\xE9activer Starter")}</span></button>`);
      } else if (_ctx.userSubscriptionPlan === "pro" && !_ctx.userSubscriptionActive) {
        _push(`<button${ssrIncludeBooleanAttr(upgradingToPlan.value === "pro") ? " disabled" : ""} type="button" class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3" data-v-7b1ff1d4>`);
        if (upgradingToPlan.value === "pro") {
          _push(`<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" data-v-7b1ff1d4><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-7b1ff1d4></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-7b1ff1d4></path></svg>`);
        } else {
          _push(`<svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-7b1ff1d4></path></svg>`);
        }
        _push(`<span data-v-7b1ff1d4>${ssrInterpolate(upgradingToPlan.value === "pro" ? "Redirection..." : "R\xE9activer Pro")}</span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.userSubscriptionPlan === "free" && _ctx.userSubscriptionActive && _ctx.trialDaysLeft > 0) {
        _push(`<div class="text-center text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg py-2 px-3" data-v-7b1ff1d4><div class="flex items-center justify-center space-x-1" data-v-7b1ff1d4><svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-7b1ff1d4></path></svg><span class="font-medium text-blue-700" data-v-7b1ff1d4>${ssrInterpolate(_ctx.trialDaysLeft)} jour(s) d&#39;essai</span></div></div>`);
      } else if (_ctx.userSubscriptionPlan === "free" && (!_ctx.userSubscriptionActive || _ctx.trialDaysLeft === 0)) {
        _push(`<div class="text-center text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg py-2 px-3" data-v-7b1ff1d4><div class="flex items-center justify-center space-x-1" data-v-7b1ff1d4><svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-7b1ff1d4></path></svg><span class="font-medium" data-v-7b1ff1d4>Essai expir\xE9</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="border-t border-gray-100 p-4 bg-white" data-v-7b1ff1d4><div class="relative" data-v-7b1ff1d4><button type="button" class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-7b1ff1d4><div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md" data-v-7b1ff1d4><span class="text-sm font-semibold text-white" data-v-7b1ff1d4>${ssrInterpolate(_ctx.userInitials)}</span></div><div class="flex-1 min-w-0 text-left" data-v-7b1ff1d4><p class="text-sm font-semibold text-gray-900 truncate" data-v-7b1ff1d4>${ssrInterpolate(_ctx.userName || "Utilisateur")}</p><p class="text-xs text-gray-500 truncate" data-v-7b1ff1d4>${ssrInterpolate(_ctx.userEmail || "email@exemple.com")}</p></div><svg class="${ssrRenderClass([{ "rotate-180": _ctx.showProfileMenu }, "h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-7b1ff1d4></path></svg></button>`);
      if (_ctx.showProfileMenu) {
        _push(`<div class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50" data-v-7b1ff1d4>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/settings?tab=compte",
          class: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors",
          onClick: handleCloseProfile
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7b1ff1d4${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-7b1ff1d4${_scopeId}></path></svg> Mon profil `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "mr-3 h-4 w-4 text-gray-400",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  })
                ])),
                createTextVNode(" Mon profil ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<hr class="my-1 border-gray-100" data-v-7b1ff1d4><button type="button" class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" data-v-7b1ff1d4><svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7b1ff1d4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-v-7b1ff1d4></path></svg> Se d\xE9connecter </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SidebarContent.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7b1ff1d4"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const api = useApi();
    const mobileMenuOpen = ref(false);
    const showProfileMenu = ref(false);
    const showMobileProfileMenu = ref(false);
    const upgradingToPlan = ref(null);
    const unreadConversationsCount = ref(0);
    const loadingConversations = ref(false);
    const subscriptionInfo = ref({
      plan: "free",
      isActive: false,
      trialDaysLeft: 7
    });
    const userName = computed(() => authStore.userName || "Utilisateur");
    const userEmail = computed(() => authStore.userEmail || "email@exemple.com");
    const userInitials = computed(() => authStore.userInitials || "U");
    const loadUnreadConversations = async () => {
      if (!authStore.userShopId || loadingConversations.value) {
        return;
      }
      try {
        loadingConversations.value = true;
        console.log("\u{1F504} [Layout] Chargement conversations non lues via API pour shop:", authStore.userShopId);
        const response = await api.conversations.list();
        if (response.success && response.data) {
          const unreadCount = response.data.filter(
            (conv) => conv.status === "new" || conv.status === "active"
          ).length;
          unreadConversationsCount.value = unreadCount;
          console.log("\u2705 [Layout] Conversations non lues charg\xE9es via API:", unreadCount);
        } else {
          console.error("\u274C [Layout] Erreur API conversations:", response.error);
          unreadConversationsCount.value = 0;
        }
      } catch (error) {
        console.error("\u274C [Layout] Erreur loading conversations via API:", error);
        unreadConversationsCount.value = 0;
      } finally {
        loadingConversations.value = false;
      }
    };
    const closeMobileMenu = () => {
      console.log("\u2705 [Layout] Fermeture mobile menu");
      mobileMenuOpen.value = false;
    };
    const toggleProfileMenu = () => {
      console.log("\u{1F504} [Layout] Toggle profile menu:", !showProfileMenu.value);
      showProfileMenu.value = !showProfileMenu.value;
    };
    const closeProfileMenu = () => {
      console.log("\u2705 [Layout] Fermeture profile menu");
      showProfileMenu.value = false;
    };
    const closeMobileProfileMenu = () => {
      console.log("\u2705 [Layout] Fermeture mobile profile menu");
      showMobileProfileMenu.value = false;
    };
    const handleUpgradeToPlan = async (targetPlan) => {
      console.log(`\u{1F680} [Layout] Initiation upgrade vers ${targetPlan}`);
      upgradingToPlan.value = targetPlan;
      showMobileProfileMenu.value = false;
      showProfileMenu.value = false;
      try {
        const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/billing/create-checkout-session`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${authStore.token}`,
            "Content-Type": "application/json"
          },
          body: {
            plan: targetPlan,
            successUrl: `${(void 0).location.origin}/billing?success=true&plan=${targetPlan}`,
            cancelUrl: `${(void 0).location.origin}/billing?cancelled=true`
          }
        });
        console.log("\u{1F4B3} [Layout] R\xE9ponse API checkout:", response);
        if (response.success && response.checkoutUrl) {
          console.log("\u{1F504} [Layout] Redirection vers Stripe Checkout:", response.checkoutUrl);
          (void 0).location.href = response.checkoutUrl;
        } else {
          throw new Error(response.error || "Impossible de cr\xE9er la session de paiement");
        }
      } catch (error) {
        console.error(`\u274C [Layout] Erreur lors de l'upgrade vers ${targetPlan}:`, error);
        upgradingToPlan.value = null;
        alert(error.message || `Erreur lors de l'upgrade vers ${targetPlan}`);
      }
    };
    const loadSubscriptionInfo = async () => {
      try {
        console.log("\u{1F504} [Layout] Synchronisation subscription info depuis AuthStore...");
        const planDetails = authStore.planDetails;
        subscriptionInfo.value = {
          plan: planDetails.code,
          isActive: planDetails.isActive,
          trialDaysLeft: planDetails.trialDaysLeft
        };
        console.log("\u2705 [Layout] Subscription info synchronis\xE9e:", subscriptionInfo.value);
      } catch (error) {
        console.error("\u274C [Layout] Erreur synchronisation subscription info:", error);
        subscriptionInfo.value = {
          plan: "free",
          isActive: true,
          trialDaysLeft: 5
        };
      }
    };
    const handleLogout = async () => {
      console.log("\u{1F6AA} [Layout] D\xE9connexion en cours...");
      showProfileMenu.value = false;
      showMobileProfileMenu.value = false;
      closeMobileMenu();
      await authStore.logout();
      await navigateTo("/login");
    };
    const updateBodyScroll = () => {
      if (mobileMenuOpen.value) {
        (void 0).body.style.overflow = "hidden";
      } else {
        (void 0).body.style.overflow = "";
      }
    };
    watch(mobileMenuOpen, updateBodyScroll);
    watch(() => authStore.isAuthenticated, async (isAuth) => {
      console.log("\u{1F504} [Layout] Auth state changed:", isAuth);
      if (isAuth && authStore.token) {
        await loadSubscriptionInfo();
        await loadUnreadConversations();
      } else {
        subscriptionInfo.value = {
          plan: "free",
          isActive: false,
          trialDaysLeft: 7
        };
        unreadConversationsCount.value = 0;
      }
    });
    watch(() => authStore.planDetails, (newPlanDetails) => {
      console.log("\u{1F504} [Layout] Plan details changed in AuthStore:", newPlanDetails);
      subscriptionInfo.value = {
        plan: newPlanDetails.code,
        isActive: newPlanDetails.isActive,
        trialDaysLeft: newPlanDetails.trialDaysLeft
      };
    }, { deep: true });
    watch(() => authStore.userShopId, async (newShopId) => {
      console.log("\u{1F504} [Layout] Shop ID changed:", newShopId);
      if (newShopId) {
        await loadUnreadConversations();
      } else {
        unreadConversationsCount.value = 0;
      }
    });
    const route = useRoute();
    watch(() => route.path, (newPath) => {
      console.log("\u{1F504} [Layout] Route changed:", newPath);
      closeMobileMenu();
      closeMobileProfileMenu();
      closeProfileMenu();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SidebarContent = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-b378fda0><div class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-xl lg:border-r lg:border-gray-100" data-v-b378fda0>`);
      _push(ssrRenderComponent(_component_SidebarContent, {
        unreadCount: unreadConversationsCount.value,
        userName: userName.value,
        userEmail: userEmail.value,
        userInitials: userInitials.value,
        showProfileMenu: showProfileMenu.value,
        userSubscriptionPlan: subscriptionInfo.value.plan,
        userSubscriptionActive: subscriptionInfo.value.isActive,
        trialDaysLeft: subscriptionInfo.value.trialDaysLeft,
        onToggleProfile: toggleProfileMenu,
        onCloseProfile: closeProfileMenu,
        onLogout: handleLogout,
        onUpgradeToPlan: handleUpgradeToPlan
      }, null, _parent));
      _push(`</div>`);
      if (mobileMenuOpen.value) {
        _push(`<div class="fixed inset-0 z-50 lg:hidden" data-v-b378fda0><div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" data-v-b378fda0></div>`);
        if (mobileMenuOpen.value) {
          _push(`<div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl" data-v-b378fda0>`);
          _push(ssrRenderComponent(_component_SidebarContent, {
            unreadCount: unreadConversationsCount.value,
            userName: userName.value,
            userEmail: userEmail.value,
            userInitials: userInitials.value,
            showProfileMenu: showProfileMenu.value,
            userSubscriptionPlan: subscriptionInfo.value.plan,
            userSubscriptionActive: subscriptionInfo.value.isActive,
            trialDaysLeft: subscriptionInfo.value.trialDaysLeft,
            isMobile: true,
            onToggleProfile: toggleProfileMenu,
            onCloseProfile: closeProfileMenu,
            onLogout: handleLogout,
            onCloseMobile: closeMobileMenu,
            onUpgradeToPlan: handleUpgradeToPlan
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3" data-v-b378fda0><div class="flex items-center justify-between" data-v-b378fda0><button class="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" data-v-b378fda0><span class="sr-only" data-v-b378fda0>${ssrInterpolate(mobileMenuOpen.value ? "Fermer le menu" : "Ouvrir le menu")}</span>`);
      if (!mobileMenuOpen.value) {
        _push(`<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b378fda0><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-v-b378fda0></path></svg>`);
      } else {
        _push(`<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b378fda0><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-b378fda0></path></svg>`);
      }
      _push(`</button><div class="flex items-center space-x-3" data-v-b378fda0><div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg" data-v-b378fda0><span class="text-xs font-bold text-white" data-v-b378fda0>CS</span></div><span class="text-lg font-bold text-gray-900" data-v-b378fda0>ChatSeller</span></div><div class="flex items-center space-x-2" data-v-b378fda0>`);
      if (subscriptionInfo.value.plan === "pro" && subscriptionInfo.value.isActive) {
        _push(`<div class="flex items-center space-x-1 px-2 py-1 bg-green-50 border border-green-200 rounded-lg" data-v-b378fda0><div class="w-1.5 h-1.5 bg-green-500 rounded-full" data-v-b378fda0></div><span class="text-xs font-medium text-green-700" data-v-b378fda0>Pro</span></div>`);
      } else if (subscriptionInfo.value.plan === "starter" && subscriptionInfo.value.isActive) {
        _push(`<div class="flex items-center space-x-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg" data-v-b378fda0><div class="w-1.5 h-1.5 bg-blue-500 rounded-full" data-v-b378fda0></div><span class="text-xs font-medium text-blue-700" data-v-b378fda0>Starter</span></div>`);
      } else if (subscriptionInfo.value.plan === "free" && subscriptionInfo.value.isActive && subscriptionInfo.value.trialDaysLeft > 0) {
        _push(`<div class="flex items-center space-x-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg" data-v-b378fda0><div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" data-v-b378fda0></div><span class="text-xs font-medium text-blue-700" data-v-b378fda0>${ssrInterpolate(subscriptionInfo.value.trialDaysLeft)}j</span></div>`);
      } else if (subscriptionInfo.value.plan === "free" && (!subscriptionInfo.value.isActive || subscriptionInfo.value.trialDaysLeft === 0)) {
        _push(`<div class="flex items-center space-x-1 px-2 py-1 bg-red-50 border border-red-200 rounded-lg" data-v-b378fda0><div class="w-1.5 h-1.5 bg-red-500 rounded-full" data-v-b378fda0></div><span class="text-xs font-medium text-red-700" data-v-b378fda0>Expir\xE9</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="relative" data-v-b378fda0><div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md" data-v-b378fda0><span class="text-xs font-semibold text-white" data-v-b378fda0>${ssrInterpolate(userInitials.value)}</span></div>`);
      if (showMobileProfileMenu.value) {
        _push(`<div class="absolute right-0 top-10 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2" data-v-b378fda0><div class="px-4 py-3 border-b border-gray-100" data-v-b378fda0><p class="text-sm font-medium text-gray-900" data-v-b378fda0>${ssrInterpolate(userName.value || "Utilisateur")}</p><p class="text-xs text-gray-500" data-v-b378fda0>${ssrInterpolate(userEmail.value || "email@exemple.com")}</p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/settings?tab=compte",
          class: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors",
          onClick: closeMobileProfileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b378fda0${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-b378fda0${_scopeId}></path></svg> Mon profil `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "mr-3 h-4 w-4 text-gray-400",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  })
                ])),
                createTextVNode(" Mon profil ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/billing",
          class: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors",
          onClick: closeMobileProfileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b378fda0${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" data-v-b378fda0${_scopeId}></path></svg> Facturation `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "mr-3 h-4 w-4 text-gray-400",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  })
                ])),
                createTextVNode(" Facturation ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (subscriptionInfo.value.plan === "free") {
          _push(`<button${ssrIncludeBooleanAttr(upgradingToPlan.value === "starter") ? " disabled" : ""} class="w-full flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50" data-v-b378fda0><svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b378fda0><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-b378fda0></path></svg> ${ssrInterpolate(upgradingToPlan.value === "starter" ? "Redirection..." : subscriptionInfo.value.trialDaysLeft > 0 ? "Passer \xE0 Starter" : "R\xE9activer (Starter)")}</button>`);
        } else if (subscriptionInfo.value.plan === "starter" && subscriptionInfo.value.isActive) {
          _push(`<button${ssrIncludeBooleanAttr(upgradingToPlan.value === "pro") ? " disabled" : ""} class="w-full flex items-center px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50" data-v-b378fda0><svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b378fda0><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" data-v-b378fda0></path></svg> ${ssrInterpolate(upgradingToPlan.value === "pro" ? "Redirection..." : "Passer au Pro")}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" data-v-b378fda0><svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-b378fda0><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-v-b378fda0></path></svg> Se d\xE9connecter </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div></div></div><div class="lg:pl-64" data-v-b378fda0><main class="min-h-screen" data-v-b378fda0>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
      if (upgradingToPlan.value) {
        _push(`<div class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center" data-v-b378fda0><div class="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full mx-4" data-v-b378fda0><div class="text-center" data-v-b378fda0><div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" data-v-b378fda0><svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" data-v-b378fda0><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-b378fda0></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-b378fda0></path></svg></div><h3 class="text-lg font-semibold text-gray-900 mb-2" data-v-b378fda0>Redirection vers Stripe</h3><p class="text-gray-600" data-v-b378fda0>Pr\xE9paration de votre session de paiement ${ssrInterpolate(upgradingToPlan.value)}...</p></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b378fda0"]]);

export { _default as default };
//# sourceMappingURL=default-Zbh8HZtO.mjs.map
