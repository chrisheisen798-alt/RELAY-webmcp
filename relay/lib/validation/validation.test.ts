import { describe, expect, it } from "vitest";
import { canDecideApproval, assertOrganizationAccess } from "../permissions";
import { projectSchema, taskSchema } from ".";
describe("foundation validation",()=>{it("accepts a bounded project input",()=>expect(projectSchema.parse({name:"Launch plan"}).status).toBe("draft"));it("rejects a blank task title",()=>expect(()=>taskSchema.parse({title:"   "})).toThrow());it("limits task priorities to supported values",()=>expect(()=>taskSchema.parse({title:"A",priority:"immediate"})).toThrow());});
describe("organization authorization",()=>{it("allows administrators to decide approvals",()=>expect(canDecideApproval("admin")).toBe(true));it("does not allow members to decide approvals",()=>expect(canDecideApproval("member")).toBe(false));it("rejects cross-organization access",()=>expect(()=>assertOrganizationAccess(["org-a"],"org-b")).toThrow("Not authorized"));});
