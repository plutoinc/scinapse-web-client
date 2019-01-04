import { schema } from "normalizr";

export interface RawProfile {
  author_id: number[];
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
}

export interface Profile extends ProfileMetadata {
  authorId: number[];
}

export interface ProfileMetadata {
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
}

export interface Award {
  id: string;
  title: string;
  description: string | null;
  received_date: string;
}

export interface Education {
  id: string;
  degree: string;
  department: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  institution_id: number;
  institution_name: string;
}

export interface Experience {
  id: string;
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
