import { createClient } from "@supabase/supabase-js";
/** Server-only public-key client. Service-role credentials must never be imported by client code. */
export function createSupabaseServerClient(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!url||!key)throw new Error("Supabase environment variables are not configured.");return createClient(url,key,{auth:{persistSession:false}})}
