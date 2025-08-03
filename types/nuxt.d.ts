// types/nuxt.d.ts - DÉCLARATIONS GLOBALES NUXT

import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { App } from 'vue'

// =====================================
// NUXT GLOBAL DECLARATIONS
// =====================================

declare global {
  // Nuxt composables
  function useRoute(): RouteLocationNormalizedLoaded
  function useRouter(): Router
  function useRuntimeConfig(): any
  function navigateTo(to: any, options?: any): Promise<void>
  function definePageMeta(meta: any): void
  function defineNuxtRouteMiddleware(middleware: any): any
  function useHead(head: any): void
  function useSeoMeta(meta: any): void
  function $fetch(url: string, options?: any): Promise<any>
  function useNuxtApp(): {
    $router: Router
    $route: RouteLocationNormalizedLoaded
    [key: string]: any
  }

  // Server composables
  function defineEventHandler(handler: any): any
  function readBody(event: any): Promise<any>
  function createError(error: any): any
  function setCookie(event: any, name: string, value: string, options?: any): void
  function getCookie(event: any, name: string): string | undefined
  function getHeader(event: any, name: string): string | undefined
  function deleteCookie(event: any, name: string): void

  // Vue composables (si pas auto-importés)
  function ref<T>(value: T): import('vue').Ref<T>
  function reactive<T extends object>(target: T): import('vue').UnwrapNestedRefs<T>
  function computed<T>(getter: () => T): import('vue').ComputedRef<T>
  function onMounted(hook: () => void): void
  function onUnmounted(hook: () => void): void
  function watch(source: any, callback: any, options?: any): void
  function watchEffect(effect: () => void): void
  function inject<T>(key: string): T | undefined
  function readonly<T>(target: T): import('vue').DeepReadonly<T>
  function toRef<T, K extends keyof T>(object: T, key: K): import('vue').ToRef<T[K]>

  // Process object
  namespace NodeJS {
    interface Process {
      client: boolean
      server: boolean
    }
  }

  // Window extensions
  interface Window {
    ChatSellerConfig?: {
      agentId: string
      primaryColor: string
      position: string
      buttonText: string
    }
  }
}

// =====================================
// MODULE AUGMENTATIONS
// =====================================

declare module 'vue' {
  interface ComponentCustomProperties {
    $route: RouteLocationNormalizedLoaded
    $router: Router
  }
}

// =====================================
// CUSTOM NUXT TYPES
// =====================================

export interface NuxtPageMeta {
  middleware?: string | string[]
  layout?: string
  auth?: boolean
  title?: string
  description?: string
}

export interface NuxtRouteMiddleware {
  (to: RouteLocationNormalizedLoaded, from: RouteLocationNormalizedLoaded): void | Promise<void>
}

// Export to make this a module
export {}