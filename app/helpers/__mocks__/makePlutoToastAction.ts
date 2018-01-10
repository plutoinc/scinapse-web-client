import { INotificationActionPayload } from "../notifier";

export default function alertToast(notificationActionPayload: INotificationActionPayload): void {
  if (!!notificationActionPayload) {
    return;
  }
}
