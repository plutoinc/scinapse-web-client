import * as Redux from "redux";
import { routerReducer } from "react-router-redux";
import * as ConfigurationReducer from "../reducers/configuration";
import * as BookmarkPageReducer from "../components/bookmark/reducer";
import * as currentUserReducer from "./currentUser";
import * as BookmarkReducer from "./bookmark";
import * as signUpReducer from "../components/auth/signUp/reducer";
import * as authCheckerReducer from "../components/authChecker/reducer";
import {
  SIGN_UP_INITIAL_STATE,
  SignUpStateRecord,
  SignUpState,
  SignUpStateFactory,
  signUpInitialState,
} from "../components/auth/signUp/records";
import * as signInReducer from "../components/auth/signIn/reducer";
import {
  SIGN_IN_INITIAL_STATE,
  SignInStateRecord,
  SignInState,
  SignInStateFactory,
  initialSignInState,
} from "../components/auth/signIn/records";
import {
  CURRENT_USER_INITIAL_STATE,
  CurrentUserRecord,
  CurrentUser,
  CurrentUserFactory,
  initialCurrentUser,
} from "../model/currentUser";
import * as dialogReducer from "../components/dialog/reducer";
import {
  DialogStateRecord,
  DIALOG_INITIAL_STATE,
  DialogState,
  DialogStateFactory,
  initialDialogState,
} from "../components/dialog/records";
import {
  AuthCheckerStateRecord,
  AUTH_CHECKER_INITIAL_STATE,
  AuthCheckerState,
  AuthCheckerStateFactory,
  initialAuthCheckerState,
} from "../components/authChecker/records";
import * as layoutReducer from "../components/layouts/reducer";
import {
  LayoutStateRecord,
  LAYOUT_INITIAL_STATE,
  LayoutState,
  LayoutStateFactory,
  initialLayoutState,
} from "../components/layouts/records";
import * as articleSearchReducer from "../components/articleSearch/reducer";
import {
  ArticleSearchStateRecord,
  ARTICLE_SEARCH_INITIAL_STATE,
  ArticleSearchState,
  ArticleSearchStateFactory,
  initialArticleSearchState,
} from "../components/articleSearch/records";
import * as emailVerificationReducer from "../components/auth/emailVerification/reducer";
import {
  EmailVerificationStateRecord,
  EMAIL_VERIFICATION_INITIAL_STATE,
  EmailVerificationState,
  EmailVerificationStateFactory,
  initialEmailVerificationState,
} from "../components/auth/emailVerification/records";
import {
  PaperShowState,
  PaperShowStateRecord,
  initialPaperShowState,
  PAPER_SHOW_INITIAL_STATE,
  PaperShowStateFactory,
} from "../components/paperShow/records";
import { reducer as paperShowReducer } from "../components/paperShow/reducer";
import {
  initialBookmarkState,
  Bookmark,
  BookmarkRecord,
  rawBookmarkInitialState,
  BookmarkFactory,
} from "../model/bookmark";
import {
  BookmarkPageState,
  BookmarkPageStateRecord,
  initialBookmarkPageState,
  INITIAL_BOOKMARK_PAGE_STATE,
  BookmarkPageStateFactory,
} from "../components/bookmark/records";

export interface RawAppState {
  routing: any;
  configuration: ConfigurationReducer.Configuration;
  signUp: SignUpState;
  signIn: SignInState;
  authChecker: AuthCheckerState;
  dialog: DialogState;
  layout: LayoutState;
  articleSearch: ArticleSearchState;
  emailVerification: EmailVerificationState;
  paperShow: PaperShowState;
  currentUser: CurrentUser;
  bookmarks: Bookmark;
  bookmarkPage: BookmarkPageState;
}

export interface AppState {
  routing?: any;
  configuration: ConfigurationReducer.ConfigurationRecord;
  signUp: SignUpStateRecord;
  signIn: SignInStateRecord;
  authChecker: AuthCheckerStateRecord;
  dialog: DialogStateRecord;
  layout: LayoutStateRecord;
  articleSearch: ArticleSearchStateRecord;
  emailVerification: EmailVerificationStateRecord;
  paperShow: PaperShowStateRecord;
  currentUser: CurrentUserRecord;
  bookmarks: BookmarkRecord;
  bookmarkPage: BookmarkPageStateRecord;
}

export const rawInitialState: RawAppState = {
  routing: {},
  configuration: ConfigurationReducer.initialConfiguration,
  signUp: signUpInitialState,
  signIn: initialSignInState,
  authChecker: initialAuthCheckerState,
  dialog: initialDialogState,
  layout: initialLayoutState,
  articleSearch: initialArticleSearchState,
  emailVerification: initialEmailVerificationState,
  paperShow: initialPaperShowState,
  currentUser: initialCurrentUser,
  bookmarks: rawBookmarkInitialState,
  bookmarkPage: initialBookmarkPageState,
};

export const initialState: AppState = {
  configuration: ConfigurationReducer.CONFIGURATION_INITIAL_STATE,
  signUp: SIGN_UP_INITIAL_STATE,
  signIn: SIGN_IN_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  authChecker: AUTH_CHECKER_INITIAL_STATE,
  dialog: DIALOG_INITIAL_STATE,
  layout: LAYOUT_INITIAL_STATE,
  articleSearch: ARTICLE_SEARCH_INITIAL_STATE,
  emailVerification: EMAIL_VERIFICATION_INITIAL_STATE,
  paperShow: PAPER_SHOW_INITIAL_STATE,
  bookmarks: initialBookmarkState,
  bookmarkPage: INITIAL_BOOKMARK_PAGE_STATE,
};

export const rootReducer: Redux.Reducer<AppState> = Redux.combineReducers({
  routing: routerReducer,
  configuration: ConfigurationReducer.reducer,
  signUp: signUpReducer.reducer,
  signIn: signInReducer.reducer,
  currentUser: currentUserReducer.reducer,
  authChecker: authCheckerReducer.reducer,
  dialog: dialogReducer.reducer,
  layout: layoutReducer.reducer,
  articleSearch: articleSearchReducer.reducer,
  emailVerification: emailVerificationReducer.reducer,
  paperShow: paperShowReducer,
  bookmarks: BookmarkReducer.reducer,
  bookmarkPage: BookmarkPageReducer.reducer,
});

export function recordifyAppState(params: RawAppState): AppState {
  return {
    routing: params.routing,
    configuration: ConfigurationReducer.ConfigurationFactory(params.configuration),
    signUp: SignUpStateFactory(params.signUp),
    signIn: SignInStateFactory(params.signIn),
    currentUser: CurrentUserFactory(params.currentUser),
    authChecker: AuthCheckerStateFactory(params.authChecker),
    dialog: DialogStateFactory(params.dialog),
    layout: LayoutStateFactory(params.layout),
    articleSearch: ArticleSearchStateFactory(params.articleSearch),
    emailVerification: EmailVerificationStateFactory(params.emailVerification),
    paperShow: PaperShowStateFactory(params.paperShow),
    bookmarks: BookmarkFactory(params.bookmarks),
    bookmarkPage: BookmarkPageStateFactory(params.bookmarkPage),
  };
}
