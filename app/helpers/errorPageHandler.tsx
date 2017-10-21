import { store } from "..";
import { push } from "react-router-redux";
export default function errorPageHandler(errStatus: number) {
  const firstNumber: number = parseInt(errStatus.toString()[0], 10);
  if (firstNumber === 4) {
    // Request Error
    store.dispatch(push("/400"));
  } else if (firstNumber === 5) {
    // Server Error
    store.dispatch(push("/500"));
  }
}
