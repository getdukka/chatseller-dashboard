import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { g as getCurrentUser } from '../../../_/database.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';
import 'jsonwebtoken';
import 'bcrypt';

const me_get = defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event);
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          company: user.company,
          role: user.role,
          emailVerified: user.email_verified,
          createdAt: user.created_at,
          lastLoginAt: user.last_login_at
        }
      }
    };
  } catch (error) {
    console.error("Erreur me API:", error);
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || "Token invalide"
    });
  }
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
