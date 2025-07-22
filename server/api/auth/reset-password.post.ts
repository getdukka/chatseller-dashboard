// ===========================================
// server/api/auth/reset-password.post.ts
// ===========================================
import { findUserByEmail } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Adresse email requise'
      })
    }

    // Vérifier si l'utilisateur existe
    const user = await findUserByEmail(email)
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      // On retourne toujours un succès
      return {
        success: true,
        message: 'Si cette adresse email existe, un lien de réinitialisation a été envoyé'
      }
    }

    // Générer un token de réinitialisation
    const config = useRuntimeConfig()
    const resetToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'reset-password'
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    )

    // Sauvegarder le token en base (optionnel - peut être dans une table séparée)
    // await savePasswordResetToken(user.id, resetToken)

    // Envoyer l'email de réinitialisation
    try {
      await sendPasswordResetEmail(user.email, user.first_name, resetToken)
    } catch (emailError) {
      console.error('Erreur envoi email reset:', emailError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de l\'envoi de l\'email'
      })
    }

    return {
      success: true,
      message: 'Si cette adresse email existe, un lien de réinitialisation a été envoyé'
    }
  } catch (error: any) {
    console.error('Erreur reset password API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la réinitialisation'
    })
  }
})