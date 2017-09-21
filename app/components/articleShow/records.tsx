import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IArticleShowState {
  isLoading: boolean;
  hasError: boolean;
  isPeerEvaluationOpen: boolean;
  evaluationTab: ARTICLE_EVALUATION_TAB;
  currentStep: ARTICLE_EVALUATION_STEP;
  myOriginalityScore: number | null;
  myOriginalityComment: string;
  myContributionScore: number | null;
  myContributionComment: string;
  myAnalysisScore: number | null;
  myAnalysisComment: string;
  myExpressivenessScore: number | null;
  myExpressivenessComment: string;
}

export interface IArticleShowStateRecord extends TypedRecord<IArticleShowStateRecord>, IArticleShowState {}

export enum ARTICLE_EVALUATION_TAB {
  PEER,
  MY,
}

export enum ARTICLE_EVALUATION_STEP {
  FIRST,
  SECOND,
  THIRD,
  FOURTH,
  FINAL,
}

const initialSignInState: IArticleShowState = {
  isLoading: false,
  hasError: false,
  isPeerEvaluationOpen: false,
  evaluationTab: ARTICLE_EVALUATION_TAB.PEER,
  currentStep: ARTICLE_EVALUATION_STEP.FIRST,
  myOriginalityScore: null,
  myOriginalityComment: "",
  myContributionScore: null,
  myContributionComment: "",
  myAnalysisScore: null,
  myAnalysisComment: "",
  myExpressivenessScore: null,
  myExpressivenessComment: "",
};

export const ArticleShowFactory = makeTypedFactory<IArticleShowState, IArticleShowStateRecord>(initialSignInState);

export const ARTICLE_SHOW_INITIAL_STATE = ArticleShowFactory();
