// server/api/auth/verify.post.ts
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token } = body
    
    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token manquant'
      })
    }
    
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret)
    
    return {
      success: true,
      data: {
        valid: true,
        user: decoded
      }
    }
    
  } catch (error) {
    console.error('❌ Token invalide:', error.message)
    
    return {
      success: false,
      data: {
        valid: false,
        error: 'Token invalide ou expiré'
      }
    }
  }
})