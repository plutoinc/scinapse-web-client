import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, IWalletRecord, WalletFactory } from "./wallet";
import { IMemberOAuth, IMemberOAuthRecord, MemberOAuthFactory } from "./member";

export interface ICurrentUser {
  isLoggedIn: Boolean;
  oauthLoggedIn: Boolean;
  email: string | null;
  name: string | null;
  id: number | null;
  reputation: number | null;
  profileImage: string | null;
  affiliation: string | null;
  major: string | null;
  wallet?: IWallet;
  articleCount: number;
  reviewCount: number;
  commentCount: number;
  emailVerified: Boolean;
  oauth: IMemberOAuth;
}

export interface ICurrentUserPart {
  isLoggedIn: Boolean;
  oauthLoggedIn: Boolean;
  email: string | null;
  name: string | null;
  id: number | null;
  reputation: number | null;
  profileImage: string | null;
  affiliation: string | null;
  major: string | null;
  wallet: IWalletRecord | null;
  articleCount: number | null;
  reviewCount: number | null;
  commentCount: number | null;
  emailVerified: Boolean | null;
  oauth: IMemberOAuthRecord;
}

export interface ICurrentUserRecord extends TypedRecord<ICurrentUserRecord>, ICurrentUserPart {}

export const initialCurrentUser: ICurrentUser = {
  isLoggedIn: false,
  oauthLoggedIn: false,
  email: "",
  name: "",
  id: null,
  reputation: null,
  profileImage: null,
  affiliation: null,
  major: null,
  wallet: null,
  articleCount: null,
  reviewCount: null,
  commentCount: null,
  emailVerified: null,
  oauth: null,
};

export function recordifyCurrentUser(currentUser: ICurrentUser = initialCurrentUser): ICurrentUserRecord {
  let recordifiedWallet: IWalletRecord = null;
  let recordifiedMemberOAuth: IMemberOAuthRecord = null;

  if (currentUser.wallet && !_.isEmpty(currentUser.wallet)) {
    recordifiedWallet = WalletFactory(currentUser.wallet);
  }

  if (currentUser.oauth && !_.isEmpty(currentUser.oauth)) {
    recordifiedMemberOAuth = MemberOAuthFactory(currentUser.oauth);
  }

  return recordify({
    isLoggedIn: currentUser.isLoggedIn,
    oauthLoggedIn: currentUser.oauthLoggedIn,
    email: currentUser.email,
    name: currentUser.name,
    id: currentUser.id,
    reputation: currentUser.reputation,
    profileImage: currentUser.profileImage,
    affiliation: currentUser.affiliation,
    major: currentUser.major,
    wallet: recordifiedWallet || null,
    articleCount: currentUser.articleCount,
    reviewCount: currentUser.reviewCount,
    commentCount: currentUser.commentCount,
    emailVerified: currentUser.emailVerified,
    oauth: recordifiedMemberOAuth || null,
  });
}

export const CURRENT_USER_INITIAL_STATE: ICurrentUserRecord = recordifyCurrentUser(initialCurrentUser);
