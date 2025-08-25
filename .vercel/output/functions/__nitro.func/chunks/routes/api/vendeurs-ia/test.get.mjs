import { d as defineEventHandler, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const test_get = defineEventHandler(async (event) => {
  console.log("\u{1F9EA} [TEST] Endpoint de test appel\xE9");
  const config = useRuntimeConfig();
  return {
    success: true,
    message: "Endpoint API fonctionnel !",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    config: {
      supabaseUrl: config.public.supabaseUrl ? "\u2705 Configur\xE9" : "\u274C Manquant",
      supabaseAnonKey: config.public.supabaseAnonKey ? "\u2705 Configur\xE9" : "\u274C Manquant"
    },
    routes: {
      testRoute: "/api/vendeurs-ia/test",
      agentRoute: "/api/vendeurs-ia/[id]",
      listRoute: "/api/vendeurs-ia/"
    }
  };
});

export { test_get as default };
//# sourceMappingURL=test.get.mjs.map
