jest.unmock("../records");

import { List } from "immutable";
import { ARTICLE_REVIEW_STEP } from "../records";
import {
  ArticleShowStateFactory,
  IArticleShowStateRecord,
  IArticleShowState,
  ARTICLE_SHOW_INITIAL_STATE,
} from "../records";

describe("ArticleShow records", () => {
  describe("ArticleShowStateFactory function", () => {
    let state: IArticleShowStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = ArticleShowStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(ARTICLE_SHOW_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      beforeEach(() => {
        const jsState: IArticleShowState = {
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

        state = ArticleShowStateFactory(jsState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should have param's isLoading value", () => {
        expect(state.isLoading).toBeFalsy();
      });

      it("should have param's isEvaluationSubmitLoading value", () => {
        expect(state.isReviewSubmitLoading).toBeFalsy();
      });

      it("should have param's hasError value", () => {
        expect(state.hasError).toBeFalsy();
      });

      it("should have param's hasEvaluationSubmitError value", () => {
        expect(state.hasReviewSubmitError).toBeFalsy();
      });

      it("should have param's evaluationCommentIsLoading value", () => {
        expect(state.reviewCommentIsLoading).toBeFalsy();
      });

      it("should have param's evaluationCommentHasError value", () => {
        expect(state.reviewCommentHasError).toBeFalsy();
      });

      it("should have param's peerEvaluationId value", () => {
        expect(state.peerReviewId).toBeNull();
      });

      it("should have param's currentStep value", () => {
        expect(state.currentStep).toEqual(ARTICLE_REVIEW_STEP.FIRST);
      });

      it("should have param's myOriginalityScore value", () => {
        expect(state.myOriginalityScore).toBeNull();
      });

      it("should have param's mySignificanceScore value", () => {
        expect(state.mySignificanceScore).toBeNull();
      });

      it("should have param's myValidityScore value", () => {
        expect(state.myValidityScore).toBeNull();
      });

      it("should have param's myOriginalityScore value", () => {
        expect(state.myOrganizationScore).toBeNull();
      });

      it("should have param's isAuthorListOpen value", () => {
        expect(state.isAuthorListOpen).toBeFalsy();
      });
    });
  });
});
