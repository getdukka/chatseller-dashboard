import { d as defineEventHandler, r as readBody, c as createError, e as getHeader, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
async function getCurrentUser(event) {
  const authHeader = getHeader(event, "authorization");
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token d'authentification requis"
    });
  }
  const token = authHeader.replace("Bearer ", "");
  const config = useRuntimeConfig();
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const { data: user, error } = await supabase.from("users").select("*").eq("id", decoded.userId).single();
    if (error || !user) {
      throw new Error("Utilisateur introuvable");
    }
    return user;
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token invalide"
    });
  }
}
async function validatePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
const changePassword_post = defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event);
    const { currentPassword, newPassword } = await readBody(event);
    if (!currentPassword || !newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "Mot de passe actuel et nouveau mot de passe requis"
      });
    }
    if (newPassword.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: "Le nouveau mot de passe doit contenir au moins 8 caract\xE8res"
      });
    }
    const isValidPassword = await validatePassword(currentPassword, user.hashed_password);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: "Mot de passe actuel incorrect"
      });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    const { error } = await supabase.from("users").update({
      hashed_password: newHashedPassword,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", user.id);
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la mise \xE0 jour du mot de passe"
      });
    }
    return {
      success: true,
      message: "Mot de passe modifi\xE9 avec succ\xE8s"
    };
  } catch (error) {
    console.error("Erreur change password API:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors du changement de mot de passe"
    });
  }
});

export { changePassword_post as default };
//# sourceMappingURL=change-password.post.mjs.map
