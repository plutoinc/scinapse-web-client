import { ACTION_TYPES } from "../actions/actionTypes";
declare var trackJs: any;

const trackJsLogger = (store: any) => (next: any) => (action: any) => {
  try {
    if (
      action.type === ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN ||
      action.type === ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN
    ) {
      if (action.payload && action.payload.user && action.payload.user.id) {
        trackJs && trackJs.configure({ userId: String(action.payload.user.id) });
        trackJs && trackJs.addMetadata("user", JSON.stringify(action.payload.user));
      }
    }

    return next(action);
  } catch (err) {
    console.warn(store.getState());
    if (trackJs) {
      trackJs.track(err);
    }
  }
};

export default trackJsLogger;
