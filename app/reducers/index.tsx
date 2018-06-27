import * as Redux from "redux";
import { RouterState } from "connected-react-router";
import * as ConfigurationReducer from "../reducers/configuration";
import * as BookmarkPageReducer from "../components/bookmark/reducer";
import * as currentUserReducer from "./currentUser";
import * as BookmarkReducer from "./bookmark";
import * as signUpReducer from "../components/auth/signUp/reducer";
import * as authCheckerReducer from "../components/authChecker/reducer";
import * as signInReducer from "../components/auth/signIn/reducer";
import { CURRENT_USER_INITIAL_STATE, CurrentUser } from "../model/currentUser";
import * as dialogReducer from "../components/dialog/reducer";
import * as layoutReducer from "../components/layouts/reducer";
import {
  LAYOUT_INITIAL_STATE,
  LayoutState
} from "../components/layouts/records";
import * as articleSearchReducer from "../components/articleSearch/reducer";
import {
  ARTICLE_SEARCH_INITIAL_STATE,
  ArticleSearchState
} from "../components/articleSearch/records";
import * as emailVerificationReducer from "../components/auth/emailVerification/reducer";
import {
  PaperShowState,
  PAPER_SHOW_INITIAL_STATE
} from "../components/paperShow/records";
import { reducer as paperShowReducer } from "../components/paperShow/reducer";
import {
  reducer as AuthorShowReducer,
  AuthorShowState,
  AUTHOR_SHOW_INITIAL_STATE
} from "../components/authorShow/reducer";
import {
  reducer as EntityReducer,
  INITIAL_ENTITY_STATE,
  EntityState
} from "./entity";
import { INITIAL_BOOKMARK_STATE, Bookmark } from "../model/bookmark";
import {
  BookmarkPageState,
  INITIAL_BOOKMARK_PAGE_STATE
} from "../components/bookmark/records";
import * as homeReducer from "../components/home/reducer";
import { HomeState, HOME_INITIAL_STATE } from "../components/home/records";
import {
  reducer as CollectionShowReducer,
  CollectionShowState,
  INITIAL_COLLECTION_SHOW_STATE
} from "../components/collectionShow/reducer";

export interface AppState {
  router?: RouterState;
  configuration: ConfigurationReducer.Configuration;
  signUp: signUpReducer.SignUpState;
  signIn: signInReducer.SignInState;
  authChecker: authCheckerReducer.AuthCheckerState;
  dialog: dialogReducer.DialogState;
  layout: LayoutState;
  home: HomeState;
  emailVerification: emailVerificationReducer.EmailVerificationState;
  bookmarks: Bookmark;
  currentUser: CurrentUser | null;
  bookmarkPage: BookmarkPageState;
  articleSearch: ArticleSearchState;
  paperShow: PaperShowState;
  authorShow: AuthorShowState;
  collectionShow: CollectionShowState;
  entities: EntityState;
}

export const initialState: AppState = {
  configuration: ConfigurationReducer.CONFIGURATION_INITIAL_STATE,
  signUp: signUpReducer.SIGN_UP_INITIAL_STATE,
  signIn: signInReducer.SIGN_IN_INITIAL_STATE,
  authChecker: authCheckerReducer.AUTH_CHECKER_INITIAL_STATE,
  dialog: dialogReducer.DIALOG_INITIAL_STATE,
  home: HOME_INITIAL_STATE,
  layout: LAYOUT_INITIAL_STATE,
  emailVerification: emailVerificationReducer.EMAIL_VERIFICATION_INITIAL_STATE,
  bookmarks: INITIAL_BOOKMARK_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  bookmarkPage: INITIAL_BOOKMARK_PAGE_STATE,
  articleSearch: ARTICLE_SEARCH_INITIAL_STATE,
  paperShow: PAPER_SHOW_INITIAL_STATE,
  authorShow: AUTHOR_SHOW_INITIAL_STATE,
  collectionShow: INITIAL_COLLECTION_SHOW_STATE,
  entities: INITIAL_ENTITY_STATE
};

export const rootReducer: Redux.Reducer<AppState> = Redux.combineReducers({
  configuration: ConfigurationReducer.reducer,
  signUp: signUpReducer.reducer,
  signIn: signInReducer.reducer,
  authChecker: authCheckerReducer.reducer,
  dialog: dialogReducer.reducer,
  home: homeReducer.reducer,
  layout: layoutReducer.reducer,
  articleSearch: articleSearchReducer.reducer,
  emailVerification: emailVerificationReducer.reducer,
  paperShow: paperShowReducer,
  authorShow: AuthorShowReducer,
  currentUser: currentUserReducer.reducer,
  bookmarks: BookmarkReducer.reducer,
  bookmarkPage: BookmarkPageReducer.reducer,
  collectionShow: CollectionShowReducer,
  entities: EntityReducer
});
