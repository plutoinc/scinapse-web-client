import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IArticleDetail {
  abstract: string;
  articleId: number;
  authors: IAuthor[] | null;
  createdAt: string;
  createdBy: IMember | null;
  evaluations: IEvaluation[] | null;
  link: string;
  point: IPoint | null;
  source: string;
  title: string;
  type: string;
}

export interface IArticleStateRecord extends TypedRecord<IArticleStateRecord>, IArticleDetail {}

export const initialArticleState: IArticleDetail = {
  abstract: "",
  articleId: 0,
  authors: null,
  createdAt: "",
  createdBy: null,
  evaluations: null,
  link: "",
  point: null,
  source: "",
  title: "",
  type: "",
};

export const ArticleStateFactory = makeTypedFactory<IArticleDetail, IArticleStateRecord>(initialArticleState);

export const CURRENT_USER_INITIAL_STATE = ArticleStateFactory();

export interface IComment {
  comment: string;
  createdAt: string;
  createdBy: IMember;
}

export interface IPoint {
  analysis: number;
  analysisComment: string;
  contribution: number;
  contributionComment: string;
  expressiveness: string;
  originality: number;
  originalityComment: string;
  total: number;
}

export interface IEvaluation {
  comments: IComment[];
  createdAt: string;
  createdBy: IMember;
  like: number;
  point: IPoint;
}

export interface IMember {
  email: string;
  fullName: string;
  memberId: number;
  wallet?: {
    walletId: number;
    address: string;
  };
}

export interface IAuthor {
  organization: string;
  name: string;
  member: IMember;
}
