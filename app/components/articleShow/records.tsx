import { List } from "immutable";
import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IReviewCommentsState extends IBasicAsyncState {
  reviewId: number;
  commentIdsToShow: number[];
}

export interface IArticleShowState {
  reviewPage: number;
  reviewIsEnd: boolean;
  isLoading: boolean;
  isReviewSubmitLoading: boolean;
  isReviewLoading: boolean;
  hasReviewSubmitError: boolean;
  hasReviewError: boolean;
  reviewIdsToShow: List<number>;
  hasError: boolean;
  reviewCommentIsLoading: boolean;
  reviewCommentHasError: boolean;
  peerReviewId: number | null;
  currentStep: ARTICLE_REVIEW_STEP;
  myOriginalityScore: number | null;
  mySignificanceScore: number | null;
  myValidityScore: number | null;
  myOrganizationScore: number | null;
  reviewInput: string;
  commentStates: List<IReviewCommentsState>;
  isAuthorListOpen: boolean;
}

export interface IArticleShowStateRecord extends TypedRecord<IArticleShowStateRecord>, IArticleShowState {}

export enum ARTICLE_REVIEW_STEP {
  FIRST,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH,
  FINAL,
}

const initialArticleShowState: IArticleShowState = {
  reviewPage: 0,
  reviewIsEnd: false,
  isLoading: false,
  isReviewSubmitLoading: false,
  isReviewLoading: false,
  reviewIdsToShow: List(),
  hasError: false,
  hasReviewSubmitError: false,
  hasReviewError: false,
  reviewCommentIsLoading: false,
  reviewCommentHasError: false,
  peerReviewId: null,
  currentStep: ARTICLE_REVIEW_STEP.FIRST,
  myOriginalityScore: null,
  mySignificanceScore: null,
  myValidityScore: null,
  myOrganizationScore: null,
  reviewInput: "",
  commentStates: List(),
  isAuthorListOpen: false,
};

export const ArticleShowStateFactory = makeTypedFactory<IArticleShowState, IArticleShowStateRecord>(
  initialArticleShowState,
);

export const ARTICLE_SHOW_INITIAL_STATE = ArticleShowStateFactory();
