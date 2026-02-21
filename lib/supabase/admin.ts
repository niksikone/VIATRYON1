import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL_PLACEHOLDER = "https://placeholder.supabase.co";
const SUPABASE_SERVICE_ROLE_PLACEHOLDER = "placeholder-service-role-key";

export const createSupabaseAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_PLACEHOLDER,
    process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_PLACEHOLDER,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
