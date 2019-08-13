import { Dispatch } from 'redux';
import RecommendationAPI from '../api/recommendation';
import { ActionCreators } from './actionTypes';
import {
  ALREADY_VISITED_RECOMMEND_PAPERS,
  BASED_ACTIVITY_COUNT_STORE_KEY,
} from '../components/recommendPapersDialog/recommendPapersDialogConstants';
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
    const prevActionCount = store.get(BASED_ACTIVITY_COUNT_STORE_KEY);

    if (!isLoggedIn) return;

    RecommendationAPI.addPaperToRecommendationPool(paperId);

    if (prevActionCount === ALREADY_VISITED_RECOMMEND_PAPERS) return;

    const currentActionCount = parseInt(prevActionCount || '0', 10);
    const nextActionCount = setActionCount(currentActionCount);

    switch (nextActionCount) {
      case 2:
      case 5:
      case 13: {
        try {
          const recommendPapers = await RecommendationAPI.getPapersFromUserAction();

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
