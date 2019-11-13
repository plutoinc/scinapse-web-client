import { schema } from 'normalizr';
import { NewFOS } from './fos';

export interface Journal {
  id: string;
  citationCount: number;
  fosList: NewFOS[];
  impactFactor: number | null;
  issn: string | null;
  paperCount: number;
  title: string;
  webPage: string | null;
  titleAbbrev: string | null;
  sci: boolean;
}

export const journalSchema = new schema.Entity('journals');
