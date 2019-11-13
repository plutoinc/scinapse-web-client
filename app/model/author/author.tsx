import { schema } from 'normalizr';
import { Paper } from '../paper';
import { Affiliation } from '../affiliation';
import { NewFOS } from '../fos';

export interface Author {
  id: string;
  name: string;
  hindex: number;
  lastKnownAffiliation?: Affiliation;
  paperCount: number;
  citationCount: number;
  bio: string | null;
  representativePapers: Paper[];
  topPapers: Paper[];
  email: string;
  webPage: string | null;
  profileImageUrl: string | null;
  isLayered: boolean;
  isEmailHidden: boolean;
  fosList: NewFOS[];
}

export const authorSchema = new schema.Entity('authors');
export const authorListSchema = [authorSchema];
