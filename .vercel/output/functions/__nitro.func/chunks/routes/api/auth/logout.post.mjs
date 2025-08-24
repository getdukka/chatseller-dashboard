import { d as defineEventHandler, f as getCookie, e as getHeader, h as deleteCookie } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const logout_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const token = getCookie(event, "auth-token") || ((_a = getHeader(event, "authorization")) == null ? void 0 : _a.replace("Bearer ", ""));
    deleteCookie(event, "auth-token");
    return {
      success: true,
      message: "D\xE9connexion r\xE9ussie"
    };
  } catch (error) {
    console.error("Erreur logout API:", error);
    return {
      success: true,
      message: "D\xE9connexion r\xE9ussie"
    };
  }
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
