// composables/useOnboarding.ts - GESTION INTELLIGENTE DE L'ONBOARDING

import { useSupabase } from './useSupabase'
import { useAuthStore } from '../stores/auth'

interface OnboardingData {
  company: string
  website?: string
  industry?: string
  platform?: string
  acquisitionSource?: string
  newsletter?: boolean
}

interface OnboardingStatus {
  isCompleted: boolean
  hasMinimalInfo: boolean
  accountAge: number
  needsOnboarding: boolean
  userData: any
}

export const useOnboarding = () => {
  const supabase = useSupabase()
  const authStore = useAuthStore()

  // 🔍 VÉRIFIER LE STATUT D'ONBOARDING
  const checkOnboardingStatus = async (userId?: string): Promise<OnboardingStatus> => {
    try {
      const currentUserId = userId || authStore.user?.id
      
      if (!currentUserId) {
        throw new Error('ID utilisateur requis')
      }

      console.log('🔍 [ONBOARDING] Vérification statut pour:', currentUserId)

      const { data: userData, error } = await supabase
        .from('users')
        .select('onboarding_completed, company, first_name, last_name, email, created_at, website, industry, platform')
        .eq('id', currentUserId)
        .single()

      if (error) {
        console.error('❌ [ONBOARDING] Erreur récupération données:', error)
        throw error
      }

      // 📊 ANALYSE DU STATUT
      const hasCompletedOnboarding = userData?.onboarding_completed === true
      const hasMinimalInfo = !!(userData?.company || userData?.first_name || userData?.last_name)
      const accountAge = userData?.created_at ? 
        (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24) : 0
      
      // 🧠 LOGIQUE DE DÉTERMINATION
      const needsOnboarding = !hasCompletedOnboarding && (!hasMinimalInfo || accountAge <= 1)

      const status = {
        isCompleted: hasCompletedOnboarding,
        hasMinimalInfo,
        accountAge: Math.round(accountAge),
        needsOnboarding,
        userData
      }

      console.log('📊 [ONBOARDING] Statut analysé:', status)
      return status

    } catch (error) {
      console.error('❌ [ONBOARDING] Erreur vérification statut:', error)
      
      // ✅ RETOUR PAR DÉFAUT EN CAS D'ERREUR
      return {
        isCompleted: false,
        hasMinimalInfo: false,
        accountAge: 0,
        needsOnboarding: true,
        userData: null
      }
    }
  }

  // ✅ MARQUER L'ONBOARDING COMME COMPLÉTÉ
  const markOnboardingCompleted = async (userId?: string): Promise<boolean> => {
    try {
      const currentUserId = userId || authStore.user?.id
      
      if (!currentUserId) {
        throw new Error('ID utilisateur requis')
      }

      console.log('✅ [ONBOARDING] Marquage comme complété pour:', currentUserId)

      const { error } = await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUserId)

      if (error) {
        console.error('❌ [ONBOARDING] Erreur marquage complété:', error)
        return false
      }

      console.log('✅ [ONBOARDING] Marqué comme complété avec succès')
      return true

    } catch (error) {
      console.error('❌ [ONBOARDING] Erreur marquage complété:', error)
      return false
    }
  }

  // 🚀 FINALISER L'ONBOARDING AVEC DONNÉES
  const completeOnboarding = async (data: OnboardingData): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🚀 [ONBOARDING] Début finalisation avec données:', data)
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Utilisateur non trouvé')
      }

      // 💾 MISE À JOUR DES DONNÉES UTILISATEUR
      const updateData = {
        id: user.id,
        email: user.email,
        company: data.company,
        website: data.website || null,
        industry: data.industry || null,
        platform: data.platform || null,
        acquisition_source: data.acquisitionSource || null,
        newsletter: data.newsletter || false,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('💾 [ONBOARDING] Mise à jour données utilisateur...')

      const { error: updateUserError } = await supabase
        .from('users')
        .upsert(updateData, { onConflict: 'id' })

      if (updateUserError) {
        console.error('❌ [ONBOARDING] Erreur mise à jour utilisateur:', updateUserError)
        throw new Error(`Erreur sauvegarde profil: ${updateUserError.message}`)
      }

      // 🏪 CRÉATION/MISE À JOUR DU SHOP
      console.log('🏪 [ONBOARDING] Création/mise à jour shop...')
      
      const shopData = {
        id: user.id,
        name: data.company || `Shop de ${user.email}`,
        email: user.email,
        domain: extractDomain(data.website),
        industry: data.industry,
        platform: data.platform,
        subscription_plan: 'free',
        is_active: true,
        trial_started_at: new Date().toISOString(),
        widget_config: {
          theme: 'modern',
          position: 'bottom-right',
          color: '#3B82F6'
        },
        agent_config: {
          name: 'Assistant Commercial',
          type: 'vendeur_conversion',
          tone: 'professionnel'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: shopError } = await supabase
        .from('shops')
        .upsert(shopData, { onConflict: 'id' })

      if (shopError) {
        console.warn('⚠️ [ONBOARDING] Erreur shop (non bloquante):', shopError)
        // Ne pas bloquer pour l'erreur shop
      } else {
        console.log('✅ [ONBOARDING] Shop créé/mis à jour')
      }

      // 🔄 MISE À JOUR DU STORE AUTH
      await authStore.restoreSession()

      console.log('🎉 [ONBOARDING] Finalisation terminée avec succès!')
      
      return { success: true }

    } catch (error: any) {
      console.error('❌ [ONBOARDING] Erreur finalisation:', error)
      
      return { 
        success: false, 
        error: error.message || 'Erreur lors de la finalisation de l\'onboarding' 
      }
    }
  }

  // 🔄 FORCER LA REDIRECTION VERS ONBOARDING
  const redirectToOnboarding = async () => {
    console.log('🔄 [ONBOARDING] Redirection forcée vers onboarding')
    await navigateTo('/onboarding')
  }

  // 🏠 REDIRECTION VERS DASHBOARD APRÈS ONBOARDING
  const redirectToDashboard = async () => {
    console.log('🏠 [ONBOARDING] Redirection vers dashboard')
    await navigateTo('/?onboarding=completed&welcome=true')
  }

  // 🛠️ UTILITAIRE : EXTRAIRE DOMAINE
  const extractDomain = (url?: string): string | null => {
    if (!url) return null
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
      return domain.replace('www.', '')
    } catch {
      return null
    }
  }

  // 📊 OBTENIR LES DONNÉES PRÉ-REMPLIES
  const getPrefilledData = async (): Promise<Partial<OnboardingData>> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return {}

      const { data: userData } = await supabase
        .from('users')
        .select('company, website, industry, platform')
        .eq('id', user.id)
        .single()

      const prefilledData: Partial<OnboardingData> = {}

      if (userData?.company) prefilledData.company = userData.company
      if (userData?.website) prefilledData.website = userData.website
      if (userData?.industry) prefilledData.industry = userData.industry
      if (userData?.platform) prefilledData.platform = userData.platform

      // Fallback sur métadonnées utilisateur
      if (!prefilledData.company && user.user_metadata?.company) {
        prefilledData.company = user.user_metadata.company
      }

      return prefilledData

    } catch (error) {
      console.warn('⚠️ [ONBOARDING] Erreur récupération données pré-remplies:', error)
      return {}
    }
  }

  return {
    // 🔍 Statut et vérifications
    checkOnboardingStatus,
    markOnboardingCompleted,
    
    // 🚀 Actions
    completeOnboarding,
    redirectToOnboarding,
    redirectToDashboard,
    
    // 📊 Utilitaires
    getPrefilledData,
    extractDomain
  }
}