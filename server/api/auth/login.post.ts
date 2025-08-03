// server/api/auth/login.post.ts
import jwt from 'jsonwebtoken'
import { findUserByEmail, validatePassword } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const { email, password, rememberMe } = await readBody(event)

    // Validation des données
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email et mot de passe requis'
      })
    }

    // Rechercher l'utilisateur
    const user = await findUserByEmail(email)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }

    // Vérifier le mot de passe
    const isValidPassword = await validatePassword(password, user.hashed_password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }

    // Générer les tokens
    const config = useRuntimeConfig()
    const tokenExpiry = rememberMe ? '30d' : '24h'
    
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      config.jwtSecret,
      { expiresIn: tokenExpiry }
    )

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      config.jwtSecret,
      { expiresIn: '30d' }
    )

    // Mettre à jour la date de dernière connexion
    const supabase = getSupabaseClient()
    await supabase
      .from('users')
      .update({ 
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    // Définir le cookie d'authentification
    setCookie(event, 'auth-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 jours ou 24h
    })

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
      statusMessage: error.statusMessage || 'Erreur lors de la connexion'
    })
  }
})

// Fonction helper pour Supabase
function getSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}