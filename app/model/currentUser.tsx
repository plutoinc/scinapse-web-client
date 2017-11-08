import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, IWalletRecord, WalletFactory } from "./wallet";

export interface ICurrentUser {
  isLoggedIn: boolean;
  email: string | null;
  name: string | null;
  id: number | null;
  reputation: number | null;
  profileImage: string | null;
  institution: string | null;
  major: string | null;
  wallet?: IWallet;
  articleCount: number;
  reviewCount: number;
  commentCount: number;
}

export interface ICurrentUserPart {
  isLoggedIn: boolean;
  email: string | null;
  name: string | null;
  id: number | null;
  reputation: number | null;
  profileImage: string | null;
  institution: string | null;
  major: string | null;
  wallet: IWalletRecord | null;
  articleCount: number | null;
  reviewCount: number | null;
  commentCount: number | null;
}

export interface ICurrentUserRecord extends TypedRecord<ICurrentUserRecord>, ICurrentUserPart {}

export const initialCurrentUser: ICurrentUser = {
  isLoggedIn: false,
  email: "",
  name: "",
  id: null,
  reputation: null,
  profileImage: null,
  institution: null,
  major: null,
  wallet: null,
  articleCount: null,
  reviewCount: null,
  commentCount: null,
};

export function recordifyCurrentUser(currentUser: ICurrentUser = initialCurrentUser): ICurrentUserRecord {
  let recordifiedWallet: IWalletRecord = null;

  if (currentUser.wallet && !_.isEmpty(currentUser.wallet)) {
    recordifiedWallet = WalletFactory(currentUser.wallet);
  }

  return recordify({
    isLoggedIn: currentUser.isLoggedIn,
    email: currentUser.email,
    name: currentUser.name,
    id: currentUser.id,
    reputation: currentUser.reputation,
    profileImage: currentUser.profileImage,
    institution: currentUser.institution,
    major: currentUser.major,
    wallet: recordifiedWallet || null,
    articleCount: currentUser.articleCount,
    reviewCount: currentUser.reviewCount,
    commentCount: currentUser.commentCount,
  });
}

export const CURRENT_USER_INITIAL_STATE: ICurrentUserRecord = recordifyCurrentUser(initialCurrentUser);
