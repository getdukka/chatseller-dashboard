// tests/global-setup.ts
async function globalSetup() {
  console.log('🎭 Setup global des tests Playwright')
  
  // Vérifier que l'API est accessible
  try {
    const response = await fetch('https://chatseller-api-production.up.railway.app/health')
    const health = await response.json()
    
    if (health.status !== 'ok') {
      throw new Error('API not healthy')
    }
    
    console.log('✅ API accessible et fonctionnelle')
  } catch (error) {
    console.error('❌ API inaccessible:', error)
    throw new Error('API must be accessible for tests to run')
  }
  
  // Vérifier que le Dashboard est accessible
  try {
    const response = await fetch('https://dashboard.chatseller.app')
    if (!response.ok) {
      throw new Error('Dashboard not accessible')
    }
    console.log('✅ Dashboard accessible')
  } catch (error) {
    console.error('❌ Dashboard inaccessible:', error)
    throw new Error('Dashboard must be accessible for tests to run')
  }
  
  // Vérifier que le Widget est accessible
  try {
    const response = await fetch('https://widget.chatseller.app')
    if (!response.ok) {
      throw new Error('Widget not accessible')
    }
    console.log('✅ Widget accessible')
  } catch (error) {
    console.error('❌ Widget inaccessible:', error)
    throw new Error('Widget must be accessible for tests to run')
  }
}

export default globalSetup