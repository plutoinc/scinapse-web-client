import { IWallet, WalletFactory } from "../model/wallet";
import { IMember, recordifyMember } from "../model/member";

export const RAW = {
  MEMBER: require("./member.json") as IMember,
  WALLET: require("./wallet.json") as IWallet,
};

export const RECORD = {
  MEMBER: recordifyMember(RAW.MEMBER),
  WALLET: WalletFactory(RAW.WALLET),
};
