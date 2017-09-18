jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { IDialogStateRecord, DIALOG_INITIAL_STATE } from "../records";

function reduceState(action: any, state: IDialogStateRecord = DIALOG_INITIAL_STATE) {
  return reducer(state, action);
}

describe("Dialog reducer", () => {
  let mockAction: any;
  let state: IDialogStateRecord;

  describe("when GLOBAL_LOCATION_CHANGE, isOpen has to be false", () => {
    it("should isOpen to false When GLOBAL_LOCATION_CHANGE", () => {
      mockAction = {
        type: ACTION_TYPES.GLOBAL_LOCATION_CHANGE,
      };

      state = reduceState(mockAction);

      expect(state.isOpen).toBeFalsy();
    });
  });

  describe("when receive DIALOG_OPEN & DIALOG_CLOSE", () => {
    it("should isOpen to true When it is default", () => {
      mockAction = {
        type: ACTION_TYPES.GLOBAL_DIALOG_OPEN,
        payload: {
          type: "anyThing",
        },
      };

      state = reduceState(mockAction);

      expect(state.isOpen).toBeTruthy();
    });

    it("should isModalOpen to false When isModalOpen is true", () => {
      const mockState = DIALOG_INITIAL_STATE.set("isOpen", true);

      mockAction = {
        type: ACTION_TYPES.GLOBAL_DIALOG_CLOSE,
      };

      state = reduceState(mockAction, mockState);

      expect(state.isOpen).toBeFalsy();
    });
  });
});
