import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, IWalletRecord, WalletFactory } from "./wallet";
import { MemberOAuth, MemberOAuthRecord, MemberOAuthFactory } from "./oauth";

export interface CurrentUser {
  isLoggedIn: boolean;
  oauthLoggedIn: boolean;
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
  emailVerified: boolean;
  oauth: MemberOAuth;
}

export interface CurrentUserPart {
  isLoggedIn: boolean;
  oauthLoggedIn: boolean;
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
  emailVerified: boolean | null;
  oauth: MemberOAuthRecord;
}

export interface CurrentUserRecord extends TypedRecord<CurrentUserRecord>, CurrentUserPart {}

export const initialCurrentUser: CurrentUser = {
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

export function CurrentUserFactory(currentUser: CurrentUser = initialCurrentUser): CurrentUserRecord {
  let recordifiedWallet: IWalletRecord = null;
  let recordifiedMemberOAuth: MemberOAuthRecord = null;

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

export const CURRENT_USER_INITIAL_STATE = CurrentUserFactory(initialCurrentUser);
