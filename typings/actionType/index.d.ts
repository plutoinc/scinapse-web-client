import { Action } from "redux";

declare global {
  interface ReduxAction<T> extends Action {
    payload?: T;
  }
}
