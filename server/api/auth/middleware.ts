import jwt from 'jsonwebtoken'

export const requireAuth = (handler: any) => {
  return defineEventHandler(async (event) => {
    try {
      const authHeader = getHeader(event, 'authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Token d\'authentification manquant'
        })
      }
      
      const token = authHeader.substring(7)
      const config = useRuntimeConfig()
      const decoded = jwt.verify(token, config.jwtSecret)
      
      // Ajouter les infos utilisateur au contexte
      event.context.user = decoded
      
      return await handler(event)
      
    } catch (error) {
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide'
      })
    }
  })
}
