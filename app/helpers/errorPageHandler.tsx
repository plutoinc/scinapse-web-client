import { store } from "..";
import { push } from "react-router-redux";
export default function errorPageHandler(errStatus: number) {
  store.dispatch(push(`/${errStatus}`));
}
