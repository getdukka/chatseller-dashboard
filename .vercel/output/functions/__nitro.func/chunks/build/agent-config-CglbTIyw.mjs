import { defineComponent, ref, computed, watch, mergeProps, unref, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { u as useAuthStore } from './auth-KgQDcdck.mjs';
import { e as defineStore, u as useHead, c as useRuntimeConfig } from './server.mjs';
import { u as useKnowledgeBase } from './useKnowledgeBase-MXWw3CiM.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './useSupabase-CFkBc_As.mjs';
import '@supabase/supabase-js';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import '@heroicons/vue/24/outline';

const useAgentConfigStore = defineStore("agentConfig", {
  state: () => ({
    currentAgent: null,
    navigationSource: "",
    timestamp: null
  }),
  getters: {
    hasValidAgent: (state) => {
      return !!(state.currentAgent && state.currentAgent.id && state.currentAgent.name);
    },
    isDataFresh: (state) => {
      if (!state.timestamp) return false;
      return Date.now() - state.timestamp < 5 * 60 * 1e3;
    }
  },
  actions: {
    setAgentForConfig(agent, source = "vendeurs-ia") {
      console.log("\u{1F4E6} Store AgentConfig: Sauvegarde agent pour configuration:", agent.name, agent.id);
      this.currentAgent = {
        ...agent,
        sourceComponent: source
      };
      this.navigationSource = source;
      this.timestamp = Date.now();
    },
    getAgentForConfig() {
      if (this.hasValidAgent && this.isDataFresh) {
        console.log("\u2705 Store AgentConfig: Donn\xE9es agent r\xE9cup\xE9r\xE9es depuis store");
        return this.currentAgent;
      }
      console.log("\u274C Store AgentConfig: Aucune donn\xE9e agent valide trouv\xE9e");
      return null;
    },
    clearAgentConfig() {
      console.log("\u{1F9F9} Store AgentConfig: Nettoyage donn\xE9es agent");
      this.currentAgent = null;
      this.navigationSource = "";
      this.timestamp = null;
    },
    // Méthode utilitaire pour récupérer l'agent depuis l'API si nécessaire
    async fetchAgentIfNeeded(agentId) {
      var _a;
      if (this.hasValidAgent && ((_a = this.currentAgent) == null ? void 0 : _a.id) === agentId && this.isDataFresh) {
        return this.currentAgent;
      }
      try {
        console.log("\u{1F504} Store AgentConfig: R\xE9cup\xE9ration agent depuis API:", agentId);
        return null;
      } catch (error) {
        console.error("\u274C Store AgentConfig: Erreur r\xE9cup\xE9ration agent:", error);
        return null;
      }
    }
  }
});
const useAgentConfig = () => {
  const authStore = useAuthStore();
  const agentConfigStore = useAgentConfigStore();
  const config = useRuntimeConfig();
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const agentConfig2 = ref(null);
  const localConfig = ref(null);
  const widgetSyncStatus = ref("idle");
  const autoSaveEnabled = ref(true);
  const lastAutoSave = ref(null);
  const hasUnsavedChanges = ref(false);
  const isConfigValid = computed(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const hasAgentData = ((_b = (_a = agentConfig2.value) == null ? void 0 : _a.agent) == null ? void 0 : _b.name) && ((_d = (_c = agentConfig2.value) == null ? void 0 : _c.agent) == null ? void 0 : _d.title) && ((_f = (_e = agentConfig2.value) == null ? void 0 : _e.agent) == null ? void 0 : _f.id);
    const hasStoreData = agentConfigStore.hasValidAgent;
    const hasWidgetData = (_h = (_g = agentConfig2.value) == null ? void 0 : _g.widget) == null ? void 0 : _h.buttonText;
    return hasAgentData || hasStoreData || hasWidgetData;
  });
  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };
  const adjustColor = (color, percent) => {
    try {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const adjust = (channel) => {
        const adjusted = channel + channel * percent / 100;
        return Math.max(0, Math.min(255, Math.round(adjusted)));
      };
      return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
    } catch (error2) {
      return color;
    }
  };
  const getBorderRadiusValue = (radius) => {
    const radiusMap = {
      "none": "0px",
      "sm": "6px",
      "md": "12px",
      "lg": "16px",
      "xl": "24px",
      "full": "50px"
    };
    return radiusMap[radius] || "12px";
  };
  const formatTime = (date) => {
    if (!date) return "";
    const now = /* @__PURE__ */ new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
    if (diffInSeconds < 60) return `il y a ${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)}min`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)}h`;
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const getTypeLabel = (type) => {
    const labels = {
      general: "Conseiller commercial",
      product_specialist: "Sp\xE9cialiste produit",
      support: "Conseiller support",
      upsell: "Conseiller premium"
    };
    return labels[type] || "Vendeur IA";
  };
  const getProductTypeOptions = () => [
    { value: "auto", label: "\u{1F3AF} D\xE9tection automatique", description: "Le syst\xE8me d\xE9tecte automatiquement le type" },
    { value: "jeu", label: "\u{1F3AE} Jeux", description: "Jeux de soci\xE9t\xE9, cartes, etc." },
    { value: "livre", label: "\u{1F4DA} Livres", description: "Livres, romans, manuels" },
    { value: "formation", label: "\u{1F393} Formations", description: "Cours en ligne, formations" },
    { value: "smartphone", label: "\u{1F4F1} Smartphones", description: "T\xE9l\xE9phones, accessoires mobiles" },
    { value: "ordinateur", label: "\u{1F4BB} Ordinateurs", description: "PC, laptops, composants" },
    { value: "v\xEAtement", label: "\u{1F457} V\xEAtements", description: "Mode, accessoires vestimentaires" },
    { value: "service", label: "\u{1F527} Services", description: "Consultations, prestations" },
    { value: "bijou", label: "\u{1F48E} Bijoux", description: "Bijoux, montres, accessoires" },
    { value: "produit", label: "\u{1F4E6} Autre produit", description: "Autres types de produits" }
  ];
  const getProductTypeLabel = (type) => {
    const option = getProductTypeOptions().find((opt) => opt.value === type);
    return option ? option.label : "\u{1F3AF} D\xE9tection automatique";
  };
  const integrationCode = computed(() => {
    var _a, _b, _c, _d, _e, _f, _g;
    console.log("\u{1F527} [integrationCode] G\xE9n\xE9ration du code d'int\xE9gration avec ic\xF4ne...");
    let agentData = null;
    let agentId = "";
    let agentName = "";
    let agentTitle = "";
    let widgetData = null;
    if (((_b = (_a = agentConfig2.value) == null ? void 0 : _a.agent) == null ? void 0 : _b.id) && ((_d = (_c = agentConfig2.value) == null ? void 0 : _c.agent) == null ? void 0 : _d.name)) {
      agentData = agentConfig2.value.agent;
      widgetData = agentConfig2.value.widget;
      agentId = agentData.id;
      agentName = agentData.name;
      agentTitle = agentData.title || getTypeLabel(agentData.type);
    } else if ((_f = (_e = localConfig.value) == null ? void 0 : _e.agent) == null ? void 0 : _f.name) {
      agentData = localConfig.value.agent;
      widgetData = localConfig.value.widget;
      agentId = agentData.id || "temp-agent";
      agentName = agentData.name;
      agentTitle = agentData.title || getTypeLabel(agentData.type || "general");
    }
    if (!agentData || !agentId || !agentName) {
      return "<!-- \u23F3 Chargement de la configuration du Vendeur IA... -->";
    }
    try {
      const shopId = ((_g = authStore.user) == null ? void 0 : _g.id) || authStore.userShopId || "demo-shop";
      const buttonText = (widgetData == null ? void 0 : widgetData.buttonText) || "Parler au vendeur";
      const primaryColor = (widgetData == null ? void 0 : widgetData.primaryColor) || "#EC4899";
      const position = (widgetData == null ? void 0 : widgetData.position) || "above-cta";
      const theme = (widgetData == null ? void 0 : widgetData.theme) || "modern";
      const language = (widgetData == null ? void 0 : widgetData.language) || "fr";
      const borderRadius = (widgetData == null ? void 0 : widgetData.borderRadius) || "md";
      const adjustedColor = adjustColor(primaryColor, -15);
      const borderRadiusValue = getBorderRadiusValue(borderRadius);
      const widgetUrl = "https://widget.chatseller.app";
      const apiUrl = config.public.apiBaseUrl || "https://chatseller-api-production.up.railway.app";
      return `<!-- \u{1F916} ChatSeller Widget v1.5.1 - ${agentName} (${agentTitle}) - IC\xD4NE CORRIG\xC9E -->

