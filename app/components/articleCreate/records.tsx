import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IArticleCreateState {
  isLoading: boolean;
  hasError: boolean;
  currentStep: ARTICLE_CREATE_STEP;
}

export interface IArticleCreateStateRecord extends TypedRecord<IArticleCreateStateRecord>, IArticleCreateState {}

export enum ARTICLE_CREATE_STEP {
  FIRST,
  SECOND,
  FINAL,
}

const initialArticleCreateState: IArticleCreateState = {
  isLoading: false,
  hasError: false,
  currentStep: ARTICLE_CREATE_STEP.FIRST,
};

export const ArticleCreateFactory = makeTypedFactory<IArticleCreateState, IArticleCreateStateRecord>(
  initialArticleCreateState,
);

export const ARTICLE_CREATE_INITIAL_STATE = ArticleCreateFactory();
