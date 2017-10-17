jest.unmock("../actions");
jest.mock("../../../../api/auth");

import * as Actions from "../actions";
import { generateMockStore } from "../../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import { MY_PAGE_CATEGORY_TYPE } from "../records";

describe("myPage actions", () => {
  let store: any;

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("changeCategory action", () => {
    it("should return MY_PAGE_CATEGORY_TYPE action with ARTICLE Category", () => {
      const mockCategory = MY_PAGE_CATEGORY_TYPE.ARTICLE;

      store.dispatch(Actions.changeCategory(mockCategory));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.MY_PAGE_CHANGE_CATEGORY,
        payload: {
          category: mockCategory,
        },
      });
    });
  });
});
