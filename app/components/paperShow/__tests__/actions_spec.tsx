jest.mock("../../../api/paper");
jest.unmock("../actions");

import { getPaper, clearPaperShowState } from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { RECORD } from "../../../__mocks__";

describe("Paper Show page actions", () => {
  let store: any;
  let resultActions: any[];

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("getPaper action creator", () => {
    describe("when succeed to get paper data", () => {
      beforeEach(async () => {
        const mockParams = {
          paperId: 123,
        };

        await store.dispatch(getPaper(mockParams));
        resultActions = await store.getActions();
      });

      it("should dispatch PAPER_SHOW_START_TO_GET_PAPER action", () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER);
      });

      it("should dispatch PAPER_SHOW_SUCCEEDED_TO_GET_PAPER action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER);
      });

      it("should dispatch proper paper data payload", () => {
        expect(resultActions[1].payload.paper.toJS()).toEqual(RECORD.PAPER.toJS());
      });
    });

    describe("when failed to get paper data", () => {
      beforeEach(async () => {
        const mockParams = {
          paperId: 0,
        };

        await store.dispatch(getPaper(mockParams));
        resultActions = await store.getActions();
      });

      it("should dispatch PAPER_SHOW_START_TO_GET_PAPER action", () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER);
      });

      it("should dispatch PAPER_SHOW_FAILED_TO_GET_PAEPR action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAEPR);
      });
    });
  });

  describe("clearPaperShowState action creator", () => {
    beforeEach(() => {
      store.dispatch(clearPaperShowState());
      resultActions = store.getActions();
    });

    it("should return PAPER_SHOW_CLEAR_PAPER_SHOW_STATE type action", () => {
      expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE);
    });
  });
});
