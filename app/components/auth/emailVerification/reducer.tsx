import { ACTION_TYPES } from "../../../actions/actionTypes";

export interface EmailVerificationState
  extends Readonly<{
      isLoading: boolean;
      hasError: boolean;
    }> {}

export const EMAIL_VERIFICATION_INITIAL_STATE = {
  isLoading: false,
  hasError: false,
};

export function reducer(
  state: EmailVerificationState = EMAIL_VERIFICATION_INITIAL_STATE,
  action: ReduxAction<any>
): EmailVerificationState {
  switch (action.type) {
    case ACTION_TYPES.EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN: {
      return { ...state, isLoading: true, hasError: false };
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN: {
      return { ...state, isLoading: false, hasError: true };
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN: {
      return { ...state, isLoading: false, hasError: false };
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL: {
      return { ...state, isLoading: true, hasError: false };
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL: {
      return { ...state, isLoading: false, hasError: true };
    }

    case ACTION_TYPES.EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL: {
      return { ...state, isLoading: false, hasError: false };
    }

    default:
      return state;
  }
}
