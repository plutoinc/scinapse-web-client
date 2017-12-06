jest.unmock("../records");

import {
  SignUpStateFactory,
  ISignUpStateRecord,
  SIGN_UP_INITIAL_STATE,
  initialErrorCheck,
  SIGN_UP_ON_FOCUS_TYPE,
  SIGN_UP_STEP,
} from "../records";

describe("signUp records", () => {
  describe("SignUpStateFactory function", () => {
    let state: ISignUpStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = SignUpStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(SIGN_UP_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      const mockEmail = "fakeEmail@pluto.network";
      const mockPassword = "tylorshin";
      const mockName = "test";
      const mockAffiliation = "postech";
      const mockHasErrorCheck = initialErrorCheck;
      const mockOnFocus = SIGN_UP_ON_FOCUS_TYPE.NAME;

      beforeEach(() => {
        const jsState = {
          isLoading: false,
          hasError: false,
          email: mockEmail,
          password: mockPassword,
          name: mockName,
          affiliation: mockAffiliation,
          onFocus: mockOnFocus,
          hasErrorCheck: mockHasErrorCheck,
          step: SIGN_UP_STEP.FIRST,
        };

        state = SignUpStateFactory(jsState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should have param's isLoading value", () => {
        expect(state.isLoading).toBeFalsy();
      });

      it("should have param's hasError value", () => {
        expect(state.hasError).toBeFalsy();
      });

      it("should have param's email value", () => {
        expect(state.email).toEqual(mockEmail);
      });

      it("should have param's password value", () => {
        expect(state.password).toEqual(mockPassword);
      });

      it("should have param's affiliation value", () => {
        expect(state.affiliation).toEqual(mockAffiliation);
      });

      it("should have param's onFocus value", () => {
        expect(state.onFocus).toEqual(mockOnFocus);
      });

      it("should have param's hasErrorCheck value", () => {
        expect(state.hasErrorCheck).toEqual(mockHasErrorCheck);
      });
    });
  });
});
