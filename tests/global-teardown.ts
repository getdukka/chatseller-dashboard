// tests/global-teardown.ts
async function globalTeardown() {
  console.log('🧹 Nettoyage global après tests Playwright')
  
  // Cleanup si nécessaire
  // Par exemple : fermer connexions DB, nettoyer fichiers temporaires, etc.
  
  console.log('✅ Nettoyage terminé')
}

export default globalTeardown