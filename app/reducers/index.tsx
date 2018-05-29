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
import { ARTICLE_SEARCH_INITIAL_STATE, ArticleSearchState } from "../components/articleSearch/records";
import * as emailVerificationReducer from "../components/auth/emailVerification/reducer";
import {
  EmailVerificationStateRecord,
  EMAIL_VERIFICATION_INITIAL_STATE,
  EmailVerificationState,
  EmailVerificationStateFactory,
  initialEmailVerificationState,
} from "../components/auth/emailVerification/records";
import { PaperShowState, PAPER_SHOW_INITIAL_STATE } from "../components/paperShow/records";
import { reducer as paperShowReducer } from "../components/paperShow/reducer";
import {
  reducer as AuthorShowReducer,
  AuthorShowState,
  AUTHOR_SHOW_INITIAL_STATE,
} from "../components/authorShow/reducer";
import { reducer as EntityReducer, INITIAL_ENTITY_STATE, EntityState } from "./entity";
import { initialBookmarkState, Bookmark } from "../model/bookmark";
import { BookmarkPageState, INITIAL_BOOKMARK_PAGE_STATE } from "../components/bookmark/records";
import * as homeReducer from "../components/home/reducer";
import {
  HomeState,
  initialHomeState,
  HOME_INITIAL_STATE,
  HomeStateRecord,
  HomeStateFactory,
} from "../components/home/records";

export interface RawAppState {
  routing: any;
  configuration: ConfigurationReducer.Configuration;
  signUp: SignUpState;
  signIn: SignInState;
  authChecker: AuthCheckerState;
  dialog: DialogState;
  layout: LayoutState;
  home: HomeState;
  emailVerification: EmailVerificationState;
  currentUser: CurrentUser;
  bookmarks: Bookmark;
  bookmarkPage: BookmarkPageState;
  articleSearch: ArticleSearchState;
  paperShow: PaperShowState;
  authorShow: AuthorShowState;
  entities: EntityState;
}

export interface AppState {
  routing?: any;
  configuration: ConfigurationReducer.ConfigurationRecord;
  signUp: SignUpStateRecord;
  signIn: SignInStateRecord;
  authChecker: AuthCheckerStateRecord;
  dialog: DialogStateRecord;
  home: HomeStateRecord;
  layout: LayoutStateRecord;
  emailVerification: EmailVerificationStateRecord;
  currentUser: CurrentUserRecord;
  bookmarks: Bookmark;
  bookmarkPage: BookmarkPageState;
  articleSearch: ArticleSearchState;
  paperShow: PaperShowState;
  authorShow: AuthorShowState;
  entities: EntityState;
}

export const rawInitialState: RawAppState = {
  routing: {},
  configuration: ConfigurationReducer.initialConfiguration,
  signUp: signUpInitialState,
  signIn: initialSignInState,
  authChecker: initialAuthCheckerState,
  dialog: initialDialogState,
  home: initialHomeState,
  layout: initialLayoutState,
  emailVerification: initialEmailVerificationState,
  currentUser: initialCurrentUser,
  bookmarks: initialBookmarkState,
  bookmarkPage: INITIAL_BOOKMARK_PAGE_STATE,
  articleSearch: ARTICLE_SEARCH_INITIAL_STATE,
  paperShow: PAPER_SHOW_INITIAL_STATE,
  authorShow: AUTHOR_SHOW_INITIAL_STATE,
  entities: INITIAL_ENTITY_STATE,
};

export const initialState: AppState = {
  configuration: ConfigurationReducer.CONFIGURATION_INITIAL_STATE,
  signUp: SIGN_UP_INITIAL_STATE,
  signIn: SIGN_IN_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  authChecker: AUTH_CHECKER_INITIAL_STATE,
  dialog: DIALOG_INITIAL_STATE,
  home: HOME_INITIAL_STATE,
  layout: LAYOUT_INITIAL_STATE,
  articleSearch: ARTICLE_SEARCH_INITIAL_STATE,
  emailVerification: EMAIL_VERIFICATION_INITIAL_STATE,
  bookmarks: initialBookmarkState,
  bookmarkPage: INITIAL_BOOKMARK_PAGE_STATE,
  paperShow: PAPER_SHOW_INITIAL_STATE,
  authorShow: AUTHOR_SHOW_INITIAL_STATE,
  entities: INITIAL_ENTITY_STATE,
};

export const rootReducer: Redux.Reducer<AppState> = Redux.combineReducers({
  routing: routerReducer,
  configuration: ConfigurationReducer.reducer,
  signUp: signUpReducer.reducer,
  signIn: signInReducer.reducer,
  currentUser: currentUserReducer.reducer,
  authChecker: authCheckerReducer.reducer,
  dialog: dialogReducer.reducer,
  home: homeReducer.reducer,
  layout: layoutReducer.reducer,
  articleSearch: articleSearchReducer.reducer,
  emailVerification: emailVerificationReducer.reducer,
  paperShow: paperShowReducer,
  authorShow: AuthorShowReducer,
  bookmarks: BookmarkReducer.reducer,
  bookmarkPage: BookmarkPageReducer.reducer,
  entities: EntityReducer,
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
    home: HomeStateFactory(params.home),
    layout: LayoutStateFactory(params.layout),
    emailVerification: EmailVerificationStateFactory(params.emailVerification),
    articleSearch: params.articleSearch,
    paperShow: params.paperShow,
    authorShow: params.authorShow,
    bookmarks: params.bookmarks,
    bookmarkPage: params.bookmarkPage,
    entities: params.entities,
  };
}
