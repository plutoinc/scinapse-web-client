import axios, { CancelToken } from 'axios';
import PaperAPI from '../api/paper';
import { Dispatch } from 'redux';
import { ActionCreators } from './actionTypes';

export function getRelatedPapers(paperId: string, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetRelatedPapers());

    try {
      const res = await PaperAPI.getRelatedPapers({ paperId, cancelToken: cancelToken });
      dispatch(ActionCreators.addEntity(res));
      dispatch(ActionCreators.getRelatedPapers({ paperIds: res.result }));
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch(ActionCreators.failedToGetRelatedPapers());
      }
    }
  };
}
