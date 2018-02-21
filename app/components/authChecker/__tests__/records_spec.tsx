jest.unmock("../records");

import { AuthCheckerStateFactory, AuthCheckerStateRecord, AUTH_CHECKER_INITIAL_STATE } from "../records";

describe("AuthChecker records", () => {
  describe("AuthCheckerStateFactory function", () => {
    let state: AuthCheckerStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = AuthCheckerStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(AUTH_CHECKER_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      beforeEach(() => {
        const jsState = {
          isLoading: true,
        };

        state = AuthCheckerStateFactory(jsState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should have param's isLoading value", () => {
        expect(state.isLoading).toBeTruthy();
      });
    });
  });
});
