import { toggleElementFromArray } from '../../helpers/toggleElementFromArray';

interface ReducerState {
  isOpen: boolean;
  genuineInputValue: string;
  inputValue: string;
  highlightIdx: number;
  selectedFOSIds: number[];
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
  type: 'TOGGLE_FOS';
  payload: {
    FOSId: number;
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

export const FOSFilterInputInitialState: ReducerState = {
  isOpen: false,
  genuineInputValue: '',
  inputValue: '',
  highlightIdx: -1,
  selectedFOSIds: [],
};

export default function reducer(state: ReducerState, action: JournalFilterActions) {
  switch (action.type) {
    case 'OPEN_BOX':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_BOX':
      return FOSFilterInputInitialState;

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

    case 'TOGGLE_FOS': {
      return {
        ...state,
        selectedFOSIds: toggleElementFromArray(action.payload.FOSId, state.selectedFOSIds),
      };
    }

    case 'CLEAR': {
      return {
        ...state,
        selectedFOSIds: [],
      };
    }

    default:
      throw new Error();
  }
}
