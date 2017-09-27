jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { ILayoutStateRecord, LAYOUT_INITIAL_STATE } from "../records";

function reduceState(action: any, state: ILayoutStateRecord = LAYOUT_INITIAL_STATE) {
  return reducer(state, action);
}

describe("Layout reducer", () => {
  let mockAction: any;
  let mockState: ILayoutStateRecord;
  let state: ILayoutStateRecord;

  describe("when it receive HEADER_REACH_SCROLL_TOP", () => {
    it("should isTop be true", () => {
      mockState = LAYOUT_INITIAL_STATE.set("isTop", false);
      mockAction = {
        type: ACTION_TYPES.HEADER_REACH_SCROLL_TOP,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isTop).toBeTruthy();
    });
  });

  describe("when receive HEADER_LEAVE_SCROLL_TOP", () => {
    it("should isTop be Falsy", () => {
      mockState = LAYOUT_INITIAL_STATE.set("isTop", true);

      mockAction = {
        type: ACTION_TYPES.HEADER_LEAVE_SCROLL_TOP,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isTop).toBeFalsy();
    });
  });
});
