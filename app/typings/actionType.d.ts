import { Action } from "redux";

declare interface IReduxAction<T> extends Action {
  payload?: T;
}
