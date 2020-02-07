import { schema } from 'normalizr';
import { Paper, paperSchema } from '../paper';
import { Affiliation } from '../affiliation';
import { NewFOS } from '../fos';
import { Profile } from '../profile';

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
  profile: Profile | null;
}

export const authorSchema = new schema.Entity('authors', {
  representativePapers: [paperSchema],
});
export const authorListSchema = [authorSchema];
