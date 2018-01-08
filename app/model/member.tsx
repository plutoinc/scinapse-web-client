import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, WalletFactory, IWalletRecord } from "./wallet";
import { makeTypedFactory } from "typed-immutable-record/dist/src/typed.factory";
import { OAUTH_VENDOR } from "../api/types/auth";

export interface IMemberOAuth {
  connected: boolean | null;
  oauthId: string | null;
  userData: {} | null;
  uuid: string | null;
  vendor: OAUTH_VENDOR | null;
}

export const initialMemberOAuth: IMemberOAuth = {
  connected: null,
  oauthId: null,
  userData: null,
  uuid: null,
  vendor: null,
};

export interface IMemberOAuthRecord extends TypedRecord<IMemberOAuthRecord>, IMemberOAuth {}

export const MemberOAuthFactory = makeTypedFactory<IMemberOAuth, IMemberOAuthRecord>(initialMemberOAuth);

export interface IMember {
  id: number | null;
  email: string | null;
  name: string | null;
  profileImage: string | null;
  affiliation: string | null;
  major: string | null;
  reputation: number | null;
  wallet?: IWallet;
  articleCount: number;
  reviewCount: number;
  commentCount: number;
  emailVerified: boolean;
  oauth: IMemberOAuth;
}

export interface IMemberPart {
  id: number | null;
  email: string | null;
  name: string | null;
  profileImage: string | null;
  affiliation: string | null;
  major: string | null;
  reputation: number | null;
  wallet: IWalletRecord | null;
  articleCount: number | null;
  reviewCount: number | null;
  commentCount: number | null;
  emailVerified: boolean | null;
  oauth: IMemberOAuthRecord;
}

export interface IMemberRecord extends TypedRecord<IMemberRecord>, IMemberPart {}

export const initialMember: IMember = {
  id: null,
  email: null,
  name: null,
  profileImage: null,
  affiliation: null,
  major: null,
  reputation: null,
  wallet: null,
  articleCount: null,
  reviewCount: null,
  commentCount: null,
  emailVerified: null,
  oauth: null,
};

export function recordifyMember(member: IMember = initialMember): IMemberRecord {
  let recordifiedWallet: IWalletRecord = null;
  let recordifiedMemberOAuth: IMemberOAuthRecord = null;

  if (member.wallet && !_.isEmpty(member.wallet)) {
    recordifiedWallet = WalletFactory(member.wallet);
  }

  if (member.oauth && !_.isEmpty(member.oauth)) {
    recordifiedMemberOAuth = MemberOAuthFactory(member.oauth);
  }

  return recordify({
    id: member.id,
    email: member.email,
    name: member.name,
    profileImage: member.profileImage,
    affiliation: member.affiliation,
    major: member.major,
    reputation: member.reputation,
    wallet: recordifiedWallet || null,
    articleCount: member.articleCount,
    reviewCount: member.reviewCount,
    commentCount: member.commentCount,
    emailVerified: member.emailVerified,
    oauth: recordifiedMemberOAuth || null,
  });
}
