import type { SupabaseClient } from "@supabase/supabase-js";
import { resourceSchema, type ResourceInput, type ResourceSearchInput } from "@/lib/validation";

export type ResourceSearchResult={id:string;name:string;category:string;description:string|null;location:string|null;availability:string|null};
type ResourceQuery={select:(columns:string)=>ResourceQuery;eq:(column:string,value:string)=>ResourceQuery;ilike:(column:string,value:string)=>ResourceQuery;limit:(count:number)=>PromiseLike<{data:ResourceSearchResult[]|null;error:{message:string}|null}>};
type ResourceClient=Pick<SupabaseClient,"from">;

/** Shared project query used by Relay UI/API and WebMCP. RLS applies organization membership. */
export async function searchProjectResources(db:ResourceClient,projectId:string,input:ResourceSearchInput){
  let query=db.from("resources") as unknown as ResourceQuery;
  query=query.select("id,name,category,description,location,availability").eq("project_id",projectId);
  if(input.query)query=query.ilike("name",`%${escapeLike(input.query)}%`);
  if(input.category)query=query.eq("category",input.category);
  if(input.location)query=query.eq("location",input.location);
  if(input.availability)query=query.eq("availability",input.availability);
  const {data,error}=await query.limit(input.limit);
  if(error)throw new Error("Resource search failed.");
  const resources=data??[];
  return {resources,count:resources.length};
}

export async function createResource(db:SupabaseClient,projectId:string,raw:ResourceInput){const input=resourceSchema.parse(raw);const {data,error}=await db.from("resources").insert({project_id:projectId,...input}).select().single();if(error||!data)throw new Error("Unable to create resource.");return data;}
export async function updateResource(db:SupabaseClient,projectId:string,resourceId:string,raw:ResourceInput){const input=resourceSchema.parse(raw);const {data,error}=await db.from("resources").update(input).eq("id",resourceId).eq("project_id",projectId).select().maybeSingle();if(error||!data)throw new Error("Resource not found or not authorized.");return data;}
export async function removeResource(db:SupabaseClient,projectId:string,resourceId:string){const {data,error}=await db.from("resources").delete().eq("id",resourceId).eq("project_id",projectId).select("id").maybeSingle();if(error||!data)throw new Error("Resource not found or not authorized.");}

function escapeLike(value:string){return value.replace(/[\\%_]/g,"\\$&");}
