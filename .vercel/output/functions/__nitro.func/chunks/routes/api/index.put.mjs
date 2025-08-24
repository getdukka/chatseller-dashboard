import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { g as getCurrentUser, i as validateSettings, u as updateUserSettings } from '../../_/database.mjs';
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

const index_put = defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event);
    const newSettings = await readBody(event);
    const validatedSettings = validateSettings(newSettings);
    await updateUserSettings(user.id, validatedSettings);
    return {
      success: true,
      data: validatedSettings
    };
  } catch (error) {
    console.error("Erreur update settings API:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la sauvegarde des param\xE8tres"
    });
  }
});

export { index_put as default };
//# sourceMappingURL=index.put.mjs.map
