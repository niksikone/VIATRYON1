import { createBrowserClient } from "@supabase/ssr";

// Placeholders used only when env vars are missing (e.g. during Netlify build prerender).
// @supabase/ssr throws if url/key are empty; using placeholders lets the build succeed.
const SUPABASE_URL_PLACEHOLDER = "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY_PLACEHOLDER = "placeholder-anon-key";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const createSupabaseBrowserClient = () => {
  if (browserClient) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_PLACEHOLDER;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_PLACEHOLDER;

  browserClient = createBrowserClient(url, key);

  return browserClient;
};
