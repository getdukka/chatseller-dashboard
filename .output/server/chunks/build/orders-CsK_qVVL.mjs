import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, inject, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderComponent, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { ArrowPathIcon, DocumentArrowDownIcon, PlusIcon, MagnifyingGlassIcon, ShoppingBagIcon, CurrencyDollarIcon, ClockIcon, ChartBarIcon, EyeIcon, PencilIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { S as Se, Y as Ye, h as he, G as Ge, V as Ve } from './transition-DyayiTxm.mjs';
import { u as useSeoMeta } from './v3-D4nZQNuc.mjs';
import './description-DeqVqtMl.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "OrderDetailsModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    order: {}
  },
  emits: ["close", "update"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 0
      }).format(amount);
    };
    const formatDate = (dateString) => {
      if (!dateString) return "";
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: fr });
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
        confirmed: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
        processing: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800",
        shipped: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800",
        delivered: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
        cancelled: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
      };
      return classes[status] || classes.pending;
    };
    const getStatusText = (status) => {
      const texts = {
        pending: "En attente",
        confirmed: "Confirm\xE9e",
        processing: "En traitement",
        shipped: "Exp\xE9di\xE9e",
        delivered: "Livr\xE9e",
        cancelled: "Annul\xE9e"
      };
      return texts[status] || "Inconnue";
    };
    const getPaymentBadgeClass = (paymentMethod) => {
      const classes = {
        mobile_money: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800",
        cash: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
        card: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
        bank_transfer: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
      };
      return classes[paymentMethod] || classes.cash;
    };
    const getPaymentText = (paymentMethod) => {
      const texts = {
        mobile_money: "Mobile Money",
        cash: "Esp\xE8ces",
        card: "Carte",
        bank_transfer: "Virement"
      };
      return texts[paymentMethod] || "Autre";
    };
    const updateStatus = (newStatus) => {
      if (!props.order) return;
      const updatedOrder = {
        ...props.order,
        status: newStatus,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      emit("update", updatedOrder);
      emit("close");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Se), mergeProps({
        show: _ctx.isOpen,
        as: "template"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Ye), {
              onClose: ($event) => _ctx.$emit("close"),
              class: "relative z-50"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(he), {
                    as: "template",
                    enter: "ease-out duration-300",
                    "enter-from": "opacity-0",
                    "enter-to": "opacity-100",
                    leave: "ease-in duration-200",
                    "leave-from": "opacity-100",
                    "leave-to": "opacity-0"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"${_scopeId3}></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="fixed inset-0 z-10 overflow-y-auto"${_scopeId2}><div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(he), {
                    as: "template",
                    enter: "ease-out duration-300",
                    "enter-from": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                    "enter-to": "opacity-100 translate-y-0 sm:scale-100",
                    leave: "ease-in duration-200",
                    "leave-from": "opacity-100 translate-y-0 sm:scale-100",
                    "leave-to": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            var _a, _b;
                            if (_push5) {
                              _push5(`<div class="bg-white px-6 py-6"${_scopeId4}><div class="flex items-center justify-between mb-6"${_scopeId4}><div${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  var _a2, _b2;
                                  if (_push6) {
                                    _push6(` Commande ${ssrInterpolate((_a2 = _ctx.order) == null ? void 0 : _a2.orderNumber)}`);
                                  } else {
                                    return [
                                      createTextVNode(" Commande " + toDisplayString((_b2 = _ctx.order) == null ? void 0 : _b2.orderNumber), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<p class="text-sm text-gray-500 mt-1"${_scopeId4}> Cr\xE9\xE9e le ${ssrInterpolate(formatDate((_a = _ctx.order) == null ? void 0 : _a.createdAt))}</p></div><button class="rounded-md text-gray-400 hover:text-gray-500"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(XMarkIcon), { class: "h-6 w-6" }, null, _parent5, _scopeId4));
                              _push5(`</button></div>`);
                              if (_ctx.order) {
                                _push5(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8"${_scopeId4}><div class="lg:col-span-2 space-y-6"${_scopeId4}><div class="bg-gray-50 rounded-lg p-6"${_scopeId4}><h3 class="text-lg font-medium text-gray-900 mb-4"${_scopeId4}>Informations client</h3><div class="grid grid-cols-2 gap-4 text-sm"${_scopeId4}><div${_scopeId4}><span class="text-gray-500"${_scopeId4}>Nom :</span><p class="font-medium"${_scopeId4}>${ssrInterpolate(_ctx.order.customerName)}</p></div><div${_scopeId4}><span class="text-gray-500"${_scopeId4}>T\xE9l\xE9phone :</span><p class="font-medium"${_scopeId4}>${ssrInterpolate(_ctx.order.customerPhone)}</p></div><div class="col-span-2"${_scopeId4}><span class="text-gray-500"${_scopeId4}>Email :</span><p class="font-medium"${_scopeId4}>${ssrInterpolate(_ctx.order.customerEmail)}</p></div></div></div><div class="bg-gray-50 rounded-lg p-6"${_scopeId4}><h3 class="text-lg font-medium text-gray-900 mb-4"${_scopeId4}>Articles command\xE9s</h3><div class="space-y-4"${_scopeId4}><!--[-->`);
                                ssrRenderList(_ctx.order.items, (item) => {
                                  _push5(`<div class="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"${_scopeId4}><div${_scopeId4}><p class="font-medium text-gray-900"${_scopeId4}>${ssrInterpolate(item.name)}</p><p class="text-sm text-gray-500"${_scopeId4}>Quantit\xE9: ${ssrInterpolate(item.quantity)}</p></div><p class="font-medium text-gray-900"${_scopeId4}>${ssrInterpolate(formatCurrency(item.price * item.quantity))}</p></div>`);
                                });
                                _push5(`<!--]--></div><div class="border-t border-gray-200 pt-4 mt-4"${_scopeId4}><div class="flex justify-between items-center text-lg font-bold"${_scopeId4}><span${_scopeId4}>Total</span><span${_scopeId4}>${ssrInterpolate(formatCurrency(_ctx.order.totalAmount))}</span></div></div></div></div><div class="space-y-6"${_scopeId4}><div class="bg-white border border-gray-200 rounded-lg p-6"${_scopeId4}><h3 class="text-lg font-medium text-gray-900 mb-4"${_scopeId4}>Statut</h3><div class="space-y-4"${_scopeId4}><div${_scopeId4}><span class="text-sm text-gray-500"${_scopeId4}>Statut de la commande</span><p class="mt-1"${_scopeId4}><span class="${ssrRenderClass(getStatusBadgeClass(_ctx.order.status))}"${_scopeId4}>${ssrInterpolate(getStatusText(_ctx.order.status))}</span></p></div><div${_scopeId4}><span class="text-sm text-gray-500"${_scopeId4}>Mode de paiement</span><p class="mt-1"${_scopeId4}><span class="${ssrRenderClass(getPaymentBadgeClass(_ctx.order.paymentMethod))}"${_scopeId4}>${ssrInterpolate(getPaymentText(_ctx.order.paymentMethod))}</span></p></div><div${_scopeId4}><span class="text-sm text-gray-500"${_scopeId4}>Derni\xE8re mise \xE0 jour</span><p class="text-sm font-medium mt-1"${_scopeId4}>${ssrInterpolate(formatDate(_ctx.order.updatedAt))}</p></div></div></div><div class="bg-white border border-gray-200 rounded-lg p-6"${_scopeId4}><h3 class="text-lg font-medium text-gray-900 mb-4"${_scopeId4}>Actions</h3><div class="space-y-3"${_scopeId4}>`);
                                if (_ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled") {
                                  _push5(`<button class="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"${_scopeId4}> Marquer en traitement </button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (_ctx.order.status === "processing") {
                                  _push5(`<button class="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"${_scopeId4}> Marquer comme exp\xE9di\xE9e </button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (_ctx.order.status === "shipped") {
                                  _push5(`<button class="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"${_scopeId4}> Marquer comme livr\xE9e </button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (_ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled") {
                                  _push5(`<button class="w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"${_scopeId4}> Annuler la commande </button>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div></div></div></div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode("div", { class: "bg-white px-6 py-6" }, [
                                  createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                    createVNode("div", null, [
                                      createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                        default: withCtx(() => {
                                          var _a2;
                                          return [
                                            createTextVNode(" Commande " + toDisplayString((_a2 = _ctx.order) == null ? void 0 : _a2.orderNumber), 1)
                                          ];
                                        }),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "text-sm text-gray-500 mt-1" }, " Cr\xE9\xE9e le " + toDisplayString(formatDate((_b = _ctx.order) == null ? void 0 : _b.createdAt)), 1)
                                    ]),
                                    createVNode("button", {
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "rounded-md text-gray-400 hover:text-gray-500"
                                    }, [
                                      createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                    ], 8, ["onClick"])
                                  ]),
                                  _ctx.order ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "grid grid-cols-1 lg:grid-cols-3 gap-8"
                                  }, [
                                    createVNode("div", { class: "lg:col-span-2 space-y-6" }, [
                                      createVNode("div", { class: "bg-gray-50 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Informations client"),
                                        createVNode("div", { class: "grid grid-cols-2 gap-4 text-sm" }, [
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-gray-500" }, "Nom :"),
                                            createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerName), 1)
                                          ]),
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-gray-500" }, "T\xE9l\xE9phone :"),
                                            createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerPhone), 1)
                                          ]),
                                          createVNode("div", { class: "col-span-2" }, [
                                            createVNode("span", { class: "text-gray-500" }, "Email :"),
                                            createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerEmail), 1)
                                          ])
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-gray-50 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Articles command\xE9s"),
                                        createVNode("div", { class: "space-y-4" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(_ctx.order.items, (item) => {
                                            return openBlock(), createBlock("div", {
                                              key: item.name,
                                              class: "flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                                            }, [
                                              createVNode("div", null, [
                                                createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(item.name), 1),
                                                createVNode("p", { class: "text-sm text-gray-500" }, "Quantit\xE9: " + toDisplayString(item.quantity), 1)
                                              ]),
                                              createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(formatCurrency(item.price * item.quantity)), 1)
                                            ]);
                                          }), 128))
                                        ]),
                                        createVNode("div", { class: "border-t border-gray-200 pt-4 mt-4" }, [
                                          createVNode("div", { class: "flex justify-between items-center text-lg font-bold" }, [
                                            createVNode("span", null, "Total"),
                                            createVNode("span", null, toDisplayString(formatCurrency(_ctx.order.totalAmount)), 1)
                                          ])
                                        ])
                                      ])
                                    ]),
                                    createVNode("div", { class: "space-y-6" }, [
                                      createVNode("div", { class: "bg-white border border-gray-200 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Statut"),
                                        createVNode("div", { class: "space-y-4" }, [
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-sm text-gray-500" }, "Statut de la commande"),
                                            createVNode("p", { class: "mt-1" }, [
                                              createVNode("span", {
                                                class: getStatusBadgeClass(_ctx.order.status)
                                              }, toDisplayString(getStatusText(_ctx.order.status)), 3)
                                            ])
                                          ]),
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-sm text-gray-500" }, "Mode de paiement"),
                                            createVNode("p", { class: "mt-1" }, [
                                              createVNode("span", {
                                                class: getPaymentBadgeClass(_ctx.order.paymentMethod)
                                              }, toDisplayString(getPaymentText(_ctx.order.paymentMethod)), 3)
                                            ])
                                          ]),
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-sm text-gray-500" }, "Derni\xE8re mise \xE0 jour"),
                                            createVNode("p", { class: "text-sm font-medium mt-1" }, toDisplayString(formatDate(_ctx.order.updatedAt)), 1)
                                          ])
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-white border border-gray-200 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Actions"),
                                        createVNode("div", { class: "space-y-3" }, [
                                          _ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled" ? (openBlock(), createBlock("button", {
                                            key: 0,
                                            onClick: ($event) => updateStatus("processing"),
                                            class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                          }, " Marquer en traitement ", 8, ["onClick"])) : createCommentVNode("", true),
                                          _ctx.order.status === "processing" ? (openBlock(), createBlock("button", {
                                            key: 1,
                                            onClick: ($event) => updateStatus("shipped"),
                                            class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                          }, " Marquer comme exp\xE9di\xE9e ", 8, ["onClick"])) : createCommentVNode("", true),
                                          _ctx.order.status === "shipped" ? (openBlock(), createBlock("button", {
                                            key: 2,
                                            onClick: ($event) => updateStatus("delivered"),
                                            class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                          }, " Marquer comme livr\xE9e ", 8, ["onClick"])) : createCommentVNode("", true),
                                          _ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled" ? (openBlock(), createBlock("button", {
                                            key: 3,
                                            onClick: ($event) => updateStatus("cancelled"),
                                            class: "w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                                          }, " Annuler la commande ", 8, ["onClick"])) : createCommentVNode("", true)
                                        ])
                                      ])
                                    ])
                                  ])) : createCommentVNode("", true)
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl" }, {
                            default: withCtx(() => {
                              var _a;
                              return [
                                createVNode("div", { class: "bg-white px-6 py-6" }, [
                                  createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                    createVNode("div", null, [
                                      createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                        default: withCtx(() => {
                                          var _a2;
                                          return [
                                            createTextVNode(" Commande " + toDisplayString((_a2 = _ctx.order) == null ? void 0 : _a2.orderNumber), 1)
                                          ];
                                        }),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "text-sm text-gray-500 mt-1" }, " Cr\xE9\xE9e le " + toDisplayString(formatDate((_a = _ctx.order) == null ? void 0 : _a.createdAt)), 1)
                                    ]),
                                    createVNode("button", {
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "rounded-md text-gray-400 hover:text-gray-500"
                                    }, [
                                      createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                    ], 8, ["onClick"])
                                  ]),
                                  _ctx.order ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "grid grid-cols-1 lg:grid-cols-3 gap-8"
                                  }, [
                                    createVNode("div", { class: "lg:col-span-2 space-y-6" }, [
                                      createVNode("div", { class: "bg-gray-50 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Informations client"),
                                        createVNode("div", { class: "grid grid-cols-2 gap-4 text-sm" }, [
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-gray-500" }, "Nom :"),
                                            createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerName), 1)
                                          ]),
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-gray-500" }, "T\xE9l\xE9phone :"),
                                            createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerPhone), 1)
                                          ]),
                                          createVNode("div", { class: "col-span-2" }, [
                                            createVNode("span", { class: "text-gray-500" }, "Email :"),
                                            createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerEmail), 1)
                                          ])
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-gray-50 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Articles command\xE9s"),
                                        createVNode("div", { class: "space-y-4" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(_ctx.order.items, (item) => {
                                            return openBlock(), createBlock("div", {
                                              key: item.name,
                                              class: "flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                                            }, [
                                              createVNode("div", null, [
                                                createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(item.name), 1),
                                                createVNode("p", { class: "text-sm text-gray-500" }, "Quantit\xE9: " + toDisplayString(item.quantity), 1)
                                              ]),
                                              createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(formatCurrency(item.price * item.quantity)), 1)
                                            ]);
                                          }), 128))
                                        ]),
                                        createVNode("div", { class: "border-t border-gray-200 pt-4 mt-4" }, [
                                          createVNode("div", { class: "flex justify-between items-center text-lg font-bold" }, [
                                            createVNode("span", null, "Total"),
                                            createVNode("span", null, toDisplayString(formatCurrency(_ctx.order.totalAmount)), 1)
                                          ])
                                        ])
                                      ])
                                    ]),
                                    createVNode("div", { class: "space-y-6" }, [
                                      createVNode("div", { class: "bg-white border border-gray-200 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Statut"),
                                        createVNode("div", { class: "space-y-4" }, [
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-sm text-gray-500" }, "Statut de la commande"),
                                            createVNode("p", { class: "mt-1" }, [
                                              createVNode("span", {
                                                class: getStatusBadgeClass(_ctx.order.status)
                                              }, toDisplayString(getStatusText(_ctx.order.status)), 3)
                                            ])
                                          ]),
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-sm text-gray-500" }, "Mode de paiement"),
                                            createVNode("p", { class: "mt-1" }, [
                                              createVNode("span", {
                                                class: getPaymentBadgeClass(_ctx.order.paymentMethod)
                                              }, toDisplayString(getPaymentText(_ctx.order.paymentMethod)), 3)
                                            ])
                                          ]),
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-sm text-gray-500" }, "Derni\xE8re mise \xE0 jour"),
                                            createVNode("p", { class: "text-sm font-medium mt-1" }, toDisplayString(formatDate(_ctx.order.updatedAt)), 1)
                                          ])
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-white border border-gray-200 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Actions"),
                                        createVNode("div", { class: "space-y-3" }, [
                                          _ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled" ? (openBlock(), createBlock("button", {
                                            key: 0,
                                            onClick: ($event) => updateStatus("processing"),
                                            class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                          }, " Marquer en traitement ", 8, ["onClick"])) : createCommentVNode("", true),
                                          _ctx.order.status === "processing" ? (openBlock(), createBlock("button", {
                                            key: 1,
                                            onClick: ($event) => updateStatus("shipped"),
                                            class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                          }, " Marquer comme exp\xE9di\xE9e ", 8, ["onClick"])) : createCommentVNode("", true),
                                          _ctx.order.status === "shipped" ? (openBlock(), createBlock("button", {
                                            key: 2,
                                            onClick: ($event) => updateStatus("delivered"),
                                            class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                          }, " Marquer comme livr\xE9e ", 8, ["onClick"])) : createCommentVNode("", true),
                                          _ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled" ? (openBlock(), createBlock("button", {
                                            key: 3,
                                            onClick: ($event) => updateStatus("cancelled"),
                                            class: "w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                                          }, " Annuler la commande ", 8, ["onClick"])) : createCommentVNode("", true)
                                        ])
                                      ])
                                    ])
                                  ])) : createCommentVNode("", true)
                                ])
                              ];
                            }),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode(unref(he), {
                      as: "template",
                      enter: "ease-out duration-300",
                      "enter-from": "opacity-0",
                      "enter-to": "opacity-100",
                      leave: "ease-in duration-200",
                      "leave-from": "opacity-100",
                      "leave-to": "opacity-0"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "fixed inset-0 z-10 overflow-y-auto" }, [
                      createVNode("div", { class: "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" }, [
                        createVNode(unref(he), {
                          as: "template",
                          enter: "ease-out duration-300",
                          "enter-from": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                          "enter-to": "opacity-100 translate-y-0 sm:scale-100",
                          leave: "ease-in duration-200",
                          "leave-from": "opacity-100 translate-y-0 sm:scale-100",
                          "leave-to": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl" }, {
                              default: withCtx(() => {
                                var _a;
                                return [
                                  createVNode("div", { class: "bg-white px-6 py-6" }, [
                                    createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                      createVNode("div", null, [
                                        createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                          default: withCtx(() => {
                                            var _a2;
                                            return [
                                              createTextVNode(" Commande " + toDisplayString((_a2 = _ctx.order) == null ? void 0 : _a2.orderNumber), 1)
                                            ];
                                          }),
                                          _: 1
                                        }),
                                        createVNode("p", { class: "text-sm text-gray-500 mt-1" }, " Cr\xE9\xE9e le " + toDisplayString(formatDate((_a = _ctx.order) == null ? void 0 : _a.createdAt)), 1)
                                      ]),
                                      createVNode("button", {
                                        onClick: ($event) => _ctx.$emit("close"),
                                        class: "rounded-md text-gray-400 hover:text-gray-500"
                                      }, [
                                        createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                      ], 8, ["onClick"])
                                    ]),
                                    _ctx.order ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "grid grid-cols-1 lg:grid-cols-3 gap-8"
                                    }, [
                                      createVNode("div", { class: "lg:col-span-2 space-y-6" }, [
                                        createVNode("div", { class: "bg-gray-50 rounded-lg p-6" }, [
                                          createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Informations client"),
                                          createVNode("div", { class: "grid grid-cols-2 gap-4 text-sm" }, [
                                            createVNode("div", null, [
                                              createVNode("span", { class: "text-gray-500" }, "Nom :"),
                                              createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerName), 1)
                                            ]),
                                            createVNode("div", null, [
                                              createVNode("span", { class: "text-gray-500" }, "T\xE9l\xE9phone :"),
                                              createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerPhone), 1)
                                            ]),
                                            createVNode("div", { class: "col-span-2" }, [
                                              createVNode("span", { class: "text-gray-500" }, "Email :"),
                                              createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerEmail), 1)
                                            ])
                                          ])
                                        ]),
                                        createVNode("div", { class: "bg-gray-50 rounded-lg p-6" }, [
                                          createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Articles command\xE9s"),
                                          createVNode("div", { class: "space-y-4" }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(_ctx.order.items, (item) => {
                                              return openBlock(), createBlock("div", {
                                                key: item.name,
                                                class: "flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                                              }, [
                                                createVNode("div", null, [
                                                  createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(item.name), 1),
                                                  createVNode("p", { class: "text-sm text-gray-500" }, "Quantit\xE9: " + toDisplayString(item.quantity), 1)
                                                ]),
                                                createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(formatCurrency(item.price * item.quantity)), 1)
                                              ]);
                                            }), 128))
                                          ]),
                                          createVNode("div", { class: "border-t border-gray-200 pt-4 mt-4" }, [
                                            createVNode("div", { class: "flex justify-between items-center text-lg font-bold" }, [
                                              createVNode("span", null, "Total"),
                                              createVNode("span", null, toDisplayString(formatCurrency(_ctx.order.totalAmount)), 1)
                                            ])
                                          ])
                                        ])
                                      ]),
                                      createVNode("div", { class: "space-y-6" }, [
                                        createVNode("div", { class: "bg-white border border-gray-200 rounded-lg p-6" }, [
                                          createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Statut"),
                                          createVNode("div", { class: "space-y-4" }, [
                                            createVNode("div", null, [
                                              createVNode("span", { class: "text-sm text-gray-500" }, "Statut de la commande"),
                                              createVNode("p", { class: "mt-1" }, [
                                                createVNode("span", {
                                                  class: getStatusBadgeClass(_ctx.order.status)
                                                }, toDisplayString(getStatusText(_ctx.order.status)), 3)
                                              ])
                                            ]),
                                            createVNode("div", null, [
                                              createVNode("span", { class: "text-sm text-gray-500" }, "Mode de paiement"),
                                              createVNode("p", { class: "mt-1" }, [
                                                createVNode("span", {
                                                  class: getPaymentBadgeClass(_ctx.order.paymentMethod)
                                                }, toDisplayString(getPaymentText(_ctx.order.paymentMethod)), 3)
                                              ])
                                            ]),
                                            createVNode("div", null, [
                                              createVNode("span", { class: "text-sm text-gray-500" }, "Derni\xE8re mise \xE0 jour"),
                                              createVNode("p", { class: "text-sm font-medium mt-1" }, toDisplayString(formatDate(_ctx.order.updatedAt)), 1)
                                            ])
                                          ])
                                        ]),
                                        createVNode("div", { class: "bg-white border border-gray-200 rounded-lg p-6" }, [
                                          createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Actions"),
                                          createVNode("div", { class: "space-y-3" }, [
                                            _ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled" ? (openBlock(), createBlock("button", {
                                              key: 0,
                                              onClick: ($event) => updateStatus("processing"),
                                              class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                            }, " Marquer en traitement ", 8, ["onClick"])) : createCommentVNode("", true),
                                            _ctx.order.status === "processing" ? (openBlock(), createBlock("button", {
                                              key: 1,
                                              onClick: ($event) => updateStatus("shipped"),
                                              class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                            }, " Marquer comme exp\xE9di\xE9e ", 8, ["onClick"])) : createCommentVNode("", true),
                                            _ctx.order.status === "shipped" ? (openBlock(), createBlock("button", {
                                              key: 2,
                                              onClick: ($event) => updateStatus("delivered"),
                                              class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                            }, " Marquer comme livr\xE9e ", 8, ["onClick"])) : createCommentVNode("", true),
                                            _ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled" ? (openBlock(), createBlock("button", {
                                              key: 3,
                                              onClick: ($event) => updateStatus("cancelled"),
                                              class: "w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                                            }, " Annuler la commande ", 8, ["onClick"])) : createCommentVNode("", true)
                                          ])
                                        ])
                                      ])
                                    ])) : createCommentVNode("", true)
                                  ])
                                ];
                              }),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Ye), {
                onClose: ($event) => _ctx.$emit("close"),
                class: "relative z-50"
              }, {
                default: withCtx(() => [
                  createVNode(unref(he), {
                    as: "template",
                    enter: "ease-out duration-300",
                    "enter-from": "opacity-0",
                    "enter-to": "opacity-100",
                    leave: "ease-in duration-200",
                    "leave-from": "opacity-100",
                    "leave-to": "opacity-0"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "fixed inset-0 z-10 overflow-y-auto" }, [
                    createVNode("div", { class: "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" }, [
                      createVNode(unref(he), {
                        as: "template",
                        enter: "ease-out duration-300",
                        "enter-from": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                        "enter-to": "opacity-100 translate-y-0 sm:scale-100",
                        leave: "ease-in duration-200",
                        "leave-from": "opacity-100 translate-y-0 sm:scale-100",
                        "leave-to": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl" }, {
                            default: withCtx(() => {
                              var _a;
                              return [
                                createVNode("div", { class: "bg-white px-6 py-6" }, [
                                  createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                    createVNode("div", null, [
                                      createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                        default: withCtx(() => {
                                          var _a2;
                                          return [
                                            createTextVNode(" Commande " + toDisplayString((_a2 = _ctx.order) == null ? void 0 : _a2.orderNumber), 1)
                                          ];
                                        }),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "text-sm text-gray-500 mt-1" }, " Cr\xE9\xE9e le " + toDisplayString(formatDate((_a = _ctx.order) == null ? void 0 : _a.createdAt)), 1)
                                    ]),
                                    createVNode("button", {
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "rounded-md text-gray-400 hover:text-gray-500"
                                    }, [
                                      createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                    ], 8, ["onClick"])
                                  ]),
                                  _ctx.order ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "grid grid-cols-1 lg:grid-cols-3 gap-8"
                                  }, [
                                    createVNode("div", { class: "lg:col-span-2 space-y-6" }, [
                                      createVNode("div", { class: "bg-gray-50 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Informations client"),
                                        createVNode("div", { class: "grid grid-cols-2 gap-4 text-sm" }, [
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-gray-500" }, "Nom :"),
                                            createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerName), 1)
                                          ]),
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-gray-500" }, "T\xE9l\xE9phone :"),
                                            createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerPhone), 1)
                                          ]),
                                          createVNode("div", { class: "col-span-2" }, [
                                            createVNode("span", { class: "text-gray-500" }, "Email :"),
                                            createVNode("p", { class: "font-medium" }, toDisplayString(_ctx.order.customerEmail), 1)
                                          ])
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-gray-50 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Articles command\xE9s"),
                                        createVNode("div", { class: "space-y-4" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(_ctx.order.items, (item) => {
                                            return openBlock(), createBlock("div", {
                                              key: item.name,
                                              class: "flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                                            }, [
                                              createVNode("div", null, [
                                                createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(item.name), 1),
                                                createVNode("p", { class: "text-sm text-gray-500" }, "Quantit\xE9: " + toDisplayString(item.quantity), 1)
                                              ]),
                                              createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(formatCurrency(item.price * item.quantity)), 1)
                                            ]);
                                          }), 128))
                                        ]),
                                        createVNode("div", { class: "border-t border-gray-200 pt-4 mt-4" }, [
                                          createVNode("div", { class: "flex justify-between items-center text-lg font-bold" }, [
                                            createVNode("span", null, "Total"),
                                            createVNode("span", null, toDisplayString(formatCurrency(_ctx.order.totalAmount)), 1)
                                          ])
                                        ])
                                      ])
                                    ]),
                                    createVNode("div", { class: "space-y-6" }, [
                                      createVNode("div", { class: "bg-white border border-gray-200 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Statut"),
                                        createVNode("div", { class: "space-y-4" }, [
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-sm text-gray-500" }, "Statut de la commande"),
                                            createVNode("p", { class: "mt-1" }, [
                                              createVNode("span", {
                                                class: getStatusBadgeClass(_ctx.order.status)
                                              }, toDisplayString(getStatusText(_ctx.order.status)), 3)
                                            ])
                                          ]),
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-sm text-gray-500" }, "Mode de paiement"),
                                            createVNode("p", { class: "mt-1" }, [
                                              createVNode("span", {
                                                class: getPaymentBadgeClass(_ctx.order.paymentMethod)
                                              }, toDisplayString(getPaymentText(_ctx.order.paymentMethod)), 3)
                                            ])
                                          ]),
                                          createVNode("div", null, [
                                            createVNode("span", { class: "text-sm text-gray-500" }, "Derni\xE8re mise \xE0 jour"),
                                            createVNode("p", { class: "text-sm font-medium mt-1" }, toDisplayString(formatDate(_ctx.order.updatedAt)), 1)
                                          ])
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-white border border-gray-200 rounded-lg p-6" }, [
                                        createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-4" }, "Actions"),
                                        createVNode("div", { class: "space-y-3" }, [
                                          _ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled" ? (openBlock(), createBlock("button", {
                                            key: 0,
                                            onClick: ($event) => updateStatus("processing"),
                                            class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                          }, " Marquer en traitement ", 8, ["onClick"])) : createCommentVNode("", true),
                                          _ctx.order.status === "processing" ? (openBlock(), createBlock("button", {
                                            key: 1,
                                            onClick: ($event) => updateStatus("shipped"),
                                            class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                          }, " Marquer comme exp\xE9di\xE9e ", 8, ["onClick"])) : createCommentVNode("", true),
                                          _ctx.order.status === "shipped" ? (openBlock(), createBlock("button", {
                                            key: 2,
                                            onClick: ($event) => updateStatus("delivered"),
                                            class: "w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                          }, " Marquer comme livr\xE9e ", 8, ["onClick"])) : createCommentVNode("", true),
                                          _ctx.order.status !== "delivered" && _ctx.order.status !== "cancelled" ? (openBlock(), createBlock("button", {
                                            key: 3,
                                            onClick: ($event) => updateStatus("cancelled"),
                                            class: "w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                                          }, " Annuler la commande ", 8, ["onClick"])) : createCommentVNode("", true)
                                        ])
                                      ])
                                    ])
                                  ])) : createCommentVNode("", true)
                                ])
                              ];
                            }),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["onClose"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/OrderDetailsModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const itemsPerPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "orders",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const currentPage = ref(1);
    const selectedOrder = ref(null);
    const isModalOpen = ref(false);
    const filters = ref({
      status: "",
      paymentMethod: "",
      period: "month",
      search: ""
    });
    const stats = ref({
      totalOrders: 43,
      totalRevenue: 275e4,
      pendingOrders: 8,
      averageOrderValue: 63953
    });
    const orders = ref([
      {
        id: "1",
        orderNumber: "CS-001",
        conversationId: "conv_123456",
        customerName: "Marie Dubois",
        customerPhone: "+225 07 12 34 56 78",
        customerEmail: "marie@example.com",
        items: [
          { name: "Smartphone Galaxy A54", quantity: 1, price: 18e4 },
          { name: "Coque protection", quantity: 1, price: 5e3 }
        ],
        totalAmount: 185e3,
        paymentMethod: "mobile_money",
        status: "confirmed",
        createdAt: /* @__PURE__ */ new Date("2025-01-14T10:45:00"),
        updatedAt: /* @__PURE__ */ new Date("2025-01-14T11:00:00")
      },
      {
        id: "2",
        orderNumber: "CS-002",
        conversationId: "conv_789012",
        customerName: "Jean Martin",
        customerPhone: "+225 05 98 76 54 32",
        customerEmail: "jean@example.com",
        items: [
          { name: "MacBook Air M2", quantity: 1, price: 75e4 }
        ],
        totalAmount: 75e4,
        paymentMethod: "bank_transfer",
        status: "processing",
        createdAt: /* @__PURE__ */ new Date("2025-01-13T16:30:00"),
        updatedAt: /* @__PURE__ */ new Date("2025-01-14T09:15:00")
      },
      {
        id: "3",
        orderNumber: "CS-003",
        conversationId: "conv_345678",
        customerName: "Sophie Laurent",
        customerPhone: "+225 01 23 45 67 89",
        customerEmail: "sophie@example.com",
        items: [
          { name: "Casque Bluetooth Sony", quantity: 2, price: 45e3 },
          { name: "Chargeur sans fil", quantity: 1, price: 15e3 }
        ],
        totalAmount: 105e3,
        paymentMethod: "mobile_money",
        status: "shipped",
        createdAt: /* @__PURE__ */ new Date("2025-01-12T14:20:00"),
        updatedAt: /* @__PURE__ */ new Date("2025-01-13T10:30:00")
      },
      {
        id: "4",
        orderNumber: "CS-004",
        conversationId: "conv_901234",
        customerName: "Ahmed Kon\xE9",
        customerPhone: "+225 07 87 65 43 21",
        customerEmail: "ahmed@example.com",
        items: [
          { name: 'iPad Pro 11"', quantity: 1, price: 45e4 },
          { name: "Apple Pencil", quantity: 1, price: 65e3 }
        ],
        totalAmount: 515e3,
        paymentMethod: "cash",
        status: "delivered",
        createdAt: /* @__PURE__ */ new Date("2025-01-10T11:15:00"),
        updatedAt: /* @__PURE__ */ new Date("2025-01-12T16:45:00")
      },
      {
        id: "5",
        orderNumber: "CS-005",
        conversationId: "conv_567890",
        customerName: "Fatou Diallo",
        customerPhone: "+225 05 11 22 33 44",
        customerEmail: "fatou@example.com",
        items: [
          { name: "Montre connect\xE9e", quantity: 1, price: 85e3 }
        ],
        totalAmount: 85e3,
        paymentMethod: "mobile_money",
        status: "pending",
        createdAt: /* @__PURE__ */ new Date("2025-01-14T09:30:00"),
        updatedAt: /* @__PURE__ */ new Date("2025-01-14T09:30:00")
      }
    ]);
    const filteredOrders = computed(() => {
      let filtered = orders.value;
      if (filters.value.status) {
        filtered = filtered.filter((order) => order.status === filters.value.status);
      }
      if (filters.value.paymentMethod) {
        filtered = filtered.filter((order) => order.paymentMethod === filters.value.paymentMethod);
      }
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase();
        filtered = filtered.filter(
          (order) => order.orderNumber.toLowerCase().includes(search) || order.customerName.toLowerCase().includes(search) || order.customerPhone.includes(search) || order.customerEmail.toLowerCase().includes(search)
        );
      }
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      switch (filters.value.period) {
        case "today":
          filtered = filtered.filter((order) => order.createdAt >= today);
          break;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1e3);
          filtered = filtered.filter((order) => order.createdAt >= weekAgo);
          break;
        case "month":
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          filtered = filtered.filter((order) => order.createdAt >= monthAgo);
          break;
      }
      return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });
    const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage));
    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredOrders.value.slice(start, end);
    });
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
    const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredOrders.value.length));
    const visiblePages = computed(() => {
      const pages = [];
      const start = Math.max(1, currentPage.value - 2);
      const end = Math.min(totalPages.value, currentPage.value + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });
    const getInitials = (name) => {
      return name.split(" ").map((n) => n.charAt(0)).join("").toUpperCase().slice(0, 2);
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
        confirmed: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
        processing: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800",
        shipped: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800",
        delivered: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
        cancelled: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
      };
      return classes[status] || classes.pending;
    };
    const getStatusText = (status) => {
      const texts = {
        pending: "En attente",
        confirmed: "Confirm\xE9e",
        processing: "En traitement",
        shipped: "Exp\xE9di\xE9e",
        delivered: "Livr\xE9e",
        cancelled: "Annul\xE9e"
      };
      return texts[status] || "Inconnue";
    };
    const getPaymentBadgeClass = (paymentMethod) => {
      const classes = {
        mobile_money: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800",
        cash: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
        card: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
        bank_transfer: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
      };
      return classes[paymentMethod] || classes.cash;
    };
    const getPaymentText = (paymentMethod) => {
      const texts = {
        mobile_money: "Mobile Money",
        cash: "Esp\xE8ces",
        card: "Carte",
        bank_transfer: "Virement"
      };
      return texts[paymentMethod] || "Autre";
    };
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 0
      }).format(amount);
    };
    const formatDate = (date) => {
      return format(date, "dd/MM/yyyy HH:mm", { locale: fr });
    };
    const closeModal = () => {
      isModalOpen.value = false;
      selectedOrder.value = null;
    };
    const handleOrderUpdate = (updatedOrder) => {
      const index = orders.value.findIndex((order) => order.id === updatedOrder.id);
      if (index !== -1) {
        orders.value[index] = updatedOrder;
      }
      closeModal();
      const showNotification = inject("showNotification");
      if (showNotification) {
        showNotification("Commande mise \xE0 jour avec succ\xE8s !", "success");
      }
    };
    watch(filters, () => {
      currentPage.value = 1;
    }, { deep: true });
    useSeoMeta({
      title: "Commandes - ChatSeller",
      description: "G\xE9rez et suivez toutes les commandes g\xE9n\xE9r\xE9es par votre Agent IA Commercial"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OrderDetailsModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"><div><h1 class="text-2xl font-bold text-gray-900">Commandes</h1><p class="text-sm text-gray-500 mt-1"> G\xE9rez et suivez toutes les commandes g\xE9n\xE9r\xE9es par votre Agent IA Commercial </p></div><div class="flex items-center gap-3"><button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(unref(ArrowPathIcon), {
        class: ["h-4 w-4 mr-2", loading.value && "animate-spin"]
      }, null, _parent));
      _push(` Actualiser </button><button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(DocumentArrowDownIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
      _push(` Exporter CSV </button><button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(PlusIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
      _push(` Nouvelle commande </button></div></div><div class="flex flex-col sm:flex-row sm:items-center gap-4"><select class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "") : ssrLooseEqual(filters.value.status, "")) ? " selected" : ""}>Tous les statuts</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "pending") : ssrLooseEqual(filters.value.status, "pending")) ? " selected" : ""}>En attente</option><option value="confirmed"${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "confirmed") : ssrLooseEqual(filters.value.status, "confirmed")) ? " selected" : ""}>Confirm\xE9e</option><option value="processing"${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "processing") : ssrLooseEqual(filters.value.status, "processing")) ? " selected" : ""}>En traitement</option><option value="shipped"${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "shipped") : ssrLooseEqual(filters.value.status, "shipped")) ? " selected" : ""}>Exp\xE9di\xE9e</option><option value="delivered"${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "delivered") : ssrLooseEqual(filters.value.status, "delivered")) ? " selected" : ""}>Livr\xE9e</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(filters.value.status) ? ssrLooseContain(filters.value.status, "cancelled") : ssrLooseEqual(filters.value.status, "cancelled")) ? " selected" : ""}>Annul\xE9e</option></select><select class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.value.paymentMethod) ? ssrLooseContain(filters.value.paymentMethod, "") : ssrLooseEqual(filters.value.paymentMethod, "")) ? " selected" : ""}>Tous les paiements</option><option value="mobile_money"${ssrIncludeBooleanAttr(Array.isArray(filters.value.paymentMethod) ? ssrLooseContain(filters.value.paymentMethod, "mobile_money") : ssrLooseEqual(filters.value.paymentMethod, "mobile_money")) ? " selected" : ""}>Mobile Money</option><option value="cash"${ssrIncludeBooleanAttr(Array.isArray(filters.value.paymentMethod) ? ssrLooseContain(filters.value.paymentMethod, "cash") : ssrLooseEqual(filters.value.paymentMethod, "cash")) ? " selected" : ""}>Esp\xE8ces</option><option value="card"${ssrIncludeBooleanAttr(Array.isArray(filters.value.paymentMethod) ? ssrLooseContain(filters.value.paymentMethod, "card") : ssrLooseEqual(filters.value.paymentMethod, "card")) ? " selected" : ""}>Carte bancaire</option><option value="bank_transfer"${ssrIncludeBooleanAttr(Array.isArray(filters.value.paymentMethod) ? ssrLooseContain(filters.value.paymentMethod, "bank_transfer") : ssrLooseEqual(filters.value.paymentMethod, "bank_transfer")) ? " selected" : ""}>Virement</option></select><select class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"><option value="today"${ssrIncludeBooleanAttr(Array.isArray(filters.value.period) ? ssrLooseContain(filters.value.period, "today") : ssrLooseEqual(filters.value.period, "today")) ? " selected" : ""}>Aujourd&#39;hui</option><option value="week"${ssrIncludeBooleanAttr(Array.isArray(filters.value.period) ? ssrLooseContain(filters.value.period, "week") : ssrLooseEqual(filters.value.period, "week")) ? " selected" : ""}>Cette semaine</option><option value="month"${ssrIncludeBooleanAttr(Array.isArray(filters.value.period) ? ssrLooseContain(filters.value.period, "month") : ssrLooseEqual(filters.value.period, "month")) ? " selected" : ""}>Ce mois</option><option value="all"${ssrIncludeBooleanAttr(Array.isArray(filters.value.period) ? ssrLooseContain(filters.value.period, "all") : ssrLooseEqual(filters.value.period, "all")) ? " selected" : ""}>Toutes</option></select><div class="relative flex-1 max-w-md">`);
      _push(ssrRenderComponent(unref(MagnifyingGlassIcon), { class: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", filters.value.search)} type="text" placeholder="Rechercher une commande..." class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"></div></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center"><div class="flex-shrink-0"><div class="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(ShoppingBagIcon), { class: "h-6 w-6 text-blue-600" }, null, _parent));
      _push(`</div></div><div class="ml-4"><p class="text-sm font-medium text-gray-600">Total commandes</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(stats.value.totalOrders)}</p></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center"><div class="flex-shrink-0"><div class="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(CurrencyDollarIcon), { class: "h-6 w-6 text-green-600" }, null, _parent));
      _push(`</div></div><div class="ml-4"><p class="text-sm font-medium text-gray-600">Chiffre d&#39;affaires</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(formatCurrency(stats.value.totalRevenue))}</p></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center"><div class="flex-shrink-0"><div class="h-12 w-12 bg-yellow-50 rounded-xl flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(ClockIcon), { class: "h-6 w-6 text-yellow-600" }, null, _parent));
      _push(`</div></div><div class="ml-4"><p class="text-sm font-medium text-gray-600">En attente</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(stats.value.pendingOrders)}</p></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><div class="flex items-center"><div class="flex-shrink-0"><div class="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(ChartBarIcon), { class: "h-6 w-6 text-purple-600" }, null, _parent));
      _push(`</div></div><div class="ml-4"><p class="text-sm font-medium text-gray-600">Panier moyen</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(formatCurrency(stats.value.averageOrderValue))}</p></div></div></div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"><div class="px-6 py-4 border-b border-gray-200"><h3 class="text-lg font-semibold text-gray-900"> Commandes r\xE9centes (${ssrInterpolate(filteredOrders.value.length)}) </h3></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Commande </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Client </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Produits </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Montant </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Paiement </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Statut </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Date </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Actions </th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
      ssrRenderList(paginatedOrders.value, (order) => {
        _push(`<tr class="hover:bg-gray-50 transition-colors duration-200"><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900"> #${ssrInterpolate(order.orderNumber)}</div><div class="text-sm text-gray-500">${ssrInterpolate(order.conversationId)}</div></td><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="h-10 w-10 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center"><span class="text-white font-medium text-sm">${ssrInterpolate(getInitials(order.customerName))}</span></div><div class="ml-4"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(order.customerName)}</div><div class="text-sm text-gray-500">${ssrInterpolate(order.customerPhone)}</div></div></div></td><td class="px-6 py-4"><div class="text-sm text-gray-900"><span class="font-medium">${ssrInterpolate(order.items.length)}</span> produit${ssrInterpolate(order.items.length > 1 ? "s" : "")}</div><div class="text-sm text-gray-500 max-w-xs truncate">${ssrInterpolate(order.items.map((item) => item.name).join(", "))}</div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(formatCurrency(order.totalAmount))}</div><div class="text-sm text-gray-500"> Qt\xE9: ${ssrInterpolate(order.items.reduce((sum, item) => sum + item.quantity, 0))}</div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass(getPaymentBadgeClass(order.paymentMethod))}">${ssrInterpolate(getPaymentText(order.paymentMethod))}</span></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass(getStatusBadgeClass(order.status))}">${ssrInterpolate(getStatusText(order.status))}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(order.createdAt))}</td><td class="px-6 py-4 whitespace-nowrap text-right"><div class="flex items-center space-x-2"><button class="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="Voir d\xE9tails">`);
        _push(ssrRenderComponent(unref(EyeIcon), { class: "h-4 w-4" }, null, _parent));
        _push(`</button><button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200" title="Modifier">`);
        _push(ssrRenderComponent(unref(PencilIcon), { class: "h-4 w-4" }, null, _parent));
        _push(`</button>`);
        if (order.status !== "delivered" && order.status !== "cancelled") {
          _push(`<button class="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200" title="Mettre \xE0 jour le statut">`);
          _push(ssrRenderComponent(unref(CheckCircleIcon), { class: "h-4 w-4" }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"><div class="flex-1 flex justify-between sm:hidden"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> Pr\xE9c\xE9dent </button><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> Suivant </button></div><div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"><div><p class="text-sm text-gray-700"> Affichage de <span class="font-medium">${ssrInterpolate(startIndex.value)}</span> \xE0 <span class="font-medium">${ssrInterpolate(endIndex.value)}</span> sur <span class="font-medium">${ssrInterpolate(filteredOrders.value.length)}</span> r\xE9sultats </p></div><div><nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">`);
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
      if (selectedOrder.value) {
        _push(ssrRenderComponent(_component_OrderDetailsModal, {
          order: selectedOrder.value,
          "is-open": isModalOpen.value,
          onClose: closeModal,
          onUpdate: handleOrderUpdate
        }, null, _parent));
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

export { _sfc_main as default };
//# sourceMappingURL=orders-CsK_qVVL.mjs.map
