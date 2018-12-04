import { Dispatch } from "redux";
import axios, { CancelToken } from "axios";
import { push } from "connected-react-router";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { GetPapersParams, GetPapersResult, GetAggregationParams } from "../../api/types/paper";
import PaperAPI from "../../api/paper";
import CompletionAPI from "../../api/completion";
import alertToast from "../../helpers/makePlutoToastAction";
import PapersQueryFormatter from "../../helpers/papersQueryFormatter";
import { trackEvent } from "../../helpers/handleGA";

export enum FILTER_RANGE_TYPE {
  FROM,
  TO,
}

export enum FILTER_TYPE_HAS_RANGE {
  PUBLISHED_YEAR,
  JOURNAL_IF,
}

export enum FILTER_TYPE_HAS_EXPANDING_OPTION {
  FOS,
  JOURNAL,
}

export enum FILTER_BOX_TYPE {
  PUBLISHED_YEAR,
  JOURNAL_IF,
  FOS,
  JOURNAL,
}

export function toggleFilterBox(type: FILTER_BOX_TYPE) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX,
    payload: {
      type,
    },
  };
}

export function toggleExpandingFilter(type: FILTER_TYPE_HAS_EXPANDING_OPTION) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX,
    payload: {
      type,
    },
  };
}

export interface ChangeRangeInputParams {
  type: FILTER_TYPE_HAS_RANGE;
  rangeType: FILTER_RANGE_TYPE;
  numberValue: number | undefined;
}

export function changeRangeInput(params: ChangeRangeInputParams) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT,
    payload: params,
  };
}

export function changeSearchInput(searchInput: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
    payload: {
      searchInput,
    },
  };
}

export function handleSearchPush(searchInput: string) {
  return (dispatch: Dispatch<any>) => {
    if (searchInput.length < 2) {
      alertToast({
        type: "error",
        message: "You should search more than 2 characters.",
      });
    } else {
      trackEvent({ category: "Search", action: "Query", label: "" });
      dispatch(
        push(
          `/search?${PapersQueryFormatter.stringifyPapersQuery({
            query: searchInput,
            sort: "RELEVANCE",
            filter: {},
            page: 1,
          })}`
        )
      );
    }
  };
}

function logFailedSearchQuery(stringifiedSearchQuery: string) {
  trackEvent({
    category: "Search",
    action: "Not Found",
    label: stringifiedSearchQuery,
  });
}

export function getAggregationData(params: GetAggregationParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_AGGREGATION_DATA,
    });

    try {
      const fetchResult = await PaperAPI.getAggregation(params);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_AGGREGATION_DATA,
        payload: {
          aggregationData: fetchResult.data,
          available: fetchResult.meta.available,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch({
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_AGGREGATION_DATA,
        });
      }
    }
  };
}

export function fetchSearchPapers(params: GetPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    const filters = PapersQueryFormatter.objectifyPapersFilter(params.filter);

    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS,
      payload: {
        query: params.query,
        sort: params.sort,
        filters,
      },
    });

    try {
      const papersData: GetPapersResult = await PaperAPI.getPapers(params);

      if (papersData.papers.length === 0) {
        logFailedSearchQuery(JSON.stringify(params));
      }

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: papersData.papers,
          nextPage: params.page + 1,
          isEnd: papersData.last,
          totalElements: papersData.totalElements,
          totalPages: papersData.totalPages,
          numberOfElements: papersData.numberOfElements,
        },
      });

      return papersData.papers;
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: "Temporarily Unavailable",
        });
        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS });
      }
    }
  };
}

export function getSuggestionKeyword(query: string, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_SUGGESTION_KEYWORD,
    });

    try {
      const keyword = await CompletionAPI.getSuggestionKeyword(query, cancelToken);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_SUGGESTION_KEYWORD,
        payload: {
          keyword,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch({
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_SUGGESTION_KEYWORD,
        });
      }
    }
  };
}
