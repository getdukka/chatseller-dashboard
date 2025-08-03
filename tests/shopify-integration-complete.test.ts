// tests/shopify-integration-complete.test.ts - TEST FINAL PRODUCTION

/**
 * TEST FINAL MVP - SHOPIFY PRODUCTION
 * Validation complète du pipeline sur vraie boutique
 * E-commerçant → Configuration → Intégration → Première Vente
 */

import { test, expect } from '@playwright/test'

// ✅ CONFIGURATION TEST PRODUCTION
const PRODUCTION_CONFIG = {
  // URLs Production
  dashboardUrl: 'https://dashboard.chatseller.app',
  apiUrl: 'https://chatseller-api-production.up.railway.app',
  widgetUrl: 'https://widget.chatseller.app',
  
  // Boutique Shopify de test (à créer)
  shopifyStore: 'chatseller-test.myshopify.com',
  shopifyAdminUrl: 'https://chatseller-test.myshopify.com/admin',
  
  // Compte test e-commerçant
  merchantEmail: 'merchant@chatseller.app',
  merchantPassword: 'TestProd2024!',
  
  // Produit test
  testProduct: {
    name: 'iPhone 15 Pro - Test ChatSeller',
    price: 1199,
    url: '/products/iphone-15-pro-test'
  }
}

