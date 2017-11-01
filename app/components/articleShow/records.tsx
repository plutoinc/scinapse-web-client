import { List } from "immutable";
import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IEvaluationCommentsState extends IBasicAsyncState {
  evaluationId: number;
  commentIdsToShow: number[];
}

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
  currentStep: ARTICLE_EVALUATION_STEP;
  myOriginalityScore: number | null;
  myOriginalityComment: string;
  mySignificanceScore: number | null;
  mySignificanceComment: string;
  myValidityScore: number | null;
  myValidityComment: string;
  myOrganizationScore: number | null;
  myOrganizationComment: string;
  commentStates: List<IEvaluationCommentsState>;
  isAuthorListOpen: boolean;
}

export interface IArticleShowStateRecord extends TypedRecord<IArticleShowStateRecord>, IArticleShowState {}

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
  currentStep: ARTICLE_EVALUATION_STEP.FIRST,
  myOriginalityScore: null,
  myOriginalityComment: "",
  mySignificanceScore: null,
  mySignificanceComment: "",
  myValidityScore: null,
  myValidityComment: "",
  myOrganizationScore: null,
  myOrganizationComment: "",
  commentStates: List(),
  isAuthorListOpen: false,
};

export const ArticleShowStateFactory = makeTypedFactory<IArticleShowState, IArticleShowStateRecord>(
  initialArticleShowState,
);

export const ARTICLE_SHOW_INITIAL_STATE = ArticleShowStateFactory();
