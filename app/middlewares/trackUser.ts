import * as ReactGA from 'react-ga';
import { Middleware } from '@reduxjs/toolkit';
import * as store from 'store';
import { ACTION_TYPES } from '../actions/actionTypes';
import { CurrentUser } from '../model/currentUser';
import EnvChecker from '../helpers/envChecker';
import { USER_ID_KEY } from '../constants/actionTicket';
declare var Sentry: any;

function setUserToTrackers(user: CurrentUser) {
  // set sentry
  if (EnvChecker.isProdBrowser() && typeof Sentry !== 'undefined') {
    Sentry.configureScope((scope: any) => {
      scope.setUser({
        id: user.id.toString(),
        email: user.email,
        username: `${user.firstName} ${user.lastName || ''}`,
      });
    });
  }

  // set other trackers
  store.set(USER_ID_KEY, user.id);
  ReactGA.set({ userId: user.id });
}

function removeUserFromTrackers() {
  if (EnvChecker.isProdBrowser() && typeof Sentry !== 'undefined') {
    Sentry.configureScope((scope: any) => {
      scope.setUser({});
    });
  }

  store.remove(USER_ID_KEY);
  ReactGA.set({ userId: null });
}

const setUserToTracker: Middleware = () => (next: any) => (action: any) => {
  try {
    switch (action.type) {
      case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN:
      case ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: {
        if (action.payload && action.payload.user) {
          const user = action.payload.user as CurrentUser;
          setUserToTrackers(user);
        } else {
          removeUserFromTrackers();
        }
        break;
      }

      case ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT:
      case ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN: {
        removeUserFromTrackers();
        break;
      }

      default:
        break;
    }

    return next(action);
  } catch (err) {
    console.error(err);
  }
};

export default setUserToTracker;
