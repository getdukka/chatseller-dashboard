import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { g as getCurrentUser, b as getConversationById, d as getConversationMessages } from '../../../_/database.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event);
    const conversationId = getRouterParam(event, "id");
    if (!conversationId) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID de conversation requis"
      });
    }
    const conversation = await getConversationById(conversationId, user.id);
    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: "Conversation non trouv\xE9e"
      });
    }
    const messages = await getConversationMessages(conversationId);
    return {
      success: true,
      data: {
        conversation,
        messages
      }
    };
  } catch (error) {
    console.error("Erreur conversation detail API:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors du chargement de la conversation"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
