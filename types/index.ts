// types/index.ts - TYPES COMPATIBLES AVEC USEAPI.TS EXISTANT

// ============= TYPES API RESPONSE (depuis useApi.ts) =============
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success?: boolean
}

// ============= TYPES AUTHENTIFICATION =============
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  confirmPassword?: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name?: string
    shopId?: string
    shop_id?: string // Alias pour compatibilité store
  }
}

// Type User étendu pour le store
export interface User {
  id: string
  email: string
  name?: string
  shopId?: string
  shop_id?: string // Alias pour compatibilité
  created_at?: string
  updated_at?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

// ============= TYPES BOUTIQUE (depuis useApi.ts) =============
export interface Shop {
  id: string
  name: string
  domain?: string
  settings: ShopSettings
  createdAt: string
  updatedAt: string
}

export interface ShopSettings {
  agentName?: string
  agentAvatar?: string
  primaryColor?: string
  welcomeMessage?: string
  // Ajout des champs manquants potentiels
  agent_name?: string
  agent_avatar?: string
  primary_color?: string
  welcome_message?: string
  fallback_message?: string
  upsell_enabled?: boolean
}

// ============= TYPES CONVERSATIONS (depuis useApi.ts) =============
export interface Conversation {
  id: string
  shopId: string
  visitorId: string
  status: 'active' | 'completed' | 'abandoned'
  messages: Message[]
  metadata?: {
    visitorInfo?: any
    product?: any
  }
  createdAt: string
  updatedAt: string
}

export type ConversationStatus = 'active' | 'completed' | 'abandoned'

export interface Message {
  id: string
  conversationId: string
  content: string
  type: 'visitor' | 'agent' | 'system'
  sender?: 'user' | 'agent' // Alias pour compatibilité
  message_type?: MessageType
  timestamp: string
}

export type MessageType = 'text' | 'quick_reply' | 'order_summary' | 'upsell'

// ============= TYPES COMMANDES (depuis useApi.ts) =============
export interface Order {
  id: string
  conversationId: string
  shopId: string
  customerInfo: CustomerInfo
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  // Champs additionnels
  currency?: string
  payment_method?: string
  updated_at?: string
}

export interface CustomerInfo {
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface OrderItem {
  productId?: string
  productName: string
  quantity: number
  price: number
  // Champ additionnel
  name?: string // Alias
  total?: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

// ============= TYPES BASE DE CONNAISSANCE (depuis useApi.ts) =============
export interface KnowledgeBaseDocument {
  id: string
  shopId: string
  title: string
  content: string
  type: 'pdf' | 'word' | 'csv' | 'manual'
  fileName?: string
  uploadedAt: string
  // Champs additionnels
  file_type?: string
  file_url?: string
  tags?: string[]
  created_at?: string
  updated_at?: string
}

export interface KnowledgeBase {
  id: string
  shop_id: string
  title: string
  content: string
  file_type?: string
  file_url?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface KnowledgeUpload {
  file: File
  title: string
  tags: string[]
}

// ============= TYPES ANALYTICS (depuis useApi.ts) =============
export interface AnalyticsData {
  totalConversations: number
  activeConversations: number
  completedOrders: number
  conversionRate: number
  totalRevenue: number
  averageOrderValue: number
  topProducts: Array<{
    name: string
    orders: number
    revenue: number
  }>
  conversationsByDay: Array<{
    date: string
    count: number
  }>
  revenueByDay: Array<{
    date: string
    revenue: number
  }>
  // Alias pour compatibilité
  conversations_total?: number
  conversion_rate?: number
  revenue_total?: number
  avg_order_value?: number
  active_conversations?: number
  daily_stats?: DailyStats[]
  popular_products?: ProductStats[]
}

export interface DailyStats {
  date: string
  conversations: number
  orders: number
  revenue: number
}

export interface ProductStats {
  name: string
  quantity_sold: number
  revenue: number
}

// ============= TYPES UPSELLING =============
export interface UpsellRule {
  id: string
  shop_id: string
  name: string
  trigger_product: string
  suggested_product: string
  discount_percentage?: number
  message: string
  active: boolean
  created_at: string
}

// ============= TYPES UI ET COMPOSANTS =============
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface LoadingState {
  [key: string]: boolean
}

// ============= TYPES CHARTS =============
export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
}

export interface ChartOptions {
  responsive: boolean
  maintainAspectRatio: boolean
  plugins?: {
    legend?: {
      display: boolean
      position?: 'top' | 'bottom' | 'left' | 'right'
    }
    title?: {
      display: boolean
      text?: string
    }
  }
  scales?: Record<string, any>
}

// ============= TYPES API ET PAGINATION =============
export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    items_per_page: number
  }
}

// ============= TYPES VALIDATION =============
export interface ValidationError {
  field: string
  message: string
}

export interface FormErrors {
  [key: string]: string[]
}

// ============= TYPES GLOBAUX NUXT =============
declare global {
  interface Window {
    // Pour compatibilité avec d'éventuels scripts externes
    ChatSellerWidget?: any
  }
}

// Export des types les plus utilisés pour faciliter les imports
export type {
  ApiResponse,
  LoginCredentials,
  AuthResponse,
  User,
  AuthState,
  Shop,
  Conversation,
  Message,
  Order,
  AnalyticsData,
  KnowledgeBaseDocument
}