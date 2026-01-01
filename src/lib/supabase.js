import { createClient } from "@supabase/supabase-js";

// Keys come from Vite env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helpful fail-fast check
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase env variables are missing.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
