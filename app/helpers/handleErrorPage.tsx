import { plutoRenderer } from "..";
import { push } from "react-router-redux";
export default function handleErrorPage(errStatus: number) {
  plutoRenderer.store.dispatch(push(`/${errStatus}`));
}
