import { ACTION_TYPES } from "../actions/actionTypes";

declare var trackJs: any;

const trackJsLogger = (store: any) => (next: any) => (action: any) => {
  try {
    console.log(action);

    if (
      action.type === ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN ||
      action.type === ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN
    ) {
      trackJs.configure({ userId: action.payload.user.id });
      trackJs.addMetadata("user", JSON.stringify(action.payload.user));
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
