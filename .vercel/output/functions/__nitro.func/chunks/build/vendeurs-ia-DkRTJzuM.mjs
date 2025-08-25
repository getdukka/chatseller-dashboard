import { _ as __nuxt_component_0 } from './nuxt-link-BKRsJ075.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createBlock, createTextVNode, openBlock, createVNode, computed, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as useAuthStore } from './auth-KgQDcdck.mjs';
import { u as useHead, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import './useSupabase-CFkBc_As.mjs';
import '@supabase/supabase-js';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import '@heroicons/vue/24/outline';

const useAgents = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const agents = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const planDetails = computed(() => {
    return authStore.planDetails || {
      name: "Free",
      agentLimit: 1,
      knowledgeBaseLimit: 1,
      features: [],
      isActive: true,
      isTrial: true,
      trialDaysLeft: 7,
      trialEndDate: null,
      hasExpired: false
    };
  });
  const subscriptionPlan = computed(() => {
    var _a, _b;
    return ((_b = (_a = authStore.user) == null ? void 0 : _a.shop) == null ? void 0 : _b.subscription_plan) || "free";
  });
  const isPaidUser = computed(() => {
    const plan = subscriptionPlan.value;
    return plan === "starter" || plan === "pro" || plan === "professional" || plan === "enterprise";
  });
  const hasActiveAccess = computed(() => {
    return planDetails.value.isActive && !planDetails.value.hasExpired;
  });
  const trialExpired = computed(() => {
    return subscriptionPlan.value === "free" && planDetails.value.hasExpired;
  });
  const activeAgents = computed(() => {
    if (trialExpired.value) return [];
    return agents.value.filter((agent) => agent.isActive);
  });
  const canCreateAgent = computed(() => {
    if (trialExpired.value) return false;
    const limit = planDetails.value.agentLimit;
    return limit === -1 || agents.value.length < limit;
  });
  const planLimitReached = computed(() => {
    const limit = planDetails.value.agentLimit;
    return limit !== -1 && agents.value.length >= limit;
  });
  const canConfigureAgents = computed(() => {
    return hasActiveAccess.value;
  });
  const canTestAgents = computed(() => {
    return hasActiveAccess.value;
  });
  const getAuthHeaders = () => {
    if (!authStore.token) {
      console.error("\u274C [useAgents] Token manquant - redirection vers login");
      navigateTo("/login");
      throw new Error("\u{1F510} Session expir\xE9e. Redirection vers la connexion...");
    }
    return {
      "Authorization": `Bearer ${authStore.token}`,
      "Content-Type": "application/json"
    };
  };
  const handleApiError = (err, defaultMessage) => {
    var _a;
    console.error("\u274C [useAgents] API Error:", err);
    let errorMessage = defaultMessage;
    if (err.status === 401 || err.statusCode === 401) {
      authStore.clearAuth();
      errorMessage = "\u{1F510} Session expir\xE9e. Veuillez vous reconnecter.";
      navigateTo("/login");
    } else if (err.status === 403 || err.statusCode === 403) {
      errorMessage = "\u{1F6AB} Acc\xE8s refus\xE9. V\xE9rifiez vos permissions ou votre plan.";
    } else if (((_a = err.data) == null ? void 0 : _a.error) && typeof err.data.error === "string") {
      errorMessage = err.data.error;
    } else if (err.message && typeof err.message === "string") {
      errorMessage = err.message;
    } else if (err.statusText && typeof err.statusText === "string") {
      errorMessage = `Erreur ${err.status || "API"}: ${err.statusText}`;
    }
    error.value = errorMessage;
    return { success: false, error: errorMessage };
  };
  const checkApiAvailable = async () => {
    try {
      console.log("\u{1F50D} [useAgents] Test API URL:", config.public.apiBaseUrl);
      const apiUrl = config.public.apiBaseUrl || "http://localhost:3001";
      console.log("\u{1F50D} [useAgents] URL finale utilis\xE9e:", apiUrl);
      const response = await $fetch("/health", {
        baseURL: apiUrl,
        timeout: 5e3
      });
      console.log("\u2705 [useAgents] R\xE9ponse health check:", response);
      if ((response == null ? void 0 : response.status) === "ok") {
        console.log("\u2705 [useAgents] API disponible:", apiUrl);
        return true;
      }
      console.warn("\u26A0\uFE0F [useAgents] API r\xE9pond mais status incorrect:", response);
      return false;
    } catch (error2) {
      console.error("\u274C [useAgents] API indisponible:", error2);
      console.error("\u274C [useAgents] URL test\xE9e:", config.public.apiBaseUrl);
      console.error("\u274C [useAgents] Erreur d\xE9tails:", error2.message);
      throw new Error(`
\u{1F6A8} Impossible de contacter l'API ChatSeller

URL test\xE9e: ${config.public.apiBaseUrl || "NON CONFIGUR\xC9E"}
Erreur: ${error2.message}

Solutions possibles:
1. V\xE9rifiez que votre serveur API tourne sur http://localhost:3001
2. V\xE9rifiez la variable NUXT_PUBLIC_API_BASE_URL dans votre .env
3. Red\xE9marrez le serveur Dashboard apr\xE8s modification du .env
    `);
    }
  };
  const fetchAgents = async () => {
    loading.value = true;
    error.value = null;
    try {
      console.log("\u{1F50D} [useAgents] === D\xC9BUT R\xC9CUP\xC9RATION AGENTS ===");
      console.log("\u{1F50D} [useAgents] Config API URL:", config.public.apiBaseUrl);
      console.log("\u{1F50D} [useAgents] Token pr\xE9sent:", !!authStore.token);
      await checkApiAvailable();
      const apiUrl = config.public.apiBaseUrl || "http://localhost:3001";
      console.log("\u{1F50D} [useAgents] Appel API vers:", `${apiUrl}/api/v1/agents`);
      const response = await $fetch("/api/v1/agents", {
        baseURL: apiUrl,
        headers: getAuthHeaders(),
        timeout: 1e4
      });
      console.log("\u{1F4E6} [useAgents] R\xE9ponse API compl\xE8te:", response);
      if (response.success && Array.isArray(response.data)) {
        agents.value = response.data;
        console.log(`\u2705 [useAgents] ${response.data.length} agents r\xE9cup\xE9r\xE9s depuis l'API`);
        const limit = planDetails.value.agentLimit;
        console.log(`\u{1F4CA} [useAgents] Plan ${planDetails.value.name}: ${agents.value.length}/${limit === -1 ? "\u221E" : limit} agents`);
        return { success: true, data: response.data };
      } else {
        console.error("\u274C [useAgents] R\xE9ponse API invalide:", response);
        throw new Error(response.error || "R\xE9ponse API invalide - format incorrect");
      }
    } catch (err) {
      console.error("\u274C [useAgents] Erreur compl\xE8te:", err);
      console.error("\u274C [useAgents] Stack trace:", err.stack);
      return handleApiError(err, "Erreur lors de la r\xE9cup\xE9ration des agents");
    } finally {
      loading.value = false;
    }
  };
  const createAgent = async (data) => {
    var _a, _b, _c, _d, _e, _f, _g;
    saving.value = true;
    error.value = null;
    try {
      console.log("\u{1F3D7}\uFE0F [useAgents] Cr\xE9ation agent via API pure:", data.name);
      if (!((_a = data.name) == null ? void 0 : _a.trim())) {
        throw new Error("Le nom de l'agent est requis");
      }
      if (!((_b = data.welcomeMessage) == null ? void 0 : _b.trim())) {
        throw new Error("Le message d'accueil est requis");
      }
      if (!canCreateAgent.value) {
        const limit = planDetails.value.agentLimit;
        throw new Error(`\u274C Limite de votre plan atteinte (${limit} agent${limit > 1 ? "s" : ""} maximum). Passez au plan sup\xE9rieur pour cr\xE9er plus d'agents.`);
      }
      await checkApiAvailable();
      const payload = {
        name: data.name.trim(),
        title: ((_c = data.title) == null ? void 0 : _c.trim()) || void 0,
        // ✅ NOUVEAU: Title personnalisable
        type: data.type,
        personality: data.personality,
        description: ((_d = data.description) == null ? void 0 : _d.trim()) || null,
        welcomeMessage: data.welcomeMessage.trim(),
        fallbackMessage: ((_e = data.fallbackMessage) == null ? void 0 : _e.trim()) || null,
        avatar: data.avatar || null,
        isActive: (_f = data.isActive) != null ? _f : true,
        config: data.config || {},
        shopId: authStore.userShopId || ((_g = authStore.user) == null ? void 0 : _g.id)
      };
      console.log("\u{1F4E4} [useAgents] Payload envoy\xE9:", payload);
      const response = await $fetch("/api/v1/agents", {
        method: "POST",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: payload
      });
      console.log("\u{1F4E6} [useAgents] R\xE9ponse cr\xE9ation:", response);
      if (response.success && response.data) {
        agents.value.unshift(response.data);
        console.log(`\u2705 Agent cr\xE9\xE9 avec succ\xE8s: ${response.data.id}`);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Erreur lors de la cr\xE9ation de l'agent");
      }
    } catch (err) {
      return handleApiError(err, "Erreur lors de la cr\xE9ation de l'agent");
    } finally {
      saving.value = false;
    }
  };
  const updateAgent = async (id, data) => {
    saving.value = true;
    error.value = null;
    try {
      console.log("\u{1F4DD} [useAgents] Modification agent via API pure:", id);
      if (!id) {
        throw new Error("ID agent requis pour la modification");
      }
      await checkApiAvailable();
      const response = await $fetch(`/api/v1/agents/${id}`, {
        method: "PUT",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: data
      });
      if (response.success && response.data) {
        const index = agents.value.findIndex((agent) => agent.id === id);
        if (index !== -1) {
          agents.value[index] = { ...agents.value[index], ...response.data };
        }
        console.log(`\u2705 Agent modifi\xE9 avec succ\xE8s: ${id}`);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Erreur lors de la modification");
      }
    } catch (err) {
      return handleApiError(err, "Erreur lors de la modification de l'agent");
    } finally {
      saving.value = false;
    }
  };
  const deleteAgent = async (id) => {
    saving.value = true;
    error.value = null;
    try {
      console.log("\u{1F5D1}\uFE0F [useAgents] Suppression agent via API pure:", id);
      if (!id) {
        throw new Error("ID agent requis pour la suppression");
      }
      await checkApiAvailable();
      const response = await $fetch(`/api/v1/agents/${id}`, {
        method: "DELETE",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      });
      if (response.success) {
        agents.value = agents.value.filter((agent) => agent.id !== id);
        console.log(`\u2705 Agent supprim\xE9 avec succ\xE8s: ${id}`);
        return { success: true };
      } else {
        throw new Error(response.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      return handleApiError(err, "Erreur lors de la suppression de l'agent");
    } finally {
      saving.value = false;
    }
  };
  const toggleAgentStatus = async (id, isActive) => {
    saving.value = true;
    error.value = null;
    try {
      console.log(`\u{1F504} [useAgents] ${isActive ? "Activation" : "D\xE9sactivation"} agent via API pure:`, id);
      await checkApiAvailable();
      const response = await $fetch(`/api/v1/agents/${id}/toggle`, {
        method: "PATCH",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { isActive }
      });
      if (response.success) {
        const index = agents.value.findIndex((agent) => agent.id === id);
        if (index !== -1) {
          agents.value[index].isActive = isActive;
          agents.value[index].updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        }
        console.log(`\u2705 Statut modifi\xE9: ${id} -> ${isActive ? "actif" : "inactif"}`);
        return { success: true };
      } else {
        throw new Error(response.error || "Erreur lors de la modification du statut");
      }
    } catch (err) {
      return handleApiError(err, "Erreur lors de la modification du statut");
    } finally {
      saving.value = false;
    }
  };
  const duplicateAgent = async (id) => {
    saving.value = true;
    error.value = null;
    try {
      console.log("\u{1F4CB} [useAgents] Duplication agent via API pure:", id);
      if (!canCreateAgent.value) {
        const limit = planDetails.value.agentLimit;
        throw new Error(`\u274C Limite de votre plan atteinte (${limit} agent${limit > 1 ? "s" : ""} maximum). Impossible de dupliquer.`);
      }
      await checkApiAvailable();
      const response = await $fetch(`/api/v1/agents/${id}/duplicate`, {
        method: "POST",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      });
      if (response.success && response.data) {
        agents.value.unshift(response.data);
        console.log(`\u2705 Agent dupliqu\xE9 avec succ\xE8s: ${response.data.id}`);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Erreur lors de la duplication");
      }
    } catch (err) {
      return handleApiError(err, "Erreur lors de la duplication de l'agent");
    } finally {
      saving.value = false;
    }
  };
  const getAgent = (id) => {
    return agents.value.find((agent) => agent.id === id) || null;
  };
  const getTypeLabel = (type) => {
    const labels = {
      general: "Vendeur g\xE9n\xE9raliste",
      product_specialist: "Sp\xE9cialiste produit",
      support: "Support & SAV",
      upsell: "Upsell & Cross-sell"
    };
    return labels[type] || type;
  };
  const getDefaultTitle = (type) => {
    const titles = {
      general: "Conseiller commercial",
      product_specialist: "Sp\xE9cialiste produit",
      support: "Conseiller support",
      upsell: "Conseiller premium"
    };
    return titles[type] || "Assistant commercial";
  };
  const getPersonalityLabel = (personality) => {
    const labels = {
      professional: "Professionnel",
      friendly: "Amical",
      expert: "Expert technique",
      casual: "D\xE9contract\xE9"
    };
    return labels[personality] || personality;
  };
  const getAgentIcon = (type) => {
    const icons = {
      general: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      product_specialist: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      support: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
      upsell: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    };
    return icons[type] || icons.general;
  };
  const getAvatarClass = (type) => {
    const classes = {
      general: "bg-blue-500",
      product_specialist: "bg-green-500",
      support: "bg-orange-500",
      upsell: "bg-purple-500"
    };
    return classes[type] || "bg-blue-500";
  };
  const getStatusBadgeClass = (isActive) => {
    if (trialExpired.value) {
      return "bg-red-100 text-red-800";
    }
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };
  const clearError = () => {
    error.value = null;
  };
  const testApiConnection = async () => {
    try {
      console.log("\u{1F50D} [useAgents] Test connexion API...");
      const response = await $fetch("/health", {
        baseURL: config.public.apiBaseUrl,
        timeout: 5e3
      });
      console.log("\u2705 [useAgents] API accessible:", response);
      return { success: true, data: response };
    } catch (err) {
      console.error("\u274C [useAgents] API inaccessible:", err);
      return { success: false, error: err.message || "API inaccessible" };
    }
  };
  return {
    // State
    agents: readonly(agents),
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    // Computed pour gestion plan
    planDetails: readonly(planDetails),
    subscriptionPlan,
    isPaidUser,
    hasActiveAccess,
    trialExpired,
    canConfigureAgents,
    canTestAgents,
    activeAgents,
    canCreateAgent,
    planLimitReached,
    // Actions
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus,
    duplicateAgent,
    testApiConnection,
    // Helpers
    getAgent,
    getTypeLabel,
    getDefaultTitle,
    // ✅ NOUVEAU
    getPersonalityLabel,
    getAgentIcon,
    getAvatarClass,
    getStatusBadgeClass,
    clearError
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "vendeurs-ia",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useRouter();
    const {
      agents,
      loading,
      saving,
      error,
      planDetails,
      subscriptionPlan,
      trialExpired,
      canCreateAgent,
      canConfigureAgents,
      canTestAgents,
      getTypeLabel,
      getAgentIcon,
      getAvatarClass,
      getStatusBadgeClass
    } = useAgents();
    const showCreateModal = ref(false);
    const editingAgent = ref(null);
    const activeAgentMenu = ref(null);
    const showTestModal = ref(false);
    const selectedAgent = ref(null);
    const generatingDescription = ref(false);
    const chatMessages = ref([]);
    const testMessage = ref("");
    const sendingMessage = ref(false);
    ref();
    const agentForm = ref({
      name: "",
      type: "general",
      personality: "professional",
      description: "",
      welcomeMessage: "",
      fallbackMessage: "",
      isActive: true
    });
    const agentTypes = ref([
      {
        value: "general",
        label: "Vendeur G\xE9n\xE9raliste",
        description: "Polyvalent, adapt\xE9 \xE0 tous types de produits",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        color: "bg-blue-500"
      },
      {
        value: "product_specialist",
        label: "Sp\xE9cialiste Produit",
        description: "Expert technique, recommandations pr\xE9cises",
        icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
        color: "bg-green-500"
      },
      {
        value: "support",
        label: "Support & SAV",
        description: "R\xE9sout les probl\xE8mes, rassure les clients",
        icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        color: "bg-orange-500"
      },
      {
        value: "upsell",
        label: "Upsell & Cross-sell",
        description: "Optimise le panier, propose des compl\xE9ments",
        icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
        color: "bg-purple-500"
      }
    ]);
    const personalityOptions = ref([
      {
        value: "professional",
        label: "Professionnel",
        description: "Formel, expert",
        emoji: "\u{1F4BC}"
      },
      {
        value: "friendly",
        label: "Amical",
        description: "Chaleureux, accessible",
        emoji: "\u{1F60A}"
      },
      {
        value: "expert",
        label: "Expert technique",
        description: "Tr\xE8s technique, pr\xE9cis",
        emoji: "\u{1F527}"
      },
      {
        value: "casual",
        label: "D\xE9contract\xE9",
        description: "Cool, moderne",
        emoji: "\u{1F60E}"
      }
    ]);
    const getNamePlaceholder = () => {
      const examples = {
        general: "Ex: Assistant Commercial Sophie",
        product_specialist: "Ex: Expert Tech Marc",
        support: "Ex: Support Client Julie",
        upsell: "Ex: Conseiller Premium Lisa"
      };
      return examples[agentForm.value.type] || "Ex: Votre Vendeur IA";
    };
    const getNameExamples = () => {
      const examples = {
        general: "Sophie, Marc, Assistant Vente",
        product_specialist: "Expert Tech, Conseiller Pro, Sp\xE9cialiste",
        support: "Support Client, Aide Premium, Assistant SAV",
        upsell: "Conseiller Plus, Premium Assistant, VIP Support"
      };
      return examples[agentForm.value.type] || "Sophie, Marc, Lisa";
    };
    const getDescriptionPlaceholder = () => {
      const templates = {
        general: "Vendeur IA polyvalent capable d'accompagner les clients dans tous leurs achats. Expertise transversale sur l'ensemble du catalogue produits.",
        product_specialist: "Expert technique sp\xE9cialis\xE9 dans [votre secteur]. Ma\xEEtrise parfaite des sp\xE9cifications produits et des besoins clients avanc\xE9s.",
        support: "Sp\xE9cialiste support et service apr\xE8s-vente. R\xE9sout les probl\xE8mes clients et transforme les objections en opportunit\xE9s de vente.",
        upsell: "Expert en optimisation panier et ventes additionnelles. Identifie les besoins compl\xE9mentaires pour maximiser la valeur client."
      };
      return templates[agentForm.value.type] || "D\xE9crivez le r\xF4le de votre vendeur IA...";
    };
    const getWelcomeMessagePlaceholder = () => {
      const personality = agentForm.value.personality;
      const name = agentForm.value.name || "Votre conseiller";
      const templates = {
        professional: `Bonjour, je suis ${name}. Comment puis-je vous accompagner dans votre achat aujourd'hui ?`,
        friendly: `Salut ! \u{1F44B} Je suis ${name}, votre conseiller. Une question sur nos produits ?`,
        expert: `Bonjour, ${name} \xE0 votre service. Je suis l\xE0 pour vous guider techniquement. Que recherchez-vous ?`,
        casual: `Hey ! C'est ${name} \u{1F60A} Besoin d'un coup de main pour choisir ?`
      };
      return templates[personality] || `Bonjour ! Je suis ${name}. Comment puis-je vous aider ?`;
    };
    useHead({
      title: "Vendeurs IA - ChatSeller Dashboard"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-c2ae9c8e><div class="bg-white shadow-sm border-b border-gray-200" data-v-c2ae9c8e><div class="px-8 py-6" data-v-c2ae9c8e><div class="flex items-center justify-between" data-v-c2ae9c8e><div data-v-c2ae9c8e><h1 class="text-3xl font-bold text-gray-900" data-v-c2ae9c8e>Vendeurs IA</h1><p class="mt-2 text-gray-600" data-v-c2ae9c8e> G\xE9rez vos agents IA commerciaux et leurs performances </p></div><div class="flex items-center space-x-4" data-v-c2ae9c8e><button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors" data-v-c2ae9c8e><svg class="${ssrRenderClass([{ "animate-spin": unref(loading) }, "w-4 h-4 mr-2"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-c2ae9c8e></path></svg> ${ssrInterpolate(unref(loading) ? "Actualisation..." : "Actualiser")}</button><button${ssrIncludeBooleanAttr(!unref(canCreateAgent) || unref(trialExpired)) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${ssrRenderAttr("title", !unref(canCreateAgent) ? `Plan ${unref(subscriptionPlan)} limit\xE9 \xE0 ${unref(planDetails).agentLimit} agent(s)` : unref(trialExpired) ? "Essai gratuit expir\xE9" : "")} data-v-c2ae9c8e><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-c2ae9c8e></path></svg> Cr\xE9er un Vendeur IA </button></div></div></div></div><div class="mx-8 mt-4 mb-6" data-v-c2ae9c8e>`);
      if (unref(trialExpired)) {
        _push(`<div class="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg overflow-hidden" data-v-c2ae9c8e><div class="px-8 py-6 text-white relative" data-v-c2ae9c8e><div class="flex items-center justify-between" data-v-c2ae9c8e><div data-v-c2ae9c8e><h2 class="text-xl font-bold mb-2 flex items-center" data-v-c2ae9c8e> \u23F0 Essai gratuit termin\xE9 </h2><p class="text-red-100 text-base mb-4" data-v-c2ae9c8e> Votre p\xE9riode d&#39;essai de 7 jours est termin\xE9e. Vos Vendeurs IA et Widgets sont maintenant <strong data-v-c2ae9c8e>d\xE9sactiv\xE9s</strong>. </p><div class="flex flex-wrap gap-3" data-v-c2ae9c8e>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/billing",
          class: "inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-v-c2ae9c8e${_scopeId}></path></svg> Passer au plan Starter - 14\u20AC/mois `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  })
                ])),
                createTextVNode(" Passer au plan Starter - 14\u20AC/mois ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div>`);
      } else if (unref(subscriptionPlan) === "starter") {
        _push(`<div class="bg-gradient-to-r from-blue-700 to-purple-500 rounded-xl shadow-lg overflow-hidden" data-v-c2ae9c8e><div class="px-8 py-6 text-white relative" data-v-c2ae9c8e><div class="flex items-center justify-between" data-v-c2ae9c8e><div data-v-c2ae9c8e><h2 class="text-xl font-bold mb-2" data-v-c2ae9c8e>\u26A1 Plan Starter - Limit\xE9 \xE0 1 Vendeur IA</h2><p class="text-blue-100 text-base mb-4" data-v-c2ae9c8e> Passez au plan Pro pour cr\xE9er jusqu&#39;\xE0 3 Vendeurs IA sp\xE9cialis\xE9s et d\xE9bloquer toutes les fonctionnalit\xE9s avanc\xE9es. </p><div class="flex flex-wrap gap-3" data-v-c2ae9c8e>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/billing",
          class: "inline-flex items-center px-6 py-3 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all backdrop-blur-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-v-c2ae9c8e${_scopeId}></path></svg> Passer au Pro - 29\u20AC/mois `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  })
                ])),
                createTextVNode(" Passer au Pro - 29\u20AC/mois ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div>`);
      } else if (unref(subscriptionPlan) === "free" && unref(planDetails).trialDaysLeft && unref(planDetails).trialDaysLeft > 0) {
        _push(`<div class="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg overflow-hidden" data-v-c2ae9c8e><div class="px-8 py-6 text-white relative" data-v-c2ae9c8e><div class="flex items-center justify-between" data-v-c2ae9c8e><div data-v-c2ae9c8e><h2 class="text-xl font-bold mb-2" data-v-c2ae9c8e>\u{1F389} Essai gratuit actif</h2><p class="text-green-100 text-base mb-4" data-v-c2ae9c8e> Encore <strong data-v-c2ae9c8e>${ssrInterpolate(unref(planDetails).trialDaysLeft)} jour${ssrInterpolate(unref(planDetails).trialDaysLeft > 1 ? "s" : "")}</strong> pour profiter de toutes les fonctionnalit\xE9s Starter gratuitement ! </p><div class="flex flex-wrap gap-3" data-v-c2ae9c8e>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/billing",
          class: "inline-flex items-center px-6 py-3 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all backdrop-blur-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-v-c2ae9c8e${_scopeId}></path></svg> Passer au plan payant `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  })
                ])),
                createTextVNode(" Passer au plan payant ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="hidden lg:block" data-v-c2ae9c8e><div class="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm" data-v-c2ae9c8e><span class="text-2xl font-bold" data-v-c2ae9c8e>${ssrInterpolate(unref(planDetails).trialDaysLeft)}</span></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border-l-4 border-red-400 mx-8 mt-4 rounded-r-lg" data-v-c2ae9c8e><div class="flex items-center justify-between" data-v-c2ae9c8e><div class="flex" data-v-c2ae9c8e><svg class="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-c2ae9c8e></path></svg><p class="text-red-700 text-sm" data-v-c2ae9c8e>${ssrInterpolate(unref(error))}</p></div><button class="text-red-400 hover:text-red-600 transition-colors" data-v-c2ae9c8e><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-c2ae9c8e></path></svg></button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="p-8" data-v-c2ae9c8e>`);
      if (unref(loading) && unref(agents).length === 0) {
        _push(`<div class="text-center py-16" data-v-c2ae9c8e><div class="inline-flex items-center space-x-3" data-v-c2ae9c8e><svg class="animate-spin h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-c2ae9c8e></path></svg><span class="text-lg text-gray-600" data-v-c2ae9c8e>Chargement des agents IA...</span></div></div>`);
      } else if (unref(agents).length > 0) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-v-c2ae9c8e><!--[-->`);
        ssrRenderList(unref(agents), (agent) => {
          var _a, _b;
          _push(`<div class="${ssrRenderClass([{
            "agent-card-active": agent.isActive && !unref(trialExpired),
            "agent-card-disabled": unref(trialExpired)
          }, "agent-card"])}" data-v-c2ae9c8e><div class="flex items-center justify-between mb-4" data-v-c2ae9c8e><div class="flex items-center space-x-3" data-v-c2ae9c8e><div class="${ssrRenderClass([unref(getAvatarClass)(agent.type), "agent-avatar"])}" data-v-c2ae9c8e><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", unref(getAgentIcon)(agent.type))} data-v-c2ae9c8e></path></svg></div><div data-v-c2ae9c8e><h3 class="text-lg font-semibold text-gray-900" data-v-c2ae9c8e>${ssrInterpolate(agent.name)}</h3><p class="text-sm text-gray-500" data-v-c2ae9c8e>${ssrInterpolate(unref(getTypeLabel)(agent.type))}</p></div></div><div class="flex items-center space-x-2" data-v-c2ae9c8e><span class="${ssrRenderClass([unref(getStatusBadgeClass)(agent.isActive), "status-badge"])}" data-v-c2ae9c8e>${ssrInterpolate(unref(trialExpired) ? "D\xE9sactiv\xE9 (Essai expir\xE9)" : agent.isActive ? "Actif" : "Inactif")}</span><div class="dropdown relative" data-v-c2ae9c8e><button${ssrIncludeBooleanAttr(unref(trialExpired)) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": unref(trialExpired) }, "agent-menu-btn"])}" data-v-c2ae9c8e><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" data-v-c2ae9c8e></path></svg></button>`);
          if (activeAgentMenu.value === agent.id && !unref(trialExpired)) {
            _push(`<div class="dropdown-menu" data-v-c2ae9c8e><button class="dropdown-item" data-v-c2ae9c8e><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-c2ae9c8e></path></svg> Modifier </button><button class="dropdown-item"${ssrIncludeBooleanAttr(!unref(canCreateAgent)) ? " disabled" : ""} data-v-c2ae9c8e><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" data-v-c2ae9c8e></path></svg> Dupliquer </button><button class="dropdown-item" data-v-c2ae9c8e><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" data-v-c2ae9c8e></path></svg> ${ssrInterpolate(agent.isActive ? "D\xE9sactiver" : "Activer")}</button><button class="dropdown-item text-red-600 hover:bg-red-50" data-v-c2ae9c8e><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-c2ae9c8e></path></svg> Supprimer </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div><p class="text-sm text-gray-600 mb-4 line-clamp-2" data-v-c2ae9c8e>${ssrInterpolate(agent.description || "Aucune description fournie.")}</p>`);
          if (unref(trialExpired)) {
            _push(`<div class="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl flex items-center justify-center" data-v-c2ae9c8e><div class="text-center text-white p-4" data-v-c2ae9c8e><svg class="w-8 h-8 mx-auto mb-2 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-c2ae9c8e></path></svg><p class="text-sm font-medium" data-v-c2ae9c8e>Essai expir\xE9</p><p class="text-xs text-gray-300" data-v-c2ae9c8e>Passez au plan Starter</p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="${ssrRenderClass([{ "opacity-30": unref(trialExpired) }, "grid grid-cols-2 gap-4 mb-4"])}" data-v-c2ae9c8e><div class="stat-item" data-v-c2ae9c8e><div class="stat-value" data-v-c2ae9c8e>${ssrInterpolate(((_a = agent.stats) == null ? void 0 : _a.conversations) || 0)}</div><div class="stat-label" data-v-c2ae9c8e>Conversations</div></div><div class="stat-item" data-v-c2ae9c8e><div class="stat-value" data-v-c2ae9c8e>${ssrInterpolate(((_b = agent.stats) == null ? void 0 : _b.conversions) || 0)}</div><div class="stat-label" data-v-c2ae9c8e>Conversions</div></div></div><div class="flex items-center space-x-2" data-v-c2ae9c8e><button${ssrIncludeBooleanAttr(!unref(canConfigureAgents) || unref(trialExpired)) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": !unref(canConfigureAgents) || unref(trialExpired) }, "flex-1 btn-secondary"])}"${ssrRenderAttr("title", unref(trialExpired) ? "Essai gratuit expir\xE9" : !unref(canConfigureAgents) ? "Acc\xE8s limit\xE9 selon votre plan" : "")} data-v-c2ae9c8e><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-v-c2ae9c8e></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-c2ae9c8e></path></svg> ${ssrInterpolate(unref(trialExpired) ? "Bloqu\xE9" : "Configurer")}</button><button${ssrIncludeBooleanAttr(!unref(canTestAgents) || unref(trialExpired)) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": !unref(canTestAgents) || unref(trialExpired) }, "flex-1 btn-primary"])}"${ssrRenderAttr("title", unref(trialExpired) ? "Essai gratuit expir\xE9" : !unref(canTestAgents) ? "Test r\xE9serv\xE9 aux plans payants" : "")} data-v-c2ae9c8e><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-v-c2ae9c8e></path></svg> ${ssrInterpolate(unref(trialExpired) ? "Bloqu\xE9" : "Tester")}</button></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(loading)) {
        _push(`<div class="text-center py-16" data-v-c2ae9c8e><div class="empty-state-illustration" data-v-c2ae9c8e><svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" data-v-c2ae9c8e></path></svg></div><h3 class="mt-4 text-xl font-medium text-gray-900" data-v-c2ae9c8e>${ssrInterpolate(unref(trialExpired) ? "Acc\xE8s limit\xE9 - Essai gratuit termin\xE9" : "Cr\xE9ez votre premier Vendeur IA")}</h3><p class="mt-2 text-gray-500 max-w-md mx-auto" data-v-c2ae9c8e>${ssrInterpolate(unref(trialExpired) ? "Passez au plan Starter pour r\xE9activer vos Vendeurs IA et continuer \xE0 utiliser ChatSeller." : "Commencez par cr\xE9er un agent IA commercial personnalis\xE9 pour transformer vos visiteurs en clients.")}</p><div class="mt-8" data-v-c2ae9c8e>`);
        if (unref(trialExpired)) {
          _push(`<button class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200" data-v-c2ae9c8e><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-v-c2ae9c8e></path></svg> Passer au plan Starter - 14\u20AC/mois </button>`);
        } else {
          _push(`<button${ssrIncludeBooleanAttr(!unref(canCreateAgent)) ? " disabled" : ""} class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" data-v-c2ae9c8e><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-c2ae9c8e></path></svg> Cr\xE9er mon premier Vendeur IA </button>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if ((showCreateModal.value || editingAgent.value) && !unref(trialExpired)) {
        _push(`<div class="modal-overlay" data-v-c2ae9c8e><div class="modal-content modal-large" data-v-c2ae9c8e><div class="modal-header" data-v-c2ae9c8e><h3 class="modal-title" data-v-c2ae9c8e>${ssrInterpolate(editingAgent.value ? "Modifier le Vendeur IA" : "Cr\xE9er un nouveau Vendeur IA")}</h3><button class="modal-close" data-v-c2ae9c8e><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-c2ae9c8e></path></svg></button></div><div class="modal-body" data-v-c2ae9c8e>`);
        if (!editingAgent.value) {
          _push(`<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-v-c2ae9c8e><div class="flex items-start space-x-3" data-v-c2ae9c8e><svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-c2ae9c8e></path></svg><div data-v-c2ae9c8e><h4 class="font-medium text-blue-900 mb-1" data-v-c2ae9c8e>\u{1F3AF} Cr\xE9er votre Vendeur IA en 3 \xE9tapes</h4><p class="text-sm text-blue-700" data-v-c2ae9c8e><strong data-v-c2ae9c8e>1.</strong> Choisissez le type \u2192 <strong data-v-c2ae9c8e>2.</strong> Nom et personnalit\xE9 \u2192 <strong data-v-c2ae9c8e>3.</strong> Activez ! Les descriptions et messages sont g\xE9n\xE9r\xE9s automatiquement. </p>`);
          if (unref(planDetails).agentLimit > 0) {
            _push(`<p class="text-xs text-blue-600 mt-2" data-v-c2ae9c8e> \u{1F4A1} Votre plan permet ${ssrInterpolate(unref(planDetails).agentLimit === -1 ? "un nombre illimit\xE9" : unref(planDetails).agentLimit)} agent${ssrInterpolate(unref(planDetails).agentLimit > 1 ? "s" : "")}. Vous avez utilis\xE9 ${ssrInterpolate(unref(agents).length)}/${ssrInterpolate(unref(planDetails).agentLimit === -1 ? "\u221E" : unref(planDetails).agentLimit)} emplacements. </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-6" data-v-c2ae9c8e><div data-v-c2ae9c8e><label class="block text-sm font-medium text-gray-700 mb-3" data-v-c2ae9c8e><span class="flex items-center" data-v-c2ae9c8e><span class="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2" data-v-c2ae9c8e>1</span> Quel type de vendeur IA voulez-vous ? </span></label><div class="grid grid-cols-1 md:grid-cols-2 gap-3" data-v-c2ae9c8e><!--[-->`);
        ssrRenderList(agentTypes.value, (type) => {
          _push(`<button class="${ssrRenderClass([
            "p-4 border-2 rounded-lg text-left transition-all hover:border-blue-300 hover:bg-blue-50",
            agentForm.value.type === type.value ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-gray-200"
          ])}" data-v-c2ae9c8e><div class="flex items-start space-x-3" data-v-c2ae9c8e><div class="${ssrRenderClass([
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            type.color
          ])}" data-v-c2ae9c8e><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", type.icon)} data-v-c2ae9c8e></path></svg></div><div class="flex-1" data-v-c2ae9c8e><h4 class="font-medium text-gray-900" data-v-c2ae9c8e>${ssrInterpolate(type.label)}</h4><p class="text-xs text-gray-500 mt-1" data-v-c2ae9c8e>${ssrInterpolate(type.description)}</p></div></div></button>`);
        });
        _push(`<!--]--></div></div><div data-v-c2ae9c8e><label class="block text-sm font-medium text-gray-700 mb-2" data-v-c2ae9c8e><span class="flex items-center" data-v-c2ae9c8e><span class="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2" data-v-c2ae9c8e>2</span> Nom du Vendeur IA * </span></label><input${ssrRenderAttr("value", agentForm.value.name)} type="text" class="input-modern w-full"${ssrRenderAttr("placeholder", getNamePlaceholder())} data-v-c2ae9c8e><p class="text-xs text-gray-500 mt-1" data-v-c2ae9c8e> Exemples: ${ssrInterpolate(getNameExamples())}</p></div><div data-v-c2ae9c8e><label class="block text-sm font-medium text-gray-700 mb-2" data-v-c2ae9c8e>Personnalit\xE9 et ton</label><div class="grid grid-cols-2 gap-3" data-v-c2ae9c8e><!--[-->`);
        ssrRenderList(personalityOptions.value, (personality) => {
          _push(`<button class="${ssrRenderClass([
            "p-3 border-2 rounded-lg text-left transition-all",
            agentForm.value.personality === personality.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
          ])}" data-v-c2ae9c8e><div class="flex items-center space-x-2" data-v-c2ae9c8e><span class="text-lg" data-v-c2ae9c8e>${ssrInterpolate(personality.emoji)}</span><div data-v-c2ae9c8e><div class="font-medium text-sm" data-v-c2ae9c8e>${ssrInterpolate(personality.label)}</div><div class="text-xs text-gray-500" data-v-c2ae9c8e>${ssrInterpolate(personality.description)}</div></div></div></button>`);
        });
        _push(`<!--]--></div></div><div data-v-c2ae9c8e><label class="block text-sm font-medium text-gray-700 mb-2" data-v-c2ae9c8e> Description et r\xF4le <span class="text-gray-500 font-normal" data-v-c2ae9c8e>(g\xE9n\xE9r\xE9e automatiquement)</span></label><div class="relative" data-v-c2ae9c8e><textarea rows="3" class="input-modern w-full pr-20"${ssrRenderAttr("placeholder", getDescriptionPlaceholder())} data-v-c2ae9c8e>${ssrInterpolate(agentForm.value.description)}</textarea><button${ssrIncludeBooleanAttr(generatingDescription.value || !agentForm.value.name || !agentForm.value.type) ? " disabled" : ""} class="absolute top-2 right-2 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-v-c2ae9c8e>`);
        if (generatingDescription.value) {
          _push(`<svg class="w-3 h-3 animate-spin mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-c2ae9c8e></path></svg>`);
        } else {
          _push(`<svg class="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-c2ae9c8e></path></svg>`);
        }
        _push(` \u2728 IA </button></div></div><div data-v-c2ae9c8e><label class="block text-sm font-medium text-gray-700 mb-2" data-v-c2ae9c8e> Message d&#39;accueil * </label><textarea rows="2" class="input-modern w-full"${ssrRenderAttr("placeholder", getWelcomeMessagePlaceholder())} data-v-c2ae9c8e>${ssrInterpolate(agentForm.value.welcomeMessage)}</textarea></div>`);
        if (agentForm.value.name) {
          _push(`<div class="bg-gray-50 rounded-lg p-4" data-v-c2ae9c8e><h4 class="font-medium text-gray-900 mb-3 flex items-center" data-v-c2ae9c8e><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-c2ae9c8e></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" data-v-c2ae9c8e></path></svg> Aper\xE7u de votre Vendeur IA </h4><div class="bg-white border rounded-lg p-4 max-w-sm" data-v-c2ae9c8e><div class="flex items-start space-x-3" data-v-c2ae9c8e><div class="${ssrRenderClass([
            "w-10 h-10 rounded-full flex items-center justify-center",
            unref(getAvatarClass)(agentForm.value.type)
          ])}" data-v-c2ae9c8e><span class="text-white font-medium text-sm" data-v-c2ae9c8e>${ssrInterpolate(agentForm.value.name ? agentForm.value.name[0].toUpperCase() : "V")}</span></div><div class="flex-1" data-v-c2ae9c8e><div class="font-medium text-gray-900" data-v-c2ae9c8e>${ssrInterpolate(agentForm.value.name || "Votre Vendeur IA")}</div><div class="text-sm text-gray-500" data-v-c2ae9c8e>${ssrInterpolate(unref(getTypeLabel)(agentForm.value.type))}</div><div class="mt-2 text-sm text-gray-700 bg-gray-100 rounded-lg p-2" data-v-c2ae9c8e>${ssrInterpolate(agentForm.value.welcomeMessage || getWelcomeMessagePlaceholder())}</div></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-v-c2ae9c8e><div data-v-c2ae9c8e><h4 class="text-sm font-medium text-gray-900 flex items-center" data-v-c2ae9c8e><span class="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2" data-v-c2ae9c8e>3</span> Activer imm\xE9diatement </h4><p class="text-xs text-gray-500" data-v-c2ae9c8e>Le vendeur IA sera disponible d\xE8s sa cr\xE9ation</p></div><button class="${ssrRenderClass([
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          agentForm.value.isActive ? "bg-blue-600" : "bg-gray-200"
        ])}" data-v-c2ae9c8e><span class="${ssrRenderClass([
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          agentForm.value.isActive ? "translate-x-5" : "translate-x-0"
        ])}" data-v-c2ae9c8e></span></button></div></div></div><div class="modal-footer" data-v-c2ae9c8e><button class="btn-secondary" data-v-c2ae9c8e>Annuler</button><button${ssrIncludeBooleanAttr(!agentForm.value.name || unref(saving)) ? " disabled" : ""} class="btn-primary" data-v-c2ae9c8e>`);
        if (unref(saving)) {
          _push(`<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-c2ae9c8e></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(saving) ? "Cr\xE9ation..." : editingAgent.value ? "Mettre \xE0 jour" : "Cr\xE9er le Vendeur IA")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showTestModal.value && selectedAgent.value && !unref(trialExpired)) {
        _push(`<div class="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4" data-v-c2ae9c8e><div class="bg-white rounded-xl shadow-xl max-w-md w-full h-96 flex flex-col" data-v-c2ae9c8e><div class="flex items-center justify-between p-4 border-b border-gray-200" data-v-c2ae9c8e><h3 class="text-lg font-semibold text-gray-900" data-v-c2ae9c8e>Test - ${ssrInterpolate(selectedAgent.value.name)}</h3><button class="text-gray-400 hover:text-gray-600 transition-colors" data-v-c2ae9c8e><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-c2ae9c8e></path></svg></button></div><div class="flex-1 p-4 bg-gray-50 overflow-y-auto" data-v-c2ae9c8e><div class="space-y-3" data-v-c2ae9c8e><!--[-->`);
        ssrRenderList(chatMessages.value, (message) => {
          _push(`<div class="${ssrRenderClass([message.role === "user" ? "flex-row-reverse space-x-reverse" : "", "flex items-start space-x-2"])}" data-v-c2ae9c8e><div class="${ssrRenderClass([message.role === "user" ? "bg-gray-500" : "bg-blue-500", "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"])}" data-v-c2ae9c8e><span class="text-white text-sm font-medium" data-v-c2ae9c8e>${ssrInterpolate(message.role === "user" ? "U" : "IA")}</span></div><div class="${ssrRenderClass([message.role === "user" ? "bg-blue-100" : "", "bg-white p-3 rounded-lg shadow-sm max-w-xs"])}" data-v-c2ae9c8e><p class="text-sm text-gray-800" data-v-c2ae9c8e>${ssrInterpolate(message.content)}</p>`);
          if (message.role === "assistant" && message.loading) {
            _push(`<div class="flex items-center mt-2" data-v-c2ae9c8e><svg class="animate-spin h-3 w-3 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-c2ae9c8e></path></svg><span class="text-xs text-gray-500" data-v-c2ae9c8e>L&#39;IA r\xE9fl\xE9chit...</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div><div class="p-4 border-t border-gray-200" data-v-c2ae9c8e><div class="flex space-x-2" data-v-c2ae9c8e><input${ssrRenderAttr("value", testMessage.value)} type="text" placeholder="Tapez votre message de test..." class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"${ssrIncludeBooleanAttr(sendingMessage.value) ? " disabled" : ""} data-v-c2ae9c8e><button${ssrIncludeBooleanAttr(!testMessage.value.trim() || sendingMessage.value) ? " disabled" : ""} class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" data-v-c2ae9c8e><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c2ae9c8e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" data-v-c2ae9c8e></path></svg></button></div><p class="text-xs text-gray-500 mt-2" data-v-c2ae9c8e>Test en direct avec IA \u2022 ${ssrInterpolate(unref(subscriptionPlan))} plan</p></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/vendeurs-ia.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const vendeursIa = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c2ae9c8e"]]);

export { vendeursIa as default };
//# sourceMappingURL=vendeurs-ia-DkRTJzuM.mjs.map
