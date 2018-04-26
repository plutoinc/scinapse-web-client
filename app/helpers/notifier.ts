import { Middleware } from "redux";
import { ACTION_TYPES } from "../actions/actionTypes";
const notie = require("notie");

export interface NotificationAction {
  type: symbol;
  payload: NotificationActionPayload;
}

type NotieAlertTypes = "success" | "warning" | "error" | "info" | "neutral";

export interface NotieAlertOptions {
  text: string;
  stay: boolean; // default = false
  time: number; // default = 3, minimum = 1,
  position: "top" | "bottom"; // default = 'top', enum: ['top', 'bottom']
}

export interface NotificationActionPayload {
  type: NotieAlertTypes;
  message: string;
  title?: string;
  options?: NotieAlertOptions;
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
