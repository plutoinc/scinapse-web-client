import * as Redux from "redux";
import { routerReducer } from "react-router-redux";

import * as signUpReducer from "../components/auth/signUp/reducer";
import { SIGN_UP_INITIAL_STATE, ISignUpStateRecord } from "../components/auth/signUp/records";

import * as signInReducer from "../components/auth/signIn/reducer";
import { SIGN_IN_INITIAL_STATE, ISignInStateRecord } from "../components/auth/signIn/records";

import * as currentUserReducer from "./currentUser";
import { CURRENT_USER_INITIAL_STATE, ICurrentUserRecord } from "../model/currentUser";

import * as dialogReducer from "../components/dialog/reducer";
import { IDialogStateRecord, DIALOG_INITIAL_STATE } from "../components/dialog/records";

import * as authCheckerReducer from "../components/authChecker/reducer";
import { IAuthCheckerStateRecord, AUTH_CHECKER_INITIAL_STATE } from "../components/authChecker/records";

import * as layoutReducer from "../components/layouts/reducer";
import { ILayoutStateRecord, LAYOUT_INITIAL_STATE } from "../components/layouts/records";

import * as articleSearchReducer from "../components/articleSearch/reducer";
import { IArticleSearchStateRecord, ARTICLE_SEARCH_INITIAL_STATE } from "../components/articleSearch/records";

import * as emailVerificationReducer from "../components/auth/emailVerification/reducer";
import {
  IEmailVerificationStateRecord,
  EMAIL_VERIFICATION_INITIAL_STATE,
} from "../components/auth/emailVerification/records";

export interface IAppState {
  routing?: any;
  signUp: ISignUpStateRecord;
  signIn: ISignInStateRecord;
  currentUser: ICurrentUserRecord;
  authChecker: IAuthCheckerStateRecord;
  dialog: IDialogStateRecord;
  layout: ILayoutStateRecord;
  articleSearch: IArticleSearchStateRecord;
  emailVerification: IEmailVerificationStateRecord;
}

export const initialState: IAppState = {
  signUp: SIGN_UP_INITIAL_STATE,
  signIn: SIGN_IN_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  authChecker: AUTH_CHECKER_INITIAL_STATE,
  dialog: DIALOG_INITIAL_STATE,
  layout: LAYOUT_INITIAL_STATE,
  articleSearch: ARTICLE_SEARCH_INITIAL_STATE,
  emailVerification: EMAIL_VERIFICATION_INITIAL_STATE,
};

export const rootReducer = Redux.combineReducers({
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
