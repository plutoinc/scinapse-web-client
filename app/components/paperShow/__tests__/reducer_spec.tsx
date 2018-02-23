jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { PaperShowStateRecord, PaperShowStateFactory } from "../records";
import { IReduxAction } from "../../../typings/actionType";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { RECORD } from "../../../__mocks__";

describe("PaperShow reducer", () => {
  let mockAction: IReduxAction<any>;
  let mockState: PaperShowStateRecord;
  let state: PaperShowStateRecord;

  describe("when reducer get PAPER_SHOW_SUCCEEDED_TO_GET_PAPER action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER,
        payload: {
          paper: RECORD.PAPER,
        },
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingPaper", true)
          .set("isLoadingPaper", true)
          .set("paper", null);
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingPaper to false", () => {
      expect(state.hasErrorOnFetchingPaper).toBeFalsy();
    });

    it("should set isLoadingPaper to false", () => {
      expect(state.isLoadingPaper).toBeFalsy();
    });

    it("should set paper to payload's paper value", () => {
      expect(state.paper.toJS()).toEqual(RECORD.PAPER.toJS());
    });
  });

  describe("when reducer get PAPER_SHOW_START_TO_GET_PAPER action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER,
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState.set("hasErrorOnFetchingPaper", true).set("isLoadingPaper", false);
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingPaper to false", () => {
      expect(state.hasErrorOnFetchingPaper).toBeFalsy();
    });

    it("should set isLoadingPaper to true", () => {
      expect(state.isLoadingPaper).toBeTruthy();
    });
  });

  describe("when reducer get PAPER_SHOW_FAILED_TO_GET_PAEPR action", () => {
    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAEPR,
      };

      mockState = PaperShowStateFactory().withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingPaper", false)
          .set("isLoadingPaper", true)
          .set("paper", null);
      });

      state = reducer(mockState, mockAction);
    });

    it("should set hasErrorOnFetchingPaper to true", () => {
      expect(state.hasErrorOnFetchingPaper).toBeTruthy();
    });

    it("should set isLoadingPaper to false", () => {
      expect(state.isLoadingPaper).toBeFalsy();
    });

    it("should set paper to null value", () => {
      expect(state.paper).toBeNull();
    });
  });
});
