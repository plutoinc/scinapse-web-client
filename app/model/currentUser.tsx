import { Member } from "./member";

export interface CurrentUser
  extends Member,
    Readonly<{
      isLoggedIn: boolean;
      oauthLoggedIn: boolean;
    }> {}

export const CURRENT_USER_INITIAL_STATE: CurrentUser = {
  isLoggedIn: false,
  oauthLoggedIn: false,
  email: "",
  firstName: "",
  lastName: "",
  id: 0,
  profileImage: "",
  profileId: null,
  affiliation: "",
  major: "",
  commentCount: 0,
  emailVerified: false,
  oauth: null,
};
