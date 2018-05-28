import { isEmpty } from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, WalletFactory, IWalletRecord } from "./wallet";
import { MemberOAuth, MemberOAuthRecord, MemberOAuthFactory } from "./oauth";

export interface Member {
  id: number | null;
  email: string | null;
  name: string | null;
  profileImage: string | null;
  affiliation: string | null;
  major: string | null;
  reputation: number | null;
  wallet?: IWallet | null;
  articleCount: number;
  reviewCount: number;
  commentCount: number;
  emailVerified: boolean;
  oauth: MemberOAuth | null;
}

export interface MemberPart {
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
  oauth: MemberOAuthRecord | null;
}

export interface MemberRecord extends TypedRecord<MemberRecord>, MemberPart {}

export const initialMember: Member = {
  id: null,
  email: null,
  name: null,
  profileImage: null,
  affiliation: null,
  major: null,
  reputation: null,
  wallet: null,
  articleCount: 0,
  reviewCount: 0,
  commentCount: 0,
  emailVerified: false,
  oauth: null,
};

export function recordifyMember(member: Member = initialMember): MemberRecord {
  let recordifiedWallet: IWalletRecord | null = null;
  let recordifiedMemberOAuth: MemberOAuthRecord | null = null;

  if (member.wallet && !isEmpty(member.wallet)) {
    recordifiedWallet = WalletFactory(member.wallet);
  }

  if (member.oauth && !isEmpty(member.oauth)) {
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
