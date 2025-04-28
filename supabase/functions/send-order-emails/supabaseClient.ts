
import { createClient } from "npm:@supabase/supabase-js@2.39.8";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
