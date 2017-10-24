import { List } from "immutable";
import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IArticleShowState {
  evaluationPage: number;
  evaluationIsEnd: boolean;
  isLoading: boolean;
  isEvaluationSubmitLoading: boolean;
  isEvaluationLoading: boolean;
  hasEvaluationSubmitError: boolean;
  hasEvaluationError: boolean;
  evaluationIdsToShow: List<number>;
  hasError: boolean;
  evaluationCommentIsLoading: boolean;
  evaluationCommentHasError: boolean;
  peerEvaluationId: number | null;
  evaluationTab: ARTICLE_EVALUATION_TAB;
  currentStep: ARTICLE_EVALUATION_STEP;
  myOriginalityScore: number | null;
  myOriginalityComment: string;
  mySignificanceScore: number | null;
  mySignificanceComment: string;
  myValidityScore: number | null;
  myValidityComment: string;
  myOrganizationScore: number | null;
  myOrganizationComment: string;
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
  evaluationPage: 0,
  evaluationIsEnd: false,
  isLoading: false,
  isEvaluationSubmitLoading: false,
  isEvaluationLoading: false,
  evaluationIdsToShow: List(),
  hasError: false,
  hasEvaluationSubmitError: false,
  hasEvaluationError: false,
  evaluationCommentIsLoading: false,
  evaluationCommentHasError: false,
  peerEvaluationId: null,
  evaluationTab: ARTICLE_EVALUATION_TAB.MY,
  currentStep: ARTICLE_EVALUATION_STEP.FIRST,
  myOriginalityScore: null,
  myOriginalityComment: "",
  mySignificanceScore: null,
  mySignificanceComment: "",
  myValidityScore: null,
  myValidityComment: "",
  myOrganizationScore: null,
  myOrganizationComment: "",
};

export const ArticleShowStateFactory = makeTypedFactory<IArticleShowState, IArticleShowStateRecord>(
  initialArticleShowState,
);

export const ARTICLE_SHOW_INITIAL_STATE = ArticleShowStateFactory();
