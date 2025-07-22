// server/api/settings/index.get.ts
export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    
    // Récupérer les paramètres utilisateur
    const settings = await getUserSettings(user.id)
    
    return {
      success: true,
      data: settings
    }
  } catch (error: any) {
    console.error('Erreur get settings API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors du chargement des paramètres'
    })
  }
})