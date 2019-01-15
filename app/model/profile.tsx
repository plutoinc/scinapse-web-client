import { schema } from "normalizr";

export interface RawProfile {
  author_id: number[];
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
}

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
  start_date: string;
  end_date: string;
  is_current: boolean;
  institution_id: number;
  institution_name: string;
  department: string;
}

export interface Award {
  id: string;
  title: string;
  description: string | null;
  received_date: string;
}

export interface Education extends CvBaseInfo {
  degree: string;
}

export interface Experience extends CvBaseInfo {
  description: string | null;
  position: string;
}

export function mapRawProfile(rawProfile: RawProfile): Profile {
  return {
    authorId: rawProfile.author_id,
    awards: rawProfile.awards,
    educations: rawProfile.educations,
    experiences: rawProfile.experiences,
  };
}

export const profileSchema = new schema.Entity(
  "profiles",
  {},
  {
    idAttribute: "authorId",
  }
);
