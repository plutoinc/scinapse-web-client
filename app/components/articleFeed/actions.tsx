import { Dispatch } from "redux";
import ArticleAPI from "../../api/article";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { FEED_SORTING_OPTIONS, FEED_CATEGORIES } from "./records";
import alertToast from "../../helpers/makePlutoToastAction";
import { IGetArticlesParams } from "../../api/article";

export function getArticles(params: IGetArticlesParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_FEED_START_TO_GET_ARTICLES });

    try {
      const articleData = await ArticleAPI.getArticles({
        page: params.page,
        size: params.size,
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
      alertToast({
        type: "error",
        message: err.message || err,
      });

      dispatch({ type: ACTION_TYPES.ARTICLE_FEED_FAILED_TO_GET_ARTICLES });
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

export function changeSortingOption(sortingOption: FEED_SORTING_OPTIONS) {
  return {
    type: ACTION_TYPES.ARTICLE_FEED_CHANGE_SORTING_OPTION,
    payload: {
      sortingOption,
    },
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
