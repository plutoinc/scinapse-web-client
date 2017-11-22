import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IArticleSearchState {
  isLoading: boolean;
  hasError: boolean;
  searchInput: string;
}

export interface IArticleSearchStateRecord extends TypedRecord<IArticleSearchStateRecord>, IArticleSearchState {}

const initialArticleSearchState: IArticleSearchState = {
  isLoading: false,
  hasError: false,
  searchInput: ""
};

export const ArticleSearchStateFactory = makeTypedFactory<IArticleSearchState, IArticleSearchStateRecord>(
  initialArticleSearchState
);

export const ARTICLE_SEARCH_INITIAL_STATE = ArticleSearchStateFactory();
