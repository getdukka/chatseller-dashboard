// server/api/settings/index.put.ts
import { getCurrentUser, updateUserSettings, validateSettings } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    const newSettings = await readBody(event)
    
    // Valider les paramètres
    const validatedSettings = validateSettings(newSettings)
    
    // Sauvegarder
    await updateUserSettings(user.id, validatedSettings)
    
    return {
      success: true,
      data: validatedSettings
    }
  } catch (error: any) {
    console.error('Erreur update settings API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la sauvegarde des paramètres'
    })
  }
})
