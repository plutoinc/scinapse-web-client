import { Dispatch } from "redux";
import axios from "axios";
import { push } from "react-router-redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { SEARCH_SORTING } from "./records";
import { IGetPapersParams } from "../../api/article";
import ArticleAPI from "../../api/article";

export function changeSearchInput(searchInput: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
    payload: {
      searchInput,
    },
  };
}

export function handleSearchPush(searchInput: string) {
  return push(`/search?query=${searchInput}&page=1`);
}

export function changeSorting(sorting: SEARCH_SORTING) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING,
    payload: {
      sorting,
    },
  };
}

export function getPapers(params: IGetPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS });

    try {
      const paperData = await ArticleAPI.getPapers({
        page: params.page,
        text: params.text,
        cancelTokenSource: params.cancelTokenSource,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: paperData.papers,
          nextPage: params.page + 1,
          isEnd: paperData.last,
          totalElements: paperData.totalElements,
          totalPages: paperData.totalPages,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Papers! ${err}`);

        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS });
      }
    }
  };
}
