import { schema } from "normalizr";

export interface RawProfile {
  author_id: number[];
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
}

export interface Profile {
  authorId: number[];
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
}

export interface Award {
  id: number;
  title: string;
  description: string | null;
  received_date: string;
}

export interface Education {
  id: number;
  degree: string;
  department: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  institution_id: number;
  institution_name: string;
}

export interface Experience {
  id: number;
  department: string;
  description: string | null;
  start_date: string;
  end_date: string;
  position: string;
  institution_id: number;
  institution_name: string;
  is_current: boolean;
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
