import { Dispatch } from 'redux';
import RecommendationAPI from '../../api/recommendation';
import { RECOMMENDED_PAPER_LOGGING_LENGTH_FOR_NON_USER, RECOMMENDED_PAPER_LOGGING_FOR_NON_USER } from './constants';
import { RecommendationActionParams } from '../../api/types/recommendation';
import { checkAuthStatus } from '../auth/actions';
const store = require('store');

export const addPaperToRecommendPool = (recAction: RecommendationActionParams) => {
  return async (dispatch: Dispatch<any>) => {
    const recTempPool = store.get(RECOMMENDED_PAPER_LOGGING_FOR_NON_USER);

    const auth = await checkAuthStatus()(dispatch);
    const isLoggedIn = auth && auth.loggedIn;

    if (!isLoggedIn) {
      const newRecActionLogs: RecommendationActionParams[] = [recAction, ...recTempPool].slice(
        0,
        RECOMMENDED_PAPER_LOGGING_LENGTH_FOR_NON_USER
      );

      store.set(RECOMMENDED_PAPER_LOGGING_FOR_NON_USER, newRecActionLogs);
    } else {
      RecommendationAPI.addPaperToRecommendationPool({ paper_id: recAction.paperId, action: recAction.action });
    }
  };
};
