import { schema } from 'normalizr';

export interface Profile extends CVInfoType {
  authorId: string;
}

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

export const profileSchema = new schema.Entity(
  'profiles',
  {},
  {
    idAttribute: 'authorId',
  }
);
