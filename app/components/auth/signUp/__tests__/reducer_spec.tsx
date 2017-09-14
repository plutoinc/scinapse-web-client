jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import { ISignUpStateRecord, SIGN_UP_INITIAL_STATE } from "../records";

function reduceState(
  action: any,
  state: ISignUpStateRecord = SIGN_UP_INITIAL_STATE
) {
  return reducer(state, action);
}

describe("signUp reducer", () => {
  let mockAction: any;
  let state: ISignUpStateRecord;

  describe("when receive SIGN_UP_CHANGE_EMAIL_INPUT", () => {
    it("should set email following payload", () => {
      const mockEmail = "tylor@pluto.network";

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT,
        payload: {
          email: mockEmail
        }
      };

      state = reduceState(mockAction);

      expect(state.email).toEqual(mockEmail);
    });
  });

  describe("when receive SIGN_UP_CHANGE_PASSWORD_INPUT", () => {
    it("should set password following payload", () => {
      const mockPassword = "tylorshin";

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT,
        payload: {
          password: mockPassword
        }
      };

      state = reduceState(mockAction);

      expect(state.password).toEqual(mockPassword);
    });
  });

  describe("when receive SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT", () => {
    it("should set repeatPassword following payload", () => {
      const mockPassword = "tylorshin";

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_CHANGE_REPEAT_PASSWORD_INPUT,
        payload: {
          password: mockPassword
        }
      };

      state = reduceState(mockAction);

      expect(state.repeatPassword).toEqual(mockPassword);
    });
  });

  describe("when receive SIGN_UP_CHANGE_FULL_NAME_INPUT", () => {
    it("should set fullName following payload", () => {
      const mockName = "tylorshin";

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_CHANGE_FULL_NAME_INPUT,
        payload: {
          fullName: mockName
        }
      };

      state = reduceState(mockAction);

      expect(state.fullName).toEqual(mockName);
    });
  });

  describe("when receive SIGN_UP_CHANGE_FULL_NAME_INPUT", () => {
    it("should set fullName following payload", () => {
      const mockName = "tylorshin";

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_CHANGE_FULL_NAME_INPUT,
        payload: {
          fullName: mockName
        }
      };

      state = reduceState(mockAction);

      expect(state.fullName).toEqual(mockName);
    });
  });

  describe("when receive SIGN_UP_START_TO_CREATE_ACCOUNT", () => {
    beforeEach(() => {
      const mockState = SIGN_UP_INITIAL_STATE.set("isLoading", false).set(
        "hasError",
        true
      );

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading state to true", () => {
      expect(state.isLoading).toBeTruthy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive SIGN_UP_FAILED_TO_CREATE_ACCOUNT", () => {
    beforeEach(() => {
      const mockState = SIGN_UP_INITIAL_STATE.set("isLoading", true).set(
        "hasError",
        false
      );

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading state to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to true", () => {
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT", () => {
    beforeEach(() => {
      const mockState = SIGN_UP_INITIAL_STATE.set("isLoading", true).set(
        "hasError",
        true
      );

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading state to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });
});
