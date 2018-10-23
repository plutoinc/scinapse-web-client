import { schema } from "normalizr";
import { MemberOAuth } from "./oauth";

export interface Member {
  id: number;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profileImage: string;
  profile_id: string | null;
  affiliation: string;
  major: string;
  commentCount: number;
  oauth: MemberOAuth | null;
  is_profile_connected: boolean;
}

export const memberSchema = new schema.Entity("members");
