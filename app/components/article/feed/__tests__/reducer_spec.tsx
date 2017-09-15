jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import {
  IArticleFeedStateRecord,
  ARTICLE_FEED_INITIAL_STATE
} from "../records";

function reduceState(
  action: any,
  state: IArticleFeedStateRecord = ARTICLE_FEED_INITIAL_STATE
) {
  return reducer(state, action);
}

describe("ArticleFeed reducer", () => {
  let mockAction: any;
  let state: IArticleFeedStateRecord;

  describe("when receive ARTICLE_FEED_TOGGLE_MODAL", () => {
    it("should isModalOpen to true When isModalOpen is default", () => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_FEED_TOGGLE_MODAL
      };

      state = reduceState(mockAction);

      expect(state.isModalOpen).toBeTruthy();
    });

    it("should isModalOpen to false When isModalOpen is true", () => {
      const mockState = ARTICLE_FEED_INITIAL_STATE.set("isModalOpen", true);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_FEED_TOGGLE_MODAL
      };

      state = reduceState(mockAction, mockState);

      expect(state.isModalOpen).toBeFalsy();
    });
  });
});
