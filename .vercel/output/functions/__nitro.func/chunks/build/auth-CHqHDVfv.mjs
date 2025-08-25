import { g as defineNuxtRouteMiddleware } from './server.mjs';
import 'vue';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@heroicons/vue/24/outline';

const auth = defineNuxtRouteMiddleware(async (to, from) => {
  console.log("\u{1F512} [AUTH] Middleware auth: V\xE9rification pour route:", to.path);
  {
    console.log("\u23ED\uFE0F [AUTH] C\xF4t\xE9 serveur, passage...");
    return;
  }
});

export { auth as default };
//# sourceMappingURL=auth-CHqHDVfv.mjs.map
