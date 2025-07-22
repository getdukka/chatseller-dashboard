import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body
    
    console.log('🔐 Tentative de login:', { email })
    
    // Validation des champs
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email et mot de passe requis'
      })
    }
    
    // Credentials de test (remplacer par vraie validation)
    const testCredentials = {
      'admin@chatseller.app': 'password123',
      'demo@chatseller.app': 'demo123',
      'test@chatseller.app': 'test123'
    }
    
    if (testCredentials[email] !== password) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Identifiants invalides'
      })
    }
    
    // Génération du JWT
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { 
        userId: email,
        email: email,
        shopId: '1',
        role: 'admin'
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    )
    
    // Données utilisateur
    const user = {
      id: '1',
      email: email,
      name: email === 'admin@chatseller.app' ? 'Administrateur ChatSeller' : 'Utilisateur Demo',
      shopId: '1',
      role: 'admin',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=2563eb&color=fff`
    }
    
    console.log('✅ Login réussi pour:', email)
    
    return {
      success: true,
      data: {
        token,
        user,
        expiresIn: 86400 // 24h en secondes
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur login:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de l\'authentification'
    })
  }
})