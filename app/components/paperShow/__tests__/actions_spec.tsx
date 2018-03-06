jest.mock("../../../api/paper");
jest.mock("../../../api/comment");
jest.unmock("../actions");

import { getPaper, clearPaperShowState, getComments, changeCommentInput, postComment } from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { RECORD } from "../../../__mocks__";
import AxiosCancelTokenManager from "../../../helpers/axiosCancelTokenManager";
import { PostCommentParams } from "../../../api/types/comment";

describe("Paper Show page actions", () => {
  let store: any;
  let resultActions: any[];

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("postComment action creator", () => {
    const mockPaperId = 3;
    const mockComment = "test";

    describe("when it's succeeded", () => {
      beforeEach(async () => {
        const mockParams: PostCommentParams = {
          paperId: mockPaperId,
          comment: mockComment,
        };

        await store.dispatch(postComment(mockParams));
      });

      it("should return PAPER_SHOW_START_TO_POST_COMMENT type action", () => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.PAPER_SHOW_START_TO_POST_COMMENT,
        });
      });

      it("should return PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT type action", () => {
        const actions = store.getActions();
        expect(actions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT);
      });

      it("should return PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT type action with comment payload", () => {
        const actions = store.getActions();
        expect(actions[1].payload.comment.comment).toEqual(mockComment);
      });
    });

    describe("when it's failed", () => {
      beforeEach(async () => {
        const mockParams: PostCommentParams = {
          paperId: 0,
          comment: mockComment,
        };

        await store.dispatch(postComment(mockParams));
      });

      it("should return PAPER_SHOW_START_TO_POST_COMMENT type action", () => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.PAPER_SHOW_START_TO_POST_COMMENT,
        });
      });

      it("should return PAPER_SHOW_FAILED_TO_POST_COMMENT type action", () => {
        const actions = store.getActions();
        expect(actions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COMMENT);
      });
    });
  });

  describe("changeCommentInput action creator", () => {
    const mockCommentInput = "mockComment";

    beforeEach(() => {
      store.dispatch(changeCommentInput(mockCommentInput));
      resultActions = store.getActions();
    });

    it("should return PAPER_SHOW_CHANGE_COMMENT_INPUT type action", () => {
      expect(resultActions[0].type).toBe(ACTION_TYPES.PAPER_SHOW_CHANGE_COMMENT_INPUT);
    });

    it("should return payload with commentInput", () => {
      expect(resultActions[0].payload.comment).toBe(mockCommentInput);
    });
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
