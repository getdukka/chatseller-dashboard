import { d as defineEventHandler, e as getHeader, c as createError, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import jwt from 'jsonwebtoken';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const requireAuth = (handler) => {
  return defineEventHandler(async (event) => {
    try {
      const authHeader = getHeader(event, "authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw createError({
          statusCode: 401,
          statusMessage: "Token d'authentification manquant"
        });
      }
      const token = authHeader.substring(7);
      const config = useRuntimeConfig();
      const decoded = jwt.verify(token, config.jwtSecret);
      event.context.user = decoded;
      return await handler(event);
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw createError({
        statusCode: 401,
        statusMessage: "Token invalide"
      });
    }
  });
};

export { requireAuth };
//# sourceMappingURL=middleware.mjs.map
