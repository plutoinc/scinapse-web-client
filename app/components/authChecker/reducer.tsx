import { ACTION_TYPES } from "../../actions/actionTypes";

export interface AuthCheckerState {
  isLoading: boolean;
}

export const AUTH_CHECKER_INITIAL_STATE: AuthCheckerState = {
  isLoading: true,
};

export function reducer(
  state: AuthCheckerState = AUTH_CHECKER_INITIAL_STATE,
  action: ReduxAction<any>,
): AuthCheckerState {
  switch (action.type) {
    case ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN:
    case ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: {
      return { ...state, isLoading: false };
    }

    default: {
      return state;
    }
  }
}
