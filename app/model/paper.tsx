import { schema } from "normalizr";
import { Comment } from "./comment";
import { PaperAuthor } from "./author";
import { PaperSource } from "./paperSource";
import { Fos } from "./fos";
import { Journal } from "./journal";
import { ConferenceInstance } from "./conferenceInstance";

export interface Paper {
  id: number;
  cognitivePaperId: number;
  title: string;
  titleHighlighted: string;
  year: number;
  publishedDate: string;
  referenceCount: number;
  citedCount: number;
  authorCount: number;
  lang: string;
  doi: string;
  publisher: string;
  venue: string;
  fosList: Fos[];
  authors: PaperAuthor[];
  abstract: string;
  abstractHighlighted: string;
  commentCount: number;
  comments: Comment[];
  journal: Journal | null;
  conferenceInstance: ConferenceInstance | null;
  urls: PaperSource[];
  isAuthorIncluded?: boolean;
}

export const paperSchema = new schema.Entity("papers");
