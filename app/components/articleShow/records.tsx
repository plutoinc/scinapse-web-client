import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IArticleShowState {
  isLoading: boolean;
  isEvaluationLoading: boolean;
  hasEvaluationError: boolean;
  hasError: boolean;
  evaluationCommentIsLoading: boolean;
  evaluationCommentHasError: boolean;
  peerEvaluationId: number | null;
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

const initialArticleShowState: IArticleShowState = {
  isLoading: false,
  isEvaluationLoading: false,
  hasError: false,
  hasEvaluationError: false,
  evaluationCommentIsLoading: false,
  evaluationCommentHasError: false,
  peerEvaluationId: null,
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

export const ArticleShowFactory = makeTypedFactory<IArticleShowState, IArticleShowStateRecord>(initialArticleShowState);

export const ARTICLE_SHOW_INITIAL_STATE = ArticleShowFactory();
