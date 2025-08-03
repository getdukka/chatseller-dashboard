// server/api/auth/register.post.ts
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { findUserByEmail, createUser, sendWelcomeEmail } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      company, 
      platform, 
      password, 
      newsletter 
    } = await readBody(event)

    // Validation
    if (!firstName || !lastName || !email || !company || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs obligatoires doivent être remplis'
      })
    }

    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le mot de passe doit contenir au moins 8 caractères'
      })
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format d\'email invalide'
      })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cette adresse email est déjà utilisée'
      })
    }

    // Créer nouvel utilisateur
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = {
      id: uuidv4(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      company,
      platform: platform || null,
      hashedPassword,
      role: 'user',
      emailVerified: false,
      newsletter: newsletter || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Sauvegarder en DB
    await createUser(newUser)

    // Générer tokens
    const config = useRuntimeConfig()
    const accessToken = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        role: newUser.role 
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    )

    const refreshToken = jwt.sign(
      { userId: newUser.id, type: 'refresh' },
      config.jwtSecret,
      { expiresIn: '30d' }
    )

    // Définir le cookie d'authentification
    setCookie(event, 'auth-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24h
    })

    // Envoyer email de bienvenue (en arrière-plan)
    try {
      await sendWelcomeEmail(newUser.email, newUser.firstName)
    } catch (emailError) {
      console.error('Erreur envoi email de bienvenue:', emailError)
      // Ne pas faire échouer l'inscription si l'email ne peut pas être envoyé
    }

    return {
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          company: newUser.company,
          role: newUser.role,
          emailVerified: newUser.emailVerified,
          createdAt: newUser.createdAt
        },
        token: accessToken,
        refreshToken
      }
    }
  } catch (error: any) {
    console.error('Erreur register API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la création du compte'
    })
  }
})