import { f as getCookie, e as getHeader, c as createError, u as useRuntimeConfig } from '../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const getSupabaseClient = () => {
  useRuntimeConfig();
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
};
async function getCurrentUser(event) {
  var _a;
  const token = getCookie(event, "auth-token") || ((_a = getHeader(event, "authorization")) == null ? void 0 : _a.replace("Bearer ", ""));
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentification requise"
    });
  }
  try {
    const config = useRuntimeConfig();
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await findUserById(decoded.userId);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Utilisateur non trouv\xE9"
      });
    }
    return user;
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token invalide"
    });
  }
}
async function findUserByEmail(email) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("users").select("*").eq("email", email.toLowerCase()).single();
  if (error && error.code !== "PGRST116") {
    console.error("Erreur findUserByEmail:", error);
    throw error;
  }
  return data;
}
async function findUserById(userId) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
  if (error && error.code !== "PGRST116") {
    console.error("Erreur findUserById:", error);
    throw error;
  }
  return data;
}
async function createUser(userData) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("users").insert([{
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
  }]).select().single();
  if (error) {
    console.error("Erreur createUser:", error);
    throw error;
  }
  return data;
}
async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
async function getConversationById(conversationId, userId) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("conversations").select("*").eq("id", conversationId).eq("user_id", userId).single();
  if (error && error.code !== "PGRST116") {
    console.error("Erreur getConversationById:", error);
    throw error;
  }
  if (!data) return null;
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
  };
}
async function getConversationMessages(conversationId) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("messages").select("*").eq("conversation_id", conversationId).order("created_at", { ascending: true });
  if (error) {
    console.error("Erreur getConversationMessages:", error);
    throw error;
  }
  return (data == null ? void 0 : data.map((msg) => ({
    id: msg.id,
    sender: msg.sender,
    content: msg.content,
    timestamp: msg.created_at,
    confidence: msg.confidence || null
  }))) || [];
}
async function getDashboardStats(userId) {
  const supabase = getSupabaseClient();
  const { count: totalConversations } = await supabase.from("conversations").select("*", { count: "exact", head: true }).eq("user_id", userId);
  const { count: activeConversations } = await supabase.from("conversations").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "active");
  const { data: orders } = await supabase.from("orders").select("total, status").eq("user_id", userId);
  const totalOrders = (orders == null ? void 0 : orders.length) || 0;
  const confirmedOrders = (orders == null ? void 0 : orders.filter((o) => o.status === "confirmed").length) || 0;
  const totalRevenue = (orders == null ? void 0 : orders.reduce((sum, order) => sum + (order.total || 0), 0)) || 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = totalConversations > 0 ? confirmedOrders / totalConversations * 100 : 0;
  return {
    totalConversations: totalConversations || 0,
    activeConversations: activeConversations || 0,
    totalOrders,
    conversionRate: Math.round(conversionRate * 100) / 100,
    totalRevenue,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    averageResponseTime: 1.8,
    // Valeur simulée
    uptime: 99.9
    // Valeur simulée
  };
}
async function getUserSettings(userId) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).single();
  if (error && error.code !== "PGRST116") {
    console.error("Erreur getUserSettings:", error);
  }
  const defaultSettings = {
    agent: {
      name: "Sophie",
      welcomeMessage: "Bonjour ! Comment puis-je vous aider ?",
      tone: "friendly",
      customInstructions: "Soyez poli et professionnel."
    },
    sales: {
      enableUpselling: true,
      enableCrossSelling: true,
      createUrgency: false
    },
    widget: {
      primaryColor: "#2563eb",
      textColor: "#ffffff",
      position: "bottom-right",
      buttonText: "Besoin d'aide ?"
    },
    notifications: {
      email: {
        newConversation: true,
        newOrder: true,
        dailyReport: false
      }
    }
  };
  return (data == null ? void 0 : data.settings) || defaultSettings;
}
async function updateUserSettings(userId, settings) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("user_settings").upsert([{
    user_id: userId,
    settings,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }]).select().single();
  if (error) {
    console.error("Erreur updateUserSettings:", error);
    throw error;
  }
  return data;
}
function validateSettings(settings) {
  var _a;
  if (!((_a = settings.agent) == null ? void 0 : _a.name)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le nom de l'agent est requis"
    });
  }
  return settings;
}
async function sendWelcomeEmail(email, firstName) {
  console.log(`Email de bienvenue envoy\xE9 \xE0 ${email} pour ${firstName}`);
}

export { findUserById as a, getConversationById as b, createUser as c, getConversationMessages as d, getDashboardStats as e, findUserByEmail as f, getCurrentUser as g, getUserSettings as h, validateSettings as i, sendWelcomeEmail as s, updateUserSettings as u, validatePassword as v };
//# sourceMappingURL=database.mjs.map
