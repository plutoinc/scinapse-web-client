import * as Redux from "redux";
import { routerReducer } from "react-router-redux";
import * as signUpReducer from "../components/auth/signUp/reducer";
import {
  SIGN_UP_INITIAL_STATE,
  ISignUpStateRecord
} from "../components/auth/signUp/records";
import * as signInReducer from "../components/auth/signIn/reducer";
import {
  SIGN_IN_INITIAL_STATE,
  ISignInStateRecord
} from "../components/auth/signIn/records";
import * as currentUserReducer from "./currentUser";
import {
  CURRENT_USER_INITIAL_STATE,
  ICurrentUserStateRecord
} from "../model/currentUser";

export interface IAppState {
  routing?: any;
  signUp: ISignUpStateRecord;
  signIn: ISignInStateRecord;
  currentUser: ICurrentUserStateRecord;
}

export const initialState: IAppState = {
  signUp: SIGN_UP_INITIAL_STATE,
  signIn: SIGN_IN_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE
};

export const rootReducer = Redux.combineReducers({
  routing: routerReducer,
  signUp: signUpReducer.reducer,
  signIn: signInReducer.reducer,
  currentUser: currentUserReducer.reducer
});
