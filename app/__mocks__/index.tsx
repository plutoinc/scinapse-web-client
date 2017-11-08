import { IArticle, recordifyArticle } from "../model/article";
import { IWallet, WalletFactory } from "../model/wallet";
import { IAuthor, recordifyAuthor } from "../model/author";
import { IMember, recordifyMember } from "../model/member";
import { IArticlePoint, ArticlePointFactory } from "../model/articlePoint";
import { IComment, recordifyComment } from "../model/comment";
import { IReviewPoint, ReviewPointFactory } from "../model/reviewPoint";
import { IReview, recordifyReview } from "../model/review";

export const RAW = {
  ARTICLE: require("./article.json") as IArticle,
  ARTICLE_POINT: require("./articlePoint.json") as IArticlePoint,
  AUTHOR: require("./author.json") as IAuthor,
  COMMENT: require("./comment.json") as IComment,
  REVIEW: require("./review.json") as IReview,
  REVIEW_POINT: require("./reviewPoint.json") as IReviewPoint,
  MEMBER: require("./member.json") as IMember,
  WALLET: require("./wallet.json") as IWallet,
};

export const RECORD = {
  ARTICLE: recordifyArticle(RAW.ARTICLE),
  ARTICLE_POINT: ArticlePointFactory(RAW.ARTICLE_POINT),
  AUTHOR: recordifyAuthor(RAW.AUTHOR),
  COMMENT: recordifyComment(RAW.COMMENT),
  REVIEW: recordifyReview(RAW.REVIEW),
  REVIEW_POINT: ReviewPointFactory(RAW.REVIEW_POINT),
  MEMBER: recordifyMember(RAW.MEMBER),
  WALLET: WalletFactory(RAW.WALLET),
};
