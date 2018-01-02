import { IWallet, WalletFactory } from "../model/wallet";
import { IAuthor, recordifyAuthor } from "../model/author";
import { IMember, recordifyMember } from "../model/member";

export const RAW = {
  AUTHOR: require("./author.json") as IAuthor,
  MEMBER: require("./member.json") as IMember,
  WALLET: require("./wallet.json") as IWallet,
};

export const RECORD = {
  AUTHOR: recordifyAuthor(RAW.AUTHOR),
  MEMBER: recordifyMember(RAW.MEMBER),
  WALLET: WalletFactory(RAW.WALLET),
};
