import { TypedRecord, makeTypedFactory } from "typed-immutable-record";
import { recordifyAuthor, IAuthorRecord, IAuthor } from "../../model/author";
import { List } from "immutable";

export interface IArticleCreateState {
  isLoading: boolean;
  hasError: boolean;
  currentStep: ARTICLE_CREATE_STEP;
  isArticleCategoryDropDownOpen: boolean;
  articleCategory: ARTICLE_CATEGORY | null;
  authors: List<IAuthorRecord>;
  abstract: string;
}

export interface IArticleCreateStateRecord extends TypedRecord<IArticleCreateStateRecord>, IArticleCreateState {}

export enum ARTICLE_CREATE_STEP {
  FIRST,
  SECOND,
  FINAL,
}
export type ARTICLE_CATEGORY = "Post Paper" | "Pre Paper" | "White Paper" | "Tech Blog";

export const initialAuthor: IAuthor = {
  organization: "",
  name: "",
  member: null,
};

export const initialAuthorRecord = recordifyAuthor(initialAuthor);

const initialArticleCreateState: IArticleCreateState = {
  isLoading: false,
  hasError: false,
  currentStep: ARTICLE_CREATE_STEP.FIRST,
  isArticleCategoryDropDownOpen: false,
  articleCategory: null,
  authors: List([initialAuthorRecord]),
  abstract: "",
};

export const ArticleCreateFactory = makeTypedFactory<IArticleCreateState, IArticleCreateStateRecord>(
  initialArticleCreateState,
);

export const ARTICLE_CREATE_INITIAL_STATE = ArticleCreateFactory();
