import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, WalletFactory, IWalletRecord } from "./wallet";

// TODO: Add institution field, authentication level field
export interface IMember {
  email: string | null;
  name: string | null;
  id: number | null;
  reputation: number | null;
  profileImage?: string | null; // TODO: Fill this field
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
  email: null,
  name: null,
  id: null,
  wallet: null,
  reputation: null,
  profileImage: null,
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
