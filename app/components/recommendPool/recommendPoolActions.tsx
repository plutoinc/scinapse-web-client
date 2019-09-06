import { Dispatch } from 'redux';
import RecommendationAPI from '../../api/recommendation';
import { AppState } from '../../reducers';
import { addPaperToTempPool, openRecommendPapersDialog } from './recommendPoolReducer';
import { ALREADY_VISITED_RECOMMEND_PAPERS, BASED_ACTIVITY_COUNT_STORE_KEY } from './recommendPoolConstants';
const store = require('store');

const MAX_COUNT = 16;

interface AddPaperToRecommendPoolAndOpenDialogParams {
  paperId: number;
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

export const addPaperToRecommendPoolAndOpenDialog = (params: AddPaperToRecommendPoolAndOpenDialogParams) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(addPaperToRecommendPool(params.paperId));
    dispatch(openRecommendPoolDialog(params.pageType, params.actionArea));
  };
};

export const addPaperToRecommendPool = (paperId: number) => {
  return (dispatch: Dispatch<any>, getState: () => AppState) => {
    const appState = getState();
    if (!appState.currentUser.isLoggedIn) {
      dispatch(addPaperToTempPool({ paperId }));
    } else {
      RecommendationAPI.addPaperToRecommendationPool(paperId);
    }
  };
};

export const openRecommendPoolDialog = (pageType: Scinapse.ActionTicket.PageType, actionArea: string) => {
  return async (dispatch: Dispatch<any>, getState: () => AppState) => {
    if (!getState().currentUser.isLoggedIn) return;

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
          dispatch(openRecommendPapersDialog({ actionArea, pageType }));
        } catch (err) {
          console.error(err);
        }
        break;
      }
    }
  };
};
