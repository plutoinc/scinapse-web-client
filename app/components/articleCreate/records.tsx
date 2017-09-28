import { TypedRecord, makeTypedFactory } from "typed-immutable-record";
import { IAuthor, initialAuthor } from "../../model/author";

export interface IArticleCreateState {
  isLoading: boolean;
  hasError: boolean;
  currentStep: ARTICLE_CREATE_STEP;
  isArticleCategoryDropDownOpen: boolean;
  articleCategory: ARTICLE_CATEGORY | null;
  authors: IAuthor[];
}

export interface IArticleCreateStateRecord extends TypedRecord<IArticleCreateStateRecord>, IArticleCreateState {}

export enum ARTICLE_CREATE_STEP {
  FIRST,
  SECOND,
  FINAL,
}
export type ARTICLE_CATEGORY = "Post Paper" | "Pre Paper" | "White Paper" | "Tech Blog";

const initialArticleCreateState: IArticleCreateState = {
  isLoading: false,
  hasError: false,
  currentStep: ARTICLE_CREATE_STEP.FIRST,
  isArticleCategoryDropDownOpen: false,
  articleCategory: null,
  authors: [initialAuthor],
};

export const ArticleCreateFactory = makeTypedFactory<IArticleCreateState, IArticleCreateStateRecord>(
  initialArticleCreateState,
);

export const ARTICLE_CREATE_INITIAL_STATE = ArticleCreateFactory();
