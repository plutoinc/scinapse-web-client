import { NotificationActionPayload } from "../../middlewares/notifier";

export default function alertToast(notificationActionPayload: NotificationActionPayload): void {
  if (!!notificationActionPayload) {
    return;
  }
}
