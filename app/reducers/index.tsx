import * as Redux from 'redux';
import * as ConfigurationReducer from './configuration';
import * as currentUserReducer from './currentUser';
import { CURRENT_USER_INITIAL_STATE, CurrentUser } from '../model/currentUser';
import * as dialogReducer from '../components/dialog/reducer';
import * as layoutReducer from '../components/layouts/reducer';
import { LAYOUT_INITIAL_STATE, LayoutState } from '../components/layouts/records';
import * as articleSearchReducer from '../components/articleSearch/reducer';
import * as authorSearchReducer from '../containers/authorSearch/reducer';
import { ARTICLE_SEARCH_INITIAL_STATE, ArticleSearchState } from '../components/articleSearch/records';
import * as emailVerificationReducer from '../components/auth/emailVerification/reducer';
import { PaperShowState, PAPER_SHOW_INITIAL_STATE } from '../containers/paperShow/records';
import { reducer as paperShowReducer } from '../containers/paperShow/reducer';
import {
  reducer as AuthorShowReducer,
  AuthorShowState,
  AUTHOR_SHOW_INITIAL_STATE,
} from '../containers/unconnectedAuthorShow/reducer';
import { reducer as EntityReducer, INITIAL_ENTITY_STATE, EntityState } from './entity';
import {
  reducer as MyCollectionsReducer,
  MyCollectionsState,
  MY_COLLECTIONS_INITIAL_STATE,
} from '../containers/paperShowCollectionControlButton/reducer';
import {
  reducer as CollectionShowReducer,
  CollectionShowState,
  INITIAL_COLLECTION_SHOW_STATE,
} from '../containers/collectionShow/reducer';
import {
  reducer as UserCollectionsReducer,
  UserCollectionsState,
  USER_COLLECTIONS_INITIAL_STATE,
} from '../components/collections/reducer';
import {
  reducer as JournalShowReducer,
  JournalShowState,
  JOURNAL_SHOW_INITIAL_STATE,
} from '../components/journalShow/reducer';
import {
  reducer as ConnectedAuthorShowReducer,
  ConnectedAuthorShowState,
  CONNECTED_AUTHOR_SHOW_INITIAL_STATE,
} from '../containers/connectedAuthorShow/reducer';
import { AuthorSearchState, AUTHOR_SEARCH_INITIAL_STATE } from '../containers/authorSearch/records';
import { RelatedPapersState, RELATED_PAPERS_INITIAL_STATE, reducer as RelatedPapersReducer } from './realtedPapers';
import { PDFViewerState, reducer as PDFViewerReducer, PDF_VIEWER_INITIAL_STATE } from './pdfViewer';
import { SEARCH_QUERY_INITIAL_STATE, SearchQueryState, reducer as SearchQueryReducer } from './searchQuery';
import {
  KnowledgeBaseNotiState,
  reducer as KnowledgeBaseNotiReducer,
  KNOWLEDGE_BASE_NOTI_INITIAL_STATE,
} from './knowledgeBaseNoti';

import { SearchFilterState, reducer as SearchFilterReducer, SEARCH_FILTER_INITIAL_STATE } from './searchFilter';

export interface AppState {
  configuration: ConfigurationReducer.Configuration;
  dialog: dialogReducer.DialogState;
  layout: LayoutState;
  emailVerification: emailVerificationReducer.EmailVerificationState;
  currentUser: CurrentUser;
  articleSearch: ArticleSearchState;
  authorSearch: AuthorSearchState;
  paperShow: PaperShowState;
  authorShow: AuthorShowState;
  connectedAuthorShow: ConnectedAuthorShowState;
  journalShow: JournalShowState;
  collectionShow: CollectionShowState;
  myCollections: MyCollectionsState;
  userCollections: UserCollectionsState;
  relatedPapersState: RelatedPapersState;
  PDFViewerState: PDFViewerState;
  searchQueryState: SearchQueryState;
  knowledgeBaseNotiState: KnowledgeBaseNotiState;
  searchFilterState: SearchFilterState;
  entities: EntityState;
}

export const initialState: AppState = {
  configuration: ConfigurationReducer.CONFIGURATION_INITIAL_STATE,
  dialog: dialogReducer.DIALOG_INITIAL_STATE,
  layout: LAYOUT_INITIAL_STATE,
  emailVerification: emailVerificationReducer.EMAIL_VERIFICATION_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  articleSearch: ARTICLE_SEARCH_INITIAL_STATE,
  authorSearch: AUTHOR_SEARCH_INITIAL_STATE,
  paperShow: PAPER_SHOW_INITIAL_STATE,
  authorShow: AUTHOR_SHOW_INITIAL_STATE,
  connectedAuthorShow: CONNECTED_AUTHOR_SHOW_INITIAL_STATE,
  journalShow: JOURNAL_SHOW_INITIAL_STATE,
  collectionShow: INITIAL_COLLECTION_SHOW_STATE,
  myCollections: MY_COLLECTIONS_INITIAL_STATE,
  userCollections: USER_COLLECTIONS_INITIAL_STATE,
  relatedPapersState: RELATED_PAPERS_INITIAL_STATE,
  PDFViewerState: PDF_VIEWER_INITIAL_STATE,
  searchQueryState: SEARCH_QUERY_INITIAL_STATE,
  knowledgeBaseNotiState: KNOWLEDGE_BASE_NOTI_INITIAL_STATE,
  searchFilterState: SEARCH_FILTER_INITIAL_STATE,
  entities: INITIAL_ENTITY_STATE,
};

export const rootReducer: Redux.Reducer<AppState> = Redux.combineReducers({
  configuration: ConfigurationReducer.reducer,
  dialog: dialogReducer.reducer,
  layout: layoutReducer.reducer,
  articleSearch: articleSearchReducer.reducer,
  authorSearch: authorSearchReducer.reducer,
  emailVerification: emailVerificationReducer.reducer,
  paperShow: paperShowReducer,
  authorShow: AuthorShowReducer,
  connectedAuthorShow: ConnectedAuthorShowReducer,
  journalShow: JournalShowReducer,
  currentUser: currentUserReducer.reducer,
  collectionShow: CollectionShowReducer,
  myCollections: MyCollectionsReducer,
  userCollections: UserCollectionsReducer,
  relatedPapersState: RelatedPapersReducer,
  PDFViewerState: PDFViewerReducer,
  searchQueryState: SearchQueryReducer,
  knowledgeBaseNotiState: KnowledgeBaseNotiReducer,
  searchFilterState: SearchFilterReducer,
  entities: EntityReducer,
});
