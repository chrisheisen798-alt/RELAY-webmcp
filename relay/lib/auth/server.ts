import { redirect } from "next/navigation";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import type { OrganizationRole } from "@/lib/permissions";

export async function requireUser() {
  const db = await createSupabaseRouteClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  return { db, user };
}

export async function requireOrganization() {
  const { db, user } = await requireUser();
  const { data, error } = await db.from("memberships").select("organization_id,role,organizations(name)").eq("user_id", user.id).limit(1).single();
  if (error || !data) throw new Error("Your Relay workspace has not been initialized.");
  return { db, user, membership: data as unknown as { organization_id: string; role: OrganizationRole; organizations: { name: string } | null } };
}

/** Verifies the untrusted project id explicitly; Supabase RLS remains the final boundary. */
export async function requireProject(projectId: string) {
  const context = await requireOrganization();
  const { data, error } = await context.db.from("projects").select("id,organization_id,name,description,status,owner_id,created_at,updated_at").eq("id", projectId).eq("organization_id", context.membership.organization_id).maybeSingle();
  if (error || !data) throw new Error("Project not found or not authorized.");
  return { ...context, project: data };
}
