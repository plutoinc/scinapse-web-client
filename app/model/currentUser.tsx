import { Member } from './member';
import { Institute } from './Institute';

export interface CurrentUser
  extends Member,
    Readonly<{
      isLoggedIn: boolean;
      oauthLoggedIn: boolean;
      isLoggingIn: boolean;
      ipInstitute: Institute | null;
    }> {}

export const CURRENT_USER_INITIAL_STATE: CurrentUser = {
  isLoggedIn: false,
  isLoggingIn: false,
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
  ipInstitute: null,
};
