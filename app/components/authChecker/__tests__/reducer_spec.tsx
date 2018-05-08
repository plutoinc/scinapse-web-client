jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { AuthCheckerStateRecord, AUTH_CHECKER_INITIAL_STATE } from "../records";

function reduceState(action: any, state: AuthCheckerStateRecord = AUTH_CHECKER_INITIAL_STATE) {
  return reducer(state, action);
}

describe("AuthChecker reducer", () => {
  let mockAction: any;
  let state: AuthCheckerStateRecord;

  describe("when receive AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN", () => {
    it("should set isLoading Falsy", () => {
      mockAction = {
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
      };

      state = reduceState(mockAction);

      expect(state.isLoading).toBeFalsy();
    });
  });

  describe("when receive AUTH_FAILED_TO_CHECK_LOGGED_IN", () => {
    it("should set isLoading Falsy", () => {
      mockAction = {
        type: ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN,
      };

      state = reduceState(mockAction);

      expect(state.isLoading).toBeFalsy();
    });
  });
});
