import { Actions, ACTION_TYPES } from '../actions/actionTypes';

export interface KnowledgeBaseNotiState {
  isOpen: boolean;
  actionArea: string;
}

export const KNOWLEDGE_BASE_NOTI_INITIAL_STATE: KnowledgeBaseNotiState = {
  isOpen: false,
  actionArea: '',
};

export function reducer(state = KNOWLEDGE_BASE_NOTI_INITIAL_STATE, action: Actions): KnowledgeBaseNotiState {
  switch (action.type) {
    case ACTION_TYPES.KNOWLEDGE_BASE_NOTI_OPEN: {
      const actionArea = action.payload.actionArea;
      return { ...state, isOpen: true, actionArea };
    }

    case ACTION_TYPES.KNOWLEDGE_BASE_NOTI_CLOSE: {
      return { ...state, isOpen: false, actionArea: '' };
    }

    default:
      return state;
  }
}
