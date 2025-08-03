// composables/index.ts

// Export explicite de tous les composables
export { useAuth } from './useAuth'
export { useApi } from './useApi'

// Export des types utilisés depuis le chemin absolu
export type {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  AuthState,
  Conversation,
  Message,
  Order,
  OrderItem,
  KnowledgeBaseDocument,
  KnowledgeItem,
  AnalyticsData,
  Shop,
  ShopSettings
} from '../types/index'