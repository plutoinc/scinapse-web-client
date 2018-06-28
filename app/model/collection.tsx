import { schema } from "normalizr";
import { MemberWithCollection } from "./member";

export interface Collection {
  id: number;
  createdBy: MemberWithCollection;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const collectionSchema = new schema.Entity("collections");
