import StoreManager from "../store";
import { AppState } from "../reducers";
import GlobalDialogManager from "./globalDialogManager";
import ActionTicketManager from "./actionTicketManager";
import { getCurrentPageType } from "../components/locationListener";

export enum AUTH_LEVEL {
  UNSIGNED,
  UNVERIFIED,
  VERIFIED,
  ADMIN,
}

interface CheckAuthParams {
  authLevel: AUTH_LEVEL;
  userActionType?: Scinapse.ActionTicket.ActionTagType;
  actionArea?: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType;
  actionLabel?: string;
}

export function checkAuth(params: CheckAuthParams): boolean {
  const { authLevel, userActionType, actionArea, actionLabel } = params;
  const state: AppState = StoreManager.store.getState();
  const { currentUser } = state;

  if (authLevel > AUTH_LEVEL.UNSIGNED && !currentUser.isLoggedIn) {
    GlobalDialogManager.openSignUpDialog(userActionType);
    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: "fire",
      actionArea: actionArea || "",
      actionTag: "blockUnsignedUser",
      actionLabel: actionLabel || "",
    });
    return false;
  }

  if (authLevel >= AUTH_LEVEL.VERIFIED && (!currentUser.oauthLoggedIn && !currentUser.emailVerified)) {
    GlobalDialogManager.openVerificationDialog();
    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: "fire",
      actionArea: actionArea || "",
      actionTag: "blockUnverifiedUser",
      actionLabel: actionLabel || "",
    });
    return false;
  }
  return true;
}
