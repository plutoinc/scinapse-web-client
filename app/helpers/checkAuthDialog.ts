import StoreManager from "../store";
import { openSignIn } from "../components/dialog/actions";
import { trackModalView } from "./handleGA";

export default function checkAuthDialog() {
  const currentState: any = StoreManager.store.getState();

  if (!currentState.currentUser.isLoggedIn) {
    StoreManager.store.dispatch(openSignIn());
    trackModalView("checkAuthDialogSignIn");
  }
}
