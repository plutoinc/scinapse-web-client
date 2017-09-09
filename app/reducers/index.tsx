import * as Redux from "redux";
import { routerReducer } from "react-router-redux";
import * as signUpReducer from "../components/auth/signUp/reducer";
import * as signInReducer from "../components/auth/signIn/reducer";
import { SIGN_IN_INITIAL_STATE, ISignInStateRecord } from "../components/auth/signIn/records";

export interface IAppState {
  routing?: any;
  signUp: signUpReducer.ISignUpStateManager;
  signIn: ISignInStateRecord;
}

export const initialState: IAppState = {
  signUp: signUpReducer.SIGN_UP_INITIAL_STATE,
  signIn: SIGN_IN_INITIAL_STATE,
};

export interface IStateManager<T, S> {
  // TODO: Remove this
  get(key: "meta"): T;
  get(key: "data"): S;

  set(key: "meta", value: T): IStateManager<T, S>;
  set(key: "data", value: S): IStateManager<T, S>;
}

export const rootReducer = Redux.combineReducers({
  routing: routerReducer,
  signUp: signUpReducer.reducer,
  signIn: signInReducer.reducer,
});