<script>
(function() {
  'use strict';
  
  // \u2705 Configuration ChatSeller Widget avec IC\xD4NE FORC\xC9E
  window.ChatSellerConfig = {
    shopId: '${shopId}',
    agentId: '${agentId}',
    apiUrl: '${apiUrl}',
    buttonText: '${buttonText.replace(/'/g, "\\'")}',
    primaryColor: '${primaryColor}',
    position: '${position}',
    theme: '${theme}',
    language: '${language}',
    borderRadius: '${borderRadius}',
    autoDetectProduct: true,
    debug: false,
    disableFallback: false,
    agentConfig: {
      id: '${agentId}',
      name: '${agentName.replace(/'/g, "\\'")}',
      title: '${agentTitle.replace(/'/g, "\\'")}',
      welcomeMessage: '${(agentData.welcomeMessage || "Bonjour ! Comment puis-je vous aider ?").replace(/'/g, "\\'")}',
      fallbackMessage: '${(agentData.fallbackMessage || "Un instant, je transmets votre question \xE0 notre \xE9quipe.").replace(/'/g, "\\'")}',
      personality: '${agentData.personality || "friendly"}',
      productType: '${agentData.productType || "auto"}',
      shopName: '${agentData.shopName || "cette boutique"}'
    }
  };
  
  // \u2705 PROTECTION ANTI-DOUBLE CHARGEMENT
  if (window.ChatSellerInitialized) {
    console.log('\u26A0\uFE0F ChatSeller: D\xE9j\xE0 initialis\xE9');
    return;
  }
  window.ChatSellerInitialized = true;
  
  // \u2705 NETTOYAGE PR\xC9VENTIF (supprime automatiquement les boutons flottants)
  function cleanupExistingWidgets() {
    const selectors = [
      '#chatseller-widget',
      '#chatseller-modal',
      '[data-chatseller]',
      '.chatseller-widget',
      '#chatseller-fallback' // \u2705 AJOUT : Supprime le bouton flottant ind\xE9sirable
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
  }
  
  // \u2705 CSS CRITIQUE AVEC IC\xD4NE FORC\xC9E MAXIMAL
  function injectCriticalCSS() {
    if (document.getElementById('chatseller-critical-css')) return;
    
    const style = document.createElement('style');
    style.id = 'chatseller-critical-css';
    style.textContent = \`
/* \u{1F3A8} CHATSELLER CSS AVEC IC\xD4NE FORC\xC9E SHOPIFY-PROOF */
.cs-chatseller-widget, .cs-chatseller-widget * {
  all: unset !important;
  box-sizing: border-box !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

.cs-chatseller-widget {
  position: relative !important;
  z-index: 999999 !important;
  display: block !important;
  margin: 8px 0 !important;
  width: 100% !important;
  contain: layout style !important;
  isolation: isolate !important;
}

/* \u2705 BOUTON AVEC IC\xD4NE FORC\xC9E MAXIMALE */
.cs-chat-trigger-button {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  padding: 16px 24px !important;
  background: linear-gradient(135deg, ${primaryColor} 0%, ${adjustedColor} 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: ${borderRadiusValue} !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 8px 25px rgba(${hexToRgb(primaryColor)}, 0.3) !important;
  min-height: 56px !important;
  font-family: inherit !important;
  gap: 8px !important;
  outline: none !important;
}

.cs-chat-trigger-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 35px rgba(${hexToRgb(primaryColor)}, 0.4) !important;
}

/* \u2705 IC\xD4NE SVG PROTECTION MAXIMALE SHOPIFY */
.cs-chat-trigger-button svg {
  width: 20px !important;
  height: 20px !important;
  fill: none !important;
  stroke: white !important;
  stroke-width: 2 !important;
  flex-shrink: 0 !important;
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  position: relative !important;
  z-index: 999999 !important;
  pointer-events: none !important;
  min-width: 20px !important;
  max-width: 20px !important;
  min-height: 20px !important;
  max-height: 20px !important;
  color: white !important;
}

.cs-chat-trigger-button svg * {
  fill: none !important;
  stroke: white !important;
  stroke-width: 2 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  pointer-events: none !important;
  color: white !important;
}

/* \u2705 PROTECTION ANTI-OVERRIDE SHOPIFY MAXIMALE */
.shopify-section .cs-chat-trigger-button svg,
.product-form .cs-chat-trigger-button svg,
[class*="product"] .cs-chat-trigger-button svg,
.theme-shopify .cs-chat-trigger-button svg,
.page .cs-chat-trigger-button svg {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  width: 20px !important;
  height: 20px !important;
  stroke: white !important;
  color: white !important;
}
    \`;
    document.head.appendChild(style);
  }
  
  // \u2705 FONCTION DE CHARGEMENT PRINCIPALE
  function loadChatSellerWidget() {
    console.log('\u{1F680} ChatSeller: Chargement widget avec ic\xF4ne corrig\xE9e...');
    
    cleanupExistingWidgets(); // Supprime tout bouton flottant existant
    injectCriticalCSS(); // Injecte le CSS avec ic\xF4ne forc\xE9e
    
    if (window.ChatSellerLoaded) {
      console.log('\u26A0\uFE0F ChatSeller: D\xE9j\xE0 charg\xE9');
      return;
    }
    window.ChatSellerLoaded = true;
    
    // \u2705 CHARGEMENT SCRIPT WIDGET
    var script = document.createElement('script');
    script.src = '${widgetUrl}/embed.js?v=1.5.1&t=' + Date.now();
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-chatseller', 'modern-widget-fixed');
    
    script.onload = function() {
      console.log('\u2705 ChatSeller: Script charg\xE9 avec ic\xF4ne');
      
      var maxAttempts = 30;
      var attempts = 0;
      
      function tryInit() {
        attempts++;
        if (window.ChatSeller && typeof window.ChatSeller.init === 'function') {
          try {
            window.ChatSeller.init(window.ChatSellerConfig);
            console.log('\u2705 ChatSeller: Widget initialis\xE9 avec ic\xF4ne visible');
          } catch (error) {
            console.error('\u274C ChatSeller: Erreur init:', error);
          }
        } else if (attempts < maxAttempts) {
          setTimeout(tryInit, 300);
        } else {
          console.warn('\u23F0 ChatSeller: Timeout init');
          // \u2705 PAS DE FALLBACK FLOTTANT - comportement corrig\xE9
        }
      }
      
      tryInit();
    };
    
    script.onerror = function(error) {
      console.error('\u274C ChatSeller: Erreur chargement:', error);
      // \u2705 PAS DE FALLBACK FLOTTANT - comportement corrig\xE9
    };
    
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }
  
  // \u2705 D\xC9MARRAGE INTELLIGENT
  function startWidget() {
    if (window.location.href.includes('/admin/')) {
      console.log('\u{1F6D1} ChatSeller: Admin d\xE9tect\xE9, arr\xEAt');
      return;
    }
    
    loadChatSellerWidget();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWidget);
  } else {
    setTimeout(startWidget, 200);
  }
  
})();
<\/script>
<!-- \u{1F680} Fin ChatSeller Widget IC\xD4NE CORRIG\xC9E -->`;
    } catch (error2) {
      console.error("\u274C Erreur g\xE9n\xE9ration code int\xE9gration:", error2);
      return `<!-- \u274C Erreur lors de la g\xE9n\xE9ration du code d'int\xE9gration. -->`;
    }
  });
  const getAuthHeaders = () => {
    if (!authStore.token) {
      throw new Error("Token d'authentification manquant. Veuillez vous reconnecter.");
    }
    return {
      "Authorization": `Bearer ${authStore.token}`,
      "Content-Type": "application/json"
    };
  };
  const fetchAgentConfig = async (agentId) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L;
    loading.value = true;
    error.value = null;
    try {
      console.log("\u{1F50D} [useAgentConfig] R\xE9cup\xE9ration configuration agent:", agentId);
      if (!agentId || agentId === "undefined" || agentId === "null") {
        throw new Error("ID agent invalide");
      }
      if (!authStore.token) {
        throw new Error("Session expir\xE9e. Veuillez vous reconnecter.");
      }
      const shopId = ((_a = authStore.user) == null ? void 0 : _a.id) || authStore.userShopId;
      const [agentResponse, shopResponse, kbResponse] = await Promise.allSettled([
        $fetch(`/api/v1/agents/${agentId}/config`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }),
        shopId ? $fetch(`/api/v1/shops/${shopId}`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }) : Promise.resolve(null),
        $fetch(`/api/v1/agents/${agentId}/knowledge`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }).catch(() => ({ success: true, data: [] }))
      ]);
      if (agentResponse.status === "rejected") {
        console.error("\u274C Erreur r\xE9cup\xE9ration agent:", agentResponse.reason);
        throw new Error("Erreur lors de la r\xE9cup\xE9ration de l'agent: " + agentResponse.reason.message);
      }
      const agentData = agentResponse.value;
      if (!agentData.success) {
        throw new Error(agentData.error || "Erreur lors de la r\xE9cup\xE9ration de la configuration agent");
      }
      const shopData = shopResponse.status === "fulfilled" ? shopResponse.value : null;
      const kbData = kbResponse.status === "fulfilled" ? kbResponse.value : { success: true, data: [] };
      const completeConfig = {
        agent: {
          id: agentData.data.agent.id,
          name: agentData.data.agent.name,
          title: agentData.data.agent.title || getTypeLabel(agentData.data.agent.type || "general"),
          // ✅ CORRECTION: Titre obligatoire
          type: agentData.data.agent.type,
          personality: agentData.data.agent.personality,
          productType: agentData.data.agent.productType || "auto",
          // ✅ NOUVEAU CHAMP
          shopName: ((_b = shopData == null ? void 0 : shopData.data) == null ? void 0 : _b.name) || agentData.data.agent.shopName || "cette boutique",
          // ✅ NOUVEAU CHAMP
          description: agentData.data.agent.description,
          welcomeMessage: agentData.data.agent.welcomeMessage,
          fallbackMessage: agentData.data.agent.fallbackMessage,
          avatar: agentData.data.agent.avatar,
          isActive: agentData.data.agent.isActive,
          config: {
            ...agentData.data.agent.config,
            linkedKnowledgeBase: ((_c = kbData.data) == null ? void 0 : _c.map((kb) => kb.id)) || [],
            aiProvider: ((_d = agentData.data.agent.config) == null ? void 0 : _d.aiProvider) || "openai",
            temperature: ((_e = agentData.data.agent.config) == null ? void 0 : _e.temperature) || 0.7,
            maxTokens: ((_f = agentData.data.agent.config) == null ? void 0 : _f.maxTokens) || 1e3
          },
          stats: {
            conversations: agentData.data.agent.totalConversations || 0,
            conversions: agentData.data.agent.totalConversions || 0
          },
          knowledgeBase: kbData.data || []
        },
        widget: {
          buttonText: ((_h = (_g = shopData == null ? void 0 : shopData.data) == null ? void 0 : _g.widget_config) == null ? void 0 : _h.buttonText) || "Parler \xE0 un conseiller",
          primaryColor: ((_j = (_i = shopData == null ? void 0 : shopData.data) == null ? void 0 : _i.widget_config) == null ? void 0 : _j.primaryColor) || "#EC4899",
          // ✅ Rose par défaut
          position: ((_l = (_k = shopData == null ? void 0 : shopData.data) == null ? void 0 : _k.widget_config) == null ? void 0 : _l.position) || "above-cta",
          widgetSize: ((_n = (_m = shopData == null ? void 0 : shopData.data) == null ? void 0 : _m.widget_config) == null ? void 0 : _n.widgetSize) || "medium",
          theme: ((_p = (_o = shopData == null ? void 0 : shopData.data) == null ? void 0 : _o.widget_config) == null ? void 0 : _p.theme) || "modern",
          borderRadius: ((_r = (_q = shopData == null ? void 0 : shopData.data) == null ? void 0 : _q.widget_config) == null ? void 0 : _r.borderRadius) || "md",
          animation: ((_t = (_s = shopData == null ? void 0 : shopData.data) == null ? void 0 : _s.widget_config) == null ? void 0 : _t.animation) || "fade",
          autoOpen: ((_v = (_u = shopData == null ? void 0 : shopData.data) == null ? void 0 : _u.widget_config) == null ? void 0 : _v.autoOpen) || false,
          showAvatar: ((_x = (_w = shopData == null ? void 0 : shopData.data) == null ? void 0 : _w.widget_config) == null ? void 0 : _x.showAvatar) !== false,
          soundEnabled: ((_z = (_y = shopData == null ? void 0 : shopData.data) == null ? void 0 : _y.widget_config) == null ? void 0 : _z.soundEnabled) !== false,
          mobileOptimized: ((_B = (_A = shopData == null ? void 0 : shopData.data) == null ? void 0 : _A.widget_config) == null ? void 0 : _B.mobileOptimized) !== false,
          showTypingIndicator: ((_D = (_C = shopData == null ? void 0 : shopData.data) == null ? void 0 : _C.widget_config) == null ? void 0 : _D.showTypingIndicator) !== false,
          // ✅ NOUVEAU CHAMP
          offlineMessage: (_F = (_E = shopData == null ? void 0 : shopData.data) == null ? void 0 : _E.widget_config) == null ? void 0 : _F.offlineMessage,
          isActive: ((_H = (_G = shopData == null ? void 0 : shopData.data) == null ? void 0 : _G.widget_config) == null ? void 0 : _H.isActive) !== false,
          language: ((_J = (_I = shopData == null ? void 0 : shopData.data) == null ? void 0 : _I.widget_config) == null ? void 0 : _J.language) || "fr"
        },
        knowledgeBase: kbData.data || []
      };
      agentConfig2.value = completeConfig;
      console.log("\u2705 [useAgentConfig] Configuration moderne charg\xE9e:", {
        agent: completeConfig.agent.name,
        title: completeConfig.agent.title,
        productType: completeConfig.agent.productType,
        shopName: completeConfig.agent.shopName,
        widget: completeConfig.widget.buttonText,
        primaryColor: completeConfig.widget.primaryColor
      });
      return { success: true, data: completeConfig };
    } catch (err) {
      console.error("\u274C [useAgentConfig] Erreur fetchAgentConfig:", err);
      const errorMessage = ((_L = (_K = err.response) == null ? void 0 : _K.data) == null ? void 0 : _L.error) || err.message || "Erreur lors de la r\xE9cup\xE9ration de la configuration";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };
  const testAIMessage = async (message, agentId) => {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      console.log("\u{1F9EA} [testAIMessage] Test IA coh\xE9rent avec Widget:", { message, agentId });
      if (!message.trim()) {
        throw new Error("Message vide");
      }
      if (!agentId) {
        throw new Error("Agent ID manquant");
      }
      const response = await $fetch("/api/v1/public/chat", {
        method: "POST",
        baseURL: config.public.apiBaseUrl,
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          message: message.trim(),
          shopId: ((_a = authStore.user) == null ? void 0 : _a.id) || authStore.userShopId || "demo-shop",
          conversationId: null,
          productInfo: {
            name: ((_c = (_b = localConfig.value) == null ? void 0 : _b.agent) == null ? void 0 : _c.productType) !== "auto" ? `Produit de test ${getProductTypeLabel(((_e = (_d = localConfig.value) == null ? void 0 : _d.agent) == null ? void 0 : _e.productType) || "auto")}` : "Produit de test",
            price: 29900,
            // Prix de test en centimes (299€)
            id: "test-product-123"
          },
          visitorId: `test-visitor-${Date.now()}`,
          isFirstMessage: false
        }
      });
      if (response.success) {
        return {
          success: true,
          message: response.data.message,
          provider: response.data.mode === "test" ? "openai" : response.data.provider || "openai",
          responseTime: response.data.responseTime || 0
        };
      } else {
        throw new Error(response.error || "Erreur lors du test IA");
      }
    } catch (error2) {
      console.error("\u274C Erreur test IA:", error2);
      return {
        success: false,
        error: ((_g = (_f = error2.response) == null ? void 0 : _f.data) == null ? void 0 : _g.error) || error2.message || "Erreur lors du test IA"
      };
    }
  };
  const saveCompleteConfig = async (agentId, updates, isAutoSave = false) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    if (!isAutoSave) saving.value = true;
    widgetSyncStatus.value = "syncing";
    error.value = null;
    try {
      if (!authStore.token) {
        throw new Error("Session expir\xE9e. Veuillez vous reconnecter.");
      }
      if (!agentId) {
        throw new Error("ID agent manquant");
      }
      const shopId = ((_a = authStore.user) == null ? void 0 : _a.id) || authStore.userShopId;
      if (!shopId) {
        throw new Error("Shop ID manquant");
      }
      console.log("\u{1F4BE} [saveCompleteConfig] D\xE9but sauvegarde moderne:", {
        agentId,
        shopId,
        hasAgentUpdates: !!updates.agent,
        hasWidgetUpdates: !!updates.widget,
        agentTitle: (_b = updates.agent) == null ? void 0 : _b.title,
        productType: (_c = updates.agent) == null ? void 0 : _c.productType,
        shopName: (_d = updates.agent) == null ? void 0 : _d.shopName,
        isAutoSave
      });
      if (updates.agent) {
        console.log("\u{1F4BE} Sauvegarde configuration agent avec nouveaux champs...", {
          title: updates.agent.title,
          productType: updates.agent.productType,
          shopName: updates.agent.shopName
        });
        const agentPayload = {
          ...updates.agent,
          title: updates.agent.title || getTypeLabel(updates.agent.type || "general"),
          // ✅ CORRECTION : Titre obligatoire
          productType: updates.agent.productType || "auto",
          // ✅ NOUVEAU CHAMP
          shopName: updates.agent.shopName || "cette boutique",
          // ✅ NOUVEAU CHAMP
          config: {
            ...updates.agent.config,
            aiProvider: ((_e = updates.agent.config) == null ? void 0 : _e.aiProvider) || "openai",
            temperature: ((_f = updates.agent.config) == null ? void 0 : _f.temperature) || 0.7,
            maxTokens: ((_g = updates.agent.config) == null ? void 0 : _g.maxTokens) || 1e3,
            specificInstructions: ((_h = updates.agent.config) == null ? void 0 : _h.specificInstructions) || []
          }
        };
        console.log("\u{1F4E4} [AGENT SAVE] Payload complet avec nouveaux champs:", {
          name: agentPayload.name,
          title: agentPayload.title,
          type: agentPayload.type,
          productType: agentPayload.productType,
          shopName: agentPayload.shopName
        });
        const agentResult = await $fetch(`/api/v1/agents/${agentId}`, {
          method: "PUT",
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: agentPayload
        });
        if (!agentResult.success) {
          throw new Error(`Erreur agent: ${agentResult.error}`);
        }
        console.log("\u2705 Agent sauvegard\xE9 avec nouveaux champs:", (_i = agentResult.data) == null ? void 0 : _i.title);
      }
      if (updates.widget) {
        console.log("\u{1F3A8} Sauvegarde configuration widget moderne...", updates.widget);
        const widgetPayload = {
          widget_config: {
            buttonText: updates.widget.buttonText || "Parler au vendeur",
            primaryColor: updates.widget.primaryColor || "#EC4899",
            // ✅ Rose par défaut
            position: updates.widget.position || "above-cta",
            theme: updates.widget.theme || "modern",
            language: updates.widget.language || "fr",
            widgetSize: updates.widget.widgetSize || "medium",
            borderRadius: updates.widget.borderRadius || "md",
            animation: updates.widget.animation || "fade",
            autoOpen: updates.widget.autoOpen || false,
            showAvatar: updates.widget.showAvatar !== false,
            soundEnabled: updates.widget.soundEnabled !== false,
            mobileOptimized: updates.widget.mobileOptimized !== false,
            showTypingIndicator: updates.widget.showTypingIndicator !== false,
            // ✅ NOUVEAU CHAMP
            isActive: updates.widget.isActive !== false,
            offlineMessage: updates.widget.offlineMessage || null
          }
        };
        console.log("\u{1F4E4} [saveCompleteConfig] Payload widget moderne \xE0 envoyer:", widgetPayload);
        const widgetResult = await $fetch(`/api/v1/shops/${shopId}`, {
          method: "PUT",
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: widgetPayload
        });
        if (!widgetResult.success) {
          console.error("\u274C Erreur API widget moderne:", widgetResult);
          throw new Error(`Erreur widget: ${widgetResult.error}`);
        }
        console.log("\u2705 Widget moderne sauvegard\xE9:", (_j = widgetResult.data) == null ? void 0 : _j.widget_config);
      }
      if (agentConfig2.value) {
        if (updates.agent) {
          agentConfig2.value.agent = { ...agentConfig2.value.agent, ...updates.agent };
          if (!agentConfig2.value.agent.title && agentConfig2.value.agent.type) {
            agentConfig2.value.agent.title = getTypeLabel(agentConfig2.value.agent.type);
          }
          if (!agentConfig2.value.agent.productType) {
            agentConfig2.value.agent.productType = "auto";
          }
          if (!agentConfig2.value.agent.shopName) {
            agentConfig2.value.agent.shopName = "cette boutique";
          }
          console.log("\u2705 Config locale agent mise \xE0 jour avec nouveaux champs:", {
            title: agentConfig2.value.agent.title,
            productType: agentConfig2.value.agent.productType,
            shopName: agentConfig2.value.agent.shopName
          });
        }
        if (updates.widget) {
          agentConfig2.value.widget = { ...agentConfig2.value.widget, ...updates.widget };
          console.log("\u2705 Widget moderne config locale mise \xE0 jour:", agentConfig2.value.widget);
        }
      }
      if (isAutoSave) {
        lastAutoSave.value = /* @__PURE__ */ new Date();
        hasUnsavedChanges.value = false;
      }
      widgetSyncStatus.value = "synced";
      console.log("\u2705 Configuration moderne compl\xE8te sauvegard\xE9e et synchronis\xE9e");
      return { success: true, message: isAutoSave ? "Sauvegarde automatique effectu\xE9e" : "Configuration sauvegard\xE9e avec succ\xE8s" };
    } catch (err) {
      console.error("\u274C [useAgentConfig] Erreur saveCompleteConfig moderne:", err);
      const errorMessage = ((_l = (_k = err.response) == null ? void 0 : _k.data) == null ? void 0 : _l.error) || err.message || "Erreur lors de la sauvegarde";
      error.value = errorMessage;
      widgetSyncStatus.value = "error";
      return { success: false, error: errorMessage };
    } finally {
      if (!isAutoSave) saving.value = false;
      setTimeout(() => {
        if (widgetSyncStatus.value !== "error") {
          widgetSyncStatus.value = "idle";
        }
      }, 3e3);
    }
  };
  let autoSaveTimeout = null;
  const triggerAutoSave = () => {
    if (!autoSaveEnabled.value) return;
    hasUnsavedChanges.value = true;
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    autoSaveTimeout = setTimeout(async () => {
      if (hasUnsavedChanges.value && localConfig.value && agentConfig2.value) {
        console.log("\u{1F4BE} [AUTO-SAVE] D\xE9clenchement sauvegarde automatique...");
        try {
          await saveCompleteConfig(
            agentConfig2.value.agent.id,
            {
              agent: localConfig.value.agent,
              widget: localConfig.value.widget
            },
            true
            // isAutoSave = true
          );
          console.log("\u2705 [AUTO-SAVE] Sauvegarde automatique r\xE9ussie");
        } catch (error2) {
          console.error("\u274C [AUTO-SAVE] Erreur sauvegarde automatique:", error2);
        }
      }
    }, 12e4);
  };
  const linkKnowledgeBaseDocuments = async (agentId, documentIds) => {
    var _a, _b, _c;
    saving.value = true;
    error.value = null;
    try {
      console.log("\u{1F517} [linkKnowledgeBaseDocuments] Liaison documents:", { agentId, documentIds });
      if (!agentId) {
        throw new Error("Agent ID manquant");
      }
      const response = await $fetch(`/api/v1/agents/${agentId}/knowledge-base`, {
        method: "PUT",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: {
          documentIds
        }
      });
      if (response.success) {
        if (agentConfig2.value) {
          agentConfig2.value.agent.config.linkedKnowledgeBase = documentIds;
          if ((_a = response.data) == null ? void 0 : _a.documents) {
            agentConfig2.value.agent.knowledgeBase = response.data.documents;
            agentConfig2.value.knowledgeBase = response.data.documents;
          }
        }
        console.log("\u2705 Documents li\xE9s avec succ\xE8s");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Erreur lors de la liaison des documents");
      }
    } catch (err) {
      console.error("\u274C [linkKnowledgeBaseDocuments] Erreur:", err);
      const errorMessage = ((_c = (_b = err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.error) || err.message || "Erreur lors de la liaison des documents";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      saving.value = false;
    }
  };
  const copyIntegrationCode = async () => {
    try {
      if (!integrationCode.value) {
        throw new Error("Code d'int\xE9gration non disponible");
      }
      await (void 0).clipboard.writeText(integrationCode.value);
      return { success: true, message: "Code d'int\xE9gration moderne copi\xE9!" };
    } catch (err) {
      console.error("\u274C Erreur copie:", err);
      return { success: false, error: "Impossible de copier le code" };
    }
  };
  const setError = (message) => {
    error.value = message;
    widgetSyncStatus.value = "error";
  };
  const clearError = () => {
    error.value = null;
    if (widgetSyncStatus.value === "error") {
      widgetSyncStatus.value = "idle";
    }
  };
  return {
    // State
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    agentConfig: readonly(agentConfig2),
    localConfig,
    widgetSyncStatus: readonly(widgetSyncStatus),
    autoSaveEnabled: readonly(autoSaveEnabled),
    lastAutoSave: readonly(lastAutoSave),
    hasUnsavedChanges: readonly(hasUnsavedChanges),
    // Computed
    isConfigValid,
    integrationCode,
    // Helpers
    getProductTypeOptions,
    getProductTypeLabel,
    getTypeLabel,
    getBorderRadiusValue,
    hexToRgb,
    adjustColor,
    formatTime,
    // Actions
    fetchAgentConfig,
    saveCompleteConfig,
    testAIMessage,
    linkKnowledgeBaseDocuments,
    copyIntegrationCode,
    triggerAutoSave,
    setError,
    clearError
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "agent-config",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    const agentConfigStore = useAgentConfigStore();
    const {
      saving,
      error,
      agentConfig: agentConfig2,
      isConfigValid,
      integrationCode,
      widgetSyncStatus,
      hasUnsavedChanges,
      lastAutoSave,
      getProductTypeOptions,
      getTypeLabel,
      formatTime,
      triggerAutoSave
    } = useAgentConfig();
    const loading = ref(false);
    const {
      documents: knowledgeBaseDocuments,
      loading: knowledgeBaseLoading
    } = useKnowledgeBase();
    const activeTab = ref("agent");
    const activePlatform = ref("shopify");
    const successMessage = ref(null);
    const codeCopied = ref(false);
    const hasValidAgentData = ref(false);
    const localError = ref(null);
    const showKnowledgeBaseModal = ref(false);
    const selectedKnowledgeBase = ref([]);
    const savingKnowledgeBase = ref(false);
    const presetColors = ref([
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4",
      "#F97316",
      "#84CC16"
    ]);
    const isPaidUser = computed(() => {
      var _a, _b;
      return ((_a = authStore.user) == null ? void 0 : _a.subscription_plan) === "professional" || ((_b = authStore.user) == null ? void 0 : _b.subscription_plan) === "enterprise";
    });
    const localConfig = ref({
      agent: {
        id: "",
        name: "",
        title: "",
        type: "general",
        personality: "friendly",
        productType: "auto",
        description: "",
        welcomeMessage: "",
        fallbackMessage: "",
        avatar: "",
        isActive: true,
        config: {
          collectName: true,
          collectPhone: true,
          collectEmail: true,
          collectAddress: false,
          collectPayment: true,
          upsellEnabled: false,
          urgencyEnabled: false,
          specificInstructions: [],
          linkedKnowledgeBase: [],
          aiProvider: "openai",
          temperature: 0.7,
          maxTokens: 1e3,
          systemPrompt: "",
          tone: "friendly"
        },
        stats: { conversations: 0, conversions: 0 },
        knowledgeBase: []
      },
      widget: {
        buttonText: "Parler \xE0 la vendueuse",
        primaryColor: "#3B82F6",
        position: "above-cta",
        widgetSize: "medium",
        theme: "modern",
        borderRadius: "md",
        animation: "fade",
        autoOpen: false,
        showAvatar: true,
        soundEnabled: true,
        mobileOptimized: true,
        isActive: true,
        language: "fr"
      }
    });
    const testMessage = ref("");
    const testMessages = ref([]);
    const sendingTestMessage = ref(false);
    const responseTimes = ref([]);
    const agentId = computed(() => {
      if (route.query.id && typeof route.query.id === "string") {
        return route.query.id;
      }
      const storeAgent = agentConfigStore.getAgentForConfig();
      if (storeAgent == null ? void 0 : storeAgent.id) {
        return storeAgent.id;
      }
      return "unknown";
    });
    const agentName = computed(() => {
      return localConfig.value.agent.name || "Vendeur IA";
    });
    const linkedKnowledgeBase = computed(() => {
      return localConfig.value.agent.knowledgeBase || [];
    });
    const availableKnowledgeBase = computed(() => {
      return knowledgeBaseDocuments.value || [];
    });
    const averageResponseTime = computed(() => {
      if (responseTimes.value.length === 0) return 0;
      return Math.round(responseTimes.value.reduce((a, b) => a + b, 0) / responseTimes.value.length);
    });
    const tabs = [
      { id: "agent", name: "Agent", icon: "\u{1F916}" },
      { id: "widget", name: "Widget", icon: "\u{1F3A8}" },
      { id: "playground", name: "Test", icon: "\u{1F9EA}" },
      { id: "integration", name: "Int\xE9gration", icon: "\u{1F517}" }
    ];
    const platforms = [
      { id: "shopify", name: "Shopify", icon: "\u{1F7E2}" },
      { id: "wordpress", name: "WordPress", icon: "\u{1F535}" },
      { id: "woocommerce", name: "WooCommerce", icon: "\u{1F7E0}" },
      { id: "custom", name: "Personnalis\xE9", icon: "\u{1F310}" }
    ];
    const testScenarios = [
      {
        id: "greeting",
        title: "\u{1F44B} Premier contact",
        description: "Test du message d'accueil",
        message: "Bonjour"
      },
      {
        id: "product_info",
        title: "\u{1F6CD}\uFE0F Demande d'information produit",
        description: "Questions sur un produit",
        message: "Pouvez-vous me parler de vos produits ?"
      },
      {
        id: "purchase_intent",
        title: "\u{1F4B3} Intention d'achat",
        description: "Client pr\xEAt \xE0 acheter",
        message: "Je voudrais commander ce produit"
      },
      {
        id: "objection",
        title: "\u2753 Objection prix",
        description: "Gestion des objections",
        message: "C'est trop cher pour moi"
      },
      {
        id: "support",
        title: "\u{1F198} Demande de support",
        description: "Question technique",
        message: "J'ai un probl\xE8me avec ma commande"
      }
    ];
    const setError = (message) => {
      localError.value = message;
    };
    const displayError = computed(() => {
      return localError.value || error.value;
    });
    const formatMessage = (content) => {
      return content.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '<span class="emoji">$1</span>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>').replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>').replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-600 underline hover:text-blue-800 transition-colors">$1</a>').replace(/\n\n/g, '<br><br class="my-2">').replace(/\n/g, '<br class="my-1">').replace(/^\- (.*)/gm, '<span class="block ml-2 relative"><span class="absolute -ml-2 text-blue-600">\u2022</span>$1</span>').replace(/(\d+(?:[.,]\d{2})?\s*(?:FCFA|€|USD|\$))/g, '<span class="font-semibold text-green-600 bg-green-50 px-1 rounded">$1</span>');
    };
    ref("idle");
    const getBorderRadiusValue = (radius) => {
      const radiusMap = {
        none: "0px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        full: "50px"
        // ✅ 'xl' remplacé par 'full' pour compatibilité
      };
      return radiusMap[radius] || "12px";
    };
    const getWidgetPadding = (size) => {
      const paddingMap = {
        small: "8px 16px",
        medium: "12px 24px",
        large: "16px 32px"
      };
      return paddingMap[size] || "12px 24px";
    };
    const getWidgetFontSize = (size) => {
      const fontSizeMap = {
        small: "13px",
        medium: "15px",
        large: "17px"
      };
      return fontSizeMap[size] || "15px";
    };
    const getPositionLabel = (position) => {
      const positionLabels = {
        "above-cta": "Au-dessus du CTA",
        "below-cta": "En-dessous du CTA",
        "beside-cta": "\xC0 c\xF4t\xE9 du CTA",
        "bottom-right": "Coin bas droite",
        "bottom-left": "Coin bas gauche"
      };
      return positionLabels[position] || position;
    };
    const getWidgetSizeLabel = (size) => {
      const sizeLabels = { small: "Petit", medium: "Moyen", large: "Grand" };
      return sizeLabels[size] || size;
    };
    const getContentTypeLabel = (type) => {
      const labels = {
        manual: "\u{1F4DD} Manuel",
        file: "\u{1F4C4} Fichier",
        url: "\u{1F517} URL",
        website: "\u{1F310} Site web"
      };
      return labels[type] || type;
    };
    const adjustColor = (color, percent) => {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const adjust = (channel) => {
        const adjusted = channel + channel * percent / 100;
        return Math.max(0, Math.min(255, Math.round(adjusted)));
      };
      return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
    };
    const handleConfigChange = () => {
      console.log("\u{1F504} [CONFIG CHANGE] Changement d\xE9tect\xE9, d\xE9clenchement auto-save");
      triggerAutoSave();
    };
    watch(() => agentConfig2.value, (newConfig) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
      if (newConfig && newConfig.agent && newConfig.agent.id) {
        console.log("\u{1F504} [watcher] Mise \xE0 jour localConfig avec donn\xE9es API");
        try {
          localConfig.value.agent = {
            id: newConfig.agent.id,
            name: newConfig.agent.name,
            title: newConfig.agent.title || getTypeLabel(newConfig.agent.type || "general"),
            type: newConfig.agent.type || "general",
            personality: newConfig.agent.personality || "friendly",
            productType: newConfig.agent.productType || "auto",
            description: newConfig.agent.description || "",
            welcomeMessage: newConfig.agent.welcomeMessage || "",
            fallbackMessage: newConfig.agent.fallbackMessage || "",
            avatar: newConfig.agent.avatar || "",
            isActive: (_a = newConfig.agent.isActive) != null ? _a : true,
            config: {
              collectName: (_c = (_b = newConfig.agent.config) == null ? void 0 : _b.collectName) != null ? _c : true,
              collectPhone: (_e = (_d = newConfig.agent.config) == null ? void 0 : _d.collectPhone) != null ? _e : true,
              collectEmail: (_g = (_f = newConfig.agent.config) == null ? void 0 : _f.collectEmail) != null ? _g : true,
              collectAddress: (_i = (_h = newConfig.agent.config) == null ? void 0 : _h.collectAddress) != null ? _i : false,
              collectPayment: (_k = (_j = newConfig.agent.config) == null ? void 0 : _j.collectPayment) != null ? _k : true,
              upsellEnabled: (_m = (_l = newConfig.agent.config) == null ? void 0 : _l.upsellEnabled) != null ? _m : false,
              urgencyEnabled: (_o = (_n = newConfig.agent.config) == null ? void 0 : _n.urgencyEnabled) != null ? _o : false,
              specificInstructions: ((_p = newConfig.agent.config) == null ? void 0 : _p.specificInstructions) ? [...newConfig.agent.config.specificInstructions] : [],
              linkedKnowledgeBase: ((_q = newConfig.agent.config) == null ? void 0 : _q.linkedKnowledgeBase) ? [...newConfig.agent.config.linkedKnowledgeBase] : [],
              aiProvider: ((_r = newConfig.agent.config) == null ? void 0 : _r.aiProvider) || "openai",
              temperature: ((_s = newConfig.agent.config) == null ? void 0 : _s.temperature) || 0.7,
              maxTokens: ((_t = newConfig.agent.config) == null ? void 0 : _t.maxTokens) || 1e3,
              systemPrompt: ((_u = newConfig.agent.config) == null ? void 0 : _u.systemPrompt) || "",
              tone: ((_v = newConfig.agent.config) == null ? void 0 : _v.tone) || "friendly"
            },
            stats: newConfig.agent.stats || { conversations: 0, conversions: 0 },
            knowledgeBase: newConfig.agent.knowledgeBase ? newConfig.agent.knowledgeBase.map((doc) => ({
              id: doc.id,
              title: doc.title,
              contentType: doc.contentType,
              isActive: doc.isActive,
              tags: [...doc.tags]
            })) : []
          };
          if (newConfig.widget) {
            localConfig.value.widget = {
              buttonText: newConfig.widget.buttonText || "Parler \xE0 un conseiller",
              primaryColor: newConfig.widget.primaryColor || "#3B82F6",
              position: newConfig.widget.position || "above-cta",
              widgetSize: newConfig.widget.widgetSize || "medium",
              theme: newConfig.widget.theme || "modern",
              borderRadius: ["none", "sm", "md", "lg", "full"].includes(newConfig.widget.borderRadius) ? newConfig.widget.borderRadius : "md",
              animation: newConfig.widget.animation || "fade",
              autoOpen: (_w = newConfig.widget.autoOpen) != null ? _w : false,
              showAvatar: (_x = newConfig.widget.showAvatar) != null ? _x : true,
              soundEnabled: (_y = newConfig.widget.soundEnabled) != null ? _y : true,
              mobileOptimized: (_z = newConfig.widget.mobileOptimized) != null ? _z : true,
              isActive: (_A = newConfig.widget.isActive) != null ? _A : true,
              language: newConfig.widget.language || "fr"
            };
          }
          hasValidAgentData.value = true;
          console.log("\u2705 [watcher] localConfig mis \xE0 jour avec nouveaux champs");
        } catch (watchError) {
          console.error("\u274C [watcher] Erreur mise \xE0 jour localConfig:", watchError);
          setError("Erreur lors de la mise \xE0 jour de la configuration");
        }
      }
    }, { immediate: true, deep: true });
    watch(() => integrationCode.value, (newCode, oldCode) => {
      console.log("\u{1F504} [WATCH] Code d'int\xE9gration chang\xE9:");
      console.log('   - Contient "Chargement"?:', newCode == null ? void 0 : newCode.includes("Chargement"));
      console.log("   - Longueur:", (newCode == null ? void 0 : newCode.length) || 0);
      if (newCode && !newCode.includes("Chargement")) {
        console.log("\u2705 [WATCH] Code d'int\xE9gration pr\xEAt !");
      }
    }, { immediate: true });
    watch(() => localConfig.value, (newConfig) => {
      if (newConfig && newConfig.agent && newConfig.agent.name) {
        handleConfigChange();
      }
    }, { deep: true });
    useHead({
      title: computed(() => `${agentName.value} - Configuration - ChatSeller`)
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-2aecf8e4><div class="bg-white shadow-sm border-b border-gray-200" data-v-2aecf8e4><div class="px-4 sm:px-6 lg:px-8 py-4 lg:py-6" data-v-2aecf8e4><div class="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0" data-v-2aecf8e4><div class="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1" data-v-2aecf8e4><button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0" data-v-2aecf8e4><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-2aecf8e4></path></svg></button><div class="min-w-0 flex-1" data-v-2aecf8e4><h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate" data-v-2aecf8e4>${ssrInterpolate(agentName.value)} - Configuration </h1><p class="mt-1 text-xs sm:text-sm text-gray-600" data-v-2aecf8e4> Vendeur IA \u2022 Widget \u2022 Test \u2022 Int\xE9gration `);
      if (unref(widgetSyncStatus) === "syncing") {
        _push(`<span class="ml-2 inline-flex items-center text-blue-600" data-v-2aecf8e4><svg class="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-2aecf8e4></path></svg> Synchronisation... </span>`);
      } else if (unref(widgetSyncStatus) === "synced") {
        _push(`<span class="ml-2 inline-flex items-center text-green-600" data-v-2aecf8e4><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-2aecf8e4></path></svg> Synchronis\xE9 </span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasUnsavedChanges)) {
        _push(`<span class="ml-2 inline-flex items-center text-orange-600" data-v-2aecf8e4><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-2aecf8e4></path></svg> Sauvegarde dans 2min </span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(lastAutoSave)) {
        _push(`<span class="ml-2 inline-flex items-center text-green-600 text-xs" data-v-2aecf8e4> Sauv\xE9 auto: ${ssrInterpolate(unref(formatTime)(unref(lastAutoSave)))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div></div><div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3" data-v-2aecf8e4><div class="sm:hidden" data-v-2aecf8e4><select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" data-v-2aecf8e4><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<option${ssrRenderAttr("value", tab.id)} data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(activeTab.value) ? ssrLooseContain(activeTab.value, tab.id) : ssrLooseEqual(activeTab.value, tab.id)) ? " selected" : ""}>${ssrInterpolate(tab.icon)} ${ssrInterpolate(tab.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="hidden sm:flex space-x-1 bg-gray-100 p-1 rounded-lg" data-v-2aecf8e4><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([
          "px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap",
          activeTab.value === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
        ])}" data-v-2aecf8e4><span class="hidden lg:inline" data-v-2aecf8e4>${ssrInterpolate(tab.icon)}</span><span class="lg:ml-1" data-v-2aecf8e4>${ssrInterpolate(tab.name)}</span></button>`);
      });
      _push(`<!--]--></div><span class="hidden lg:inline text-sm text-gray-500" data-v-2aecf8e4>ID: ${ssrInterpolate(agentId.value.substring(0, 8))}...</span><button${ssrIncludeBooleanAttr(unref(saving) || !unref(isConfigValid)) ? " disabled" : ""} class="inline-flex items-center justify-center px-3 lg:px-4 py-2 bg-blue-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors" data-v-2aecf8e4>`);
      if (unref(saving)) {
        _push(`<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-2aecf8e4></path></svg>`);
      } else {
        _push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" data-v-2aecf8e4></path></svg>`);
      }
      _push(`<span class="hidden sm:inline" data-v-2aecf8e4>${ssrInterpolate(unref(saving) ? "Sauvegarde..." : "Sauvegarder")}</span></button></div></div></div></div><div class="mx-4 sm:mx-6 lg:mx-8 mt-4 space-y-2" data-v-2aecf8e4>`);
      if (successMessage.value) {
        _push(`<div class="p-3 lg:p-4 bg-green-50 border border-green-200 rounded-lg" data-v-2aecf8e4><div class="flex items-center" data-v-2aecf8e4><svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-2aecf8e4></path></svg><p class="text-green-700 text-sm" data-v-2aecf8e4>${ssrInterpolate(successMessage.value)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (displayError.value) {
        _push(`<div class="p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg" data-v-2aecf8e4><div class="flex items-center justify-between" data-v-2aecf8e4><div class="flex items-center" data-v-2aecf8e4><svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-2aecf8e4></path></svg><p class="text-red-700 text-sm" data-v-2aecf8e4>${ssrInterpolate(displayError.value)}</p></div><button class="text-red-400 hover:text-red-600" data-v-2aecf8e4><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-2aecf8e4></path></svg></button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="flex items-center justify-center py-12 lg:py-16" data-v-2aecf8e4><div class="text-center" data-v-2aecf8e4><svg class="animate-spin h-6 lg:h-8 w-6 lg:w-8 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-2aecf8e4></path></svg><p class="text-gray-600 text-sm lg:text-base" data-v-2aecf8e4>Chargement de la configuration...</p></div></div>`);
      } else if (unref(agentConfig2) || hasValidAgentData.value) {
        _push(`<div class="p-4 sm:p-6 lg:p-8" data-v-2aecf8e4>`);
        if (activeTab.value === "agent") {
          _push(`<div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8" data-v-2aecf8e4><div class="xl:col-span-2 space-y-6 lg:space-y-8" data-v-2aecf8e4><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6" data-v-2aecf8e4>\u{1F916} Informations du Vendeur IA</h3><div class="space-y-4 lg:space-y-6" data-v-2aecf8e4><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-2aecf8e4><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Nom du Vendeur IA *</label><input${ssrRenderAttr("value", localConfig.value.agent.name)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm lg:text-base" placeholder="Ex: Sarah, Marc, Lisa, Sophie..." data-v-2aecf8e4><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4> Ce nom appara\xEEtra dans les conversations </p></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Titre/Fonction *</label><input${ssrRenderAttr("value", localConfig.value.agent.title)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm lg:text-base" placeholder="Ex: Conseill\xE8re produit, Vendeur expert..." data-v-2aecf8e4><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4> Affich\xE9 sous le nom dans le chat </p></div></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Avatar du Vendeur IA</label><div class="flex items-center space-x-4" data-v-2aecf8e4><div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center" data-v-2aecf8e4>`);
          if (localConfig.value.agent.avatar) {
            _push(`<img${ssrRenderAttr("src", localConfig.value.agent.avatar)}${ssrRenderAttr("alt", localConfig.value.agent.name)} class="w-full h-full object-cover" data-v-2aecf8e4>`);
          } else {
            _push(`<div class="text-gray-400 text-xs text-center" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.name ? localConfig.value.agent.name.charAt(0).toUpperCase() : "?")}</div>`);
          }
          _push(`</div><div class="flex-1" data-v-2aecf8e4><input${ssrRenderAttr("value", localConfig.value.agent.avatar)} type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" placeholder="https://example.com/avatar.jpg (optionnel)" data-v-2aecf8e4><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4> Laissez vide pour utiliser un avatar g\xE9n\xE9r\xE9 automatiquement </p></div><button type="button" class="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium" data-v-2aecf8e4> G\xE9n\xE9rer </button></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-2aecf8e4><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Type de vendeur</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" data-v-2aecf8e4><option value="general" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.type) ? ssrLooseContain(localConfig.value.agent.type, "general") : ssrLooseEqual(localConfig.value.agent.type, "general")) ? " selected" : ""}>\u{1F3AF} Vendeur g\xE9n\xE9raliste</option><option value="product_specialist" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.type) ? ssrLooseContain(localConfig.value.agent.type, "product_specialist") : ssrLooseEqual(localConfig.value.agent.type, "product_specialist")) ? " selected" : ""}>\u{1F6CD}\uFE0F Sp\xE9cialiste produit</option><option value="support" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.type) ? ssrLooseContain(localConfig.value.agent.type, "support") : ssrLooseEqual(localConfig.value.agent.type, "support")) ? " selected" : ""}>\u{1F198} Support &amp; SAV</option><option value="upsell" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.type) ? ssrLooseContain(localConfig.value.agent.type, "upsell") : ssrLooseEqual(localConfig.value.agent.type, "upsell")) ? " selected" : ""}>\u{1F48E} Upsell Premium</option></select></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Personnalit\xE9</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" data-v-2aecf8e4><option value="professional" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.personality) ? ssrLooseContain(localConfig.value.agent.personality, "professional") : ssrLooseEqual(localConfig.value.agent.personality, "professional")) ? " selected" : ""}>\u{1F4BC} Professionnel</option><option value="friendly" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.personality) ? ssrLooseContain(localConfig.value.agent.personality, "friendly") : ssrLooseEqual(localConfig.value.agent.personality, "friendly")) ? " selected" : ""}>\u{1F60A} Amical</option><option value="expert" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.personality) ? ssrLooseContain(localConfig.value.agent.personality, "expert") : ssrLooseEqual(localConfig.value.agent.personality, "expert")) ? " selected" : ""}>\u{1F393} Expert technique</option><option value="casual" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.personality) ? ssrLooseContain(localConfig.value.agent.personality, "casual") : ssrLooseEqual(localConfig.value.agent.personality, "casual")) ? " selected" : ""}>\u{1F60E} D\xE9contract\xE9</option></select></div></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4> Type de produit propos\xE9 <span class="ml-1 text-xs text-gray-500" data-v-2aecf8e4>(pour personnaliser les r\xE9ponses)</span></label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" data-v-2aecf8e4><!--[-->`);
          ssrRenderList(unref(getProductTypeOptions)(), (option) => {
            _push(`<option${ssrRenderAttr("value", option.value)} data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.productType) ? ssrLooseContain(localConfig.value.agent.productType, option.value) : ssrLooseEqual(localConfig.value.agent.productType, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
          });
          _push(`<!--]--></select><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4>${ssrInterpolate(((_a = unref(getProductTypeOptions)().find((opt) => opt.value === localConfig.value.agent.productType)) == null ? void 0 : _a.description) || "S\xE9lectionnez le type de produit")}</p></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4> Intelligence Artificielle `);
          if (!isPaidUser.value) {
            _push(`<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800" data-v-2aecf8e4> Plan Pro </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</label><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-2aecf8e4><div data-v-2aecf8e4><select${ssrIncludeBooleanAttr(!isPaidUser.value) ? " disabled" : ""} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base disabled:bg-gray-100 disabled:text-gray-500" data-v-2aecf8e4><option value="openai" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.aiProvider) ? ssrLooseContain(localConfig.value.agent.config.aiProvider, "openai") : ssrLooseEqual(localConfig.value.agent.config.aiProvider, "openai")) ? " selected" : ""}>\u{1F916} GPT-4o-mini (Gratuit)</option><option value="claude"${ssrIncludeBooleanAttr(!isPaidUser.value) ? " disabled" : ""} data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.aiProvider) ? ssrLooseContain(localConfig.value.agent.config.aiProvider, "claude") : ssrLooseEqual(localConfig.value.agent.config.aiProvider, "claude")) ? " selected" : ""}>\u{1F9E0} GPT-4.1 (Pro)</option><option value="claude"${ssrIncludeBooleanAttr(!isPaidUser.value) ? " disabled" : ""} data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.aiProvider) ? ssrLooseContain(localConfig.value.agent.config.aiProvider, "claude") : ssrLooseEqual(localConfig.value.agent.config.aiProvider, "claude")) ? " selected" : ""}>\u{1F9E0} Claude Sonnet (Pro)</option></select></div><div data-v-2aecf8e4><select${ssrIncludeBooleanAttr(!isPaidUser.value) ? " disabled" : ""} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base disabled:bg-gray-100 disabled:text-gray-500" data-v-2aecf8e4><option${ssrRenderAttr("value", 0.3)} data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.temperature) ? ssrLooseContain(localConfig.value.agent.config.temperature, 0.3) : ssrLooseEqual(localConfig.value.agent.config.temperature, 0.3)) ? " selected" : ""}>\u{1F3AF} Pr\xE9cis (0.3)</option><option${ssrRenderAttr("value", 0.7)} data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.temperature) ? ssrLooseContain(localConfig.value.agent.config.temperature, 0.7) : ssrLooseEqual(localConfig.value.agent.config.temperature, 0.7)) ? " selected" : ""}>\u2696\uFE0F \xC9quilibr\xE9 (0.7)</option><option${ssrRenderAttr("value", 1)} data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.temperature) ? ssrLooseContain(localConfig.value.agent.config.temperature, 1) : ssrLooseEqual(localConfig.value.agent.config.temperature, 1)) ? " selected" : ""}>\u{1F3A8} Cr\xE9atif (1.0)</option></select></div></div>`);
          if (!isPaidUser.value) {
            _push(`<p class="text-xs text-yellow-600 mt-1" data-v-2aecf8e4> \u{1F4A1} Passez au plan Pro pour acc\xE9der aux autres IA et aux param\xE8tres avanc\xE9s </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Message d&#39;accueil *</label><textarea rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" placeholder="Bonjour ! Je suis Sarah, sp\xE9cialiste produits. Comment puis-je vous aider \xE0 trouver le produit parfait ?" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.welcomeMessage)}</textarea><div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg" data-v-2aecf8e4><div class="flex items-start space-x-2" data-v-2aecf8e4><div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0" data-v-2aecf8e4><span class="text-white text-xs" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.name ? localConfig.value.agent.name.charAt(0).toUpperCase() : "IA")}</span></div><div class="flex-1" data-v-2aecf8e4><div class="text-xs text-gray-600 mb-1" data-v-2aecf8e4><strong data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.name || "Nom du vendeur")}</strong>`);
          if (localConfig.value.agent.title) {
            _push(`<span data-v-2aecf8e4> \u2022 ${ssrInterpolate(localConfig.value.agent.title)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-sm text-gray-800" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.welcomeMessage || "Tapez votre message d'accueil...")}</p></div></div></div></div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><div class="flex items-center justify-between mb-4 lg:mb-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900" data-v-2aecf8e4>\u{1F4DA} Base de Connaissances</h3><button class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors" data-v-2aecf8e4><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-2aecf8e4></path></svg> G\xE9rer </button></div>`);
          if (linkedKnowledgeBase.value.length === 0) {
            _push(`<div class="text-center py-8" data-v-2aecf8e4><svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-2aecf8e4></path></svg><p class="text-gray-600 text-sm" data-v-2aecf8e4>Aucun document li\xE9 \xE0 cet agent</p><p class="text-gray-500 text-xs mt-1" data-v-2aecf8e4>Liez des documents pour am\xE9liorer les r\xE9ponses de votre agent</p></div>`);
          } else {
            _push(`<div class="space-y-3" data-v-2aecf8e4><!--[-->`);
            ssrRenderList(linkedKnowledgeBase.value, (doc) => {
              _push(`<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-v-2aecf8e4><div class="flex items-center space-x-3" data-v-2aecf8e4><div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" data-v-2aecf8e4><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-2aecf8e4></path></svg></div><div data-v-2aecf8e4><p class="text-sm font-medium text-gray-900" data-v-2aecf8e4>${ssrInterpolate(doc.title)}</p><p class="text-xs text-gray-500" data-v-2aecf8e4>${ssrInterpolate(getContentTypeLabel(doc.contentType))}</p></div></div><span class="${ssrRenderClass([
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                doc.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              ])}" data-v-2aecf8e4>${ssrInterpolate(doc.isActive ? "Actif" : "Inactif")}</span></div>`);
            });
            _push(`<!--]--></div>`);
          }
          _push(`</div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6" data-v-2aecf8e4>\u{1F4BC} Configuration Commerciale</h3><div class="space-y-4 lg:space-y-6" data-v-2aecf8e4><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-3" data-v-2aecf8e4>Informations \xE0 collecter</label><div class="grid grid-cols-1 sm:grid-cols-2 gap-2" data-v-2aecf8e4><label class="flex items-center" data-v-2aecf8e4><input${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.collectName) ? ssrLooseContain(localConfig.value.agent.config.collectName, null) : localConfig.value.agent.config.collectName) ? " checked" : ""} type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-2aecf8e4><span class="ml-2 text-sm text-gray-700" data-v-2aecf8e4>\u{1F464} Nom complet</span></label><label class="flex items-center" data-v-2aecf8e4><input${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.collectPhone) ? ssrLooseContain(localConfig.value.agent.config.collectPhone, null) : localConfig.value.agent.config.collectPhone) ? " checked" : ""} type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-2aecf8e4><span class="ml-2 text-sm text-gray-700" data-v-2aecf8e4>\u{1F4DE} T\xE9l\xE9phone</span></label><label class="flex items-center" data-v-2aecf8e4><input${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.collectEmail) ? ssrLooseContain(localConfig.value.agent.config.collectEmail, null) : localConfig.value.agent.config.collectEmail) ? " checked" : ""} type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-2aecf8e4><span class="ml-2 text-sm text-gray-700" data-v-2aecf8e4>\u{1F4E7} Email</span></label><label class="flex items-center" data-v-2aecf8e4><input${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.agent.config.collectAddress) ? ssrLooseContain(localConfig.value.agent.config.collectAddress, null) : localConfig.value.agent.config.collectAddress) ? " checked" : ""} type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-2aecf8e4><span class="ml-2 text-sm text-gray-700" data-v-2aecf8e4>\u{1F3E0} Adresse</span></label></div></div><div class="space-y-4" data-v-2aecf8e4><div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg" data-v-2aecf8e4><div class="flex-1" data-v-2aecf8e4><div class="flex items-center" data-v-2aecf8e4><h4 class="text-sm font-medium text-gray-900" data-v-2aecf8e4>\u{1F48E} Propositions d&#39;upsell</h4>`);
          if (!isPaidUser.value) {
            _push(`<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800" data-v-2aecf8e4> Plan Pro </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4>L&#39;agent propose des produits compl\xE9mentaires</p>`);
          if (!isPaidUser.value) {
            _push(`<p class="text-xs text-yellow-600 mt-1" data-v-2aecf8e4> \u{1F4A1} Fonctionnalit\xE9 avanc\xE9e r\xE9serv\xE9e au plan Pro </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><button${ssrIncludeBooleanAttr(!isPaidUser.value) ? " disabled" : ""} class="${ssrRenderClass([
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            localConfig.value.agent.config.upsellEnabled && isPaidUser.value ? "bg-blue-600" : "bg-gray-200",
            !isPaidUser.value ? "cursor-not-allowed opacity-50" : ""
          ])}" data-v-2aecf8e4><span class="${ssrRenderClass([
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            localConfig.value.agent.config.upsellEnabled && isPaidUser.value ? "translate-x-5" : "translate-x-0"
          ])}" data-v-2aecf8e4></span></button></div><div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg" data-v-2aecf8e4><div class="flex-1" data-v-2aecf8e4><div class="flex items-center" data-v-2aecf8e4><h4 class="text-sm font-medium text-gray-900" data-v-2aecf8e4>\u26A1 Cr\xE9ation d&#39;urgence (FOMO)</h4>`);
          if (!isPaidUser.value) {
            _push(`<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800" data-v-2aecf8e4> Plan Pro </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4>Stock limit\xE9, offres temporaires</p>`);
          if (!isPaidUser.value) {
            _push(`<p class="text-xs text-yellow-600 mt-1" data-v-2aecf8e4> \u{1F4A1} Fonctionnalit\xE9 avanc\xE9e r\xE9serv\xE9e au plan Pro </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><button${ssrIncludeBooleanAttr(!isPaidUser.value) ? " disabled" : ""} class="${ssrRenderClass([
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            localConfig.value.agent.config.urgencyEnabled && isPaidUser.value ? "bg-blue-600" : "bg-gray-200",
            !isPaidUser.value ? "cursor-not-allowed opacity-50" : ""
          ])}" data-v-2aecf8e4><span class="${ssrRenderClass([
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            localConfig.value.agent.config.urgencyEnabled && isPaidUser.value ? "translate-x-5" : "translate-x-0"
          ])}" data-v-2aecf8e4></span></button></div></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Instructions sp\xE9cifiques</label><div class="space-y-2" data-v-2aecf8e4><!--[-->`);
          ssrRenderList(localConfig.value.agent.config.specificInstructions || [], (instruction, index) => {
            _push(`<div class="flex items-center space-x-2" data-v-2aecf8e4><input${ssrRenderAttr("value", localConfig.value.agent.config.specificInstructions[index])} type="text" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Ex: Toujours demander le pr\xE9nom du client" data-v-2aecf8e4><button class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" title="Supprimer cette instruction" data-v-2aecf8e4><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-2aecf8e4></path></svg></button></div>`);
          });
          _push(`<!--]--><button class="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors text-sm" data-v-2aecf8e4> + Ajouter une instruction </button></div></div></div></div></div><div class="space-y-6" data-v-2aecf8e4><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4" data-v-2aecf8e4>\u{1F4CA} Statut du Vendeur IA</h3><div class="space-y-3 text-sm" data-v-2aecf8e4><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>ID:</span><span class="font-mono bg-gray-100 px-2 py-1 rounded text-xs" data-v-2aecf8e4>${ssrInterpolate(agentId.value.substring(0, 8))}...</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Type:</span><span class="capitalize" data-v-2aecf8e4>${ssrInterpolate(unref(getTypeLabel)(localConfig.value.agent.type))}</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Titre:</span><span class="text-blue-600" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.title || unref(getTypeLabel)(localConfig.value.agent.type))}</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Fournisseur d&#39;IA:</span><span class="capitalize" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.config.aiProvider || "OpenAI")}</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Base de connaissances:</span><span class="text-blue-600" data-v-2aecf8e4>${ssrInterpolate(linkedKnowledgeBase.value.length)} docs</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Configuration:</span><span class="${ssrRenderClass(unref(isConfigValid) ? "text-green-600" : "text-red-600")}" data-v-2aecf8e4>${ssrInterpolate(unref(isConfigValid) ? "\u2705 Valide" : "\u274C Invalide")}</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Statut:</span><span class="${ssrRenderClass(localConfig.value.agent.isActive ? "text-green-600" : "text-red-600")}" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.isActive ? "\u{1F7E2} Actif" : "\u{1F534} Inactif")}</span></div></div><div class="mt-4 pt-4 border-t border-gray-200" data-v-2aecf8e4><div class="flex items-center justify-between" data-v-2aecf8e4><span class="text-sm font-medium" data-v-2aecf8e4>Vendeur IA actif</span><button class="${ssrRenderClass([
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            localConfig.value.agent.isActive ? "bg-blue-600" : "bg-gray-200"
          ])}" data-v-2aecf8e4><span class="${ssrRenderClass([
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            localConfig.value.agent.isActive ? "translate-x-5" : "translate-x-0"
          ])}" data-v-2aecf8e4></span></button></div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4" data-v-2aecf8e4>\u{1F4C8} Statistiques</h3><div class="space-y-3" data-v-2aecf8e4><div class="flex justify-between items-center" data-v-2aecf8e4><span class="text-sm text-gray-600" data-v-2aecf8e4>Conversations</span><span class="text-lg font-bold text-blue-600" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.stats.conversations)}</span></div><div class="flex justify-between items-center" data-v-2aecf8e4><span class="text-sm text-gray-600" data-v-2aecf8e4>Conversions</span><span class="text-lg font-bold text-green-600" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.stats.conversions)}</span></div><div class="flex justify-between items-center" data-v-2aecf8e4><span class="text-sm text-gray-600" data-v-2aecf8e4>Taux de conversion</span><span class="text-lg font-bold text-purple-600" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.stats.conversations > 0 ? Math.round(localConfig.value.agent.stats.conversions / localConfig.value.agent.stats.conversations * 100) : 0)}% </span></div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4" data-v-2aecf8e4>\u26A1 Actions Rapides</h3><div class="space-y-3" data-v-2aecf8e4><button class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm lg:text-base" data-v-2aecf8e4> \u{1F9EA} Tester le Vendeur IA </button><button class="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm lg:text-base" data-v-2aecf8e4> \u{1F3A8} Configurer Widget </button><button class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base" data-v-2aecf8e4> \u{1F517} Code d&#39;Int\xE9gration </button></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeTab.value === "widget") {
          _push(`<div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8" data-v-2aecf8e4><div class="xl:col-span-2 space-y-6 lg:space-y-8" data-v-2aecf8e4><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6" data-v-2aecf8e4>\u{1F3A8} Apparence du Widget</h3><div class="space-y-4 lg:space-y-6" data-v-2aecf8e4><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Texte du bouton *</label><input${ssrRenderAttr("value", localConfig.value.widget.buttonText)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm lg:text-base" placeholder="Ex: Parler \xE0 un conseiller" data-v-2aecf8e4></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Couleur principale</label><div class="flex items-center space-x-3" data-v-2aecf8e4><input${ssrRenderAttr("value", localConfig.value.widget.primaryColor)} type="color" class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer" data-v-2aecf8e4><input${ssrRenderAttr("value", localConfig.value.widget.primaryColor)} type="text" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="#3B82F6" data-v-2aecf8e4><div class="flex space-x-2" data-v-2aecf8e4><!--[-->`);
          ssrRenderList(presetColors.value, (color) => {
            _push(`<button style="${ssrRenderStyle({ backgroundColor: color })}" class="${ssrRenderClass([localConfig.value.widget.primaryColor === color ? "border-gray-900" : "border-gray-300", "w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform"])}"${ssrRenderAttr("title", color)} data-v-2aecf8e4></button>`);
          });
          _push(`<!--]--></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-2aecf8e4><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Position du widget</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" data-v-2aecf8e4><option value="above-cta" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.position) ? ssrLooseContain(localConfig.value.widget.position, "above-cta") : ssrLooseEqual(localConfig.value.widget.position, "above-cta")) ? " selected" : ""}>Au-dessus du bouton d&#39;achat</option><option value="below-cta" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.position) ? ssrLooseContain(localConfig.value.widget.position, "below-cta") : ssrLooseEqual(localConfig.value.widget.position, "below-cta")) ? " selected" : ""}>En-dessous du bouton d&#39;achat</option><option value="beside-cta" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.position) ? ssrLooseContain(localConfig.value.widget.position, "beside-cta") : ssrLooseEqual(localConfig.value.widget.position, "beside-cta")) ? " selected" : ""}>\xC0 c\xF4t\xE9 du bouton d&#39;achat</option><option value="bottom-right" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.position) ? ssrLooseContain(localConfig.value.widget.position, "bottom-right") : ssrLooseEqual(localConfig.value.widget.position, "bottom-right")) ? " selected" : ""}>Coin en bas \xE0 droite</option><option value="bottom-left" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.position) ? ssrLooseContain(localConfig.value.widget.position, "bottom-left") : ssrLooseEqual(localConfig.value.widget.position, "bottom-left")) ? " selected" : ""}>Coin en bas \xE0 gauche</option></select></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Th\xE8me</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" data-v-2aecf8e4><option value="modern" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.theme) ? ssrLooseContain(localConfig.value.widget.theme, "modern") : ssrLooseEqual(localConfig.value.widget.theme, "modern")) ? " selected" : ""}>Moderne</option><option value="minimal" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.theme) ? ssrLooseContain(localConfig.value.widget.theme, "minimal") : ssrLooseEqual(localConfig.value.widget.theme, "minimal")) ? " selected" : ""}>Minimaliste</option><option value="brand_adaptive" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.theme) ? ssrLooseContain(localConfig.value.widget.theme, "brand_adaptive") : ssrLooseEqual(localConfig.value.widget.theme, "brand_adaptive")) ? " selected" : ""}>Adaptatif \xE0 la marque</option></select></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-2aecf8e4><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Taille du widget</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" data-v-2aecf8e4><option value="small" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.widgetSize) ? ssrLooseContain(localConfig.value.widget.widgetSize, "small") : ssrLooseEqual(localConfig.value.widget.widgetSize, "small")) ? " selected" : ""}>Petit</option><option value="medium" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.widgetSize) ? ssrLooseContain(localConfig.value.widget.widgetSize, "medium") : ssrLooseEqual(localConfig.value.widget.widgetSize, "medium")) ? " selected" : ""}>Moyen</option><option value="large" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.widgetSize) ? ssrLooseContain(localConfig.value.widget.widgetSize, "large") : ssrLooseEqual(localConfig.value.widget.widgetSize, "large")) ? " selected" : ""}>Grand</option></select></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Bordures</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" data-v-2aecf8e4><option value="none" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.borderRadius) ? ssrLooseContain(localConfig.value.widget.borderRadius, "none") : ssrLooseEqual(localConfig.value.widget.borderRadius, "none")) ? " selected" : ""}>Aucune</option><option value="sm" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.borderRadius) ? ssrLooseContain(localConfig.value.widget.borderRadius, "sm") : ssrLooseEqual(localConfig.value.widget.borderRadius, "sm")) ? " selected" : ""}>L\xE9g\xE8res</option><option value="md" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.borderRadius) ? ssrLooseContain(localConfig.value.widget.borderRadius, "md") : ssrLooseEqual(localConfig.value.widget.borderRadius, "md")) ? " selected" : ""}>Moyennes</option><option value="lg" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.borderRadius) ? ssrLooseContain(localConfig.value.widget.borderRadius, "lg") : ssrLooseEqual(localConfig.value.widget.borderRadius, "lg")) ? " selected" : ""}>Arrondies</option><option value="xl" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.borderRadius) ? ssrLooseContain(localConfig.value.widget.borderRadius, "xl") : ssrLooseEqual(localConfig.value.widget.borderRadius, "xl")) ? " selected" : ""}>Tr\xE8s arrondies</option></select></div></div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6" data-v-2aecf8e4>\u2699\uFE0F Comportement</h3><div class="space-y-4" data-v-2aecf8e4><div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg" data-v-2aecf8e4><div class="flex-1" data-v-2aecf8e4><h4 class="text-sm font-medium text-gray-900" data-v-2aecf8e4>Ouverture automatique</h4><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4>Le chat s&#39;ouvre automatiquement apr\xE8s quelques secondes</p></div><button class="${ssrRenderClass([
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            localConfig.value.widget.autoOpen ? "bg-blue-600" : "bg-gray-200"
          ])}" data-v-2aecf8e4><span class="${ssrRenderClass([
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            localConfig.value.widget.autoOpen ? "translate-x-5" : "translate-x-0"
          ])}" data-v-2aecf8e4></span></button></div><div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg" data-v-2aecf8e4><div class="flex-1" data-v-2aecf8e4><h4 class="text-sm font-medium text-gray-900" data-v-2aecf8e4>Afficher l&#39;avatar</h4><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4>Avatar du Vendeur IA dans les conversations</p></div><button class="${ssrRenderClass([
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            localConfig.value.widget.showAvatar ? "bg-blue-600" : "bg-gray-200"
          ])}" data-v-2aecf8e4><span class="${ssrRenderClass([
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            localConfig.value.widget.showAvatar ? "translate-x-5" : "translate-x-0"
          ])}" data-v-2aecf8e4></span></button></div><div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg" data-v-2aecf8e4><div class="flex-1" data-v-2aecf8e4><h4 class="text-sm font-medium text-gray-900" data-v-2aecf8e4>Sons de notification</h4><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4>Sons pour les nouveaux messages</p></div><button class="${ssrRenderClass([
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            localConfig.value.widget.soundEnabled ? "bg-blue-600" : "bg-gray-200"
          ])}" data-v-2aecf8e4><span class="${ssrRenderClass([
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            localConfig.value.widget.soundEnabled ? "translate-x-5" : "translate-x-0"
          ])}" data-v-2aecf8e4></span></button></div><div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg" data-v-2aecf8e4><div class="flex-1" data-v-2aecf8e4><h4 class="text-sm font-medium text-gray-900" data-v-2aecf8e4>Optimisation mobile</h4><p class="text-xs text-gray-500 mt-1" data-v-2aecf8e4>Interface adapt\xE9e aux smartphones</p></div><button class="${ssrRenderClass([
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            localConfig.value.widget.mobileOptimized ? "bg-blue-600" : "bg-gray-200"
          ])}" data-v-2aecf8e4><span class="${ssrRenderClass([
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            localConfig.value.widget.mobileOptimized ? "translate-x-5" : "translate-x-0"
          ])}" data-v-2aecf8e4></span></button></div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6" data-v-2aecf8e4>\u{1F30D} Localisation</h3><div class="space-y-4" data-v-2aecf8e4><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Langue du widget</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" data-v-2aecf8e4><option value="fr" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.language) ? ssrLooseContain(localConfig.value.widget.language, "fr") : ssrLooseEqual(localConfig.value.widget.language, "fr")) ? " selected" : ""}>\u{1F1EB}\u{1F1F7} Fran\xE7ais</option><option value="en" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.language) ? ssrLooseContain(localConfig.value.widget.language, "en") : ssrLooseEqual(localConfig.value.widget.language, "en")) ? " selected" : ""}>\u{1F1FA}\u{1F1F8} English</option></select></div><div data-v-2aecf8e4><label class="block text-sm font-medium text-gray-700 mb-2" data-v-2aecf8e4>Animation d&#39;apparition</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base" data-v-2aecf8e4><option value="fade" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.animation) ? ssrLooseContain(localConfig.value.widget.animation, "fade") : ssrLooseEqual(localConfig.value.widget.animation, "fade")) ? " selected" : ""}>Fondu</option><option value="slide" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.animation) ? ssrLooseContain(localConfig.value.widget.animation, "slide") : ssrLooseEqual(localConfig.value.widget.animation, "slide")) ? " selected" : ""}>Glissement</option><option value="bounce" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.animation) ? ssrLooseContain(localConfig.value.widget.animation, "bounce") : ssrLooseEqual(localConfig.value.widget.animation, "bounce")) ? " selected" : ""}>Rebond</option><option value="none" data-v-2aecf8e4${ssrIncludeBooleanAttr(Array.isArray(localConfig.value.widget.animation) ? ssrLooseContain(localConfig.value.widget.animation, "none") : ssrLooseEqual(localConfig.value.widget.animation, "none")) ? " selected" : ""}>Aucune</option></select></div></div></div></div><div class="space-y-6" data-v-2aecf8e4><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4" data-v-2aecf8e4>\u{1F441}\uFE0F Pr\xE9visualisation</h3><div class="space-y-4" data-v-2aecf8e4><div data-v-2aecf8e4><p class="text-sm text-gray-600 mb-2" data-v-2aecf8e4>Bouton sur votre site :</p><div class="bg-gray-100 p-4 rounded-lg" data-v-2aecf8e4><button style="${ssrRenderStyle({
            backgroundColor: localConfig.value.widget.primaryColor,
            borderRadius: getBorderRadiusValue(localConfig.value.widget.borderRadius),
            padding: getWidgetPadding(localConfig.value.widget.widgetSize),
            fontSize: getWidgetFontSize(localConfig.value.widget.widgetSize)
          })}" class="w-full text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center space-x-2" data-v-2aecf8e4><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.906-1.479L3 21l2.521-5.094A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" data-v-2aecf8e4></path></svg><span data-v-2aecf8e4>${ssrInterpolate(localConfig.value.widget.buttonText)}</span></button></div></div><div data-v-2aecf8e4><p class="text-sm text-gray-600 mb-2" data-v-2aecf8e4>Palette de couleurs :</p><div class="flex space-x-2" data-v-2aecf8e4><div class="w-8 h-8 rounded-lg border border-gray-300" style="${ssrRenderStyle({ backgroundColor: localConfig.value.widget.primaryColor })}"${ssrRenderAttr("title", `Principal: ${localConfig.value.widget.primaryColor}`)} data-v-2aecf8e4></div><div class="w-8 h-8 rounded-lg border border-gray-300" style="${ssrRenderStyle({ backgroundColor: adjustColor(localConfig.value.widget.primaryColor, -20) })}"${ssrRenderAttr("title", `Fonc\xE9: ${adjustColor(localConfig.value.widget.primaryColor, -20)}`)} data-v-2aecf8e4></div><div class="w-8 h-8 rounded-lg border border-gray-300" style="${ssrRenderStyle({ backgroundColor: adjustColor(localConfig.value.widget.primaryColor, 80) })}"${ssrRenderAttr("title", `Clair: ${adjustColor(localConfig.value.widget.primaryColor, 80)}`)} data-v-2aecf8e4></div></div></div><div data-v-2aecf8e4><p class="text-sm text-gray-600 mb-2" data-v-2aecf8e4>Responsive :</p><div class="flex items-center space-x-2 text-xs" data-v-2aecf8e4><div class="flex items-center" data-v-2aecf8e4><svg class="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-2aecf8e4></path></svg><span data-v-2aecf8e4>Desktop</span></div><div class="flex items-center" data-v-2aecf8e4><svg class="${ssrRenderClass([localConfig.value.widget.mobileOptimized ? "text-green-600" : "text-gray-400", "w-4 h-4 mr-1"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-2aecf8e4></path></svg><span data-v-2aecf8e4>Mobile</span></div></div></div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4" data-v-2aecf8e4>\u{1F527} Informations</h3><div class="space-y-3 text-sm" data-v-2aecf8e4><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Th\xE8me:</span><span class="capitalize" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.widget.theme)}</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Position:</span><span class="capitalize" data-v-2aecf8e4>${ssrInterpolate(getPositionLabel(localConfig.value.widget.position))}</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Taille:</span><span class="capitalize" data-v-2aecf8e4>${ssrInterpolate(getWidgetSizeLabel(localConfig.value.widget.widgetSize))}</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Agent li\xE9:</span><span class="text-blue-600" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.name)}</span></div><div class="flex justify-between" data-v-2aecf8e4><span class="font-medium" data-v-2aecf8e4>Statut:</span><span class="${ssrRenderClass(localConfig.value.widget.isActive ? "text-green-600" : "text-red-600")}" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.widget.isActive ? "\u{1F7E2} Actif" : "\u{1F534} Inactif")}</span></div></div><div class="mt-4 pt-4 border-t border-gray-200" data-v-2aecf8e4><div class="flex items-center justify-between" data-v-2aecf8e4><span class="text-sm font-medium" data-v-2aecf8e4>Widget actif</span><button class="${ssrRenderClass([
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            localConfig.value.widget.isActive ? "bg-blue-600" : "bg-gray-200"
          ])}" data-v-2aecf8e4><span class="${ssrRenderClass([
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            localConfig.value.widget.isActive ? "translate-x-5" : "translate-x-0"
          ])}" data-v-2aecf8e4></span></button></div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4" data-v-2aecf8e4>\u26A1 Actions</h3><div class="space-y-3" data-v-2aecf8e4><button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base" data-v-2aecf8e4> \u{1F9EA} Tester le Widget </button><button class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base" data-v-2aecf8e4> \u{1F504} R\xE9initialiser </button><button class="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm lg:text-base" data-v-2aecf8e4> \u{1F517} Obtenir le code </button></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeTab.value === "playground") {
          _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8" data-v-2aecf8e4><div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-96 lg:h-[600px]" data-v-2aecf8e4><div class="px-4 lg:px-6 py-3 lg:py-4 text-white" style="${ssrRenderStyle({ background: `linear-gradient(135deg, ${localConfig.value.widget.primaryColor} 0%, ${adjustColor(localConfig.value.widget.primaryColor, -20)} 100%)` })}" data-v-2aecf8e4><div class="flex items-center space-x-3" data-v-2aecf8e4><div class="w-8 lg:w-10 h-8 lg:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center" data-v-2aecf8e4><span class="text-xs lg:text-sm font-medium" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.name.charAt(0))}</span></div><div data-v-2aecf8e4><h4 class="font-medium text-sm lg:text-base" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.name)}</h4><p class="text-xs text-white text-opacity-90 flex items-center" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.title || unref(getTypeLabel)(localConfig.value.agent.type))} <span class="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.config.aiProvider === "claude" ? "\u{1F9E0} Claude" : "\u{1F916} OpenAI")}</span></p></div></div></div><div class="flex-1 p-3 lg:p-4 overflow-y-auto bg-gray-50" data-v-2aecf8e4><div class="space-y-3 lg:space-y-4" data-v-2aecf8e4><!--[-->`);
          ssrRenderList(testMessages.value, (message) => {
            var _a2;
            _push(`<div class="${ssrRenderClass([message.role === "user" ? "flex-row-reverse space-x-reverse" : "", "flex items-start space-x-2"])}" data-v-2aecf8e4><div class="${ssrRenderClass([
              "w-6 lg:w-8 h-6 lg:h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",
              message.role === "user" ? "bg-gray-500 text-white" : "text-white"
            ])}" style="${ssrRenderStyle(message.role === "assistant" ? { backgroundColor: localConfig.value.widget.primaryColor } : {})}" data-v-2aecf8e4>${ssrInterpolate(message.role === "user" ? "V" : localConfig.value.agent.name.charAt(0))}</div><div class="${ssrRenderClass([
              "max-w-xs p-2 lg:p-3 rounded-lg text-xs lg:text-sm",
              message.role === "user" ? "bg-gray-500 text-white rounded-tr-sm" : "bg-white border border-gray-200 rounded-tl-sm"
            ])}" data-v-2aecf8e4>`);
            if (message.loading) {
              _push(`<div class="flex items-center" data-v-2aecf8e4><svg class="${ssrRenderClass([message.role === "user" ? "text-white" : "text-blue-600", "animate-spin h-3 w-3 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-2aecf8e4></path></svg><span class="text-xs text-gray-500 mr-2" data-v-2aecf8e4>${ssrInterpolate(agentName.value)} est en train d&#39;\xE9crire...</span></div>`);
            } else {
              _push(`<div data-v-2aecf8e4>`);
              if (message.role === "assistant") {
                _push(`<div class="message-formatted leading-relaxed" data-v-2aecf8e4>${(_a2 = formatMessage(message.content)) != null ? _a2 : ""}</div>`);
              } else {
                _push(`<div data-v-2aecf8e4>${ssrInterpolate(message.content)}</div>`);
              }
              if (message.role === "assistant" && message.provider) {
                _push(`<div class="text-xs opacity-70 mt-1" data-v-2aecf8e4>${ssrInterpolate(message.provider === "claude" ? "\u{1F9E0}" : "\u{1F916}")} ${ssrInterpolate(message.responseTime)}ms </div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div><div class="p-3 lg:p-4 border-t border-gray-200 bg-white" data-v-2aecf8e4><div class="flex space-x-2" data-v-2aecf8e4><input${ssrRenderAttr("value", testMessage.value)} type="text" placeholder="Tapez votre message de test..." class="flex-1 px-2 lg:px-3 py-1 lg:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs lg:text-sm"${ssrIncludeBooleanAttr(sendingTestMessage.value) ? " disabled" : ""} data-v-2aecf8e4><button${ssrIncludeBooleanAttr(!testMessage.value.trim() || sendingTestMessage.value) ? " disabled" : ""} class="px-3 lg:px-4 py-1 lg:py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 text-xs lg:text-sm" style="${ssrRenderStyle({ backgroundColor: localConfig.value.widget.primaryColor })}" data-v-2aecf8e4>`);
          if (!sendingTestMessage.value) {
            _push(`<svg class="w-3 lg:w-4 h-3 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" data-v-2aecf8e4></path></svg>`);
          } else {
            _push(`<svg class="w-3 lg:w-4 h-3 lg:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-2aecf8e4></path></svg>`);
          }
          _push(`</button></div></div></div><div class="space-y-6" data-v-2aecf8e4><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4" data-v-2aecf8e4>\u{1F916} Status IA</h3><div class="space-y-3 text-sm" data-v-2aecf8e4><div class="flex justify-between" data-v-2aecf8e4><span data-v-2aecf8e4>Provider:</span><span class="font-medium capitalize" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.config.aiProvider === "claude" ? "\u{1F9E0} Claude Sonnet" : "\u{1F916} OpenAI GPT-4o-mini")}</span></div><div class="flex justify-between" data-v-2aecf8e4><span data-v-2aecf8e4>Temp\xE9rature:</span><span class="font-medium" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.config.temperature || 0.7)}</span></div><div class="flex justify-between" data-v-2aecf8e4><span data-v-2aecf8e4>Max Tokens:</span><span class="font-medium" data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.config.maxTokens || 1e3)}</span></div><div class="flex justify-between" data-v-2aecf8e4><span data-v-2aecf8e4>Base KB:</span><span class="font-medium text-blue-600" data-v-2aecf8e4>${ssrInterpolate(linkedKnowledgeBase.value.length)} docs li\xE9s</span></div></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4" data-v-2aecf8e4>\u{1F3AF} Sc\xE9narios de Test</h3><div class="space-y-2" data-v-2aecf8e4><!--[-->`);
          ssrRenderList(testScenarios, (scenario) => {
            _push(`<button class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"${ssrIncludeBooleanAttr(sendingTestMessage.value) ? " disabled" : ""} data-v-2aecf8e4><div class="font-medium" data-v-2aecf8e4>${ssrInterpolate(scenario.title)}</div><div class="text-xs text-gray-500" data-v-2aecf8e4>${ssrInterpolate(scenario.description)}</div></button>`);
          });
          _push(`<!--]--></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6" data-v-2aecf8e4><h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4" data-v-2aecf8e4>\u{1F4CA} Performance Test</h3><div class="space-y-3 text-sm" data-v-2aecf8e4><div class="flex justify-between" data-v-2aecf8e4><span data-v-2aecf8e4>Messages envoy\xE9s:</span><span class="font-medium" data-v-2aecf8e4>${ssrInterpolate(testMessages.value.filter((m) => m.role === "user").length)}</span></div><div class="flex justify-between" data-v-2aecf8e4><span data-v-2aecf8e4>R\xE9ponses IA:</span><span class="font-medium" data-v-2aecf8e4>${ssrInterpolate(testMessages.value.filter((m) => m.role === "assistant" && !m.loading).length)}</span></div><div class="flex justify-between" data-v-2aecf8e4><span data-v-2aecf8e4>Temps moyen:</span><span class="font-medium" data-v-2aecf8e4>${ssrInterpolate(averageResponseTime.value)}ms</span></div></div><div class="mt-4" data-v-2aecf8e4><button class="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm lg:text-base" data-v-2aecf8e4> \u{1F504} R\xE9initialiser </button></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeTab.value === "integration") {
          _push(`<div class="max-w-4xl mx-auto" data-v-2aecf8e4><div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8" data-v-2aecf8e4><h3 class="text-xl lg:text-2xl font-semibold text-gray-900 mb-4 lg:mb-6" data-v-2aecf8e4>\u{1F517} Guide d&#39;Int\xE9gration</h3><div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 lg:mb-8" data-v-2aecf8e4><div class="flex" data-v-2aecf8e4><div class="flex-shrink-0" data-v-2aecf8e4><svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" data-v-2aecf8e4><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" data-v-2aecf8e4></path></svg></div><div class="ml-3" data-v-2aecf8e4><h3 class="text-sm font-medium text-blue-800" data-v-2aecf8e4>Instructions d&#39;installation</h3><div class="mt-2 text-sm text-blue-700" data-v-2aecf8e4><p data-v-2aecf8e4>Vendeur IA: <strong data-v-2aecf8e4>${ssrInterpolate(localConfig.value.agent.name)}</strong> \u2022 Widget: <strong data-v-2aecf8e4>${ssrInterpolate(localConfig.value.widget.buttonText)}</strong></p><p data-v-2aecf8e4>Copiez le code ci-dessous et collez-le juste avant la balise <code data-v-2aecf8e4>&lt;/body&gt;</code> de votre site web.</p></div></div></div></div><div class="space-y-6 lg:space-y-8" data-v-2aecf8e4><div class="border-l-4 border-blue-500 pl-4 lg:pl-6" data-v-2aecf8e4><h4 class="text-base lg:text-lg font-medium text-gray-900 mb-3" data-v-2aecf8e4>1. Code d&#39;int\xE9gration JavaScript</h4><div class="relative" data-v-2aecf8e4><div class="bg-gray-900 rounded-lg p-3 lg:p-4 overflow-x-auto max-h-80" data-v-2aecf8e4><pre class="text-green-400 text-xs lg:text-sm whitespace-pre-wrap" data-v-2aecf8e4><code data-v-2aecf8e4>${ssrInterpolate(unref(integrationCode))}</code></pre></div><button class="absolute top-3 lg:top-4 right-3 lg:right-4 inline-flex items-center px-2 lg:px-3 py-1 border border-gray-600 text-xs font-medium rounded text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors" data-v-2aecf8e4><svg class="w-3 lg:w-4 h-3 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" data-v-2aecf8e4></path></svg> ${ssrInterpolate(codeCopied.value ? "Copi\xE9 !" : "Copier")}</button></div></div><div class="border-l-4 border-green-500 pl-4 lg:pl-6" data-v-2aecf8e4><h4 class="text-base lg:text-lg font-medium text-gray-900 mb-3" data-v-2aecf8e4>2. Instructions par plateforme</h4><div class="flex flex-wrap space-x-1 bg-gray-100 p-1 rounded-lg mb-4" data-v-2aecf8e4><!--[-->`);
          ssrRenderList(platforms, (platform) => {
            _push(`<button class="${ssrRenderClass([
              "px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap",
              activePlatform.value === platform.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            ])}" data-v-2aecf8e4>${ssrInterpolate(platform.icon)} ${ssrInterpolate(platform.name)}</button>`);
          });
          _push(`<!--]--></div><div class="bg-gray-50 rounded-lg p-4" data-v-2aecf8e4>`);
          if (activePlatform.value === "shopify") {
            _push(`<div data-v-2aecf8e4><h5 class="font-medium text-gray-900 mb-2" data-v-2aecf8e4>\u{1F7E2} Shopify</h5><ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside" data-v-2aecf8e4><li data-v-2aecf8e4>Allez dans votre admin Shopify</li><li data-v-2aecf8e4>Th\xE8me \u2192 Actions \u2192 Modifier le code</li><li data-v-2aecf8e4>Ouvrez le fichier <code data-v-2aecf8e4>theme.liquid</code></li><li data-v-2aecf8e4>Collez le code juste avant <code data-v-2aecf8e4>&lt;/body&gt;</code></li><li data-v-2aecf8e4>Sauvegardez et testez</li></ol></div>`);
          } else if (activePlatform.value === "wordpress") {
            _push(`<div data-v-2aecf8e4><h5 class="font-medium text-gray-900 mb-2" data-v-2aecf8e4>\u{1F535} WordPress</h5><ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside" data-v-2aecf8e4><li data-v-2aecf8e4>Allez dans votre admin WordPress</li><li data-v-2aecf8e4>Apparence \u2192 \xC9diteur de th\xE8me</li><li data-v-2aecf8e4>Ouvrez le fichier <code data-v-2aecf8e4>footer.php</code></li><li data-v-2aecf8e4>Collez le code juste avant <code data-v-2aecf8e4>&lt;/body&gt;</code></li><li data-v-2aecf8e4>Mettez \xE0 jour le fichier</li></ol></div>`);
          } else if (activePlatform.value === "woocommerce") {
            _push(`<div data-v-2aecf8e4><h5 class="font-medium text-gray-900 mb-2" data-v-2aecf8e4>\u{1F7E0} WooCommerce</h5><ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside" data-v-2aecf8e4><li data-v-2aecf8e4>M\xEAme processus que WordPress</li><li data-v-2aecf8e4>Ou utilisez un plugin comme &quot;Insert Headers and Footers&quot;</li><li data-v-2aecf8e4>Collez le code dans la section &quot;Scripts in Footer&quot;</li><li data-v-2aecf8e4>Sauvegardez les param\xE8tres</li></ol></div>`);
          } else {
            _push(`<div data-v-2aecf8e4><h5 class="font-medium text-gray-900 mb-2" data-v-2aecf8e4>\u{1F310} Site personnalis\xE9</h5><ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside" data-v-2aecf8e4><li data-v-2aecf8e4>Ouvrez le fichier HTML de votre page</li><li data-v-2aecf8e4>Collez le code juste avant <code data-v-2aecf8e4>&lt;/body&gt;</code></li><li data-v-2aecf8e4>R\xE9p\xE9tez pour toutes les pages o\xF9 vous voulez le widget</li><li data-v-2aecf8e4>Uploadez les fichiers modifi\xE9s</li></ol></div>`);
          }
          _push(`</div></div><div class="border-l-4 border-purple-500 pl-4 lg:pl-6" data-v-2aecf8e4><h4 class="text-base lg:text-lg font-medium text-gray-900 mb-3" data-v-2aecf8e4>3. Test et validation</h4><div class="space-y-3 text-sm text-gray-600" data-v-2aecf8e4><p data-v-2aecf8e4><strong data-v-2aecf8e4>\u2705 V\xE9rifications \xE0 faire:</strong></p><ul class="list-disc list-inside space-y-1 ml-4" data-v-2aecf8e4><li data-v-2aecf8e4>Le bouton &quot;${ssrInterpolate(localConfig.value.widget.buttonText)}&quot; appara\xEEt sur votre page</li><li data-v-2aecf8e4>Le chat s&#39;ouvre quand vous cliquez sur le bouton</li><li data-v-2aecf8e4>L&#39;agent &quot;${ssrInterpolate(localConfig.value.agent.name)}&quot; r\xE9pond \xE0 vos messages</li><li data-v-2aecf8e4>La couleur du widget correspond \xE0 ${ssrInterpolate(localConfig.value.widget.primaryColor)}</li><li data-v-2aecf8e4>Les documents de la base de connaissances sont pris en compte (${ssrInterpolate(linkedKnowledgeBase.value.length)} docs)</li></ul></div><div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4" data-v-2aecf8e4><p class="text-sm text-yellow-800" data-v-2aecf8e4> \u{1F4A1} <strong data-v-2aecf8e4>Astuce:</strong> Utilisez un navigateur en mode incognito pour tester comme un vrai visiteur. </p></div></div></div><div class="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg" data-v-2aecf8e4><h4 class="font-medium text-blue-900 mb-2" data-v-2aecf8e4>\u{1F198} Besoin d&#39;aide ?</h4><p class="text-sm text-blue-800" data-v-2aecf8e4> Notre \xE9quipe peut vous aider avec l&#39;int\xE9gration. Contactez-nous \xE0 <a href="mailto:support@chatseller.app" class="underline font-medium" data-v-2aecf8e4>support@chatseller.app</a></p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (showKnowledgeBaseModal.value) {
          _push(`<div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" data-v-2aecf8e4><div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col" data-v-2aecf8e4><div class="p-6 border-b border-gray-200" data-v-2aecf8e4><div class="flex items-center justify-between" data-v-2aecf8e4><h3 class="text-lg font-semibold text-gray-900" data-v-2aecf8e4>\u{1F4DA} G\xE9rer la Base de Connaissances</h3><button class="text-gray-400 hover:text-gray-600" data-v-2aecf8e4><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-2aecf8e4></path></svg></button></div><p class="text-sm text-gray-600 mt-2" data-v-2aecf8e4> S\xE9lectionnez les documents que votre agent doit utiliser pour r\xE9pondre aux questions. </p></div><div class="flex-1 p-6 overflow-y-auto" data-v-2aecf8e4>`);
          if (unref(knowledgeBaseLoading)) {
            _push(`<div class="text-center py-8" data-v-2aecf8e4><svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-2aecf8e4></path></svg><p class="text-gray-600" data-v-2aecf8e4>Chargement des documents...</p></div>`);
          } else if (availableKnowledgeBase.value.length === 0) {
            _push(`<div class="text-center py-8" data-v-2aecf8e4><svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-2aecf8e4></path></svg><p class="text-gray-600 mb-2" data-v-2aecf8e4>Aucun document disponible</p><p class="text-gray-500 text-sm" data-v-2aecf8e4><a href="/knowledge-base" class="text-blue-600 hover:text-blue-800 underline" data-v-2aecf8e4> Cr\xE9ez d&#39;abord des documents </a> dans votre base de connaissances </p></div>`);
          } else {
            _push(`<div class="space-y-3" data-v-2aecf8e4><!--[-->`);
            ssrRenderList(availableKnowledgeBase.value, (doc) => {
              _push(`<div class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50" data-v-2aecf8e4><input${ssrIncludeBooleanAttr(Array.isArray(selectedKnowledgeBase.value) ? ssrLooseContain(selectedKnowledgeBase.value, doc.id) : selectedKnowledgeBase.value) ? " checked" : ""}${ssrRenderAttr("value", doc.id)} type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" data-v-2aecf8e4><div class="flex-1 min-w-0" data-v-2aecf8e4><p class="text-sm font-medium text-gray-900 truncate" data-v-2aecf8e4>${ssrInterpolate(doc.title)}</p><p class="text-xs text-gray-500" data-v-2aecf8e4>${ssrInterpolate(getContentTypeLabel(doc.contentType))}</p><div class="flex items-center mt-1 space-x-2" data-v-2aecf8e4><!--[-->`);
              ssrRenderList(doc.tags.slice(0, 3), (tag) => {
                _push(`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" data-v-2aecf8e4>${ssrInterpolate(tag)}</span>`);
              });
              _push(`<!--]-->`);
              if (doc.tags.length > 3) {
                _push(`<span class="text-xs text-gray-500" data-v-2aecf8e4>+${ssrInterpolate(doc.tags.length - 3)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div><span class="${ssrRenderClass([
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                doc.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              ])}" data-v-2aecf8e4>${ssrInterpolate(doc.isActive ? "Actif" : "Inactif")}</span></div>`);
            });
            _push(`<!--]--></div>`);
          }
          _push(`</div><div class="p-6 border-t border-gray-200" data-v-2aecf8e4><div class="flex justify-between" data-v-2aecf8e4><p class="text-sm text-gray-600" data-v-2aecf8e4>${ssrInterpolate(selectedKnowledgeBase.value.length)} document(s) s\xE9lectionn\xE9(s) </p><div class="flex space-x-3" data-v-2aecf8e4><button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" data-v-2aecf8e4> Annuler </button><button${ssrIncludeBooleanAttr(savingKnowledgeBase.value) ? " disabled" : ""} class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50" data-v-2aecf8e4>${ssrInterpolate(savingKnowledgeBase.value ? "Sauvegarde..." : "Sauvegarder")}</button></div></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (codeCopied.value) {
          _push(`<div class="fixed bottom-4 right-4 bg-green-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg shadow-lg z-50" data-v-2aecf8e4><div class="flex items-center" data-v-2aecf8e4><svg class="w-4 lg:w-5 h-4 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-2aecf8e4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-2aecf8e4></path></svg><span class="text-sm lg:text-base" data-v-2aecf8e4>Code d&#39;int\xE9gration copi\xE9 !</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/agent-config.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const agentConfig = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2aecf8e4"]]);

export { agentConfig as default };
//# sourceMappingURL=agent-config-CglbTIyw.mjs.map
