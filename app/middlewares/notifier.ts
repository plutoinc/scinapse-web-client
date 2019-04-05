import { Middleware } from "redux";
import { ACTION_TYPES } from "../actions/actionTypes";
const notie = require("notie");

export interface NotificationAction {
  type: symbol;
  payload: Scinapse.Alert.NotificationActionPayload;
}

const defaultNotieOptions = {
  time: 4,
  position: "bottom",
  stay: false,
};

const ReduxNotifier: Middleware = _store => next => (action: any) => {
  if (action.type === ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION) {
    const notificationAction: NotificationAction = action;
    const notificationOptions = { ...defaultNotieOptions, ...notificationAction.payload.options };

    notie.alert({
      type: notificationAction.payload.type,
      text: notificationAction.payload.message,
      stay: notificationOptions.stay,
      time: notificationOptions.time,
      position: notificationOptions.position,
    });
  } else if (action.type === ACTION_TYPES.GLOBAL_CLEAR_NOTIFICATION) {
    notie.hideAlerts();
  } else {
    return next(action);
  }
};

export default ReduxNotifier;
