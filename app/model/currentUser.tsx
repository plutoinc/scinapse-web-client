import { Member } from "./member";

export interface CurrentUser
  extends Member,
    Readonly<{
      isLoggedIn: boolean;
      oauthLoggedIn: boolean;
      isLoggingIn: boolean;
    }> {}

export const CURRENT_USER_INITIAL_STATE: CurrentUser = {
  isLoggedIn: false,
  isLoggingIn: true,
  oauthLoggedIn: false,
  email: "",
  firstName: "",
  lastName: "",
  id: 0,
  profileImage: "",
  profile_image_url: "",
  affiliation: "",
  major: "",
  commentCount: 0,
  emailVerified: false,
  oauth: null,
  is_author_connected: false,
  author_id: 0,
};
