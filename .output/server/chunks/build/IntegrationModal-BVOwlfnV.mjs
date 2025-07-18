import { _ as __nuxt_component_0 } from './nuxt-link-v8ty_PQD.mjs';
import { defineComponent, ref, computed, unref, mergeProps, withCtx, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, toDisplayString, inject, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { XMarkIcon, InformationCircleIcon, ClipboardIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import { S as Se, Y as Ye, h as he, G as Ge, V as Ve } from './transition-DyayiTxm.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "IntegrationModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    userId: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const activeTab = ref("script");
    const tabs = [
      { id: "script", name: "Script universel" },
      { id: "shopify", name: "Shopify" },
      { id: "woocommerce", name: "WooCommerce" }
    ];
    const userId = computed(() => props.userId || "YOUR_SHOP_ID");
    const copyToClipboard = async () => {
      let code = "";
      switch (activeTab.value) {
        case "script":
          code = `<!-- ChatSeller Widget -->
<script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="${userId.value}"
        data-button-text="Parler \xE0 la vendeuse"
        data-primary-color="#ec4899"
        data-position="above-cart"><\/script>`;
          break;
        case "shopify":
          code = `<!-- ChatSeller Widget -->
<script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="${userId.value}"
        data-button-text="Parler \xE0 la vendeuse"
        data-primary-color="#ec4899"><\/script>`;
          break;
        case "woocommerce":
          code = `// Ajouter dans functions.php
add_action('woocommerce_single_product_summary', 'add_chatseller_widget', 25);
function add_chatseller_widget() {
    echo '<script src="https://widget.chatseller.app/widget.js" 
               data-shop-id="${userId.value}"
               data-button-text="Parler \xE0 la vendeuse"
               data-primary-color="#ec4899"><\/script>';
}`;
          break;
      }
      try {
        await (void 0).clipboard.writeText(code);
        const showNotification = inject("showNotification");
        if (showNotification) {
          showNotification("Code copi\xE9 avec succ\xE8s !", "success");
        }
      } catch (error) {
        console.error("Erreur lors de la copie:", error);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(unref(Se), mergeProps({
        show: _ctx.show,
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
                        _push4(ssrRenderComponent(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="bg-white px-6 py-6"${_scopeId4}><div class="flex items-center justify-between mb-6"${_scopeId4}><div${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Code d&#39;int\xE9gration ChatSeller `);
                                  } else {
                                    return [
                                      createTextVNode(" Code d'int\xE9gration ChatSeller ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<p class="text-sm text-gray-600 mt-1"${_scopeId4}> Copiez ce code et collez-le sur vos pages produit </p></div><button class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(XMarkIcon), { class: "h-6 w-6" }, null, _parent5, _scopeId4));
                              _push5(`</button></div><div class="border-b border-gray-200 mb-6"${_scopeId4}><nav class="-mb-px flex space-x-8"${_scopeId4}><!--[-->`);
                              ssrRenderList(tabs, (tab) => {
                                _push5(`<button class="${ssrRenderClass([
                                  activeTab.value === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                  "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                                ])}"${_scopeId4}>${ssrInterpolate(tab.name)}</button>`);
                              });
                              _push5(`<!--]--></nav></div>`);
                              if (activeTab.value === "script") {
                                _push5(`<div${_scopeId4}><div class="mb-4"${_scopeId4}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId4}> Code JavaScript (recommand\xE9) </label><div class="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto"${_scopeId4}><pre${_scopeId4}><code${_scopeId4}>&lt;!-- ChatSeller Widget --&gt;
&lt;script src=&quot;https://widget.chatseller.app/widget.js&quot; 
        data-shop-id=&quot;${ssrInterpolate(unref(userId))}&quot;
        data-button-text=&quot;Parler \xE0 la vendeuse&quot;
        data-primary-color=&quot;#ec4899&quot;
        data-position=&quot;above-cart&quot;&gt;&lt;/script&gt;</code></pre></div></div></div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              if (activeTab.value === "shopify") {
                                _push5(`<div${_scopeId4}><div class="mb-4"${_scopeId4}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId4}> Installation Shopify </label><div class="prose text-sm text-gray-600 mb-4"${_scopeId4}><ol class="list-decimal list-inside space-y-2"${_scopeId4}><li${_scopeId4}>Allez dans votre admin Shopify \u2192 Boutique en ligne \u2192 Th\xE8mes</li><li${_scopeId4}>Cliquez sur &quot;Actions&quot; \u2192 &quot;Modifier le code&quot;</li><li${_scopeId4}>Dans Templates, ouvrez &quot;product.liquid&quot;</li><li${_scopeId4}>Collez le code ci-dessous avant la balise &lt;/form&gt;</li></ol></div><div class="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto"${_scopeId4}><pre${_scopeId4}><code${_scopeId4}>&lt;!-- ChatSeller Widget --&gt;
&lt;script src=&quot;https://widget.chatseller.app/widget.js&quot; 
        data-shop-id=&quot;${ssrInterpolate(unref(userId))}&quot;
        data-button-text=&quot;Parler \xE0 la vendeuse&quot;
        data-primary-color=&quot;#ec4899&quot;&gt;&lt;/script&gt;</code></pre></div></div></div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              if (activeTab.value === "woocommerce") {
                                _push5(`<div${_scopeId4}><div class="mb-4"${_scopeId4}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId4}> Installation WooCommerce </label><div class="prose text-sm text-gray-600 mb-4"${_scopeId4}><ol class="list-decimal list-inside space-y-2"${_scopeId4}><li${_scopeId4}>Allez dans WordPress Admin \u2192 Apparence \u2192 \xC9diteur de th\xE8me</li><li${_scopeId4}>Ouvrez le fichier &quot;single-product.php&quot;</li><li${_scopeId4}>Ou utilisez l&#39;action WordPress ci-dessous dans functions.php</li></ol></div><div class="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto"${_scopeId4}><pre${_scopeId4}><code${_scopeId4}>// Ajouter dans functions.php
add_action(&#39;woocommerce_single_product_summary&#39;, &#39;add_chatseller_widget&#39;, 25);
function add_chatseller_widget() {
    echo &#39;&lt;script src=&quot;https://widget.chatseller.app/widget.js&quot; 
               data-shop-id=&quot;${ssrInterpolate(unref(userId))}&quot;
               data-button-text=&quot;Parler \xE0 la vendeuse&quot;
               data-primary-color=&quot;#ec4899&quot;&gt;&lt;/script&gt;&#39;;
}</code></pre></div></div></div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(`<div class="flex items-center justify-between pt-4 border-t border-gray-200"${_scopeId4}><div class="flex items-center text-sm text-gray-500"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(InformationCircleIcon), { class: "h-4 w-4 mr-2" }, null, _parent5, _scopeId4));
                              _push5(` Le widget s&#39;adapte automatiquement \xE0 votre design </div><div class="flex space-x-3"${_scopeId4}><button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(ClipboardIcon), { class: "mr-2 h-4 w-4" }, null, _parent5, _scopeId4));
                              _push5(` Copier le code </button>`);
                              _push5(ssrRenderComponent(_component_NuxtLink, {
                                to: "/settings",
                                onClick: ($event) => _ctx.$emit("close"),
                                class: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Cog6ToothIcon), { class: "mr-2 h-4 w-4" }, null, _parent6, _scopeId5));
                                    _push6(` Personnaliser `);
                                  } else {
                                    return [
                                      createVNode(unref(Cog6ToothIcon), { class: "mr-2 h-4 w-4" }),
                                      createTextVNode(" Personnaliser ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div></div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "bg-white px-6 py-6" }, [
                                  createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                    createVNode("div", null, [
                                      createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Code d'int\xE9gration ChatSeller ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "text-sm text-gray-600 mt-1" }, " Copiez ce code et collez-le sur vos pages produit ")
                                    ]),
                                    createVNode("button", {
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    }, [
                                      createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                    ], 8, ["onClick"])
                                  ]),
                                  createVNode("div", { class: "border-b border-gray-200 mb-6" }, [
                                    createVNode("nav", { class: "-mb-px flex space-x-8" }, [
                                      (openBlock(), createBlock(Fragment, null, renderList(tabs, (tab) => {
                                        return createVNode("button", {
                                          key: tab.id,
                                          onClick: ($event) => activeTab.value = tab.id,
                                          class: [
                                            activeTab.value === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                            "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                                          ]
                                        }, toDisplayString(tab.name), 11, ["onClick"]);
                                      }), 64))
                                    ])
                                  ]),
                                  activeTab.value === "script" ? (openBlock(), createBlock("div", { key: 0 }, [
                                    createVNode("div", { class: "mb-4" }, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Code JavaScript (recommand\xE9) "),
                                      createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                        createVNode("pre", null, [
                                          createVNode("code", null, '<!-- ChatSeller Widget -->\n<script src="https://widget.chatseller.app/widget.js" \n        data-shop-id="' + toDisplayString(unref(userId)) + '"\n        data-button-text="Parler \xE0 la vendeuse"\n        data-primary-color="#ec4899"\n        data-position="above-cart"><\/script>', 1)
                                        ])
                                      ])
                                    ])
                                  ])) : createCommentVNode("", true),
                                  activeTab.value === "shopify" ? (openBlock(), createBlock("div", { key: 1 }, [
                                    createVNode("div", { class: "mb-4" }, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Installation Shopify "),
                                      createVNode("div", { class: "prose text-sm text-gray-600 mb-4" }, [
                                        createVNode("ol", { class: "list-decimal list-inside space-y-2" }, [
                                          createVNode("li", null, "Allez dans votre admin Shopify \u2192 Boutique en ligne \u2192 Th\xE8mes"),
                                          createVNode("li", null, 'Cliquez sur "Actions" \u2192 "Modifier le code"'),
                                          createVNode("li", null, 'Dans Templates, ouvrez "product.liquid"'),
                                          createVNode("li", null, "Collez le code ci-dessous avant la balise </form>")
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                        createVNode("pre", null, [
                                          createVNode("code", null, '<!-- ChatSeller Widget -->\n<script src="https://widget.chatseller.app/widget.js" \n        data-shop-id="' + toDisplayString(unref(userId)) + '"\n        data-button-text="Parler \xE0 la vendeuse"\n        data-primary-color="#ec4899"><\/script>', 1)
                                        ])
                                      ])
                                    ])
                                  ])) : createCommentVNode("", true),
                                  activeTab.value === "woocommerce" ? (openBlock(), createBlock("div", { key: 2 }, [
                                    createVNode("div", { class: "mb-4" }, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Installation WooCommerce "),
                                      createVNode("div", { class: "prose text-sm text-gray-600 mb-4" }, [
                                        createVNode("ol", { class: "list-decimal list-inside space-y-2" }, [
                                          createVNode("li", null, "Allez dans WordPress Admin \u2192 Apparence \u2192 \xC9diteur de th\xE8me"),
                                          createVNode("li", null, 'Ouvrez le fichier "single-product.php"'),
                                          createVNode("li", null, "Ou utilisez l'action WordPress ci-dessous dans functions.php")
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                        createVNode("pre", null, [
                                          createVNode("code", null, `// Ajouter dans functions.php
add_action('woocommerce_single_product_summary', 'add_chatseller_widget', 25);
function add_chatseller_widget() {
    echo '<script src="https://widget.chatseller.app/widget.js" 
               data-shop-id="` + toDisplayString(unref(userId)) + `"
               data-button-text="Parler \xE0 la vendeuse"
               data-primary-color="#ec4899"><\/script>';
}`, 1)
                                        ])
                                      ])
                                    ])
                                  ])) : createCommentVNode("", true),
                                  createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-gray-200" }, [
                                    createVNode("div", { class: "flex items-center text-sm text-gray-500" }, [
                                      createVNode(unref(InformationCircleIcon), { class: "h-4 w-4 mr-2" }),
                                      createTextVNode(" Le widget s'adapte automatiquement \xE0 votre design ")
                                    ]),
                                    createVNode("div", { class: "flex space-x-3" }, [
                                      createVNode("button", {
                                        onClick: copyToClipboard,
                                        class: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                      }, [
                                        createVNode(unref(ClipboardIcon), { class: "mr-2 h-4 w-4" }),
                                        createTextVNode(" Copier le code ")
                                      ]),
                                      createVNode(_component_NuxtLink, {
                                        to: "/settings",
                                        onClick: ($event) => _ctx.$emit("close"),
                                        class: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Cog6ToothIcon), { class: "mr-2 h-4 w-4" }),
                                          createTextVNode(" Personnaliser ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ])
                                  ])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "bg-white px-6 py-6" }, [
                                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                  createVNode("div", null, [
                                    createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Code d'int\xE9gration ChatSeller ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("p", { class: "text-sm text-gray-600 mt-1" }, " Copiez ce code et collez-le sur vos pages produit ")
                                  ]),
                                  createVNode("button", {
                                    onClick: ($event) => _ctx.$emit("close"),
                                    class: "rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  }, [
                                    createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                  ], 8, ["onClick"])
                                ]),
                                createVNode("div", { class: "border-b border-gray-200 mb-6" }, [
                                  createVNode("nav", { class: "-mb-px flex space-x-8" }, [
                                    (openBlock(), createBlock(Fragment, null, renderList(tabs, (tab) => {
                                      return createVNode("button", {
                                        key: tab.id,
                                        onClick: ($event) => activeTab.value = tab.id,
                                        class: [
                                          activeTab.value === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                          "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                                        ]
                                      }, toDisplayString(tab.name), 11, ["onClick"]);
                                    }), 64))
                                  ])
                                ]),
                                activeTab.value === "script" ? (openBlock(), createBlock("div", { key: 0 }, [
                                  createVNode("div", { class: "mb-4" }, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Code JavaScript (recommand\xE9) "),
                                    createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                      createVNode("pre", null, [
                                        createVNode("code", null, '<!-- ChatSeller Widget -->\n<script src="https://widget.chatseller.app/widget.js" \n        data-shop-id="' + toDisplayString(unref(userId)) + '"\n        data-button-text="Parler \xE0 la vendeuse"\n        data-primary-color="#ec4899"\n        data-position="above-cart"><\/script>', 1)
                                      ])
                                    ])
                                  ])
                                ])) : createCommentVNode("", true),
                                activeTab.value === "shopify" ? (openBlock(), createBlock("div", { key: 1 }, [
                                  createVNode("div", { class: "mb-4" }, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Installation Shopify "),
                                    createVNode("div", { class: "prose text-sm text-gray-600 mb-4" }, [
                                      createVNode("ol", { class: "list-decimal list-inside space-y-2" }, [
                                        createVNode("li", null, "Allez dans votre admin Shopify \u2192 Boutique en ligne \u2192 Th\xE8mes"),
                                        createVNode("li", null, 'Cliquez sur "Actions" \u2192 "Modifier le code"'),
                                        createVNode("li", null, 'Dans Templates, ouvrez "product.liquid"'),
                                        createVNode("li", null, "Collez le code ci-dessous avant la balise </form>")
                                      ])
                                    ]),
                                    createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                      createVNode("pre", null, [
                                        createVNode("code", null, '<!-- ChatSeller Widget -->\n<script src="https://widget.chatseller.app/widget.js" \n        data-shop-id="' + toDisplayString(unref(userId)) + '"\n        data-button-text="Parler \xE0 la vendeuse"\n        data-primary-color="#ec4899"><\/script>', 1)
                                      ])
                                    ])
                                  ])
                                ])) : createCommentVNode("", true),
                                activeTab.value === "woocommerce" ? (openBlock(), createBlock("div", { key: 2 }, [
                                  createVNode("div", { class: "mb-4" }, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Installation WooCommerce "),
                                    createVNode("div", { class: "prose text-sm text-gray-600 mb-4" }, [
                                      createVNode("ol", { class: "list-decimal list-inside space-y-2" }, [
                                        createVNode("li", null, "Allez dans WordPress Admin \u2192 Apparence \u2192 \xC9diteur de th\xE8me"),
                                        createVNode("li", null, 'Ouvrez le fichier "single-product.php"'),
                                        createVNode("li", null, "Ou utilisez l'action WordPress ci-dessous dans functions.php")
                                      ])
                                    ]),
                                    createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                      createVNode("pre", null, [
                                        createVNode("code", null, `// Ajouter dans functions.php
add_action('woocommerce_single_product_summary', 'add_chatseller_widget', 25);
function add_chatseller_widget() {
    echo '<script src="https://widget.chatseller.app/widget.js" 
               data-shop-id="` + toDisplayString(unref(userId)) + `"
               data-button-text="Parler \xE0 la vendeuse"
               data-primary-color="#ec4899"><\/script>';
}`, 1)
                                      ])
                                    ])
                                  ])
                                ])) : createCommentVNode("", true),
                                createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-gray-200" }, [
                                  createVNode("div", { class: "flex items-center text-sm text-gray-500" }, [
                                    createVNode(unref(InformationCircleIcon), { class: "h-4 w-4 mr-2" }),
                                    createTextVNode(" Le widget s'adapte automatiquement \xE0 votre design ")
                                  ]),
                                  createVNode("div", { class: "flex space-x-3" }, [
                                    createVNode("button", {
                                      onClick: copyToClipboard,
                                      class: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                    }, [
                                      createVNode(unref(ClipboardIcon), { class: "mr-2 h-4 w-4" }),
                                      createTextVNode(" Copier le code ")
                                    ]),
                                    createVNode(_component_NuxtLink, {
                                      to: "/settings",
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Cog6ToothIcon), { class: "mr-2 h-4 w-4" }),
                                        createTextVNode(" Personnaliser ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ])
                                ])
                              ])
                            ]),
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
                            createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "bg-white px-6 py-6" }, [
                                  createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                    createVNode("div", null, [
                                      createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Code d'int\xE9gration ChatSeller ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "text-sm text-gray-600 mt-1" }, " Copiez ce code et collez-le sur vos pages produit ")
                                    ]),
                                    createVNode("button", {
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    }, [
                                      createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                    ], 8, ["onClick"])
                                  ]),
                                  createVNode("div", { class: "border-b border-gray-200 mb-6" }, [
                                    createVNode("nav", { class: "-mb-px flex space-x-8" }, [
                                      (openBlock(), createBlock(Fragment, null, renderList(tabs, (tab) => {
                                        return createVNode("button", {
                                          key: tab.id,
                                          onClick: ($event) => activeTab.value = tab.id,
                                          class: [
                                            activeTab.value === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                            "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                                          ]
                                        }, toDisplayString(tab.name), 11, ["onClick"]);
                                      }), 64))
                                    ])
                                  ]),
                                  activeTab.value === "script" ? (openBlock(), createBlock("div", { key: 0 }, [
                                    createVNode("div", { class: "mb-4" }, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Code JavaScript (recommand\xE9) "),
                                      createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                        createVNode("pre", null, [
                                          createVNode("code", null, '<!-- ChatSeller Widget -->\n<script src="https://widget.chatseller.app/widget.js" \n        data-shop-id="' + toDisplayString(unref(userId)) + '"\n        data-button-text="Parler \xE0 la vendeuse"\n        data-primary-color="#ec4899"\n        data-position="above-cart"><\/script>', 1)
                                        ])
                                      ])
                                    ])
                                  ])) : createCommentVNode("", true),
                                  activeTab.value === "shopify" ? (openBlock(), createBlock("div", { key: 1 }, [
                                    createVNode("div", { class: "mb-4" }, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Installation Shopify "),
                                      createVNode("div", { class: "prose text-sm text-gray-600 mb-4" }, [
                                        createVNode("ol", { class: "list-decimal list-inside space-y-2" }, [
                                          createVNode("li", null, "Allez dans votre admin Shopify \u2192 Boutique en ligne \u2192 Th\xE8mes"),
                                          createVNode("li", null, 'Cliquez sur "Actions" \u2192 "Modifier le code"'),
                                          createVNode("li", null, 'Dans Templates, ouvrez "product.liquid"'),
                                          createVNode("li", null, "Collez le code ci-dessous avant la balise </form>")
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                        createVNode("pre", null, [
                                          createVNode("code", null, '<!-- ChatSeller Widget -->\n<script src="https://widget.chatseller.app/widget.js" \n        data-shop-id="' + toDisplayString(unref(userId)) + '"\n        data-button-text="Parler \xE0 la vendeuse"\n        data-primary-color="#ec4899"><\/script>', 1)
                                        ])
                                      ])
                                    ])
                                  ])) : createCommentVNode("", true),
                                  activeTab.value === "woocommerce" ? (openBlock(), createBlock("div", { key: 2 }, [
                                    createVNode("div", { class: "mb-4" }, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Installation WooCommerce "),
                                      createVNode("div", { class: "prose text-sm text-gray-600 mb-4" }, [
                                        createVNode("ol", { class: "list-decimal list-inside space-y-2" }, [
                                          createVNode("li", null, "Allez dans WordPress Admin \u2192 Apparence \u2192 \xC9diteur de th\xE8me"),
                                          createVNode("li", null, 'Ouvrez le fichier "single-product.php"'),
                                          createVNode("li", null, "Ou utilisez l'action WordPress ci-dessous dans functions.php")
                                        ])
                                      ]),
                                      createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                        createVNode("pre", null, [
                                          createVNode("code", null, `// Ajouter dans functions.php
add_action('woocommerce_single_product_summary', 'add_chatseller_widget', 25);
function add_chatseller_widget() {
    echo '<script src="https://widget.chatseller.app/widget.js" 
               data-shop-id="` + toDisplayString(unref(userId)) + `"
               data-button-text="Parler \xE0 la vendeuse"
               data-primary-color="#ec4899"><\/script>';
}`, 1)
                                        ])
                                      ])
                                    ])
                                  ])) : createCommentVNode("", true),
                                  createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-gray-200" }, [
                                    createVNode("div", { class: "flex items-center text-sm text-gray-500" }, [
                                      createVNode(unref(InformationCircleIcon), { class: "h-4 w-4 mr-2" }),
                                      createTextVNode(" Le widget s'adapte automatiquement \xE0 votre design ")
                                    ]),
                                    createVNode("div", { class: "flex space-x-3" }, [
                                      createVNode("button", {
                                        onClick: copyToClipboard,
                                        class: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                      }, [
                                        createVNode(unref(ClipboardIcon), { class: "mr-2 h-4 w-4" }),
                                        createTextVNode(" Copier le code ")
                                      ]),
                                      createVNode(_component_NuxtLink, {
                                        to: "/settings",
                                        onClick: ($event) => _ctx.$emit("close"),
                                        class: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Cog6ToothIcon), { class: "mr-2 h-4 w-4" }),
                                          createTextVNode(" Personnaliser ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ])
                                  ])
                                ])
                              ]),
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
                          createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "bg-white px-6 py-6" }, [
                                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                  createVNode("div", null, [
                                    createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Code d'int\xE9gration ChatSeller ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("p", { class: "text-sm text-gray-600 mt-1" }, " Copiez ce code et collez-le sur vos pages produit ")
                                  ]),
                                  createVNode("button", {
                                    onClick: ($event) => _ctx.$emit("close"),
                                    class: "rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  }, [
                                    createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                  ], 8, ["onClick"])
                                ]),
                                createVNode("div", { class: "border-b border-gray-200 mb-6" }, [
                                  createVNode("nav", { class: "-mb-px flex space-x-8" }, [
                                    (openBlock(), createBlock(Fragment, null, renderList(tabs, (tab) => {
                                      return createVNode("button", {
                                        key: tab.id,
                                        onClick: ($event) => activeTab.value = tab.id,
                                        class: [
                                          activeTab.value === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                          "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                                        ]
                                      }, toDisplayString(tab.name), 11, ["onClick"]);
                                    }), 64))
                                  ])
                                ]),
                                activeTab.value === "script" ? (openBlock(), createBlock("div", { key: 0 }, [
                                  createVNode("div", { class: "mb-4" }, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Code JavaScript (recommand\xE9) "),
                                    createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                      createVNode("pre", null, [
                                        createVNode("code", null, '<!-- ChatSeller Widget -->\n<script src="https://widget.chatseller.app/widget.js" \n        data-shop-id="' + toDisplayString(unref(userId)) + '"\n        data-button-text="Parler \xE0 la vendeuse"\n        data-primary-color="#ec4899"\n        data-position="above-cart"><\/script>', 1)
                                      ])
                                    ])
                                  ])
                                ])) : createCommentVNode("", true),
                                activeTab.value === "shopify" ? (openBlock(), createBlock("div", { key: 1 }, [
                                  createVNode("div", { class: "mb-4" }, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Installation Shopify "),
                                    createVNode("div", { class: "prose text-sm text-gray-600 mb-4" }, [
                                      createVNode("ol", { class: "list-decimal list-inside space-y-2" }, [
                                        createVNode("li", null, "Allez dans votre admin Shopify \u2192 Boutique en ligne \u2192 Th\xE8mes"),
                                        createVNode("li", null, 'Cliquez sur "Actions" \u2192 "Modifier le code"'),
                                        createVNode("li", null, 'Dans Templates, ouvrez "product.liquid"'),
                                        createVNode("li", null, "Collez le code ci-dessous avant la balise </form>")
                                      ])
                                    ]),
                                    createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                      createVNode("pre", null, [
                                        createVNode("code", null, '<!-- ChatSeller Widget -->\n<script src="https://widget.chatseller.app/widget.js" \n        data-shop-id="' + toDisplayString(unref(userId)) + '"\n        data-button-text="Parler \xE0 la vendeuse"\n        data-primary-color="#ec4899"><\/script>', 1)
                                      ])
                                    ])
                                  ])
                                ])) : createCommentVNode("", true),
                                activeTab.value === "woocommerce" ? (openBlock(), createBlock("div", { key: 2 }, [
                                  createVNode("div", { class: "mb-4" }, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Installation WooCommerce "),
                                    createVNode("div", { class: "prose text-sm text-gray-600 mb-4" }, [
                                      createVNode("ol", { class: "list-decimal list-inside space-y-2" }, [
                                        createVNode("li", null, "Allez dans WordPress Admin \u2192 Apparence \u2192 \xC9diteur de th\xE8me"),
                                        createVNode("li", null, 'Ouvrez le fichier "single-product.php"'),
                                        createVNode("li", null, "Ou utilisez l'action WordPress ci-dessous dans functions.php")
                                      ])
                                    ]),
                                    createVNode("div", { class: "bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto" }, [
                                      createVNode("pre", null, [
                                        createVNode("code", null, `// Ajouter dans functions.php
add_action('woocommerce_single_product_summary', 'add_chatseller_widget', 25);
function add_chatseller_widget() {
    echo '<script src="https://widget.chatseller.app/widget.js" 
               data-shop-id="` + toDisplayString(unref(userId)) + `"
               data-button-text="Parler \xE0 la vendeuse"
               data-primary-color="#ec4899"><\/script>';
}`, 1)
                                      ])
                                    ])
                                  ])
                                ])) : createCommentVNode("", true),
                                createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-gray-200" }, [
                                  createVNode("div", { class: "flex items-center text-sm text-gray-500" }, [
                                    createVNode(unref(InformationCircleIcon), { class: "h-4 w-4 mr-2" }),
                                    createTextVNode(" Le widget s'adapte automatiquement \xE0 votre design ")
                                  ]),
                                  createVNode("div", { class: "flex space-x-3" }, [
                                    createVNode("button", {
                                      onClick: copyToClipboard,
                                      class: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                    }, [
                                      createVNode(unref(ClipboardIcon), { class: "mr-2 h-4 w-4" }),
                                      createTextVNode(" Copier le code ")
                                    ]),
                                    createVNode(_component_NuxtLink, {
                                      to: "/settings",
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Cog6ToothIcon), { class: "mr-2 h-4 w-4" }),
                                        createTextVNode(" Personnaliser ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ])
                                ])
                              ])
                            ]),
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/IntegrationModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=IntegrationModal-BVOwlfnV.mjs.map
