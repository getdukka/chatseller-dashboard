// server/api/direct-auth.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  console.log('🔐 [DIRECT AUTH] Tentative de login:', body)
  
  // Validation basique
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email et mot de passe requis'
    })
  }
  
  // Auth temporaire avec les credentials de test
  if (body.email === 'admin@chatseller.app' && body.password === 'password123') {
    const token = 'chatseller-token-' + Date.now()
    
    return {
      success: true,
      data: {
        token,
        user: {
          id: '1',
          email: body.email,
          name: 'Administrateur ChatSeller',
          shopId: '1'
        }
      }
    }
  }
  
  // Credentials incorrects
  throw createError({
    statusCode: 401,
    statusMessage: 'Identifiants invalides'
  })
})