import { TypedRecord, makeTypedFactory } from "typed-immutable-record";
import { IArticlesRecord } from "../../model/article";
import { List } from "immutable";

export interface IArticleSearchState {
  isLoading: boolean;
  hasError: boolean;
  searchInput: string;
  searchItemsToShow: IArticlesRecord;
  page: number;
  isEnd: boolean;
}

export interface IArticleSearchStateRecord extends TypedRecord<IArticleSearchStateRecord>, IArticleSearchState {}

const initialArticleSearchState: IArticleSearchState = {
  isLoading: false,
  hasError: false,
  searchInput: "",
  searchItemsToShow: List(),
  page: 0,
  isEnd: false,
};

export const ArticleSearchStateFactory = makeTypedFactory<IArticleSearchState, IArticleSearchStateRecord>(
  initialArticleSearchState
);

export const ARTICLE_SEARCH_INITIAL_STATE = ArticleSearchStateFactory();
