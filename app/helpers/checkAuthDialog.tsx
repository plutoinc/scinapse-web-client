import StoreManager from '../store/store';
import { AppState } from '../reducers';
import GlobalDialogManager from './globalDialogManager';
import ActionTicketManager from './actionTicketManager';
import { getCurrentPageType } from '../components/locationListener';
import { checkAuthStatus } from '../components/auth/actions';

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
  actionValue?: string;
}

export async function blockUnverifiedUser(params: BlockByBenefitExpParams): Promise<boolean> {
  const { authLevel, userActionType, actionArea, actionLabel, expName, isBlocked, actionValue } = params;
  const appState: AppState = StoreManager.store.getState();

  if (appState.currentUser.isLoggedIn && (appState.currentUser.oauthLoggedIn || appState.currentUser.emailVerified)) {
    return false;
  }

  const auth = await StoreManager.store.dispatch(checkAuthStatus());
  const isLoggedIn = auth && auth.loggedIn;
  const isVerified = auth && (auth.oauthLoggedIn || (auth.member && auth.member.emailVerified));

  if (isLoggedIn && isVerified) {
    return false;
  }

  if (authLevel > AUTH_LEVEL.UNSIGNED && !isLoggedIn) {
    GlobalDialogManager.openSignUpDialog({
      userActionType,
      authContext: {
        pageType: getCurrentPageType(),
        actionArea,
        actionLabel: expName ? expName : actionLabel,
        expName,
      },
      isBlocked: isBlocked || false,
    });

    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: 'fire',
      actionArea,
      actionTag: 'blockUnsignedUser',
      actionLabel: expName ? expName : actionLabel,
      actionValue: actionValue ? actionValue : null,
      expName,
    });
    return true;
  }

  if (authLevel >= AUTH_LEVEL.VERIFIED && !isVerified) {
    GlobalDialogManager.openVerificationDialog();
    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: 'fire',
      actionArea,
      actionTag: 'blockUnverifiedUser',
      actionLabel,
      actionValue: actionValue ? actionValue : null,
    });
    return true;
  }

  return false;
}
