jest.mock("../../../api/paper");
jest.mock("../../../api/comment");
jest.mock("../../../helpers/makePlutoToastAction");
jest.unmock("../../../actions/paperShow");

import axios from "axios";
import { getPaper, getComments, postComment, getReferencePapers, deleteComment } from "../../../actions/paperShow";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import AxiosCancelTokenManager from "../../../helpers/axiosCancelTokenManager";
import { PostCommentParams, DeleteCommentParams } from "../../../api/types/comment";
import { GetRefOrCitedPapersParams } from "../../../api/types/paper";

describe("Paper Show page actions", () => {
  let store: any;
  let resultActions: any[];

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("deleteComment action creator", () => {
    const mockCommentId = 3;

    describe("when it's succeeded", () => {
      beforeEach(async () => {
        const mockParams: DeleteCommentParams = {
          paperId: 1,
          commentId: mockCommentId,
        };

        await store.dispatch(deleteComment(mockParams));
      });

      it("should return PAPER_SHOW_START_TO_DELETE_COMMENT type action", () => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.PAPER_SHOW_START_TO_DELETE_COMMENT,
        });
      });

      it("should return PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT type action", () => {
        const actions = store.getActions();
        expect(actions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT);
      });
    });

    describe("when it's failed", () => {
      beforeEach(async () => {
        const mockParams: DeleteCommentParams = {
          paperId: 0,
          commentId: 0,
        };

        await store.dispatch(deleteComment(mockParams));
      });

      it("should return PAPER_SHOW_START_TO_DELETE_COMMENT type action", () => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.PAPER_SHOW_START_TO_DELETE_COMMENT,
        });
      });

      it("should return PAPER_SHOW_FAILED_TO_DELETE_COMMENT type action", () => {
        const actions = store.getActions();
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_DELETE_COMMENT,
        });
      });
    });
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

      it("should return GLOBAL_ADD_ENTITY type action", () => {
        const actions = store.getActions();
        expect(actions[1].type).toEqual(ACTION_TYPES.GLOBAL_ADD_ENTITY);
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

  describe("getPaper action creator", () => {
    describe("when succeed to get paper data", () => {
      beforeEach(async () => {
        const mockParams = {
          paperId: 123,
          cancelToken: axios.CancelToken.source().token,
        };

        await store.dispatch(getPaper(mockParams));
        resultActions = await store.getActions();
      });

      it("should dispatch PAPER_SHOW_START_TO_GET_PAPER action", () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER);
      });

      it("should dispatch GLOBAL_ADD_ENTITY action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.GLOBAL_ADD_ENTITY);
      });
    });

    describe("when failed to get paper data", () => {
      beforeEach(async () => {
        const mockParams = {
          paperId: 0,
          cancelToken: axios.CancelToken.source().token,
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

      it("should dispatch GLOBAL_ADD_ENTITY action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.GLOBAL_ADD_ENTITY);
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

  describe("getReferencePapers action creator", () => {
    describe("when succeed to get paper's reference paper data", () => {
      beforeEach(async () => {
        const mockParams: GetRefOrCitedPapersParams = {
          paperId: 123,
          page: 0,
          filter: "year=:,if=:",
          cancelToken: axios.CancelToken.source().token,
        };

        await store.dispatch(getReferencePapers(mockParams));
        resultActions = await store.getActions();
      });

      it("should dispatch PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS action", () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS);
      });

      it("should dispatch GLOBAL_ADD_ENTITY action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.GLOBAL_ADD_ENTITY);
      });
    });

    describe("when failed to get paper's reference paper data", () => {
      beforeEach(async () => {
        const mockParams: GetRefOrCitedPapersParams = {
          paperId: 0,
          page: 0,
          filter: "year=:,if=:",
          cancelToken: axios.CancelToken.source().token,
        };

        await store.dispatch(getReferencePapers(mockParams));
        resultActions = await store.getActions();
      });

      it("should dispatch PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS action", () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS);
      });

      it("should dispatch PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS);
      });
    });
  });
});
