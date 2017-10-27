import { store } from "..";
import { openSignIn } from "../components/dialog/actions";

export default function checkAuthDialog() {
  const nowState: any = store.getState();

  if (!nowState.currentUser.isLoggedIn) {
    store.dispatch(openSignIn());
  }
}
