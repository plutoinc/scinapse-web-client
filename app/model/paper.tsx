import { schema } from 'normalizr';
import { Comment } from './comment';
import { PaperAuthor } from './author';
import { PaperSource } from './paperSource';
import { Fos } from './fos';
import { Journal } from './journal';
import { ConferenceInstance } from './conferenceInstance';
import { SavedInCollections } from './savedInCollecctions';

export interface PaperPdf {
  url: string;
  lastCheckedAt: Date;
  hasBest: boolean;
}

export interface PaperFigure {
  type: string;
  name: string;
  caption: string;
  path: string;
}

export interface Paper {
  id: number;
  cognitivePaperId: number;
  title: string;
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
  figures: PaperFigure[];
  authors: PaperAuthor[];
  abstract: string;
  commentCount: number;
  comments: Comment[];
  journal: Journal | null;
  conferenceInstance: ConferenceInstance | null;
  urls: PaperSource[];
  isAuthorIncluded?: boolean;
  relation: { savedInCollections: SavedInCollections[] };
  bestPdf: PaperPdf;
  titleHighlighted?: string;
  abstractHighlighted?: string;
}

export const paperSchema = new schema.Entity('papers');
