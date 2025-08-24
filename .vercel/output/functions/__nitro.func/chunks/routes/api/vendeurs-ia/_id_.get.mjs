import { d as defineEventHandler, g as getRouterParam, c as createError, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const _id__get = defineEventHandler(async (event) => {
  try {
    const agentId = getRouterParam(event, "id");
    if (!agentId || agentId === "undefined") {
      console.error("\u274C ID agent invalide:", agentId);
      throw createError({
        statusCode: 400,
        statusMessage: "ID agent invalide"
      });
    }
    console.log("\u{1F50D} [API] R\xE9cup\xE9ration agent depuis Supabase:", agentId);
    const config = useRuntimeConfig();
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    );
    const { data: agent, error: agentError } = await supabase.from("agents").select("*").eq("id", agentId).single();
    if (agentError) {
      console.error("\u274C Erreur Supabase agent:", agentError);
      console.log("\u26A0\uFE0F Fallback vers donn\xE9es mock\xE9es");
      const mockAgent = {
        id: agentId,
        name: "Sophie - Assistante d'achat",
        type: "general",
        personality: "professional",
        description: "Assistante d'achat sp\xE9cialis\xE9e dans les produits.",
        welcome_message: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        fallback_message: "Je transmets votre question \xE0 notre \xE9quipe.",
        avatar: "https://ui-avatars.com/api/?name=Sophie&background=10B981&color=fff",
        is_active: true,
        config: {
          collectName: true,
          collectPhone: true,
          collectAddress: false,
          collectPayment: true,
          upsellEnabled: false
        },
        total_conversations: 0,
        total_conversions: 0,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      return {
        success: true,
        data: {
          agent: {
            id: mockAgent.id,
            name: mockAgent.name,
            type: mockAgent.type,
            personality: mockAgent.personality,
            description: mockAgent.description,
            welcomeMessage: mockAgent.welcome_message,
            fallbackMessage: mockAgent.fallback_message,
            avatar: mockAgent.avatar,
            isActive: mockAgent.is_active,
            config: mockAgent.config,
            stats: {
              conversations: mockAgent.total_conversations,
              conversions: mockAgent.total_conversions
            }
          },
          knowledgeBase: []
        }
      };
    }
    if (!agent) {
      throw createError({
        statusCode: 404,
        statusMessage: "Agent non trouv\xE9"
      });
    }
    console.log("\u2705 Agent trouv\xE9 dans Supabase:", agent.name);
    const formattedAgent = {
      id: agent.id,
      name: agent.name,
      type: agent.type,
      personality: agent.personality,
      description: agent.description,
      welcomeMessage: agent.welcome_message,
      fallbackMessage: agent.fallback_message,
      avatar: agent.avatar,
      isActive: agent.is_active,
      config: agent.config || {},
      stats: {
        conversations: agent.total_conversations || 0,
        conversions: agent.total_conversions || 0
      }
    };
    let knowledgeBase = [];
    try {
      const { data: kbData } = await supabase.from("knowledge_base").select("id, title, content_type, is_active, tags").eq("shop_id", agent.shop_id).eq("is_active", true);
      if (kbData) {
        knowledgeBase = kbData.map((kb) => ({
          id: kb.id,
          title: kb.title,
          contentType: kb.content_type,
          isActive: kb.is_active,
          tags: kb.tags || []
        }));
      }
    } catch (kbError) {
      console.warn("\u26A0\uFE0F Erreur r\xE9cup\xE9ration knowledge base:", kbError);
    }
    return {
      success: true,
      data: {
        agent: formattedAgent,
        knowledgeBase
      }
    };
  } catch (error) {
    console.error("\u274C [API] Erreur r\xE9cup\xE9ration agent:", error);
    const agentId = getRouterParam(event, "id");
    const fallbackAgent = {
      id: agentId,
      name: "Agent de Test",
      type: "general",
      personality: "professional",
      description: "Agent de test en cas d'erreur",
      welcomeMessage: "Bonjour ! Je suis en mode test.",
      fallbackMessage: "Service temporairement indisponible.",
      avatar: null,
      isActive: true,
      config: {},
      stats: { conversations: 0, conversions: 0 }
    };
    return {
      success: true,
      data: {
        agent: fallbackAgent,
        knowledgeBase: []
      }
    };
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
