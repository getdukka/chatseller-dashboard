import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const index_get = defineEventHandler(async (event) => {
  try {
    console.log("\u{1F50D} [API] R\xE9cup\xE9ration liste des agents");
    const mockAgents = [
      {
        id: "b50591b2-9f18-4c72-9d06-e754b60c3887",
        name: "Rose - Vendeuse",
        type: "product_specialist",
        personality: "friendly",
        description: "Assistante d'achat sp\xE9cialis\xE9e dans les produits de jeux de cartes relationnels",
        welcomeMessage: "Bonjour ! Je suis Rose, votre assistante d'achat. Comment puis-je vous aider aujourd'hui ?",
        fallbackMessage: "Je transmets votre question \xE0 notre \xE9quipe, un conseiller vous recontactera bient\xF4t.",
        avatar: "https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff",
        isActive: true,
        config: {
          collectName: true,
          collectPhone: true,
          collectAddress: false,
          collectPayment: true,
          upsellEnabled: false
        },
        stats: {
          conversations: 47,
          conversions: 12
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "agent-2-mock",
        name: "Thomas - Expert Tech",
        type: "general",
        personality: "expert",
        description: "Sp\xE9cialiste des produits techniques et \xE9lectroniques",
        welcomeMessage: "Salut ! Je suis Thomas, expert en tech. Que puis-je vous expliquer ?",
        fallbackMessage: "Je vous mets en relation avec notre \xE9quipe technique.",
        avatar: "https://ui-avatars.com/api/?name=Thomas&background=3B82F6&color=fff",
        isActive: false,
        config: {
          collectName: true,
          collectPhone: false,
          collectAddress: true,
          collectPayment: true,
          upsellEnabled: true
        },
        stats: {
          conversations: 23,
          conversions: 8
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    return {
      success: true,
      data: mockAgents,
      meta: {
        total: mockAgents.length,
        planLimit: 1
        // Plan starter limité à 1 agent
      }
    };
  } catch (error) {
    console.error("\u274C [API] Erreur r\xE9cup\xE9ration agents:", error);
    return {
      success: false,
      error: "Erreur lors de la r\xE9cup\xE9ration des agents"
    };
  }
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
