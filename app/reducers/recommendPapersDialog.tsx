import { Actions, ACTION_TYPES } from '../actions/actionTypes';

export interface RecommendPapersDialogState {
  isOpen: boolean;
  actionArea: string;
}

export const RECOMMEND_PAPERS_DIALOG_INITIAL_STATE: RecommendPapersDialogState = {
  isOpen: false,
  actionArea: '',
};

export function reducer(state = RECOMMEND_PAPERS_DIALOG_INITIAL_STATE, action: Actions): RecommendPapersDialogState {
  switch (action.type) {
    case ACTION_TYPES.RECOMMEND_PAPERS_DIALOG_OPEN_DIALOG: {
      const actionArea = action.payload.actionArea;
      return { ...state, isOpen: true, actionArea };
    }

    case ACTION_TYPES.RECOMMEND_PAPERS_DIALOG_CLOSE_DIALOG: {
      return { ...state, isOpen: false, actionArea: '' };
    }

    default:
      return state;
  }
}
