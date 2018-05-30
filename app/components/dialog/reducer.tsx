import { ACTION_TYPES } from "../../actions/actionTypes";

export enum GLOBAL_DIALOG_TYPE {
  SIGN_IN,
  SIGN_UP,
  WALLET,
  VERIFICATION_NEEDED,
  EXTRA,
}

export interface DialogState
  extends Readonly<{
      isLoading: boolean;
      hasError: boolean;
      isOpen: boolean;
      type: GLOBAL_DIALOG_TYPE;
    }> {}

export const DIALOG_INITIAL_STATE: DialogState = {
  isLoading: false,
  hasError: false,
  isOpen: false,
  type: GLOBAL_DIALOG_TYPE.EXTRA,
};

export function reducer(state: DialogState = DIALOG_INITIAL_STATE, action: ReduxAction<any>): DialogState {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return { ...state, isOpen: false };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_OPEN: {
      return { ...state, isOpen: true, type: action.payload.type };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_CLOSE: {
      return { ...state, isOpen: false };
    }

    case ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE: {
      return { ...state, type: action.payload.type };
    }

    default:
      return state;
  }
}
