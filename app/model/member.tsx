import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, WalletFactory, IWalletRecord } from "./wallet";
import { MemberOAuth, MemberOAuthRecord, MemberOAuthFactory } from "./oauth";

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
  oauth: MemberOAuth;
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
  oauth: MemberOAuthRecord;
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
  let recordifiedMemberOAuth: MemberOAuthRecord = null;

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
    wallet: recordifiedWallet,
    articleCount: member.articleCount,
    reviewCount: member.reviewCount,
    commentCount: member.commentCount,
    emailVerified: member.emailVerified,
    oauth: recordifiedMemberOAuth,
  });
}
