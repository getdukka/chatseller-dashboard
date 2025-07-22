// server/api/auth/login.post.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    
    // Validation des données
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email et mot de passe requis'
      })
    }

    // Simulation de vérification utilisateur (remplacer par votre DB)
    const user = await findUserByEmail(email)
    
    if (!user || !await bcrypt.compare(password, user.hashedPassword)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Identifiants invalides'
      })
    }

    // Génération des tokens
    const config = useRuntimeConfig()
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    )

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      config.jwtSecret,
      { expiresIn: '30d' }
    )

    // Mise à jour de la dernière connexion
    await updateLastLogin(user.id)

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
          lastLoginAt: new Date().toISOString()
        },
        token: accessToken,
        refreshToken
      }
    }
  } catch (error: any) {
    console.error('Erreur login API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur de connexion'
    })
  }
})

// Fonctions utilitaires simulées (remplacer par vos implémentations DB)
async function findUserByEmail(email: string) {
  // Test user pour demo
  if (email === 'admin@chatseller.app') {
    return {
      id: 'user_123',
      email: 'admin@chatseller.app',
      hashedPassword: await bcrypt.hash('password123', 10),
      firstName: 'Administrateur',
      lastName: 'ChatSeller',
      company: 'ChatSeller Demo',
      role: 'admin',
      emailVerified: true,
      createdAt: new Date().toISOString()
    }
  }
  return null
}

async function updateLastLogin(userId: string) {
  // Mise à jour DB
  console.log(`Dernière connexion mise à jour pour ${userId}`)
}















