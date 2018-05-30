import { schema } from "normalizr";
import { Member } from "./member";

export interface Comment {
  id: number;
  paperId: number;
  createdAt: string;
  createdBy: Member;
  comment: string;
}

export const commentSchema = new schema.Entity("comments");
