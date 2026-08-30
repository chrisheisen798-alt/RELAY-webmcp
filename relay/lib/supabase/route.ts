import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Builds a request-scoped client so Supabase Auth and RLS see the caller's session. */
export async function createSupabaseRouteClient(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)throw new Error("Supabase environment variables are not configured.");
  const store=await cookies();
  return createServerClient(url,key,{cookies:{getAll(){return store.getAll()},setAll(values){try{values.forEach(({name,value,options})=>store.set(name,value,options));}catch{/* Server Components may refresh sessions elsewhere. */}}}});
}
