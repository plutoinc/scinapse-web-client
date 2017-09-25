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

  describe("when receive ARTICLE_SHOW_OPEN_PEER_EVALUATION_COMPONENT", () => {
    it("should set isPeerEvaluationOpen to true", () => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_OPEN_PEER_EVALUATION_COMPONENT,
      };

      state = reduceState(mockAction);

      expect(state.isPeerEvaluationOpen).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SHOW_CLOSE_PEER_EVALUATION_COMPONENT", () => {
    it("should set isPeerEvaluationOpen to false", () => {
      mockState = ARTICLE_SHOW_INITIAL_STATE.set("isPeerEvaluationOpen", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SHOW_CLOSE_PEER_EVALUATION_COMPONENT,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isPeerEvaluationOpen).toBeFalsy();
    });
  });
});
