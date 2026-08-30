export const REALTIME_TABLES = ["activity_events", "approvals", "tasks"] as const;
export type RealtimeTable = typeof REALTIME_TABLES[number];