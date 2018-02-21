import * as Redux from "redux";
import { routerReducer } from "react-router-redux";

import * as signUpReducer from "../components/auth/signUp/reducer";
import { SIGN_UP_INITIAL_STATE, SignUpStateRecord } from "../components/auth/signUp/records";

import * as signInReducer from "../components/auth/signIn/reducer";
import { SIGN_IN_INITIAL_STATE, SignInStateRecord } from "../components/auth/signIn/records";

import * as currentUserReducer from "./currentUser";
import { CURRENT_USER_INITIAL_STATE, CurrentUserRecord } from "../model/currentUser";

import * as dialogReducer from "../components/dialog/reducer";
import { DialogStateRecord, DIALOG_INITIAL_STATE } from "../components/dialog/records";

import * as authCheckerReducer from "../components/authChecker/reducer";
import { AuthCheckerStateRecord, AUTH_CHECKER_INITIAL_STATE } from "../components/authChecker/records";

import * as layoutReducer from "../components/layouts/reducer";
import { LayoutStateRecord, LAYOUT_INITIAL_STATE } from "../components/layouts/records";

import * as articleSearchReducer from "../components/articleSearch/reducer";
import { ArticleSearchStateRecord, ARTICLE_SEARCH_INITIAL_STATE } from "../components/articleSearch/records";

import * as emailVerificationReducer from "../components/auth/emailVerification/reducer";
import {
  EmailVerificationStateRecord,
  EMAIL_VERIFICATION_INITIAL_STATE,
} from "../components/auth/emailVerification/records";

export interface AppState {
  routing?: any;
  signUp: SignUpStateRecord;
  signIn: SignInStateRecord;
  currentUser: CurrentUserRecord;
  authChecker: AuthCheckerStateRecord;
  dialog: DialogStateRecord;
  layout: LayoutStateRecord;
  articleSearch: ArticleSearchStateRecord;
  emailVerification: EmailVerificationStateRecord;
}

export const initialState: AppState = {
  signUp: SIGN_UP_INITIAL_STATE,
  signIn: SIGN_IN_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  authChecker: AUTH_CHECKER_INITIAL_STATE,
  dialog: DIALOG_INITIAL_STATE,
  layout: LAYOUT_INITIAL_STATE,
  articleSearch: ARTICLE_SEARCH_INITIAL_STATE,
  emailVerification: EMAIL_VERIFICATION_INITIAL_STATE,
};

export const rootReducer: Redux.Reducer<AppState> = Redux.combineReducers({
  routing: routerReducer,
  signUp: signUpReducer.reducer,
  signIn: signInReducer.reducer,
  currentUser: currentUserReducer.reducer,
  authChecker: authCheckerReducer.reducer,
  dialog: dialogReducer.reducer,
  layout: layoutReducer.reducer,
  articleSearch: articleSearchReducer.reducer,
  emailVerification: emailVerificationReducer.reducer,
});
