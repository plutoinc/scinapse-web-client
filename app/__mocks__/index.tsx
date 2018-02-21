import { IWallet, WalletFactory } from "../model/wallet";
import { IMember, recordifyMember } from "../model/member";
import { IComment, recordifyComment } from "../model/comment";
import { IFos, FosFactory } from "../model/fos";
import { IJournal, JournalFactory } from "../model/journal";
import { Paper, PaperFactory } from "../model/paper";
import { IPaperSource, PaperSourceFactory } from "../model/paperSource";
import { IAuthor, AuthorFactory } from "../model/author";
import { CurrentUser, CurrentUserFactory } from "../model/currentUser";

export const RAW = {
  AUTHOR: require("./author.json") as IAuthor,
  COMMENT: require("./comment.json") as IComment,
  CURRENT_USER: require("./currentUser.json") as CurrentUser,
  FOS: require("./fos.json") as IFos,
  JOURNAL: require("./journal.json") as IJournal,
  MEMBER: require("./member.json") as IMember,
  PAPER: require("./paper.json") as Paper,
  PAPER_SOURCE: require("./paperSource.json") as IPaperSource,
  WALLET: require("./wallet.json") as IWallet,
};

export const RECORD = {
  AUTHOR: AuthorFactory(RAW.AUTHOR),
  COMMENT: recordifyComment(RAW.COMMENT),
  CURRENT_USER: CurrentUserFactory(RAW.CURRENT_USER),
  FOS: FosFactory(RAW.FOS),
  JOURNAL: JournalFactory(RAW.JOURNAL),
  MEMBER: recordifyMember(RAW.MEMBER),
  PAPER: PaperFactory(RAW.PAPER),
  PAPER_SOURCE: PaperSourceFactory(RAW.PAPER_SOURCE),
  WALLET: WalletFactory(RAW.WALLET),
};
