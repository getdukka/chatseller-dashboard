import { d as defineEventHandler, c as createError } from '../../nitro/nitro.mjs';
import { g as getCurrentUser, h as getUserSettings } from '../../_/database.mjs';
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

const index_get = defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event);
    const settings = await getUserSettings(user.id);
    return {
      success: true,
      data: settings
    };
  } catch (error) {
    console.error("Erreur get settings API:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors du chargement des param\xE8tres"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
