import StoreManager from "../store";
import { AppState } from "../reducers";
import GlobalDialogManager from "./globalDialogManager";
import ActionTicketManager from "./actionTicketManager";
import { getCurrentPageType } from "../components/locationListener";
import { checkAuthStatus } from "../components/auth/actions";
import { getBlockedValueForCompleteBlockSignUpTest } from "./abTestHelper/getTestValueBlockedSignModalHelper";

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
  isBlocked?: boolean;
}

export async function blockUnverifiedUser(params: BlockByBenefitExpParams): Promise<boolean> {
  const { authLevel, userActionType, actionArea, actionLabel, expName, isBlocked } = params;
  const state: AppState = StoreManager.store.getState();
  const { currentUser } = state;

  if (authLevel > AUTH_LEVEL.UNSIGNED && !currentUser.isLoggedIn) {
    GlobalDialogManager.openSignUpDialog({
      userActionType,
      authContext: {
        pageType: getCurrentPageType(),
        actionArea,
        actionLabel: expName ? expName : actionLabel,
        expName,
      },
      isBlocked: isBlocked || getBlockedValueForCompleteBlockSignUpTest(),
    });

    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: "fire",
      actionArea,
      actionTag: "blockUnsignedUser",
      actionLabel: expName ? expName : actionLabel,
      expName,
    });
    return true;
  }

  if (authLevel >= AUTH_LEVEL.VERIFIED && (!currentUser.oauthLoggedIn && !currentUser.emailVerified)) {
    const auth = await StoreManager.store.dispatch(checkAuthStatus());
    if (auth && (auth.oauthLoggedIn || (auth.member && auth.member.emailVerified))) {
      return false;
    }

    GlobalDialogManager.openVerificationDialog();
    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: "fire",
      actionArea,
      actionTag: "blockUnverifiedUser",
      actionLabel,
    });
    return true;
  }
  return false;
}
