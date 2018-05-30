jest.unmock("../reducer");
jest.unmock("../records");

import { reducer, AUTH_CHECKER_INITIAL_STATE, AuthCheckerState } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";

function reduceState(action: any, state: AuthCheckerState = AUTH_CHECKER_INITIAL_STATE) {
  return reducer(state, action);
}

describe("AuthChecker reducer", () => {
  let mockAction: any;
  let state: AuthCheckerState;

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
