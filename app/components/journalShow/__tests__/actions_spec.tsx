import * as Actions from "../actions";
import { MockStore } from "redux-mock-store";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";

describe("Journal Show actions spec", () => {
  let store: MockStore<{}>;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("getJournal Action", () => {
    it("should return JOURNAL_SHOW_START_TO_GET_JOURNAL", async () => {
      await store.dispatch(Actions.getJournal(2764552960));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_JOURNAL,
      });
    });
  });
});
