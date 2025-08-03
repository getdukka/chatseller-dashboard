// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token') || 
                  getHeader(event, 'authorization')?.replace('Bearer ', '')

    // Même si le token n'est pas valide, on nettoie les cookies
    deleteCookie(event, 'auth-token')
    
    // Optionnel: invalider le token en base de données
    // Si on maintient une blacklist des tokens révoqués
    
    return {
      success: true,
      message: 'Déconnexion réussie'
    }
  } catch (error: any) {
    console.error('Erreur logout API:', error)
    // On retourne toujours un succès pour le logout
    return {
      success: true,
      message: 'Déconnexion réussie'
    }
  }
})





// ===========================================
// Fonction helper pour l'envoi d'email de reset
// ===========================================
async function sendPasswordResetEmail(email: string, firstName: string, resetToken: string) {
  const config = useRuntimeConfig()
  const resetUrl = `${config.public.appUrl}/reset-password/confirm?token=${resetToken}`
  
  // TODO: Implémenter l'envoi d'email réel
  console.log(`Email de réinitialisation envoyé à ${email}`)
  console.log(`Lien de réinitialisation: ${resetUrl}`)
  
  // Exemple avec un service d'email (à adapter selon vos besoins)
  /*
  const emailData = {
    to: email,
    subject: 'Réinitialisation de votre mot de passe ChatSeller',
    template: 'reset-password',
    data: {
      firstName,
      resetUrl,
      expiresIn: '24 heures'
    }
  }
  
  await sendEmail(emailData)
  */
}

// Fonction helper pour Supabase
function getSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}