const mockFn = jest.fn();

jest.mock("../../../api/paper");
jest.mock("../../../api/comment");
jest.mock("../../../helpers/handleGA");
jest.mock("normalize.css", () => {});
jest.mock("../../../helpers/handleGA", () => {
  return {
    trackSearch: mockFn,
    trackEvent: mockFn,
  };
});
jest.unmock("../actions");

import { List } from "immutable";
import { push } from "react-router-redux";
import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { GetRefOrCitedPapersParams, GetPapersParams } from "../../../api/types/paper";
import { GetCommentsParams, PostCommentParams, DeleteCommentParams } from "../../../api/types/comment";
import AxiosCancelTokenManager from "../../../helpers/axiosCancelTokenManager";
import { recordifyComment, initialComment } from "../../../model/comment";
import { RECORD } from "../../../__mocks__";
import { AvailableCitationType } from "../../paperShow/records";

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
    mockFn.mockClear();
  });

  describe("setActiveCitationDialogPaperId action", () => {
    it("should return ARTICLE_SEARCH_SET_ACTIVE_CITATION_DIALOG_PAPER_ID action", () => {
      const mockPaperId = 123;
      store.dispatch(Actions.setActiveCitationDialogPaperId(mockPaperId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_SET_ACTIVE_CITATION_DIALOG_PAPER_ID,
        payload: {
          paperId: mockPaperId,
        },
      });
    });
  });

  describe("toggleCitationDialog action", () => {
    it("should return ARTICLE_SEARCH_TOGGLE_CITATION_DIALOG action", () => {
      store.dispatch(Actions.toggleCitationDialog());
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_CITATION_DIALOG,
      });
    });
  });

  describe("handleClickCitationTab action", () => {
    it("should return ARTICLE_SEARCH_CLICK_CITATION_TAB action with payload that contains tab and paperId", () => {
      const mockCitationType = AvailableCitationType.APA;
      store.dispatch(Actions.handleClickCitationTab(mockCitationType));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_CLICK_CITATION_TAB,
        payload: {
          tab: mockCitationType,
        },
      });
    });
  });

  describe("getCitationText action", () => {
    const mockPaperId = 123;
    const mockCitationType = AvailableCitationType.APA;
    let resultActions: any[];

    describe("when fetching was succeeded", () => {
      beforeEach(() => {
        store.dispatch(
          Actions.getCitationText({
            type: mockCitationType,
            paperId: mockPaperId,
          }),
        );
        resultActions = store.getActions();
      });

      it("should dispatch ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT action with proper payload", () => {
        expect(resultActions[0]).toEqual({
          type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT,
        });
      });

      it("should dispatch ARTICLE_SEARCH_SUCCEEDED_GET_CITATION_TEXT action", () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_GET_CITATION_TEXT);
      });

      it("should dispatch with proper citationText", () => {
        expect(resultActions[1].payload.citationText).toContain("@article{Kirbach_2002");
      });
    });

    describe("when fetching was failed", () => {
      beforeEach(() => {
        store.dispatch(
          Actions.getCitationText({
            type: mockCitationType,
            paperId: 0,
          }),
        );
        resultActions = store.getActions();
      });

      it("should dispatch ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT action with proper payload", () => {
        expect(resultActions[0]).toEqual({
          type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT,
        });
      });

      it("should dispatch ARTICLE_SEARCH_FAILED_TO_GET_CITATION_TEXT action", () => {
        expect(resultActions[1]).toEqual({
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITATION_TEXT,
        });
      });
    });
  });

  describe("toggleFilterBox action", () => {
    it("should return ARTICLE_SEARCH_TOGGLE_FILTER_BOX action with payload of target type", () => {
      store.dispatch(Actions.toggleFilterBox(Actions.FILTER_BOX_TYPE.PUBLISHED_YEAR));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX,
        payload: {
          type: Actions.FILTER_BOX_TYPE.PUBLISHED_YEAR,
        },
      });
    });
  });

  describe("toggleExpandingFilter action", () => {
    it("should return ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX action with payload of target type", () => {
      store.dispatch(Actions.toggleExpandingFilter(Actions.FILTER_TYPE_HAS_EXPANDING_OPTION.FOS));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX,
        payload: {
          type: Actions.FILTER_TYPE_HAS_EXPANDING_OPTION.FOS,
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

  describe("handleSearchPush action", () => {
    describe("if searchInput.length < 2", () => {
      it("should not change location to the search result page", () => {
        const mockInValidSearchInput = "t";

        store.dispatch(Actions.handleSearchPush(mockInValidSearchInput));
        expect(store.getActions().length).toBe(0);
      });
    });

    describe("if searchInput.length >= 2", () => {
      it("should return push to query", () => {
        const mockValidSearchInput = "tfsdfdsf";

        store.dispatch(Actions.handleSearchPush(mockValidSearchInput));

        const actions = store.getActions();
        expect(actions[0]).toEqual(
          push(
            `/search?${papersQueryFormatter.stringifyPapersQuery({
              query: mockValidSearchInput,
              sort: "RELEVANCE",
              filter: {},
              page: 1,
            })}`,
          ),
        );
      });
    });
  });

  describe("getCitedPapers action", () => {
    const mockPage = 3;
    const mockFilter = "year=2018";
    const mockPaperId = 23;

    beforeEach(async () => {
      const mockParams: GetRefOrCitedPapersParams = {
        page: mockPage,
        filter: mockFilter,
        paperId: mockPaperId,
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
            papers: List([RECORD.PAPER]),
            nextPage: mockPage + 1,
            isEnd: true,
            totalElements: 0,
            totalPages: 0,
            numberOfElements: 0,
            targetPaper: RECORD.PAPER,
          },
        }),
      );
    });
  });

  describe("getReferencePapers action", () => {
    const mockPage = 3;
    const mockFilter = "year=2018";
    const mockPaperId = 23;

    beforeEach(async () => {
      const mockParams: GetRefOrCitedPapersParams = {
        page: mockPage,
        filter: mockFilter,
        paperId: mockPaperId,
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
            papers: List([RECORD.PAPER]),
            nextPage: mockPage + 1,
            isEnd: true,
            totalElements: 0,
            totalPages: 0,
            numberOfElements: 0,
            targetPaper: RECORD.PAPER,
          },
        }),
      );
    });
  });

  describe("getMoreComments action", () => {
    const mockPage = 3;
    const mockPaperId = 3;

    beforeEach(async () => {
      const mockParams: GetCommentsParams = {
        page: mockPage,
        paperId: mockPaperId,
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

    it("should return ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS type action", () => {
      const actions = store.getActions();
      expect(actions[1].type).toEqual(ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS);
    });

    it("should return payload's comments property properly", () => {
      const actions = store.getActions();
      expect(actions[1].payload.comments.toJS()).toEqual(List([RECORD.COMMENT]).toJS());
    });

    it("should return payload's nextPage property properly", () => {
      const actions = store.getActions();
      expect(actions[1].payload.nextPage).toEqual(mockPage + 1);
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

  describe("handleCommentPost action", () => {
    const mockPaperId = 3;
    const mockComment = "test";

    beforeEach(async () => {
      const mockParams: PostCommentParams = {
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
      const expectComment = { ...initialComment, ...{ comment: mockComment } };

      expect(JSON.stringify(actions[1])).toEqual(
        JSON.stringify({
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT,
          payload: {
            comment: recordifyComment(expectComment),
            paperId: mockPaperId,
          },
        }),
      );
    });
  });

  describe("deleteComment action", () => {
    const mockPaperId = 3;
    const mockCommentId = 4;

    beforeEach(async () => {
      const mockParams: DeleteCommentParams = {
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
    const mockPage = 3;
    const mockFilter = "mockFilter";
    const mockSort = "RELEVANCE";
    let mockParams: GetPapersParams;

    it("should return getPapers action when mode is QUERY", async () => {
      mockParams = {
        query: mockQuery,
        page: mockPage,
        filter: mockFilter,
        cancelTokenSource: mockCancelTokenSource,
        sort: mockSort,
      };
      await store.dispatch(Actions.fetchSearchItems(mockParams));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS,
      });
    });
  });

  describe("changeRangeInput action", () => {
    it("should return ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT action with type and year payload", () => {
      const mockRangeType = Actions.FILTER_RANGE_TYPE.FROM;
      const mockYear = 2000;

      store.dispatch(
        Actions.changeRangeInput({
          rangeType: mockRangeType,
          numberValue: mockYear,
          type: Actions.FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
        }),
      );
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT,
        payload: {
          rangeType: mockRangeType,
          numberValue: mockYear,
          type: Actions.FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
        },
      });
    });
  });
});
