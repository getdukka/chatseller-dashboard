// tests/types.d.ts - DÉCLARATIONS TYPESCRIPT POUR TESTS CHATSELLER

/**
 * Extensions TypeScript pour les tests E2E ChatSeller
 * Définit les types manquants pour Window, Performance, etc.
 */

// ✅ EXTENSIONS WINDOW POUR CHATSELLER
declare global {
  interface Window {
    // ChatSeller Widget
    ChatSeller?: {
      version?: string
      init?: (config: any) => Promise<void>
      destroy?: () => void
      show?: () => void
      hide?: () => void
      track?: (event: string, data?: any) => void
      sendMessage?: (message: string) => Promise<any>
      openChat?: () => void
      closeChat?: () => void
      getDebugInfo?: () => any
      isReady?: boolean
      currentConfig?: any
    }
    
    // ChatSeller Configuration
    ChatSellerConfig?: {
      shopId: string
      apiUrl?: string
      widgetUrl?: string
      productName?: string
      productPrice?: number
      productDescription?: string
      agentName?: string
      welcomeMessage?: string
      buttonText?: string
      primaryColor?: string
      position?: string
      theme?: string
      debug?: boolean
      [key: string]: any
    }
    
    // Test Functions
    testChatFunction?: () => boolean
    testChatSeller?: {
      load?: () => void
      debug?: () => void
      api?: () => void
      agent?: () => void
      product?: () => void
      track?: () => void
      open?: () => void
      reload?: () => void
    }
    
    // Shopify Test Functions
    shopifyTests?: {
      checkProductDetection: () => boolean
      testCartIntegration: () => boolean
      simulateAddToCart: () => boolean
    }
    
    // Performance Extensions
    performance?: Performance & {
      getEntriesByType(type: 'navigation'): PerformanceNavigationTiming[]
      getEntriesByType(type: 'resource'): PerformanceResourceTiming[]
      getEntriesByType(type: string): PerformanceEntry[]
    }
    
    // Analytics
    gtag?: (...args: any[]) => void
  }
  
  // ✅ EXTENSIONS PERFORMANCE API
  interface PerformanceNavigationTiming extends PerformanceEntry {
    domContentLoadedEventStart: number
    domContentLoadedEventEnd: number
    loadEventStart: number
    loadEventEnd: number
    navigationStart: number
    responseEnd: number
    requestStart: number
    connectStart: number
    connectEnd: number
    domainLookupStart: number
    domainLookupEnd: number
    fetchStart: number
    redirectStart: number
    redirectEnd: number
    secureConnectionStart: number
    type: string
    redirectCount: number
  }
  
  interface PerformanceResourceTiming extends PerformanceEntry {
    initiatorType: string
    transferSize: number
    encodedBodySize: number
    decodedBodySize: number
    responseStart: number
    responseEnd: number
    requestStart: number
    connectStart: number
    connectEnd: number
    domainLookupStart: number
    domainLookupEnd: number
    fetchStart: number
    redirectStart: number
    redirectEnd: number
    secureConnectionStart: number
  }
  
  // ✅ EXTENSIONS CONSOLE POUR TESTS
  interface Console {
    debug(...args: any[]): void
    trace(...args: any[]): void
  }
  
  // ✅ EXTENSIONS FETCH POUR TESTS
  interface RequestInit {
    timeout?: number
  }
}

// ✅ TYPES SPÉCIFIQUES CHATSELLER
export interface ChatSellerTestConfig {
  shopId: string
  apiUrl: string
  widgetUrl: string
  agentConfig: {
    name: string
    type: string
    description: string
    welcomeMessage: string
  }
  testProduct: {
    name: string
    price: number
    description: string
  }
}

export interface TestResult {
  suite: string
  description: string
  success: boolean
  duration: number
  error?: string
  stdout?: string
  stderr?: string
  timestamp: string
}

export interface ServiceHealthResult {
  status: 'healthy' | 'unhealthy' | 'error'
  statusCode?: number
  responseTime?: string
  error?: string
}

export interface MVPTestReport {
  timestamp: string
  mvpVersion: string
  environment: string
  servicesHealth: Record<string, ServiceHealthResult>
  testSuites: TestResult[]
  summary: {
    totalSuites: number
    successfulSuites: number
    failedSuites: number
    totalDuration: number
    overallSuccess: boolean
  }
  recommendations: Array<{
    type: 'critical' | 'warning' | 'info'
    message: string
  }>
}

// ✅ PLAYWRIGHT EXTENSIONS
declare module '@playwright/test' {
  interface TestInfo {
    attach(name: string, options: { body: string | Buffer; contentType: string }): Promise<void>
  }
  
  interface Page {
    setContent(html: string, options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void>
    evaluate<T>(pageFunction: () => T | Promise<T>): Promise<T>
    evaluate<T, A>(pageFunction: (arg: A) => T | Promise<T>, arg: A): Promise<T>
    waitForTimeout(timeout: number): Promise<void>
    waitForURL(url: string | RegExp | ((_url: URL) => boolean), options?: { timeout?: number }): Promise<void>
  }
}

export {}