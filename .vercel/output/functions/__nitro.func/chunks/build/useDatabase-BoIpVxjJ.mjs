import { e as defineStore } from './server.mjs';
import { a as useApi, u as useAuthStore } from './auth-KgQDcdck.mjs';
import { computed } from 'vue';

const useAgentsStore = defineStore("agents", {
  state: () => ({
    agents: [],
    currentAgent: null,
    isLoading: false,
    isCreating: false,
    error: null,
    lastFetch: null
  }),
  getters: {
    // Filter agents
    activeAgents: (state) => state.agents.filter((agent) => agent.isActive),
    inactiveAgents: (state) => state.agents.filter((agent) => !agent.isActive),
    // Stats
    totalAgents: (state) => state.agents.length,
    activeCount: (state) => state.agents.filter((agent) => agent.isActive).length,
    // Get agent by ID
    getAgentById: (state) => (id) => state.agents.find((agent) => agent.id === id),
    // Get agents by type
    getAgentsByType: (state) => (type) => state.agents.filter((agent) => agent.type === type),
    // Check if data needs refresh (15 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true;
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1e3);
      return state.lastFetch < fifteenMinutesAgo;
    }
  },
  actions: {
    // ✅ FETCH AGENTS - VERSION CORRIGÉE
    async fetchAgents(forceRefresh = false) {
      if (!forceRefresh && !this.needsRefresh) {
        return;
      }
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.error = "Utilisateur non authentifi\xE9";
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        console.log("\u{1F916} [Agents] Chargement agents via API...");
        const api = useApi();
        const response = await api.agents.list();
        console.log("\u{1F916} [Agents] R\xE9ponse API:", response);
        if (response.success && response.data) {
          this.agents = response.data;
          this.lastFetch = /* @__PURE__ */ new Date();
          this.error = null;
          console.log("\u2705 [Agents] Agents charg\xE9s:", response.data.length);
        } else {
          this.error = response.error || "Erreur lors du chargement des agents";
          console.error("\u274C [Agents] Erreur:", this.error);
        }
      } catch (error) {
        this.error = error.message || "Erreur lors du chargement des agents";
        console.error("\u274C [Agents] Exception:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // ✅ CREATE AGENT
    async createAgent(data) {
      this.isCreating = true;
      this.error = null;
      try {
        console.log("\u{1F916} [Agents] Cr\xE9ation agent...");
        const api = useApi();
        const response = await api.agents.create(data);
        if (response.success && response.data) {
          this.agents.unshift(response.data);
          console.log("\u2705 [Agents] Agent cr\xE9\xE9");
          return response.data;
        } else {
          this.error = response.error || "Erreur lors de la cr\xE9ation de l'agent";
          return null;
        }
      } catch (error) {
        this.error = error.message || "Erreur lors de la cr\xE9ation de l'agent";
        console.error("\u274C [Agents] Exception:", error);
        return null;
      } finally {
        this.isCreating = false;
      }
    },
    // ✅ UPDATE AGENT
    async updateAgent(agentId, data) {
      var _a;
      try {
        console.log("\u{1F916} [Agents] Mise \xE0 jour agent:", agentId);
        const api = useApi();
        const response = await api.agents.update(agentId, data);
        if (response.success && response.data) {
          const index = this.agents.findIndex((agent) => agent.id === agentId);
          if (index !== -1) {
            this.agents[index] = { ...this.agents[index], ...response.data };
          }
          if (((_a = this.currentAgent) == null ? void 0 : _a.id) === agentId) {
            this.currentAgent = { ...this.currentAgent, ...response.data };
          }
          console.log("\u2705 [Agents] Agent mis \xE0 jour");
          return true;
        } else {
          this.error = response.error || "Erreur lors de la mise \xE0 jour de l'agent";
          return false;
        }
      } catch (error) {
        this.error = error.message || "Erreur lors de la mise \xE0 jour de l'agent";
        console.error("\u274C [Agents] Exception:", error);
        return false;
      }
    },
    // ✅ DELETE AGENT
    async deleteAgent(agentId) {
      var _a;
      try {
        console.log("\u{1F916} [Agents] Suppression agent:", agentId);
        const api = useApi();
        const response = await api.agents.delete(agentId);
        if (response.success) {
          const index = this.agents.findIndex((agent) => agent.id === agentId);
          if (index !== -1) {
            this.agents.splice(index, 1);
          }
          if (((_a = this.currentAgent) == null ? void 0 : _a.id) === agentId) {
            this.currentAgent = null;
          }
          console.log("\u2705 [Agents] Agent supprim\xE9");
          return true;
        } else {
          this.error = response.error || "Erreur lors de la suppression de l'agent";
          return false;
        }
      } catch (error) {
        this.error = error.message || "Erreur lors de la suppression de l'agent";
        console.error("\u274C [Agents] Exception:", error);
        return false;
      }
    },
    // ✅ TOGGLE AGENT STATUS
    async toggleAgent(agentId, isActive) {
      return await this.updateAgent(agentId, { isActive });
    },
    // ✅ SET CURRENT AGENT
    setCurrentAgent(agent) {
      this.currentAgent = agent;
    },
    // ✅ CLEAR ERROR
    clearError() {
      this.error = null;
    },
    // ✅ CLEAR DATA - Pour logout
    clearData() {
      this.agents = [];
      this.currentAgent = null;
      this.error = null;
      this.lastFetch = null;
    },
    // ✅ GET AGENT TYPES
    getAgentTypes() {
      return [
        { value: "conversion", label: "Vendeur Conversion Expert" },
        { value: "product", label: "Conseiller Produit Avanc\xE9" },
        { value: "support", label: "Support-Vente" },
        { value: "premium", label: "Vendeur Premium/Luxe" },
        { value: "flash", label: "Vendeur Flash/Promotions" },
        { value: "custom", label: "Agent Personnalisable" }
      ];
    },
    // ✅ GET PERSONALITIES
    getPersonalities() {
      return [
        { value: "friendly", label: "Amical" },
        { value: "professional", label: "Professionnel" },
        { value: "expert", label: "Expert" },
        { value: "casual", label: "D\xE9contract\xE9" },
        { value: "premium", label: "Premium" },
        { value: "enthusiastic", label: "Enthousiaste" }
      ];
    }
  }
});
const useAgents = () => {
  const agentsStore = useAgentsStore();
  return {
    // State
    agents: computed(() => agentsStore.agents),
    currentAgent: computed(() => agentsStore.currentAgent),
    isLoading: computed(() => agentsStore.isLoading),
    isCreating: computed(() => agentsStore.isCreating),
    error: computed(() => agentsStore.error),
    // Getters
    activeAgents: computed(() => agentsStore.activeAgents),
    inactiveAgents: computed(() => agentsStore.inactiveAgents),
    totalAgents: computed(() => agentsStore.totalAgents),
    activeCount: computed(() => agentsStore.activeCount),
    // Actions
    fetchAgents: agentsStore.fetchAgents,
    createAgent: agentsStore.createAgent,
    updateAgent: agentsStore.updateAgent,
    deleteAgent: agentsStore.deleteAgent,
    toggleAgent: agentsStore.toggleAgent,
    setCurrentAgent: agentsStore.setCurrentAgent,
    clearError: agentsStore.clearError,
    clearData: agentsStore.clearData,
    getAgentTypes: agentsStore.getAgentTypes,
    getPersonalities: agentsStore.getPersonalities,
    // Utilities
    getAgentById: agentsStore.getAgentById,
    getAgentsByType: agentsStore.getAgentsByType
  };
};
const useAnalyticsStore = defineStore("analytics", {
  state: () => ({
    data: null,
    isLoading: false,
    error: null,
    lastFetch: null,
    selectedPeriod: "30d"
  }),
  getters: {
    // Quick stats
    totalConversations: (state) => {
      var _a;
      return ((_a = state.data) == null ? void 0 : _a.totalConversations) || 0;
    },
    activeConversations: (state) => {
      var _a;
      return ((_a = state.data) == null ? void 0 : _a.activeConversations) || 0;
    },
    completedOrders: (state) => {
      var _a;
      return ((_a = state.data) == null ? void 0 : _a.completedOrders) || 0;
    },
    conversionRate: (state) => {
      var _a;
      return ((_a = state.data) == null ? void 0 : _a.conversionRate) || 0;
    },
    totalRevenue: (state) => {
      var _a;
      return ((_a = state.data) == null ? void 0 : _a.totalRevenue) || 0;
    },
    averageOrderValue: (state) => {
      var _a;
      return ((_a = state.data) == null ? void 0 : _a.averageOrderValue) || 0;
    },
    // Formatted values
    formattedRevenue: (state) => {
      var _a;
      const revenue = ((_a = state.data) == null ? void 0 : _a.totalRevenue) || 0;
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
      }).format(revenue);
    },
    formattedAOV: (state) => {
      var _a;
      const aov = ((_a = state.data) == null ? void 0 : _a.averageOrderValue) || 0;
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
      }).format(aov);
    },
    formattedConversionRate: (state) => {
      var _a;
      const rate = ((_a = state.data) == null ? void 0 : _a.conversionRate) || 0;
      return `${(rate * 100).toFixed(1)}%`;
    },
    // Check if data needs refresh (5 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true;
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1e3);
      return state.lastFetch < fiveMinutesAgo;
    }
  },
  actions: {
    // ✅ FETCH ANALYTICS - VERSION CORRIGÉE
    async fetchAnalytics(forceRefresh = false) {
      if (!forceRefresh && !this.needsRefresh) {
        return;
      }
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.error = "Utilisateur non authentifi\xE9";
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        console.log("\u{1F4CA} [Analytics] Chargement analytics via API...");
        const api = useApi();
        const response = await api.analytics.dashboard();
        console.log("\u{1F4CA} [Analytics] R\xE9ponse API:", response);
        if (response.success && response.data) {
          this.data = response.data;
          this.lastFetch = /* @__PURE__ */ new Date();
          this.error = null;
          console.log("\u2705 [Analytics] Analytics charg\xE9es avec succ\xE8s");
        } else {
          this.error = response.error || "Erreur lors du chargement des analytics";
          console.error("\u274C [Analytics] Erreur:", this.error);
        }
      } catch (error) {
        this.error = error.message || "Erreur lors du chargement des analytics";
        console.error("\u274C [Analytics] Exception:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // ✅ SET PERIOD - VERSION CORRIGÉE
    setPeriod(period) {
      if (this.selectedPeriod !== period) {
        this.selectedPeriod = period;
        this.fetchAnalytics(true);
      }
    },
    // ✅ CLEAR ERROR
    clearError() {
      this.error = null;
    },
    // ✅ CLEAR DATA - Pour logout
    clearData() {
      this.data = null;
      this.error = null;
      this.lastFetch = null;
      this.selectedPeriod = "30d";
    },
    // ✅ GET PERIOD LABEL
    getPeriodLabel() {
      switch (this.selectedPeriod) {
        case "7d":
          return "7 derniers jours";
        case "30d":
          return "30 derniers jours";
        case "90d":
          return "3 derniers mois";
        case "1y":
          return "12 derniers mois";
        default:
          return "30 derniers jours";
      }
    }
  }
});
const useAnalytics = () => {
  const analyticsStore = useAnalyticsStore();
  return {
    // State
    data: computed(() => analyticsStore.data),
    isLoading: computed(() => analyticsStore.isLoading),
    error: computed(() => analyticsStore.error),
    selectedPeriod: computed(() => analyticsStore.selectedPeriod),
    // Getters
    totalConversations: computed(() => analyticsStore.totalConversations),
    activeConversations: computed(() => analyticsStore.activeConversations),
    completedOrders: computed(() => analyticsStore.completedOrders),
    conversionRate: computed(() => analyticsStore.conversionRate),
    totalRevenue: computed(() => analyticsStore.totalRevenue),
    averageOrderValue: computed(() => analyticsStore.averageOrderValue),
    formattedRevenue: computed(() => analyticsStore.formattedRevenue),
    formattedAOV: computed(() => analyticsStore.formattedAOV),
    formattedConversionRate: computed(() => analyticsStore.formattedConversionRate),
    // Actions
    fetchAnalytics: analyticsStore.fetchAnalytics,
    setPeriod: analyticsStore.setPeriod,
    clearError: analyticsStore.clearError,
    clearData: analyticsStore.clearData,
    getPeriodLabel: analyticsStore.getPeriodLabel
  };
};
const useConversationsStore = defineStore("conversations", {
  state: () => ({
    conversations: [],
    currentConversation: null,
    isLoading: false,
    isLoadingConversation: false,
    error: null,
    lastFetch: null
  }),
  getters: {
    // Get conversations by status
    activeConversations: (state) => state.conversations.filter((conv) => conv.status === "active"),
    completedConversations: (state) => state.conversations.filter((conv) => conv.status === "completed"),
    // Stats
    totalConversations: (state) => state.conversations.length,
    activeCount: (state) => state.conversations.filter((conv) => conv.status === "active").length,
    // Get conversation by ID
    getConversationById: (state) => (id) => state.conversations.find((conv) => conv.id === id),
    // Get latest conversations (most recent first)
    latestConversations: (state) => [...state.conversations].sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()).slice(0, 10),
    // Check if data needs refresh (5 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true;
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1e3);
      return state.lastFetch < fiveMinutesAgo;
    }
  },
  actions: {
    // ✅ FETCH CONVERSATIONS - VERSION CORRIGÉE
    async fetchConversations(forceRefresh = false) {
      if (!forceRefresh && !this.needsRefresh) {
        return;
      }
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.error = "Utilisateur non authentifi\xE9";
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        console.log("\u{1F4AC} [Conversations] Chargement conversations via API...");
        const api = useApi();
        const response = await api.conversations.list();
        console.log("\u{1F4AC} [Conversations] R\xE9ponse API:", response);
        if (response.success && response.data) {
          this.conversations = response.data;
          this.lastFetch = /* @__PURE__ */ new Date();
          this.error = null;
          console.log("\u2705 [Conversations] Conversations charg\xE9es:", response.data.length);
        } else {
          this.error = response.error || "Erreur lors du chargement des conversations";
          console.error("\u274C [Conversations] Erreur:", this.error);
        }
      } catch (error) {
        this.error = error.message || "Erreur lors du chargement des conversations";
        console.error("\u274C [Conversations] Exception:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // ✅ FETCH SPECIFIC CONVERSATION
    async fetchConversation(conversationId) {
      this.isLoadingConversation = true;
      this.error = null;
      try {
        console.log("\u{1F4AC} [Conversations] Chargement conversation:", conversationId);
        const api = useApi();
        const response = await api.conversations.get(conversationId);
        if (response.success && response.data) {
          this.currentConversation = response.data;
          const index = this.conversations.findIndex((conv) => conv.id === conversationId);
          if (index !== -1) {
            this.conversations[index] = response.data;
          }
          console.log("\u2705 [Conversations] Conversation charg\xE9e");
          return response.data;
        } else {
          this.error = response.error || "Erreur lors du chargement de la conversation";
          return null;
        }
      } catch (error) {
        this.error = error.message || "Erreur lors du chargement de la conversation";
        console.error("\u274C [Conversations] Exception:", error);
        return null;
      } finally {
        this.isLoadingConversation = false;
      }
    },
    // ✅ CREATE NEW CONVERSATION
    async createConversation(data) {
      try {
        console.log("\u{1F4AC} [Conversations] Cr\xE9ation conversation...");
        const api = useApi();
        const response = await api.conversations.create(data);
        if (response.success && response.data) {
          this.conversations.unshift(response.data);
          console.log("\u2705 [Conversations] Conversation cr\xE9\xE9e");
          return response.data;
        } else {
          this.error = response.error || "Erreur lors de la cr\xE9ation de la conversation";
          return null;
        }
      } catch (error) {
        this.error = error.message || "Erreur lors de la cr\xE9ation de la conversation";
        console.error("\u274C [Conversations] Exception:", error);
        return null;
      }
    },
    // ✅ SET CURRENT CONVERSATION
    setCurrentConversation(conversation) {
      this.currentConversation = conversation;
    },
    // ✅ CLEAR ERROR
    clearError() {
      this.error = null;
    },
    // ✅ CLEAR DATA - Pour logout
    clearData() {
      this.conversations = [];
      this.currentConversation = null;
      this.error = null;
      this.lastFetch = null;
    }
  }
});
const useConversations = () => {
  const conversationsStore = useConversationsStore();
  return {
    // State
    conversations: computed(() => conversationsStore.conversations),
    currentConversation: computed(() => conversationsStore.currentConversation),
    isLoading: computed(() => conversationsStore.isLoading),
    isLoadingConversation: computed(() => conversationsStore.isLoadingConversation),
    error: computed(() => conversationsStore.error),
    // Getters
    activeConversations: computed(() => conversationsStore.activeConversations),
    completedConversations: computed(() => conversationsStore.completedConversations),
    totalConversations: computed(() => conversationsStore.totalConversations),
    activeCount: computed(() => conversationsStore.activeCount),
    latestConversations: computed(() => conversationsStore.latestConversations),
    // Actions
    fetchConversations: conversationsStore.fetchConversations,
    fetchConversation: conversationsStore.fetchConversation,
    createConversation: conversationsStore.createConversation,
    setCurrentConversation: conversationsStore.setCurrentConversation,
    clearError: conversationsStore.clearError,
    clearData: conversationsStore.clearData,
    // Utilities
    getConversationById: conversationsStore.getConversationById
  };
};
const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    isCreating: false,
    error: null,
    lastFetch: null,
    filters: {
      status: "all",
      dateRange: {
        start: null,
        end: null
      },
      searchTerm: ""
    }
  }),
  getters: {
    // Filter orders based on current filters
    filteredOrders: (state) => {
      let filtered = [...state.orders];
      if (state.filters.status !== "all") {
        filtered = filtered.filter((order) => order.status === state.filters.status);
      }
      if (state.filters.dateRange.start) {
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= state.filters.dateRange.start
        );
      }
      if (state.filters.dateRange.end) {
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) <= state.filters.dateRange.end
        );
      }
      if (state.filters.searchTerm) {
        const searchLower = state.filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (order) => order.customerName.toLowerCase().includes(searchLower) || order.customerPhone.toLowerCase().includes(searchLower) || order.customerEmail && order.customerEmail.toLowerCase().includes(searchLower) || order.productItems.some(
            (item) => item.name.toLowerCase().includes(searchLower)
          )
        );
      }
      return filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    // Orders by status
    pendingOrders: (state) => state.orders.filter((order) => order.status === "pending"),
    confirmedOrders: (state) => state.orders.filter((order) => order.status === "confirmed"),
    cancelledOrders: (state) => state.orders.filter((order) => order.status === "cancelled"),
    // Statistics
    totalOrders: (state) => state.orders.length,
    totalRevenue: (state) => state.orders.filter((order) => order.status === "confirmed").reduce((sum, order) => sum + order.totalAmount, 0),
    averageOrderValue: (state) => {
      const confirmedOrders = state.orders.filter((order) => order.status === "confirmed");
      if (confirmedOrders.length === 0) return 0;
      return confirmedOrders.reduce((sum, order) => sum + order.totalAmount, 0) / confirmedOrders.length;
    },
    // Get order by ID
    getOrderById: (state) => (id) => state.orders.find((order) => order.id === id),
    // Check if data needs refresh (10 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true;
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1e3);
      return state.lastFetch < tenMinutesAgo;
    }
  },
  actions: {
    // ✅ FETCH ORDERS - VERSION TEMPORAIRE (API list pas encore implémentée)
    async fetchOrders(forceRefresh = false) {
      if (!forceRefresh && !this.needsRefresh) {
        return;
      }
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.error = "Utilisateur non authentifi\xE9";
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        console.log("\u{1F6D2} [Orders] Chargement commandes via API...");
        const api = useApi();
        const response = await api.orders.list();
        console.log("\u{1F6D2} [Orders] R\xE9ponse API:", response);
        if (response.success && response.data) {
          this.orders = response.data;
          this.lastFetch = /* @__PURE__ */ new Date();
          this.error = null;
          console.log("\u2705 [Orders] Commandes charg\xE9es:", response.data.length);
        } else {
          this.orders = [];
          this.lastFetch = /* @__PURE__ */ new Date();
          this.error = null;
          console.log("\u2139\uFE0F [Orders] Pas de commandes (API pas encore impl\xE9ment\xE9e)");
        }
      } catch (error) {
        this.error = error.message || "Erreur lors du chargement des commandes";
        console.error("\u274C [Orders] Exception:", error);
        this.orders = [];
        this.lastFetch = /* @__PURE__ */ new Date();
      } finally {
        this.isLoading = false;
      }
    },
    // ✅ START ORDER WORKFLOW
    async startOrder(data) {
      try {
        console.log("\u{1F6D2} [Orders] D\xE9marrage workflow commande...");
        const api = useApi();
        const response = await api.orders.startOrder(data);
        if (response.success) {
          console.log("\u2705 [Orders] Workflow commande d\xE9marr\xE9");
          return response.data;
        } else {
          this.error = response.error || "Erreur lors du d\xE9marrage de la commande";
          return null;
        }
      } catch (error) {
        this.error = error.message || "Erreur lors du d\xE9marrage de la commande";
        console.error("\u274C [Orders] Exception:", error);
        return null;
      }
    },
    // ✅ COMPLETE ORDER
    async completeOrder(data) {
      this.isCreating = true;
      try {
        console.log("\u{1F6D2} [Orders] Finalisation commande...");
        const api = useApi();
        const response = await api.orders.complete(data);
        if (response.success && response.data) {
          this.orders.unshift(response.data);
          console.log("\u2705 [Orders] Commande finalis\xE9e");
          return response.data;
        } else {
          this.error = response.error || "Erreur lors de la finalisation de la commande";
          return null;
        }
      } catch (error) {
        this.error = error.message || "Erreur lors de la finalisation de la commande";
        console.error("\u274C [Orders] Exception:", error);
        return null;
      } finally {
        this.isCreating = false;
      }
    },
    // ✅ FILTERING ACTIONS
    setStatusFilter(status) {
      this.filters.status = status;
    },
    setDateRangeFilter(start, end) {
      this.filters.dateRange.start = start;
      this.filters.dateRange.end = end;
    },
    setSearchTerm(term) {
      this.filters.searchTerm = term;
    },
    clearFilters() {
      this.filters = {
        status: "all",
        dateRange: {
          start: null,
          end: null
        },
        searchTerm: ""
      };
    },
    // ✅ UTILITY ACTIONS
    setCurrentOrder(order) {
      this.currentOrder = order;
    },
    clearError() {
      this.error = null;
    },
    clearData() {
      this.orders = [];
      this.currentOrder = null;
      this.error = null;
      this.lastFetch = null;
      this.clearFilters();
    }
  }
});
const useOrders = () => {
  const ordersStore = useOrdersStore();
  return {
    // State
    orders: computed(() => ordersStore.orders),
    currentOrder: computed(() => ordersStore.currentOrder),
    isLoading: computed(() => ordersStore.isLoading),
    isCreating: computed(() => ordersStore.isCreating),
    error: computed(() => ordersStore.error),
    filters: computed(() => ordersStore.filters),
    // Getters
    filteredOrders: computed(() => ordersStore.filteredOrders),
    pendingOrders: computed(() => ordersStore.pendingOrders),
    confirmedOrders: computed(() => ordersStore.confirmedOrders),
    cancelledOrders: computed(() => ordersStore.cancelledOrders),
    totalOrders: computed(() => ordersStore.totalOrders),
    totalRevenue: computed(() => ordersStore.totalRevenue),
    averageOrderValue: computed(() => ordersStore.averageOrderValue),
    // Actions
    fetchOrders: ordersStore.fetchOrders,
    startOrder: ordersStore.startOrder,
    completeOrder: ordersStore.completeOrder,
    setStatusFilter: ordersStore.setStatusFilter,
    setDateRangeFilter: ordersStore.setDateRangeFilter,
    setSearchTerm: ordersStore.setSearchTerm,
    clearFilters: ordersStore.clearFilters,
    setCurrentOrder: ordersStore.setCurrentOrder,
    clearError: ordersStore.clearError,
    clearData: ordersStore.clearData,
    // Utilities
    getOrderById: ordersStore.getOrderById
  };
};
const useDatabase = () => {
  const {
    fetchConversations,
    conversations,
    isLoading: conversationsLoading,
    error: conversationsError
  } = useConversations();
  const {
    fetchOrders,
    orders,
    isLoading: ordersLoading,
    error: ordersError
  } = useOrders();
  const {
    fetchAgents,
    agents,
    isLoading: agentsLoading,
    error: agentsError
  } = useAgents();
  const {
    fetchAnalytics,
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError
  } = useAnalytics();
  const getConversations = async () => {
    console.log("\u{1F4DE} [DB] R\xE9cup\xE9ration conversations via store...");
    await fetchConversations();
    return conversations.value || [];
  };
  const getOrders = async () => {
    console.log("\u{1F6D2} [DB] R\xE9cup\xE9ration commandes via store...");
    await fetchOrders();
    return orders.value || [];
  };
  const getAgents = async () => {
    console.log("\u{1F916} [DB] R\xE9cup\xE9ration agents via store...");
    await fetchAgents();
    return agents.value || [];
  };
  const getAnalytics = async () => {
    console.log("\u{1F4CA} [DB] R\xE9cup\xE9ration analytics via store...");
    await fetchAnalytics();
    return analyticsData.value || {
      totalConversations: 0,
      activeConversations: 0,
      completedConversations: 0,
      completedOrders: 0,
      totalRevenue: 0,
      conversionRate: 0,
      averageOrderValue: 0,
      conversationsByDay: [],
      revenueByDay: [],
      topProducts: []
    };
  };
  const getKnowledgeBase = async () => {
    console.log("\u{1F4DA} [DB] R\xE9cup\xE9ration knowledge base via API...");
    try {
      const api = useApi();
      const response = await api.knowledgeBase.list();
      if (response.success && response.data) {
        console.log("\u2705 [DB] Documents r\xE9cup\xE9r\xE9s:", response.data.length);
        return response.data;
      } else {
        console.error("\u274C [DB] Erreur knowledge base:", response.error);
        return [];
      }
    } catch (error) {
      console.error("\u274C [DB] Exception knowledge base:", error);
      return [];
    }
  };
  const getShop = async (shopId) => {
    console.log("\u{1F3EA} [DB] R\xE9cup\xE9ration shop via API...");
    try {
      const api = useApi();
      const response = await api.shops.get(shopId);
      if (response.success && response.data) {
        console.log("\u2705 [DB] Shop r\xE9cup\xE9r\xE9");
        return response.data;
      } else {
        console.error("\u274C [DB] Erreur shop:", response.error);
        return null;
      }
    } catch (error) {
      console.error("\u274C [DB] Exception shop:", error);
      return null;
    }
  };
  const create = async (table, data) => {
    console.log(`\u2795 [DB] Cr\xE9ation ${table} via API:`, data);
    try {
      const api = useApi();
      switch (table) {
        case "agents":
          const agentsStore = useAgents();
          return await agentsStore.createAgent(data);
        case "products":
          const response = await api.products.create(data);
          return response.success ? response.data : null;
        case "conversations":
          const conversationsStore = useConversations();
          return await conversationsStore.createConversation(data);
        default:
          console.error("\u274C [DB] Table non support\xE9e:", table);
          return null;
      }
    } catch (error) {
      console.error(`\u274C [DB] Erreur cr\xE9ation ${table}:`, error);
      return null;
    }
  };
  const update = async (table, id, data) => {
    console.log(`\u270F\uFE0F [DB] Mise \xE0 jour ${table}/${id} via API:`, data);
    try {
      const api = useApi();
      switch (table) {
        case "agents":
          const agentsStore = useAgents();
          const success = await agentsStore.updateAgent(id, data);
          return success ? data : null;
        case "products":
          const response = await api.products.update(id, data);
          return response.success ? response.data : null;
        case "shops":
          const shopResponse = await api.shops.update(id, data);
          return shopResponse.success ? shopResponse.data : null;
        default:
          console.error("\u274C [DB] Table non support\xE9e:", table);
          return null;
      }
    } catch (error) {
      console.error(`\u274C [DB] Erreur mise \xE0 jour ${table}:`, error);
      return null;
    }
  };
  const remove = async (table, id) => {
    console.log(`\u{1F5D1}\uFE0F [DB] Suppression ${table}/${id} via API`);
    try {
      const api = useApi();
      switch (table) {
        case "agents":
          const agentsStore = useAgents();
          return await agentsStore.deleteAgent(id);
        case "products":
          const response = await api.products.delete(id);
          return response.success;
        case "knowledge_base":
          const kbResponse = await api.knowledgeBase.delete(id);
          return kbResponse.success;
        default:
          console.error("\u274C [DB] Table non support\xE9e:", table);
          return false;
      }
    } catch (error) {
      console.error(`\u274C [DB] Erreur suppression ${table}:`, error);
      return false;
    }
  };
  const count = async (table, filters = {}) => {
    const data = await getData(table, filters);
    return data.length;
  };
  const getData = async (table, filters = {}) => {
    switch (table) {
      case "conversations":
        return await getConversations();
      case "orders":
        return await getOrders();
      case "agents":
        return await getAgents();
      case "knowledge_base":
        return await getKnowledgeBase();
      default:
        console.error("\u274C [DB] Table non support\xE9e:", table);
        return [];
    }
  };
  const getStats = async () => {
    console.log("\u{1F4C8} [DB] Calcul des statistiques via stores...");
    try {
      const analytics = await getAnalytics();
      if (analytics) {
        console.log("\u2705 [DB] Statistiques r\xE9cup\xE9r\xE9es depuis analytics");
        return {
          totalConversations: analytics.totalConversations,
          totalOrders: analytics.completedOrders,
          totalAgents: analytics.totalConversations > 0 ? 1 : 0,
          // Approximation
          totalRevenue: analytics.totalRevenue,
          conversionRate: analytics.conversionRate
        };
      }
      const [conversationsData, ordersData, agentsData] = await Promise.all([
        getConversations(),
        getOrders(),
        getAgents()
      ]);
      const stats = {
        totalConversations: conversationsData.length,
        totalOrders: ordersData.length,
        totalAgents: agentsData.length,
        totalRevenue: ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        conversionRate: conversationsData.length > 0 ? ordersData.length / conversationsData.length * 100 : 0
      };
      console.log("\u2705 [DB] Statistiques calcul\xE9es:", stats);
      return stats;
    } catch (error) {
      console.error("\u274C [DB] Erreur calcul statistiques:", error);
      return {
        totalConversations: 0,
        totalOrders: 0,
        totalAgents: 0,
        totalRevenue: 0,
        conversionRate: 0
      };
    }
  };
  const healthCheck = async () => {
    console.log("\u{1F3E5} [DB] Health check API...");
    try {
      const api = useApi();
      const response = await api.utils.healthCheck();
      if (response.success) {
        console.log("\u2705 [DB] API en bonne sant\xE9");
        return true;
      } else {
        console.error("\u274C [DB] API non disponible:", response.error);
        return false;
      }
    } catch (error) {
      console.error("\u274C [DB] Exception health check:", error);
      return false;
    }
  };
  const isLoading = computed(
    () => conversationsLoading.value || ordersLoading.value || agentsLoading.value || analyticsLoading.value
  );
  const lastError = computed(
    () => conversationsError.value || ordersError.value || agentsError.value || analyticsError.value
  );
  return {
    // Fonctions principales
    getConversations,
    getOrders,
    getAgents,
    getAnalytics,
    getKnowledgeBase,
    getShop,
    getStats,
    // Opérations CRUD
    create,
    update,
    remove,
    // Utilitaires
    count,
    getData,
    healthCheck,
    // Status
    isLoading,
    lastError
  };
};

export { useDatabase as u };
//# sourceMappingURL=useDatabase-BoIpVxjJ.mjs.map
