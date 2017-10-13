import * as toastr from "toastr";
import { Middleware } from "redux";
import { ACTION_TYPES } from "../actions/actionTypes";

export interface INotificationAction {
  type: Symbol;
  payload: INotificationActionPayload;
}

export interface INotificationActionPayload {
  type: ToastrType;
  message: string;
  title?: string;
  options?: ToastrOptions;
}

const defaultToastrOptions = {
  positionClass: "toast-bottom-center",
  closeHtml: `<button class="pluto-toastr-close-button">Confirm</button>`,
  timeOut: 4000,
};

const ReduxNotifier: Middleware = _store => next => (action: any) => {
  if (action.type === ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION) {
    const notificationAction: INotificationAction = action;
    const notificationOptions = { ...defaultToastrOptions, ...notificationAction.payload.options };

    toastr[notificationAction.payload.type](
      notificationAction.payload.message,
      notificationAction.payload.title,
      notificationOptions,
    );
  } else if (action.type === ACTION_TYPES.GLOBAL_CLEAR_NOTIFICATION) {
    toastr.clear();
  } else {
    return next(action);
  }
};

export default ReduxNotifier;
