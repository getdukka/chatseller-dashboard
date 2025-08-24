import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createBlock, createTextVNode, openBlock, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-KgQDcdck.mjs';
import { u as useHead } from './server.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const refreshing = ref(false);
    const showWelcome = ref(true);
    const stats = ref({
      conversations: {
        total: 1247,
        active: 23
      },
      orders: {
        total: 89,
        conversionRate: 34.2
      },
      revenue: {
        total: 45670.5,
        average: 512.3
      },
      performance: {
        responseTime: "< 2s",
        uptime: 99.9
      }
    });
    const recentConversations = ref([
      {
        id: 1,
        visitor: "Marie Dubois",
        lastMessage: "Merci pour ces informations sur les d\xE9lais",
        time: new Date(Date.now() - 5 * 60 * 1e3),
        unread: true
      },
      {
        id: 2,
        visitor: "Pierre Martin",
        lastMessage: "Je voudrais passer commande pour 2 unit\xE9s",
        time: new Date(Date.now() - 12 * 60 * 1e3),
        unread: false
      },
      {
        id: 3,
        visitor: "Sophie Laurent",
        lastMessage: "Parfait, merci beaucoup !",
        time: new Date(Date.now() - 45 * 60 * 1e3),
        unread: false
      }
    ]);
    const recentOrders = ref([
      {
        id: "ord_1234567890abcdef",
        customer: "Pierre Martin",
        amount: 129.99,
        time: new Date(Date.now() - 12 * 60 * 1e3)
      },
      {
        id: "ord_0987654321fedcba",
        customer: "Sophie Laurent",
        amount: 89.5,
        time: new Date(Date.now() - 45 * 60 * 1e3)
      },
      {
        id: "ord_abcdef1234567890",
        customer: "Marie Dubois",
        amount: 199.99,
        time: new Date(Date.now() - 2 * 60 * 60 * 1e3)
      }
    ]);
    const knowledgeBaseStatus = ref("Vide");
    const agentConfigStatus = ref("\xC0 configurer");
    const configurationProgress = computed(() => {
      let progress = 0;
      if (knowledgeBaseStatus.value !== "Vide") progress += 50;
      if (agentConfigStatus.value !== "\xC0 configurer") progress += 50;
      return progress;
    });
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
      }).format(amount);
    };
    const formatTime = (date) => {
      const now = /* @__PURE__ */ new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1e3 * 60));
      if (diffInMinutes < 1) return "\xC0 l'instant";
      if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
      if (diffInMinutes < 24 * 60) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
      return date.toLocaleDateString("fr-FR");
    };
    useHead({
      title: "Dashboard - ChatSeller"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-504ca03f>`);
      if (showWelcome.value) {
        _push(`<div class="m-8 mb-6" data-v-504ca03f><div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden" data-v-504ca03f><div class="px-8 py-6 text-white relative" data-v-504ca03f><div class="flex items-center justify-between" data-v-504ca03f><div data-v-504ca03f><h2 class="text-2xl font-bold mb-2" data-v-504ca03f>\u{1F389} Bienvenue sur ChatSeller !</h2><p class="text-blue-100 text-lg" data-v-504ca03f> Votre Vendeur IA est pr\xEAt \xE0 transformer vos visiteurs en clients. </p><div class="mt-4 flex flex-wrap gap-3" data-v-504ca03f>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/knowledge-base",
          class: "inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-504ca03f${_scopeId}></path></svg> Nourrir votre IA `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  })
                ])),
                createTextVNode(" Nourrir votre IA ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/settings",
          class: "inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-v-504ca03f${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-504ca03f${_scopeId}></path></svg> Configurer `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  }),
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  })
                ])),
                createTextVNode(" Configurer ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><button class="text-white text-opacity-80 hover:text-opacity-100 transition-colors" data-v-504ca03f><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-504ca03f></path></svg></button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="px-8 py-6" data-v-504ca03f><div class="flex items-center justify-between" data-v-504ca03f><div data-v-504ca03f><h1 class="text-3xl font-bold text-gray-900" data-v-504ca03f>Dashboard</h1><p class="mt-2 text-gray-600" data-v-504ca03f> Pilotez votre Vendeur IA et suivez vos performances </p></div><div class="flex items-center space-x-4" data-v-504ca03f><button${ssrIncludeBooleanAttr(refreshing.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors" data-v-504ca03f><svg class="${ssrRenderClass([{ "animate-spin": refreshing.value }, "w-4 h-4 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-504ca03f></path></svg> ${ssrInterpolate(refreshing.value ? "Actualisation..." : "Actualiser")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/settings",
        class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-v-504ca03f${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-504ca03f${_scopeId}></path></svg> Configurer `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4 mr-2",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                }),
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                })
              ])),
              createTextVNode(" Configurer ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="px-8 pb-8" data-v-504ca03f><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-v-504ca03f><div class="card-modern-gradient from-blue-500 to-blue-600" data-v-504ca03f><div class="flex items-center justify-between" data-v-504ca03f><div class="text-white" data-v-504ca03f><p class="text-blue-100 text-sm font-medium" data-v-504ca03f>Conversations</p><p class="text-3xl font-bold" data-v-504ca03f>${ssrInterpolate(stats.value.conversations.total.toLocaleString())}</p><p class="text-blue-100 text-sm mt-1" data-v-504ca03f><span class="text-white font-medium" data-v-504ca03f>${ssrInterpolate(stats.value.conversations.active)}</span> actives </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-504ca03f><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-504ca03f></path></svg></div></div><div class="mt-4" data-v-504ca03f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/conversations",
        class: "text-white text-sm font-medium hover:text-blue-100 transition-colors inline-flex items-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir tout <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-504ca03f${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" Voir tout "),
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4 ml-1",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M9 5l7 7-7 7"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="card-modern-gradient from-green-500 to-green-600" data-v-504ca03f><div class="flex items-center justify-between" data-v-504ca03f><div class="text-white" data-v-504ca03f><p class="text-green-100 text-sm font-medium" data-v-504ca03f>Commandes</p><p class="text-3xl font-bold" data-v-504ca03f>${ssrInterpolate(stats.value.orders.total.toLocaleString())}</p><p class="text-green-100 text-sm mt-1" data-v-504ca03f><span class="text-white font-medium" data-v-504ca03f>${ssrInterpolate(stats.value.orders.conversionRate)}%</span> conversion </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-504ca03f><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-504ca03f></path></svg></div></div><div class="mt-4" data-v-504ca03f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/orders",
        class: "text-white text-sm font-medium hover:text-green-100 transition-colors inline-flex items-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir tout <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-504ca03f${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" Voir tout "),
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4 ml-1",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M9 5l7 7-7 7"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="card-modern-gradient from-yellow-500 to-orange-500" data-v-504ca03f><div class="flex items-center justify-between" data-v-504ca03f><div class="text-white" data-v-504ca03f><p class="text-orange-100 text-sm font-medium" data-v-504ca03f>Chiffre d&#39;affaires</p><p class="text-3xl font-bold" data-v-504ca03f>${ssrInterpolate(formatCurrency(stats.value.revenue.total))}</p><p class="text-orange-100 text-sm mt-1" data-v-504ca03f><span class="text-white font-medium" data-v-504ca03f>${ssrInterpolate(formatCurrency(stats.value.revenue.average))}</span> panier moyen </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-504ca03f><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" data-v-504ca03f></path></svg></div></div><div class="mt-4" data-v-504ca03f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/analytics",
        class: "text-white text-sm font-medium hover:text-orange-100 transition-colors inline-flex items-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir analytics <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-504ca03f${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" Voir analytics "),
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4 ml-1",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M9 5l7 7-7 7"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="card-modern-gradient from-purple-500 to-purple-600" data-v-504ca03f><div class="flex items-center justify-between" data-v-504ca03f><div class="text-white" data-v-504ca03f><p class="text-purple-100 text-sm font-medium" data-v-504ca03f>Performance</p><p class="text-3xl font-bold" data-v-504ca03f>${ssrInterpolate(stats.value.performance.responseTime)}</p><p class="text-purple-100 text-sm mt-1" data-v-504ca03f><span class="text-white font-medium" data-v-504ca03f>${ssrInterpolate(stats.value.performance.uptime)}%</span> uptime </p></div><div class="p-3 bg-white bg-opacity-20 rounded-xl" data-v-504ca03f><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-504ca03f></path></svg></div></div><div class="mt-4" data-v-504ca03f><span class="text-purple-100 text-sm font-medium" data-v-504ca03f>Syst\xE8me optimal</span></div></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-6" data-v-504ca03f><div class="card-modern" data-v-504ca03f><div class="flex items-center justify-between mb-6" data-v-504ca03f><h3 class="text-lg font-semibold text-gray-900" data-v-504ca03f>Conversations r\xE9centes</h3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/conversations",
        class: "text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` G\xE9rer les discussions `);
          } else {
            return [
              createTextVNode(" G\xE9rer les discussions ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (recentConversations.value.length > 0) {
        _push(`<div class="space-y-4" data-v-504ca03f><!--[-->`);
        ssrRenderList(recentConversations.value, (conversation) => {
          _push(`<div class="conversation-item" data-v-504ca03f><div class="flex items-center space-x-3" data-v-504ca03f><div class="avatar-circle" data-v-504ca03f><span class="text-sm font-medium text-white" data-v-504ca03f>${ssrInterpolate(conversation.visitor.charAt(0).toUpperCase())}</span></div><div class="flex-1 min-w-0" data-v-504ca03f><p class="text-sm font-medium text-gray-900 truncate" data-v-504ca03f>${ssrInterpolate(conversation.visitor)}</p><p class="text-xs text-gray-500 truncate" data-v-504ca03f>${ssrInterpolate(conversation.lastMessage)}</p></div><div class="flex flex-col items-end" data-v-504ca03f><div class="text-xs text-gray-400" data-v-504ca03f>${ssrInterpolate(formatTime(conversation.time))}</div>`);
          if (conversation.unread) {
            _push(`<div class="w-2 h-2 bg-blue-500 rounded-full mt-1" data-v-504ca03f></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="empty-state" data-v-504ca03f><svg class="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-504ca03f></path></svg><p class="text-gray-500 text-sm mt-2" data-v-504ca03f>Aucune conversation r\xE9cente</p><p class="text-gray-400 text-xs mt-1" data-v-504ca03f>Les nouvelles conversations appara\xEEtront ici</p></div>`);
      }
      _push(`</div><div class="card-modern" data-v-504ca03f><div class="flex items-center justify-between mb-6" data-v-504ca03f><h3 class="text-lg font-semibold text-gray-900" data-v-504ca03f>Commandes r\xE9centes</h3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/orders",
        class: "text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Suivi des ventes `);
          } else {
            return [
              createTextVNode(" Suivi des ventes ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (recentOrders.value.length > 0) {
        _push(`<div class="space-y-4" data-v-504ca03f><!--[-->`);
        ssrRenderList(recentOrders.value, (order) => {
          _push(`<div class="order-item" data-v-504ca03f><div class="flex items-center justify-between" data-v-504ca03f><div class="flex items-center space-x-3" data-v-504ca03f><div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center" data-v-504ca03f><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-504ca03f></path></svg></div><div data-v-504ca03f><p class="text-sm font-medium text-gray-900" data-v-504ca03f>${ssrInterpolate(order.customer)}</p><p class="text-xs text-gray-500" data-v-504ca03f> Commande #${ssrInterpolate(order.id.slice(-6).toUpperCase())}</p></div></div><div class="text-right" data-v-504ca03f><p class="text-sm font-medium text-gray-900" data-v-504ca03f>${ssrInterpolate(formatCurrency(order.amount))}</p><p class="text-xs text-gray-500" data-v-504ca03f>${ssrInterpolate(formatTime(order.time))}</p></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="empty-state" data-v-504ca03f><svg class="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-504ca03f></path></svg><p class="text-gray-500 text-sm mt-2" data-v-504ca03f>Aucune commande r\xE9cente</p><p class="text-gray-400 text-xs mt-1" data-v-504ca03f>Les nouvelles ventes appara\xEEtront ici</p></div>`);
      }
      _push(`</div><div class="card-modern" data-v-504ca03f><div class="flex items-center justify-between mb-6" data-v-504ca03f><h3 class="text-lg font-semibold text-gray-900" data-v-504ca03f>Configuration rapide</h3><div class="progress-circle" data-v-504ca03f><span class="text-xs text-gray-600" data-v-504ca03f>${ssrInterpolate(configurationProgress.value)}%</span></div></div><div class="space-y-4" data-v-504ca03f><div class="${ssrRenderClass([{ "completed": knowledgeBaseStatus.value !== "Vide" }, "setup-item"])}" data-v-504ca03f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/knowledge-base",
        class: "flex items-center justify-between w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center space-x-3" data-v-504ca03f${_scopeId}><div class="${ssrRenderClass([knowledgeBaseStatus.value !== "Vide" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600", "setup-icon"])}" data-v-504ca03f${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-504ca03f${_scopeId}></path></svg></div><div data-v-504ca03f${_scopeId}><p class="text-sm font-medium text-gray-900" data-v-504ca03f${_scopeId}>Base de connaissance</p><p class="text-xs text-gray-500" data-v-504ca03f${_scopeId}>Alimenter votre agent IA</p></div></div><div class="flex items-center" data-v-504ca03f${_scopeId}><span class="text-xs text-gray-400" data-v-504ca03f${_scopeId}>${ssrInterpolate(knowledgeBaseStatus.value)}</span><svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-504ca03f${_scopeId}></path></svg></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center space-x-3" }, [
                createVNode("div", {
                  class: ["setup-icon", knowledgeBaseStatus.value !== "Vide" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"]
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    })
                  ]))
                ], 2),
                createVNode("div", null, [
                  createVNode("p", { class: "text-sm font-medium text-gray-900" }, "Base de connaissance"),
                  createVNode("p", { class: "text-xs text-gray-500" }, "Alimenter votre agent IA")
                ])
              ]),
              createVNode("div", { class: "flex items-center" }, [
                createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(knowledgeBaseStatus.value), 1),
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 text-gray-400 ml-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9 5l7 7-7 7"
                  })
                ]))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="${ssrRenderClass([{ "completed": agentConfigStatus.value !== "\xC0 configurer" }, "setup-item"])}" data-v-504ca03f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/settings",
        class: "flex items-center justify-between w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center space-x-3" data-v-504ca03f${_scopeId}><div class="${ssrRenderClass([agentConfigStatus.value !== "\xC0 configurer" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600", "setup-icon"])}" data-v-504ca03f${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-v-504ca03f${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-504ca03f${_scopeId}></path></svg></div><div data-v-504ca03f${_scopeId}><p class="text-sm font-medium text-gray-900" data-v-504ca03f${_scopeId}>Param\xE8tres agent</p><p class="text-xs text-gray-500" data-v-504ca03f${_scopeId}>Personnaliser le comportement</p></div></div><div class="flex items-center" data-v-504ca03f${_scopeId}><span class="text-xs text-gray-400" data-v-504ca03f${_scopeId}>${ssrInterpolate(agentConfigStatus.value)}</span><svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-504ca03f${_scopeId}></path></svg></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center space-x-3" }, [
                createVNode("div", {
                  class: ["setup-icon", agentConfigStatus.value !== "\xC0 configurer" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"]
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    }),
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    })
                  ]))
                ], 2),
                createVNode("div", null, [
                  createVNode("p", { class: "text-sm font-medium text-gray-900" }, "Param\xE8tres agent"),
                  createVNode("p", { class: "text-xs text-gray-500" }, "Personnaliser le comportement")
                ])
              ]),
              createVNode("div", { class: "flex items-center" }, [
                createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(agentConfigStatus.value), 1),
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 text-gray-400 ml-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9 5l7 7-7 7"
                  })
                ]))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="setup-item disabled" data-v-504ca03f><div class="flex items-center justify-between w-full" data-v-504ca03f><div class="flex items-center space-x-3" data-v-504ca03f><div class="setup-icon bg-gray-100 text-gray-400" data-v-504ca03f><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-504ca03f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" data-v-504ca03f></path></svg></div><div data-v-504ca03f><p class="text-sm font-medium text-gray-500" data-v-504ca03f>Widget int\xE9gration</p><p class="text-xs text-gray-400" data-v-504ca03f>Code \xE0 int\xE9grer sur votre site</p></div></div><span class="text-xs text-gray-400" data-v-504ca03f>Bient\xF4t</span></div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-504ca03f"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-BeDGalhR.mjs.map
