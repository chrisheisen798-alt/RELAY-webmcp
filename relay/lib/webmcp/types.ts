/** Narrow browser boundary based on the 2026-08-26 WebMCP Community Group draft. TypeScript's DOM library does not yet include it. */
export type WebMcpTool={name:string;description:string;inputSchema:Record<string,unknown>;annotations?:{readOnlyHint?:boolean;untrustedContentHint?:boolean};execute:(input:unknown,options:{signal:AbortSignal})=>Promise<string>};
export type RegisteredWebMcpTool={name:string;description:string;inputSchema:string;origin:string};
export type ModelContext={registerTool:(tool:WebMcpTool,options?:{signal?:AbortSignal})=>Promise<void>;getTools:()=>Promise<RegisteredWebMcpTool[]>};
export type WebMcpStatus={support:"checking"|"unavailable"|"registering"|"registered"|"error";registeredToolCount:number;message:string};
