import PlutoRenderer from "..";
import { INotificationActionPayload } from "./notifier";
import { ACTION_TYPES } from "../actions/actionTypes";

export default function alertToast(notificationActionPayload: INotificationActionPayload): void {
  PlutoRenderer.getStore().dispatch({
    type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
    payload: notificationActionPayload,
  });
}
