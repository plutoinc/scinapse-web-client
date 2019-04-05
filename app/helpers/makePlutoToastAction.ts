import StoreManager from "../store";
import { ACTION_TYPES } from "../actions/actionTypes";

export default function alertToast(notificationActionPayload: Scinapse.Alert.NotificationActionPayload): void {
  StoreManager.store.dispatch({
    type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
    payload: notificationActionPayload,
  });
}
