import { Actions, ACTION_TYPES } from '../actions/actionTypes';
import { Paper } from '../model/paper';
import { BasedOnCollectionPapersParams } from '../api/home';

export interface RecommendedPapersState {
  isLoadingActivityPapers: boolean;
  isLoadingCollectionPapers: boolean;
  basedOnActivityPapers: Paper[];
  basedOnCollectionPapers: BasedOnCollectionPapersParams | null;
}

export const RECOMMENDED_PAPERS_INITIAL_STATE: RecommendedPapersState = {
  isLoadingActivityPapers: false,
  isLoadingCollectionPapers: false,
  basedOnActivityPapers: [],
  basedOnCollectionPapers: null,
};

export function reducer(state = RECOMMENDED_PAPERS_INITIAL_STATE, action: Actions): RecommendedPapersState {
  switch (action.type) {
    case ACTION_TYPES.HOME_START_TO_GET_BASED_ON_ACTIVITY_PAPERS: {
      return { ...state, isLoadingActivityPapers: true };
    }

    case ACTION_TYPES.HOME_START_TO_GET_BASED_ON_COLLECTION_PAPERS: {
      return { ...state, isLoadingCollectionPapers: true };
    }

    case ACTION_TYPES.HOME_FAILED_TO_GET_BASED_ON_ACTIVITY_PAPERS: {
      return { ...state, isLoadingActivityPapers: false };
    }

    case ACTION_TYPES.HOME_FAILED_TO_GET_BASED_ON_COLLECTION_PAPERS: {
      return { ...state, isLoadingCollectionPapers: false };
    }

    case ACTION_TYPES.HOME_SUCCEEDED_TO_GET_BASED_ON_ACTIVITY_PAPERS: {
      const basedOnActivityPapers = action.payload.basedOnActivityPapers;
      return { ...state, isLoadingActivityPapers: false, basedOnActivityPapers };
    }

    case ACTION_TYPES.HOME_SUCCEEDED_TO_GET_BASED_ON_COLLECTION_PAPERS: {
      const basedOnCollectionPapers = action.payload.basedOnCollectionPapers;
      return { ...state, isLoadingCollectionPapers: false, basedOnCollectionPapers };
    }
  }

  return state;
}
