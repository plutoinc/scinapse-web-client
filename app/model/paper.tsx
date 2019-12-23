import { schema } from 'normalizr';
import { PaperAuthor } from './author';
import { PaperSource } from './paperSource';
import { Fos } from './fos';
import { Journal } from './journal';
import { ConferenceInstance } from './conferenceInstance';

export interface PaperPdf {
  url: string;
  lastCheckedAt: Date;
  hasBest: boolean;
  path: string;
}

export interface PaperFigure {
  type: string;
  name: string;
  caption: string;
  path: string;
}

export interface SavedInCollection {
  id: number;
  title: string;
  readLater: boolean;
  updatedAt: string;
}

export interface Paper {
  id: string;
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
  journal: Journal | null;
  conferenceInstance: ConferenceInstance | null;
  urls: PaperSource[];
  isAuthorIncluded?: boolean;
  relation?: {
    savedInCollections: SavedInCollection[];
  } | null;
  titleHighlighted?: string;
  abstractHighlighted?: string;
  missingKeywords: string[];
  bestPdf?: PaperPdf;
}

export const paperSchema = new schema.Entity('papers');
