export type OrganizationRole="owner"|"admin"|"member";
export function canManageProjects(role:OrganizationRole){return role==="owner"||role==="admin"}
export function canDecideApproval(role:OrganizationRole){return role==="owner"||role==="admin"}
export function assertOrganizationAccess(memberOrganizationIds:readonly string[],organizationId:string){if(!memberOrganizationIds.includes(organizationId))throw new Error("Not authorized for this organization.")}
