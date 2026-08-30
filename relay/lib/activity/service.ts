import type { SupabaseClient } from "@supabase/supabase-js";

export type ActivityInput = { organizationId: string; userId: string; projectId: string | null; eventType: string; description: string; metadata?: Record<string, unknown> };

export async function recordHumanActivity(db: SupabaseClient, input: ActivityInput) {
  const { error } = await db.from("activity_events").insert({ organization_id: input.organizationId, project_id: input.projectId, actor_type: "human", actor_id: input.userId, event_type: input.eventType, description: input.description, metadata: input.metadata ?? {} });
  if (error) throw new Error("The change was saved, but its activity event could not be recorded.");
}