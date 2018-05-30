import { IWallet } from "../model/wallet";
import { Member } from "../model/member";
import { Comment } from "../model/comment";
import { Fos } from "../model/fos";
import { IJournal } from "../model/journal";
import { Paper } from "../model/paper";
import { IPaperSource } from "../model/paperSource";
import { PaperAuthor } from "../model/author";
import { CurrentUser } from "../model/currentUser";

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
