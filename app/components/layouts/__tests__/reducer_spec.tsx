jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { LayoutState, LAYOUT_INITIAL_STATE } from "../records";

function reduceState(action: any, state: LayoutState = LAYOUT_INITIAL_STATE) {
  return reducer(state, action);
}

describe("Layout reducer", () => {
  let mockAction: any;
  let mockState: LayoutState;
  let state: LayoutState;

  describe("when receive SET_DEVICE_TO_DESKTOP", () => {
    it("should set state to state", () => {
      mockState = { ...LAYOUT_INITIAL_STATE, isMobile: true };
      mockAction = {
        type: ACTION_TYPES.SET_DEVICE_TO_DESKTOP
      };

      state = reduceState(mockAction, mockState);

      expect(state.isMobile).toBeFalsy();
    });
  });

  describe("when receive SET_DEVICE_TO_MOBILE", () => {
    it("should set state to state", () => {
      mockState = { ...LAYOUT_INITIAL_STATE, isMobile: false };
      mockAction = {
        type: ACTION_TYPES.SET_DEVICE_TO_MOBILE
      };

      state = reduceState(mockAction, mockState);

      expect(state.isMobile).toBeTruthy();
    });
  });
});
