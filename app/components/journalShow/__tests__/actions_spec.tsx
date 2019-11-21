jest.mock('../../../api/journal');
jest.mock('../../../helpers/makePlutoToastAction');

import { RAW } from '../../../__mocks__';
import axios from 'axios';
import * as Actions from '../actions';
import { generateMockStore, EnhancedMockStore } from '../../../__tests__/mockStore';
import { ACTION_TYPES } from '../../../actions/actionTypes';

describe('Journal Show actions spec', () => {
  let store: EnhancedMockStore;
  let actions: any;

  beforeEach(() => {
    store = generateMockStore();
    store.clearActions();
  });

  describe('getJournal Action', () => {
    describe('when succeed to fetch data', () => {
      beforeEach(async () => {
        await store.dispatch(Actions.getJournal('2764552960', axios.CancelToken.source().token));
        actions = store.getActions();
      });

      it('should return JOURNAL_SHOW_START_TO_GET_JOURNAL', async () => {
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_JOURNAL,
        });
      });

      it('should return GLOBAL_ADD_ENTITY with proper payload', async () => {
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.GLOBAL_ADD_ENTITY,
          payload: {
            entities: {
              journals: {
                '2764552960': {
                  id: "2764552960",
                  title: 'Applied Mathematics and Computation',
                  issn: null,
                  webPage: null,
                  impactFactor: null,
                  paperCount: 19555,
                  citationCount: 253265,
                  fosList: [
                    { id: '33923547', name: 'Mathematics' },
                    { id: '48753275', name: 'Numerical analysis' },
                    { id: '126255220', name: 'Mathematical optimization' },
                    { id: '134306372', name: 'Mathematical analysis' },
                    { id: '182310444', name: 'Boundary value problem' },
                  ],
                  fullTitle: 'Applied Mathematics and Computation',
                },
              },
            },
            result: '2764552960',
          },
        });
      });

      it('should return JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL with proper payload', async () => {
        expect(actions[2]).toEqual({
          type: ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL,
          payload: { journalId: '2764552960' },
        });
      });
    });

    describe('when failed to fetch data', () => {
      beforeEach(async () => {
        await store.dispatch(Actions.getJournal('', axios.CancelToken.source().token));
        actions = store.getActions();
      });

      it('should return JOURNAL_SHOW_START_TO_GET_JOURNAL', async () => {
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_JOURNAL,
        });
      });

      it('should return JOURNAL_SHOW_FAILED_TO_GET_JOURNAL with proper payload', async () => {
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_JOURNAL,
          payload: {
            statusCode: undefined,
          },
        });
      });
    });
  });

  describe('getPapers Action', () => {
    describe('when succeed to fetch data', () => {
      beforeEach(async () => {
        await store.dispatch(
          Actions.getPapers({ journalId: '2764552960', cancelToken: axios.CancelToken.source().token })
        );
        actions = store.getActions();
      });

      it('should return JOURNAL_SHOW_START_TO_GET_PAPERS', () => {
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_PAPERS,
        });
      });

      it('should return GLOBAL_ADD_ENTITY', () => {
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.GLOBAL_ADD_ENTITY,
          payload: {
            entities: { papers: { '8107': RAW.JOURNAL_PAPERS_RESPONSE.data.content[0] } },
            result: ['8107'],
            size: 10,
            page: 1,
            first: true,
            last: true,
            numberOfElements: 1,
            totalPages: 1,
            totalElements: 1,
          },
        });
      });

      it('should return JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS', () => {
        expect(actions[2]).toEqual({
          type: ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS,
          payload: {
            currentPage: 1,
            paperCount: 1,
            paperIds: ['8107'],
            totalPage: 1,
            filteredPaperCount: 1,
            searchKeyword: '',
          },
        });
      });
    });

    describe('when failed to fetch data', () => {
      beforeEach(async () => {
        await store.dispatch(Actions.getPapers({ journalId: '', cancelToken: axios.CancelToken.source().token }));
        actions = store.getActions();
      });

      it('should return JOURNAL_SHOW_START_TO_GET_PAPERS', () => {
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_PAPERS,
        });
      });

      it('should return JOURNAL_SHOW_FAILED_TO_GET_PAPERS', () => {
        expect(actions[1]).toEqual({
          type: ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_PAPERS,
        });
      });
    });
  });
});
