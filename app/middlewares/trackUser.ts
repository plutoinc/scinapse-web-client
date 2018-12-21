import * as ReactGA from "react-ga";
import * as store from "store";
import * as Sentry from "@sentry/browser";
import { ACTION_TYPES } from "../actions/actionTypes";
import { CurrentUser } from "../model/currentUser";
import EnvChecker from "../helpers/envChecker";

export const USER_ID_KEY = "u_id";

const setUserToTracker = (_store: any) => (next: any) => (action: any) => {
  try {
    if (
      action.type === ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN ||
      action.type === ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN
    ) {
      if (action.payload && action.payload.user && action.payload.user.id) {
        const user = action.payload.user as CurrentUser;

        if (EnvChecker.isProdBrowser()) {
          Sentry.configureScope(scope => {
            scope.setUser({
              id: user.id.toString(),
              email: user.email,
              username: `${user.firstName} ${user.lastName || ""}`,
            });
          });
          store.set(USER_ID_KEY, user.id);
        }

        ReactGA.set({ userId: action.payload.user.id });
      }
    } else if (action.type === ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT) {
      if (EnvChecker.isProdBrowser()) {
        Sentry.configureScope(scope => {
          scope.setUser({});
        });
        store.remove(USER_ID_KEY);
      }

      ReactGA.set({ userId: null });
    }

    return next(action);
  } catch (err) {
    console.error(err);
  }
};

export default setUserToTracker;
