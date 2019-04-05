import StoreManager from "../store";
import { openSignIn, openVerificationNeeded } from "../components/dialog/actions";
import { trackDialogView } from "./handleGA";
import { AppState } from "../reducers";

export enum AUTH_LEVEL {
  UNSIGNED,
  UNVERIFIED,
  VERIFIED,
  ADMIN,
}

export function checkAuth(authLevel: AUTH_LEVEL = AUTH_LEVEL.UNVERIFIED): boolean {
  const state: AppState = StoreManager.store.getState();
  const { currentUser } = state;

  if (authLevel > AUTH_LEVEL.UNSIGNED && !currentUser.isLoggedIn) {
    StoreManager.store.dispatch(openSignIn());
    trackDialogView("checkAuthDialogSignIn");
    return false;
  }

  if (
    authLevel >= AUTH_LEVEL.VERIFIED &&
    (!currentUser.isLoggedIn || (!currentUser.oauthLoggedIn && !currentUser.emailVerified))
  ) {
    StoreManager.store.dispatch(openVerificationNeeded());
    trackDialogView("verification_dialog");
    return false;
  }

  return true;
}
