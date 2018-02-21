jest.unmock("../records");

import {
  EmailVerificationStateFactory,
  EmailVerificationStateRecord,
  EMAIL_VERIFICATION_INITIAL_STATE,
  EmailVerificationState,
} from "../records";

describe("signIn records", () => {
  describe("EmailVerificationStateFactory function", () => {
    let state: EmailVerificationStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = EmailVerificationStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(EMAIL_VERIFICATION_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      beforeEach(() => {
        const jsState: EmailVerificationState = {
          isLoading: false,
          hasError: true,
        };

        state = EmailVerificationStateFactory(jsState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should have param's isLoading value", () => {
        expect(state.isLoading).toBeFalsy();
      });

      it("should have param's hasError value", () => {
        expect(state.hasError).toBeTruthy();
      });
    });
  });
});
