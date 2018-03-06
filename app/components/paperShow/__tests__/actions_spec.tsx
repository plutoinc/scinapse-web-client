jest.mock("../../../api/paper");
jest.mock("../../../api/comment");
jest.unmock("../actions");

import { getPaper, clearPaperShowState, getComments } from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { RECORD } from "../../../__mocks__";
import AxiosCancelTokenManager from "../../../helpers/axiosCancelTokenManager";

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

      it("should dispatch PAPER_SHOW_FAILED_TO_GET_PAPER action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER);
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

  describe("getComments action creator", () => {
    describe("when succeed to get paper's comment data", () => {
      beforeEach(async () => {
        const axiosCancelTokenManager = new AxiosCancelTokenManager();

        const mockParams = {
          paperId: 123,
          page: 0,
          cancelTokenSource: axiosCancelTokenManager.getCancelTokenSource(),
        };

        await store.dispatch(getComments(mockParams));
        resultActions = await store.getActions();
      });

      it("should dispatch PAPER_SHOW_START_TO_GET_COMMENTS action", () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_COMMENTS);
      });

      it("should dispatch PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS);
      });

      it("should dispatch proper comments data payload", () => {
        expect(resultActions[1].payload.commentsResponse.comments.toJS()).toEqual([RECORD.COMMENT.toJS()]);
      });
    });

    describe("when failed to get paper data", () => {
      beforeEach(async () => {
        const axiosCancelTokenManager = new AxiosCancelTokenManager();

        const mockParams = {
          paperId: 0,
          page: 0,
          cancelTokenSource: axiosCancelTokenManager.getCancelTokenSource(),
        };

        await store.dispatch(getComments(mockParams));
        resultActions = await store.getActions();
      });

      it("should dispatch PAPER_SHOW_START_TO_GET_COMMENTS action", () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_COMMENTS);
      });

      it("should dispatch PAPER_SHOW_FAILED_TO_GET_COMMENTS action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COMMENTS);
      });
    });
  });
});
