jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../../actions/actionTypes";
import { EmailVerificationStateRecord, EMAIL_VERIFICATION_INITIAL_STATE } from "../records";

function reduceState(action: any, state: EmailVerificationStateRecord = EMAIL_VERIFICATION_INITIAL_STATE) {
  return reducer(state, action);
}

describe("emailVerification reducer", () => {
  let mockAction: any;
  let state: EmailVerificationStateRecord;

  describe("when receive EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN", () => {
    beforeEach(() => {
      const mockState = EMAIL_VERIFICATION_INITIAL_STATE;

      mockAction = {
        type: ACTION_TYPES.EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN,
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

  describe("when receive EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN", () => {
    beforeEach(() => {
      const mockState = EMAIL_VERIFICATION_INITIAL_STATE;

      mockAction = {
        type: ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN,
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

  describe("when receive EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN", () => {
    beforeEach(() => {
      const mockState = EMAIL_VERIFICATION_INITIAL_STATE;

      mockAction = {
        type: ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN,
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

  describe("when receive EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL", () => {
    beforeEach(() => {
      const mockState = EMAIL_VERIFICATION_INITIAL_STATE;

      mockAction = {
        type: ACTION_TYPES.EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL,
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

  describe("when receive EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL", () => {
    beforeEach(() => {
      const mockState = EMAIL_VERIFICATION_INITIAL_STATE;

      mockAction = {
        type: ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL,
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

  describe("when receive EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL", () => {
    beforeEach(() => {
      const mockState = EMAIL_VERIFICATION_INITIAL_STATE;

      mockAction = {
        type: ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL,
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
