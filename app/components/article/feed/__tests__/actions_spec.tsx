jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../../actions/actionTypes";

describe("sign in actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("toggleModal Action", () => {
    it("should return ARTICLE_FEED_TOGGLE_MODAL action", () => {
      store.dispatch(Actions.toggleModal());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_FEED_TOGGLE_MODAL
      });
    });
  });
});
