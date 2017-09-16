import * as Redux from "redux";
import { routerReducer } from "react-router-redux";

// Sign Up Reducer & Record
import * as signUpReducer from "../components/auth/signUp/reducer";
import { SIGN_UP_INITIAL_STATE, ISignUpStateRecord } from "../components/auth/signUp/records";

// Sign In Reducer & Record
import * as signInReducer from "../components/auth/signIn/reducer";
import { SIGN_IN_INITIAL_STATE, ISignInStateRecord } from "../components/auth/signIn/records";

// CurrentUser Reducer & Record
import * as currentUserReducer from "./currentUser";
import { CURRENT_USER_INITIAL_STATE, ICurrentUserStateRecord } from "../model/currentUser";

// Article Feed Reducer & Record
import * as articleFeedReducer from "../components/article/feed/reducer";
import { IArticleFeedStateRecord, ARTICLE_FEED_INITIAL_STATE } from "../components/article/feed/records";

// Dialog Reducer & Record
import * as dialogReducer from "../components/dialog/reducer";
import { IDialogStateRecord, DIALOG_INITIAL_STATE } from "../components/dialog/records";

export interface IAppState {
  routing?: any;
  signUp: ISignUpStateRecord;
  signIn: ISignInStateRecord;
  currentUser: ICurrentUserStateRecord;
  articleFeed: IArticleFeedStateRecord;
  dialog: IDialogStateRecord;
}

export const initialState: IAppState = {
  signUp: SIGN_UP_INITIAL_STATE,
  signIn: SIGN_IN_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  articleFeed: ARTICLE_FEED_INITIAL_STATE,
  dialog: DIALOG_INITIAL_STATE,
};

export const rootReducer = Redux.combineReducers({
  routing: routerReducer,
  signUp: signUpReducer.reducer,
  signIn: signInReducer.reducer,
  currentUser: currentUserReducer.reducer,
  articleFeed: articleFeedReducer.reducer,
  dialog: dialogReducer.reducer,
});
