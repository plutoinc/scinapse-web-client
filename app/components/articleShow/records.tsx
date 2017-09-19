import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IArticleShowState {
  isLoading: boolean;
  hasError: boolean;
  evaluationTab: ARTICLE_EVALUATION_TAB;
}

export interface IArticleShowStateRecord extends TypedRecord<IArticleShowStateRecord>, IArticleShowState {}

export enum ARTICLE_EVALUATION_TAB {
  PEER,
  MY,
}

const initialSignInState = {
  isLoading: false,
  hasError: false,
  evaluationTab: ARTICLE_EVALUATION_TAB.MY,
};

export const ArticleShowFactory = makeTypedFactory<IArticleShowState, IArticleShowStateRecord>(initialSignInState);

export const ARTICLE_SHOW_INITIAL_STATE = ArticleShowFactory();
