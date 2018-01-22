import PlutoRenderer from "..";
import { openSignIn } from "../components/dialog/actions";
import { trackModalView } from "./handleGA";

export default function checkAuthDialog() {
  const currentState: any = PlutoRenderer.store.getState();

  if (!currentState.currentUser.isLoggedIn) {
    PlutoRenderer.store.dispatch(openSignIn());
    trackModalView("checkAuthDialogSignIn");
  }
}
