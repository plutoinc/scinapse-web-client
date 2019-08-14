import { Dispatch } from 'redux';
import { uniq } from 'lodash';
import RecommendationAPI from '../api/recommendation';
import { ActionCreators } from './actionTypes';
import {
  ALREADY_VISITED_RECOMMEND_PAPERS,
  BASED_ACTIVITY_COUNT_STORE_KEY,
  BASED_ACTIVITY_PAPER_IDS_FOR_NON_USER_KEY,
} from '../components/recommendPapersDialog/recommendPapersDialogConstants';
import { getUserGroupName } from '../helpers/abTestHelper';
import { RANDOM_RECOMMENDATION_EXPERIMENT } from '../constants/abTestGlobalValue';
const store = require('store');

const MAX_COUNT = 16;

function setActionCount(count: number): number {
  let nextCount;
  if (count === MAX_COUNT) {
    nextCount = 1;
  } else {
    nextCount = count + 1;
  }

  store.set(BASED_ACTIVITY_COUNT_STORE_KEY, String(nextCount));
  return nextCount;
}

export function addPaperToRecommendation(isLoggedIn: boolean, paperId: number, actionArea: string) {
  return async (dispatch: Dispatch<any>) => {
    const doRandomizedRec = getUserGroupName(RANDOM_RECOMMENDATION_EXPERIMENT) === 'random';
    const prevActionCount = store.get(BASED_ACTIVITY_COUNT_STORE_KEY);
    let newPaperIds;

    if (!isLoggedIn) {
      const basedPaperIdsForNonUser = store.get(BASED_ACTIVITY_PAPER_IDS_FOR_NON_USER_KEY) || [];
      newPaperIds = uniq([paperId, ...basedPaperIdsForNonUser]).slice(0, 20);
      store.set(BASED_ACTIVITY_PAPER_IDS_FOR_NON_USER_KEY, newPaperIds);
    } else {
      RecommendationAPI.addPaperToRecommendationPool(paperId);
    }

    if (prevActionCount === ALREADY_VISITED_RECOMMEND_PAPERS) return;

    const currentActionCount = parseInt(prevActionCount || '0', 10);
    const nextActionCount = setActionCount(currentActionCount);

    switch (nextActionCount) {
      case 2:
      case 5:
      case 13: {
        try {
          const recommendPapers = await RecommendationAPI.getPapersFromUserAction(doRandomizedRec);

          if (!recommendPapers || recommendPapers.length === 0) return;

          dispatch(ActionCreators.openRecommendPapersDialog({ actionArea }));
        } catch (err) {
          console.error(err);
        }
        break;
      }
    }
  };
}
