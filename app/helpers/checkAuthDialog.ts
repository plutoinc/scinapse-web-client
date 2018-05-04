import StoreManager from "../store";
import { openSignIn } from "../components/dialog/actions";

export default function checkAuthDialog() {
  const currentState: any = StoreManager.store.getState();

  if (!currentState.currentUser.isLoggedIn) {
    StoreManager.store.dispatch(openSignIn());
  }
}
