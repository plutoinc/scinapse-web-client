import { Dispatch } from 'redux';
import RecommendationAPI from '../../api/recommendation';
import { AppState } from '../../reducers';
import { addPaperToTempPool, openRecommendOnboardingSnackbar } from './reducer';
import {
  ALREADY_VISITED_RECOMMEND_PAPERS,
  BASED_ACTIVITY_COUNT_STORE_KEY,
  RECOMMENDED_PAPER_LOGGING_LENGTH_FOR_NON_USER,
  RECOMMENDED_PAPER_LOGGING_FOR_NON_USER,
} from './constants';
import { RecommendationActionParams } from '../../api/types/recommendation';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { checkAuthStatus } from '../auth/actions';
const store = require('store');

const MAX_COUNT = 16;

interface AddPaperToRecommendPoolAndOpenDialogParams {
  recAction: RecommendationActionParams;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: string;
}

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

export const addPaperToRecommendPoolAndOpenOnboardingSnackbar = (
  params: AddPaperToRecommendPoolAndOpenDialogParams
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(addPaperToRecommendPool(params.recAction));
    dispatch(openRecommendOnboardingSnackbarAction(params.pageType, params.actionArea));
  };
};

export const addPaperToRecommendPool = (recAction: RecommendationActionParams) => {
  return async (dispatch: Dispatch<any>, getState: () => AppState) => {
    const { recTempPool } = {
      recTempPool: getState().recommendOnboardingSnackbarState.tempRecActionLogs,
    };

    const auth = await checkAuthStatus()(dispatch);
    const isLoggedIn = auth && auth.loggedIn;

    if (!isLoggedIn) {
      const newRecActionLogs: RecommendationActionParams[] = [recAction, ...recTempPool].slice(
        0,
        RECOMMENDED_PAPER_LOGGING_LENGTH_FOR_NON_USER
      );

      store.set(RECOMMENDED_PAPER_LOGGING_FOR_NON_USER, newRecActionLogs);
      dispatch(addPaperToTempPool({ recActions: newRecActionLogs }));
    } else {
      RecommendationAPI.addPaperToRecommendationPool({ paper_id: recAction.paperId, action: recAction.action });
    }
  };
};

export const openRecommendOnboardingSnackbarAction = (pageType: Scinapse.ActionTicket.PageType, actionArea: string) => {
  return async (dispatch: Dispatch<any>) => {
    const auth = await checkAuthStatus()(dispatch);
    const isLoggedIn = auth && auth.loggedIn;

    if (!isLoggedIn) return;

    const prevActionCount = store.get(BASED_ACTIVITY_COUNT_STORE_KEY);

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
          dispatch(openRecommendOnboardingSnackbar({ actionArea }));

          ActionTicketManager.trackTicket({
            pageType: pageType,
            actionType: 'view',
            actionArea: 'knowledgeBaseNoti',
            actionTag: 'viewKnowledgeBaseNoti',
            actionLabel: actionArea,
          });
        } catch (err) {
          console.error(err);
        }
        break;
      }
    }
  };
};
