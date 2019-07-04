import { Actions, ACTION_TYPES } from '../actions/actionTypes';

export interface KnowledgeBaseNotiState {
  isOpen: boolean;
  actionFrom: string;
}

export const KNOWLEDGE_BASE_NOTI_INITIAL_STATE: KnowledgeBaseNotiState = {
  isOpen: false,
  actionFrom: '',
};

export function reducer(state = KNOWLEDGE_BASE_NOTI_INITIAL_STATE, action: Actions): KnowledgeBaseNotiState {
  switch (action.type) {
    case ACTION_TYPES.KNOWLEDGE_BASE_NOTI_OPEN: {
      const actionFrom = action.payload.actionFrom;
      return { ...state, isOpen: true, actionFrom };
    }

    case ACTION_TYPES.KNOWLEDGE_BASE_NOTI_CLOSE: {
      return { ...state, isOpen: false, actionFrom: '' };
    }

    default:
      return state;
  }
}
