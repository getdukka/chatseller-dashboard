import { defineComponent, reactive, ref, useSSRContext } from 'vue';
import { u as useSeoMeta } from './v3-D4nZQNuc.mjs';
import { u as useAuth } from './useAuth-CgRQXKMP.mjs';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import '@supabase/functions-js';
import '@supabase/postgrest-js';
import '@supabase/realtime-js';
import '@supabase/storage-js';
import '@supabase/node-fetch';
import '@supabase/auth-js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "reset-password",
  setup(__props) {
    useSeoMeta({
      title: "R\xE9initialisation du mot de passe - ChatSeller",
      description: "R\xE9initialisez votre mot de passe ChatSeller"
    });
    useAuth();
    reactive({
      email: ""
    });
    reactive({
      email: ""
    });
    ref(false);
    ref("");
    ref(false);
    ref(0);
    return () => {
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reset-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=reset-password-DW-e3k5K.mjs.map
