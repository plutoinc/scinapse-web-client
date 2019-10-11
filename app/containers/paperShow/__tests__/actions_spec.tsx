jest.mock('../../../api/paper');
jest.mock('../../../api/comment');
jest.mock('../../../helpers/makePlutoToastAction');
jest.unmock('../../../actions/paperShow');

import axios from 'axios';
import { getPaper, getReferencePapers } from '../../../actions/paperShow';
import { generateMockStore } from '../../../__tests__/mockStore';
import { ACTION_TYPES } from '../../../actions/actionTypes';
import { GetRefOrCitedPapersParams } from '../../../api/types/paper';

describe('Paper Show page actions', () => {
  let store: any;
  let resultActions: any[];

  beforeEach(() => {
    store = generateMockStore();
    store.clearActions();
  });

  describe('getPaper action creator', () => {
    describe('when succeed to get paper data', () => {
      beforeEach(async () => {
        const mockParams = {
          paperId: 123,
          cancelToken: axios.CancelToken.source().token,
        };

        await store.dispatch(getPaper(mockParams));
        resultActions = await store.getActions();
      });

      it('should dispatch PAPER_SHOW_START_TO_GET_PAPER action', () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER);
      });

      it('should dispatch GLOBAL_ADD_ENTITY action', () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.GLOBAL_ADD_ENTITY);
      });
    });
  });

  describe('getReferencePapers action creator', () => {
    describe("when succeed to get paper's reference paper data", () => {
      beforeEach(async () => {
        const mockParams: GetRefOrCitedPapersParams = {
          paperId: 123,
          page: 0,
          query: '',
          sort: null,
        };

        await store.dispatch(getReferencePapers(mockParams));
        resultActions = await store.getActions();
      });

      it('should dispatch PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS action', () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS);
      });

      it('should dispatch GLOBAL_ADD_ENTITY action', () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.GLOBAL_ADD_ENTITY);
      });
    });

    describe("when failed to get paper's reference paper data", () => {
      beforeEach(async () => {
        const mockParams: GetRefOrCitedPapersParams = {
          paperId: 0,
          page: 0,
          query: '',
          sort: null,
        };

        await store.dispatch(getReferencePapers(mockParams));
        resultActions = await store.getActions();
      });

      it('should dispatch PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS action', () => {
        expect(resultActions[0].type).toEqual(ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS);
      });

      it('should dispatch PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS action', () => {
        expect(resultActions[1].type).toEqual(ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS);
      });
    });
  });
});
