import { Member } from './member';

export type CurrentUser = Member &
  Readonly<{
    isLoggedIn: boolean;
    oauthLoggedIn: boolean;
    isLoggingIn: boolean;
    token: string;
  }>;

export const CURRENT_USER_INITIAL_STATE: CurrentUser = {
  isLoggedIn: false,
  isLoggingIn: true,
  oauthLoggedIn: false,
  email: '',
  firstName: '',
  lastName: '',
  id: 0,
  profileImageUrl: '',
  affiliationId: null,
  affiliationName: null,
  emailVerified: false,
  oauth: null,
  isAuthorConnected: false,
  authorId: '',
  profileLink: '',
  token: '',
};
