import { defineComponent, reactive, ref, computed, useSSRContext } from 'vue';
import { u as useSeoMeta } from './v3-D4nZQNuc.mjs';
import { u as useAuth } from './useAuth-CgRQXKMP.mjs';
import { a as useRouter } from './server.mjs';
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
import 'vue/server-renderer';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  setup(__props) {
    useSeoMeta({
      title: "Inscription - ChatSeller Dashboard",
      description: "Cr\xE9ez votre compte ChatSeller et d\xE9marrez votre essai gratuit de 3 jours"
    });
    useAuth();
    useRouter();
    const form = reactive({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      website: "",
      password: "",
      acceptTerms: false
    });
    reactive({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      website: "",
      password: ""
    });
    ref(false);
    ref(false);
    ref("");
    ref(false);
    const passwordStrength = computed(() => {
      const password = form.password;
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return Math.min(strength, 4);
    });
    computed(() => {
      switch (passwordStrength.value) {
        case 0:
        case 1:
          return "Mot de passe faible";
        case 2:
          return "Mot de passe moyen";
        case 3:
          return "Mot de passe fort";
        case 4:
          return "Mot de passe tr\xE8s fort";
        default:
          return "";
      }
    });
    return () => {
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-GAodD6rz.mjs.map
