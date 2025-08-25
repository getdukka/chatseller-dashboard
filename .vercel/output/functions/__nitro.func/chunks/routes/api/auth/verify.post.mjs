import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import jwt from 'jsonwebtoken';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const verify_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { token } = body;
    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: "Token manquant"
      });
    }
    const config = useRuntimeConfig();
    const decoded = jwt.verify(token, config.jwtSecret);
    return {
      success: true,
      data: {
        valid: true,
        user: decoded
      }
    };
  } catch (error) {
    console.error("\u274C Token invalide:", error.message);
    return {
      success: false,
      data: {
        valid: false,
        error: "Token invalide ou expir\xE9"
      }
    };
  }
});

export { verify_post as default };
//# sourceMappingURL=verify.post.mjs.map
