import { schema } from "normalizr";

export interface Profile extends CVInfoType {
  authorId: number[];
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
  institutionId: number;
  institutionName: string;
  department: string;
}

export interface Award {
  id: string;
  title: string;
  description: string | null;
  receivedDate: string;
}

export interface Education extends CvBaseInfo {
  degree: string;
}

export interface Experience extends CvBaseInfo {
  description: string | null;
  position: string;
}

export const profileSchema = new schema.Entity(
  "profiles",
  {},
  {
    idAttribute: "authorId",
  }
);
