import { Middleware } from 'redux';
import { ACTION_TYPES } from '../actions/actionTypes';
import EnvChecker from '../helpers/envChecker';
const notie = require('notie');

export interface NotificationAction {
  type: symbol;
  payload: Scinapse.Alert.NotificationActionPayload;
}

const defaultNotieOptions = {
  time: 4,
  position: 'bottom',
  stay: false,
};

const ReduxNotifier: Middleware = () => next => (action: any) => {
  if (!EnvChecker.isOnServer() && action.type === ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION) {
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
  }

  return next(action);
};

export default ReduxNotifier;
