import * as Redux from "redux";
import { routerReducer } from "react-router-redux";

// Sign Up Reducer & Record
import * as signUpReducer from "../components/auth/signUp/reducer";
import { SIGN_UP_INITIAL_STATE, ISignUpStateRecord } from "../components/auth/signUp/records";

// Sign In Reducer & Record
import * as signInReducer from "../components/auth/signIn/reducer";
import { SIGN_IN_INITIAL_STATE, ISignInStateRecord } from "../components/auth/signIn/records";

// MyPage Reducer & Record
import * as myPageReducer from "../components/auth/myPage/reducer";
import { MY_PAGE_INITIAL_STATE, IMyPageStateRecord } from "../components/auth/myPage/records";

// CurrentUser Reducer & Record
import * as currentUserReducer from "./currentUser";
import { CURRENT_USER_INITIAL_STATE, ICurrentUserStateRecord } from "../model/currentUser";

// Article Show Reducer & Record
import * as articleShowReducer from "../components/articleShow/reducer";
import { IArticleShowStateRecord, ARTICLE_SHOW_INITIAL_STATE } from "../components/articleShow/records";

// Article Feed Reducer & Record
import * as articleFeedReducer from "../components/articleFeed/reducer";
import { IArticleFeedStateRecord, ARTICLE_FEED_INITIAL_STATE } from "../components/articleFeed/records";

// Dialog Reducer & Record
import * as dialogReducer from "../components/dialog/reducer";
import { IDialogStateRecord, DIALOG_INITIAL_STATE } from "../components/dialog/records";

// Auth Checker Reducer & Record
import * as authCheckerReducer from "../components/authChecker/reducer";
import { IAuthCheckerStateRecord, AUTH_CHECKER_INITIAL_STATE } from "../components/authChecker/records";

// Article Reducer & Record
import * as articleReducer from "./article";
import { IArticleRecord, ARTICLE_INITIAL_STATE } from "../model/article";

// Article Reducer & Record
import { IArticleCreateStateRecord, ARTICLE_CREATE_INITIAL_STATE } from "../components/articleCreate/records";
import * as articleCreateReducer from "../components/articleCreate/reducer";

export interface IAppState {
  routing?: any;
  signUp: ISignUpStateRecord;
  signIn: ISignInStateRecord;
  currentUser: ICurrentUserStateRecord;
  articleShow: IArticleShowStateRecord;
  articleFeed: IArticleFeedStateRecord;
  articleCreate: IArticleCreateStateRecord;
  authChecker: IAuthCheckerStateRecord;
  dialog: IDialogStateRecord;
  myPage: IMyPageStateRecord;
  article: IArticleRecord;
}

export const initialState: IAppState = {
  signUp: SIGN_UP_INITIAL_STATE,
  signIn: SIGN_IN_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  articleShow: ARTICLE_SHOW_INITIAL_STATE,
  articleFeed: ARTICLE_FEED_INITIAL_STATE,
  articleCreate: ARTICLE_CREATE_INITIAL_STATE,
  authChecker: AUTH_CHECKER_INITIAL_STATE,
  dialog: DIALOG_INITIAL_STATE,
  myPage: MY_PAGE_INITIAL_STATE,
  article: ARTICLE_INITIAL_STATE,
};

export const rootReducer = Redux.combineReducers({
  routing: routerReducer,
  signUp: signUpReducer.reducer,
  signIn: signInReducer.reducer,
  currentUser: currentUserReducer.reducer,
  articleShow: articleShowReducer.reducer,
  articleFeed: articleFeedReducer.reducer,
  articleCreate: articleCreateReducer.reducer,
  authChecker: authCheckerReducer.reducer,
  dialog: dialogReducer.reducer,
  myPage: myPageReducer.reducer,
  article: articleReducer.reducer,
});
