import { Member } from "../../model/member";

export interface SignUpWithEmailParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: string;
}

export interface OAuthInfo {
  oauthId: string;
  uuid: string;
  vendor: OAUTH_VENDOR | null;
}

export interface SignUpWithSocialParams {
  email: string;
  firstName: string;
  lastName: string;
  affiliation: string;
  oauth?: OAuthInfo;
  token?: {
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

export type OAUTH_VENDOR = "ORCID" | "FACEBOOK" | "GOOGLE";

export interface GetAuthorizeUriParams {
  vendor: OAUTH_VENDOR;
  redirectURI?: string;
}

export interface GetAuthorizeUriResult {
  vendor: OAUTH_VENDOR;
  uri: string;
}

export interface PostExchangeParams {
  vendor: OAUTH_VENDOR;
  code: string;
  redirectUri?: string;
}

export interface PostExchangeResult {
  vendor: OAUTH_VENDOR;
  oauthId: string;
  userData: {
    email?: string;
    name?: string;
  };
  uuid: string;
  connected: boolean;
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
