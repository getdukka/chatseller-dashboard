import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig, s as setCookie } from '../../../nitro/nitro.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { f as findUserByEmail, c as createUser, s as sendWelcomeEmail } from '../../../_/database.mjs';
import crypto from 'crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

const native = {
  randomUUID: crypto.randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  return unsafeStringify(rnds);
}

const register_post = defineEventHandler(async (event) => {
  try {
    const {
      firstName,
      lastName,
      email,
      company,
      platform,
      password,
      newsletter
    } = await readBody(event);
    if (!firstName || !lastName || !email || !company || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Tous les champs obligatoires doivent \xEAtre remplis"
      });
    }
    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: "Le mot de passe doit contenir au moins 8 caract\xE8res"
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Format d'email invalide"
      });
    }
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: "Cette adresse email est d\xE9j\xE0 utilis\xE9e"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: v4(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      company,
      platform: platform || null,
      hashedPassword,
      role: "user",
      emailVerified: false,
      newsletter: newsletter || false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await createUser(newUser);
    const config = useRuntimeConfig();
    const accessToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );
    const refreshToken = jwt.sign(
      { userId: newUser.id, type: "refresh" },
      config.jwtSecret,
      { expiresIn: "30d" }
    );
    setCookie(event, "auth-token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60
      // 24h
    });
    try {
      await sendWelcomeEmail(newUser.email, newUser.firstName);
    } catch (emailError) {
      console.error("Erreur envoi email de bienvenue:", emailError);
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
    };
  } catch (error) {
    console.error("Erreur register API:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la cr\xE9ation du compte"
    });
  }
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
