import { schema } from "normalizr";
import { Comment, commentSchema } from "./comment";
import { PaperAuthor } from "./author";
import { IPaperSource } from "./paperSource";
import { Fos } from "./fos";
import { Journal } from "./journal";

export interface Paper {
  id: number;
  cognitivePaperId: number;
  title: string;
  year: number;
  referenceCount: number;
  citedCount: number;
  lang: string;
  doi: string;
  publisher: string;
  venue: string;
  fosList: Fos[];
  authors: PaperAuthor[];
  abstract: string;
  commentCount: number;
  comments: Comment[];
  journal: Journal | null;
  urls?: IPaperSource[];
}

export const paperSchema = new schema.Entity("papers", {
  comments: [commentSchema],
});
