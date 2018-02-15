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

  describe("when receive SET_DEVICE_TO_DESKTOP", () => {
    it("should set state to state", () => {
      mockState = LAYOUT_INITIAL_STATE.set("isMobile", true);
      mockAction = {
        type: ACTION_TYPES.SET_DEVICE_TO_DESKTOP,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isMobile).toBeFalsy();
    });
  });

  describe("when receive SET_DEVICE_TO_MOBILE", () => {
    it("should set state to state", () => {
      mockState = LAYOUT_INITIAL_STATE.set("isMobile", false);
      mockAction = {
        type: ACTION_TYPES.SET_DEVICE_TO_MOBILE,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isMobile).toBeTruthy();
    });
  });
});
