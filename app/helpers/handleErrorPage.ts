import StoreManager from "../store";
import { push } from "connected-react-router";

export default function handleErrorPage(errStatus: number) {
  StoreManager.store.dispatch(push(`/${errStatus}`));
}
