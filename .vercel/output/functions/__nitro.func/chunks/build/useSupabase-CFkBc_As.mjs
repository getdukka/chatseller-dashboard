import { createClient } from '@supabase/supabase-js';
import { c as useRuntimeConfig } from './server.mjs';

let supabaseClient = null;
const useSupabase = () => {
  if (supabaseClient) {
    return supabaseClient;
  }
  const config = useRuntimeConfig();
  supabaseClient = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
      // ✅ PAS DE CONFIGURATION DB - SEULEMENT AUTH
    }
  );
  console.log("\u2705 Supabase client cr\xE9\xE9 (AUTH SEULEMENT) avec:", {
    url: config.public.supabaseUrl,
    hasKey: !!config.public.supabaseAnonKey
  });
  console.log("\u26A0\uFE0F IMPORTANT: Ce client Supabase est configur\xE9 UNIQUEMENT pour l'authentification");
  console.log("\u{1F4E1} Pour les donn\xE9es, utilisez useApi() qui passe par l'API backend");
  return supabaseClient;
};

export { useSupabase as u };
//# sourceMappingURL=useSupabase-CFkBc_As.mjs.map
