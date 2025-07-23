// server/api/auth/change-password.post.ts 
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Fonctions utilitaires mockées (à implémenter selon votre base de données)
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
    // TODO: Récupérer l'utilisateur depuis votre base de données
    return {
      id: decoded.userId,
      email: decoded.email,
      hashed_password: 'fake_hashed_password' // À remplacer par la vraie requête DB
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide'
    })
  }
}

async function validatePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

function getSupabaseClient() {
  // TODO: Retourner votre client Supabase configuré
  return {
    from: (table: string) => ({
      update: (data: any) => ({
        eq: (field: string, value: any) => ({
          then: () => Promise.resolve({ error: null })
        })
      })
    })
  }
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

    // Mettre à jour en base
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('users')
      .update({ 
        hashed_password: newHashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
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