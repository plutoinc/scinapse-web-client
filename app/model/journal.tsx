import { schema } from "normalizr";

export interface Journal {
  id: number;
  impactFactor: number | null;
  fullTitle: string;
  paperCount: number;
}

export const journalSchema = new schema.Entity("journals");
