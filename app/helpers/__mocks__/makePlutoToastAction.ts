import { NotificationActionPayload } from "../notifier";

export default function alertToast(notificationActionPayload: NotificationActionPayload): void {
  if (!!notificationActionPayload) {
    return;
  }
}
