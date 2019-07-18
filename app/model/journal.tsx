import { schema } from 'normalizr';
import { NewFOS } from './fos';

export interface Journal {
  citationCount: number;
  fosList: NewFOS[];
  id: number;
  impactFactor: number | null;
  issn: string | null;
  paperCount: number;
  title: string;
  webPage: string | null;
  titleAbbrev: string | null;
}

export const journalSchema = new schema.Entity('journals');
