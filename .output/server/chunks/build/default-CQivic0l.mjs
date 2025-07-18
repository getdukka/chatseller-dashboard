import { _ as __nuxt_component_0 } from './nuxt-link-v8ty_PQD.mjs';
import { _ as _sfc_main$1 } from './IntegrationModal-BVOwlfnV.mjs';
import { defineComponent, ref, computed, watch, provide, mergeProps, withCtx, createVNode, unref, resolveDynamicComponent, createBlock, createTextVNode, createCommentVNode, openBlock, toDisplayString, Transition, onMounted, onUnmounted, watchEffect, nextTick, inject, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { HomeIcon, ChatBubbleLeftRightIcon, ShoppingBagIcon, BookOpenIcon, ChartBarIcon, Cog6ToothIcon, XMarkIcon, CodeBracketIcon, EyeIcon, ChevronUpDownIcon, UserIcon, ArrowRightOnRectangleIcon, Bars3Icon, BellIcon, MagnifyingGlassIcon, InformationCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import { u as useAuth } from './useAuth-CgRQXKMP.mjs';
import { o as o$1, b as u$2, A as A$1, i as i$2, N, a as o$2 } from './description-DeqVqtMl.mjs';
import { w as w$1, a as w$3, b as h, t as t$2, i as i$1, l as l$2, c as i$3, O as O$1, v, N as N$3, _ } from './transition-DyayiTxm.mjs';
import { s } from './use-resolve-button-type-DvynZEma.mjs';
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
import '@supabase/functions-js';
import '@supabase/postgrest-js';
import '@supabase/realtime-js';
import '@supabase/storage-js';
import '@supabase/node-fetch';
import '@supabase/auth-js';

function r(e) {
  return [e.screenX, e.screenY];
}
function u$1() {
  let e = ref([-1, -1]);
  return { wasMoved(n) {
    let t2 = r(n);
    return e.value[0] === t2[0] && e.value[1] === t2[1] ? false : (e.value = t2, true);
  }, update(n) {
    e.value = r(n);
  } };
}
function i({ container: e, accept: t2, walk: d, enabled: o2 }) {
  watchEffect(() => {
    let r2 = e.value;
    if (!r2 || o2 !== void 0 && !o2.value) return;
    let l2 = i$3(e);
    if (!l2) return;
    let c2 = Object.assign((f2) => t2(f2), { acceptNode: t2 }), n = l2.createTreeWalker(r2, NodeFilter.SHOW_ELEMENT, c2, false);
    for (; n.nextNode(); ) d(n.currentNode);
  });
}
function u(l2) {
  throw new Error("Unexpected object: " + l2);
}
var c = ((i2) => (i2[i2.First = 0] = "First", i2[i2.Previous = 1] = "Previous", i2[i2.Next = 2] = "Next", i2[i2.Last = 3] = "Last", i2[i2.Specific = 4] = "Specific", i2[i2.Nothing = 5] = "Nothing", i2))(c || {});
function f(l2, n) {
  let t2 = n.resolveItems();
  if (t2.length <= 0) return null;
  let r2 = n.resolveActiveIndex(), s2 = r2 != null ? r2 : -1;
  switch (l2.focus) {
    case 0: {
      for (let e = 0; e < t2.length; ++e) if (!n.resolveDisabled(t2[e], e, t2)) return e;
      return r2;
    }
    case 1: {
      s2 === -1 && (s2 = t2.length);
      for (let e = s2 - 1; e >= 0; --e) if (!n.resolveDisabled(t2[e], e, t2)) return e;
      return r2;
    }
    case 2: {
      for (let e = s2 + 1; e < t2.length; ++e) if (!n.resolveDisabled(t2[e], e, t2)) return e;
      return r2;
    }
    case 3: {
      for (let e = t2.length - 1; e >= 0; --e) if (!n.resolveDisabled(t2[e], e, t2)) return e;
      return r2;
    }
    case 4: {
      for (let e = 0; e < t2.length; ++e) if (n.resolveId(t2[e], e, t2) === l2.id) return e;
      return r2;
    }
    case 5:
      return null;
    default:
      u(l2);
  }
}
let a = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
function o(e) {
  var r2, i2;
  let n = (r2 = e.innerText) != null ? r2 : "", t2 = e.cloneNode(true);
  if (!(t2 instanceof HTMLElement)) return n;
  let u2 = false;
  for (let f2 of t2.querySelectorAll('[hidden],[aria-hidden],[role="img"]')) f2.remove(), u2 = true;
  let l2 = u2 ? (i2 = t2.innerText) != null ? i2 : "" : n;
  return a.test(l2) && (l2 = l2.replace(a, "")), l2;
}
function g(e) {
  let n = e.getAttribute("aria-label");
  if (typeof n == "string") return n.trim();
  let t2 = e.getAttribute("aria-labelledby");
  if (t2) {
    let u2 = t2.split(" ").map((l2) => {
      let r2 = (void 0).getElementById(l2);
      if (r2) {
        let i2 = r2.getAttribute("aria-label");
        return typeof i2 == "string" ? i2.trim() : o(r2).trim();
      }
      return null;
    }).filter(Boolean);
    if (u2.length > 0) return u2.join(", ");
  }
  return o(e).trim();
}
function p(a2) {
  let t2 = ref(""), r2 = ref("");
  return () => {
    let e = o$1(a2);
    if (!e) return "";
    let l2 = e.innerText;
    if (t2.value === l2) return r2.value;
    let u2 = g(e).trim().toLowerCase();
    return t2.value = l2, r2.value = u2, u2;
  };
}
var Z = ((i2) => (i2[i2.Open = 0] = "Open", i2[i2.Closed = 1] = "Closed", i2))(Z || {}), ee = ((i2) => (i2[i2.Pointer = 0] = "Pointer", i2[i2.Other = 1] = "Other", i2))(ee || {});
function te(o2) {
  requestAnimationFrame(() => requestAnimationFrame(o2));
}
let A = Symbol("MenuContext");
function O(o2) {
  let M = inject(A, null);
  if (M === null) {
    let i2 = new Error(`<${o2} /> is missing a parent <Menu /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(i2, O), i2;
  }
  return M;
}
let ge = defineComponent({ name: "Menu", props: { as: { type: [Object, String], default: "template" } }, setup(o2, { slots: M, attrs: i2 }) {
  let I = ref(1), p2 = ref(null), e = ref(null), r2 = ref([]), f$1 = ref(""), d = ref(null), g2 = ref(1);
  function b(t2 = (a2) => a2) {
    let a2 = d.value !== null ? r2.value[d.value] : null, n = O$1(t2(r2.value.slice()), (v2) => o$1(v2.dataRef.domRef)), s2 = a2 ? n.indexOf(a2) : null;
    return s2 === -1 && (s2 = null), { items: n, activeItemIndex: s2 };
  }
  let l2 = { menuState: I, buttonRef: p2, itemsRef: e, items: r2, searchQuery: f$1, activeItemIndex: d, activationTrigger: g2, closeMenu: () => {
    I.value = 1, d.value = null;
  }, openMenu: () => I.value = 0, goToItem(t2, a2, n) {
    let s2 = b(), v2 = f(t2 === c.Specific ? { focus: c.Specific, id: a2 } : { focus: t2 }, { resolveItems: () => s2.items, resolveActiveIndex: () => s2.activeItemIndex, resolveId: (u2) => u2.id, resolveDisabled: (u2) => u2.dataRef.disabled });
    f$1.value = "", d.value = v2, g2.value = n != null ? n : 1, r2.value = s2.items;
  }, search(t2) {
    let n = f$1.value !== "" ? 0 : 1;
    f$1.value += t2.toLowerCase();
    let v2 = (d.value !== null ? r2.value.slice(d.value + n).concat(r2.value.slice(0, d.value + n)) : r2.value).find((h2) => h2.dataRef.textValue.startsWith(f$1.value) && !h2.dataRef.disabled), u2 = v2 ? r2.value.indexOf(v2) : -1;
    u2 === -1 || u2 === d.value || (d.value = u2, g2.value = 1);
  }, clearSearch() {
    f$1.value = "";
  }, registerItem(t2, a2) {
    let n = b((s2) => [...s2, { id: t2, dataRef: a2 }]);
    r2.value = n.items, d.value = n.activeItemIndex, g2.value = 1;
  }, unregisterItem(t2) {
    let a2 = b((n) => {
      let s2 = n.findIndex((v2) => v2.id === t2);
      return s2 !== -1 && n.splice(s2, 1), n;
    });
    r2.value = a2.items, d.value = a2.activeItemIndex, g2.value = 1;
  } };
  return w$1([p2, e], (t2, a2) => {
    var n;
    l2.closeMenu(), w$3(a2, h.Loose) || (t2.preventDefault(), (n = o$1(p2)) == null || n.focus());
  }, computed(() => I.value === 0)), provide(A, l2), t$2(computed(() => u$2(I.value, { [0]: i$1.Open, [1]: i$1.Closed }))), () => {
    let t2 = { open: I.value === 0, close: l2.closeMenu };
    return A$1({ ourProps: {}, theirProps: o2, slot: t2, slots: M, attrs: i2, name: "Menu" });
  };
} }), Se = defineComponent({ name: "MenuButton", props: { disabled: { type: Boolean, default: false }, as: { type: [Object, String], default: "button" }, id: { type: String, default: null } }, setup(o2, { attrs: M, slots: i2, expose: I }) {
  var b;
  let p2 = (b = o2.id) != null ? b : `headlessui-menu-button-${i$2()}`, e = O("MenuButton");
  I({ el: e.buttonRef, $el: e.buttonRef });
  function r2(l2) {
    switch (l2.key) {
      case o$2.Space:
      case o$2.Enter:
      case o$2.ArrowDown:
        l2.preventDefault(), l2.stopPropagation(), e.openMenu(), nextTick(() => {
          var t2;
          (t2 = o$1(e.itemsRef)) == null || t2.focus({ preventScroll: true }), e.goToItem(c.First);
        });
        break;
      case o$2.ArrowUp:
        l2.preventDefault(), l2.stopPropagation(), e.openMenu(), nextTick(() => {
          var t2;
          (t2 = o$1(e.itemsRef)) == null || t2.focus({ preventScroll: true }), e.goToItem(c.Last);
        });
        break;
    }
  }
  function f2(l2) {
    switch (l2.key) {
      case o$2.Space:
        l2.preventDefault();
        break;
    }
  }
  function d(l2) {
    o2.disabled || (e.menuState.value === 0 ? (e.closeMenu(), nextTick(() => {
      var t2;
      return (t2 = o$1(e.buttonRef)) == null ? void 0 : t2.focus({ preventScroll: true });
    })) : (l2.preventDefault(), e.openMenu(), te(() => {
      var t2;
      return (t2 = o$1(e.itemsRef)) == null ? void 0 : t2.focus({ preventScroll: true });
    })));
  }
  let g2 = s(computed(() => ({ as: o2.as, type: M.type })), e.buttonRef);
  return () => {
    var n;
    let l2 = { open: e.menuState.value === 0 }, { ...t2 } = o2, a2 = { ref: e.buttonRef, id: p2, type: g2.value, "aria-haspopup": "menu", "aria-controls": (n = o$1(e.itemsRef)) == null ? void 0 : n.id, "aria-expanded": e.menuState.value === 0, onKeydown: r2, onKeyup: f2, onClick: d };
    return A$1({ ourProps: a2, theirProps: t2, slot: l2, attrs: M, slots: i2, name: "MenuButton" });
  };
} }), Me = defineComponent({ name: "MenuItems", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, id: { type: String, default: null } }, setup(o2, { attrs: M, slots: i$12, expose: I }) {
  var l$1;
  let p2 = (l$1 = o2.id) != null ? l$1 : `headlessui-menu-items-${i$2()}`, e = O("MenuItems"), r2 = ref(null);
  I({ el: e.itemsRef, $el: e.itemsRef }), i({ container: computed(() => o$1(e.itemsRef)), enabled: computed(() => e.menuState.value === 0), accept(t2) {
    return t2.getAttribute("role") === "menuitem" ? NodeFilter.FILTER_REJECT : t2.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(t2) {
    t2.setAttribute("role", "none");
  } });
  function f2(t2) {
    var a2;
    switch (r2.value && clearTimeout(r2.value), t2.key) {
      case o$2.Space:
        if (e.searchQuery.value !== "") return t2.preventDefault(), t2.stopPropagation(), e.search(t2.key);
      case o$2.Enter:
        if (t2.preventDefault(), t2.stopPropagation(), e.activeItemIndex.value !== null) {
          let s2 = e.items.value[e.activeItemIndex.value];
          (a2 = o$1(s2.dataRef.domRef)) == null || a2.click();
        }
        e.closeMenu(), _(o$1(e.buttonRef));
        break;
      case o$2.ArrowDown:
        return t2.preventDefault(), t2.stopPropagation(), e.goToItem(c.Next);
      case o$2.ArrowUp:
        return t2.preventDefault(), t2.stopPropagation(), e.goToItem(c.Previous);
      case o$2.Home:
      case o$2.PageUp:
        return t2.preventDefault(), t2.stopPropagation(), e.goToItem(c.First);
      case o$2.End:
      case o$2.PageDown:
        return t2.preventDefault(), t2.stopPropagation(), e.goToItem(c.Last);
      case o$2.Escape:
        t2.preventDefault(), t2.stopPropagation(), e.closeMenu(), nextTick(() => {
          var n;
          return (n = o$1(e.buttonRef)) == null ? void 0 : n.focus({ preventScroll: true });
        });
        break;
      case o$2.Tab:
        t2.preventDefault(), t2.stopPropagation(), e.closeMenu(), nextTick(() => v(o$1(e.buttonRef), t2.shiftKey ? N$3.Previous : N$3.Next));
        break;
      default:
        t2.key.length === 1 && (e.search(t2.key), r2.value = setTimeout(() => e.clearSearch(), 350));
        break;
    }
  }
  function d(t2) {
    switch (t2.key) {
      case o$2.Space:
        t2.preventDefault();
        break;
    }
  }
  let g2 = l$2(), b = computed(() => g2 !== null ? (g2.value & i$1.Open) === i$1.Open : e.menuState.value === 0);
  return () => {
    var s2, v2;
    let t2 = { open: e.menuState.value === 0 }, { ...a2 } = o2, n = { "aria-activedescendant": e.activeItemIndex.value === null || (s2 = e.items.value[e.activeItemIndex.value]) == null ? void 0 : s2.id, "aria-labelledby": (v2 = o$1(e.buttonRef)) == null ? void 0 : v2.id, id: p2, onKeydown: f2, onKeyup: d, role: "menu", tabIndex: 0, ref: e.itemsRef };
    return A$1({ ourProps: n, theirProps: a2, slot: t2, attrs: M, slots: i$12, features: N.RenderStrategy | N.Static, visible: b.value, name: "MenuItems" });
  };
} }), be = defineComponent({ name: "MenuItem", inheritAttrs: false, props: { as: { type: [Object, String], default: "template" }, disabled: { type: Boolean, default: false }, id: { type: String, default: null } }, setup(o2, { slots: M, attrs: i2, expose: I }) {
  var v2;
  let p$1 = (v2 = o2.id) != null ? v2 : `headlessui-menu-item-${i$2()}`, e = O("MenuItem"), r2 = ref(null);
  I({ el: r2, $el: r2 });
  let f2 = computed(() => e.activeItemIndex.value !== null ? e.items.value[e.activeItemIndex.value].id === p$1 : false), d = p(r2), g2 = computed(() => ({ disabled: o2.disabled, get textValue() {
    return d();
  }, domRef: r2 }));
  onMounted(() => e.registerItem(p$1, g2)), onUnmounted(() => e.unregisterItem(p$1)), watchEffect(() => {
    e.menuState.value === 0 && f2.value && e.activationTrigger.value !== 0 && nextTick(() => {
      var u2, h2;
      return (h2 = (u2 = o$1(r2)) == null ? void 0 : u2.scrollIntoView) == null ? void 0 : h2.call(u2, { block: "nearest" });
    });
  });
  function b(u2) {
    if (o2.disabled) return u2.preventDefault();
    e.closeMenu(), _(o$1(e.buttonRef));
  }
  function l2() {
    if (o2.disabled) return e.goToItem(c.Nothing);
    e.goToItem(c.Specific, p$1);
  }
  let t2 = u$1();
  function a2(u2) {
    t2.update(u2);
  }
  function n(u2) {
    t2.wasMoved(u2) && (o2.disabled || f2.value || e.goToItem(c.Specific, p$1, 0));
  }
  function s2(u2) {
    t2.wasMoved(u2) && (o2.disabled || f2.value && e.goToItem(c.Nothing));
  }
  return () => {
    let { disabled: u2, ...h2 } = o2, C = { active: f2.value, disabled: u2, close: e.closeMenu };
    return A$1({ ourProps: { id: p$1, ref: r2, role: "menuitem", tabIndex: u2 === true ? void 0 : -1, "aria-disabled": u2 === true ? true : void 0, onClick: b, onFocus: l2, onPointerenter: a2, onMouseenter: a2, onPointermove: n, onMousemove: n, onPointerleave: s2, onMouseleave: s2 }, theirProps: { ...i2, ...h2 }, slot: C, attrs: i2, slots: M, name: "MenuItem" });
  };
} });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, signOut } = useAuth();
    const sidebarOpen = ref(false);
    const showIntegrationCode = ref(false);
    const isLoading = ref(false);
    const notification = ref({
      message: "",
      type: "info",
      // 'success' | 'error' | 'info'
      visible: false
    });
    const navigation = [
      { name: "Aper\xE7u", href: "/", icon: HomeIcon },
      { name: "Conversations", href: "/conversations", icon: ChatBubbleLeftRightIcon, badge: "3", badgeColor: "bg-blue-100 text-blue-800" },
      { name: "Commandes", href: "/orders", icon: ShoppingBagIcon, badge: "5", badgeColor: "bg-green-100 text-green-800" },
      { name: "Base de connaissance", href: "/knowledge", icon: BookOpenIcon },
      { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
      { name: "Configuration", href: "/settings", icon: Cog6ToothIcon }
    ];
    const route = useRoute();
    const pageTitle = computed(() => {
      const currentPage = navigation.find((item) => item.href === route.path);
      return (currentPage == null ? void 0 : currentPage.name) || "Dashboard";
    });
    const pageDescription = computed(() => {
      const descriptions = {
        "/": "Suivez les performances de votre Agent IA Commercial",
        "/conversations": "G\xE9rez et supervisez toutes les conversations clients",
        "/orders": "Suivez et traitez les commandes collect\xE9es par votre agent",
        "/knowledge": "G\xE9rez le contenu qui alimente votre Agent IA",
        "/analytics": "Analysez en d\xE9tail les performances de votre agent",
        "/settings": "Configurez votre Agent IA et personnalisez le widget"
      };
      return descriptions[route.path] || "";
    });
    const isActiveRoute = (href) => {
      if (href === "/") {
        return route.path === "/";
      }
      return route.path.startsWith(href);
    };
    const stats = ref({
      conversationsToday: 12
    });
    const notifications = ref({
      unread: 3
    });
    const userInitials = computed(() => {
      var _a;
      if (!((_a = user.value) == null ? void 0 : _a.user_metadata)) return "U";
      const firstName = user.value.user_metadata.firstName || "";
      const lastName = user.value.user_metadata.lastName || "";
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    });
    const handleSignOut = async () => {
      isLoading.value = true;
      try {
        await signOut();
      } catch (error) {
        showNotification("Erreur lors de la d\xE9connexion", "error");
      } finally {
        isLoading.value = false;
      }
    };
    const showNotification = (message, type = "info") => {
      notification.value = {
        message,
        type,
        visible: true
      };
      setTimeout(() => {
        clearNotification();
      }, 5e3);
    };
    const clearNotification = () => {
      notification.value = {
        message: "",
        type: "info",
        visible: false
      };
    };
    const getNotificationIcon = (type) => {
      const icons = {
        success: CheckCircleIcon,
        error: ExclamationCircleIcon,
        info: InformationCircleIcon
      };
      return icons[type] || InformationCircleIcon;
    };
    watch(() => route.path, () => {
      sidebarOpen.value = false;
    });
    provide("isLoading", isLoading);
    provide("showNotification", showNotification);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_IntegrationModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen flex bg-gray-50" }, _attrs))}><aside class="${ssrRenderClass([
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out",
        sidebarOpen.value ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      ])}"><div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"${_scopeId}><span class="text-white font-bold text-sm"${_scopeId}>CS</span></div><span class="ml-3 text-lg font-bold text-gray-900"${_scopeId}>ChatSeller</span>`);
          } else {
            return [
              createVNode("div", { class: "flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center" }, [
                createVNode("span", { class: "text-white font-bold text-sm" }, "CS")
              ]),
              createVNode("span", { class: "ml-3 text-lg font-bold text-gray-900" }, "ChatSeller")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">`);
      _push(ssrRenderComponent(unref(XMarkIcon), { class: "h-5 w-5" }, null, _parent));
      _push(`</button></div><nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto"><!--[-->`);
      ssrRenderList(navigation, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.name,
          to: item.href,
          class: [
            isActiveRoute(item.href) ? "bg-blue-50 border-blue-500 text-blue-700 border-r-2" : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "group flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-l-md"
          ],
          onClick: ($event) => sidebarOpen.value = false
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                class: [
                  isActiveRoute(item.href) ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                  "mr-3 h-5 w-5 flex-shrink-0"
                ]
              }, null), _parent2, _scopeId);
              _push2(` ${ssrInterpolate(item.name)} `);
              if (item.badge) {
                _push2(`<span class="${ssrRenderClass([item.badgeColor || "bg-blue-100 text-blue-800", "ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full"])}"${_scopeId}>${ssrInterpolate(item.badge)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                  class: [
                    isActiveRoute(item.href) ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 h-5 w-5 flex-shrink-0"
                  ]
                }, null, 8, ["class"])),
                createTextVNode(" " + toDisplayString(item.name) + " ", 1),
                item.badge ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: ["ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full", item.badgeColor || "bg-blue-100 text-blue-800"]
                }, toDisplayString(item.badge), 3)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--><div class="pt-6 mt-6 border-t border-gray-200"><h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"> Int\xE9gration </h3><div class="space-y-2"><button class="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-l-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(CodeBracketIcon), { class: "mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" }, null, _parent));
      _push(` Code d&#39;int\xE9gration </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/widget-preview",
        class: "group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-l-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(EyeIcon), { class: "mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" }, null, _parent2, _scopeId));
            _push2(` Aper\xE7u du widget `);
          } else {
            return [
              createVNode(unref(EyeIcon), { class: "mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" }),
              createTextVNode(" Aper\xE7u du widget ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></nav><div class="flex-shrink-0 border-t border-gray-200 p-4"><div class="flex items-center text-sm"><div class="flex items-center"><div class="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div><span class="text-green-600 font-medium">Widget actif</span></div><span class="mx-2 text-gray-300">\u2022</span><span class="text-gray-500">${ssrInterpolate(stats.value.conversationsToday)} conversations</span></div></div><div class="flex-shrink-0 border-t border-gray-200 p-4">`);
      _push(ssrRenderComponent(unref(ge), {
        as: "div",
        class: "relative"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Se), { class: "flex items-center w-full text-left group" }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
                if (_push3) {
                  _push3(`<div class="flex-shrink-0"${_scopeId2}><div class="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center"${_scopeId2}><span class="text-white font-medium text-sm"${_scopeId2}>${ssrInterpolate(userInitials.value)}</span></div></div><div class="ml-3 flex-1 min-w-0"${_scopeId2}><p class="text-sm font-medium text-gray-900 truncate"${_scopeId2}>${ssrInterpolate((_b = (_a2 = unref(user)) == null ? void 0 : _a2.user_metadata) == null ? void 0 : _b.firstName)} ${ssrInterpolate((_d = (_c = unref(user)) == null ? void 0 : _c.user_metadata) == null ? void 0 : _d.lastName)}</p><p class="text-xs text-gray-500 truncate"${_scopeId2}>${ssrInterpolate((_e = unref(user)) == null ? void 0 : _e.email)}</p></div>`);
                  _push3(ssrRenderComponent(unref(ChevronUpDownIcon), { class: "h-4 w-4 text-gray-400 group-hover:text-gray-500" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "flex-shrink-0" }, [
                      createVNode("div", { class: "h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center" }, [
                        createVNode("span", { class: "text-white font-medium text-sm" }, toDisplayString(userInitials.value), 1)
                      ])
                    ]),
                    createVNode("div", { class: "ml-3 flex-1 min-w-0" }, [
                      createVNode("p", { class: "text-sm font-medium text-gray-900 truncate" }, toDisplayString((_g = (_f = unref(user)) == null ? void 0 : _f.user_metadata) == null ? void 0 : _g.firstName) + " " + toDisplayString((_i = (_h = unref(user)) == null ? void 0 : _h.user_metadata) == null ? void 0 : _i.lastName), 1),
                      createVNode("p", { class: "text-xs text-gray-500 truncate" }, toDisplayString((_j = unref(user)) == null ? void 0 : _j.email), 1)
                    ]),
                    createVNode(unref(ChevronUpDownIcon), { class: "h-4 w-4 text-gray-400 group-hover:text-gray-500" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(``);
            _push2(ssrRenderComponent(unref(Me), { class: "origin-bottom-left absolute bottom-full left-0 mb-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="py-1"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(be), null, {
                    default: withCtx(({ active }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, {
                          to: "/profile",
                          class: [active ? "bg-gray-100" : "", "flex items-center px-4 py-2 text-sm text-gray-700"]
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(UserIcon), { class: "h-4 w-4 mr-3" }, null, _parent5, _scopeId4));
                              _push5(` Mon profil `);
                            } else {
                              return [
                                createVNode(unref(UserIcon), { class: "h-4 w-4 mr-3" }),
                                createTextVNode(" Mon profil ")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, {
                            to: "/profile",
                            class: [active ? "bg-gray-100" : "", "flex items-center px-4 py-2 text-sm text-gray-700"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(UserIcon), { class: "h-4 w-4 mr-3" }),
                              createTextVNode(" Mon profil ")
                            ]),
                            _: 2
                          }, 1032, ["class"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(be), null, {
                    default: withCtx(({ active }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, {
                          to: "/settings",
                          class: [active ? "bg-gray-100" : "", "flex items-center px-4 py-2 text-sm text-gray-700"]
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Cog6ToothIcon), { class: "h-4 w-4 mr-3" }, null, _parent5, _scopeId4));
                              _push5(` Param\xE8tres `);
                            } else {
                              return [
                                createVNode(unref(Cog6ToothIcon), { class: "h-4 w-4 mr-3" }),
                                createTextVNode(" Param\xE8tres ")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, {
                            to: "/settings",
                            class: [active ? "bg-gray-100" : "", "flex items-center px-4 py-2 text-sm text-gray-700"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Cog6ToothIcon), { class: "h-4 w-4 mr-3" }),
                              createTextVNode(" Param\xE8tres ")
                            ]),
                            _: 2
                          }, 1032, ["class"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="border-t border-gray-100"${_scopeId2}></div>`);
                  _push3(ssrRenderComponent(unref(be), null, {
                    default: withCtx(({ active }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<button class="${ssrRenderClass([active ? "bg-gray-100" : "", "flex items-center w-full text-left px-4 py-2 text-sm text-gray-700"])}"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(ArrowRightOnRectangleIcon), { class: "h-4 w-4 mr-3" }, null, _parent4, _scopeId3));
                        _push4(` Se d\xE9connecter </button>`);
                      } else {
                        return [
                          createVNode("button", {
                            onClick: handleSignOut,
                            class: [active ? "bg-gray-100" : "", "flex items-center w-full text-left px-4 py-2 text-sm text-gray-700"]
                          }, [
                            createVNode(unref(ArrowRightOnRectangleIcon), { class: "h-4 w-4 mr-3" }),
                            createTextVNode(" Se d\xE9connecter ")
                          ], 2)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "py-1" }, [
                      createVNode(unref(be), null, {
                        default: withCtx(({ active }) => [
                          createVNode(_component_NuxtLink, {
                            to: "/profile",
                            class: [active ? "bg-gray-100" : "", "flex items-center px-4 py-2 text-sm text-gray-700"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(UserIcon), { class: "h-4 w-4 mr-3" }),
                              createTextVNode(" Mon profil ")
                            ]),
                            _: 2
                          }, 1032, ["class"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(be), null, {
                        default: withCtx(({ active }) => [
                          createVNode(_component_NuxtLink, {
                            to: "/settings",
                            class: [active ? "bg-gray-100" : "", "flex items-center px-4 py-2 text-sm text-gray-700"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Cog6ToothIcon), { class: "h-4 w-4 mr-3" }),
                              createTextVNode(" Param\xE8tres ")
                            ]),
                            _: 2
                          }, 1032, ["class"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "border-t border-gray-100" }),
                      createVNode(unref(be), null, {
                        default: withCtx(({ active }) => [
                          createVNode("button", {
                            onClick: handleSignOut,
                            class: [active ? "bg-gray-100" : "", "flex items-center w-full text-left px-4 py-2 text-sm text-gray-700"]
                          }, [
                            createVNode(unref(ArrowRightOnRectangleIcon), { class: "h-4 w-4 mr-3" }),
                            createTextVNode(" Se d\xE9connecter ")
                          ], 2)
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Se), { class: "flex items-center w-full text-left group" }, {
                default: withCtx(() => {
                  var _a2, _b, _c, _d, _e;
                  return [
                    createVNode("div", { class: "flex-shrink-0" }, [
                      createVNode("div", { class: "h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center" }, [
                        createVNode("span", { class: "text-white font-medium text-sm" }, toDisplayString(userInitials.value), 1)
                      ])
                    ]),
                    createVNode("div", { class: "ml-3 flex-1 min-w-0" }, [
                      createVNode("p", { class: "text-sm font-medium text-gray-900 truncate" }, toDisplayString((_b = (_a2 = unref(user)) == null ? void 0 : _a2.user_metadata) == null ? void 0 : _b.firstName) + " " + toDisplayString((_d = (_c = unref(user)) == null ? void 0 : _c.user_metadata) == null ? void 0 : _d.lastName), 1),
                      createVNode("p", { class: "text-xs text-gray-500 truncate" }, toDisplayString((_e = unref(user)) == null ? void 0 : _e.email), 1)
                    ]),
                    createVNode(unref(ChevronUpDownIcon), { class: "h-4 w-4 text-gray-400 group-hover:text-gray-500" })
                  ];
                }),
                _: 1
              }),
              createVNode(Transition, {
                "enter-active-class": "transition ease-out duration-100",
                "enter-from-class": "transform opacity-0 scale-95",
                "enter-to-class": "transform opacity-100 scale-100",
                "leave-active-class": "transition ease-in duration-75",
                "leave-from-class": "transform opacity-100 scale-100",
                "leave-to-class": "transform opacity-0 scale-95"
              }, {
                default: withCtx(() => [
                  createVNode(unref(Me), { class: "origin-bottom-left absolute bottom-full left-0 mb-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "py-1" }, [
                        createVNode(unref(be), null, {
                          default: withCtx(({ active }) => [
                            createVNode(_component_NuxtLink, {
                              to: "/profile",
                              class: [active ? "bg-gray-100" : "", "flex items-center px-4 py-2 text-sm text-gray-700"]
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(UserIcon), { class: "h-4 w-4 mr-3" }),
                                createTextVNode(" Mon profil ")
                              ]),
                              _: 2
                            }, 1032, ["class"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(be), null, {
                          default: withCtx(({ active }) => [
                            createVNode(_component_NuxtLink, {
                              to: "/settings",
                              class: [active ? "bg-gray-100" : "", "flex items-center px-4 py-2 text-sm text-gray-700"]
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Cog6ToothIcon), { class: "h-4 w-4 mr-3" }),
                                createTextVNode(" Param\xE8tres ")
                              ]),
                              _: 2
                            }, 1032, ["class"])
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "border-t border-gray-100" }),
                        createVNode(unref(be), null, {
                          default: withCtx(({ active }) => [
                            createVNode("button", {
                              onClick: handleSignOut,
                              class: [active ? "bg-gray-100" : "", "flex items-center w-full text-left px-4 py-2 text-sm text-gray-700"]
                            }, [
                              createVNode(unref(ArrowRightOnRectangleIcon), { class: "h-4 w-4 mr-3" }),
                              createTextVNode(" Se d\xE9connecter ")
                            ], 2)
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></aside>`);
      if (sidebarOpen.value) {
        _push(`<div class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="flex-1 lg:ml-64 flex flex-col min-h-0"><div class="lg:hidden bg-white border-b border-gray-200 px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center"><button class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">`);
      _push(ssrRenderComponent(unref(Bars3Icon), { class: "h-6 w-6" }, null, _parent));
      _push(`</button><h1 class="ml-3 text-lg font-semibold text-gray-900">${ssrInterpolate(pageTitle.value)}</h1></div><div class="flex items-center space-x-2"><button class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">`);
      _push(ssrRenderComponent(unref(BellIcon), { class: "h-6 w-6" }, null, _parent));
      if (notifications.value.unread > 0) {
        _push(`<span class="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">${ssrInterpolate(notifications.value.unread)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div></div></div><div class="hidden lg:block bg-white border-b border-gray-200 px-6 py-4"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900">${ssrInterpolate(pageTitle.value)}</h1><p class="mt-1 text-sm text-gray-500">${ssrInterpolate(pageDescription.value)}</p></div><div class="flex items-center space-x-4"><div class="relative">`);
      _push(ssrRenderComponent(unref(MagnifyingGlassIcon), { class: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }, null, _parent));
      _push(`<input type="text" placeholder="Rechercher..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-64"></div><button class="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">`);
      _push(ssrRenderComponent(unref(BellIcon), { class: "h-6 w-6" }, null, _parent));
      if (notifications.value.unread > 0) {
        _push(`<span class="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">${ssrInterpolate(notifications.value.unread)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(CodeBracketIcon), { class: "mr-2 h-4 w-4" }, null, _parent));
      _push(` Int\xE9grer le widget </button></div></div></div><div class="flex-1 overflow-y-auto p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main>`);
      _push(ssrRenderComponent(_component_IntegrationModal, {
        show: showIntegrationCode.value,
        onClose: ($event) => showIntegrationCode.value = false,
        "user-id": (_a = unref(user)) == null ? void 0 : _a.id
      }, null, _parent));
      if (notification.value.message) {
        _push(`<div class="fixed top-4 right-4 z-50 max-w-sm"><div class="${ssrRenderClass([
          "p-4 rounded-lg shadow-lg border",
          notification.value.type === "success" ? "bg-green-50 border-green-200 text-green-800" : notification.value.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-blue-50 border-blue-200 text-blue-800"
        ])}"><div class="flex items-center">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getNotificationIcon(notification.value.type)), { class: "h-5 w-5 mr-3" }, null), _parent);
        _push(`<p class="text-sm font-medium">${ssrInterpolate(notification.value.message)}</p><button class="ml-auto text-gray-400 hover:text-gray-600">`);
        _push(ssrRenderComponent(unref(XMarkIcon), { class: "h-4 w-4" }, null, _parent));
        _push(`</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isLoading.value) {
        _push(`<div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-xl"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div><span class="text-gray-900 font-medium">Chargement...</span></div></div>`);
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

export { _sfc_main as default };
//# sourceMappingURL=default-CQivic0l.mjs.map
