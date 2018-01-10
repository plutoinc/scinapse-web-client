jest.unmock("../records");

import {
  EmailVerificationStateFactory,
  IEmailVerificationStateRecord,
  EMAIL_VERIFICATION_INITIAL_STATE,
  IEmailVerificationState,
} from "../records";

describe("signIn records", () => {
  describe("EmailVerificationStateFactory function", () => {
    let state: IEmailVerificationStateRecord;

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
        const jsState: IEmailVerificationState = {
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
