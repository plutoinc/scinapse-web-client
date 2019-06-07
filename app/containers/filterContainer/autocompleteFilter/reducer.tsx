import { FilterObject } from '../../../helpers/searchQueryManager';

export interface ReducerState {
  isOpen: boolean;
  genuineInputValue: string;
  inputValue: string;
  highlightIdx: number;
}

export interface ReducerAction<T> {
  type: string;
  payload?: {
    suggestions?: T;
    inputValue?: string;
    errorMsg?: string;
    filter?: FilterObject;
    targetIndex?: number;
  };
}

export default function reducer<T>(state: ReducerState, action: ReducerAction<T>) {
  switch (action.type) {
    case 'OPEN_BOX':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_BOX':
      return {
        ...state,
        isOpen: false,
      };

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

    default:
      throw new Error();
  }
}