test.describe('🚀 TEST FINAL MVP - PIPELINE COMPLET', () => {

  // ✅ TEST E2E 1: ONBOARDING COMPLET E-COMMERÇANT
  test('1. ONBOARDING : Inscription → Création Agent → Configuration', async ({ page }) => {
    console.log('🎯 Test 1: Onboarding e-commerçant complet')
    
    // 1.1 - Landing & Inscription
    await page.goto('https://chatseller.app')
    await page.click('text=Essayer gratuitement')
    
    await page.fill('[data-testid="signup-name"]', 'Test Merchant')
    await page.fill('[data-testid="signup-email"]', PRODUCTION_CONFIG.merchantEmail)
    await page.fill('[data-testid="signup-password"]', PRODUCTION_CONFIG.merchantPassword)
    await page.fill('[data-testid="signup-company"]', 'Test Boutique Shopify')
    await page.selectOption('[data-testid="signup-platform"]', 'shopify')
    await page.click('[data-testid="signup-submit"]')
    
    // Vérifier redirection dashboard
    await expect(page).toHaveURL(/.*dashboard\.chatseller\.app/)
    
    // 1.2 - Création Premier Agent IA
    await page.click('[data-testid="create-first-agent"]')
    
    // Wizard de création
    await page.fill('[data-testid="agent-name"]', 'Sophie')
    await page.selectOption('[data-testid="agent-type"]', 'product_specialist')
    await page.fill('[data-testid="agent-description"]', 'Spécialiste produits tech, aide les clients à choisir selon leurs besoins')
    await page.fill('[data-testid="welcome-message"]', 'Bonjour ! Je suis Sophie, spécialiste produits. Comment puis-je vous aider à trouver le produit parfait ?')
    
    await page.click('[data-testid="create-agent-submit"]')
    
    // Vérifier agent créé
    await expect(page.locator('.agent-card')).toContainText('Sophie')
    
    console.log('✅ Test 1 Réussi: Agent Sophie créé')
  })

  // ✅ TEST E2E 2: CONFIGURATION AVANCÉE
  test('2. CONFIGURATION : Widget + Playground + Test IA', async ({ page }) => {
    console.log('🎯 Test 2: Configuration avancée agent')
    
    // Login e-commerçant
    await page.goto(`${PRODUCTION_CONFIG.dashboardUrl}/auth/login`)
    await page.fill('[data-testid="login-email"]', PRODUCTION_CONFIG.merchantEmail)
    await page.fill('[data-testid="login-password"]', PRODUCTION_CONFIG.merchantPassword)
    await page.click('[data-testid="login-submit"]')
    
    // Aller à la configuration de Sophie
    await page.goto(`${PRODUCTION_CONFIG.dashboardUrl}/vendeurs-ia`)
    await page.click('.agent-card:has-text("Sophie") [data-testid="configure-agent"]')
    
    // 2.1 - Configuration Widget
    await page.click('text=Widget')
    
    await page.fill('[data-testid="widget-button-text"]', 'Parler à Sophie')
    await page.fill('[data-testid="widget-primary-color"]', '#E91E63')
    await page.click('[data-testid="widget-position-above-cta"]')
    
    // Vérifier preview
    await expect(page.locator('.widget-preview button')).toContainText('Parler à Sophie')
    
    // 2.2 - Test Playground
    await page.click('text=Test')
    
    // Test conversation
    await page.fill('[data-testid="playground-input"]', 'Bonjour Sophie')
    await page.click('[data-testid="playground-send"]')
    
    // Vérifier réponse IA
    await expect(page.locator('.chat-message:last-child')).toContainText('Sophie')
    
    // 2.3 - Sauvegarder configuration
    await page.click('[data-testid="save-all-config"]')
    await expect(page.locator('.success-message')).toBeVisible()
    
    console.log('✅ Test 2 Réussi: Configuration complète')
  })

  // ✅ TEST E2E 3: INTÉGRATION SHOPIFY RÉELLE
  test('3. INTÉGRATION : Code Widget → Boutique Shopify', async ({ page, context }) => {
    console.log('🎯 Test 3: Intégration Shopify production')
    
    // 3.1 - Récupération code d'intégration
    await page.goto(`${PRODUCTION_CONFIG.dashboardUrl}/auth/login`)
    await page.fill('[data-testid="login-email"]', PRODUCTION_CONFIG.merchantEmail)
    await page.fill('[data-testid="login-password"]', PRODUCTION_CONFIG.merchantPassword)
    await page.click('[data-testid="login-submit"]')
    
    await page.goto(`${PRODUCTION_CONFIG.dashboardUrl}/agent-config?id=sophie`)
    await page.click('text=Intégration')
    
    // Copier code d'intégration
    const integrationCode = await page.locator('[data-testid="integration-code"]').textContent()
    expect(integrationCode).toContain('widget.chatseller.app')
    expect(integrationCode).toContain('ChatSellerConfig')
    
    // 3.2 - Simulation intégration Shopify (page de test)
    const shopifyTestPage = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Boutique Shopify - iPhone 15 Pro</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .product { max-width: 800px; margin: 0 auto; }
          .product-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .product-price { font-size: 20px; color: #333; margin-bottom: 20px; }
          .product-description { margin-bottom: 30px; }
          .buy-button { 
            background: #007bff; color: white; padding: 12px 24px; 
            border: none; border-radius: 5px; font-size: 16px; cursor: pointer;
            margin-right: 10px;
          }
        </style>
      </head>
      <body>
        <div class="product">
          <h1 class="product-title">${PRODUCTION_CONFIG.testProduct.name}</h1>
          <div class="product-price">${PRODUCTION_CONFIG.testProduct.price}€</div>
          <div class="product-description">
            Le iPhone 15 Pro offre des performances exceptionnelles avec la puce A17 Pro,
            un système photo professionnel et des capacités vidéo 4K ProRes.
          </div>
          
          <button class="buy-button">Ajouter au panier</button>
          
          <!-- Zone où apparaîtra le widget ChatSeller -->
          <div id="chatseller-widget-zone"></div>
        </div>
        
        <!-- INTÉGRATION CHATSELLER -->
        <script>
          window.ChatSellerConfig = {
            shopId: "test-shop-id",
            apiUrl: "${PRODUCTION_CONFIG.apiUrl}",
            productName: "${PRODUCTION_CONFIG.testProduct.name}",
            productPrice: ${PRODUCTION_CONFIG.testProduct.price},
            productUrl: "${PRODUCTION_CONFIG.testProduct.url}",
            debug: true
          };
        </script>
        <script src="${PRODUCTION_CONFIG.widgetUrl}/widget.js"></script>
      </body>
      </html>
    `
    
    await page.setContent(shopifyTestPage)
    
    // 3.3 - Vérifier chargement widget
    await page.waitForSelector('[id*="chatseller"]', { timeout: 15000 })
    
    const widgetButton = page.locator('button:has-text("Parler à Sophie")')
    await expect(widgetButton).toBeVisible()
    
    // Vérifier style configuré
    const buttonStyle = await widgetButton.evaluate(el => window.getComputedStyle(el))
    expect(buttonStyle.backgroundColor).toContain('233, 30, 99') // #E91E63 en RGB
    
    console.log('✅ Test 3 Réussi: Widget intégré sur Shopify')
  })

  // ✅ TEST E2E 4: PREMIÈRE CONVERSATION CLIENT
  test('4. CONVERSATION : Visiteur → Qualification → Conversion', async ({ page }) => {
    console.log('🎯 Test 4: Première conversation complète')
    
    // 4.1 - Visiteur arrive sur page produit avec widget
    const shopifyPageWithWidget = `
      <!DOCTYPE html>
      <html>
      <head><title>Boutique Test - iPhone 15 Pro</title></head>
      <body>
        <div id="product">
          <h1>iPhone 15 Pro - Test ChatSeller</h1>
          <div class="price">1199€</div>
          <p>Smartphone haut de gamme avec puce A17 Pro</p>
          <button class="buy-btn">Ajouter au panier</button>
        </div>
        
        <script>
          window.ChatSellerConfig = {
            shopId: "test-shop-production",
            apiUrl: "${PRODUCTION_CONFIG.apiUrl}",
            productName: "iPhone 15 Pro",
            productPrice: 1199,
            debug: true
          };
        </script>
        <script src="${PRODUCTION_CONFIG.widgetUrl}/widget.js"></script>
      </body>
      </html>
    `
    
    await page.setContent(shopifyPageWithWidget)
    await page.waitForSelector('button:has-text("Parler à Sophie")', { timeout: 10000 })
    
    // 4.2 - Ouverture conversation
    await page.click('button:has-text("Parler à Sophie")')
    
    // Vérifier ouverture modal
    await expect(page.locator('.cs-chat-modal')).toBeVisible()
    
    // Vérifier message d'accueil personnalisé
    await expect(page.locator('.cs-message:first-child')).toContainText('Sophie')
    await expect(page.locator('.cs-message:first-child')).toContainText('spécialiste produits')
    
    // 4.3 - Conversation qualification
    await page.fill('.cs-chat-input', 'Je cherche un téléphone pour faire des vidéos professionnelles')
    await page.click('.cs-send-button')
    
    // Attendre réponse IA
    await page.waitForSelector('.cs-assistant-message:nth-child(3)', { timeout: 8000 })
    
    const aiResponse = await page.locator('.cs-assistant-message:last-child').textContent()
    expect(aiResponse).toContain('iPhone 15 Pro') // Recommandation produit
    expect(aiResponse).toContain('4K') // Argument technique
    
    // 4.4 - Gestion objection prix
    await page.fill('.cs-chat-input', 'C\'est un peu cher pour moi...')
    await page.click('.cs-send-button')
    
    await page.waitForSelector('.cs-assistant-message:nth-child(5)', { timeout: 8000 })
    
    const objectionResponse = await page.locator('.cs-assistant-message:last-child').textContent()
    expect(objectionResponse).toMatch(/(qualité|professionnel|investissement|durabilité)/i) // Arguments valeur
    
    // 4.5 - Collecte informations client
    await page.fill('.cs-chat-input', 'OK, je suis intéressé')
    await page.click('.cs-send-button')
    
    await page.waitForSelector('.cs-assistant-message:nth-child(7)', { timeout: 8000 })
    
    const collectResponse = await page.locator('.cs-assistant-message:last-child').textContent()
    expect(collectResponse).toMatch(/(nom|email|téléphone|coordonnées)/i) // Demande infos
    
    console.log('✅ Test 4 Réussi: Conversation complète avec qualification')
  })

  // ✅ TEST E2E 5: ANALYTICS & ROI
  test('5. ANALYTICS : Métriques Business & ROI', async ({ page, request }) => {
    console.log('🎯 Test 5: Analytics et métriques business')
    
    // 5.1 - Vérifier tracking conversation
    const analyticsResponse = await request.get(
      `${PRODUCTION_CONFIG.apiUrl}/api/v1/analytics/conversations?shopId=test-shop-production`
    )
    
    expect(analyticsResponse.status()).toBe(200)
    
    const analyticsData = await analyticsResponse.json()
    expect(analyticsData.success).toBe(true)
    expect(analyticsData.data.totalConversations).toBeGreaterThan(0)
    
    // 5.2 - Dashboard Analytics
    await page.goto(`${PRODUCTION_CONFIG.dashboardUrl}/auth/login`)
    await page.fill('[data-testid="login-email"]', PRODUCTION_CONFIG.merchantEmail)
    await page.fill('[data-testid="login-password"]', PRODUCTION_CONFIG.merchantPassword)
    await page.click('[data-testid="login-submit"]')
    
    await page.goto(`${PRODUCTION_CONFIG.dashboardUrl}/analytics`)
    
    // Vérifier métriques affichées
    await expect(page.locator('[data-testid="conversations-count"]')).toContainText(/\d+/)
    await expect(page.locator('[data-testid="conversion-rate"]')).toContainText(/%/)
    await expect(page.locator('[data-testid="average-cart"]')).toContainText(/€/)
    
    // 5.3 - Test API métriques
    const metricsResponse = await request.get(
      `${PRODUCTION_CONFIG.apiUrl}/api/v1/analytics/metrics?shopId=test-shop-production&period=7d`
    )
    
    const metricsData = await metricsResponse.json()
    expect(metricsData.data).toHaveProperty('conversationRate')
    expect(metricsData.data).toHaveProperty('averageCartValue')
    expect(metricsData.data).toHaveProperty('totalRevenue')
    
    console.log('✅ Test 5 Réussi: Analytics et ROI trackés')
  })
})

// ✅ TESTS PERFORMANCE & SCALABILITÉ
test.describe('⚡ TESTS PERFORMANCE MVP', () => {
  
  test('Widget charge en moins de 3 secondes', async ({ page }) => {
    const startTime = Date.now()
    
    await page.setContent(`
      <html><body>
        <script>
          window.ChatSellerConfig = {
            shopId: "perf-test",
            apiUrl: "${PRODUCTION_CONFIG.apiUrl}"
          };
        </script>
        <script src="${PRODUCTION_CONFIG.widgetUrl}/widget.js"></script>
      </body></html>
    `)
    
    await page.waitForSelector('[id*="chatseller"]')
    
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000) // < 3 secondes
    
    console.log(`✅ Widget chargé en ${loadTime}ms`)
  })
  
  test('API répond en moins de 500ms', async ({ request }) => {
    const startTime = Date.now()
    
    const response = await request.get(`${PRODUCTION_CONFIG.apiUrl}/health`)
    
    const responseTime = Date.now() - startTime
    expect(response.status()).toBe(200)
    expect(responseTime).toBeLessThan(500) // < 500ms
    
    console.log(`✅ API répond en ${responseTime}ms`)
  })
})

// ✅ CONFIGURATION SETUP
test.beforeEach(async ({ page }) => {
  // Configuration optimale pour tests
  await page.setViewportSize({ width: 1200, height: 800 })
  
  // Log des erreurs pour debug
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`❌ Browser Error: ${msg.text()}`)
    }
  })
  
  // Log des requêtes réseau échouées
  page.on('requestfailed', request => {
    console.error(`❌ Request Failed: ${request.url()} - ${request.failure()?.errorText}`)
  })
})

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // Capturer screenshot en cas d'échec
    const screenshot = await page.screenshot()
    await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' })
  }
})