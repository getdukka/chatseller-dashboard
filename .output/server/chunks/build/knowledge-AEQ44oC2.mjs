import { defineComponent, ref, reactive, computed, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, createTextVNode, withModifiers, createBlock, createCommentVNode, openBlock, Fragment, renderList, toDisplayString, withDirectives, vModelSelect, vModelText, inject, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { DocumentTextIcon, ChatBubbleBottomCenterTextIcon, CpuChipIcon, ArrowPathIcon, DocumentPlusIcon, TagIcon, ClockIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon, ChartBarIcon, DocumentIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { S as Se, Y as Ye, h as he, G as Ge, V as Ve } from './transition-DyayiTxm.mjs';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { u as useSeoMeta } from './v3-D4nZQNuc.mjs';
import { _ as _export_sfc } from './server.mjs';
import './description-DeqVqtMl.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "UploadModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close", "upload"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const fileInput = ref();
    const selectedFiles = ref([]);
    const isDragging = ref(false);
    const uploading = ref(false);
    const form = reactive({
      category: "",
      description: ""
    });
    const handleDrop = (event) => {
      var _a;
      event.preventDefault();
      isDragging.value = false;
      const files = (_a = event.dataTransfer) == null ? void 0 : _a.files;
      if (files) {
        addFiles(files);
      }
    };
    const handleFileSelect = (event) => {
      const target = event.target;
      if (target.files) {
        addFiles(target.files);
      }
    };
    const addFiles = (fileList) => {
      const validTypes = [".pdf", ".doc", ".docx", ".csv", ".txt"];
      const maxSize = 10 * 1024 * 1024;
      Array.from(fileList).forEach((file) => {
        var _a;
        const extension = "." + ((_a = file.name.split(".").pop()) == null ? void 0 : _a.toLowerCase());
        if (!validTypes.includes(extension)) {
          alert(`Type de fichier non support\xE9: ${file.name}`);
          return;
        }
        if (file.size > maxSize) {
          alert(`Fichier trop volumineux: ${file.name} (max 10MB)`);
          return;
        }
        if (!selectedFiles.value.some((f) => f.name === file.name && f.size === file.size)) {
          selectedFiles.value.push(file);
        }
      });
    };
    const removeFile = (index) => {
      selectedFiles.value.splice(index, 1);
    };
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };
    const handleSubmit = async () => {
      if (selectedFiles.value.length === 0) return;
      uploading.value = true;
      try {
        const dt = new DataTransfer();
        selectedFiles.value.forEach((file) => dt.items.add(file));
        emit("upload", dt.files);
        selectedFiles.value = [];
        form.category = "";
        form.description = "";
      } finally {
        uploading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Se), mergeProps({
        as: "template",
        show: _ctx.isOpen
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Ye), {
              as: "div",
              class: "relative z-50",
              onClose: ($event) => _ctx.$emit("close")
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
                        _push4(ssrRenderComponent(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block"${_scopeId4}><button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"${_scopeId4}><span class="sr-only"${_scopeId4}>Fermer</span>`);
                              _push5(ssrRenderComponent(unref(XMarkIcon), { class: "h-6 w-6" }, null, _parent5, _scopeId4));
                              _push5(`</button></div><div class="sm:flex sm:items-start"${_scopeId4}><div class="w-full"${_scopeId4}><div class="mb-6"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(Ve), {
                                as: "h3",
                                class: "text-lg font-medium leading-6 text-gray-900"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Ajouter du contenu `);
                                  } else {
                                    return [
                                      createTextVNode(" Ajouter du contenu ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<p class="mt-2 text-sm text-gray-500"${_scopeId4}> Uploadez des documents pour enrichir la base de connaissance de votre agent IA. </p></div><form class="space-y-6"${_scopeId4}><div${_scopeId4}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId4}> Fichiers </label><div class="${ssrRenderClass([{ "border-blue-500 bg-blue-50": unref(isDragging) }, "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"])}"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(DocumentPlusIcon), { class: "h-12 w-12 text-gray-400 mx-auto mb-4" }, null, _parent5, _scopeId4));
                              _push5(`<p class="text-sm text-gray-600 mb-2"${_scopeId4}> Glissez-d\xE9posez vos fichiers ici, ou <button type="button" class="text-blue-600 hover:text-blue-500 font-medium"${_scopeId4}> parcourir </button></p><p class="text-xs text-gray-500"${_scopeId4}> PDF, Word, CSV, TXT jusqu&#39;\xE0 10MB </p><input type="file" multiple accept=".pdf,.doc,.docx,.csv,.txt" class="hidden"${_scopeId4}></div>`);
                              if (unref(selectedFiles).length > 0) {
                                _push5(`<div class="mt-4 space-y-2"${_scopeId4}><h4 class="text-sm font-medium text-gray-900"${_scopeId4}>Fichiers s\xE9lectionn\xE9s:</h4><div class="space-y-2"${_scopeId4}><!--[-->`);
                                ssrRenderList(unref(selectedFiles), (file, index) => {
                                  _push5(`<div class="flex items-center justify-between bg-gray-50 p-3 rounded-md"${_scopeId4}><div class="flex items-center space-x-3"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(DocumentIcon), { class: "h-5 w-5 text-gray-400" }, null, _parent5, _scopeId4));
                                  _push5(`<div${_scopeId4}><p class="text-sm font-medium text-gray-900"${_scopeId4}>${ssrInterpolate(file.name)}</p><p class="text-xs text-gray-500"${_scopeId4}>${ssrInterpolate(formatFileSize(file.size))}</p></div></div><button type="button" class="text-red-400 hover:text-red-600"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(XMarkIcon), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                                  _push5(`</button></div>`);
                                });
                                _push5(`<!--]--></div></div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(`</div><div${_scopeId4}><label for="category" class="block text-sm font-medium text-gray-700 mb-2"${_scopeId4}> Cat\xE9gorie </label><select id="category" class="form-select" required${_scopeId4}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, "") : ssrLooseEqual(unref(form).category, "")) ? " selected" : ""}${_scopeId4}>S\xE9lectionner une cat\xE9gorie</option><option value="products"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, "products") : ssrLooseEqual(unref(form).category, "products")) ? " selected" : ""}${_scopeId4}>Produits</option><option value="policies"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, "policies") : ssrLooseEqual(unref(form).category, "policies")) ? " selected" : ""}${_scopeId4}>Politiques</option><option value="shipping"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, "shipping") : ssrLooseEqual(unref(form).category, "shipping")) ? " selected" : ""}${_scopeId4}>Livraison</option><option value="payment"${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, "payment") : ssrLooseEqual(unref(form).category, "payment")) ? " selected" : ""}${_scopeId4}>Paiement</option></select></div><div${_scopeId4}><label for="description" class="block text-sm font-medium text-gray-700 mb-2"${_scopeId4}> Description (optionnelle) </label><textarea id="description" rows="3" class="form-textarea" placeholder="D\xE9crivez le contenu de ces documents..."${_scopeId4}>${ssrInterpolate(unref(form).description)}</textarea></div><div class="flex justify-end space-x-3"${_scopeId4}><button type="button" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"${_scopeId4}> Annuler </button><button type="submit"${ssrIncludeBooleanAttr(unref(selectedFiles).length === 0 || unref(uploading)) ? " disabled" : ""} class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId4}>`);
                              if (unref(uploading)) {
                                _push5(`<span class="flex items-center"${_scopeId4}><svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId4}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId4}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId4}></path></svg> Upload en cours... </span>`);
                              } else {
                                _push5(`<span${_scopeId4}> Uploader ${ssrInterpolate(unref(selectedFiles).length)} fichier${ssrInterpolate(unref(selectedFiles).length > 1 ? "s" : "")}</span>`);
                              }
                              _push5(`</button></div></form></div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "absolute right-0 top-0 hidden pr-4 pt-4 sm:block" }, [
                                  createVNode("button", {
                                    type: "button",
                                    class: "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                    onClick: ($event) => _ctx.$emit("close")
                                  }, [
                                    createVNode("span", { class: "sr-only" }, "Fermer"),
                                    createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                  ], 8, ["onClick"])
                                ]),
                                createVNode("div", { class: "sm:flex sm:items-start" }, [
                                  createVNode("div", { class: "w-full" }, [
                                    createVNode("div", { class: "mb-6" }, [
                                      createVNode(unref(Ve), {
                                        as: "h3",
                                        class: "text-lg font-medium leading-6 text-gray-900"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Ajouter du contenu ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "mt-2 text-sm text-gray-500" }, " Uploadez des documents pour enrichir la base de connaissance de votre agent IA. ")
                                    ]),
                                    createVNode("form", {
                                      onSubmit: withModifiers(handleSubmit, ["prevent"]),
                                      class: "space-y-6"
                                    }, [
                                      createVNode("div", null, [
                                        createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Fichiers "),
                                        createVNode("div", {
                                          onDrop: handleDrop,
                                          onDragover: withModifiers(() => {
                                          }, ["prevent"]),
                                          onDragenter: withModifiers(() => {
                                          }, ["prevent"]),
                                          class: ["border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors", { "border-blue-500 bg-blue-50": unref(isDragging) }]
                                        }, [
                                          createVNode(unref(DocumentPlusIcon), { class: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
                                          createVNode("p", { class: "text-sm text-gray-600 mb-2" }, [
                                            createTextVNode(" Glissez-d\xE9posez vos fichiers ici, ou "),
                                            createVNode("button", {
                                              type: "button",
                                              onClick: ($event) => {
                                                var _a;
                                                return (_a = unref(fileInput)) == null ? void 0 : _a.click();
                                              },
                                              class: "text-blue-600 hover:text-blue-500 font-medium"
                                            }, " parcourir ", 8, ["onClick"])
                                          ]),
                                          createVNode("p", { class: "text-xs text-gray-500" }, " PDF, Word, CSV, TXT jusqu'\xE0 10MB "),
                                          createVNode("input", {
                                            ref_key: "fileInput",
                                            ref: fileInput,
                                            type: "file",
                                            multiple: "",
                                            accept: ".pdf,.doc,.docx,.csv,.txt",
                                            class: "hidden",
                                            onChange: handleFileSelect
                                          }, null, 544)
                                        ], 42, ["onDragover", "onDragenter"]),
                                        unref(selectedFiles).length > 0 ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "mt-4 space-y-2"
                                        }, [
                                          createVNode("h4", { class: "text-sm font-medium text-gray-900" }, "Fichiers s\xE9lectionn\xE9s:"),
                                          createVNode("div", { class: "space-y-2" }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedFiles), (file, index) => {
                                              return openBlock(), createBlock("div", {
                                                key: index,
                                                class: "flex items-center justify-between bg-gray-50 p-3 rounded-md"
                                              }, [
                                                createVNode("div", { class: "flex items-center space-x-3" }, [
                                                  createVNode(unref(DocumentIcon), { class: "h-5 w-5 text-gray-400" }),
                                                  createVNode("div", null, [
                                                    createVNode("p", { class: "text-sm font-medium text-gray-900" }, toDisplayString(file.name), 1),
                                                    createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(formatFileSize(file.size)), 1)
                                                  ])
                                                ]),
                                                createVNode("button", {
                                                  type: "button",
                                                  onClick: ($event) => removeFile(index),
                                                  class: "text-red-400 hover:text-red-600"
                                                }, [
                                                  createVNode(unref(XMarkIcon), { class: "h-4 w-4" })
                                                ], 8, ["onClick"])
                                              ]);
                                            }), 128))
                                          ])
                                        ])) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", {
                                          for: "category",
                                          class: "block text-sm font-medium text-gray-700 mb-2"
                                        }, " Cat\xE9gorie "),
                                        withDirectives(createVNode("select", {
                                          id: "category",
                                          "onUpdate:modelValue": ($event) => unref(form).category = $event,
                                          class: "form-select",
                                          required: ""
                                        }, [
                                          createVNode("option", { value: "" }, "S\xE9lectionner une cat\xE9gorie"),
                                          createVNode("option", { value: "products" }, "Produits"),
                                          createVNode("option", { value: "policies" }, "Politiques"),
                                          createVNode("option", { value: "shipping" }, "Livraison"),
                                          createVNode("option", { value: "payment" }, "Paiement")
                                        ], 8, ["onUpdate:modelValue"]), [
                                          [vModelSelect, unref(form).category]
                                        ])
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", {
                                          for: "description",
                                          class: "block text-sm font-medium text-gray-700 mb-2"
                                        }, " Description (optionnelle) "),
                                        withDirectives(createVNode("textarea", {
                                          id: "description",
                                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                          rows: "3",
                                          class: "form-textarea",
                                          placeholder: "D\xE9crivez le contenu de ces documents..."
                                        }, null, 8, ["onUpdate:modelValue"]), [
                                          [vModelText, unref(form).description]
                                        ])
                                      ]),
                                      createVNode("div", { class: "flex justify-end space-x-3" }, [
                                        createVNode("button", {
                                          type: "button",
                                          onClick: ($event) => _ctx.$emit("close"),
                                          class: "bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                        }, " Annuler ", 8, ["onClick"]),
                                        createVNode("button", {
                                          type: "submit",
                                          disabled: unref(selectedFiles).length === 0 || unref(uploading),
                                          class: "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        }, [
                                          unref(uploading) ? (openBlock(), createBlock("span", {
                                            key: 0,
                                            class: "flex items-center"
                                          }, [
                                            (openBlock(), createBlock("svg", {
                                              class: "animate-spin -ml-1 mr-2 h-4 w-4 text-white",
                                              xmlns: "http://www.w3.org/2000/svg",
                                              fill: "none",
                                              viewBox: "0 0 24 24"
                                            }, [
                                              createVNode("circle", {
                                                class: "opacity-25",
                                                cx: "12",
                                                cy: "12",
                                                r: "10",
                                                stroke: "currentColor",
                                                "stroke-width": "4"
                                              }),
                                              createVNode("path", {
                                                class: "opacity-75",
                                                fill: "currentColor",
                                                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                              })
                                            ])),
                                            createTextVNode(" Upload en cours... ")
                                          ])) : (openBlock(), createBlock("span", { key: 1 }, " Uploader " + toDisplayString(unref(selectedFiles).length) + " fichier" + toDisplayString(unref(selectedFiles).length > 1 ? "s" : ""), 1))
                                        ], 8, ["disabled"])
                                      ])
                                    ], 32)
                                  ])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "absolute right-0 top-0 hidden pr-4 pt-4 sm:block" }, [
                                createVNode("button", {
                                  type: "button",
                                  class: "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                  onClick: ($event) => _ctx.$emit("close")
                                }, [
                                  createVNode("span", { class: "sr-only" }, "Fermer"),
                                  createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                ], 8, ["onClick"])
                              ]),
                              createVNode("div", { class: "sm:flex sm:items-start" }, [
                                createVNode("div", { class: "w-full" }, [
                                  createVNode("div", { class: "mb-6" }, [
                                    createVNode(unref(Ve), {
                                      as: "h3",
                                      class: "text-lg font-medium leading-6 text-gray-900"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Ajouter du contenu ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("p", { class: "mt-2 text-sm text-gray-500" }, " Uploadez des documents pour enrichir la base de connaissance de votre agent IA. ")
                                  ]),
                                  createVNode("form", {
                                    onSubmit: withModifiers(handleSubmit, ["prevent"]),
                                    class: "space-y-6"
                                  }, [
                                    createVNode("div", null, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Fichiers "),
                                      createVNode("div", {
                                        onDrop: handleDrop,
                                        onDragover: withModifiers(() => {
                                        }, ["prevent"]),
                                        onDragenter: withModifiers(() => {
                                        }, ["prevent"]),
                                        class: ["border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors", { "border-blue-500 bg-blue-50": unref(isDragging) }]
                                      }, [
                                        createVNode(unref(DocumentPlusIcon), { class: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
                                        createVNode("p", { class: "text-sm text-gray-600 mb-2" }, [
                                          createTextVNode(" Glissez-d\xE9posez vos fichiers ici, ou "),
                                          createVNode("button", {
                                            type: "button",
                                            onClick: ($event) => {
                                              var _a;
                                              return (_a = unref(fileInput)) == null ? void 0 : _a.click();
                                            },
                                            class: "text-blue-600 hover:text-blue-500 font-medium"
                                          }, " parcourir ", 8, ["onClick"])
                                        ]),
                                        createVNode("p", { class: "text-xs text-gray-500" }, " PDF, Word, CSV, TXT jusqu'\xE0 10MB "),
                                        createVNode("input", {
                                          ref_key: "fileInput",
                                          ref: fileInput,
                                          type: "file",
                                          multiple: "",
                                          accept: ".pdf,.doc,.docx,.csv,.txt",
                                          class: "hidden",
                                          onChange: handleFileSelect
                                        }, null, 544)
                                      ], 42, ["onDragover", "onDragenter"]),
                                      unref(selectedFiles).length > 0 ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "mt-4 space-y-2"
                                      }, [
                                        createVNode("h4", { class: "text-sm font-medium text-gray-900" }, "Fichiers s\xE9lectionn\xE9s:"),
                                        createVNode("div", { class: "space-y-2" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedFiles), (file, index) => {
                                            return openBlock(), createBlock("div", {
                                              key: index,
                                              class: "flex items-center justify-between bg-gray-50 p-3 rounded-md"
                                            }, [
                                              createVNode("div", { class: "flex items-center space-x-3" }, [
                                                createVNode(unref(DocumentIcon), { class: "h-5 w-5 text-gray-400" }),
                                                createVNode("div", null, [
                                                  createVNode("p", { class: "text-sm font-medium text-gray-900" }, toDisplayString(file.name), 1),
                                                  createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(formatFileSize(file.size)), 1)
                                                ])
                                              ]),
                                              createVNode("button", {
                                                type: "button",
                                                onClick: ($event) => removeFile(index),
                                                class: "text-red-400 hover:text-red-600"
                                              }, [
                                                createVNode(unref(XMarkIcon), { class: "h-4 w-4" })
                                              ], 8, ["onClick"])
                                            ]);
                                          }), 128))
                                        ])
                                      ])) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "category",
                                        class: "block text-sm font-medium text-gray-700 mb-2"
                                      }, " Cat\xE9gorie "),
                                      withDirectives(createVNode("select", {
                                        id: "category",
                                        "onUpdate:modelValue": ($event) => unref(form).category = $event,
                                        class: "form-select",
                                        required: ""
                                      }, [
                                        createVNode("option", { value: "" }, "S\xE9lectionner une cat\xE9gorie"),
                                        createVNode("option", { value: "products" }, "Produits"),
                                        createVNode("option", { value: "policies" }, "Politiques"),
                                        createVNode("option", { value: "shipping" }, "Livraison"),
                                        createVNode("option", { value: "payment" }, "Paiement")
                                      ], 8, ["onUpdate:modelValue"]), [
                                        [vModelSelect, unref(form).category]
                                      ])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "description",
                                        class: "block text-sm font-medium text-gray-700 mb-2"
                                      }, " Description (optionnelle) "),
                                      withDirectives(createVNode("textarea", {
                                        id: "description",
                                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                        rows: "3",
                                        class: "form-textarea",
                                        placeholder: "D\xE9crivez le contenu de ces documents..."
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelText, unref(form).description]
                                      ])
                                    ]),
                                    createVNode("div", { class: "flex justify-end space-x-3" }, [
                                      createVNode("button", {
                                        type: "button",
                                        onClick: ($event) => _ctx.$emit("close"),
                                        class: "bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                      }, " Annuler ", 8, ["onClick"]),
                                      createVNode("button", {
                                        type: "submit",
                                        disabled: unref(selectedFiles).length === 0 || unref(uploading),
                                        class: "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      }, [
                                        unref(uploading) ? (openBlock(), createBlock("span", {
                                          key: 0,
                                          class: "flex items-center"
                                        }, [
                                          (openBlock(), createBlock("svg", {
                                            class: "animate-spin -ml-1 mr-2 h-4 w-4 text-white",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24"
                                          }, [
                                            createVNode("circle", {
                                              class: "opacity-25",
                                              cx: "12",
                                              cy: "12",
                                              r: "10",
                                              stroke: "currentColor",
                                              "stroke-width": "4"
                                            }),
                                            createVNode("path", {
                                              class: "opacity-75",
                                              fill: "currentColor",
                                              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            })
                                          ])),
                                          createTextVNode(" Upload en cours... ")
                                        ])) : (openBlock(), createBlock("span", { key: 1 }, " Uploader " + toDisplayString(unref(selectedFiles).length) + " fichier" + toDisplayString(unref(selectedFiles).length > 1 ? "s" : ""), 1))
                                      ], 8, ["disabled"])
                                    ])
                                  ], 32)
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
                            createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "absolute right-0 top-0 hidden pr-4 pt-4 sm:block" }, [
                                  createVNode("button", {
                                    type: "button",
                                    class: "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                    onClick: ($event) => _ctx.$emit("close")
                                  }, [
                                    createVNode("span", { class: "sr-only" }, "Fermer"),
                                    createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                  ], 8, ["onClick"])
                                ]),
                                createVNode("div", { class: "sm:flex sm:items-start" }, [
                                  createVNode("div", { class: "w-full" }, [
                                    createVNode("div", { class: "mb-6" }, [
                                      createVNode(unref(Ve), {
                                        as: "h3",
                                        class: "text-lg font-medium leading-6 text-gray-900"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Ajouter du contenu ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "mt-2 text-sm text-gray-500" }, " Uploadez des documents pour enrichir la base de connaissance de votre agent IA. ")
                                    ]),
                                    createVNode("form", {
                                      onSubmit: withModifiers(handleSubmit, ["prevent"]),
                                      class: "space-y-6"
                                    }, [
                                      createVNode("div", null, [
                                        createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Fichiers "),
                                        createVNode("div", {
                                          onDrop: handleDrop,
                                          onDragover: withModifiers(() => {
                                          }, ["prevent"]),
                                          onDragenter: withModifiers(() => {
                                          }, ["prevent"]),
                                          class: ["border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors", { "border-blue-500 bg-blue-50": unref(isDragging) }]
                                        }, [
                                          createVNode(unref(DocumentPlusIcon), { class: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
                                          createVNode("p", { class: "text-sm text-gray-600 mb-2" }, [
                                            createTextVNode(" Glissez-d\xE9posez vos fichiers ici, ou "),
                                            createVNode("button", {
                                              type: "button",
                                              onClick: ($event) => {
                                                var _a;
                                                return (_a = unref(fileInput)) == null ? void 0 : _a.click();
                                              },
                                              class: "text-blue-600 hover:text-blue-500 font-medium"
                                            }, " parcourir ", 8, ["onClick"])
                                          ]),
                                          createVNode("p", { class: "text-xs text-gray-500" }, " PDF, Word, CSV, TXT jusqu'\xE0 10MB "),
                                          createVNode("input", {
                                            ref_key: "fileInput",
                                            ref: fileInput,
                                            type: "file",
                                            multiple: "",
                                            accept: ".pdf,.doc,.docx,.csv,.txt",
                                            class: "hidden",
                                            onChange: handleFileSelect
                                          }, null, 544)
                                        ], 42, ["onDragover", "onDragenter"]),
                                        unref(selectedFiles).length > 0 ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "mt-4 space-y-2"
                                        }, [
                                          createVNode("h4", { class: "text-sm font-medium text-gray-900" }, "Fichiers s\xE9lectionn\xE9s:"),
                                          createVNode("div", { class: "space-y-2" }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedFiles), (file, index) => {
                                              return openBlock(), createBlock("div", {
                                                key: index,
                                                class: "flex items-center justify-between bg-gray-50 p-3 rounded-md"
                                              }, [
                                                createVNode("div", { class: "flex items-center space-x-3" }, [
                                                  createVNode(unref(DocumentIcon), { class: "h-5 w-5 text-gray-400" }),
                                                  createVNode("div", null, [
                                                    createVNode("p", { class: "text-sm font-medium text-gray-900" }, toDisplayString(file.name), 1),
                                                    createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(formatFileSize(file.size)), 1)
                                                  ])
                                                ]),
                                                createVNode("button", {
                                                  type: "button",
                                                  onClick: ($event) => removeFile(index),
                                                  class: "text-red-400 hover:text-red-600"
                                                }, [
                                                  createVNode(unref(XMarkIcon), { class: "h-4 w-4" })
                                                ], 8, ["onClick"])
                                              ]);
                                            }), 128))
                                          ])
                                        ])) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", {
                                          for: "category",
                                          class: "block text-sm font-medium text-gray-700 mb-2"
                                        }, " Cat\xE9gorie "),
                                        withDirectives(createVNode("select", {
                                          id: "category",
                                          "onUpdate:modelValue": ($event) => unref(form).category = $event,
                                          class: "form-select",
                                          required: ""
                                        }, [
                                          createVNode("option", { value: "" }, "S\xE9lectionner une cat\xE9gorie"),
                                          createVNode("option", { value: "products" }, "Produits"),
                                          createVNode("option", { value: "policies" }, "Politiques"),
                                          createVNode("option", { value: "shipping" }, "Livraison"),
                                          createVNode("option", { value: "payment" }, "Paiement")
                                        ], 8, ["onUpdate:modelValue"]), [
                                          [vModelSelect, unref(form).category]
                                        ])
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", {
                                          for: "description",
                                          class: "block text-sm font-medium text-gray-700 mb-2"
                                        }, " Description (optionnelle) "),
                                        withDirectives(createVNode("textarea", {
                                          id: "description",
                                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                          rows: "3",
                                          class: "form-textarea",
                                          placeholder: "D\xE9crivez le contenu de ces documents..."
                                        }, null, 8, ["onUpdate:modelValue"]), [
                                          [vModelText, unref(form).description]
                                        ])
                                      ]),
                                      createVNode("div", { class: "flex justify-end space-x-3" }, [
                                        createVNode("button", {
                                          type: "button",
                                          onClick: ($event) => _ctx.$emit("close"),
                                          class: "bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                        }, " Annuler ", 8, ["onClick"]),
                                        createVNode("button", {
                                          type: "submit",
                                          disabled: unref(selectedFiles).length === 0 || unref(uploading),
                                          class: "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        }, [
                                          unref(uploading) ? (openBlock(), createBlock("span", {
                                            key: 0,
                                            class: "flex items-center"
                                          }, [
                                            (openBlock(), createBlock("svg", {
                                              class: "animate-spin -ml-1 mr-2 h-4 w-4 text-white",
                                              xmlns: "http://www.w3.org/2000/svg",
                                              fill: "none",
                                              viewBox: "0 0 24 24"
                                            }, [
                                              createVNode("circle", {
                                                class: "opacity-25",
                                                cx: "12",
                                                cy: "12",
                                                r: "10",
                                                stroke: "currentColor",
                                                "stroke-width": "4"
                                              }),
                                              createVNode("path", {
                                                class: "opacity-75",
                                                fill: "currentColor",
                                                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                              })
                                            ])),
                                            createTextVNode(" Upload en cours... ")
                                          ])) : (openBlock(), createBlock("span", { key: 1 }, " Uploader " + toDisplayString(unref(selectedFiles).length) + " fichier" + toDisplayString(unref(selectedFiles).length > 1 ? "s" : ""), 1))
                                        ], 8, ["disabled"])
                                      ])
                                    ], 32)
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
                as: "div",
                class: "relative z-50",
                onClose: ($event) => _ctx.$emit("close")
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
                          createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "absolute right-0 top-0 hidden pr-4 pt-4 sm:block" }, [
                                createVNode("button", {
                                  type: "button",
                                  class: "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                  onClick: ($event) => _ctx.$emit("close")
                                }, [
                                  createVNode("span", { class: "sr-only" }, "Fermer"),
                                  createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                ], 8, ["onClick"])
                              ]),
                              createVNode("div", { class: "sm:flex sm:items-start" }, [
                                createVNode("div", { class: "w-full" }, [
                                  createVNode("div", { class: "mb-6" }, [
                                    createVNode(unref(Ve), {
                                      as: "h3",
                                      class: "text-lg font-medium leading-6 text-gray-900"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Ajouter du contenu ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("p", { class: "mt-2 text-sm text-gray-500" }, " Uploadez des documents pour enrichir la base de connaissance de votre agent IA. ")
                                  ]),
                                  createVNode("form", {
                                    onSubmit: withModifiers(handleSubmit, ["prevent"]),
                                    class: "space-y-6"
                                  }, [
                                    createVNode("div", null, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Fichiers "),
                                      createVNode("div", {
                                        onDrop: handleDrop,
                                        onDragover: withModifiers(() => {
                                        }, ["prevent"]),
                                        onDragenter: withModifiers(() => {
                                        }, ["prevent"]),
                                        class: ["border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors", { "border-blue-500 bg-blue-50": unref(isDragging) }]
                                      }, [
                                        createVNode(unref(DocumentPlusIcon), { class: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
                                        createVNode("p", { class: "text-sm text-gray-600 mb-2" }, [
                                          createTextVNode(" Glissez-d\xE9posez vos fichiers ici, ou "),
                                          createVNode("button", {
                                            type: "button",
                                            onClick: ($event) => {
                                              var _a;
                                              return (_a = unref(fileInput)) == null ? void 0 : _a.click();
                                            },
                                            class: "text-blue-600 hover:text-blue-500 font-medium"
                                          }, " parcourir ", 8, ["onClick"])
                                        ]),
                                        createVNode("p", { class: "text-xs text-gray-500" }, " PDF, Word, CSV, TXT jusqu'\xE0 10MB "),
                                        createVNode("input", {
                                          ref_key: "fileInput",
                                          ref: fileInput,
                                          type: "file",
                                          multiple: "",
                                          accept: ".pdf,.doc,.docx,.csv,.txt",
                                          class: "hidden",
                                          onChange: handleFileSelect
                                        }, null, 544)
                                      ], 42, ["onDragover", "onDragenter"]),
                                      unref(selectedFiles).length > 0 ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "mt-4 space-y-2"
                                      }, [
                                        createVNode("h4", { class: "text-sm font-medium text-gray-900" }, "Fichiers s\xE9lectionn\xE9s:"),
                                        createVNode("div", { class: "space-y-2" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedFiles), (file, index) => {
                                            return openBlock(), createBlock("div", {
                                              key: index,
                                              class: "flex items-center justify-between bg-gray-50 p-3 rounded-md"
                                            }, [
                                              createVNode("div", { class: "flex items-center space-x-3" }, [
                                                createVNode(unref(DocumentIcon), { class: "h-5 w-5 text-gray-400" }),
                                                createVNode("div", null, [
                                                  createVNode("p", { class: "text-sm font-medium text-gray-900" }, toDisplayString(file.name), 1),
                                                  createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(formatFileSize(file.size)), 1)
                                                ])
                                              ]),
                                              createVNode("button", {
                                                type: "button",
                                                onClick: ($event) => removeFile(index),
                                                class: "text-red-400 hover:text-red-600"
                                              }, [
                                                createVNode(unref(XMarkIcon), { class: "h-4 w-4" })
                                              ], 8, ["onClick"])
                                            ]);
                                          }), 128))
                                        ])
                                      ])) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "category",
                                        class: "block text-sm font-medium text-gray-700 mb-2"
                                      }, " Cat\xE9gorie "),
                                      withDirectives(createVNode("select", {
                                        id: "category",
                                        "onUpdate:modelValue": ($event) => unref(form).category = $event,
                                        class: "form-select",
                                        required: ""
                                      }, [
                                        createVNode("option", { value: "" }, "S\xE9lectionner une cat\xE9gorie"),
                                        createVNode("option", { value: "products" }, "Produits"),
                                        createVNode("option", { value: "policies" }, "Politiques"),
                                        createVNode("option", { value: "shipping" }, "Livraison"),
                                        createVNode("option", { value: "payment" }, "Paiement")
                                      ], 8, ["onUpdate:modelValue"]), [
                                        [vModelSelect, unref(form).category]
                                      ])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "description",
                                        class: "block text-sm font-medium text-gray-700 mb-2"
                                      }, " Description (optionnelle) "),
                                      withDirectives(createVNode("textarea", {
                                        id: "description",
                                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                        rows: "3",
                                        class: "form-textarea",
                                        placeholder: "D\xE9crivez le contenu de ces documents..."
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelText, unref(form).description]
                                      ])
                                    ]),
                                    createVNode("div", { class: "flex justify-end space-x-3" }, [
                                      createVNode("button", {
                                        type: "button",
                                        onClick: ($event) => _ctx.$emit("close"),
                                        class: "bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                      }, " Annuler ", 8, ["onClick"]),
                                      createVNode("button", {
                                        type: "submit",
                                        disabled: unref(selectedFiles).length === 0 || unref(uploading),
                                        class: "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      }, [
                                        unref(uploading) ? (openBlock(), createBlock("span", {
                                          key: 0,
                                          class: "flex items-center"
                                        }, [
                                          (openBlock(), createBlock("svg", {
                                            class: "animate-spin -ml-1 mr-2 h-4 w-4 text-white",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24"
                                          }, [
                                            createVNode("circle", {
                                              class: "opacity-25",
                                              cx: "12",
                                              cy: "12",
                                              r: "10",
                                              stroke: "currentColor",
                                              "stroke-width": "4"
                                            }),
                                            createVNode("path", {
                                              class: "opacity-75",
                                              fill: "currentColor",
                                              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            })
                                          ])),
                                          createTextVNode(" Upload en cours... ")
                                        ])) : (openBlock(), createBlock("span", { key: 1 }, " Uploader " + toDisplayString(unref(selectedFiles).length) + " fichier" + toDisplayString(unref(selectedFiles).length > 1 ? "s" : ""), 1))
                                      ], 8, ["disabled"])
                                    ])
                                  ], 32)
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UploadModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FAQModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    faq: {}
  },
  emits: ["close", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = reactive({
      question: "",
      answer: "",
      category: ""
    });
    const handleSubmit = () => {
      emit("save", { ...form });
      resetForm();
    };
    const resetForm = () => {
      form.question = "";
      form.answer = "";
      form.category = "";
    };
    watch(() => props.faq, (newFaq) => {
      if (newFaq) {
        form.question = newFaq.question || "";
        form.answer = newFaq.answer || "";
        form.category = newFaq.category || "";
      } else {
        resetForm();
      }
    }, { immediate: true });
    watch(() => props.isOpen, (isOpen) => {
      if (!isOpen) {
        resetForm();
      }
    });
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
                        _push4(ssrRenderComponent(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="bg-white px-6 py-6"${_scopeId4}><div class="flex items-center justify-between mb-6"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(_ctx.faq ? "Modifier la FAQ" : "Ajouter une FAQ")}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(_ctx.faq ? "Modifier la FAQ" : "Ajouter une FAQ"), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<button class="rounded-md text-gray-400 hover:text-gray-500"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(XMarkIcon), { class: "h-6 w-6" }, null, _parent5, _scopeId4));
                              _push5(`</button></div><form class="space-y-6"${_scopeId4}><div${_scopeId4}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId4}> Question </label><input${ssrRenderAttr("value", form.question)} type="text" required placeholder="Ex: Quels sont vos d\xE9lais de livraison ?" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"${_scopeId4}></div><div${_scopeId4}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId4}> R\xE9ponse </label><textarea rows="4" required placeholder="R\xE9ponse d\xE9taill\xE9e \xE0 la question..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"${_scopeId4}>${ssrInterpolate(form.answer)}</textarea></div><div${_scopeId4}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId4}> Cat\xE9gorie </label><select required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"${_scopeId4}><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "") : ssrLooseEqual(form.category, "")) ? " selected" : ""}${_scopeId4}>S\xE9lectionner une cat\xE9gorie</option><option value="products"${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "products") : ssrLooseEqual(form.category, "products")) ? " selected" : ""}${_scopeId4}>Produits</option><option value="shipping"${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "shipping") : ssrLooseEqual(form.category, "shipping")) ? " selected" : ""}${_scopeId4}>Livraison</option><option value="payment"${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "payment") : ssrLooseEqual(form.category, "payment")) ? " selected" : ""}${_scopeId4}>Paiement</option><option value="policies"${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "policies") : ssrLooseEqual(form.category, "policies")) ? " selected" : ""}${_scopeId4}>Politiques</option><option value="support"${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "support") : ssrLooseEqual(form.category, "support")) ? " selected" : ""}${_scopeId4}>Support</option></select></div><div class="flex justify-end space-x-3 pt-6 border-t border-gray-200"${_scopeId4}><button type="button" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"${_scopeId4}> Annuler </button><button type="submit"${ssrIncludeBooleanAttr(!form.question || !form.answer || !form.category) ? " disabled" : ""} class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"${_scopeId4}>${ssrInterpolate(_ctx.faq ? "Modifier" : "Ajouter")}</button></div></form></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "bg-white px-6 py-6" }, [
                                  createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                    createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(_ctx.faq ? "Modifier la FAQ" : "Ajouter une FAQ"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("button", {
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "rounded-md text-gray-400 hover:text-gray-500"
                                    }, [
                                      createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                    ], 8, ["onClick"])
                                  ]),
                                  createVNode("form", {
                                    onSubmit: withModifiers(handleSubmit, ["prevent"]),
                                    class: "space-y-6"
                                  }, [
                                    createVNode("div", null, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Question "),
                                      withDirectives(createVNode("input", {
                                        "onUpdate:modelValue": ($event) => form.question = $event,
                                        type: "text",
                                        required: "",
                                        placeholder: "Ex: Quels sont vos d\xE9lais de livraison ?",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelText, form.question]
                                      ])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " R\xE9ponse "),
                                      withDirectives(createVNode("textarea", {
                                        "onUpdate:modelValue": ($event) => form.answer = $event,
                                        rows: "4",
                                        required: "",
                                        placeholder: "R\xE9ponse d\xE9taill\xE9e \xE0 la question...",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelText, form.answer]
                                      ])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Cat\xE9gorie "),
                                      withDirectives(createVNode("select", {
                                        "onUpdate:modelValue": ($event) => form.category = $event,
                                        required: "",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                      }, [
                                        createVNode("option", { value: "" }, "S\xE9lectionner une cat\xE9gorie"),
                                        createVNode("option", { value: "products" }, "Produits"),
                                        createVNode("option", { value: "shipping" }, "Livraison"),
                                        createVNode("option", { value: "payment" }, "Paiement"),
                                        createVNode("option", { value: "policies" }, "Politiques"),
                                        createVNode("option", { value: "support" }, "Support")
                                      ], 8, ["onUpdate:modelValue"]), [
                                        [vModelSelect, form.category]
                                      ])
                                    ]),
                                    createVNode("div", { class: "flex justify-end space-x-3 pt-6 border-t border-gray-200" }, [
                                      createVNode("button", {
                                        type: "button",
                                        onClick: ($event) => _ctx.$emit("close"),
                                        class: "px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                      }, " Annuler ", 8, ["onClick"]),
                                      createVNode("button", {
                                        type: "submit",
                                        disabled: !form.question || !form.answer || !form.category,
                                        class: "px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                      }, toDisplayString(_ctx.faq ? "Modifier" : "Ajouter"), 9, ["disabled"])
                                    ])
                                  ], 32)
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "bg-white px-6 py-6" }, [
                                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                  createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(_ctx.faq ? "Modifier la FAQ" : "Ajouter une FAQ"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("button", {
                                    onClick: ($event) => _ctx.$emit("close"),
                                    class: "rounded-md text-gray-400 hover:text-gray-500"
                                  }, [
                                    createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                  ], 8, ["onClick"])
                                ]),
                                createVNode("form", {
                                  onSubmit: withModifiers(handleSubmit, ["prevent"]),
                                  class: "space-y-6"
                                }, [
                                  createVNode("div", null, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Question "),
                                    withDirectives(createVNode("input", {
                                      "onUpdate:modelValue": ($event) => form.question = $event,
                                      type: "text",
                                      required: "",
                                      placeholder: "Ex: Quels sont vos d\xE9lais de livraison ?",
                                      class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelText, form.question]
                                    ])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " R\xE9ponse "),
                                    withDirectives(createVNode("textarea", {
                                      "onUpdate:modelValue": ($event) => form.answer = $event,
                                      rows: "4",
                                      required: "",
                                      placeholder: "R\xE9ponse d\xE9taill\xE9e \xE0 la question...",
                                      class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelText, form.answer]
                                    ])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Cat\xE9gorie "),
                                    withDirectives(createVNode("select", {
                                      "onUpdate:modelValue": ($event) => form.category = $event,
                                      required: "",
                                      class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    }, [
                                      createVNode("option", { value: "" }, "S\xE9lectionner une cat\xE9gorie"),
                                      createVNode("option", { value: "products" }, "Produits"),
                                      createVNode("option", { value: "shipping" }, "Livraison"),
                                      createVNode("option", { value: "payment" }, "Paiement"),
                                      createVNode("option", { value: "policies" }, "Politiques"),
                                      createVNode("option", { value: "support" }, "Support")
                                    ], 8, ["onUpdate:modelValue"]), [
                                      [vModelSelect, form.category]
                                    ])
                                  ]),
                                  createVNode("div", { class: "flex justify-end space-x-3 pt-6 border-t border-gray-200" }, [
                                    createVNode("button", {
                                      type: "button",
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    }, " Annuler ", 8, ["onClick"]),
                                    createVNode("button", {
                                      type: "submit",
                                      disabled: !form.question || !form.answer || !form.category,
                                      class: "px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                    }, toDisplayString(_ctx.faq ? "Modifier" : "Ajouter"), 9, ["disabled"])
                                  ])
                                ], 32)
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
                            createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "bg-white px-6 py-6" }, [
                                  createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                    createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(_ctx.faq ? "Modifier la FAQ" : "Ajouter une FAQ"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("button", {
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "rounded-md text-gray-400 hover:text-gray-500"
                                    }, [
                                      createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                    ], 8, ["onClick"])
                                  ]),
                                  createVNode("form", {
                                    onSubmit: withModifiers(handleSubmit, ["prevent"]),
                                    class: "space-y-6"
                                  }, [
                                    createVNode("div", null, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Question "),
                                      withDirectives(createVNode("input", {
                                        "onUpdate:modelValue": ($event) => form.question = $event,
                                        type: "text",
                                        required: "",
                                        placeholder: "Ex: Quels sont vos d\xE9lais de livraison ?",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelText, form.question]
                                      ])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " R\xE9ponse "),
                                      withDirectives(createVNode("textarea", {
                                        "onUpdate:modelValue": ($event) => form.answer = $event,
                                        rows: "4",
                                        required: "",
                                        placeholder: "R\xE9ponse d\xE9taill\xE9e \xE0 la question...",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelText, form.answer]
                                      ])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Cat\xE9gorie "),
                                      withDirectives(createVNode("select", {
                                        "onUpdate:modelValue": ($event) => form.category = $event,
                                        required: "",
                                        class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                      }, [
                                        createVNode("option", { value: "" }, "S\xE9lectionner une cat\xE9gorie"),
                                        createVNode("option", { value: "products" }, "Produits"),
                                        createVNode("option", { value: "shipping" }, "Livraison"),
                                        createVNode("option", { value: "payment" }, "Paiement"),
                                        createVNode("option", { value: "policies" }, "Politiques"),
                                        createVNode("option", { value: "support" }, "Support")
                                      ], 8, ["onUpdate:modelValue"]), [
                                        [vModelSelect, form.category]
                                      ])
                                    ]),
                                    createVNode("div", { class: "flex justify-end space-x-3 pt-6 border-t border-gray-200" }, [
                                      createVNode("button", {
                                        type: "button",
                                        onClick: ($event) => _ctx.$emit("close"),
                                        class: "px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                      }, " Annuler ", 8, ["onClick"]),
                                      createVNode("button", {
                                        type: "submit",
                                        disabled: !form.question || !form.answer || !form.category,
                                        class: "px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                      }, toDisplayString(_ctx.faq ? "Modifier" : "Ajouter"), 9, ["disabled"])
                                    ])
                                  ], 32)
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
                          createVNode(unref(Ge), { class: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "bg-white px-6 py-6" }, [
                                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                                  createVNode(unref(Ve), { class: "text-lg font-semibold text-gray-900" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(_ctx.faq ? "Modifier la FAQ" : "Ajouter une FAQ"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("button", {
                                    onClick: ($event) => _ctx.$emit("close"),
                                    class: "rounded-md text-gray-400 hover:text-gray-500"
                                  }, [
                                    createVNode(unref(XMarkIcon), { class: "h-6 w-6" })
                                  ], 8, ["onClick"])
                                ]),
                                createVNode("form", {
                                  onSubmit: withModifiers(handleSubmit, ["prevent"]),
                                  class: "space-y-6"
                                }, [
                                  createVNode("div", null, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Question "),
                                    withDirectives(createVNode("input", {
                                      "onUpdate:modelValue": ($event) => form.question = $event,
                                      type: "text",
                                      required: "",
                                      placeholder: "Ex: Quels sont vos d\xE9lais de livraison ?",
                                      class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelText, form.question]
                                    ])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " R\xE9ponse "),
                                    withDirectives(createVNode("textarea", {
                                      "onUpdate:modelValue": ($event) => form.answer = $event,
                                      rows: "4",
                                      required: "",
                                      placeholder: "R\xE9ponse d\xE9taill\xE9e \xE0 la question...",
                                      class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelText, form.answer]
                                    ])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Cat\xE9gorie "),
                                    withDirectives(createVNode("select", {
                                      "onUpdate:modelValue": ($event) => form.category = $event,
                                      required: "",
                                      class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    }, [
                                      createVNode("option", { value: "" }, "S\xE9lectionner une cat\xE9gorie"),
                                      createVNode("option", { value: "products" }, "Produits"),
                                      createVNode("option", { value: "shipping" }, "Livraison"),
                                      createVNode("option", { value: "payment" }, "Paiement"),
                                      createVNode("option", { value: "policies" }, "Politiques"),
                                      createVNode("option", { value: "support" }, "Support")
                                    ], 8, ["onUpdate:modelValue"]), [
                                      [vModelSelect, form.category]
                                    ])
                                  ]),
                                  createVNode("div", { class: "flex justify-end space-x-3 pt-6 border-t border-gray-200" }, [
                                    createVNode("button", {
                                      type: "button",
                                      onClick: ($event) => _ctx.$emit("close"),
                                      class: "px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    }, " Annuler ", 8, ["onClick"]),
                                    createVNode("button", {
                                      type: "submit",
                                      disabled: !form.question || !form.answer || !form.category,
                                      class: "px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                    }, toDisplayString(_ctx.faq ? "Modifier" : "Ajouter"), 9, ["disabled"])
                                  ])
                                ], 32)
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/FAQModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "knowledge",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const activeTab = ref("documents");
    const showUploadModal = ref(false);
    const showFAQModal = ref(false);
    const selectedFAQ = ref(null);
    const filters = reactive({
      documentType: "",
      category: "",
      search: ""
    });
    const stats = ref({
      totalDocuments: 12,
      totalFAQ: 18,
      totalCategories: 4,
      lastUpdate: /* @__PURE__ */ new Date("2025-01-14T09:30:00")
    });
    const tabs = computed(() => [
      {
        id: "documents",
        name: "Documents",
        icon: DocumentTextIcon,
        count: stats.value.totalDocuments
      },
      {
        id: "faq",
        name: "FAQ",
        icon: ChatBubbleBottomCenterTextIcon,
        count: stats.value.totalFAQ
      },
      {
        id: "training",
        name: "Entra\xEEnement IA",
        icon: CpuChipIcon,
        count: null
      }
    ]);
    const documents = ref([
      {
        id: "1",
        name: "Catalogue produits 2025",
        type: "pdf",
        size: 25e5,
        category: "products",
        description: "Catalogue complet de tous nos produits avec descriptions d\xE9taill\xE9es et prix.",
        createdAt: /* @__PURE__ */ new Date("2025-01-10T10:00:00"),
        status: "processed"
      },
      {
        id: "2",
        name: "Politique de retour",
        type: "docx",
        size: 15e4,
        category: "policies",
        description: "Conditions de retour et d'\xE9change des produits.",
        createdAt: /* @__PURE__ */ new Date("2025-01-08T14:30:00"),
        status: "processed"
      },
      {
        id: "3",
        name: "Guide des tarifs de livraison",
        type: "csv",
        size: 45e3,
        category: "shipping",
        description: "Tarifs de livraison par zone g\xE9ographique et poids.",
        createdAt: /* @__PURE__ */ new Date("2025-01-05T09:15:00"),
        status: "processing"
      }
    ]);
    const faqs = ref([
      {
        id: "1",
        question: "Quels sont vos d\xE9lais de livraison ?",
        answer: "Nos d\xE9lais de livraison varient selon votre zone : 24-48h pour Abidjan, 3-5 jours pour l'int\xE9rieur du pays.",
        category: "shipping",
        createdAt: /* @__PURE__ */ new Date("2025-01-12T11:00:00")
      },
      {
        id: "2",
        question: "Acceptez-vous le paiement Mobile Money ?",
        answer: "Oui, nous acceptons Orange Money, MTN Money et Moov Money pour tous vos achats.",
        category: "payment",
        createdAt: /* @__PURE__ */ new Date("2025-01-10T09:30:00")
      },
      {
        id: "3",
        question: "Puis-je retourner un produit si je ne suis pas satisfait ?",
        answer: "Oui, vous avez 14 jours pour retourner un produit en parfait \xE9tat avec son emballage d'origine.",
        category: "policies",
        createdAt: /* @__PURE__ */ new Date("2025-01-08T15:20:00")
      }
    ]);
    const filteredDocuments = computed(() => {
      let filtered = documents.value;
      if (filters.documentType) {
        filtered = filtered.filter((doc) => doc.type === filters.documentType);
      }
      if (filters.category) {
        filtered = filtered.filter((doc) => doc.category === filters.category);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          (doc) => doc.name.toLowerCase().includes(search) || doc.description.toLowerCase().includes(search)
        );
      }
      return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });
    const getDocumentIcon = (type) => {
      return DocumentIcon;
    };
    const getDocumentIconBg = (type) => {
      const colors = {
        pdf: "bg-red-500",
        docx: "bg-blue-500",
        csv: "bg-green-500",
        txt: "bg-gray-500"
      };
      return colors[type] || "bg-gray-500";
    };
    const getCategoryText = (category) => {
      const categories = {
        products: "Produits",
        policies: "Politiques",
        shipping: "Livraison",
        payment: "Paiement"
      };
      return categories[category] || "Autre";
    };
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };
    const formatRelativeTime = (date) => {
      return formatDistanceToNow(date, { locale: fr, addSuffix: true });
    };
    const formatDate = (date) => {
      return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(date);
    };
    const closeFAQModal = () => {
      showFAQModal.value = false;
      selectedFAQ.value = null;
    };
    const handleFileUpload = (files) => {
      console.log("Uploading files:", files);
      showUploadModal.value = false;
      const showNotification = inject("showNotification");
      if (showNotification) {
        showNotification("Fichier(s) upload\xE9(s) avec succ\xE8s !", "success");
      }
    };
    const handleFAQSave = (faqData) => {
      if (selectedFAQ.value && selectedFAQ.value.id) {
        const index = faqs.value.findIndex((f) => {
          var _a;
          return f.id === ((_a = selectedFAQ.value) == null ? void 0 : _a.id);
        });
        if (index !== -1) {
          faqs.value[index] = { ...faqs.value[index], ...faqData };
        }
      } else {
        const newFAQ = {
          id: Date.now().toString(),
          ...faqData,
          createdAt: /* @__PURE__ */ new Date()
        };
        faqs.value.unshift(newFAQ);
        stats.value.totalFAQ++;
      }
      closeFAQModal();
      const showNotification = inject("showNotification");
      if (showNotification) {
        showNotification("FAQ sauvegard\xE9e avec succ\xE8s !", "success");
      }
    };
    useSeoMeta({
      title: "Base de connaissance - ChatSeller",
      description: "G\xE9rez le contenu qui alimente votre Agent IA"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UploadModal = _sfc_main$2;
      const _component_FAQModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))} data-v-d5d666a0><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm" data-v-d5d666a0><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4" data-v-d5d666a0><div data-v-d5d666a0><h1 class="text-2xl font-bold text-gray-900" data-v-d5d666a0>Base de connaissance</h1><p class="text-sm text-gray-500 mt-1" data-v-d5d666a0> G\xE9rez le contenu qui permet \xE0 votre Agent IA de r\xE9pondre intelligemment aux questions des visiteurs </p></div><div class="flex items-center gap-3" data-v-d5d666a0><button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-d5d666a0>`);
      _push(ssrRenderComponent(unref(ArrowPathIcon), {
        class: ["h-4 w-4 mr-2", unref(loading) && "animate-spin"]
      }, null, _parent));
      _push(` Actualiser </button><button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200" data-v-d5d666a0>`);
      _push(ssrRenderComponent(unref(DocumentPlusIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
      _push(` Ajouter du contenu </button></div></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-6" data-v-d5d666a0><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm" data-v-d5d666a0><div class="flex items-center" data-v-d5d666a0><div class="flex-shrink-0" data-v-d5d666a0><div class="p-3 bg-blue-50 rounded-xl" data-v-d5d666a0>`);
      _push(ssrRenderComponent(unref(DocumentTextIcon), { class: "h-6 w-6 text-blue-600" }, null, _parent));
      _push(`</div></div><div class="ml-4" data-v-d5d666a0><p class="text-sm font-medium text-gray-600" data-v-d5d666a0>Documents</p><p class="text-2xl font-bold text-gray-900" data-v-d5d666a0>${ssrInterpolate(unref(stats).totalDocuments)}</p></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm" data-v-d5d666a0><div class="flex items-center" data-v-d5d666a0><div class="flex-shrink-0" data-v-d5d666a0><div class="p-3 bg-green-50 rounded-xl" data-v-d5d666a0>`);
      _push(ssrRenderComponent(unref(ChatBubbleBottomCenterTextIcon), { class: "h-6 w-6 text-green-600" }, null, _parent));
      _push(`</div></div><div class="ml-4" data-v-d5d666a0><p class="text-sm font-medium text-gray-600" data-v-d5d666a0>FAQ</p><p class="text-2xl font-bold text-gray-900" data-v-d5d666a0>${ssrInterpolate(unref(stats).totalFAQ)}</p></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm" data-v-d5d666a0><div class="flex items-center" data-v-d5d666a0><div class="flex-shrink-0" data-v-d5d666a0><div class="p-3 bg-yellow-50 rounded-xl" data-v-d5d666a0>`);
      _push(ssrRenderComponent(unref(TagIcon), { class: "h-6 w-6 text-yellow-600" }, null, _parent));
      _push(`</div></div><div class="ml-4" data-v-d5d666a0><p class="text-sm font-medium text-gray-600" data-v-d5d666a0>Cat\xE9gories</p><p class="text-2xl font-bold text-gray-900" data-v-d5d666a0>${ssrInterpolate(unref(stats).totalCategories)}</p></div></div></div><div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm" data-v-d5d666a0><div class="flex items-center" data-v-d5d666a0><div class="flex-shrink-0" data-v-d5d666a0><div class="p-3 bg-purple-50 rounded-xl" data-v-d5d666a0>`);
      _push(ssrRenderComponent(unref(ClockIcon), { class: "h-6 w-6 text-purple-600" }, null, _parent));
      _push(`</div></div><div class="ml-4" data-v-d5d666a0><p class="text-sm font-medium text-gray-600" data-v-d5d666a0>Derni\xE8re MAJ</p><p class="text-lg font-bold text-gray-900" data-v-d5d666a0>${ssrInterpolate(formatRelativeTime(unref(stats).lastUpdate))}</p></div></div></div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm" data-v-d5d666a0><div class="border-b border-gray-200" data-v-d5d666a0><nav class="-mb-px flex px-6" data-v-d5d666a0><!--[-->`);
      ssrRenderList(unref(tabs), (tab) => {
        _push(`<button class="${ssrRenderClass([
          unref(activeTab) === tab.id ? "border-blue-500 text-blue-600 bg-blue-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
          "flex items-center py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg"
        ])}" data-v-d5d666a0>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "h-5 w-5 mr-2" }, null), _parent);
        _push(` ${ssrInterpolate(tab.name)} `);
        if (tab.count) {
          _push(`<span class="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium" data-v-d5d666a0>${ssrInterpolate(tab.count)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></nav></div><div class="p-6" data-v-d5d666a0>`);
      if (unref(activeTab) === "documents") {
        _push(`<div class="space-y-6" data-v-d5d666a0><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-v-d5d666a0><div class="flex flex-wrap gap-4" data-v-d5d666a0><select class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" data-v-d5d666a0><option value="" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).documentType) ? ssrLooseContain(unref(filters).documentType, "") : ssrLooseEqual(unref(filters).documentType, "")) ? " selected" : ""}>Tous les types</option><option value="pdf" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).documentType) ? ssrLooseContain(unref(filters).documentType, "pdf") : ssrLooseEqual(unref(filters).documentType, "pdf")) ? " selected" : ""}>PDF</option><option value="docx" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).documentType) ? ssrLooseContain(unref(filters).documentType, "docx") : ssrLooseEqual(unref(filters).documentType, "docx")) ? " selected" : ""}>Word</option><option value="csv" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).documentType) ? ssrLooseContain(unref(filters).documentType, "csv") : ssrLooseEqual(unref(filters).documentType, "csv")) ? " selected" : ""}>CSV</option><option value="txt" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).documentType) ? ssrLooseContain(unref(filters).documentType, "txt") : ssrLooseEqual(unref(filters).documentType, "txt")) ? " selected" : ""}>Texte</option></select><select class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" data-v-d5d666a0><option value="" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).category) ? ssrLooseContain(unref(filters).category, "") : ssrLooseEqual(unref(filters).category, "")) ? " selected" : ""}>Toutes les cat\xE9gories</option><option value="products" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).category) ? ssrLooseContain(unref(filters).category, "products") : ssrLooseEqual(unref(filters).category, "products")) ? " selected" : ""}>Produits</option><option value="policies" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).category) ? ssrLooseContain(unref(filters).category, "policies") : ssrLooseEqual(unref(filters).category, "policies")) ? " selected" : ""}>Politiques</option><option value="shipping" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).category) ? ssrLooseContain(unref(filters).category, "shipping") : ssrLooseEqual(unref(filters).category, "shipping")) ? " selected" : ""}>Livraison</option><option value="payment" data-v-d5d666a0${ssrIncludeBooleanAttr(Array.isArray(unref(filters).category) ? ssrLooseContain(unref(filters).category, "payment") : ssrLooseEqual(unref(filters).category, "payment")) ? " selected" : ""}>Paiement</option></select></div><div class="relative" data-v-d5d666a0>`);
        _push(ssrRenderComponent(unref(MagnifyingGlassIcon), { class: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }, null, _parent));
        _push(`<input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="Rechercher un document..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64" data-v-d5d666a0></div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-v-d5d666a0><!--[-->`);
        ssrRenderList(unref(filteredDocuments), (document) => {
          _push(`<div class="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-gray-200 group" data-v-d5d666a0><div class="flex items-center justify-between mb-4" data-v-d5d666a0><div class="flex items-center space-x-3" data-v-d5d666a0><div class="${ssrRenderClass([getDocumentIconBg(document.type), "h-10 w-10 rounded-lg flex items-center justify-center"])}" data-v-d5d666a0>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getDocumentIcon(document.type)), { class: "h-6 w-6 text-white" }, null), _parent);
          _push(`</div><div class="flex-1 min-w-0" data-v-d5d666a0><h3 class="text-sm font-medium text-gray-900 truncate" data-v-d5d666a0>${ssrInterpolate(document.name)}</h3><p class="text-xs text-gray-500" data-v-d5d666a0>${ssrInterpolate(document.type.toUpperCase())} \u2022 ${ssrInterpolate(formatFileSize(document.size))}</p></div></div><div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" data-v-d5d666a0><button class="p-1 text-gray-400 hover:text-gray-600 rounded" data-v-d5d666a0>`);
          _push(ssrRenderComponent(unref(PencilIcon), { class: "h-4 w-4" }, null, _parent));
          _push(`</button><button class="p-1 text-gray-400 hover:text-red-600 rounded" data-v-d5d666a0>`);
          _push(ssrRenderComponent(unref(TrashIcon), { class: "h-4 w-4" }, null, _parent));
          _push(`</button></div></div><div class="space-y-3" data-v-d5d666a0><span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800" data-v-d5d666a0>${ssrInterpolate(getCategoryText(document.category))}</span><p class="text-sm text-gray-600 line-clamp-3" data-v-d5d666a0>${ssrInterpolate(document.description)}</p><p class="text-xs text-gray-500" data-v-d5d666a0> Ajout\xE9 le ${ssrInterpolate(formatDate(document.createdAt))}</p></div></div>`);
        });
        _push(`<!--]--><div class="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group" data-v-d5d666a0><div class="text-center" data-v-d5d666a0>`);
        _push(ssrRenderComponent(unref(DocumentPlusIcon), { class: "h-12 w-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors duration-200" }, null, _parent));
        _push(`<h3 class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200" data-v-d5d666a0> Ajouter un document </h3><p class="text-xs text-gray-500 mt-2" data-v-d5d666a0> PDF, Word, CSV ou texte </p></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "faq") {
        _push(`<div class="space-y-6" data-v-d5d666a0><div class="flex justify-between items-center" data-v-d5d666a0><h3 class="text-lg font-medium text-gray-900" data-v-d5d666a0>Questions fr\xE9quentes</h3><button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200" data-v-d5d666a0>`);
        _push(ssrRenderComponent(unref(PlusIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
        _push(` Ajouter une FAQ </button></div><div class="space-y-4" data-v-d5d666a0><!--[-->`);
        ssrRenderList(unref(faqs), (faq) => {
          _push(`<div class="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-sm transition-all duration-200" data-v-d5d666a0><div class="flex items-start justify-between" data-v-d5d666a0><div class="flex-1" data-v-d5d666a0><h4 class="text-sm font-medium text-gray-900 mb-2" data-v-d5d666a0>${ssrInterpolate(faq.question)}</h4><p class="text-sm text-gray-600 mb-3" data-v-d5d666a0>${ssrInterpolate(faq.answer)}</p><div class="flex items-center space-x-4 text-xs text-gray-500" data-v-d5d666a0><span class="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium" data-v-d5d666a0>${ssrInterpolate(getCategoryText(faq.category))}</span><span data-v-d5d666a0>${ssrInterpolate(formatDate(faq.createdAt))}</span></div></div><div class="flex items-center space-x-2 ml-4" data-v-d5d666a0><button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors duration-200" data-v-d5d666a0>`);
          _push(ssrRenderComponent(unref(PencilIcon), { class: "h-4 w-4" }, null, _parent));
          _push(`</button><button class="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200" data-v-d5d666a0>`);
          _push(ssrRenderComponent(unref(TrashIcon), { class: "h-4 w-4" }, null, _parent));
          _push(`</button></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "training") {
        _push(`<div class="space-y-6" data-v-d5d666a0><div class="text-center py-12" data-v-d5d666a0>`);
        _push(ssrRenderComponent(unref(CpuChipIcon), { class: "h-16 w-16 text-gray-300 mx-auto mb-4" }, null, _parent));
        _push(`<h3 class="text-lg font-medium text-gray-900 mb-2" data-v-d5d666a0>Entra\xEEnement de l&#39;IA</h3><p class="text-sm text-gray-600 max-w-md mx-auto mb-6" data-v-d5d666a0> L&#39;IA s&#39;entra\xEEne automatiquement avec votre contenu. Vous pouvez voir ici les performances et optimiser les r\xE9ponses. </p><div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto" data-v-d5d666a0><div class="bg-blue-50 rounded-xl p-6" data-v-d5d666a0><h4 class="text-lg font-bold text-blue-900" data-v-d5d666a0>94%</h4><p class="text-sm text-blue-600" data-v-d5d666a0>Pr\xE9cision des r\xE9ponses</p></div><div class="bg-green-50 rounded-xl p-6" data-v-d5d666a0><h4 class="text-lg font-bold text-green-900" data-v-d5d666a0>1,247</h4><p class="text-sm text-green-600" data-v-d5d666a0>Phrases analys\xE9es</p></div><div class="bg-purple-50 rounded-xl p-6" data-v-d5d666a0><h4 class="text-lg font-bold text-purple-900" data-v-d5d666a0>12</h4><p class="text-sm text-purple-600" data-v-d5d666a0>Cat\xE9gories d\xE9tect\xE9es</p></div></div><div class="flex justify-center space-x-4" data-v-d5d666a0><button class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200" data-v-d5d666a0>`);
        _push(ssrRenderComponent(unref(ChartBarIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
        _push(` Analyser les performances </button><button class="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors duration-200" data-v-d5d666a0>`);
        _push(ssrRenderComponent(unref(ArrowPathIcon), { class: "h-4 w-4 mr-2" }, null, _parent));
        _push(` R\xE9entra\xEEner le mod\xE8le </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_UploadModal, {
        "is-open": unref(showUploadModal),
        onClose: ($event) => showUploadModal.value = false,
        onUpload: handleFileUpload
      }, null, _parent));
      _push(ssrRenderComponent(_component_FAQModal, {
        "is-open": unref(showFAQModal),
        faq: unref(selectedFAQ),
        onClose: closeFAQModal,
        onSave: handleFAQSave
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/knowledge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const knowledge = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d5d666a0"]]);

export { knowledge as default };
//# sourceMappingURL=knowledge-AEQ44oC2.mjs.map
