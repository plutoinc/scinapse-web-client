import PlutoRenderer from "..";
import { push } from "react-router-redux";
export default function handleErrorPage(errStatus: number) {
  PlutoRenderer.getStore().dispatch(push(`/${errStatus}`));
}
