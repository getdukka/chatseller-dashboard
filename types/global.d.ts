// types/global.d.ts

// =====================================
// GLOBAL TYPE DECLARATIONS
// =====================================

declare global {
  interface Window {
    // Custom properties that might be added to window
    ChatSeller?: {
      version: string
      environment: string
    }
  }
}

// =====================================
// API RESPONSE TYPES
// =====================================

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// =====================================
// COMMON UTILITY TYPES
// =====================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface LoadingOperation {
  state: LoadingState
  error?: string | null
}

export type DateRange = {
  start: Date | null
  end: Date | null
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: string
  direction: SortDirection
}

export interface FilterConfig {
  [key: string]: any
}

// =====================================
// FORM VALIDATION TYPES
// =====================================

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationRules {
  [field: string]: ValidationRule
}

export interface ValidationErrors {
  [field: string]: string
}

export interface FormState<T = any> {
  data: T
  errors: ValidationErrors
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
}

// =====================================
// NOTIFICATION TYPES
// =====================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary'
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  actions?: NotificationAction[]
  timestamp: Date
}

// =====================================
// ANALYTICS TYPES
// =====================================

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
  color?: string
}

export interface MetricTrend {
  current: number
  previous: number
  change: number
  changePercent: number
  isPositive: boolean
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  trend?: MetricTrend
  target?: number
  status: 'good' | 'warning' | 'danger'
}

// =====================================
// FILE UPLOAD TYPES
// =====================================

export interface FileUploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadedAt: Date
}

// =====================================
// WIDGET CONFIGURATION TYPES
// =====================================

export interface WidgetPosition {
  bottom?: number
  right?: number
  top?: number
  left?: number
}

export interface WidgetTheme {
  primaryColor: string
  secondaryColor?: string
  textColor?: string
  backgroundColor?: string
  borderRadius?: number
  fontFamily?: string
}

export interface WidgetSettings {
  enabled: boolean
  position: WidgetPosition
  theme: WidgetTheme
  showOnPages: string[]
  hideOnPages: string[]
  triggerAfterSeconds?: number
  showOnExit?: boolean
}

// =====================================
// REAL-TIME TYPES
// =====================================

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: Date
  conversationId?: string
}

export interface ConnectionStatus {
  connected: boolean
  lastSeen?: Date
  retryCount: number
  error?: string
}

// =====================================
// INTEGRATION TYPES
// =====================================

export interface IntegrationConfig {
  type: 'zapier' | 'webhook' | 'api'
  name: string
  enabled: boolean
  settings: Record<string, any>
  lastSync?: Date
  status: 'active' | 'inactive' | 'error'
}

export interface WebhookConfig {
  url: string
  method: 'POST' | 'PUT' | 'PATCH'
  headers: Record<string, string>
  events: string[]
  secret?: string
}

// =====================================
// USER PREFERENCES TYPES
// =====================================

export interface UserPreferences {
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    browser: boolean
    sound: boolean
  }
  dashboard: {
    defaultPeriod: string
    showWelcome: boolean
    compactMode: boolean
  }
}

// =====================================
// COMPONENT PROPS TYPES
// =====================================

export interface BaseComponentProps {
  class?: string
  id?: string
  'data-testid'?: string
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseComponentProps {
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
}

export interface ModalProps extends BaseComponentProps {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  persistent?: boolean
}

// =====================================
// ROUTING TYPES
// =====================================

export interface NavigationItem {
  name: string
  href: string
  icon?: any
  badge?: string | number
  children?: NavigationItem[]
  permissions?: string[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

// =====================================
// PERMISSION TYPES
// =====================================

export type Permission = 
  | 'view_dashboard'
  | 'manage_conversations'
  | 'view_analytics'
  | 'manage_knowledge_base'
  | 'manage_settings'
  | 'manage_users'
  | 'export_data'

export interface Role {
  id: string
  name: string
  permissions: Permission[]
  description?: string
}

export interface UserRole {
  userId: string
  roleId: string
  assignedAt: Date
  assignedBy: string
}

// =====================================
// EXPORT TYPES
// =====================================

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json' | 'pdf'
  dateRange?: DateRange
  filters?: FilterConfig
  columns?: string[]
  includeHeaders?: boolean
}

export interface ExportJob {
  id: string
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  downloadUrl?: string
  createdAt: Date
  completedAt?: Date
  error?: string
}

// =====================================
// EXTENSION TYPES
// =====================================

export interface Extension {
  id: string
  name: string
  version: string
  description: string
  enabled: boolean
  config: Record<string, any>
  author: string
  homepage?: string
}

// Make sure this file is treated as a module
export {};