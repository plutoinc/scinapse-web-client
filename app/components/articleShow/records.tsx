import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IArticleShowState {
  isLoading: boolean;
  hasError: boolean;
}

export interface IArticleShowStateRecord extends TypedRecord<IArticleShowStateRecord>, IArticleShowState {}

const initialSignInState = {
  isLoading: false,
  hasError: false,
};

export const ArticleShowFactory = makeTypedFactory<IArticleShowState, IArticleShowStateRecord>(initialSignInState);

export const ARTICLE_SHOW_INITIAL_STATE = ArticleShowFactory();
