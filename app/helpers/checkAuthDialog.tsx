import { store } from "..";
import { openSignIn } from "../components/dialog/actions";

export default function checkAuthDialog() {
  const currentState: any = store.getState();

  if (!currentState.currentUser.isLoggedIn) {
    store.dispatch(openSignIn());
  }
}
