// server/utils/database.ts
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Initialiser Supabase
const getSupabaseClient = () => {
  const config = useRuntimeConfig()
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}

// =============================================
// AUTHENTICATION UTILITIES
// =============================================

export async function getCurrentUser(event: any) {
  const token = getCookie(event, 'auth-token') || 
                getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentification requise'
    })
  }

  try {
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as any
    
    const user = await findUserById(decoded.userId)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    return user
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide'
    })
  }
}

export async function findUserByEmail(email: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
    
  if (error && error.code !== 'PGRST116') {
    console.error('Erreur findUserByEmail:', error)
    throw error
  }
  
  return data
}

export async function findUserById(userId: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
    
  if (error && error.code !== 'PGRST116') {
    console.error('Erreur findUserById:', error)
    throw error
  }
  
  return data
}

export async function createUser(userData: any) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('users')
    .insert([{
      id: userData.id,
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      company: userData.company,
      platform: userData.platform,
      hashed_password: userData.hashedPassword,
      role: userData.role,
      email_verified: userData.emailVerified,
      newsletter: userData.newsletter,
      created_at: userData.createdAt,
      updated_at: userData.updatedAt
    }])
    .select()
    .single()
    
  if (error) {
    console.error('Erreur createUser:', error)
    throw error
  }
  
  return data
}

export async function validatePassword(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// =============================================
// CONVERSATIONS
// =============================================

export async function getConversations(params: {
  userId: string
  page?: number
  limit?: number
  status?: string
  search?: string
}) {
  const supabase = getSupabaseClient()
  const { userId, page = 1, limit = 20, status, search } = params
  
  let query = supabase
    .from('conversations')
    .select(`
      *,
      messages(content, created_at, sender)
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  if (search) {
    query = query.or(`visitor_name.ilike.%${search}%,visitor_email.ilike.%${search}%`)
  }
  
  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1)
  
  if (error) {
    console.error('Erreur getConversations:', error)
    throw error
  }
  
  const conversations = data?.map(conv => ({
    id: conv.id,
    visitorName: conv.visitor_name,
    visitorEmail: conv.visitor_email,
    lastMessage: conv.messages?.[0]?.content || 'Pas de messages',
    status: conv.status,
    messageCount: conv.messages?.length || 0,
    unreadCount: conv.unread_count || 0,
    createdAt: conv.created_at,
    updatedAt: conv.updated_at
  })) || []
  
  return {
    conversations,
    total: count || 0
  }
}

export async function getConversationById(conversationId: string, userId: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single()
    
  if (error && error.code !== 'PGRST116') {
    console.error('Erreur getConversationById:', error)
    throw error
  }
  
  if (!data) return null
  
  return {
    id: data.id,
    visitorName: data.visitor_name,
    visitorEmail: data.visitor_email,
    visitorPhone: data.visitor_phone,
    status: data.status,
    unreadCount: data.unread_count || 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    sourcePage: {
      title: data.source_page_title,
      url: data.source_page_url
    }
  }
}

export async function getConversationMessages(conversationId: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    
  if (error) {
    console.error('Erreur getConversationMessages:', error)
    throw error
  }
  
  return data?.map(msg => ({
    id: msg.id,
    sender: msg.sender,
    content: msg.content,
    timestamp: msg.created_at,
    confidence: msg.confidence || null
  })) || []
}

// =============================================
// ORDERS
// =============================================

export async function getOrders(params: {
  userId: string
  page?: number
  limit?: number
  status?: string
  minAmount?: number
  maxAmount?: number
}) {
  const supabase = getSupabaseClient()
  const { userId, page = 1, limit = 20, status, minAmount, maxAmount } = params
  
  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  if (minAmount !== undefined) {
    query = query.gte('total', minAmount)
  }
  
  if (maxAmount !== undefined) {
    query = query.lte('total', maxAmount)
  }
  
  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1)
  
  if (error) {
    console.error('Erreur getOrders:', error)
    throw error
  }
  
  const orders = data?.map(order => ({
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone,
    shippingAddress: order.shipping_address,
    products: order.products || [],
    total: order.total,
    status: order.status,
    source: 'Agent IA',
    createdAt: order.created_at,
    updatedAt: order.updated_at
  })) || []
  
  return {
    orders,
    total: count || 0
  }
}

// =============================================
// DASHBOARD STATS
// =============================================

export async function getDashboardStats(userId: string) {
  const supabase = getSupabaseClient()
  
  // Statistiques des conversations
  const { count: totalConversations } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  
  const { count: activeConversations } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active')
  
  // Statistiques des commandes
  const { data: orders } = await supabase
    .from('orders')
    .select('total, status')
    .eq('user_id', userId)
  
  const totalOrders = orders?.length || 0
  const confirmedOrders = orders?.filter(o => o.status === 'confirmed').length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const conversionRate = totalConversations > 0 ? (confirmedOrders / totalConversations) * 100 : 0
  
  return {
    totalConversations: totalConversations || 0,
    activeConversations: activeConversations || 0,
    totalOrders,
    conversionRate: Math.round(conversionRate * 100) / 100,
    totalRevenue,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    averageResponseTime: 1.8, // Valeur simulée
    uptime: 99.9 // Valeur simulée
  }
}

// =============================================
// USER SETTINGS
// =============================================

export async function getUserSettings(userId: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()
    
  if (error && error.code !== 'PGRST116') {
    console.error('Erreur getUserSettings:', error)
    // Retourner des paramètres par défaut si aucun trouvé
  }
  
  // Paramètres par défaut si pas de données
  const defaultSettings = {
    agent: {
      name: 'Sophie',
      welcomeMessage: 'Bonjour ! Comment puis-je vous aider ?',
      tone: 'friendly',
      customInstructions: 'Soyez poli et professionnel.'
    },
    sales: {
      enableUpselling: true,
      enableCrossSelling: true,
      createUrgency: false
    },
    widget: {
      primaryColor: '#2563eb',
      textColor: '#ffffff',
      position: 'bottom-right',
      buttonText: 'Besoin d\'aide ?'
    },
    notifications: {
      email: {
        newConversation: true,
        newOrder: true,
        dailyReport: false
      }
    }
  }
  
  return data?.settings || defaultSettings
}

export async function updateUserSettings(userId: string, settings: any) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_settings')
    .upsert([{
      user_id: userId,
      settings,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()
    
  if (error) {
    console.error('Erreur updateUserSettings:', error)
    throw error
  }
  
  return data
}

// =============================================
// VALIDATION UTILITIES
// =============================================

export function validateSettings(settings: any) {
  // Validation basique des paramètres
  if (!settings.agent?.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom de l\'agent est requis'
    })
  }
  
  return settings
}

// =============================================
// EMAIL UTILITIES
// =============================================

export async function sendWelcomeEmail(email: string, firstName: string) {
  // TODO: Implémenter l'envoi d'email
  console.log(`Email de bienvenue envoyé à ${email} pour ${firstName}`)
}