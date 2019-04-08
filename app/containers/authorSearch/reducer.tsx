import { AuthorSearchState, AUTHOR_SEARCH_INITIAL_STATE } from "./records";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { AuthorSearchResult } from "../../api/search";

export function reducer(
  state: AuthorSearchState = AUTHOR_SEARCH_INITIAL_STATE,
  action: ReduxAction<any>
): AuthorSearchState {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_AUTHORS: {
      return {
        ...state,
        isLoading: true,
        pageErrorCode: null,
        searchInput: action.payload.query,
        sort: action.payload.sort,
      };
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_AUTHORS: {
      const payload: AuthorSearchResult = action.payload;

      if (payload.data.page) {
        return {
          ...state,
          isLoading: false,
          pageErrorCode: null,
          isFirst: payload.data.page.first,
          isEnd: payload.data.page.last,
          page: payload.data.page.page,
          totalElements: payload.data.page.totalElements,
          totalPages: payload.data.page.totalPages,
          searchItemsToShow: payload.data.content,
        };
      }

      return state;
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_AUTHORS: {
      return {
        ...state,
        isLoading: false,
        pageErrorCode: action.payload.statusCode,
      };
    }

    default: {
      return state;
    }
  }
}
