import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const test_get = defineEventHandler(async (event) => {
  console.log("\u{1F680} Test endpoint appel\xE9");
  return {
    success: true,
    message: "ChatSeller API endpoints fonctionnent !",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: "production"
  };
});

export { test_get as default };
//# sourceMappingURL=test.get.mjs.map
