import { toggleElementFromArray } from '../../helpers/toggleElementFromArray';

interface ReducerState {
  isOpen: boolean;
  genuineInputValue: string;
  inputValue: string;
  highlightIdx: number;
  selectedJournalIds: string[];
}

interface OpenBoxAction {
  type: 'OPEN_BOX';
}

interface CloseBoxAction {
  type: 'CLOSE_BOX';
}

interface ChangeInputAction {
  type: 'CHANGE_INPUT';
  payload: {
    inputValue: string;
  };
}

interface ArrowKeyDownAction {
  type: 'ARROW_KEYDOWN';
  payload: {
    targetIndex: number;
    inputValue: string;
  };
}

interface ToggleJournalAction {
  type: 'TOGGLE_JOURNAL';
  payload: {
    journalId: string;
  };
}

interface ClearAction {
  type: 'CLEAR';
}

type JournalFilterActions =
  | OpenBoxAction
  | CloseBoxAction
  | ChangeInputAction
  | ArrowKeyDownAction
  | ToggleJournalAction
  | ClearAction;

export const journalFilterInputInitialState: ReducerState = {
  isOpen: false,
  genuineInputValue: '',
  inputValue: '',
  highlightIdx: -1,
  selectedJournalIds: [],
};

export default function reducer(state: ReducerState, action: JournalFilterActions) {
  switch (action.type) {
    case 'OPEN_BOX':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_BOX':
      return journalFilterInputInitialState;

    case 'CHANGE_INPUT': {
      if (action.payload) {
        return {
          ...state,
          inputValue: action.payload.inputValue,
          genuineInputValue: action.payload.inputValue,
          isOpen: true,
        };
      }
      return state;
    }

    case 'ARROW_KEYDOWN': {
      if (action.payload && typeof action.payload.targetIndex === 'number') {
        const { targetIndex, inputValue } = action.payload;

        return { ...state, inputValue, highlightIdx: targetIndex };
      }
      return state;
    }

    case 'TOGGLE_JOURNAL': {
      return {
        ...state,
        selectedJournalIds: toggleElementFromArray(action.payload.journalId, state.selectedJournalIds),
      };
    }

    case 'CLEAR': {
      return {
        ...state,
        selectedJournalIds: [],
      };
    }

    default:
      throw new Error();
  }
}
