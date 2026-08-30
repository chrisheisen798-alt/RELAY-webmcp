# Relay

Relay is a collaborative workspace for people and future AI agents to plan, create, and safely execute work across an agent-enabled web.

## Vision

People stay in control while agents make plans, use structured web capabilities, and request approval before consequential actions. This repository includes one real, read-only WebMCP tool and does not include an AI agent.

## Current phase

**Phase 2 — first WebMCP capability.** The UI, data model, validation, authorization boundary, Supabase RLS policies, and a real read-only project resource search tool are in place. Supabase Auth screens, realtime subscriptions, and agent orchestration remain deferred.

## Technology

- Next.js App Router and React
- TypeScript and Tailwind CSS
- Supabase PostgreSQL, Auth, and Realtime-ready RLS model
- Zod input validation and Vitest unit tests

## Architecture

- `app/` — routes and server-rendered UI shell
- `components/` — shared application shell and empty-state components
- `lib/validation` — server input schemas
- `lib/permissions` — small, reusable role/organization helpers
- `lib/projects` — server-side project service boundary
- `lib/agent` and `lib/webmcp` — explicit empty boundaries for later verified work
- `supabase/migrations` — relational schema, indexes, and RLS policies

Every organization-owned row is isolated by Row Level Security. Policies check membership through `public.is_org_member`; nested project records are authorized through their parent project’s organization. The service-role key is not used or exposed by the application.

## Local development

Prerequisites: Node.js 20.9+ and a Supabase project when enabling data access.

```bash
cd relay
npm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Do not add a service-role key to a `NEXT_PUBLIC_` variable.

Apply `supabase/migrations/20260828000000_relay_foundation.sql` in the Supabase SQL editor (or through the Supabase CLI) before using data services. Then run:

```bash
npm run dev
npm run lint
npm test
npm run build
```

## Routes

- `/dashboard`, `/projects`, `/projects/[projectId]`
- `/projects/[projectId]/tasks`, `/resources`, `/documents`, `/schedule`, `/activity`, `/approvals`
- `/agent`, `/approvals`, `/activity`, `/settings`

## WebMCP architecture

WebMCP provides structured, officially verified capabilities to agents through the same server authorization and approval layers as Relay's other application behavior.

## WebMCP

Relay now exposes its first real browser capability: `search_project_resources`. When a compatible browser opens a project overview, the client registers the tool with the current imperative API:

```ts
await document.modelContext.registerTool(tool, { signal })
```

This was verified against the [WebMCP Community Group draft](https://webmachinelearning.github.io/webmcp/) (26 August 2026) and [Chrome’s Imperative API documentation](https://developer.chrome.com/docs/ai/webmcp/imperative-api), both consulted on 28 August 2026. The tool has a JSON Schema input contract: at least one of `query`, `category`, `location`, or `availability`, plus optional `limit` from 1 to 25. It is marked read-only and returns a JSON-serialized structured result containing an array of safe resource fields and `count`.

The browser callback never queries Supabase directly. It validates input again, sends it to the same-origin project search route, and that route gets the authenticated Supabase user from request cookies before querying. The resource service scopes every query to the current project and uses the request-scoped Supabase client; the existing organization membership RLS policies remain the final access boundary. A manipulated project URL, raw tool input, or cross-organization request therefore cannot grant extra data access. No service-role key is used.

WebMCP remains an experimental browser API. Relay checks for `document.modelContext.registerTool` only in a client component, registers nothing when it is absent, and exposes an honest status card on project overview pages. In development, a registered tool is confirmed through `document.modelContext.getTools()`. The registration uses an `AbortController`, so navigation/unmount removes the current project’s tool and prevents duplicate stale registrations.

To demonstrate it locally, configure Supabase, apply the migration, sign in through the future Auth flow, create a project with resource rows, and open `/projects/<project-id>` in a WebMCP-compatible browser. The status card reports whether the browser actually registered `search_project_resources`; no simulated agent conversation or result is shown.

### Why this is a meaningful WebMCP use case

In a traditional resource workspace, a human manually navigates filters and records. Relay exposes that same real, authorization-bound capability to an agent in a browser-discoverable structured form. The capability belongs to the website—not a hidden custom backend—and gives an agent a narrowly scoped way to find project resources without receiving unrestricted database access.
