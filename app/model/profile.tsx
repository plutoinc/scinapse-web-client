import { schema } from "normalizr";
import { Paper } from "./paper";
import { Member } from "./member";

export interface RawProfile {
  id: string;
  author_ids: number[];
  affiliation: string;
  email: string;
  first_name: string;
  last_name: string;
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
  selected_publications: Paper[];
  member: Member;
}

export interface Profile {
  id: string;
  authorIds: number[];
  affiliation: string;
  email: string;
  firstName: string;
  lastName: string;
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
  selectedPublications: Paper[];
  member: Member;
}

export interface Award {
  description: string;
  id: string;
  profile_id: string;
  receive_date: string;
  title: string;
}

export interface Education {
  degree: string;
  department: string;
  end_date: string;
  id: string;
  institution: string;
  is_current: boolean;
  profile_id: string;
  start_date: string;
}

export interface Experience {
  department: string;
  end_date: string;
  id: string;
  institution: string;
  is_current: boolean;
  position: string;
  profile_id: string;
  start_date: string;
}

export const profileSchema = new schema.Entity("profiles");
