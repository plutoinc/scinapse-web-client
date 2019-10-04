import { uniqWith, isEqual } from 'lodash';
import { RECOMMENDED_PAPER_LOGGING_FOR_NON_USER } from '../components/recommendPool/constants';
import RecommendationAPI, { RecommendationAction } from '../api/recommendation';
const store = require('store');

export async function addPaperToRecommendation(isLoggedIn: boolean, recAction: RecommendationAction) {
  let newRecActionLogs;

  if (!isLoggedIn) {
    const recommendedPaperLogsForNonUser = store.get(RECOMMENDED_PAPER_LOGGING_FOR_NON_USER) || [];
    newRecActionLogs = uniqWith([recAction, ...recommendedPaperLogsForNonUser], isEqual).slice(0, 20);
    store.set(RECOMMENDED_PAPER_LOGGING_FOR_NON_USER, newRecActionLogs);
  } else {
    RecommendationAPI.addPaperToRecommendationPool(recAction);
  }
}
