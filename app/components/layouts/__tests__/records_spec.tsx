jest.unmock("../records");

import { List } from "immutable";
import { LayoutStateFactory, LayoutStateRecord, LAYOUT_INITIAL_STATE, initialLayoutState } from "../records";

describe("Layout records", () => {
  describe("LayoutStateFactory function", () => {
    let state: LayoutStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = LayoutStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString().slice(0, 6)).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state.toJS()).toEqual(LAYOUT_INITIAL_STATE.toJS());
      });
    });

    describe("when receive initialLayoutState", () => {
      beforeEach(() => {
        state = LayoutStateFactory(initialLayoutState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return isTop with true", () => {
        expect(state.isTop).toBeTruthy();
      });

      it("should return the completionKeywordList state which is an Immutable List type", () => {
        expect(List.isList(state.completionKeywordList)).toBeTruthy();
      });

      it("should return the completionKeywordList state which is empty list", () => {
        expect(state.completionKeywordList.count()).toEqual(0);
      });
    });
  });
});
