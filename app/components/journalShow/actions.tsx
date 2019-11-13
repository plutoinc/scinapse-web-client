import axios, { CancelToken } from 'axios';
import { Dispatch } from 'redux';
import JournalAPI, { GetPapersParams } from '../../api/journal';
import { ActionCreators } from '../../actions/actionTypes';
import alertToast from '../../helpers/makePlutoToastAction';
import PlutoAxios from '../../api/pluto';
import { CommonError } from '../../model/error';

export function getJournal(journalId: string, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetJournal());
      const journal = await JournalAPI.getJournal(journalId, cancelToken);
      dispatch(ActionCreators.addEntity(journal));
      dispatch(
        ActionCreators.succeededToGetJournal({
          journalId: journal.result,
        })
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);
        alertToast({
          type: 'error',
          message: error.message,
        });
        dispatch(ActionCreators.failedToGetJournal({ statusCode: (error as CommonError).status }));
      }
    }
  };
}

export function getPapers(params: GetPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetJournalPapers());
      const res = await JournalAPI.getPapers(params);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetJournalPapers({
          paperIds: res.result,
          totalPage: res.totalPages,
          currentPage: res.page,
          paperCount: res.numberOfElements,
          filteredPaperCount: res.totalElements,
          searchKeyword: params.query || '',
        })
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);
        alertToast({
          type: 'error',
          message: error.message,
        });
        dispatch(ActionCreators.failedToGetJournalPapers());
      }
    }
  };
}
