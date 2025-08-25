import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import jwt from 'jsonwebtoken';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

async function findUserByEmail(email) {
  return {
    id: "1",
    email,
    first_name: "John"
  };
}
async function sendPasswordResetEmail(email, firstName, resetToken) {
  console.log(`Envoi email de reset \xE0 ${email} avec token ${resetToken}`);
  return Promise.resolve();
}
const resetPassword_post = defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Adresse email requise"
      });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return {
        success: true,
        message: "Si cette adresse email existe, un lien de r\xE9initialisation a \xE9t\xE9 envoy\xE9"
      };
    }
    const config = useRuntimeConfig();
    const resetToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: "reset-password"
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );
    try {
      await sendPasswordResetEmail(user.email, user.first_name, resetToken);
    } catch (emailError) {
      console.error("Erreur envoi email reset:", emailError);
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de l'envoi de l'email"
      });
    }
    return {
      success: true,
      message: "Si cette adresse email existe, un lien de r\xE9initialisation a \xE9t\xE9 envoy\xE9"
    };
  } catch (error) {
    console.error("Erreur reset password API:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors de la r\xE9initialisation"
    });
  }
});

export { resetPassword_post as default };
//# sourceMappingURL=reset-password.post.mjs.map
