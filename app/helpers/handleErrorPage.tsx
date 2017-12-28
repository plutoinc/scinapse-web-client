import PlutoRenderer from "..";
import { push } from "react-router-redux";
export default function handleErrorPage(errStatus: number) {
  PlutoRenderer.store.dispatch(push(`/${errStatus}`));
}
