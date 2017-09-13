jest.unmock("../records");

import {
  SignInStateFactory,
  ISignInStateRecord,
  SIGN_IN_INITIAL_STATE
} from "../records";

describe("signIn records", () => {
  describe("SignInStateFactory function", () => {
    let state: ISignInStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = SignInStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(SIGN_IN_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      const mockEmail = "fakeEmail@pluto.network";
      const mockPassword = "tylorshin";

      beforeEach(() => {
        const jsState = {
          isLoading: false,
          isFailed: true,
          hasError: true,
          email: mockEmail,
          password: mockPassword
        };

        state = SignInStateFactory(jsState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should have param's isLoading value", () => {
        expect(state.isLoading).toBeFalsy();
      });

      it("should have param's isFailed value", () => {
        expect(state.isFailed).toBeTruthy();
      });

      it("should have param's hasError value", () => {
        expect(state.hasError).toBeTruthy();
      });

      it("should have param's email value", () => {
        expect(state.email).toEqual(mockEmail);
      });

      it("should have param's password value", () => {
        expect(state.password).toEqual(mockPassword);
      });
    });
  });
});
