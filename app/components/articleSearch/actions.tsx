import { Dispatch } from 'redux';
import axios from 'axios';
import { ACTION_TYPES } from '../../actions/actionTypes';
import { SearchPapersParams } from '../../api/types/paper';
import PapersQueryFormatter from '../../helpers/searchQueryManager';
import ActionTicketManager from '../../helpers/actionTicketManager';
import SearchAPI from '../../api/search';
import PlutoAxios from '../../api/pluto';
import { CommonError } from '../../model/error';
import { GetAuthorsParam } from '../../api/types/author';

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
    const filters = PapersQueryFormatter.objectifyPaperFilter(params.filter);

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

      const searchResult = res.data.content;
      const actionLabel = !searchResult || searchResult.length === 0 ? '0' : String(searchResult.length);

      ActionTicketManager.trackTicket({
        pageType: 'searchResult',
        actionType: 'view',
        actionArea: 'paperList',
        actionTag: 'pageView',
        actionLabel,
      });

      return searchResult;
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);

        dispatch({
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS,
          payload: {
            statusCode: (error as CommonError).status,
          },
        });

        ActionTicketManager.trackTicket({
          pageType: 'searchResult',
          actionType: 'view',
          actionArea: 'paperList',
          actionTag: 'pageView',
          actionLabel: 'error',
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
