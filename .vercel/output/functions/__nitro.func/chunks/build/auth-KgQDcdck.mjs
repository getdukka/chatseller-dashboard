import { e as defineStore, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { u as useSupabase } from './useSupabase-CFkBc_As.mjs';

const useApi = () => {
  const config = useRuntimeConfig();
  const getBaseURL = () => {
    return config.public.apiBaseUrl || "https://chatseller-api-production.up.railway.app";
  };
  const baseURL = getBaseURL();
  console.log("\u{1F527} API Configuration:", {
    baseURL,
    env: "production",
    isDev: false
  });
  const createFetchOptions = (options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers
    };
    return {
      ...options,
      baseURL,
      headers,
      onResponseError({ response }) {
        console.error("\u274C API Error:", response.status, response.statusText);
        if (response.status === 401) {
          const authStore = useAuthStore();
          authStore.clearAuth();
          navigateTo("/login");
        }
      }
    };
  };
  const apiCall = async (endpoint, options = {}) => {
    var _a, _b;
    try {
      console.log(`\u{1F4E1} API Call: ${options.method || "GET"} ${baseURL}${endpoint}`);
      const fetchOptions = createFetchOptions(options);
      const response = await $fetch(endpoint, fetchOptions);
      console.log("\u2705 API Response:", response);
      if (response && typeof response === "object") {
        if ("success" in response) {
          return response;
        }
        if ("data" in response) {
          return {
            success: true,
            data: response.data,
            ...response
          };
        }
      }
      return {
        data: response,
        success: true
      };
    } catch (error) {
      console.error("\u274C API call failed for", endpoint, ":", error);
      let errorMessage = "Une erreur est survenue";
      if ((_a = error.data) == null ? void 0 : _a.error) {
        errorMessage = error.data.error;
      } else if ((_b = error.data) == null ? void 0 : _b.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return {
        error: errorMessage,
        success: false
      };
    }
  };
  const shops = {
    // ✅ GET SHOP (ROUTE PRINCIPALE)
    get: async (shopId) => {
      var _a;
      const authStore = useAuthStore();
      const targetShopId = shopId || authStore.userShopId || ((_a = authStore.user) == null ? void 0 : _a.id);
      if (!targetShopId) {
        return { success: false, error: "Shop ID manquant" };
      }
      return apiCall(`/api/v1/shops/${targetShopId}`);
    },
    // ✅ CREATE SHOP
    create: async (data) => {
      return apiCall("/api/v1/shops", {
        method: "POST",
        body: data
      });
    },
    // ✅ UPDATE SHOP
    update: async (shopId, data) => {
      return apiCall(`/api/v1/shops/${shopId}`, {
        method: "PUT",
        body: data
      });
    },
    // ✅ LIST SHOPS
    list: async () => {
      return apiCall("/api/v1/shops");
    }
  };
  const agents = {
    list: async () => {
      return apiCall("/api/v1/agents");
    },
    create: async (data) => {
      return apiCall("/api/v1/agents", {
        method: "POST",
        body: data
      });
    },
    update: async (agentId, data) => {
      return apiCall(`/api/v1/agents/${agentId}`, {
        method: "PUT",
        body: data
      });
    },
    delete: async (agentId) => {
      return apiCall(`/api/v1/agents/${agentId}`, {
        method: "DELETE"
      });
    },
    getConfig: async (agentId) => {
      return apiCall(`/api/v1/agents/${agentId}/config`);
    }
  };
  const conversations = {
    list: async () => {
      return apiCall("/api/v1/conversations");
    },
    get: async (conversationId) => {
      return apiCall(`/api/v1/conversations/${conversationId}`);
    }
  };
  const analytics = {
    dashboard: async () => {
      return apiCall("/api/v1/analytics/dashboard");
    },
    detailed: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/api/v1/analytics/detailed?${queryString}` : "/api/v1/analytics/detailed";
      return apiCall(endpoint);
    }
  };
  const knowledgeBase = {
    list: async () => {
      return apiCall("/api/v1/knowledge-base");
    },
    upload: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiCall("/api/v1/knowledge-base/upload", {
        method: "POST",
        body: formData,
        headers: {}
        // Laisser le navigateur définir le Content-Type pour FormData
      });
    },
    addManual: async (data) => {
      return apiCall("/api/v1/knowledge-base", {
        method: "POST",
        body: data
      });
    },
    delete: async (documentId) => {
      return apiCall(`/api/v1/knowledge-base/${documentId}`, {
        method: "DELETE"
      });
    }
  };
  const billing = {
    subscriptionStatus: async () => {
      return apiCall("/api/v1/billing/subscription-status");
    },
    plans: async () => {
      return apiCall("/api/v1/billing/plans");
    },
    createCheckoutSession: async (data) => {
      return apiCall("/api/v1/billing/create-checkout-session", {
        method: "POST",
        body: data
      });
    },
    paymentHistory: async () => {
      return apiCall("/api/v1/billing/payment-history");
    },
    cancelSubscription: async () => {
      return apiCall("/api/v1/billing/cancel-subscription", {
        method: "POST"
      });
    }
  };
  const utils = {
    healthCheck: async () => {
      return apiCall("/health");
    },
    info: async () => {
      return apiCall("/");
    }
  };
  return {
    baseURL,
    shops,
    agents,
    conversations,
    analytics,
    knowledgeBase,
    billing,
    utils
  };
};
const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),
  getters: {
    userShopId: (state) => {
      var _a, _b, _c;
      return ((_a = state.user) == null ? void 0 : _a.shopId) || ((_b = state.user) == null ? void 0 : _b.shop_id) || ((_c = state.user) == null ? void 0 : _c.id) || null;
    },
    isLoggedIn: (state) => {
      return state.isAuthenticated && !!state.user;
    },
    userEmail: (state) => {
      var _a;
      return ((_a = state.user) == null ? void 0 : _a.email) || null;
    },
    userName: (state) => {
      var _a, _b, _c, _d;
      if (((_a = state.user) == null ? void 0 : _a.firstName) && ((_b = state.user) == null ? void 0 : _b.lastName)) {
        return `${state.user.firstName} ${state.user.lastName}`;
      }
      if ((_c = state.user) == null ? void 0 : _c.firstName) {
        return state.user.firstName;
      }
      return ((_d = state.user) == null ? void 0 : _d.name) || null;
    },
    userFirstName: (state) => {
      var _a, _b, _c;
      if ((_a = state.user) == null ? void 0 : _a.firstName) {
        return state.user.firstName;
      }
      if (((_b = state.user) == null ? void 0 : _b.name) && !state.user.name.includes("@")) {
        return state.user.name.split(" ")[0];
      }
      if ((_c = state.user) == null ? void 0 : _c.email) {
        const emailPrefix = state.user.email.split("@")[0];
        const firstName = emailPrefix.split(/[._-]/)[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      }
      return "Utilisateur";
    },
    userInitials: (state) => {
      var _a, _b, _c, _d;
      if (((_a = state.user) == null ? void 0 : _a.firstName) && ((_b = state.user) == null ? void 0 : _b.lastName)) {
        return `${state.user.firstName[0]}${state.user.lastName[0]}`.toUpperCase();
      }
      if ((_c = state.user) == null ? void 0 : _c.name) {
        return state.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      }
      if ((_d = state.user) == null ? void 0 : _d.email) {
        return state.user.email[0].toUpperCase();
      }
      return "U";
    },
    // ✅ NOUVEAU GETTER: DÉTAILS COMPLETS DU PLAN - CORRIGÉ
    planDetails: (state) => {
      const user = state.user;
      if (!(user == null ? void 0 : user.shop)) {
        return {
          name: "Aucun plan",
          code: "none",
          agentLimit: 0,
          knowledgeBaseLimit: 0,
          conversationLimit: 0,
          features: [],
          isActive: false,
          isTrial: false,
          trialDaysLeft: 0,
          trialEndDate: null,
          hasExpired: true
        };
      }
      const shop = user.shop;
      const subscriptionPlan = shop.subscription_plan || "free";
      const createdAt = new Date(shop.createdAt || shop.created_at || Date.now());
      const now = /* @__PURE__ */ new Date();
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1e3 * 60 * 60 * 24));
      const trialDaysLeft = Math.max(0, 7 - daysSinceCreation);
      const trialEndDate = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1e3);
      switch (subscriptionPlan) {
        case "free":
          return {
            name: "Essai Gratuit",
            code: "free",
            agentLimit: 1,
            knowledgeBaseLimit: 10,
            conversationLimit: 1e3,
            features: ["7 jours gratuit", "1 agent IA", "1000 conversations/mois", "10 documents max"],
            isActive: trialDaysLeft > 0,
            isTrial: true,
            trialDaysLeft,
            trialEndDate,
            hasExpired: trialDaysLeft <= 0
          };
        case "starter":
          return {
            name: "Starter",
            code: "starter",
            agentLimit: 1,
            knowledgeBaseLimit: 10,
            conversationLimit: 1e3,
            features: ["1 Vendeur IA sp\xE9cialis\xE9", "1000 conversations/mois", "10 documents max", "Analytics de base", "Support email"],
            isActive: true,
            isTrial: false,
            trialDaysLeft: 0,
            trialEndDate: null,
            hasExpired: false
          };
        case "pro":
        case "professional":
          return {
            name: "Pro",
            code: "pro",
            agentLimit: 3,
            knowledgeBaseLimit: 50,
            conversationLimit: -1,
            // Illimité
            features: ["3 Vendeurs IA", "Conversations illimit\xE9es", "50 documents max", "Analytics avanc\xE9es & ROI", "Upsell & FOMO", "Support prioritaire"],
            isActive: true,
            isTrial: false,
            trialDaysLeft: 0,
            trialEndDate: null,
            hasExpired: false
          };
        case "enterprise":
          return {
            name: "Enterprise",
            code: "enterprise",
            agentLimit: -1,
            // Illimité
            knowledgeBaseLimit: -1,
            conversationLimit: -1,
            // Illimité
            features: ["Vendeurs IA illimit\xE9s", "Documents illimit\xE9s", "Analytics compl\xE8tes", "White-label", "Support d\xE9di\xE9", "API avanc\xE9e"],
            isActive: true,
            isTrial: false,
            trialDaysLeft: 0,
            trialEndDate: null,
            hasExpired: false
          };
        default:
          return {
            name: "Plan inconnu",
            code: "unknown",
            agentLimit: 0,
            knowledgeBaseLimit: 0,
            conversationLimit: 0,
            features: [],
            isActive: false,
            isTrial: false,
            trialDaysLeft: 0,
            trialEndDate: null,
            hasExpired: true
          };
      }
    },
    // ✅ GETTERS SIMPLIFIÉS
    currentPlan: (state) => {
      var _a, _b;
      return ((_b = (_a = state.user) == null ? void 0 : _a.shop) == null ? void 0 : _b.subscription_plan) || "free";
    },
    isPaidUser: (state) => {
      var _a, _b;
      const plan = (_b = (_a = state.user) == null ? void 0 : _a.shop) == null ? void 0 : _b.subscription_plan;
      return plan === "starter" || plan === "pro" || plan === "professional" || plan === "enterprise";
    },
    hasActiveAccess: (state) => {
      const details = state.planDetails;
      return details.isActive && !details.hasExpired;
    },
    trialExpired: (state) => {
      const details = state.planDetails;
      return details.isTrial && details.hasExpired;
    }
  },
  actions: {
    // ✅ ACTION LOGIN INCHANGÉE
    async login(credentials) {
      var _a, _b, _c;
      this.loading = true;
      try {
        console.log("\u{1F510} Store Supabase: Tentative de login pour:", credentials.email);
        const supabase = useSupabase();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });
        if (authError) {
          console.error("\u274C Supabase auth error:", authError);
          throw new Error(authError.message);
        }
        if (authData.user) {
          console.log("\u2705 Supabase auth success:", authData.user.id);
          const userData = await this.fetchCompleteUserDataViaAPI(authData.user, ((_a = authData.session) == null ? void 0 : _a.access_token) || "");
          this.setUser(userData, ((_b = authData.session) == null ? void 0 : _b.access_token) || "");
          return {
            success: true,
            data: {
              user: userData,
              token: (_c = authData.session) == null ? void 0 : _c.access_token
            }
          };
        } else {
          throw new Error("Aucune donn\xE9e utilisateur re\xE7ue");
        }
      } catch (error) {
        console.error("\u274C Store: Erreur login:", error);
        return {
          success: false,
          error: error.message || "Erreur de connexion"
        };
      } finally {
        this.loading = false;
      }
    },
    // ✅ FONCTION CORRIGÉE : RÉCUPÉRATION DONNÉES VIA API AVEC RETRY
    async fetchCompleteUserDataViaAPI(authUser, token, forceRefresh = false) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
      try {
        console.log("\u{1F4E1} [Store] R\xE9cup\xE9ration donn\xE9es utilisateur via API...", forceRefresh ? "(FORCE REFRESH)" : "");
        const api = useApi();
        try {
          const timeoutPromise = new Promise(
            (_, reject) => setTimeout(() => reject(new Error("Timeout API")), 5e3)
          );
          const apiPromise = api.shops.get(authUser.id);
          const shopResponse = await Promise.race([apiPromise, timeoutPromise]);
          if ((shopResponse == null ? void 0 : shopResponse.success) && (shopResponse == null ? void 0 : shopResponse.data)) {
            const shopData = shopResponse.data;
            console.log("\u2705 [Store] Donn\xE9es shop r\xE9cup\xE9r\xE9es via API:", {
              id: shopData.id,
              email: shopData.email,
              plan: shopData.subscription_plan,
              isActive: shopData.is_active,
              onboarding_completed: shopData.onboarding_completed
            });
            const user = {
              id: authUser.id,
              email: authUser.email,
              firstName: ((_a = authUser.user_metadata) == null ? void 0 : _a.first_name) || shopData.first_name || null,
              lastName: ((_b = authUser.user_metadata) == null ? void 0 : _b.last_name) || shopData.last_name || null,
              name: ((_c = authUser.user_metadata) == null ? void 0 : _c.name) || (((_d = authUser.user_metadata) == null ? void 0 : _d.first_name) && ((_e = authUser.user_metadata) == null ? void 0 : _e.last_name) ? `${authUser.user_metadata.first_name} ${authUser.user_metadata.last_name}` : null) || shopData.name || ((_f = authUser.email) == null ? void 0 : _f.split("@")[0]),
              shopId: authUser.id,
              shop_id: authUser.id,
              avatar: (_g = authUser.user_metadata) == null ? void 0 : _g.avatar_url,
              role: "user",
              createdAt: authUser.created_at,
              shop: shopData
            };
            console.log("\u2705 [Store] Donn\xE9es utilisateur compl\xE8tes assembl\xE9es via API");
            return user;
          } else {
            console.warn("\u26A0\uFE0F [Store] API retourn\xE9 mais pas de donn\xE9es shop valides");
            throw new Error("Pas de donn\xE9es shop");
          }
        } catch (apiError) {
          console.warn("\u26A0\uFE0F [Store] Erreur appel API shops:", apiError.message);
          console.log("\u{1F504} [Store] Fallback: Tentative r\xE9cup\xE9ration via Supabase direct");
          try {
            const supabase = useSupabase();
            const { data: shopDataSupabase, error: supabaseError } = await supabase.from("shops").select("*").eq("id", authUser.id).single();
            if (!supabaseError && shopDataSupabase) {
              console.log("\u2705 [Store] Donn\xE9es shop r\xE9cup\xE9r\xE9es via Supabase direct");
              const user = {
                id: authUser.id,
                email: authUser.email,
                firstName: ((_h = authUser.user_metadata) == null ? void 0 : _h.first_name) || shopDataSupabase.first_name || null,
                lastName: ((_i = authUser.user_metadata) == null ? void 0 : _i.last_name) || shopDataSupabase.last_name || null,
                name: ((_j = authUser.user_metadata) == null ? void 0 : _j.name) || shopDataSupabase.name || ((_k = authUser.email) == null ? void 0 : _k.split("@")[0]),
                shopId: authUser.id,
                shop_id: authUser.id,
                avatar: (_l = authUser.user_metadata) == null ? void 0 : _l.avatar_url,
                role: "user",
                createdAt: authUser.created_at,
                shop: shopDataSupabase
              };
              return user;
            } else {
              console.warn("\u26A0\uFE0F [Store] Supabase direct \xE9chou\xE9 aussi:", supabaseError);
              throw new Error("Shop non trouv\xE9 via Supabase");
            }
          } catch (supabaseError) {
            console.warn("\u26A0\uFE0F [Store] Erreur Supabase direct:", supabaseError.message);
            throw supabaseError;
          }
        }
      } catch (error) {
        console.warn("\u26A0\uFE0F [Store] Toutes les tentatives ont \xE9chou\xE9, utilisation donn\xE9es fallback");
        const fallbackUser = {
          id: authUser.id,
          email: authUser.email,
          name: ((_m = authUser.user_metadata) == null ? void 0 : _m.name) || ((_n = authUser.email) == null ? void 0 : _n.split("@")[0]),
          firstName: ((_o = authUser.user_metadata) == null ? void 0 : _o.first_name) || null,
          lastName: ((_p = authUser.user_metadata) == null ? void 0 : _p.last_name) || null,
          shopId: authUser.id,
          shop_id: authUser.id,
          avatar: (_q = authUser.user_metadata) == null ? void 0 : _q.avatar_url,
          role: "user",
          createdAt: authUser.created_at,
          shop: {
            id: authUser.id,
            name: ((_r = authUser.user_metadata) == null ? void 0 : _r.name) || `Shop de ${(_s = authUser.email) == null ? void 0 : _s.split("@")[0]}`,
            email: authUser.email,
            subscription_plan: "free",
            is_active: true,
            onboarding_completed: true,
            // ✅ IMPORTANT: Par défaut true pour éviter la boucle onboarding
            created_at: authUser.created_at
          }
        };
        console.log("\u26A0\uFE0F [Store] Utilisation des donn\xE9es fallback robustes");
        return fallbackUser;
      }
    },
    // ✅ ACTION REGISTER INCHANGÉE
    async register(data) {
      this.loading = true;
      try {
        console.log("\u{1F4DD} Store Supabase: Tentative d'inscription pour:", data.email);
        const supabase = useSupabase();
        const nameParts = data.name.trim().split(" ");
        const firstName = nameParts[0] || data.firstName || "";
        const lastName = nameParts.slice(1).join(" ") || data.lastName || "";
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              first_name: firstName,
              last_name: lastName,
              company: data.company || "",
              platform: data.platform || ""
            }
          }
        });
        if (authError) {
          console.error("\u274C Supabase signup error:", authError);
          throw new Error(authError.message);
        }
        if (authData.user) {
          console.log("\u2705 Supabase signup success:", authData.user.id);
          if (authData.session) {
            console.log("\u2705 Session cr\xE9\xE9e, cr\xE9ation du shop...");
            try {
              const config = useRuntimeConfig();
              const baseURL = config.public.apiBaseUrl;
              const shopCreateResponse = await $fetch("/api/v1/shops", {
                method: "POST",
                baseURL,
                headers: {
                  "Authorization": `Bearer ${authData.session.access_token}`,
                  "Content-Type": "application/json"
                },
                body: {
                  id: authData.user.id,
                  name: data.company || `Shop de ${firstName}`,
                  email: data.email,
                  subscription_plan: "free",
                  is_active: true,
                  widget_config: {
                    theme: "modern",
                    primaryColor: "#E91E63",
                    position: "bottom-right",
                    buttonText: "Parler au vendeur",
                    language: "fr"
                  },
                  agent_config: {
                    name: "Rose",
                    avatar: "https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff",
                    welcomeMessage: "Bonjour ! Je suis votre assistante d'achat. Comment puis-je vous aider ?",
                    fallbackMessage: "Je transmets votre question \xE0 notre \xE9quipe, un conseiller vous recontactera bient\xF4t.",
                    collectPaymentMethod: true,
                    upsellEnabled: false
                  }
                }
              });
              console.log("\u2705 Shop cr\xE9\xE9 via API:", shopCreateResponse);
              const userData = await this.fetchCompleteUserDataViaAPI(authData.user, authData.session.access_token);
              this.setUser(userData, authData.session.access_token);
            } catch (apiError) {
              console.warn("\u26A0\uFE0F Erreur cr\xE9ation shop via API (non bloquante):", apiError);
            }
          } else {
            console.log("\u26A0\uFE0F Pas de session imm\xE9diate - email confirmation requis");
          }
          console.log("\u2705 Inscription termin\xE9e - confirmation email requise");
          return {
            success: true,
            data: {
              user: authData.user,
              session: authData.session,
              needsEmailConfirmation: !authData.session
              // ✅ IMPORTANT FLAG
            }
          };
        } else {
          throw new Error("Erreur lors de la cr\xE9ation du compte");
        }
      } catch (error) {
        console.error("\u274C Store: Erreur register:", error);
        return {
          success: false,
          error: error.message || "Erreur lors de l'inscription"
        };
      } finally {
        this.loading = false;
      }
    },
    // ✅ ACTION RESTORE SESSION CORRIGÉE AVEC FORCE REFRESH
    async restoreSession(forceRefresh = false) {
      return { success: false };
    },
    // ✅ NOUVELLE ACTION: FORCER LA SYNCHRONISATION DES DONNÉES
    async forceDataSync() {
      console.log("\u{1F504} [Store] FORCE SYNC: Synchronisation forc\xE9e des donn\xE9es utilisateur...");
      try {
        if (!this.isAuthenticated || !this.token) {
          console.warn("\u26A0\uFE0F [Store] Pas d'utilisateur authentifi\xE9 pour la synchronisation");
          return { success: false };
        }
        const result = await this.restoreSession(true);
        if (result.success) {
          console.log("\u2705 [Store] Synchronisation forc\xE9e r\xE9ussie");
          console.log("\u{1F4CB} [Store] Nouveau plan:", this.currentPlan);
        } else {
          console.error("\u274C [Store] \xC9chec de la synchronisation forc\xE9e");
        }
        return result;
      } catch (error) {
        console.error("\u274C [Store] Erreur lors de la synchronisation forc\xE9e:", error);
        return { success: false };
      }
    },
    // ✅ NOUVELLE ACTION: ATTENDRE LA MISE À JOUR DU PLAN
    async waitForPlanUpdate(expectedPlan, maxRetries = 5, retryDelay = 3e3) {
      console.log(`\u23F3 [Store] Attente de la mise \xE0 jour du plan vers: ${expectedPlan}`);
      for (let i = 0; i < maxRetries; i++) {
        console.log(`\u{1F504} [Store] Tentative ${i + 1}/${maxRetries}...`);
        await this.forceDataSync();
        if (this.currentPlan === expectedPlan) {
          console.log(`\u2705 [Store] Plan mis \xE0 jour avec succ\xE8s vers: ${expectedPlan}`);
          return true;
        }
        if (i < maxRetries - 1) {
          console.log(`\u23F3 [Store] Plan actuel: ${this.currentPlan}, retry dans ${retryDelay / 1e3}s...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
      console.warn(`\u26A0\uFE0F [Store] \xC9chec de la mise \xE0 jour du plan apr\xE8s ${maxRetries} tentatives`);
      return false;
    },
    // ✅ AUTRES ACTIONS INCHANGÉES
    async resetPassword(email) {
      this.loading = true;
      try {
        const supabase = useSupabase();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${(void 0).location.origin}/auth/reset-password`
        });
        if (error) {
          throw new Error(error.message);
        }
        return {
          success: true,
          message: "Email de r\xE9initialisation envoy\xE9"
        };
      } catch (error) {
        console.error("\u274C Store: Erreur reset password:", error);
        return {
          success: false,
          error: error.message || "Erreur lors de l'envoi"
        };
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        console.log("\u{1F6AA} Store: D\xE9connexion en cours...");
        const supabase = useSupabase();
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn("\u26A0\uFE0F Erreur logout Supabase:", error);
        }
      } catch (error) {
        console.warn("\u274C Store: Erreur lors du logout:", error);
      } finally {
        this.clearAuth();
      }
    },
    setUser(user, token) {
      var _a;
      const normalizedUser = {
        ...user,
        shopId: user.shopId || user.shop_id || user.id,
        shop_id: user.shop_id || user.shopId || user.id
      };
      this.user = normalizedUser;
      this.token = token;
      this.isAuthenticated = true;
      console.log("\u2705 Store: Utilisateur connect\xE9 (API):", {
        id: normalizedUser.id,
        email: normalizedUser.email,
        plan: ((_a = normalizedUser.shop) == null ? void 0 : _a.subscription_plan) || "none"
      });
      console.log("\u{1F4CB} Plan actuel:", this.planDetails.name);
      console.log("\u23F0 Essai expir\xE9:", this.trialExpired);
    },
    clearAuth() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      console.log("\u{1F9F9} Store: Session nettoy\xE9e");
    },
    async updateProfile(data) {
      var _a;
      this.loading = true;
      try {
        const supabase = useSupabase();
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            name: data.name,
            first_name: data.firstName,
            last_name: data.lastName,
            avatar_url: data.avatar
          }
        });
        if (updateError) {
          throw new Error(updateError.message);
        }
        if (data.firstName || data.lastName) {
          try {
            const api = useApi();
            await api.shops.update(((_a = this.user) == null ? void 0 : _a.id) || "", {
              name: data.name,
              updated_at: (/* @__PURE__ */ new Date()).toISOString()
            });
          } catch (apiError) {
            console.warn("\u26A0\uFE0F Erreur mise \xE0 jour shop via API:", apiError);
          }
        }
        if (this.user) {
          this.user = { ...this.user, ...data };
          console.log("\u2705 Store: Profil mis \xE0 jour:", this.user);
        }
        return { success: true };
      } catch (error) {
        console.error("\u274C Store: Erreur update profile:", error);
        return {
          success: false,
          error: error.message || "Erreur mise \xE0 jour profil"
        };
      } finally {
        this.loading = false;
      }
    },
    async refreshToken() {
      try {
        const supabase = useSupabase();
        const { data, error } = await supabase.auth.refreshSession();
        if (error || !data.session) {
          throw new Error("Impossible de rafra\xEEchir le token");
        }
        this.token = data.session.access_token;
        return { success: true };
      } catch (error) {
        console.error("\u274C Store: Erreur refresh token:", error);
        this.clearAuth();
        return { success: false };
      }
    },
    // ✅ ACTION MISE À JOUR PLAN VIA API - INCHANGÉE
    async updateSubscriptionPlan(newPlan) {
      var _a;
      if (!((_a = this.user) == null ? void 0 : _a.shop)) {
        console.error("\u274C Pas de shop pour mettre \xE0 jour le plan");
        return { success: false, error: "Shop manquant" };
      }
      try {
        const api = useApi();
        const response = await api.shops.update(this.user.shop.id, {
          subscription_plan: newPlan,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (!response.success) {
          throw new Error(response.error || "Erreur mise \xE0 jour plan");
        }
        if (this.user.shop) {
          this.user.shop.subscription_plan = newPlan;
          console.log("\u2705 Plan mis \xE0 jour vers:", newPlan);
        }
        return { success: true, data: response.data };
      } catch (error) {
        console.error("\u274C Erreur mise \xE0 jour plan:", error);
        return { success: false, error: error.message };
      }
    }
  }
});

export { useApi as a, useAuthStore as u };
//# sourceMappingURL=auth-KgQDcdck.mjs.map
