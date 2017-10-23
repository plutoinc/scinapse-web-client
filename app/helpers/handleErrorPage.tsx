import { store } from "..";
import { push } from "react-router-redux";
export default function handleErrorPage(errStatus: number) {
  store.dispatch(push(`/${errStatus}`));
}
