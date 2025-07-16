import { ref, computed, readonly } from 'vue'
import { createClient } from '@supabase/supabase-js'
import type { User, AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

interface SignInCredentials {
  email: string
  password: string
}

interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  businessName: string
  phone?: string
}

export const useAuth = () => {
  // Configuration Supabase dans le contexte du composable
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseAnonKey as string
  )

  // État local
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // État calculé
  const isAuthenticated = computed(() => !!user.value)
  const userProfile = computed(() => {
    if (!user.value) return null
    
    return {
      id: user.value.id,
      email: user.value.email,
      fullName: user.value.user_metadata?.full_name || 
                `${user.value.user_metadata?.first_name} ${user.value.user_metadata?.last_name}`,
      firstName: user.value.user_metadata?.first_name,
      lastName: user.value.user_metadata?.last_name,
      businessName: user.value.user_metadata?.business_name,
      phone: user.value.user_metadata?.phone,
      avatarUrl: user.value.user_metadata?.avatar_url,
      createdAt: user.value.created_at
    }
  })

  // Initialiser l'utilisateur depuis la session
  const initializeAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        user.value = session.user
      }
      
      // Écouter les changements d'authentification
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user || null
      })
    } catch (error) {
      console.error('Erreur initialisation auth:', error)
    }
  }

  /**
   * Connexion utilisateur
   */
  const signIn = async ({ email, password }: SignInCredentials) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })
      
      if (authError) {
        throw authError
      }
      
      if (!data.user) {
        throw new Error('Aucun utilisateur retourné après connexion')
      }
      
      user.value = data.user
      
      // Vérifier que le profil utilisateur existe dans notre base
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du profil:', profileError)
      }
      
      // Si le profil n'existe pas, le créer
      if (!profile) {
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            first_name: data.user.user_metadata?.first_name,
            last_name: data.user.user_metadata?.last_name,
            business_name: data.user.user_metadata?.business_name,
            phone: data.user.user_metadata?.phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (createProfileError) {
          console.error('Erreur lors de la création du profil:', createProfileError)
        }
      }
      
      // Redirection vers le dashboard - utiliser navigateTo dans le bon contexte
      if (process.client) {
        await navigateTo('/')
      }
      
      return { success: true, user: data.user }
      
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      error.value = errorMessage
      
      console.error('Erreur de connexion:', err)
      
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Inscription utilisateur
   */
  const signUp = async (userData: SignUpData) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName.trim(),
            last_name: userData.lastName.trim(),
            business_name: userData.businessName.trim(),
            phone: userData.phone?.trim(),
            full_name: `${userData.firstName.trim()} ${userData.lastName.trim()}`
          }
        }
      })
      
      if (authError) {
        throw authError
      }
      
      if (!data.user) {
        throw new Error('Erreur lors de la création du compte')
      }
      
      return { 
        success: true, 
        user: data.user,
        needsConfirmation: !data.session
      }
      
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      error.value = errorMessage
      
      console.error('Erreur d\'inscription:', err)
      
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Déconnexion
   */
  const signOut = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        throw signOutError
      }
      
      user.value = null
      
      // Redirection vers la page de connexion
      if (process.client) {
        await navigateTo('/login')
      }
      
      return { success: true }
      
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      error.value = errorMessage
      
      console.error('Erreur de déconnexion:', err)
      
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Réinitialisation du mot de passe
   */
  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null
    
    try {
      const resetUrl = process.client ? `${window.location.origin}/reset-password` : 'http://localhost:3000/reset-password'
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: resetUrl }
      )
      
      if (resetError) {
        throw resetError
      }
      
      return { success: true }
      
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      error.value = errorMessage
      
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Mise à jour du profil utilisateur
   */
  const updateProfile = async (updates: Partial<SignUpData>) => {
    if (!user.value) {
      throw new Error('Utilisateur non connecté')
    }
    
    loading.value = true
    error.value = null
    
    try {
      // Mise à jour des métadonnées utilisateur
      const metadata: any = {}
      if (updates.firstName) metadata.first_name = updates.firstName.trim()
      if (updates.lastName) metadata.last_name = updates.lastName.trim()
      if (updates.businessName) metadata.business_name = updates.businessName.trim()
      if (updates.phone) metadata.phone = updates.phone.trim()
      
      if (updates.firstName && updates.lastName) {
        metadata.full_name = `${updates.firstName.trim()} ${updates.lastName.trim()}`
      }
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: metadata
      })
      
      if (updateError) {
        throw updateError
      }
      
      // Mise à jour du profil dans la base
      const profileUpdates: any = {
        updated_at: new Date().toISOString()
      }
      
      if (updates.firstName) profileUpdates.first_name = updates.firstName.trim()
      if (updates.lastName) profileUpdates.last_name = updates.lastName.trim()
      if (updates.businessName) profileUpdates.business_name = updates.businessName.trim()
      if (updates.phone) profileUpdates.phone = updates.phone.trim()
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.value.id)
      
      if (profileError) {
        console.error('Erreur mise à jour profil:', profileError)
      }
      
      return { success: true }
      
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      error.value = errorMessage
      
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Vérification du statut d'authentification
   */
  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return !!session
    } catch (error) {
      console.error('Erreur vérification auth:', error)
      return false
    }
  }

  /**
   * Gestion des erreurs d'authentification
   */
  const getErrorMessage = (error: AuthError | Error | any): string => {
    if (!error) return 'Une erreur inconnue est survenue'
    
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Email ou mot de passe incorrect',
      'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
      'User already exists': 'Un compte existe déjà avec cet email',
      'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
      'Invalid email': 'Format d\'email invalide',
      'Signup is disabled': 'Les inscriptions sont temporairement désactivées',
      'Email rate limit exceeded': 'Trop de tentatives, veuillez patienter',
      'Invalid credentials': 'Identifiants invalides',
      'Authentication failed': 'Échec de l\'authentification'
    }
    
    const message = error.message || error.toString()
    
    return errorMessages[message] || 
           `Erreur d'authentification: ${message}`
  }

  /**
   * Nettoyage des erreurs
   */
  const clearError = () => {
    error.value = null
  }

  // Initialiser l'auth au montage du composable
  initializeAuth()

  return {
    // État
    user: readonly(user),
    userProfile,
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    
    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    checkAuth,
    clearError
  }
}