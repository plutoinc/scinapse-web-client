import { Member } from '../../model/member';
import { Affiliation } from '../../model/affiliation';

interface BaseSignUpParams {
  email: string;
  firstName: string;
  lastName: string;
  affiliationId: number | null;
  affiliation: string;
  profileLink?: string;
}

export interface BaseSignUpAPIParams {
  email: string;
  affiliation_name: string;
  first_name: string;
  last_name: string;
  affiliation_id: number | null;
  profile_link?: string | null;
}

export type SignUpWithEmailParams = BaseSignUpParams & { password: string };
export type SignUpWithSocialParams = BaseSignUpParams & {
  token: {
    vendor: OAUTH_VENDOR;
    token: string;
  };
};
export type SignUpWithEmailAPIParams = BaseSignUpAPIParams & { password: string };
export type SignUpWithSocialAPIParams = BaseSignUpAPIParams & {
  token: {
    vendor: OAUTH_VENDOR;
    token: string;
  };
};

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserInformationParams {
  firstName: string;
  lastName: string;
  affiliation: Affiliation;
  profileLink: string;
}

export interface UpdateUserInformationAPIParams {
  first_name: string;
  last_name: string;
  affiliation_id: number | null;
  affiliation_name: string;
  profile_link?: string;
}

export interface SignInWithEmailParams {
  email: string;
  password: string;
}

export interface SignInWithSocialParams {
  code: string;
  redirectUri: string;
  vendor: OAUTH_VENDOR;
}

export type OAUTH_VENDOR = 'ORCID' | 'FACEBOOK' | 'GOOGLE';

export interface GetAuthorizeUriParams {
  vendor: OAUTH_VENDOR;
  redirectURI?: string;
}

export interface GetAuthorizeUriResult {
  vendor: OAUTH_VENDOR;
  uri: string;
}

export interface VerifyEmailResult {
  success: boolean;
}

export interface SignInData {
  loggedIn: boolean;
  oauthLoggedIn: boolean;
  token: string;
  member: Member;
}

export interface SignInResult {
  loggedIn: boolean;
  oauthLoggedIn: boolean;
  token: string;
  member: Member | null;
}

export interface CheckDuplicatedEmailResult {
  duplicated: boolean;
}

export interface OAuthCheckResult {
  email?: string | null;
  firstName: string;
  lastName: string;
  oauthId: string;
  vendor: OAUTH_VENDOR;
  isConnected: boolean;
}

export interface OAuthCheckParams {
  email?: string | null;
  firstName: string;
  lastName: string;
  token: string;
  vendor: OAUTH_VENDOR;
}

export type EmailSettingTypes =
  | 'GLOBAL'
  | 'COLLECTION_REMIND'
  | 'PAPER_RECOMMENDATION'
  | 'REQUEST_CONFIRMATION'
  | 'LAST_WEEK_ACTIVITY';

export interface EmailSettingItemResponse {
  type: EmailSettingTypes;
  setting: 'ON' | 'OFF';
}

export interface UpdateEmailSettingParams {
  type: EmailSettingTypes;
  setting: boolean;
  token?: string;
}

export interface EmailSettingsResponse {
  data: {
    content: EmailSettingItemResponse[];
    page: null;
  };
  error: null;
}
