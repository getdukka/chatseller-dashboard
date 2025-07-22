// server/api/auth/me.get.ts
export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token') || 
                  getHeader(event, 'authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token manquant'
      })
    }

    // Vérifier le token
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as any

    // Récupérer les données utilisateur
    const user = await findUserById(decoded.userId)
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          role: user.role,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      }
    }
  } catch (error: any) {
    console.error('Erreur me API:', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide'
    })
  }
})

async function findUserById(userId: string) {
  // Recherche utilisateur par ID
  if (userId === 'user_123') {
    return {
      id: 'user_123',
      email: 'admin@chatseller.app',
      firstName: 'Administrateur',
      lastName: 'ChatSeller',
      company: 'ChatSeller Demo',
      role: 'admin',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }
  }
  return null
}