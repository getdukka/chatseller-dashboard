import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col" }, _attrs))} data-v-6a00b938><div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8" data-v-6a00b938><div class="sm:mx-auto sm:w-full sm:max-w-md" data-v-6a00b938>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div><footer class="py-6" data-v-6a00b938><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-6a00b938><div class="flex justify-center items-center space-x-6 text-sm text-gray-500" data-v-6a00b938><a href="https://chatseller.app/privacy" class="hover:text-gray-700 transition-colors" target="_blank" data-v-6a00b938> Confidentialit\xE9 </a><a href="https://chatseller.app/terms" class="hover:text-gray-700 transition-colors" target="_blank" data-v-6a00b938> Conditions </a><a href="https://chatseller.app/support" class="hover:text-gray-700 transition-colors" target="_blank" data-v-6a00b938> Support </a></div><div class="mt-2 text-center text-xs text-gray-400" data-v-6a00b938> \xA9 2025 ChatSeller. Tous droits r\xE9serv\xE9s. </div></div></footer></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/auth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const auth = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-6a00b938"]]);

export { auth as default };
//# sourceMappingURL=auth-DokX5UTA.mjs.map
