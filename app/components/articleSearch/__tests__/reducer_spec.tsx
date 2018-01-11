jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { IArticleSearchStateRecord, ARTICLE_SEARCH_INITIAL_STATE } from "../records";

function reduceState(action: any, state: IArticleSearchStateRecord = ARTICLE_SEARCH_INITIAL_STATE) {
  return reducer(state, action);
}

describe("signIn reducer", () => {
  let mockAction: any;
  let state: IArticleSearchStateRecord;

  describe("when receive ARTICLE_SEARCH_CHANGE_SEARCH_INPUT", () => {
    it("should set searchInput following payload", () => {
      const mockSearchInput = "paper";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
        payload: {
          searchInput: mockSearchInput,
        },
      };

      state = reduceState(mockAction);

      expect(state.searchInput).toEqual(mockSearchInput);
    });
  });

  describe("when receive except action", () => {
    it("should set state to state", () => {
      mockAction = ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT;

      state = reduceState(mockAction);

      expect(state).toEqual(state);
    });
  });
});
