import axios, { CancelTokenSource } from "axios";
import { Dispatch } from "redux";
import ArticleAPI from "../../api/article";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "./records";
import { IGetArticlesParams } from "../../api/article";

export function getArticles(params: IGetArticlesParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_FEED_START_TO_GET_ARTICLES });

    try {
      const articleData = await ArticleAPI.getArticles({
        page: params.page,
        size: params.size,
        sort: params.sort,
        ids: params.ids ? params.ids : [],
        cancelTokenSource: params.cancelTokenSource,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_FEED_SUCCEEDED_TO_GET_ARTICLES,
        payload: {
          articles: articleData.articles,
          nextPage: params.page + 1,
          isEnd: articleData.last,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Articles! ${err}`);

        dispatch({ type: ACTION_TYPES.ARTICLE_FEED_FAILED_TO_GET_ARTICLES });
      }
    }
  };
}

export function changeCategory(category: FEED_CATEGORIES) {
  return {
    type: ACTION_TYPES.ARTICLE_FEED_CHANGE_CATEGORY,
    payload: {
      category,
    },
  };
}

export function changeSortingOption(sortingOption: FEED_SORTING_OPTIONS, cancelTokenSource: CancelTokenSource) {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_FEED_CHANGE_SORTING_OPTION,
      payload: {
        sortingOption,
      },
    });

    dispatch(
      getArticles({
        page: 0,
        sort: sortingOption,
        cancelTokenSource,
      }),
    );
  };
}

export function openCategoryPopover(element: React.ReactInstance) {
  return {
    type: ACTION_TYPES.ARTICLE_FEED_OPEN_CATEGORY_POPOVER,
    payload: {
      element,
    },
  };
}

export function closeCategoryPopover() {
  return {
    type: ACTION_TYPES.ARTICLE_FEED_CLOSE_CATEGORY_POPOVER,
  };
}
