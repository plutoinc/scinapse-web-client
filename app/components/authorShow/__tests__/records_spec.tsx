jest.unmock("../records");

import { AuthorShowStateFactory, AuthorShowStateRecord, AUTHOR_SHOW_INITIAL_STATE } from "../records";

describe("AuthorShowStates records", () => {
  describe("AuthorShowStateFactory function", () => {
    describe("when there is no arguments", () => {
      let state: AuthorShowStateRecord;
      beforeEach(() => {
        state = AuthorShowStateFactory();
      });

      it("should return AUTHOR_SHOW_INITIAL_STATE", () => {
        expect(state.toJS()).toEqual(AUTHOR_SHOW_INITIAL_STATE.toJS());
      });

      it("should return Immutable Record type", () => {
        expect(state.toString().slice(0, 6)).toContain("Record");
      });
    });
  });
});
