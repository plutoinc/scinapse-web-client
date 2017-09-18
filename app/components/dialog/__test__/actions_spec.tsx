jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";

describe("sign in actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("toggle Dialog Action", () => {
    it("should return DIALOG_OPEN action", () => {
      store.dispatch(Actions.openSignIn());
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.GLOBAL_DIALOG_OPEN,
      });
    });
    it("should return DIALOG_CLOSE action", () => {
      store.dispatch(Actions.openSignIn());
      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: ACTION_TYPES.GLOBAL_DIALOG_CLOSE,
      });
    });
  });
});
