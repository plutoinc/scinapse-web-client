import { Member } from "../../model/member";

export interface SignUpWithEmailParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: string;
}

export interface SignUpWithSocialParams {
  email: string;
  firstName: string;
  lastName: string;
  affiliation: string;
  oauth: {
    oauthId: string;
    uuid: string;
    vendor: OAUTH_VENDOR;
  };
}

export interface ISignInWithEmailParams {
  email: string;
  password: string;
}

export interface ISignInWithSocialParams {
  code: string;
  redirectUri: string;
  vendor: OAUTH_VENDOR;
}

export type OAUTH_VENDOR = "ORCID" | "FACEBOOK" | "GOOGLE";

export interface IGetAuthorizeUriParams {
  vendor: OAUTH_VENDOR;
  redirectUri?: string;
}

export interface IGetAuthorizeUriResult {
  vendor: OAUTH_VENDOR;
  uri: string;
}

export interface IPostExchangeParams {
  vendor: OAUTH_VENDOR;
  code: string;
  redirectUri?: string;
}

export interface IPostExchangeResult {
  vendor: OAUTH_VENDOR;
  oauthId: string;
  userData: {
    email?: string;
    name?: string;
  };
  uuid: string;
  connected: boolean;
}

export interface IVerifyEmailResult {
  success: boolean;
}

export interface ISignInData {
  loggedIn: boolean;
  oauthLoggedIn: boolean;
  token: string;
  member: Member;
}

export interface ISignInResult {
  loggedIn: boolean;
  oauthLoggedIn: boolean;
  token: string;
  member: Member | null;
}

export interface ICheckDuplicatedEmailResult {
  duplicated: boolean;
}
