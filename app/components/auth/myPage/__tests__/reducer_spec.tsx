jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import { IMyPageStateRecord, MY_PAGE_INITIAL_STATE, MY_PAGE_CATEGORY_TYPE } from "../records";

function reduceState(action: any, state: IMyPageStateRecord = MY_PAGE_INITIAL_STATE) {
  return reducer(state, action);
}

describe("MyPage reducer", () => {
  let mockAction: any;
  let state: IMyPageStateRecord;

  describe("when receive MY_PAGE_CHANGE_CATEGORY", () => {
    it("should set category following payload", () => {
      const mockCategory = MY_PAGE_CATEGORY_TYPE.ARTICLE;

      mockAction = {
        type: ACTION_TYPES.MY_PAGE_CHANGE_CATEGORY,
        payload: {
          category: mockCategory,
        },
      };

      state = reduceState(mockAction);

      expect(state.category).toEqual(mockCategory);
    });
  });
});
