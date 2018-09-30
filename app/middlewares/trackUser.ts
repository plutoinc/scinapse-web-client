import * as ReactGA from "react-ga";
import { ACTION_TYPES } from "../actions/actionTypes";

const setUserToTracker = (_store: any) => (next: any) => (action: any) => {
  try {
    if (
      action.type === ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN ||
      action.type === ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN
    ) {
      if (action.payload && action.payload.user && action.payload.user.id) {
        ReactGA.set({ userId: action.payload.user.id });
      }
    }

    return next(action);
  } catch (err) {
    console.error(err);
  }
};

export default setUserToTracker;
