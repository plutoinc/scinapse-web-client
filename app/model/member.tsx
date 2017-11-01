import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, WalletFactory, IWalletRecord } from "./wallet";

export interface IMember {
  id: number | null;
  email: string | null;
  name: string | null;
  profileImage: string | null;
  institution: string | null;
  major: string | null;
  reputation: number | null;
  wallet?: IWallet;
}

export interface IMemberPart {
  id: number | null;
  email: string | null;
  name: string | null;
  profileImage: string | null;
  institution: string | null;
  major: string | null;
  reputation: number | null;
  wallet: IWalletRecord | null;
}

export interface IMemberRecord extends TypedRecord<IMemberRecord>, IMemberPart {}

export const initialMember: IMember = {
  id: null,
  email: null,
  name: null,
  profileImage: null,
  institution: null,
  major: null,
  reputation: null,
  wallet: null,
};

export function recordifyMember(member: IMember = initialMember): IMemberRecord {
  let recordifiedWallet: IWalletRecord = null;

  if (member.wallet && !_.isEmpty(member.wallet)) {
    recordifiedWallet = WalletFactory(member.wallet);
  }

  return recordify({
    id: member.id,
    email: member.email,
    name: member.name,
    profileImage: member.profileImage,
    institution: member.institution,
    major: member.major,
    reputation: member.reputation,
    wallet: recordifiedWallet || null,
  });
}
