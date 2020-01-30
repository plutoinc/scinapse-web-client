import { schema, denormalize } from 'normalizr';
import { AppState } from '../reducers';

export type ProfileInfo = CVInfoType;

export interface CVInfoType {
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
}

interface CvBaseInfo {
  id: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  institutionId: string;
  institutionName: string;
}

export interface Award {
  id: string;
  title: string;
  relatedLink: string | null;
  receivedDate: string;
}

export interface Education extends CvBaseInfo {
  degree: string;
  department: string;
}

export interface Experience extends CvBaseInfo {
  description: string | null;
  position: string;
  department: string | null;
}

export const profileInfoSchema = new schema.Entity(
  'profileInfoEntities',
  {},
  {
    idAttribute: 'profileId',
  }
);

export const selectHydratedProfileInfo = (state: AppState, id: string | undefined): ProfileInfo | undefined =>
  denormalize(id, profileInfoSchema, state);
