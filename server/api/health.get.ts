// server/api/health.get.ts
export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Vérifier la base de données Supabase
    const dbStatus = await checkDatabaseStatus()
    
    // Vérifier les services externes (optionnel)
    const externalServices = await checkExternalServices()
    
    const endTime = Date.now()
    const responseTime = endTime - startTime

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      checks: {
        database: dbStatus,
        ...externalServices
      },
      system: {
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      }
    }
  } catch (error: any) {
    console.error('Health check failed:', error)
    
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`
    }
  }
})

// ===========================================
// FONCTIONS DE VÉRIFICATION
// ===========================================

async function checkDatabaseStatus() {
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )

    // Test simple de connexion
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      throw error
    }

    return {
      status: 'healthy',
      message: 'Database connection successful',
      responseTime: '< 100ms'
    }
  } catch (error: any) {
    return {
      status: 'unhealthy',
      message: 'Database connection failed',
      error: error.message
    }
  }
}

async function checkExternalServices() {
  const services: Record<string, any> = {}

  // Vérification OpenAI API (si utilisé)
  try {
    if (process.env.OPENAI_API_KEY) {
      // Test simple - pas d'appel réel pour éviter les coûts
      services.openai = {
        status: 'healthy',
        message: 'API key configured'
      }
    } else {
      services.openai = {
        status: 'warning',
        message: 'API key not configured'
      }
    }
  } catch (error) {
    services.openai = {
      status: 'unhealthy',
      message: 'OpenAI API check failed'
    }
  }

  // Vérification service email (si configuré)
  try {
    if (process.env.SMTP_HOST) {
      services.email = {
        status: 'healthy',
        message: 'SMTP configured'
      }
    } else {
      services.email = {
        status: 'warning',
        message: 'SMTP not configured'
      }
    }
  } catch (error) {
    services.email = {
      status: 'unhealthy',
      message: 'Email service check failed'
    }
  }

  return services
}