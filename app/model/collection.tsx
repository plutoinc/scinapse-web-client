import { schema } from "normalizr";
import { MemberWithCollection } from "./member";

export interface Collection {
  id: number;
  createdBy: MemberWithCollection;
  title: string;
  description: string;
  paper_count: number;
  createdAt: string;
  updatedAt: string;
  contains_selected?: boolean;
}

export const collectionSchema = new schema.Entity("collections");
