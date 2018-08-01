import StoreManager from "../store";
import { NotificationActionPayload } from "../middlewares/notifier";
import { ACTION_TYPES } from "../actions/actionTypes";

export default function alertToast(notificationActionPayload: NotificationActionPayload): void {
  StoreManager.store.dispatch({
    type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
    payload: notificationActionPayload,
  });
}
