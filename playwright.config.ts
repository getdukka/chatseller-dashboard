// playwright.config.ts - CONFIGURATION OPTIMISÉE POUR TESTS MVP CHATSELLER
import { defineConfig, devices } from '@playwright/test'

/**
 * Configuration Playwright pour tests MVP ChatSeller
 * Tests End-to-End complets: Dashboard → API → Widget → Conversation
 */
export default defineConfig({
  // ✅ CONFIGURATION GLOBALE
  testDir: './tests',
  testMatch: [
    '**/mvp-complete.test.ts',
    '**/integration/*.test.ts',
    '**/e2e/*.test.ts'
  ],
  
  // ✅ CONFIGURATION D'EXÉCUTION
  fullyParallel: false, // Tests séquentiels pour MVP (éviter conflits)
  forbidOnly: !!process.env.CI, // Interdire .only en CI
  retries: process.env.CI ? 2 : 1, // Retry en cas d'échec
  workers: process.env.CI ? 1 : 2, // Workers limités pour MVP
  
  // ✅ TIMEOUTS ADAPTÉS AUX SERVICES EXTERNES
  timeout: 60000, // 60s par test (services externes)
  expect: {
    timeout: 15000 // 15s pour les assertions
  },
  
  // ✅ CONFIGURATION REPORTER
  reporter: process.env.CI ? [
    ['html', { 
      outputFolder: 'test-reports/html',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'test-reports/results.json' 
    }],
    ['junit', { 
      outputFile: 'test-reports/junit.xml' 
    }],
    ['list'],
    ['github']
  ] : [
    ['html', { 
      outputFolder: 'test-reports/html',
      open: 'on-failure'
    }],
    ['json', { 
      outputFile: 'test-reports/results.json' 
    }],
    ['list']
  ],
  
  // ✅ GLOBAL SETUP/TEARDOWN
  globalSetup: require.resolve('./tests/global-setup'),
  globalTeardown: require.resolve('./tests/global-teardown'),
  
  // ✅ CONFIGURATION DES NAVIGATEURS
  use: {
    // Base URL pour tests relatifs
    baseURL: 'https://dashboard.chatseller.app',
    
    // Tracing en cas d'échec
    trace: 'retain-on-failure',
    
    // Screenshots
    screenshot: 'only-on-failure',
    
    // Vidéos
    video: 'retain-on-failure',
    
    // User Agent réaliste
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ChatSellerBot/1.0',
    
    // Configuration réseau
    ignoreHTTPSErrors: true, // Pour certificats auto-signés
    bypassCSP: false, // Respecter CSP
    
    // Localisation française
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    
    // Permissions
    permissions: ['clipboard-read', 'clipboard-write'],
    
    // Géolocalisation
    geolocation: { latitude: 48.8566, longitude: 2.3522 }, // Paris
    
    // Configuration mobile-friendly
    hasTouch: false,
    isMobile: false,
    
    // Attendre le réseau
    waitForLoadState: 'networkidle',
    
    // Headers personnalisés
    extraHTTPHeaders: {
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      'X-Test-Environment': 'playwright-mvp'
    }
  },

  // ✅ PROJETS DE TEST (NAVIGATEURS ET ENVIRONNEMENTS)
  projects: [
    // Tests Desktop
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    {
      name: 'safari-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    // Tests Mobile (critiques pour e-commerce)
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5']
      },
    },
    
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13']
      },
    },
    
    // Tests Tablette
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 }
      },
    },
    
    // ✅ PROJET SPÉCIAL POUR TESTS API UNIQUEMENT
    {
      name: 'api-only',
      testMatch: '**/api/*.test.ts',
      use: {
        baseURL: 'https://chatseller-api-production.up.railway.app'
      }
    },
    
    // ✅ PROJET SPÉCIAL POUR TESTS WIDGET UNIQUEMENT
    {
      name: 'widget-only',
      testMatch: '**/widget/*.test.ts',
      use: {
        baseURL: 'https://widget.chatseller.app'
      }
    },
    
    // ✅ PROJET COMPLET MVP (PRIORITAIRE)
    {
      name: 'mvp-complete',
      testMatch: '**/mvp-complete.test.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 }
      }
    }
  ],

  // ✅ SERVEUR WEB LOCAL POUR TESTS
  webServer: process.env.CI ? undefined : [
    // Serveur pour widget en développement (si nécessaire)
    {
      command: 'npm run dev',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
      env: {
        NODE_ENV: 'test'
      }
    }
  ],

  // ✅ CONFIGURATION AVANCÉE
  metadata: {
    project: 'ChatSeller MVP',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'test',
    timestamp: new Date().toISOString()
  },

  // ✅ GESTION DES ERREURS ET LOGS
  quiet: false,
  
  // Configuration pour CI/CD
  ...(process.env.CI && {
    forbidOnly: true,
    retries: 3,
    workers: 1,
    use: {
      // En CI, plus conservateur
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure'
    }
  })
})