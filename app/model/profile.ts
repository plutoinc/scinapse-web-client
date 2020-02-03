import { schema, denormalize } from 'normalizr';
import { AppState } from '../reducers';
import { Affiliation } from './affiliation';

export type Profile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  profileImageUrl: string;
  bio: string;
  webPage: string | null;
  affiliationId: string;
  affiliationName: string;
  hindex: number | null;
  citationCount: number | null;
  paperCount: number | null;
  isEmailPublic: boolean;
  isEmailVerified: boolean;
  isEditable: boolean;
};

export type PaperProfile = Profile & {
  order: number;
  matchedAutorId: string;
  affiliation: Affiliation;
}

export const profileEntitySchema = new schema.Entity('profileEntities');

export const selectHydratedProfile = (state: AppState, id: string | undefined) => {
  return denormalize(id, profileEntitySchema, state);
};
