// composables/useStores.ts

// Export de tous les composables pour simplifier les imports
export { useAuth } from '~/stores/auth'
export { useNotifications } from '~/composables/useNotifications'

// Stores fictifs temporaires pour éviter les erreurs
export const useAnalytics = () => ({
  fetchAnalytics: () => Promise.resolve(),
  isLoading: ref(false),
  error: ref(null),
  data: ref(null),
  selectedPeriod: ref('30d'),
  setPeriod: () => {},
  totalConversations: ref(0),
  activeConversations: ref(0),
  completedOrders: ref(0),
  formattedRevenue: ref('0€'),
  formattedAOV: ref('0€'),
  formattedConversionRate: ref('0%'),
  conversationsChartData: ref([]),
  revenueChartData: ref([]),
  topProductsForDisplay: ref([]),
  performanceIndicators: ref([]),
  getRealTimeStats: () => ({
    activeNow: 0,
    todayConversations: 0,
    todayRevenue: 0,
    responseTime: '< 30s'
  }),
  getPeriodLabel: () => '30 derniers jours',
  exportToCSV: () => '',
  conversionRate: ref(0)
})

export const useConversations = () => ({
  fetchConversations: () => Promise.resolve(),
  isLoading: ref(false),
  error: ref(null),
  conversations: ref([]),
  activeConversations: ref([]),
  completedConversations: ref([]),
  abandonedConversations: ref([]),
  totalConversations: ref(0),
  activeCount: ref(0),
  latestConversations: ref([]),
  getConversationSummary: () => ({
    visitorName: 'Visiteur',
    lastMessage: 'Message',
    messageCount: 0,
    duration: '0min'
  }),
  takeoverConversation: () => Promise.resolve(true)
})

export const useOrders = () => ({
  fetchOrders: () => Promise.resolve(),
  isLoading: ref(false),
  error: ref(null),
  filteredOrders: ref([]),
  totalOrders: ref(0),
  totalRevenue: ref(0),
  pendingOrders: ref([]),
  confirmedOrders: ref([]),
  filters: ref({ status: 'all' }),
  setStatusFilter: () => {},
  setDateRangeFilter: () => {},
  setSearchTerm: () => {},
  clearFilters: () => {},
  exportToCSV: () => ''
})

export const useKnowledgeBase = () => ({
  fetchDocuments: () => Promise.resolve(),
  uploadFile: () => Promise.resolve(null),
  addManualContent: () => Promise.resolve(null),
  deleteDocument: () => Promise.resolve(true),
  isLoading: ref(false),
  isUploading: ref(false),
  error: ref(null),
  uploadProgress: ref(0),
  documents: ref([]),
  filteredDocuments: ref([]),
  pdfDocuments: ref([]),
  wordDocuments: ref([]),
  csvDocuments: ref([]),
  manualDocuments: ref([]),
  filters: ref({ type: 'all', search: '' }),
  setTypeFilter: () => {},
  setSearchTerm: () => {},
  clearFilters: () => {},
  getDocumentSummary: () => ({
    preview: 'Aperçu',
    wordCount: 0,
    size: '0k',
    uploadDate: new Date().toLocaleDateString()
  }),
  validateFile: () => ({ isValid: true }),
  getKnowledgeBaseStatus: () => ({
    isEmpty: true,
    totalDocuments: 0,
    totalContent: 0,
    lastUpdate: null,
    readiness: 'empty'
  }),
  getFileTypeIcon: () => '📄',
  clearError: () => {}
})

export const useSettings = () => ({
  fetchSettings: () => Promise.resolve(),
  saveSettings: () => Promise.resolve(true),
  isLoading: ref(false),
  isSaving: ref(false),
  error: ref(null),
  settings: ref(null),
  hasUnsavedChanges: ref(false),
  configurationScore: ref(0),
  discardChanges: () => {},
  clearError: () => {}
})