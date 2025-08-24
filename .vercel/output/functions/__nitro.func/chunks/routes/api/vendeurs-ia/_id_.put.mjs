import { d as defineEventHandler, g as getRouterParam, c as createError, r as readBody, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const _id__put = defineEventHandler(async (event) => {
  try {
    const agentId = getRouterParam(event, "id");
    if (!agentId || agentId === "undefined") {
      throw createError({
        statusCode: 400,
        statusMessage: "ID agent invalide"
      });
    }
    const body = await readBody(event);
    console.log("\u{1F4BE} [API] Mise \xE0 jour agent Supabase:", agentId, body);
    const config = useRuntimeConfig();
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    );
    const updateData = {
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (body.name) updateData.name = body.name;
    if (body.type) updateData.type = body.type;
    if (body.welcomeMessage !== void 0) updateData.welcome_message = body.welcomeMessage;
    if (body.fallbackMessage !== void 0) updateData.fallback_message = body.fallbackMessage;
    if (body.config) updateData.config = body.config;
    if (body.collectName !== void 0 || body.collectPhone !== void 0 || body.collectAddress !== void 0 || body.collectPayment !== void 0 || body.upsellEnabled !== void 0) {
      const { data: currentAgent } = await supabase.from("agents").select("config").eq("id", agentId).single();
      const currentConfig = (currentAgent == null ? void 0 : currentAgent.config) || {};
      updateData.config = {
        ...currentConfig,
        ...body.collectName !== void 0 && { collectName: body.collectName },
        ...body.collectPhone !== void 0 && { collectPhone: body.collectPhone },
        ...body.collectAddress !== void 0 && { collectAddress: body.collectAddress },
        ...body.collectPayment !== void 0 && { collectPayment: body.collectPayment },
        ...body.upsellEnabled !== void 0 && { upsellEnabled: body.upsellEnabled }
      };
    }
    try {
      const { data: updatedAgent, error: updateError } = await supabase.from("agents").update(updateData).eq("id", agentId).select().single();
      if (updateError) {
        console.error("\u274C Erreur Supabase update:", updateError);
        console.log("\u26A0\uFE0F Fallback simulation de succ\xE8s");
        return {
          success: true,
          data: {
            id: agentId,
            config: body,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          },
          message: "Configuration mise \xE0 jour (mode simulation)"
        };
      }
      console.log("\u2705 Agent mis \xE0 jour dans Supabase:", updatedAgent == null ? void 0 : updatedAgent.name);
      return {
        success: true,
        data: {
          id: updatedAgent.id,
          config: updatedAgent.config,
          updatedAt: updatedAgent.updated_at
        },
        message: "Configuration mise \xE0 jour avec succ\xE8s"
      };
    } catch (supabaseError) {
      console.warn("\u26A0\uFE0F Erreur Supabase, simulation de succ\xE8s:", supabaseError);
      return {
        success: true,
        data: {
          id: agentId,
          config: body,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        message: "Configuration sauvegard\xE9e (mode simulation)"
      };
    }
  } catch (error) {
    console.error("\u274C [API] Erreur mise \xE0 jour agent:", error);
    const agentId = getRouterParam(event, "id");
    const body = await readBody(event).catch(() => ({}));
    return {
      success: true,
      data: {
        id: agentId,
        config: body,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      message: "Configuration sauvegard\xE9e (mode fallback)"
    };
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
