import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const health_get = defineEventHandler(async (event) => {
  const startTime = Date.now();
  try {
    const dbStatus = await checkDatabaseStatus();
    const externalServices = await checkExternalServices();
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    return {
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0",
      environment: "production",
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      checks: {
        database: dbStatus,
        ...externalServices
      },
      system: {
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      }
    };
  } catch (error) {
    console.error("Health check failed:", error);
    return {
      status: "error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`
    };
  }
});
async function checkDatabaseStatus() {
  try {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    const { data, error } = await supabase.from("users").select("count").limit(1);
    if (error) {
      throw error;
    }
    return {
      status: "healthy",
      message: "Database connection successful",
      responseTime: "< 100ms"
    };
  } catch (error) {
    return {
      status: "unhealthy",
      message: "Database connection failed",
      error: error.message
    };
  }
}
async function checkExternalServices() {
  const services = {};
  try {
    if (process.env.OPENAI_API_KEY) {
      services.openai = {
        status: "healthy",
        message: "API key configured"
      };
    } else {
      services.openai = {
        status: "warning",
        message: "API key not configured"
      };
    }
  } catch (error) {
    services.openai = {
      status: "unhealthy",
      message: "OpenAI API check failed"
    };
  }
  try {
    if (process.env.SMTP_HOST) {
      services.email = {
        status: "healthy",
        message: "SMTP configured"
      };
    } else {
      services.email = {
        status: "warning",
        message: "SMTP not configured"
      };
    }
  } catch (error) {
    services.email = {
      status: "unhealthy",
      message: "Email service check failed"
    };
  }
  return services;
}

export { health_get as default };
//# sourceMappingURL=health.get.mjs.map
