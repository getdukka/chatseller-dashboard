// server/api/auth/change-password.post.ts
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Fonctions utilitaires
async function getCurrentUser(event: any) {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token d\'authentification requis'
    })
  }
  
  const token = authHeader.replace('Bearer ', '')
  const config = useRuntimeConfig()
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any
    
    // Récupérer l'utilisateur depuis Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single()

    if (error || !user) {
      throw new Error('Utilisateur introuvable')
    }

    return user
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide'
    })
  }
}

async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    const { currentPassword, newPassword } = await readBody(event)

    if (!currentPassword || !newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mot de passe actuel et nouveau mot de passe requis'
      })
    }

    if (newPassword.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le nouveau mot de passe doit contenir au moins 8 caractères'
      })
    }

    // Vérifier le mot de passe actuel
    const isValidPassword = await validatePassword(currentPassword, user.hashed_password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Mot de passe actuel incorrect'
      })
    }

    // Hasher le nouveau mot de passe
    const newHashedPassword = await bcrypt.hash(newPassword, 10)

    // Mettre à jour en base avec Supabase corrigé
    const { error } = await supabase
      .from('users')
      .update({ 
        hashed_password: newHashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la mise à jour du mot de passe'
      })
    }

    return {
      success: true,
      message: 'Mot de passe modifié avec succès'
    }
  } catch (error: any) {
    console.error('Erreur change password API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors du changement de mot de passe'
    })
  }
})