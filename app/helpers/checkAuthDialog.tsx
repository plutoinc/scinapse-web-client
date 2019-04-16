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

interface BlockByBenefitExpParams {
  authLevel: AUTH_LEVEL;
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType;
  actionLabel: string | null;
  userActionType?: Scinapse.ActionTicket.ActionTagType;
  expName?: string;
}

export function blockUnverifiedUser(params: BlockByBenefitExpParams): boolean {
  const { authLevel, userActionType, actionArea, actionLabel, expName } = params;
  const state: AppState = StoreManager.store.getState();
  const { currentUser } = state;

  if (authLevel > AUTH_LEVEL.UNSIGNED && !currentUser.isLoggedIn) {
    GlobalDialogManager.openSignUpDialog({
      userActionType,
      benefitExpContext: {
        pageType: getCurrentPageType(),
        actionArea: actionArea,
        actionLabel: actionLabel,
        expName,
      },
    });
    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: "fire",
      actionArea: actionArea,
      actionTag: "blockUnsignedUser",
      actionLabel: actionLabel,
      expName,
    });
    return true;
  }

  if (authLevel >= AUTH_LEVEL.VERIFIED && (!currentUser.oauthLoggedIn && !currentUser.emailVerified)) {
    GlobalDialogManager.openVerificationDialog();
    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: "fire",
      actionArea: actionArea,
      actionTag: "blockUnverifiedUser",
      actionLabel: actionLabel,
    });
    return true;
  }
  return false;
}
