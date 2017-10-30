jest.unmock("../records");

import { List } from "immutable";
import { ARTICLE_EVALUATION_TAB, ARTICLE_EVALUATION_STEP } from "../records";
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
        expect(state.isEvaluationSubmitLoading).toBeFalsy();
      });

      it("should have param's hasError value", () => {
        expect(state.hasError).toBeFalsy();
      });

      it("should have param's hasEvaluationSubmitError value", () => {
        expect(state.hasEvaluationSubmitError).toBeFalsy();
      });

      it("should have param's evaluationCommentIsLoading value", () => {
        expect(state.evaluationCommentIsLoading).toBeFalsy();
      });

      it("should have param's evaluationCommentHasError value", () => {
        expect(state.evaluationCommentHasError).toBeFalsy();
      });

      it("should have param's peerEvaluationId value", () => {
        expect(state.peerEvaluationId).toBeNull();
      });

      it("should have param's evaluationTab value", () => {
        expect(state.evaluationTab).toEqual(ARTICLE_EVALUATION_TAB.MY);
      });

      it("should have param's currentStep value", () => {
        expect(state.currentStep).toEqual(ARTICLE_EVALUATION_STEP.FIRST);
      });

      it("should have param's myOriginalityScore value", () => {
        expect(state.myOriginalityScore).toBeNull();
      });

      it("should have param's myOriginalityComment value", () => {
        expect(state.myOriginalityComment).toEqual("");
      });

      it("should have param's mySignificanceScore value", () => {
        expect(state.mySignificanceScore).toBeNull();
      });

      it("should have param's mySignificanceComment value", () => {
        expect(state.mySignificanceComment).toEqual("");
      });

      it("should have param's myValidityScore value", () => {
        expect(state.myValidityScore).toBeNull();
      });

      it("should have param's myValidityComment value", () => {
        expect(state.myValidityComment).toEqual("");
      });

      it("should have param's myOriginalityScore value", () => {
        expect(state.myOrganizationScore).toBeNull();
      });

      it("should have param's myOrganizationComment value", () => {
        expect(state.myOrganizationComment).toEqual("");
      });

      it("should have param's isAuthorListOpen value", () => {
        expect(state.isAuthorListOpen).toBeFalsy();
      });
    });
  });
});
