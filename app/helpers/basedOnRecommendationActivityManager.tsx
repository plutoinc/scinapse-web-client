import homeAPI from '../api/home';
import * as Cookies from 'js-cookie';
import { Dispatch } from 'redux';
import { ActionCreators } from '../actions/actionTypes';
import { getUserGroupName } from './abTestHelper';
import { KNOWLEDGE_BASED_RECOMMEND_TEST } from '../constants/abTestGlobalValue';
export const BASED_ACTIVITY_COUNT_COOKIE_KEY = 'basedActivityCount';

export function addBasedOnRecommendationActivity(isLoggedIn: boolean, paperId: number) {
  return (dispatch: Dispatch<any>) => {
    if (!isLoggedIn || getUserGroupName(KNOWLEDGE_BASED_RECOMMEND_TEST) === 'control') return;

    homeAPI.addBasedOnRecommendationPaper(paperId);

    const rawActivityCount = Cookies.get(BASED_ACTIVITY_COUNT_COOKIE_KEY);
    if (rawActivityCount === 'null') return;

    const activityCount = parseInt(rawActivityCount || '0', 10) + 1;

    switch (activityCount) {
      case 2:
      case 5:
      case 13:
        dispatch(ActionCreators.openKnowledgeBaseNoti());
        break;
    }

    Cookies.set(BASED_ACTIVITY_COUNT_COOKIE_KEY, String(activityCount));
  };
}
