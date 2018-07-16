const mockFn = jest.fn();
jest.mock("../../../api/paper");
jest.mock("../../../api/comment");
jest.mock("../../../helpers/handleGA");
jest.mock("../../../helpers/makePlutoToastAction");
// tslint:disable-next-line:no-empty
jest.mock("normalize.css", () => {});
jest.mock("../../../helpers/handleGA", () => {
  return {
    trackSearch: mockFn,
    trackEvent: mockFn,
  };
});
jest.unmock("../actions");

import { push } from "connected-react-router";
import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import papersQueryFormatter from "../../../helpers/papersQueryFormatter";
import { GetPapersParams } from "../../../api/types/paper";
import AxiosCancelTokenManager from "../../../helpers/axiosCancelTokenManager";

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
            })}`
          )
        );
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
        })
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
