import { schema } from "normalizr";
import { Member } from "./member";

export interface Collection {
  id: number;
  created_by: Member;
  title: string;
  description: string;
  paper_count: number;
  created_at: string;
  updated_at: string;
  is_default: boolean;
  contains_selected?: boolean;
  note?: string | null;
  // used on client only
  noteUpdated?: boolean;
}

export const collectionSchema = new schema.Entity("collections");
