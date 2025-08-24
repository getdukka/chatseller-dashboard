import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig, s as setCookie } from '../../../nitro/nitro.mjs';
import jwt from 'jsonwebtoken';
import { f as findUserByEmail, v as validatePassword } from '../../../_/database.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';
import 'bcrypt';

const login_post = defineEventHandler(async (event) => {
  try {
    const { email, password, rememberMe } = await readBody(event);
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email et mot de passe requis"
      });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Email ou mot de passe incorrect"
      });
    }
    const isValidPassword = await validatePassword(password, user.hashed_password);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: "Email ou mot de passe incorrect"
      });
    }
    const config = useRuntimeConfig();
    const tokenExpiry = rememberMe ? "30d" : "24h";
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: tokenExpiry }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      config.jwtSecret,
      { expiresIn: "30d" }
    );
    const supabase = getSupabaseClient();
    await supabase.from("users").update({
      last_login_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", user.id);
    setCookie(event, "auth-token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60
      // 30 jours ou 24h
    });
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          company: user.company,
          role: user.role,
          emailVerified: user.email_verified,
          createdAt: user.created_at,
          lastLoginAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        token: accessToken,
        refreshToken
      }
    };
  } catch (error) {
    console.error("Erreur login API:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la connexion"
    });
  }
});
function getSupabaseClient() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
