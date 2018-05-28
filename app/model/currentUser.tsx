import { isEmpty } from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, IWalletRecord, WalletFactory } from "./wallet";
import { MemberOAuth, MemberOAuthRecord, MemberOAuthFactory } from "./oauth";

export interface CurrentUser {
  isLoggedIn: boolean;
  oauthLoggedIn: boolean;
  email: string;
  name: string;
  id: number;
  reputation: number;
  profileImage: string;
  affiliation: string;
  major: string;
  wallet?: IWallet;
  articleCount: number;
  reviewCount: number;
  commentCount: number;
  emailVerified: boolean;
  oauth: MemberOAuth | null;
}

export interface CurrentUserPart {
  isLoggedIn: boolean;
  oauthLoggedIn: boolean;
  email: string;
  name: string;
  id: number;
  reputation: number;
  profileImage: string;
  affiliation: string;
  major: string;
  wallet: IWalletRecord;
  articleCount: number;
  reviewCount: number;
  commentCount: number;
  emailVerified: boolean;
  oauth: MemberOAuthRecord;
}

export interface CurrentUserRecord extends TypedRecord<CurrentUserRecord>, CurrentUserPart {}

export const initialCurrentUser: CurrentUser = {
  isLoggedIn: false,
  oauthLoggedIn: false,
  email: "",
  name: "",
  id: 0,
  reputation: 0,
  profileImage: "",
  affiliation: "",
  major: "",
  wallet: undefined,
  articleCount: 0,
  reviewCount: 0,
  commentCount: 0,
  emailVerified: false,
  oauth: null,
};

export function CurrentUserFactory(currentUser: CurrentUser = initialCurrentUser): CurrentUserRecord {
  let recordifiedWallet: IWalletRecord | null = null;
  let recordifiedMemberOAuth: MemberOAuthRecord | null = null;

  if (currentUser.wallet && !isEmpty(currentUser.wallet)) {
    recordifiedWallet = WalletFactory(currentUser.wallet);
  }

  if (currentUser.oauth && !isEmpty(currentUser.oauth)) {
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
