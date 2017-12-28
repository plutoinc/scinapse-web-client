import PlutoRenderer from "..";
import { openSignIn } from "../components/dialog/actions";

export default function checkAuthDialog() {
  const currentState: any = PlutoRenderer.getStore().getState();

  if (!currentState.currentUser.isLoggedIn) {
    PlutoRenderer.getStore().dispatch(openSignIn());
  }
}
