const mockFn = jest.fn();
jest.mock('../../../api/paper');
jest.mock('../../../api/completion');
jest.mock('../../../api/comment');
jest.mock('../../../helpers/handleGA');
jest.mock('../../../api/search');
jest.mock('../../../helpers/makePlutoToastAction');
// tslint:disable-next-line:no-empty
jest.mock('normalize.css', () => {});
jest.mock('../../../helpers/handleGA', () => {
  return {
    trackEvent: mockFn,
  };
});
jest.unmock('../actions');

import axios from 'axios';
import * as Actions from '../actions';
import { generateMockStore } from '../../../__tests__/mockStore';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import { SearchPapersParams } from '../../../api/types/paper';

describe('articleSearch actions', () => {
  let store: any;
  let tempWindowAlertFunc: any;

  beforeAll(() => {
    tempWindowAlertFunc = window.alert;
  });

  afterAll(() => {
    window.alert = tempWindowAlertFunc;
  });

  beforeEach(() => {
    store = generateMockStore();
    store.clearActions();
    mockFn.mockClear();
  });

  describe('changeSearchInput action', () => {
    it('should return ARTICLE_SEARCH_CHANGE_SEARCH_INPUT action with searchInput payload', () => {
      const mockSearchInput = 'paper';
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

  describe('changeSearchInput action', () => {
    it('should return ARTICLE_SEARCH_CHANGE_SEARCH_INPUT action with searchInput payload', () => {
      const mockSearchInput = 'paper';
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

  describe('fetchSearchItems action', () => {
    const mockQuery = 'test';
    const mockPage = 3;
    const mockSort = 'RELEVANCE';
    let mockParams: SearchPapersParams;

    it('should return getPapers action when mode is QUERY', async () => {
      mockParams = {
        query: mockQuery,
        page: mockPage,
        filter: '',
        cancelToken: axios.CancelToken.source().token,
        sort: mockSort,
        weightedCitation: true,
      };
      await store.dispatch(Actions.searchPapers(mockParams));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS,
        payload: {
          filters: {
            fos: [],
            journal: [],
            yearFrom: 0,
            yearTo: 0,
          },
          query: 'test',
          sort: 'RELEVANCE',
        },
      });
    });
  });
});
