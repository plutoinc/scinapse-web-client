import { schema } from "normalizr";
import { Comment } from "./comment";
import { PaperAuthor } from "./author";
import { PaperSource } from "./paperSource";
import { Fos } from "./fos";
import { Journal } from "./journal";

export interface Paper {
  id: number;
  cognitivePaperId: number;
  title: string;
  year: number;
  publishedDate: string;
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
  urls: PaperSource[];
  isAuthorIncluded?: boolean;
}

export const paperSchema = new schema.Entity("papers");
