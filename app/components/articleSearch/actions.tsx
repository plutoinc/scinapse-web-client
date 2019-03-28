import { Dispatch } from "redux";
import axios from "axios";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { SearchPapersParams } from "../../api/types/paper";
import PapersQueryFormatter from "../../helpers/papersQueryFormatter";
import SearchAPI from "../../api/search";
import { ChangeRangeInputParams } from "../../constants/paperSearch";
import PlutoAxios from "../../api/pluto";
import { CommonError } from "../../model/error";
import { GetAuthorsParam } from "../../api/types/author";
import memberAPI, { Filter, RawFilter } from "../../api/member";
import { PREVIOUS_FILTER } from "./constants";
const store = require("store");

export function toggleExpandingFilter() {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX,
  };
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

export function searchPapers(params: SearchPapersParams) {
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
      const res = await SearchAPI.search(params);
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: res,
      });

      return res.data.content;
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);

        dispatch({
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS,
          payload: {
            statusCode: (error as CommonError).status,
          },
        });
        throw err;
      }
    }
  };
}

export function fetchSearchAuthors(params: GetAuthorsParam) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_AUTHORS,
      payload: {
        query: params.query,
        sort: params.sort,
      },
    });

    try {
      const res = await SearchAPI.searchAuthor(params);
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_AUTHORS,
        payload: res,
      });

      return res.data.content;
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);

        dispatch({
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_AUTHORS,
          payload: {
            statusCode: (error as CommonError).status,
          },
        });
        throw err;
      }
    }
  };
}

export function fetchCurrentUserFilters() {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CURRENT_USER_FILTERS });

    try {
      const res = await memberAPI.getMyFilters();
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_CURRENT_USER_FILTERS,
        payload: {
          rawFilter: res,
        },
      });

      return res;
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CURRENT_USER_FILTERS,
        payload: {
          statusCode: (error as CommonError).status,
        },
      });
    }
  };
}

export function putCurrentUserFilters(params: RawFilter[]) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_PUT_CURRENT_USER_FILTERS });

    try {
      const res = await memberAPI.addMyFilters(params);
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_PUT_CURRENT_USER_FILTERS,
        payload: res,
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);

        dispatch({
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_PUT_CURRENT_USER_FILTERS,
          payload: {
            statusCode: (error as CommonError).status,
          },
        });
        throw err;
      }
    }
  };
}

export function selectFilter(params: Filter | null) {
  return (dispatch: Dispatch<any>) => {
    store.set(PREVIOUS_FILTER, params);
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_SET_FILTER_IN_FILTER_SET, payload: params });
  };
}
