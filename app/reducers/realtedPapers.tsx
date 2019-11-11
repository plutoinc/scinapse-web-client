import { Actions, ACTION_TYPES } from '../actions/actionTypes';

export interface RelatedPapersState {
  paperIds: string[];
  isLoading: boolean;
  hasFailed: boolean;
}

export const RELATED_PAPERS_INITIAL_STATE: RelatedPapersState = {
  paperIds: [],
  isLoading: false,
  hasFailed: false,
};

export function reducer(state = RELATED_PAPERS_INITIAL_STATE, action: Actions): RelatedPapersState {
  switch (action.type) {
    case ACTION_TYPES.RELATED_PAPERS_START_TO_GET_PAPERS: {
      return { ...state, isLoading: true, hasFailed: false };
    }

    case ACTION_TYPES.RELATED_PAPERS_SUCCEEDED_TO_GET_PAPERS: {
      return { ...state, isLoading: false, hasFailed: false, paperIds: action.payload.paperIds };
    }

    case ACTION_TYPES.RELATED_PAPERS_FAILED_TO_GET_PAPERS: {
      return { ...state, isLoading: false, hasFailed: true };
    }
  }

  return state;
}
