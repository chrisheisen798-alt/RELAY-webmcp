import { NextResponse } from "next/server";
import { z } from "zod";
import { searchProjectResources } from "@/lib/resources/service";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { resourceSearchSchema } from "@/lib/validation";

const projectIdSchema=z.uuid();
export async function POST(request:Request,{params}:{params:Promise<{projectId:string}>}){try{const {projectId}=await params;const validProjectId=projectIdSchema.parse(projectId);const input=resourceSearchSchema.parse(await request.json());const db=await createSupabaseRouteClient();const {data:{user},error}=await db.auth.getUser();if(error||!user)return NextResponse.json({error:{code:"UNAUTHORIZED",message:"Sign in to search project resources."}},{status:401});const result=await searchProjectResources(db,validProjectId,input);return NextResponse.json(result);}catch(error){if(error instanceof z.ZodError)return NextResponse.json({error:{code:"INVALID_INPUT",message:"Search filters are invalid."}},{status:400});if(error instanceof Error&&error.message==="Supabase environment variables are not configured.")return NextResponse.json({error:{code:"SERVICE_UNAVAILABLE",message:"Resource search is not configured."}},{status:503});return NextResponse.json({error:{code:"SEARCH_FAILED",message:"Unable to search project resources."}},{status:500});}}
