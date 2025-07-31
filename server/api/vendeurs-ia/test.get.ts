// server/api/vendeurs-ia/test.get.ts - ENDPOINT DE TEST POUR DEBUG
export default defineEventHandler(async (event) => {
  console.log('🧪 [TEST] Endpoint de test appelé')
  
  const config = useRuntimeConfig()
  
  return {
    success: true,
    message: 'Endpoint API fonctionnel !',
    timestamp: new Date().toISOString(),
    config: {
      supabaseUrl: config.public.supabaseUrl ? '✅ Configuré' : '❌ Manquant',
      supabaseAnonKey: config.public.supabaseAnonKey ? '✅ Configuré' : '❌ Manquant',
    },
    routes: {
      testRoute: '/api/vendeurs-ia/test',
      agentRoute: '/api/vendeurs-ia/[id]',
      listRoute: '/api/vendeurs-ia/'
    }
  }
})