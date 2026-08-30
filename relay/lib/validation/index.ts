import { z } from "zod";

const required = z.string().trim().min(1, "This field is required.").max(200);
const optionalText = (max: number) => z.string().trim().max(max).transform((value) => value || null);
const optionalUuid = z.union([z.literal(""), z.uuid()]).transform((value) => value || null);
const optionalDate = z.union([z.literal(""), z.iso.date()]).transform((value) => value || null);

export const projectSchema = z.object({
  name: required,
  description: optionalText(5000),
  status: z.enum(["draft", "active", "paused", "completed", "archived"]).default("active"),
});

export const resourceSchema = z.object({
  name: required,
  category: required.max(80),
  description: optionalText(5000),
  location: optionalText(120),
  availability: optionalText(80),
});

export const taskSchema = z.object({
  title: required,
  description: optionalText(5000),
  status: z.enum(["todo", "in_progress", "blocked", "completed", "cancelled"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  assigneeId: optionalUuid.default(""),
  dueDate: optionalDate.default(""),
});

export const documentSchema = z.object({
  title: required,
  type: required.max(80).default("note"),
  content: z.string().max(100_000).default(""),
});

export const approvalActionSchema = z.object({ approvalId: z.uuid(), decision: z.enum(["approved", "rejected"]), note: z.string().trim().max(2000).optional() });
export const resourceSearchSchema = z.object({ query: z.string().trim().min(1).max(120).optional(), category: z.string().trim().min(1).max(80).optional(), location: z.string().trim().min(1).max(120).optional(), availability: z.string().trim().min(1).max(80).optional(), limit: z.number().int().min(1).max(25).default(10) }).strict().refine((value) => Boolean(value.query || value.category || value.location || value.availability), { message: "Provide at least one search filter." });

export type ProjectInput = z.infer<typeof projectSchema>;
export type ResourceInput = z.infer<typeof resourceSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type ResourceSearchInput = z.infer<typeof resourceSearchSchema>;
