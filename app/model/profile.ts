import { schema, denormalize } from 'normalizr';
import { AppState } from '../reducers';

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

export const profileEntitySchema = new schema.Entity('profileEntities');

export const selectHydratedProfile = (state: AppState, id: string | undefined) => {
  return denormalize(id, profileEntitySchema, state);
};
