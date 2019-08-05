import * as Cookies from 'js-cookie';
import { Dispatch } from 'redux';
import RecommendationAPI from '../api/recommendation';
import { ActionCreators } from './actionTypes';
export const BASED_ACTIVITY_COUNT_COOKIE_KEY = 'basedActivityCount';

const MAX_COUNT = 16;

function setActionCount(count: number): number {
  let nextCount;
  if (count === MAX_COUNT) {
    nextCount = 1;
  } else {
    nextCount = count + 1;
  }

  Cookies.set(BASED_ACTIVITY_COUNT_COOKIE_KEY, String(nextCount));
  return nextCount;
}

export function addPaperToRecommendation(isLoggedIn: boolean, paperId: number, actionArea: string) {
  return async (dispatch: Dispatch<any>) => {
    const prevActionCount = Cookies.get(BASED_ACTIVITY_COUNT_COOKIE_KEY);

    if (!isLoggedIn) return;

    RecommendationAPI.addPaperToRecommendationPool(paperId);

    if (prevActionCount === 'null') return;

    const currentActionCount = parseInt(prevActionCount || '0', 10);
    const nextActionCount = setActionCount(currentActionCount);

    switch (nextActionCount) {
      case 2:
      case 5:
      case 13: {
        await RecommendationAPI.getPapersFromUserAction()
          .then(basedOnActivityPapers => {
            if (!basedOnActivityPapers || basedOnActivityPapers.length === 0) {
              return;
            }

            dispatch(ActionCreators.openKnowledgeBaseNoti({ actionArea }));
          })
          .catch(err => {
            console.error(err);
          });
        break;
      }
    }
  };
}
