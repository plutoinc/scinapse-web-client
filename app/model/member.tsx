import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, WalletFactory, IWalletRecord } from "./wallet";

// TODO: Add institution field, authentication level field
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
  email: string | null;
  name: string | null;
  id: number | null;
  reputation: number | null;
  profileImage?: string | null;
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
    email: member.email,
    name: member.name,
    id: member.id,
    reputation: member.reputation,
    profileImage: member.profileImage || null,
    wallet: recordifiedWallet || null,
  });
}
