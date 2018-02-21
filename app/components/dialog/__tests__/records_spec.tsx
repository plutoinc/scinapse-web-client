jest.unmock("../records");

import { DialogStateFactory, DialogStateRecord, DIALOG_INITIAL_STATE } from "../records";
import { GLOBAL_DIALOG_TYPE } from "../records";

describe("Dialog records", () => {
  describe("DialogStateFactory function", () => {
    let state: DialogStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = DialogStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(DIALOG_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      const mockType = GLOBAL_DIALOG_TYPE.EXTRA;

      beforeEach(() => {
        const jsState = {
          isLoading: false,
          hasError: false,
          isOpen: false,
          type: mockType,
        };

        state = DialogStateFactory(jsState);
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

      it("should have param's isOpen value", () => {
        expect(state.isOpen).toBeFalsy();
      });
      it("should have param's type value", () => {
        expect(state.type).toEqual(mockType);
      });
    });
  });
});
