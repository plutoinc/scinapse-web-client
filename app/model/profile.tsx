import { Paper } from "./paper";

export interface RawProfile {
  id: string;
  affiliation: string;
  email: string;
  first_name: string;
  last_name: string;
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
  selected_publications: Paper[];
}

export interface Profile {
  id: string;
  affiliation: string;
  email: string;
  firstName: string;
  lastName: string;
  awards: Award[];
  educations: Education[];
  experiences: Experience[];
  selectedPublications: Paper[];
}

interface Award {
  description: string;
  id: string;
  profile_id: string;
  receive_date: string;
  title: string;
}

interface Education {
  description: string;
  end_date: string;
  id: string;
  profile_id: string;
  start_date: string;
  title: string;
}

interface Experience {
  description: string;
  end_date: string;
  id: string;
  profile_id: string;
  start_date: string;
  title: string;
}
