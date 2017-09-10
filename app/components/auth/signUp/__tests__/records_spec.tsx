jest.unmock("../records");

import { Record } from "immutable";
import { SignUpStateFactory, ISignUpStateRecord, SIGN_UP_INITIAL_STATE } from "../records";

describe("signUp records", () => {
  describe("SignUpStateFactory function", () => {
    let state: ISignUpStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = SignUpStateFactory();
      });

      it("should return recordified state", () => {
        expect(Record.isRecord(state)).toBeTruthy();
      });

      it("should return initial state", () => {
        expect(state).toEqual(SIGN_UP_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      const mockEmail = "fakeEmail@pluto.network";
      const mockPassword = "tylorshin";
      const mockName = "tylorPluto";

      beforeEach(() => {
        const jsState = {
          isLoading: false,
          hasError: true,
          email: mockEmail,
          password: mockPassword,
          repeatPassword: mockPassword,
          fullName: mockName,
        };

        state = SignUpStateFactory(jsState);
      });

      it("should return recordified state", () => {
        expect(Record.isRecord(state));
      });

      it("should have param's isLoading value", () => {
        expect(state.isLoading).toBeFalsy();
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

      it("should have param's fullName value", () => {
        expect(state.fullName).toEqual(mockName);
      });

      it("should have param's repeatPassword value", () => {
        expect(state.repeatPassword).toEqual(mockPassword);
      });
    });
  });
});
