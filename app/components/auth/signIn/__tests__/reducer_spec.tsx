jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import { ISignInStateRecord, SIGN_IN_INITIAL_STATE, SIGN_IN_ON_FOCUS_TYPE } from "../records";

function reduceState(action: any, state: ISignInStateRecord = SIGN_IN_INITIAL_STATE) {
  return reducer(state, action);
}

describe("signIn reducer", () => {
  let mockAction: any;
  let state: ISignInStateRecord;

  describe("when receive SIGN_IN_CHANGE_EMAIL_INPUT", () => {
    it("should set email following payload", () => {
      const mockEmail = "tylor@pluto.network";

      mockAction = {
        type: ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT,
        payload: {
          email: mockEmail,
        },
      };

      state = reduceState(mockAction);

      expect(state.email).toEqual(mockEmail);
    });
  });

  describe("when receive SIGN_IN_CHANGE_PASSWORD_INPUT", () => {
    it("should set password following payload", () => {
      const mockPassword = "tylorshin";

      mockAction = {
        type: ACTION_TYPES.SIGN_IN_CHANGE_PASSWORD_INPUT,
        payload: {
          password: mockPassword,
        },
      };

      state = reduceState(mockAction);

      expect(state.password).toEqual(mockPassword);
    });
  });

  describe("when receive SIGN_IN_ON_FOCUS_INPUT", () => {
    it("should set onFocus following type payload", () => {
      const mockOnFocusType = SIGN_IN_ON_FOCUS_TYPE.EMAIL;

      mockAction = {
        type: ACTION_TYPES.SIGN_IN_ON_FOCUS_INPUT,
        payload: {
          type: mockOnFocusType,
        },
      };

      state = reduceState(mockAction);

      expect(state.onFocus).toEqual(mockOnFocusType);
    });
  });

  describe("when receive SIGN_IN_ON_BLUR_INPUT", () => {
    it("should set onFocus to be null", () => {
      mockAction = {
        type: ACTION_TYPES.SIGN_IN_ON_BLUR_INPUT,
      };

      state = reduceState(mockAction);

      expect(state.onFocus).toBeNull();
    });
  });

  describe("when receive SIGN_IN_FORM_ERROR", () => {
    it("should set hasError to be true", () => {
      mockAction = {
        type: ACTION_TYPES.SIGN_IN_FORM_ERROR,
      };

      state = reduceState(mockAction);

      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive SIGN_IN_START_TO_SIGN_IN", () => {
    beforeEach(() => {
      const mockState = SIGN_IN_INITIAL_STATE.set("hasError", true);

      mockAction = {
        type: ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading to true", () => {
      expect(state.isLoading).toBeTruthy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive SIGN_IN_FAILED_TO_SIGN_IN", () => {
    beforeEach(() => {
      const mockState = SIGN_IN_INITIAL_STATE.set("isLoading", true);

      mockAction = {
        type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to true", () => {
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive SIGN_IN_SUCCEEDED_TO_SIGN_IN", () => {
    beforeEach(() => {
      const mockState = SIGN_IN_INITIAL_STATE.withMutations(state => {
        state.withMutations(state => {
          state.set("isLoading", true).set("hasError", true);
        });
      });

      mockAction = {
        type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive SIGN_IN_FAILED_UNSIGNED_UP_WITH_SOCIAL", () => {
    it("should set isUnsignedUpWithSocial to true", () => {
      mockAction = {
        type: ACTION_TYPES.SIGN_IN_FAILED_UNSIGNED_UP_WITH_SOCIAL,
      };

      state = reduceState(mockAction);

      expect(state.isUnsignedUpWithSocial).toBeTruthy();
    });
  });

  describe("when receive SIGN_IN_GO_BACK", () => {
    it("should set state to SIGN_IN_INITIAL_STATE", () => {
      mockAction = {
        type: ACTION_TYPES.SIGN_IN_GO_BACK,
      };

      state = reduceState(mockAction);

      expect(state).toEqual(SIGN_IN_INITIAL_STATE);
    });
  });

  describe("when receive GLOBAL_LOCATION_CHANGE", () => {
    it("should set state to SIGN_IN_INITIAL_STATE", () => {
      mockAction = {
        type: ACTION_TYPES.GLOBAL_LOCATION_CHANGE,
      };

      state = reduceState(mockAction);

      expect(state).toEqual(SIGN_IN_INITIAL_STATE);
    });
  });

  describe("when receive except action", () => {
    it("should set state to state", () => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CLOSE_FIRST_OPEN,
      };

      state = reduceState(mockAction);

      expect(state).toEqual(state);
    });
  });
});
