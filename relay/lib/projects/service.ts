import type { SupabaseClient } from "@supabase/supabase-js";
import { projectSchema,type ProjectInput } from "@/lib/validation";

export async function createProject(db:SupabaseClient,organizationId:string,ownerId:string,raw:ProjectInput){const input=projectSchema.parse(raw);const {data,error}=await db.from("projects").insert({...input,organization_id:organizationId,owner_id:ownerId}).select().single();if(error||!data)throw new Error("Unable to create project.");return data;}
export async function updateProject(db:SupabaseClient,organizationId:string,projectId:string,raw:ProjectInput){const input=projectSchema.parse(raw);const {data,error}=await db.from("projects").update(input).eq("id",projectId).eq("organization_id",organizationId).select().maybeSingle();if(error||!data)throw new Error("Project not found or not authorized.");return data;}
