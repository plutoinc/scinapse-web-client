import { Member } from '../../model/member';
import { Affiliation } from '../../model/affiliation';

export interface SignUpWithEmailParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: string;
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserInformationParams {
  firstName: string;
  lastName: string;
  affiliation: Affiliation;
}

export interface SignUpWithSocialParams {
  email: string;
  firstName: string;
  lastName: string;
  affiliation: string;
  token: {
    vendor: OAUTH_VENDOR;
    token: string;
  };
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
  | 'FEATURE_INSTRUCTION'
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
