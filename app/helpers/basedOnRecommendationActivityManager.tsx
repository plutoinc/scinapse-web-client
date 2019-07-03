import homeAPI from '../api/home';
import * as Cookies from 'js-cookie';
import { Dispatch } from 'redux';
import { ActionCreators } from '../actions/actionTypes';
import { getUserGroupName } from './abTestHelper';
import { KNOWLEDGE_BASED_RECOMMEND_TEST } from '../constants/abTestGlobalValue';
export const BASED_ACTIVITY_COUNT_COOKIE_KEY = 'basedActivityCount';

export function addBasedOnRecommendationActivity(isLoggedIn: boolean, paperId: number) {
  return async (dispatch: Dispatch<any>) => {
    if (!isLoggedIn || getUserGroupName(KNOWLEDGE_BASED_RECOMMEND_TEST) === 'control') return;

    let currentActivityCount;
    homeAPI.addBasedOnRecommendationPaper(paperId);

    const rawActivityCount = Cookies.get(BASED_ACTIVITY_COUNT_COOKIE_KEY);
    if (rawActivityCount === 'null') return;

    const activityCount = parseInt(rawActivityCount || '0', 10);

    if (activityCount === 16) {
      currentActivityCount = 1;
    } else {
      currentActivityCount = activityCount + 1;
    }

    Cookies.set(BASED_ACTIVITY_COUNT_COOKIE_KEY, String(currentActivityCount));

    switch (currentActivityCount) {
      case 2:
      case 5:
      case 13:
        await homeAPI
          .getBasedOnActivityPapers()
          .then(basedOnActivityPapers => {
            if (!basedOnActivityPapers || basedOnActivityPapers.length === 0) {
              return;
            }

            dispatch(ActionCreators.openKnowledgeBaseNoti());
          })
          .catch(err => {
            console.error(err);
          });
        break;
    }
  };
}
