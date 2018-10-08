import { MemberOAuth } from "./oauth";

export interface CurrentUser
  extends Readonly<{
      isLoggedIn: boolean;
      oauthLoggedIn: boolean;
      email: string;
      name: string;
      id: number;
      reputation: number;
      profileImage: string;
      affiliation: string;
      major: string;
      articleCount: number;
      reviewCount: number;
      commentCount: number;
      emailVerified: boolean;
      oauth: MemberOAuth | null;
    }> {}

export const CURRENT_USER_INITIAL_STATE: CurrentUser = {
  isLoggedIn: false,
  oauthLoggedIn: false,
  email: "",
  name: "",
  id: 0,
  reputation: 0,
  profileImage: "",
  affiliation: "",
  major: "",
  articleCount: 0,
  reviewCount: 0,
  commentCount: 0,
  emailVerified: false,
  oauth: null,
};
