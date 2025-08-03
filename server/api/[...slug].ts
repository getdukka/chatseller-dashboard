// server/api/[...slug].ts
export default defineEventHandler(async (event) => {
  const url = getRouterParam(event, 'slug') || ''
  const method = getMethod(event)
  const body = method !== 'GET' ? await readBody(event) : undefined
  const query = getQuery(event)
  
  // ✅ NOUVEAU: Exclure les endpoints auth locaux
  if (url.startsWith('auth/') || url.startsWith('v1/auth/')) {
    // Ne pas proxy les requêtes auth - laisser Nuxt les gérer localement
    throw createError({
      statusCode: 404,
      statusMessage: `Route ${method}:/${url} not found - should be handled locally`
    })
  }
  
  // URL de base de l'API Railway
  const apiBaseUrl = 'https://chatseller-api-production.up.railway.app'
  
  // Construire l'URL complète
  let targetUrl = `${apiBaseUrl}/${url}`
  
  // Ajouter les paramètres de query si nécessaire
  if (Object.keys(query).length > 0) {
    const queryString = new URLSearchParams(query as Record<string, string>).toString()
    targetUrl += `?${queryString}`
  }
  
  console.log(`🔄 Proxy: ${method} ${targetUrl}`)
  
  try {
    // Headers de la requête originale
    const headers: Record<string, string> = {}
    
    // Copier les headers importants
    const authHeader = getHeader(event, 'authorization')
    if (authHeader) {
      headers.authorization = authHeader
    }
    
    headers['content-type'] = 'application/json'
    
    // Faire la requête vers l'API Railway
    const response = await $fetch(targetUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    
    console.log(`✅ Proxy success: ${method} ${targetUrl}`)
    return response
    
  } catch (error: any) {
    console.error(`❌ Proxy error: ${method} ${targetUrl}`, error)
    
    // Retourner l'erreur en format standardisé
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Erreur du proxy API'
    })
  }
})