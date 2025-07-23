// types/index.ts - TYPES CORRIGÉS POUR CHATSELLER DASHBOARD

// ✅ API RESPONSE TYPE (déjà défini dans useApi.ts existant)
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success?: boolean
}

// ✅ AUTH TYPES (adaptés au useApi existant)
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
    shop_id?: string
    role?: 'admin' | 'user'
  }
}

export interface User {
  id: string
  email: string
  name?: string
  shopId?: string
  shop_id?: string
  avatar?: string
  role?: 'admin' | 'user'
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

// ✅ SHOP TYPES (du useApi existant)
export interface ShopSettingsBase {
  agentName?: string
  agentAvatar?: string
  primaryColor?: string
  welcomeMessage?: string
}

export interface Shop {
  id: string
  name: string
  domain?: string
  settings: ShopSettingsBase
  createdAt: string
  updatedAt: string
}

// ✅ CONVERSATION TYPES (du useApi existant)
export interface Message {
  id: string
  conversationId: string
  content: string
  type: 'visitor' | 'agent' | 'system'
  timestamp: string
}

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
  // Propriétés additionnelles pour la compatibilité
  customerName?: string
  customerEmail?: string
  customerPhone?: string
}

// ✅ ORDER TYPES (du useApi existant)
export interface OrderItem {
  productId?: string
  productName: string
  quantity: number
  price: number
  total?: number // Propriété calculée
  id?: string // Pour la compatibilité
}

export interface Order {
  id: string
  conversationId: string
  shopId: string
  customerInfo: {
    name: string
    email?: string
    phone?: string
    address?: string
  }
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  // Propriétés additionnelles pour la compatibilité
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  subtotal?: number
  tax?: number
  shipping?: number
  total?: number
  updatedAt?: string
  paymentMethod?: string
  metadata?: Record<string, any>
}

// ✅ KNOWLEDGE BASE TYPES (du useApi existant)
export interface KnowledgeBaseDocument {
  id: string
  shopId: string
  title: string
  content: string
  type: 'pdf' | 'word' | 'csv' | 'manual'
  fileName?: string
  uploadedAt: string
}

// Alias pour compatibilité avec l'ancien code
export interface KnowledgeItem extends KnowledgeBaseDocument {
  category?: string
  tags?: string[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

// ✅ ANALYTICS TYPES (du useApi existant)
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
  // Propriétés additionnelles pour la compatibilité
  totalOrders?: number
  conversationsToday?: number
  ordersToday?: number
  revenueToday?: number
  chartData?: {
    conversations: ChartDataPoint[]
    orders: ChartDataPoint[]
    revenue: ChartDataPoint[]
  }
}

export interface ChartDataPoint {
  date: string
  value: number
}

// ✅ SETTINGS TYPES - CORRECTION DE LA SYNTAXE
export interface ShopSettings {
  id?: string
  shopId?: string
  botName?: string
  botAvatar?: string
  welcomeMessage?: string
  primaryColor?: string
  secondaryColor?: string
  buttonText?: string
  position?: 'bottom-left' | 'bottom-right'
  isActive?: boolean
  customCss?: string
  integrationCode?: string
  upsellRules?: UpsellRule[]
  createdAt?: string
  updatedAt?: string
  // Propriétés du Shop settings
  agentName?: string
  agentAvatar?: string
}

export interface UpsellRule {
  id: string
  productId: string
  upsellProductId: string
  message: string
  discount?: number
  isActive: boolean
}

// ✅ MODAL & UI TYPES
export interface ModalProps {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  scrollable?: boolean
  onClose?: () => void
}

export interface TabItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'file'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    message?: string
  }
}

// ✅ WIDGET TYPES
export interface WidgetConfig {
  shopId: string
  botName: string
  botAvatar?: string
  welcomeMessage: string
  primaryColor: string
  position: 'bottom-left' | 'bottom-right'
  apiUrl: string
}

// ✅ UPLOAD TYPES
export interface UploadFile {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

// ✅ CHART TYPES (pour vue-chartjs)
export interface ChartOptions {
  responsive: boolean
  maintainAspectRatio: boolean
  scales?: {
    y?: {
      beginAtZero: boolean
      ticks?: {
        callback?: (value: number) => string
      }
    }
  }
  plugins?: {
    legend?: {
      display: boolean
    }
    tooltip?: {
      callbacks?: {
        label?: (context: any) => string
      }
    }
  }
}

// ✅ NOTIFICATION TYPES
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  timestamp: string
}

// ✅ PAGINATION TYPES
export interface PaginationData<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// ✅ FILTER TYPES
export interface ConversationFilter {
  status?: 'active' | 'completed' | 'abandoned'
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface OrderFilter {
  status?: 'pending' | 'confirmed' | 'cancelled'
  dateFrom?: string
  dateTo?: string
  search?: string
  minAmount?: number
  maxAmount?: number
}

// ✅ COMPONENT PROPS TYPES
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  rounded?: boolean
  outline?: boolean
}

export interface InputProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  icon?: string
  iconPosition?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
}

// ✅ UTILITY TYPES
export type EventHandler<T = Event> = (event: T) => void
export type AsyncFunction<T = void> = () => Promise<T>
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}