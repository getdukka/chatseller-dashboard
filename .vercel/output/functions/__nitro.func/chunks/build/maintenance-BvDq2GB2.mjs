import { g as defineNuxtRouteMiddleware, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
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

const maintenance = defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const isMaintenanceMode = config.public.environment === "maintenance";
  const allowedPaths = ["/maintenance", "/health", "/api"];
  const isAllowedPath = allowedPaths.some(
    (path) => to.path.startsWith(path)
  );
  if (isMaintenanceMode && !isAllowedPath) {
    console.log("\u{1F6A7} Middleware maintenance: Mode maintenance activ\xE9");
    return navigateTo("/maintenance");
  }
  if (!isMaintenanceMode && to.path === "/maintenance") {
    console.log("\u2705 Middleware maintenance: Mode maintenance d\xE9sactiv\xE9, redirection");
    return navigateTo("/");
  }
  console.log("\u2705 Middleware maintenance: Acc\xE8s autoris\xE9");
});

export { maintenance as default };
//# sourceMappingURL=maintenance-BvDq2GB2.mjs.map
