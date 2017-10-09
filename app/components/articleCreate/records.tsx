import { List } from "immutable";
import { TypedRecord, makeTypedFactory } from "typed-immutable-record";
import { recordifyAuthor, IAuthorRecord, IAuthor } from "../../model/author";

export interface IArticleCreateState {
  isLoading: boolean;
  hasError: boolean;
  currentStep: ARTICLE_CREATE_STEP;
  isArticleCategoryDropDownOpen: boolean;
  articleCategory: ARTICLE_CATEGORY | null;
  articleLink: string;
  articleTitle: string;
  authors: List<IAuthorRecord>;
  abstract: string;
  note: string;
  errorType: ARTICLE_CREATE_ERROR_TYPE | null;
  errorContent: string;
  authorInputErrorIndex: number | null;
  authorInputErrorType: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE | null;
  validEachStep: List<boolean>;
}

export type ARTICLE_CREATE_ERROR_TYPE = "articleCategory" | "articleLink" | "articleTitle" | "authorInput" | "abstract";

export type ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "name" | "institution";

export const AUTHOR_NAME_TYPE: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "name";

export const AUTHOR_INSTITUTION_TYPE: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "institution";

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
  articleLink: "https://",
  articleTitle: "",
  authors: List([initialAuthorRecord]),
  abstract: "",
  note: "",
  errorType: null,
  errorContent: null,
  authorInputErrorIndex: null,
  authorInputErrorType: null,
  validEachStep: List([false, false, true]),
};

export const ArticleCreateFactory = makeTypedFactory<IArticleCreateState, IArticleCreateStateRecord>(
  initialArticleCreateState,
);

export const ARTICLE_CREATE_INITIAL_STATE = ArticleCreateFactory();
