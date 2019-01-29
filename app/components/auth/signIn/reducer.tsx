import { ACTION_TYPES } from "../../../actions/actionTypes";

export enum SIGN_IN_ON_FOCUS_TYPE {
  EMAIL,
  PASSWORD,
}

export interface SignInState
  extends Readonly<{
      isLoading: boolean;
      isFailed: boolean;
      hasError: boolean;
      email: string;
      password: string;
      onFocus: SIGN_IN_ON_FOCUS_TYPE | null;
      isNotUnsignedUpWithSocial: boolean;
    }> {}

export const SIGN_IN_INITIAL_STATE: SignInState = {
  isLoading: false,
  isFailed: false,
  hasError: false,
  email: "",
  password: "",
  onFocus: null,
  isNotUnsignedUpWithSocial: false,
};

export function reducer(state: SignInState = SIGN_IN_INITIAL_STATE, action: ReduxAction<any>): SignInState {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_CHANGE_EMAIL_INPUT: {
      return { ...state, email: action.payload.email };
    }

    case ACTION_TYPES.SIGN_IN_CHANGE_PASSWORD_INPUT: {
      return { ...state, password: action.payload.password };
    }

    case ACTION_TYPES.SIGN_IN_ON_FOCUS_INPUT: {
      return { ...state, onFocus: action.payload.type };
    }

    case ACTION_TYPES.SIGN_IN_ON_BLUR_INPUT: {
      return { ...state, onFocus: null };
    }

    case ACTION_TYPES.SIGN_IN_FORM_ERROR: {
      return { ...state, hasError: true };
    }

    case ACTION_TYPES.SIGN_IN_START_TO_SIGN_IN: {
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    }

    case ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN: {
      return { ...state, isLoading: false, hasError: true };
    }

    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return { ...state, isLoading: false, hasError: false };
    }

    case ACTION_TYPES.SIGN_IN_FAILED_DUE_TO_NOT_UNSIGNED_UP_WITH_SOCIAL: {
      return { ...state, isNotUnsignedUpWithSocial: true };
    }

    case ACTION_TYPES.SIGN_IN_GO_BACK: {
      return SIGN_IN_INITIAL_STATE;
    }

    case ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE: {
      return SIGN_IN_INITIAL_STATE;
    }

    default:
      return state;
  }
}
