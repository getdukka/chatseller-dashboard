// types/global.d.ts - DÉCLARATIONS GLOBALES TYPESCRIPT COMPLÈTES

import type { useAuth as _useAuth } from '~/composables/useAuth'
import type { useApi as _useApi } from '~/composables/useApi'

declare global {
  // ✅ COMPOSABLES GLOBAUX
  const useAuth: typeof _useAuth
  const useApi: typeof _useApi
  
  // ✅ NUXT GLOBALS - COMPLETS
  const defineNuxtConfig: any
  const defineNuxtPlugin: any // ⚠️ MANQUAIT
  const defineNuxtRouteMiddleware: any
  const definePageMeta: any
  const defineEventHandler: any // ⚠️ MANQUAIT
  const navigateTo: any
  const useRuntimeConfig: any
  const useHead: any
  const useSeoMeta: any
  const $fetch: any
  const createError: any
  const getRouterParam: any // ⚠️ MANQUAIT
  const getQuery: any // ⚠️ MANQUAIT
  const getMethod: any // ⚠️ MANQUAIT
  const readBody: any // ⚠️ MANQUAIT
  const getHeader: any // ⚠️ MANQUAIT
  
  // ✅ VUE GLOBALS
  const ref: any
  const reactive: any
  const computed: any
  const watch: any
  const watchEffect: any
  const onMounted: any
  const onUnmounted: any
  const nextTick: any
  const toRef: any
  const toRefs: any
  const readonly: any
  const inject: any
  const provide: any
  const withDefaults: any // ⚠️ MANQUAIT
  const defineProps: any // ⚠️ MANQUAIT
  const defineEmits: any // ⚠️ MANQUAIT
  
  // ✅ PINIA GLOBALS
  const defineStore: any
  
  // ✅ AUTRES GLOBALS MANQUANTS
  const process: any
  const console: any
  const setTimeout: any
  const clearTimeout: any
  const setInterval: any
  const clearInterval: any
  const localStorage: any
  const sessionStorage: any
  const window: any
  const document: any
  
  // ✅ WINDOW EXTENSIONS (pour debugging)
  interface Window {
    __CHATSELLER_COMPOSABLES__?: {
      useAuth: any
      useApi: any
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

export interface FormState<T> {
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

// Make sure this file is treated as a module
export {}