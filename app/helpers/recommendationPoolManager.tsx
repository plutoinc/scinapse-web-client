import { uniq } from 'lodash';
import { BASED_ACTIVITY_PAPER_IDS_FOR_NON_USER_KEY } from '../components/recommendPapersDialog/recommendPapersDialogConstants';
import RecommendationAPI from '../api/recommendation';
const store = require('store');

export async function addPaperToRecommendation(isLoggedIn: boolean, paperId: number) {
  let newPaperIds;

  if (!isLoggedIn) {
    const basedPaperIdsForNonUser = store.get(BASED_ACTIVITY_PAPER_IDS_FOR_NON_USER_KEY) || [];
    newPaperIds = uniq([paperId, ...basedPaperIdsForNonUser]).slice(0, 20);
    store.set(BASED_ACTIVITY_PAPER_IDS_FOR_NON_USER_KEY, newPaperIds);
  } else {
    RecommendationAPI.addPaperToRecommendationPool(paperId);
  }
}
