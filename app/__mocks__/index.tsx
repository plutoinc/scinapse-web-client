import { IWallet, WalletFactory } from "../model/wallet";
import { Member, recordifyMember } from "../model/member";
import { Comment, recordifyComment, recordifyComments } from "../model/comment";
import { Fos, FosFactory } from "../model/fos";
import { IJournal, JournalFactory } from "../model/journal";
import { Paper, PaperFactory } from "../model/paper";
import { IPaperSource, PaperSourceFactory } from "../model/paperSource";
import { PaperAuthor, PaperAuthorFactory } from "../model/author";
import { CurrentUser, CurrentUserFactory } from "../model/currentUser";

export const RAW = {
  AUTHOR: require("./author.json") as PaperAuthor,
  COMMENT: require("./comment.json") as Comment,
  CURRENT_USER: require("./currentUser.json") as CurrentUser,
  FOS: require("./fos.json") as Fos,
  JOURNAL: require("./journal.json") as IJournal,
  MEMBER: require("./member.json") as Member,
  PAPER: require("./paper.json") as Paper,
  PAPER_SOURCE: require("./paperSource.json") as IPaperSource,
  WALLET: require("./wallet.json") as IWallet,
  COMMENTS_RESPONSE: require("./commentsResponse.json"),
  AGGREGATION_RESPONSE: require("./aggregation.json"),
};

export const RECORD = {
  AUTHOR: PaperAuthorFactory(RAW.AUTHOR),
  COMMENT: recordifyComment(RAW.COMMENT),
  CURRENT_USER: CurrentUserFactory(RAW.CURRENT_USER),
  FOS: FosFactory(RAW.FOS),
  JOURNAL: JournalFactory(RAW.JOURNAL),
  MEMBER: recordifyMember(RAW.MEMBER),
  PAPER: PaperFactory(RAW.PAPER),
  PAPER_SOURCE: PaperSourceFactory(RAW.PAPER_SOURCE),
  WALLET: WalletFactory(RAW.WALLET),
  COMMENTS_RESPONSE: {
    comments: recordifyComments(RAW.COMMENTS_RESPONSE.content),
    first: RAW.COMMENTS_RESPONSE.first,
    last: RAW.COMMENTS_RESPONSE.last,
    number: RAW.COMMENTS_RESPONSE.number,
    numberOfElements: RAW.COMMENTS_RESPONSE.numberOfElements,
    size: RAW.COMMENTS_RESPONSE.size,
    sort: RAW.COMMENTS_RESPONSE.sort,
    totalElements: RAW.COMMENTS_RESPONSE.totalElements,
    totalPages: RAW.COMMENTS_RESPONSE.totalPages,
  },
};
