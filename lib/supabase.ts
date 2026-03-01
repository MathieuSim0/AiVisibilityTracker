import { createClient } from "@supabase/supabase-js";

// Server-side admin client — uses service role key to bypass RLS.
// Never expose this client to the browser.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
