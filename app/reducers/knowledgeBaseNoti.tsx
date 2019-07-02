import { Actions, ACTION_TYPES } from '../actions/actionTypes';

export interface KnowledgeBaseNotiState {
  isOpen: boolean;
}

export const KNOWLEDGE_BASE_NOTI_INITIAL_STATE: KnowledgeBaseNotiState = {
  isOpen: false,
};

export function reducer(state = KNOWLEDGE_BASE_NOTI_INITIAL_STATE, action: Actions): KnowledgeBaseNotiState {
  switch (action.type) {
    case ACTION_TYPES.KNOWLEDGE_BASE_NOTI_OPEN: {
      return { ...state, isOpen: true };
    }

    case ACTION_TYPES.KNOWLEDGE_BASE_NOTI_CLOSE: {
      return { ...state, isOpen: false };
    }

    default:
      return state;
  }
}
