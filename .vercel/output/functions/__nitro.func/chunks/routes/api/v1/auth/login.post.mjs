import { d as defineEventHandler, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("\u{1F510} Tentative de login:", body);
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email et mot de passe requis"
    });
  }
  if (body.email === "admin@chatseller.app" && body.password === "password123") {
    const token = "chatseller-token-" + Date.now();
    return {
      success: true,
      data: {
        token,
        user: {
          id: "1",
          email: body.email,
          name: "Administrateur ChatSeller",
          shopId: "1"
        }
      }
    };
  }
  throw createError({
    statusCode: 401,
    statusMessage: "Identifiants invalides"
  });
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
