jest.mock("../../../api/paper");
jest.mock("../../../api/comment");
jest.mock("../../../helpers/handleGA");
jest.mock("normalize.css", () => {});
jest.unmock("../actions");

import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { push } from "react-router-redux";
import { SEARCH_SORTING } from "../records";
import { IGetPapersParams, IGetRefOrCitedPapersParams } from "../../../api/types/paper";
import { IGetCommentsParams, IPostCommentParams, IDeleteCommentParams } from "../../../api/types/comment";

import AxiosCancelTokenManager from "../../../helpers/axiosCancelTokenManager";
import { List } from "immutable";
import { initialPaper, recordifyPaper } from "../../../model/paper";
import { recordifyComment, initialComment } from "../../../model/comment";
import { FetchSearchItemsParams } from "../types/actions";
import { SEARCH_FETCH_ITEM_MODE } from "../types";

describe("articleSearch actions", () => {
  let store: any;
  let tempWindowAlertFunc: any;
  const axiosCancelTokenManager = new AxiosCancelTokenManager();
  const mockCancelTokenSource = axiosCancelTokenManager.getCancelTokenSource();

  beforeAll(() => {
    tempWindowAlertFunc = window.alert;
  });

  afterAll(() => {
    window.alert = tempWindowAlertFunc;
  });

  beforeEach(() => {
    store = generateMockStore({});
    store.clearActions();
  });

  describe("changeSearchInput action", () => {
    it("should return ARTICLE_SEARCH_CHANGE_SEARCH_INPUT action with searchInput payload", () => {
      const mockSearchInput = "paper";
      store.dispatch(Actions.changeSearchInput(mockSearchInput));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
        payload: {
          searchInput: mockSearchInput,
        },
      });
    });
  });

  describe("handleSearchPush action", () => {
    describe("if searchInput.length < 2", () => {
      it("should call alert function", () => {
        const mockInValidSearchInput = "t";

        window.alert = jest.fn(() => {});
        store.dispatch(Actions.handleSearchPush(mockInValidSearchInput));
        expect(window.alert).toHaveBeenCalledWith("Search query length has to be over 2.");
      });
    });

    describe("if searchInput.length >= 2", () => {
      it("should return push to query", () => {
        const mockValidSearchInput = "tfsdfdsf";

        store.dispatch(Actions.handleSearchPush(mockValidSearchInput));

        const actions = store.getActions();
        expect(actions[0]).toEqual(
          push(`/search?query=${papersQueryFormatter.formatPapersQuery({ text: mockValidSearchInput })}&page=1`),
        );
      });
    });
  });

  describe("addFilter action", () => {
    it("should return push search following payload", () => {
      const mockText = "test";
      const mockYearFrom = 1995;
      const mockYearTo = 1997;
      const mockJournalIFFrom = 2;
      const mockJournalIFTo = 4;

      store.dispatch(
        Actions.addFilter({
          text: mockText,
          yearFrom: mockYearFrom,
          yearTo: mockYearTo,
          journalIFFrom: mockJournalIFFrom,
          journalIFTo: mockJournalIFTo,
        }),
      );

      const actions = store.getActions();
      expect(actions[0]).toEqual(
        push(
          `/search?query=${papersQueryFormatter.formatPapersQuery({
            text: mockText,
            yearFrom: mockYearFrom,
            yearTo: mockYearTo,
            journalIFFrom: mockJournalIFFrom,
            journalIFTo: mockJournalIFTo,
          })}&page=1`,
        ),
      );
    });
  });

  describe("changeSorting action", () => {
    it("should return ARTICLE_SEARCH_CHANGE_SORTING action following sorting payload", () => {
      const mockSorting = SEARCH_SORTING.LATEST;

      store.dispatch(Actions.changeSorting(mockSorting));

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING,
        payload: {
          sorting: mockSorting,
        },
      });
    });
  });

  describe("getPapers action", () => {
    const mockPage = 3;
    const mockQuery = "test";

    beforeEach(async () => {
      const mockParams: IGetPapersParams = {
        page: mockPage,
        query: mockQuery,
        cancelTokenSource: mockCancelTokenSource,
      };

      await store.dispatch(Actions.getPapers(mockParams));
    });

    it("should return ARTICLE_SEARCH_START_TO_GET_PAPERS", () => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS,
      });
    });

    it("should return ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS", () => {
      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: List(),
          nextPage: mockPage + 1,
          isEnd: true,
          totalElements: 0,
          totalPages: 0,
          numberOfElements: 0,
        },
      });
    });
  });

  describe("getCitedPapers action", () => {
    const mockPage = 3;
    const mockPaperId = 23;
    const mockCognitiveId = 123;

    beforeEach(async () => {
      const mockParams: IGetRefOrCitedPapersParams = {
        page: mockPage,
        paperId: mockPaperId,
        cognitiveId: mockCognitiveId,
        cancelTokenSource: mockCancelTokenSource,
      };

      await store.dispatch(Actions.getCitedPapers(mockParams));
    });

    it("should return ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS", () => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS,
      });
    });

    it("should return ARTICLE_SEARCH_SUCCEEDED_TO_CITED_GET_PAPERS", () => {
      const actions = store.getActions();
      expect(JSON.stringify(actions[1])).toEqual(
        JSON.stringify({
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS,
          payload: {
            papers: List(),
            nextPage: mockPage + 1,
            isEnd: true,
            totalElements: 0,
            totalPages: 0,
            numberOfElements: 0,
            targetPaper: recordifyPaper(initialPaper),
          },
        }),
      );
    });
  });

  describe("getReferencePapers action", () => {
    const mockPage = 3;
    const mockPaperId = 23;
    const mockCognitiveId = 123;

    beforeEach(async () => {
      const mockParams: IGetRefOrCitedPapersParams = {
        page: mockPage,
        paperId: mockPaperId,
        cognitiveId: mockCognitiveId,
        cancelTokenSource: mockCancelTokenSource,
      };

      await store.dispatch(Actions.getReferencePapers(mockParams));
    });

    it("should return ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS", () => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS,
      });
    });

    it("should return ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS", () => {
      const actions = store.getActions();
      expect(JSON.stringify(actions[1])).toEqual(
        JSON.stringify({
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
          payload: {
            papers: List(),
            nextPage: mockPage + 1,
            isEnd: true,
            totalElements: 0,
            totalPages: 0,
            numberOfElements: 0,
            targetPaper: recordifyPaper(initialPaper),
          },
        }),
      );
    });
  });

  describe("getMoreComments action", () => {
    const mockPage = 3;
    const mockPaperId = 3;

    beforeEach(async () => {
      const mockParams: IGetCommentsParams = {
        page: mockPage,
        paperId: mockPaperId,
        cancelTokenSource: mockCancelTokenSource,
      };

      await store.dispatch(Actions.getMoreComments(mockParams));
    });

    it("should return ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS", () => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS,
        payload: {
          paperId: mockPaperId,
        },
      });
    });

    it("should return ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS", () => {
      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS,
        payload: {
          paperId: mockPaperId,
          comments: List(),
          nextPage: mockPage + 1,
        },
      });
    });
  });

  describe("changeSearchInput action", () => {
    it("should return ARTICLE_SEARCH_CHANGE_SEARCH_INPUT action with searchInput payload", () => {
      const mockSearchInput = "paper";
      store.dispatch(Actions.changeSearchInput(mockSearchInput));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
        payload: {
          searchInput: mockSearchInput,
        },
      });
    });
  });

  describe("changeCommentInput action", () => {
    it("should return ARTICLE_SEARCH_CHANGE_COMMENT_INPUT action with index & comment payload", () => {
      const mockIndex = 3;
      const mockComment = "test comment";
      store.dispatch(Actions.changeCommentInput(mockIndex, mockComment));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT,
        payload: {
          index: mockIndex,
          comment: mockComment,
        },
      });
    });
  });

  describe("toggleAbstract action", () => {
    it("should return ARTICLE_SEARCH_TOGGLE_ABSTRACT action with index payload", () => {
      const mockIndex = 2;
      store.dispatch(Actions.toggleAbstract(mockIndex));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_ABSTRACT,
        payload: {
          index: mockIndex,
        },
      });
    });
  });

  describe("toggleComments action", () => {
    it("should return ARTICLE_SEARCH_TOGGLE_COMMENTS action with index payload", () => {
      const mockIndex = 23;
      store.dispatch(Actions.toggleComments(mockIndex));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_COMMENTS,
        payload: {
          index: mockIndex,
        },
      });
    });
  });

  describe("toggleAuthors action", () => {
    it("should return ARTICLE_SEARCH_TOGGLE_AUTHORS action with index payload", () => {
      const mockIndex = 23;
      store.dispatch(Actions.toggleAuthors(mockIndex));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_AUTHORS,
        payload: {
          index: mockIndex,
        },
      });
    });
  });

  describe("visitTitle action", () => {
    it("should return ARTICLE_SEARCH_VISIT_TITLE action with index payload", () => {
      const mockIndex = 23;
      store.dispatch(Actions.visitTitle(mockIndex));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_VISIT_TITLE,
        payload: {
          index: mockIndex,
        },
      });
    });
  });

  describe("handleCommentPost action", () => {
    const mockPaperId = 3;
    const mockComment = "test";

    beforeEach(async () => {
      const mockParams: IPostCommentParams = {
        paperId: mockPaperId,
        comment: mockComment,
      };

      await store.dispatch(Actions.postComment(mockParams));
    });

    it("should return ARTICLE_SEARCH_START_TO_POST_COMMENT", () => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_POST_COMMENT,
        payload: {
          paperId: mockPaperId,
        },
      });
    });

    it("should return ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT with recordifiedComment & paperId", () => {
      const actions = store.getActions();
      expect(JSON.stringify(actions[1])).toEqual(
        JSON.stringify({
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT,
          payload: {
            comment: recordifyComment(initialComment),
            paperId: mockPaperId,
          },
        }),
      );
    });
  });

  describe("closeFirstOpen action", () => {
    it("should return ARTICLE_SEARCH_CLOSE_FIRST_OPEN action with index payload", () => {
      const mockIndex = 23;
      store.dispatch(Actions.closeFirstOpen(mockIndex));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_CLOSE_FIRST_OPEN,
        payload: {
          index: mockIndex,
        },
      });
    });
  });

  describe("deleteComment action", () => {
    const mockPaperId = 3;
    const mockCommentId = 4;

    beforeEach(async () => {
      const mockParams: IDeleteCommentParams = {
        paperId: mockPaperId,
        commentId: mockCommentId,
      };

      await store.dispatch(Actions.deleteComment(mockParams));
    });

    it("should return ARTICLE_SEARCH_START_TO_DELETE_COMMENT", () => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_DELETE_COMMENT,
      });
    });

    it("should return ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT with commentId & paperId", () => {
      const actions = store.getActions();
      expect(actions[1]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT,
        payload: {
          paperId: mockPaperId,
          commentId: mockCommentId,
        },
      });
    });
  });

  describe("fetchSearchItems action", () => {
    const mockQuery = "test";
    const mockPaperId = 3;
    const mockPage = 3;
    let mockMode: SEARCH_FETCH_ITEM_MODE;
    let mockParams: FetchSearchItemsParams;
    mockParams;

    it("should return getPapers action when mode is QUERY", async () => {
      mockMode = SEARCH_FETCH_ITEM_MODE.QUERY;
      mockParams = {
        query: mockQuery,
        page: mockPage,
        mode: mockMode,
      };
      await store.dispatch(Actions.fetchSearchItems(mockParams, mockCancelTokenSource));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS,
      });
    });

    it("should return getCitedPapers action when mode is CITED", async () => {
      mockMode = SEARCH_FETCH_ITEM_MODE.CITED;
      mockParams = {
        paperId: mockPaperId,
        page: mockPage,
        mode: mockMode,
      };
      await store.dispatch(Actions.fetchSearchItems(mockParams, mockCancelTokenSource));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS,
      });
    });

    it("should return getReferencePapers action when mode is REFERENCES", async () => {
      mockMode = SEARCH_FETCH_ITEM_MODE.REFERENCES;
      mockParams = {
        paperId: mockPaperId,
        page: mockPage,
        mode: mockMode,
      };
      await store.dispatch(Actions.fetchSearchItems(mockParams, mockCancelTokenSource));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS,
      });
    });
  });
});
