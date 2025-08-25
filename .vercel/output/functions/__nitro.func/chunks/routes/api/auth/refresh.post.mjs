import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig, s as setCookie } from '../../../nitro/nitro.mjs';
import jwt from 'jsonwebtoken';
import { a as findUserById } from '../../../_/database.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';
import 'bcrypt';

const refresh_post = defineEventHandler(async (event) => {
  try {
    const { refreshToken } = await readBody(event);
    if (!refreshToken) {
      throw createError({
        statusCode: 400,
        statusMessage: "Refresh token requis"
      });
    }
    const config = useRuntimeConfig();
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwtSecret);
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: "Refresh token invalide"
      });
    }
    if (decoded.type !== "refresh") {
      throw createError({
        statusCode: 401,
        statusMessage: "Token invalide"
      });
    }
    const user = await findUserById(decoded.userId);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Utilisateur non trouv\xE9"
      });
    }
    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      config.jwtSecret,
      { expiresIn: "30d" }
    );
    setCookie(event, "auth-token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60
      // 24h
    });
    return {
      success: true,
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken
      }
    };
  } catch (error) {
    console.error("Erreur refresh token API:", error);
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || "Impossible de rafra\xEEchir le token"
    });
  }
});

export { refresh_post as default };
//# sourceMappingURL=refresh.post.mjs.map
