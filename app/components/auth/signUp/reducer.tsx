import { ACTION_TYPES } from "../../../actions/actionTypes";
import { OAUTH_VENDOR } from "../../../api/types/auth";

export enum SIGN_UP_STEP {
  FIRST,
  WITH_EMAIL,
  WITH_SOCIAL,
  FINAL_WITH_EMAIL,
  FINAL_WITH_SOCIAL,
}

export enum SIGN_UP_ON_FOCUS_TYPE {
  EMAIL,
  PASSWORD,
  AFFILIATION,
  FIRST_NAME,
  LASTNAME,
}

export interface SignUpState
  extends Readonly<{
      isLoading: boolean;
      hasError: boolean;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      affiliation: string;
      onFocus: SIGN_UP_ON_FOCUS_TYPE | null;
      hasErrorCheck: SignUpErrorCheck;
      step: SIGN_UP_STEP;
      oauth: SignUpOauthInfo | null;
    }> {}

export interface SignUpOauthInfo
  extends Readonly<{
      code: string;
      oauthId: string;
      uuid: string;
      vendor: OAUTH_VENDOR | null;
    }> {}

export interface FormError
  extends Readonly<{
      hasError: boolean;
      errorMessage: string | null;
    }> {}

export interface SignUpErrorCheck
  extends Readonly<{
      email: FormError;
      password: FormError;
      firstName: FormError;
      lastName: FormError;
      affiliation: FormError;
    }> {}

export const SIGN_UP_INITIAL_STATE: SignUpState = {
  isLoading: false,
  hasError: false,
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  affiliation: "",
  onFocus: null,
  hasErrorCheck: {
    email: { hasError: false, errorMessage: null },
    password: { hasError: false, errorMessage: null },
    firstName: { hasError: false, errorMessage: null },
    lastName: { hasError: false, errorMessage: null },
    affiliation: { hasError: false, errorMessage: null },
  },
  step: SIGN_UP_STEP.FIRST,
  oauth: null,
};

export function reducer(state: SignUpState = SIGN_UP_INITIAL_STATE, action: ReduxAction<any>): SignUpState {
  switch (action.type) {
    case ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT: {
      return { ...state, email: action.payload.email };
    }

    case ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT: {
      return { ...state, password: action.payload.password };
    }

    case ACTION_TYPES.SIGN_UP_CHANGE_FIRST_NAME_INPUT: {
      return { ...state, firstName: action.payload.name };
    }

    case ACTION_TYPES.SIGN_UP_CHANGE_LASTNAME_INPUT: {
      return { ...state, lastName: action.payload.name };
    }

    case ACTION_TYPES.SIGN_UP_CHANGE_AFFILIATION_INPUT: {
      return { ...state, affiliation: action.payload.affiliation };
    }

    case ACTION_TYPES.SIGN_UP_FORM_ERROR: {
      const type: keyof SignUpErrorCheck = action.payload.type;
      if (type) {
        return {
          ...state,
          hasErrorCheck: {
            ...state.hasErrorCheck,
            [`${type}`]: {
              hasError: true,
              errorMessage: action.payload.errorMessage,
            },
          },
        };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR: {
      const type: SignUpErrorCheck = action.payload.type;
      if (type) {
        return {
          ...state,
          hasErrorCheck: {
            ...state.hasErrorCheck,
            [`${type}`]: {
              hasError: false,
              errorMessage: null,
            },
          },
        };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.SIGN_UP_ON_FOCUS_INPUT: {
      return { ...state, onFocus: action.payload.type };
    }

    case ACTION_TYPES.SIGN_UP_ON_BLUR_INPUT: {
      return { ...state, onFocus: null };
    }

    case ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT: {
      return { ...state, isLoading: true, hasError: false };
    }

    case ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT: {
      return { ...state, isLoading: false, hasError: true };
    }

    case ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT: {
      return { ...state, isLoading: false, hasError: false };
    }

    case ACTION_TYPES.SIGN_UP_CHANGE_SIGN_UP_STEP: {
      return { ...state, step: action.payload.step };
    }

    case ACTION_TYPES.SIGN_UP_GET_AUTHORIZE_CODE: {
      return { ...state, step: SIGN_UP_STEP.WITH_SOCIAL };
    }

    case ACTION_TYPES.SIGN_UP_START_TO_EXCHANGE: {
      return { ...state, isLoading: true, hasError: false };
    }

    case ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE: {
      return { ...state, isLoading: false, hasError: true };
    }

    case ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_EXCHANGE: {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        oauth: action.payload.oauth,
      };
    }

    case ACTION_TYPES.SIGN_UP_GO_BACK: {
      return SIGN_UP_INITIAL_STATE;
    }

    case ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE: {
      return SIGN_UP_INITIAL_STATE;
    }

    default:
      return state;
  }
}
