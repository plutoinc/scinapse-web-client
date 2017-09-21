import * as _ from "lodash";
import { recordify, TypedRecord } from "typed-immutable-record";
import { IWallet, WalletFactory, IWalletRecord } from "./wallet";

export interface IMember {
  email: string | null;
  fullName: string | null;
  memberId: number | null;
  wallet?: IWallet;
}

export interface IMemberPart {
  email: string | null;
  fullName: string | null;
  memberId: number | null;
  wallet: IWalletRecord | null;
}

export interface IMemberRecord extends TypedRecord<IMemberRecord>, IMemberPart {}

export const initialMember: IMember = {
  email: null,
  fullName: null,
  memberId: null,
  wallet: null,
};

export function recordifyMember(member: IMember = initialMember): IMemberRecord {
  let recordifiedWallet: IWalletRecord = null;

  if (member.wallet && !_.isEmpty(member.wallet)) {
    recordifiedWallet = WalletFactory(member.wallet);
  }

  return recordify({
    email: member.email,
    fullName: member.fullName,
    memberId: member.memberId,
    wallet: recordifiedWallet || null,
  });
}
