jest.unmock("../records");

import { SignUpStateFactory, ISignUpStateRecord, SIGN_UP_INITIAL_STATE, initialErrorCheck } from "../records";

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
      const mockName = "tylorPluto";
      const mockHasErrorCheck = initialErrorCheck;

      beforeEach(() => {
        const jsState = {
          isLoading: false,
          hasError: false,
          email: mockEmail,
          password: mockPassword,
          repeatPassword: mockPassword,
          name: mockName,
          hasErrorCheck: mockHasErrorCheck,
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

      it("should have param's repeatPassword value", () => {
        expect(state.repeatPassword).toEqual(mockPassword);
      });

      it("should have param's name value", () => {
        expect(state.name).toEqual(mockName);
      });

      it("should have param's hasErrorCheck value", () => {
        expect(state.hasErrorCheck).toEqual(mockHasErrorCheck);
      });
    });
  });
});
