import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://fvipqaosxgefguxgblfc.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aXBxYW9zeGdlZmd1eGdibGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDQ2MTEsImV4cCI6MjA1NTA4MDYxMX0.EpUzsdsUN2T0odw4Pnw4BZCN5t6uE15SF9GMxmtJlM0"
);
