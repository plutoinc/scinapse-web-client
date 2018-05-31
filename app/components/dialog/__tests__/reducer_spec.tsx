jest.unmock("../reducer");

import { reducer, DialogState, DIALOG_INITIAL_STATE, GLOBAL_DIALOG_TYPE } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";

function reduceState(action: any, state: DialogState = DIALOG_INITIAL_STATE) {
  return reducer(state, action);
}

describe("dialog reducer", () => {
  let mockAction: any;
  let state: DialogState;

  describe("when GLOBAL_LOCATION_CHANGE", () => {
    it("should set isOpen to false", () => {
      mockAction = {
        type: ACTION_TYPES.GLOBAL_LOCATION_CHANGE,
      };

      state = reduceState(mockAction);

      expect(state.isOpen).toBeFalsy();
    });
  });

  describe("when receive GLOBAL_DIALOG_OPEN", () => {
    const mockType: GLOBAL_DIALOG_TYPE = GLOBAL_DIALOG_TYPE.SIGN_IN;
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.GLOBAL_DIALOG_OPEN,
        payload: {
          type: mockType,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set isOpen to true", () => {
      expect(state.isOpen).toBeTruthy();
    });

    it("should set type following payload", () => {
      expect(state.type).toEqual(mockType);
    });
  });

  describe("when receive GLOBAL_DIALOG_CLOSE", () => {
    it("should set isOpen to false", () => {
      const mockState = { ...DIALOG_INITIAL_STATE, isOpen: true };

      mockAction = {
        type: ACTION_TYPES.GLOBAL_DIALOG_CLOSE,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isOpen).toBeFalsy();
    });
  });

  describe("when receive GLOBAL_CHANGE_DIALOG_TYPE", () => {
    it("should set type following payload", () => {
      const mockType: GLOBAL_DIALOG_TYPE = GLOBAL_DIALOG_TYPE.SIGN_IN;

      mockAction = {
        type: ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE,
        payload: {
          type: mockType,
        },
      };

      state = reduceState(mockAction);

      expect(state.type).toEqual(mockType);
    });
  });
});
