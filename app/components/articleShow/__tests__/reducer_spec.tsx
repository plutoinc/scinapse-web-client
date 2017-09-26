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
});
