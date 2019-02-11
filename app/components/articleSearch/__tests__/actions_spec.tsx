const mockFn = jest.fn();
jest.mock("../../../api/paper");
jest.mock("../../../api/completion");
jest.mock("../../../api/comment");
jest.mock("../../../helpers/handleGA");
jest.mock("../../../api/search");
jest.mock("../../../helpers/makePlutoToastAction");
// tslint:disable-next-line:no-empty
jest.mock("normalize.css", () => {});
jest.mock("../../../helpers/handleGA", () => {
  return {
    trackEvent: mockFn,
  };
});
jest.unmock("../actions");

import axios from "axios";
import * as Actions from "../actions";
import { generateMockStore } from "../../../__tests__/mockStore";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { GetPapersParams } from "../../../api/types/paper";
import {
  FILTER_TYPE_HAS_EXPANDING_OPTION,
  FILTER_RANGE_TYPE,
  FILTER_TYPE_HAS_RANGE,
} from "../../../constants/paperSearch";

describe("articleSearch actions", () => {
  let store: any;
  let tempWindowAlertFunc: any;

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
      store.dispatch(Actions.toggleFilterBox("PUBLISHED_YEAR"));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX,
        payload: {
          type: "PUBLISHED_YEAR",
        },
      });
    });
  });

  describe("toggleExpandingFilter action", () => {
    it("should return ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX action with payload of target type", () => {
      store.dispatch(Actions.toggleExpandingFilter(FILTER_TYPE_HAS_EXPANDING_OPTION.FOS));
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX,
        payload: {
          type: FILTER_TYPE_HAS_EXPANDING_OPTION.FOS,
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
        cancelToken: axios.CancelToken.source().token,
        sort: mockSort,
      };
      await store.dispatch(Actions.fetchSearchPapers(mockParams));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS,
        payload: {
          filters: {
            fos: [],
            journal: [],
            journalIFFrom: undefined,
            journalIFTo: undefined,
            yearFrom: undefined,
            yearTo: undefined,
          },
          query: "test",
          sort: "RELEVANCE",
        },
      });
    });
  });

  describe("changeRangeInput action", () => {
    it("should return ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT action with type and year payload", () => {
      const mockRangeType = FILTER_RANGE_TYPE.FROM;
      const mockYear = 2000;

      store.dispatch(
        Actions.changeRangeInput({
          rangeType: mockRangeType,
          numberValue: mockYear,
          type: FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
        })
      );
      const actions = store.getActions();

      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT,
        payload: {
          rangeType: mockRangeType,
          numberValue: mockYear,
          type: FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
        },
      });
    });
  });
});
