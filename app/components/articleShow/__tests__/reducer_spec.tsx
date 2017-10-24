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
  let mockPeerEvaluationId: string = "2017-09-25T09:57:05.6260";
  describe("when receive ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT", () => {
    it("should set mockPeerEvaluationId to be payload Id", () => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT,
        payload: {
          peerEvaluationId: mockPeerEvaluationId,
        },
      };

      state = reduceState(mockAction);

      expect(state.peerEvaluationId).toEqual(mockPeerEvaluationId);
    });
  });

  describe("when receive ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT while peerEvaluationId is same with payload id", () => {
    it("should set peerEvaluationId to null", () => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("peerEvaluationId", mockPeerEvaluationId);
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_TOGGLE_PEER_EVALUATION_COMPONENT,
        payload: {
          peerEvaluationId: mockPeerEvaluationId,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.peerEvaluationId).toBeNull();
    });
  });

  describe("when receive ARTICLE_SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("evaluationCommentHasError", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_PEER_EVALUATION_COMMENT_SUBMIT,
      };
    });

    it("should set evaluationCommentIsLoading state to true", () => {
      state = reduceState(mockAction, mockState);

      expect(state.evaluationCommentIsLoading).toBeTruthy();
    });

    it("should set evaluationCommentHasError state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.evaluationCommentHasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SHOW_FAILED_TO_PEER_EVALUATION_COMMENT_SUBMIT", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("evaluationCommentIsLoading", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_PEER_EVALUATION_COMMENT_SUBMIT,
      };
    });

    it("should set evaluationCommentIsLoading state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.evaluationCommentIsLoading).toBeFalsy();
    });

    it("should set evaluationCommentHasError state to true", () => {
      state = reduceState(mockAction, mockState);

      expect(state.evaluationCommentHasError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SHOW_SUCCEEDED_TO_PEER_EVALUATION_COMMENT_SUBMIT", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("evaluationCommentHasError", true).set(
        "evaluationCommentIsLoading",
        true,
      );

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_PEER_EVALUATION_COMMENT_SUBMIT,
      };
    });

    it("should set evaluationCommentIsLoading state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.evaluationCommentIsLoading).toBeFalsy();
    });

    it("should set evaluationCommentHasError state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.evaluationCommentHasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SHOW_START_TO_SUBMIT_EVALUATION", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("hasEvaluationSubmitError", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_START_TO_SUBMIT_EVALUATION,
      };
    });

    it("should set isEvaluationSubmitLoading state to true", () => {
      state = reduceState(mockAction, mockState);

      expect(state.isEvaluationSubmitLoading).toBeTruthy();
    });

    it("should set hasEvaluationSubmitError state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.hasEvaluationSubmitError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SHOW_FAILED_TO_SUBMIT_EVALUATION", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("isEvaluationSubmitLoading", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_FAILED_TO_SUBMIT_EVALUATION,
      };
    });

    it("should set isEvaluationSubmitLoading state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.isEvaluationSubmitLoading).toBeFalsy();
    });

    it("should set hasEvaluationSubmitError state to true", () => {
      state = reduceState(mockAction, mockState);

      expect(state.hasEvaluationSubmitError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION", () => {
    beforeEach(() => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("hasEvaluationSubmitError", true).set(
        "isEvaluationSubmitLoading",
        true,
      );

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_SUBMIT_EVALUATION,
      };
    });

    it("should set isEvaluationSubmitLoading state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.isEvaluationSubmitLoading).toBeFalsy();
    });

    it("should set hasEvaluationSubmitError state to false", () => {
      state = reduceState(mockAction, mockState);

      expect(state.hasEvaluationSubmitError).toBeFalsy();
    });
  });
});
