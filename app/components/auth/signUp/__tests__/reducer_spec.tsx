jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import {
  ISignUpStateRecord,
  SIGN_UP_INITIAL_STATE,
  SIGN_UP_ON_FOCUS_TYPE,
  SIGN_UP_STEP,
  ISignUpOauthInfo,
} from "../records";
import { recordify } from "typed-immutable-record";
import { OAUTH_VENDOR } from "../../../../api/types/auth";

function reduceState(action: any, state: ISignUpStateRecord = SIGN_UP_INITIAL_STATE) {
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
          email: mockEmail,
        },
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
          password: mockPassword,
        },
      };

      state = reduceState(mockAction);

      expect(state.password).toEqual(mockPassword);
    });
  });

  describe("when receive SIGN_UP_CHANGE_NAME_INPUT", () => {
    it("should set name following payload", () => {
      const mockName = "tylorshin";

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_CHANGE_NAME_INPUT,
        payload: {
          name: mockName,
        },
      };

      state = reduceState(mockAction);

      expect(state.name).toEqual(mockName);
    });
  });

  describe("when receive SIGN_UP_CHANGE_AFFILIATION_INPUT", () => {
    it("should set affiliation following payload", () => {
      const mockAffiliation = "postech";

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_CHANGE_AFFILIATION_INPUT,
        payload: {
          affiliation: mockAffiliation,
        },
      };

      state = reduceState(mockAction);

      expect(state.affiliation).toEqual(mockAffiliation);
    });
  });

  describe("when receive SIGN_UP_FORM_ERROR ", () => {
    it("should set hasErrorCheck following payload type and errorMessage", () => {
      const mockType = "affiliation";
      const mockErrorMessage = "name should not be under 2 character";

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
        payload: {
          type: mockType,
          errorMessage: mockErrorMessage,
        },
      };

      state = reduceState(mockAction);

      expect(state.hasErrorCheck[mockType].hasError).toBeTruthy();
      expect(state.hasErrorCheck[mockType].errorMessage).toEqual(mockErrorMessage);
    });
  });

  describe("when receive SIGN_UP_REMOVE_FORM_ERROR", () => {
    it("should set hasErrorCheck following payload type", () => {
      const mockType = "affiliation";

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
        payload: {
          type: mockType,
        },
      };

      state = reduceState(mockAction);

      expect(state.hasErrorCheck[mockType].hasError).toBeFalsy();
      expect(state.hasErrorCheck[mockType].errorMessage).toBeNull();
    });
  });

  describe("when receive SIGN_UP_ON_FOCUS_INPUT", () => {
    it("should set onFocus following type payload", () => {
      const mockOnFocusType = SIGN_UP_ON_FOCUS_TYPE.EMAIL;

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_ON_FOCUS_INPUT,
        payload: {
          type: mockOnFocusType,
        },
      };

      state = reduceState(mockAction);

      expect(state.onFocus).toEqual(mockOnFocusType);
    });
  });

  describe("when receive SIGN_UP_ON_BLUR_INPUT", () => {
    it("should set onFocus to be null", () => {
      mockAction = {
        type: ACTION_TYPES.SIGN_UP_ON_BLUR_INPUT,
      };

      state = reduceState(mockAction);

      expect(state.onFocus).toBeNull();
    });
  });

  describe("when receive SIGN_UP_START_TO_CREATE_ACCOUNT", () => {
    beforeEach(() => {
      const mockState = SIGN_UP_INITIAL_STATE.set("isLoading", false).set("hasError", true);

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
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
      const mockState = SIGN_UP_INITIAL_STATE.set("isLoading", true).set("hasError", false);

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
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
      const mockState = SIGN_UP_INITIAL_STATE.set("isLoading", true).set("hasError", true);

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
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

  describe("when receive SIGN_UP_CHANGE_SIGN_UP_STEP", () => {
    it("should set step following payload", () => {
      const mockStep = SIGN_UP_STEP.FIRST;

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_CHANGE_SIGN_UP_STEP,
        payload: {
          step: mockStep,
        },
      };

      state = reduceState(mockAction);

      expect(state.step).toEqual(mockStep);
    });
  });

  describe("when receive SIGN_UP_GET_AUTHORIZE_CODE", () => {
    it("should set step to SIGN_UP_STEP.WITH_SOCIAL", () => {
      mockAction = {
        type: ACTION_TYPES.SIGN_UP_GET_AUTHORIZE_CODE,
      };

      state = reduceState(mockAction);

      expect(state.step).toEqual(SIGN_UP_STEP.WITH_SOCIAL);
    });
  });

  describe("when receive SIGN_UP_START_TO_EXCHANGE", () => {
    beforeEach(() => {
      const mockState = SIGN_UP_INITIAL_STATE.set("isLoading", false).set("hasError", true);

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_START_TO_EXCHANGE,
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

  describe("when receive SIGN_UP_FAILED_TO_EXCHANGE", () => {
    beforeEach(() => {
      const mockState = SIGN_UP_INITIAL_STATE.set("isLoading", true).set("hasError", false);

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE,
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

  describe("when receive SIGN_UP_SUCCEEDED_TO_EXCHANGE", () => {
    const mockVendor: OAUTH_VENDOR = "GOOGLE";
    const mockEmail = "tylor@pluto.network";
    const mockName = "tylorshin";
    const mockRecordifiedOauth: ISignUpOauthInfo = recordify({
      code: "",
      oauthId: "",
      uuid: "",
      vendor: mockVendor,
    });

    beforeEach(() => {
      const mockState = SIGN_UP_INITIAL_STATE.set("isLoading", true).set("hasError", true);

      mockAction = {
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_EXCHANGE,
        payload: {
          vendor: mockVendor,
          email: mockEmail,
          name: mockName,
          oauth: mockRecordifiedOauth,
        },
      };

      state = reduceState(mockAction, mockState);
    });

    it("should set isLoading state to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });

    it("should set email following email payload", () => {
      expect(state.email).toEqual(mockEmail);
    });

    it("should set name following name payload", () => {
      expect(state.name).toEqual(mockName);
    });

    it("should set oauth following oauth payload", () => {
      expect(state.oauth).toEqual(mockRecordifiedOauth);
    });
  });

  describe("when receive SIGN_UP_GO_BACK", () => {
    it("should set state to SIGN_UP_INITIAL_STATE", () => {
      mockAction = {
        type: ACTION_TYPES.SIGN_UP_GO_BACK,
      };

      state = reduceState(mockAction);

      expect(state).toEqual(SIGN_UP_INITIAL_STATE);
    });
  });

  describe("when receive GLOBAL_LOCATION_CHANGE", () => {
    it("should set state to SIGN_UP_INITIAL_STATE", () => {
      mockAction = {
        type: ACTION_TYPES.GLOBAL_LOCATION_CHANGE,
      };

      state = reduceState(mockAction);

      expect(state).toEqual(SIGN_UP_INITIAL_STATE);
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
