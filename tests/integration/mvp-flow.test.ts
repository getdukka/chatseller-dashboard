// tests/integration/mvp-flow.test.ts - TESTS MVP CRITIQUES

/**
 * SUITE DE TESTS MVP - ChatSeller
 * Tests end-to-end pour valider le pipeline complet
 * Dashboard → API → Widget → Conversation
 */

import { test, expect } from '@playwright/test'

// ✅ Configuration de test
const TEST_CONFIG = {
  dashboardUrl: 'https://dashboard.chatseller.app',
  apiUrl: 'https://chatseller-api-production.up.railway.app',
  widgetUrl: 'https://widget.chatseller.app',
  testEmail: 'test@chatseller.app',
  testPassword: 'TestMVP2024!',
  shopId: '12345678-1234-1234-1234-123456789abc'
}

test.describe('MVP Flow - Configuration Agent → Widget', () => {
  
  // ✅ TEST 1: Connexion Dashboard
  test('1. Connexion au Dashboard fonctionne', async ({ page }) => {
    await page.goto(TEST_CONFIG.dashboardUrl)
    
    // Login
    await page.fill('[data-testid=email]', TEST_CONFIG.testEmail)
    await page.fill('[data-testid=password]', TEST_CONFIG.testPassword)
    await page.click('[data-testid=login-btn]')
    
    // Vérifier redirection dashboard
    await expect(page).toHaveURL(/.*\/dashboard/)
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  // ✅ TEST 2: Création Agent
  test('2. Création agent via Dashboard', async ({ page }) => {
    // Login préalable
    await page.goto(`${TEST_CONFIG.dashboardUrl}/auth/login`)
    await page.fill('[data-testid=email]', TEST_CONFIG.testEmail)
    await page.fill('[data-testid=password]', TEST_CONFIG.testPassword)
    await page.click('[data-testid=login-btn]')
    
    // Aller à la page agents
    await page.goto(`${TEST_CONFIG.dashboardUrl}/vendeurs-ia`)
    
    // Créer nouvel agent
    await page.click('[data-testid=create-agent-btn]')
    await page.fill('[data-testid=agent-name]', 'Sophie Test MVP')
    await page.selectOption('[data-testid=agent-type]', 'product_specialist')
    await page.fill('[data-testid=agent-description]', 'Agent de test pour validation MVP')
    await page.fill('[data-testid=welcome-message]', 'Bonjour ! Je suis Sophie, comment puis-je vous aider ?')
    
    // Sauvegarder
    await page.click('[data-testid=save-agent-btn]')
    
    // Vérifier création
    await expect(page.locator('.agent-card')).toContainText('Sophie Test MVP')
  })

  // ✅ TEST 3: Configuration Agent → API
  test('3. Configuration agent persistée en base', async ({ page }) => {
    // Aller à la configuration d'un agent existant
    await page.goto(`${TEST_CONFIG.dashboardUrl}/agent-config?id=test-agent-id`)
    
    // Modifier configuration
    await page.fill('[data-testid=agent-name]', 'Sophie Modifiée')
    await page.fill('[data-testid=primary-color]', '#FF6B35')
    await page.fill('[data-testid=button-text]', 'Parler à Sophie')
    
    // Sauvegarder
    await page.click('[data-testid=save-config-btn]')
    
    // Vérifier sauvegarde
    await expect(page.locator('.success-message')).toBeVisible()
    
    // Recharger page et vérifier persistance
    await page.reload()
    await expect(page.locator('[data-testid=agent-name]')).toHaveValue('Sophie Modifiée')
    await expect(page.locator('[data-testid=primary-color]')).toHaveValue('#FF6B35')
  })

  // ✅ TEST 4: API Configuration Endpoint
  test('4. API retourne configuration correcte', async ({ request }) => {
    // Test endpoint configuration
    const response = await request.get(
      `${TEST_CONFIG.apiUrl}/api/v1/public/shops/${TEST_CONFIG.shopId}/agent`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.agent).toBeDefined()
    expect(data.data.agent.name).toBeTruthy()
    expect(data.data.shop).toBeDefined()
    expect(data.data.shop.widgetConfig).toBeDefined()
  })

  // ✅ TEST 5: Widget Charge Configuration
  test('5. Widget charge configuration depuis API', async ({ page }) => {
    // Créer page de test avec widget
    const testPageHtml = `
      <!DOCTYPE html>
      <html>
      <head><title>Test Widget</title></head>
      <body>
        <div id="product">
          <h1>iPhone 15 Pro Test</h1>
          <div class="price">1199€</div>
          <div id="chatseller-widget"></div>
        </div>
        
        <script>
          window.ChatSellerConfig = {
            shopId: "${TEST_CONFIG.shopId}",
            apiUrl: "${TEST_CONFIG.apiUrl}",
            debug: true
          };
        </script>
        <script src="${TEST_CONFIG.widgetUrl}/widget.js"></script>
      </body>
      </html>
    `
    
    // Injecter et tester
    await page.setContent(testPageHtml)
    
    // Attendre chargement widget
    await page.waitForSelector('#chatseller-widget button', { timeout: 10000 })
    
    // Vérifier widget présent
    const widgetButton = page.locator('#chatseller-widget button')
    await expect(widgetButton).toBeVisible()
    
    // Vérifier texte configuré
    await expect(widgetButton).toContainText('Parler à Sophie')
    
    // Vérifier couleur configurée
    const buttonColor = await widgetButton.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    expect(buttonColor).toContain('255, 107, 53') // #FF6B35 en RGB
  })

  // ✅ TEST 6: Conversation Fonctionnelle
  test('6. Conversation complète Dashboard → Widget', async ({ page }) => {
    // Charger page avec widget configuré
    const testPageHtml = `
      <!DOCTYPE html>
      <html>
      <head><title>Test Conversation</title></head>
      <body>
        <div id="product">
          <h1>iPhone 15 Pro</h1>
          <div id="chatseller-widget"></div>
        </div>
        
        <script>
          window.ChatSellerConfig = {
            shopId: "${TEST_CONFIG.shopId}",
            apiUrl: "${TEST_CONFIG.apiUrl}",
            productName: "iPhone 15 Pro",
            productPrice: 1199,
            debug: true
          };
        </script>
        <script src="${TEST_CONFIG.widgetUrl}/widget.js"></script>
      </body>
      </html>
    `
    
    await page.setContent(testPageHtml)
    
    // Ouvrir chat
    await page.click('#chatseller-widget button')
    
    // Vérifier modal chat
    await expect(page.locator('.cs-chat-modal-overlay')).toBeVisible()
    
    // Vérifier message de bienvenue personnalisé
    await expect(page.locator('.cs-message')).toContainText('Bonjour ! Je suis Sophie')
    
    // Envoyer message
    await page.fill('#chatseller-input', 'Bonjour, je cherche un iPhone')
    await page.click('#chatseller-send-btn')
    
    // Vérifier réponse IA
    await expect(page.locator('.cs-assistant-message').last()).toBeVisible({ timeout: 10000 })
    
    // Vérifier que l'IA répond avec contexte produit
    const lastMessage = page.locator('.cs-assistant-message').last()
    await expect(lastMessage).toContainText('iPhone')
  })

  // ✅ TEST 7: Analytics Tracking
  test('7. Analytics trackent interactions', async ({ page, request }) => {
    // Charger widget avec tracking
    const testPageHtml = `
      <!DOCTYPE html>
      <html>
      <head><title>Test Analytics</title></head>
      <body>
        <div id="chatseller-widget"></div>
        
        <script>
          window.ChatSellerConfig = {
            shopId: "${TEST_CONFIG.shopId}",
            apiUrl: "${TEST_CONFIG.apiUrl}",
            debug: true
          };
        </script>
        <script src="${TEST_CONFIG.widgetUrl}/widget.js"></script>
      </body>
      </html>
    `
    
    await page.setContent(testPageHtml)
    
    // Intercepter appels analytics
    let analyticsCall = null
    page.on('request', request => {
      if (request.url().includes('/analytics/track')) {
        analyticsCall = request
      }
    })
    
    // Déclencher événement
    await page.click('#chatseller-widget button')
    
    // Vérifier appel analytics
    await page.waitForTimeout(2000)
    expect(analyticsCall).toBeTruthy()
  })
})

// ✅ TESTS API CRITIQUES
test.describe('API MVP Health Checks', () => {
  
  test('API Health endpoint accessible', async ({ request }) => {
    const response = await request.get(`${TEST_CONFIG.apiUrl}/health`)
    expect(response.status()).toBe(200)
    
    const health = await response.json()
    expect(health.status).toBe('ok')
    expect(health.services.database).toBe('ok')
    expect(health.services.openai).toBeTruthy()
  })

  test('API Auth endpoints fonctionnels', async ({ request }) => {
    // Test endpoint login
    const loginResponse = await request.post(`${TEST_CONFIG.apiUrl}/api/v1/auth/login`, {
      data: {
        email: TEST_CONFIG.testEmail,
        password: TEST_CONFIG.testPassword
      }
    })
    
    expect(loginResponse.status()).toBe(200)
    const loginData = await loginResponse.json()
    expect(loginData.success).toBe(true)
    expect(loginData.user).toBeDefined()
  })

  test('API Chat endpoint avec IA', async ({ request }) => {
    // Test conversation avec IA
    const chatResponse = await request.post(`${TEST_CONFIG.apiUrl}/api/v1/public/chat`, {
      data: {
        shopId: TEST_CONFIG.shopId,
        message: 'Test message MVP',
        productInfo: {
          name: 'iPhone 15 Pro Test',
          price: 1199
        }
      }
    })
    
    expect(chatResponse.status()).toBe(200)
    const chatData = await chatResponse.json()
    expect(chatData.success).toBe(true)
    expect(chatData.data.message).toBeTruthy()
    expect(chatData.data.conversationId).toBeTruthy()
  })
})

// ✅ HELPER: Setup données de test
test.beforeEach(async ({ page }) => {
  // Configuration navigateur pour tests
  await page.setViewportSize({ width: 1200, height: 800 })
  
  // Mock console pour debug
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Browser Error:', msg.text())
    }
  })
})

// ✅ CLEANUP après tests
test.afterEach(async ({ page }) => {
  // Cleanup éventuel
  await page.close()
})