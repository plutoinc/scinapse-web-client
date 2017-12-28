import { plutoRenderer } from "..";
import { openSignIn } from "../components/dialog/actions";

export default function checkAuthDialog() {
  const currentState: any = plutoRenderer.store.getState();

  if (!currentState.currentUser.isLoggedIn) {
    plutoRenderer.store.dispatch(openSignIn());
  }
}
