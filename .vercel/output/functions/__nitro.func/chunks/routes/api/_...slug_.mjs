import { d as defineEventHandler, g as getRouterParam, a as getMethod, r as readBody, b as getQuery, c as createError, e as getHeader } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const ____slug_ = defineEventHandler(async (event) => {
  var _a;
  const url = getRouterParam(event, "slug") || "";
  const method = getMethod(event);
  const body = method !== "GET" ? await readBody(event) : void 0;
  const query = getQuery(event);
  if (url.startsWith("auth/") || url.startsWith("v1/auth/")) {
    throw createError({
      statusCode: 404,
      statusMessage: `Route ${method}:/${url} not found - should be handled locally`
    });
  }
  const apiBaseUrl = "https://chatseller-api-production.up.railway.app";
  let targetUrl = `${apiBaseUrl}/${url}`;
  if (Object.keys(query).length > 0) {
    const queryString = new URLSearchParams(query).toString();
    targetUrl += `?${queryString}`;
  }
  console.log(`\u{1F504} Proxy: ${method} ${targetUrl}`);
  try {
    const headers = {};
    const authHeader = getHeader(event, "authorization");
    if (authHeader) {
      headers.authorization = authHeader;
    }
    headers["content-type"] = "application/json";
    const response = await $fetch(targetUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : void 0
    });
    console.log(`\u2705 Proxy success: ${method} ${targetUrl}`);
    return response;
  } catch (error) {
    console.error(`\u274C Proxy error: ${method} ${targetUrl}`, error);
    throw createError({
      statusCode: ((_a = error.response) == null ? void 0 : _a.status) || 500,
      statusMessage: error.message || "Erreur du proxy API"
    });
  }
});

export { ____slug_ as default };
//# sourceMappingURL=_...slug_.mjs.map
