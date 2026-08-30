import type { ModelContext } from "./types";
export function getModelContext():ModelContext|undefined{if(typeof document==="undefined")return undefined;const candidate=document as Document&{modelContext?:ModelContext};return typeof candidate.modelContext?.registerTool==="function"?candidate.modelContext:undefined;}
