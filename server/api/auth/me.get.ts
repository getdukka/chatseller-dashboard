// server/api/auth/me.get.ts
import { getCurrentUser } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          company: user.company,
          role: user.role,
          emailVerified: user.email_verified,
          createdAt: user.created_at,
          lastLoginAt: user.last_login_at
        }
      }
    }
  } catch (error: any) {
    console.error('Erreur me API:', error)
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'Token invalide'
    })
  }
})