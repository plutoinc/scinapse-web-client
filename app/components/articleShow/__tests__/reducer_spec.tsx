jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { IArticleShowStateRecord, ARTICLE_SHOW_INITIAL_STATE } from "../records";
import { ACTION_TYPES } from "../../../actions/actionTypes";

function reduceState(action: any, state: IArticleShowStateRecord = ARTICLE_SHOW_INITIAL_STATE) {
  return reducer(state, action);
}

describe("ArticleShow reducer", () => {
  let mockAction: any;
  let mockState: IArticleShowStateRecord;
  let state: IArticleShowStateRecord;
  let mockPeerReviewId: string = "2017-09-25T09:57:05.6260";
  describe("when receive ARTICLE_SHOW_TOGGLE_PEER_REVIEW_COMPONENT", () => {
    it("should set mockPeerReviewId to be payload Id", () => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_REVIEW_COMPONENT,
        payload: {
          peerReviewId: mockPeerReviewId,
        },
      };

      state = reduceState(mockAction);

      expect(state.peerReviewId).toEqual(mockPeerReviewId);
    });
  });

  describe("when receive ARTICLE_SHOW_TOGGLE_PEER_REVIEW_COMPONENT while peerReviewId is same with payload id", () => {
    it("should set peerReviewId to null", () => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("peerReviewId", mockPeerReviewId);
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_REVIEW_COMPONENT,
        payload: {
          peerReviewId: mockPeerReviewId,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.peerReviewId).toBeNull();
    });
  });

  describe("when receive ARTICLE_SHOW_START_TO_PEER_REVIEW_COMMENT_SUBMIT", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("reviewCommentHasError", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_REVIEW_COMMENT_SUBMIT,
      };
    });

    it("should set reviewCommentIsLoading state to true", () => {
      state = reduceState(mockAction, mockState);

      expect(state.reviewCommentIsLoading).toBeTruthy();
    });

    it("should set reviewCommentHasError state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.reviewCommentHasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SHOW_FAILED_TO_PEER_REVIEW_COMMENT_SUBMIT", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("reviewCommentIsLoading", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_PEER_REVIEW_COMMENT_SUBMIT,
      };
    });

    it("should set reviewCommentIsLoading state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.reviewCommentIsLoading).toBeFalsy();
    });

    it("should set reviewCommentHasError state to true", () => {
      state = reduceState(mockAction, mockState);

      expect(state.reviewCommentHasError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SHOW_SUCCEEDED_TO_PEER_REVIEW_COMMENT_SUBMIT", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("reviewCommentHasError", true).set("reviewCommentIsLoading", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_PEER_REVIEW_COMMENT_SUBMIT,
      };
    });

    it("should set reviewCommentIsLoading state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.reviewCommentIsLoading).toBeFalsy();
    });

    it("should set reviewCommentHasError state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.reviewCommentHasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SHOW_START_TO_SUBMIT_REVIEW", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("hasReviewSubmitError", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_REVIEW,
      };
    });

    it("should set isReviewSubmitLoading state to true", () => {
      state = reduceState(mockAction, mockState);

      expect(state.isReviewSubmitLoading).toBeTruthy();
    });

    it("should set hasReviewSubmitError state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.hasReviewSubmitError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SHOW_FAILED_TO_SUBMIT_REVIEW", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("isReviewSubmitLoading", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_REVIEW,
      };
    });

    it("should set isReviewSubmitLoading state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.isReviewSubmitLoading).toBeFalsy();
    });

    it("should set hasReviewSubmitError state to true", () => {
      state = reduceState(mockAction, mockState);

      expect(state.hasReviewSubmitError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SHOW_SUCCEEDED_SUBMIT_REVIEW", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("hasReviewSubmitError", true).set("isReviewSubmitLoading", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_REVIEW,
      };
    });

    it("should set isReviewSubmitLoading state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.isReviewSubmitLoading).toBeFalsy();
    });

    it("should set hasReviewSubmitError state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.hasReviewSubmitError).toBeFalsy();
    });
  });
});
