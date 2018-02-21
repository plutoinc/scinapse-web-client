import StoreManager from "../store";
import { push } from "react-router-redux";

export default function handleErrorPage(errStatus: number) {
  StoreManager.store.dispatch(push(`/${errStatus}`));
}
