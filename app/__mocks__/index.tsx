import { IWallet, WalletFactory } from "../model/wallet";
import { IMember, recordifyMember } from "../model/member";
import { IComment, recordifyComment } from "../model/comment";
import { IFos, FosFactory } from "../model/fos";
import { IJournal, JournalFactory } from "../model/journal";
import { IPaper, recordifyPaper } from "../model/paper";
import { IPaperSource, PaperSourceFactory } from "../model/paperSource";

export const RAW = {
  COMMENT: require("./comment.json") as IComment,
  FOS: require("./fos.json") as IFos,
  JOURNAL: require("./journal.json") as IJournal,
  MEMBER: require("./member.json") as IMember,
  PAPER: require("./paper.json") as IPaper,
  SOURCE: require("./source.json") as IPaperSource,
  WALLET: require("./wallet.json") as IWallet,
};

export const RECORD = {
  COMMENT: recordifyComment(RAW.COMMENT),
  FOS: FosFactory(RAW.FOS),
  JOURNAL: JournalFactory(RAW.JOURNAL),
  MEMBER: recordifyMember(RAW.MEMBER),
  PAPER: recordifyPaper(RAW.PAPER),
  SOURCE: PaperSourceFactory(RAW.SOURCE),
  WALLET: WalletFactory(RAW.WALLET),
};
