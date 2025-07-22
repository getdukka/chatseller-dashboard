// ===========================================
// server/api/auth/refresh.post.ts
// ===========================================
import jwt from 'jsonwebtoken'
import { findUserById } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const { refreshToken } = await readBody(event)

    if (!refreshToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Refresh token requis'
      })
    }

    // Vérifier le refresh token
    const config = useRuntimeConfig()
    let decoded: any

    try {
      decoded = jwt.verify(refreshToken, config.jwtSecret)
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Refresh token invalide'
      })
    }

    // Vérifier que c'est bien un refresh token
    if (decoded.type !== 'refresh') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide'
      })
    }

    // Vérifier que l'utilisateur existe toujours
    const user = await findUserById(decoded.userId)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    // Générer un nouveau token d'accès
    const newAccessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    )

    // Optionnel: générer un nouveau refresh token pour une sécurité accrue
    const newRefreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      config.jwtSecret,
      { expiresIn: '30d' }
    )

    // Mettre à jour le cookie
    setCookie(event, 'auth-token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24h
    })

    return {
      success: true,
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken
      }
    }
  } catch (error: any) {
    console.error('Erreur refresh token API:', error)
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'Impossible de rafraîchir le token'
    })
  }
})
