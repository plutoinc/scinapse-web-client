jest.unmock("../records");

import { LayoutStateFactory, ILayoutStateRecord, LAYOUT_INITIAL_STATE } from "../records";

describe("Layout records", () => {
  describe("LayoutStateFactory function", () => {
    let state: ILayoutStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = LayoutStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state).toEqual(LAYOUT_INITIAL_STATE);
      });
    });

    describe("when there is normal js params", () => {
      beforeEach(() => {
        const jsState = {
          isTop: true,
          isMobile: false,
        };

        state = LayoutStateFactory(jsState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should have param's isTop be true", () => {
        expect(state.isTop).toBeTruthy();
      });
    });
  });
});
