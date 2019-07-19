import { ActionCreatorsMapObject } from 'redux';
import { AppEntities } from '../reducers/entity';
import { NormalizedDataWithPaginationV2, PageObjectV2 } from '../api/types/common';
import { AvailableCitationType } from '../containers/paperShow/records';
import { GetCollectionsResponse } from '../api/member';
import { GLOBAL_DIALOG_TYPE } from '../components/dialog/reducer';
import { Collection } from '../model/collection';
import { Paper, PaperPdf, PaperFigure } from '../model/paper';
import { CVInfoType, Award, Education, Experience } from '../model/profile';
import { PaperInCollection } from '../model/paperInCollection';
import { SIGN_UP_STEP } from '../components/auth/signUp/types';
import { OAuthCheckParams } from '../api/types/auth';
import { SignUpConversionExpTicketContext } from '../constants/abTest';
import { SearchResult } from '../api/search';
import { FILTER_BUTTON_TYPE } from '../components/filterButton';
import { FilterObject } from '../helpers/searchQueryManager';
import { AggregationJournal } from '../model/aggregation';
import { AUTHOR_PAPER_LIST_SORT_TYPES } from '../components/common/sortBox';

export enum ACTION_TYPES {
  GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING = 'GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING',
  GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE = 'GLOBAL_SUCCEED_TO_RENDER_AT_THE_CLIENT_SIDE',
  GLOBAL_CHANGE_DIALOG_TYPE = 'GLOBAL_CHANGE_DIALOG_TYPE',
  GLOBAL_ALERT_NOTIFICATION = 'GLOBAL_ALERT_NOTIFICATION',
  GLOBAL_CLEAR_NOTIFICATION = 'GLOBAL_CLEAR_NOTIFICATION',

  GLOBAL_ADD_ENTITY = 'GLOBAL_ADD_ENTITY',
  GLOBAL_FLUSH_ENTITIES = 'GLOBAL_FLUSH_ENTITIES',

  SEARCH_QUERY_CHANGE_QUERY = 'SEARCH_QUERY_CHANGE_QUERY',

  GLOBAL_START_TO_ADD_PAPER_TO_COLLECTION = 'GLOBAL_START_TO_ADD_PAPER_TO_COLLECTION',
  GLOBAL_SUCCEEDED_ADD_PAPER_TO_COLLECTION = 'GLOBAL_SUCCEEDED_ADD_PAPER_TO_COLLECTION',
  GLOBAL_FAILED_TO_ADD_PAPER_TO_COLLECTION = 'GLOBAL_FAILED_TO_ADD_PAPER_TO_COLLECTION',
  GLOBAL_START_TO_REMOVE_PAPER_FROM_COLLECTION = 'GLOBAL_START_TO_REMOVE_PAPER_FROM_COLLECTION',
  GLOBAL_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION = 'GLOBAL_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION',
  GLOBAL_FAILED_TO_REMOVE_PAPER_FROM_COLLECTION = 'GLOBAL_FAILED_TO_REMOVE_PAPER_FROM_COLLECTION',

  GLOBAL_DIALOG_OPEN = 'GLOBAL_DIALOG_OPEN',
  GLOBAL_DIALOG_CLOSE = 'GLOBAL_DIALOG_CLOSE',
  GLOBAL_DIALOG_SET_BLOCKED = 'GLOBAL_DIALOG_SET_BLOCKED',
  GLOBAL_DIALOG_UNSET_BLOCKED = 'GLOBAL_DIALOG_UNSET_BLOCKED',
  GLOBAL_DIALOG_START_TO_GET_COLLECTIONS = 'GLOBAL_DIALOG_START_TO_GET_COLLECTIONS',
  GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS = 'GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS',
  GLOBAL_DIALOG_FAILED_TO_GET_COLLECTIONS = 'GLOBAL_DIALOG_FAILED_TO_GET_COLLECTIONS',
  GLOBAL_DIALOG_START_TO_POST_COLLECTION = 'GLOBAL_DIALOG_START_TO_POST_COLLECTION',
  GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION = 'GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION',
  GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION = 'GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION',
  GLOBAL_DIALOG_START_TO_DELETE_COLLECTION = 'GLOBAL_DIALOG_START_TO_DELETE_COLLECTION',
  GLOBAL_DIALOG_SUCCEEDED_DELETE_COLLECTION = 'GLOBAL_DIALOG_SUCCEEDED_DELETE_COLLECTION',
  GLOBAL_DIALOG_FAILED_TO_DELETE_COLLECTION = 'GLOBAL_DIALOG_FAILED_TO_DELETE_COLLECTION',
  GLOBAL_DIALOG_START_TO_UPDATE_COLLECTION = 'GLOBAL_DIALOG_START_TO_UPDATE_COLLECTION',
  GLOBAL_DIALOG_SUCCEEDED_UPDATE_COLLECTION = 'GLOBAL_DIALOG_SUCCEEDED_UPDATE_COLLECTION',
  GLOBAL_DIALOG_FAILED_TO_UPDATE_COLLECTION = 'GLOBAL_DIALOG_FAILED_TO_UPDATE_COLLECTION',
  GLOBAL_DIALOG_CLICK_CITATION_TAB = 'GLOBAL_DIALOG_CLICK_CITATION_TAB',
  GLOBAL_DIALOG_START_TO_GET_CITATION_TEXT = 'GLOBAL_DIALOG_START_TO_GET_CITATION_TEXT',
  GLOBAL_DIALOG_SUCCEEDED_GET_CITATION_TEXT = 'GLOBAL_DIALOG_SUCCEEDED_GET_CITATION_TEXT',
  GLOBAL_DIALOG_FAILED_TO_GET_CITATION_TEXT = 'GLOBAL_DIALOG_FAILED_TO_GET_CITATION_TEXT',
  GLOBAL_DIALOG_FAILED_TO_GET_AUTHOR_LIST = 'GLOBAL_DIALOG_FAILED_TO_GET_AUTHOR_LIST',

  SET_DEVICE_TO_DESKTOP = 'SET_DEVICE_TO_DESKTOP',
  SET_DEVICE_TO_TABLET = 'SET_DEVICE_TO_TABLET',
  SET_DEVICE_TO_MOBILE = 'SET_DEVICE_TO_MOBILE',

  SIGN_IN_SUCCEEDED_TO_SIGN_IN = 'SIGN_IN_SUCCEEDED_TO_SIGN_IN',

  EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN = 'EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN',
  EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN = 'EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN',
  EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN = 'EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN',
  EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL = 'EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL',
  EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL = 'EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL',
  // tslint:disable-next-line:max-line-length
  EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL = 'EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL',

  AUTH_SUCCEEDED_TO_SIGN_OUT = 'AUTH_SUCCEEDED_TO_SIGN_OUT',
  AUTH_FAILED_TO_SIGN_OUT = 'AUTH_FAILED_TO_SIGN_OUT',
  AUTH_START_TO_CHECK_LOGGED_IN = 'AUTH_START_TO_CHECK_LOGGED_IN',
  AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN = 'AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN',
  AUTH_FAILED_TO_CHECK_LOGGED_IN = 'AUTH_FAILED_TO_CHECK_LOGGED_IN',

  PAPER_SHOW_CLEAR_PAPER_SHOW_STATE = 'PAPER_SHOW_CLEAR_PAPER_SHOW_STATE',
  PAPER_SHOW_SET_HIGHLIGHT = 'PAPER_SHOW_SET_HIGHLIGHT',
  PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS = 'PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS',
  PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS = 'PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS',
  PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS = 'PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS',
  PAPER_SHOW_START_TO_GET_CITED_PAPERS = 'PAPER_SHOW_START_TO_GET_CITED_PAPERS',
  PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS = 'PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS',
  PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS = 'PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS',
  PAPER_SHOW_START_TO_GET_PAPER = 'PAPER_SHOW_START_TO_GET_PAPER',
  PAPER_SHOW_SUCCEEDED_TO_GET_PAPER = 'PAPER_SHOW_SUCCEEDED_TO_GET_PAPER',
  PAPER_SHOW_FAILED_TO_GET_PAPER = 'PAPER_SHOW_FAILED_TO_GET_PAPER',
  PAPER_SHOW_START_TO_GET_COLLECTIONS = 'PAPER_SHOW_START_TO_GET_COLLECTIONS',
  PAPER_SHOW_SUCCEEDED_GET_COLLECTIONS = 'PAPER_SHOW_SUCCEEDED_GET_COLLECTIONS',
  PAPER_SHOW_START_TO_GET_COLLECTIONS_IN_DROPDOWN = 'PAPER_SHOW_START_TO_GET_COLLECTIONS_IN_DROPDOWN',
  PAPER_SHOW_FAILED_TO_GET_COLLECTIONS = 'PAPER_SHOW_FAILED_TO_GET_COLLECTIONS',
  PAPER_SHOW_START_TO_POST_COLLECTION = 'PAPER_SHOW_START_TO_POST_COLLECTION',
  PAPER_SHOW_SUCCEEDED_POST_COLLECTION = 'PAPER_SHOW_SUCCEEDED_POST_COLLECTION',
  PAPER_SHOW_FAILED_TO_POST_COLLECTION = 'PAPER_SHOW_FAILED_TO_POST_COLLECTION',
  PAPER_SHOW_START_TO_POST_PAPER_TO_COLLECTION = 'PAPER_SHOW_START_TO_POST_PAPER_TO_COLLECTION',
  PAPER_SHOW_SUCCEEDED_POST_PAPER_TO_COLLECTION = 'PAPER_SHOW_SUCCEEDED_POST_PAPER_TO_COLLECTION',
  PAPER_SHOW_FAILED_TO_POST_PAPER_TO_COLLECTION = 'PAPER_SHOW_FAILED_TO_POST_PAPER_TO_COLLECTION',
  PAPER_SHOW_START_TO_REMOVE_PAPER_FROM_COLLECTION = 'PAPER_SHOW_START_TO_REMOVE_PAPER_FROM_COLLECTION',
  PAPER_SHOW_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION = 'PAPER_SHOW_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION',
  PAPER_SHOW_FAILED_TO_REMOVE_PAPER_FROM_COLLECTION = 'PAPER_SHOW_FAILED_TO_REMOVE_PAPER_FROM_COLLECTION',

  PAPER_SHOW_COLLECTION_BUTTON_OPEN_COLLECTION_DROPDOWN = 'PAPER_SHOW_COLLECTION_BUTTON_OPEN_COLLECTION_DROPDOWN',
  PAPER_SHOW_COLLECTION_BUTTON_CLOSE_COLLECTION_DROPDOWN = 'PAPER_SHOW_COLLECTION_BUTTON_CLOSE_COLLECTION_DROPDOWN',
  PAPER_SHOW_COLLECTION_BUTTON_SELECT_COLLECTION = 'PAPER_SHOW_COLLECTION_BUTTON_SELECT_COLLECTION',
  PAPER_SHOW_COLLECTION_BUTTON_OPEN_NOTE_DROPDOWN = 'PAPER_SHOW_COLLECTION_BUTTON_OPEN_NOTE_DROPDOWN',
  PAPER_SHOW_COLLECTION_BUTTON_CLOSE_NOTE_DROPDOWN = 'PAPER_SHOW_COLLECTION_BUTTON_CLOSE_NOTE_DROPDOWN',
  PAPER_SHOW_COLLECTION_BUTTON_START_TO_UPDATE_PAPER_NOTE = 'PAPER_SHOW_COLLECTION_BUTTON_START_TO_UPDATE_PAPER_NOTE',
  // tslint:disable-next-line:max-line-length
  PAPER_SHOW_COLLECTION_BUTTON_SUCCEEDED_TO_UPDATE_PAPER_NOTE = 'PAPER_SHOW_COLLECTION_BUTTON_SUCCEEDED_TO_UPDATE_PAPER_NOTE',
  PAPER_SHOW_COLLECTION_BUTTON_FAILED_TO_UPDATE_PAPER_NOTE = 'PAPER_SHOW_COLLECTION_BUTTON_FAILED_TO_UPDATE_PAPER_NOTE',
  PAPER_SHOW_COLLECTION_BUTTON_TOGGLE_NOTE_EDIT_MODE = 'PAPER_SHOW_COLLECTION_BUTTON_TOGGLE_NOTE_EDIT_MODE',
  // tslint:disable-next-line:max-line-length
  PAPER_SHOW_COLLECTION_BUTTON_STALE_UPDATED_COLLECTION_NOTE = 'PAPER_SHOW_COLLECTION_BUTTON_STALE_UPDATED_COLLECTION_NOTE',

  PAPER_SHOW_FETCH_LAST_FULL_TEXT_REQUESTED_DATE = 'PAPER_SHOW_FETCH_LAST_FULL_TEXT_REQUESTED_DATE',

  ARTICLE_SEARCH_CHANGE_SEARCH_INPUT = 'ARTICLE_SEARCH_CHANGE_SEARCH_INPUT',
  ARTICLE_SEARCH_START_TO_GET_PAPERS = 'ARTICLE_SEARCH_START_TO_GET_PAPERS',
  ARTICLE_SEARCH_FAILED_TO_GET_PAPERS = 'ARTICLE_SEARCH_FAILED_TO_GET_PAPERS',
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS = 'ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS',
  ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS = 'ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS',
  ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS = 'ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS',
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS = 'ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS',
  ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS = 'ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS',
  ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS = 'ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS',
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS = 'ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS',
  ARTICLE_SEARCH_START_TO_GET_AUTHORS = 'ARTICLE_SEARCH_START_TO_GET_AUTHORS',
  ARTICLE_SEARCH_FAILED_TO_GET_AUTHORS = 'ARTICLE_SEARCH_FAILED_TO_GET_AUTHORS',
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_AUTHORS = 'ARTICLE_SEARCH_SUCCEEDED_TO_GET_AUTHORS',
  ARTICLE_SEARCH_SET_ACTIVE_FILTER_BOX_BUTTON = 'ARTICLE_SEARCH_SET_ACTIVE_FILTER_BOX_BUTTON',
  ARTICLE_SEARCH_SYNC_FILTERS_WITH_QUERY_PARAMS = 'ARTICLE_SEARCH_SYNC_FILTERS_WITH_QUERY_PARAMS',
  ARTICLE_SEARCH_SELECT_JOURNAL_FILTER_ITEM = 'ARTICLE_SEARCH_SELECT_JOURNAL_FILTER_ITEM',
  ARTICLE_SEARCH_SELECT_FOS_FILTER_ITEM = 'ARTICLE_SEARCH_SELECT_FOS_FILTER_ITEM',
  ARTICLE_SEARCH_CLEAR_JOURNAL_FILTER = 'ARTICLE_SEARCH_CLEAR_JOURNAL_FILTER',
  ARTICLE_SEARCH_ADD_JOURNAL_FILTER_ITEMS = 'ARTICLE_SEARCH_ADD_JOURNAL_FILTER_ITEMS',
  ARTICLE_SEARCH_CLEAR_FOS_FILTER = 'ARTICLE_SEARCH_CLEAR_FOS_FILTER',
  ARTICLE_SEARCH_DISABLE_AUTO_YEAR_FILTER = 'ARTICLE_SEARCH_DISABLE_AUTO_YEAR_FILTER',

  AUTHOR_SHOW_START_TO_LOAD_DATA_FOR_PAGE = 'AUTHOR_SHOW_START_TO_LOAD_DATA_FOR_PAGE',
  AUTHOR_SHOW_FINISH_TO_LOAD_DATA_FOR_PAGE = 'AUTHOR_SHOW_FINISH_TO_LOAD_DATA_FOR_PAGE',
  AUTHOR_SHOW_FAILED_TO_LOAD_DATA_FOR_PAGE = 'AUTHOR_SHOW_FAILED_TO_LOAD_DATA_FOR_PAGE',
  AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR = 'AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR',
  AUTHOR_SHOW_FAILED_GET_AUTHOR = 'AUTHOR_SHOW_FAILED_GET_AUTHOR',
  AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS = 'AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS',
  AUTHOR_SHOW_SUCCEEDED_GET_PROFILE = 'AUTHOR_SHOW_SUCCEEDED_GET_PROFILE',
  AUTHOR_SHOW_START_TO_GET_PAPERS = 'AUTHOR_SHOW_START_TO_GET_PAPERS',
  AUTHOR_SHOW_FAILED_TO_GET_PAPERS = 'AUTHOR_SHOW_FAILED_TO_GET_PAPERS',
  AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS = 'AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS',
  AUTHOR_SHOW_TOGGLE_CONNECT_MEMBER_DIALOG = 'AUTHOR_SHOW_TOGGLE_CONNECT_MEMBER_DIALOG',
  AUTHOR_SHOW_START_TO_CONNECT_AUTHOR = 'AUTHOR_SHOW_START_TO_CONNECT_AUTHOR',
  AUTHOR_SHOW_SUCCEED_TO_CONNECT_AUTHOR = 'AUTHOR_SHOW_SUCCEED_TO_CONNECT_AUTHOR',
  AUTHOR_SHOW_FAIL_TO_CONNECT_AUTHOR = 'AUTHOR_SHOW_FAIL_TO_CONNECT_AUTHOR',
  AUTHOR_SHOW_START_TO_ADD_PROFILE_CV_DATA = 'AUTHOR_SHOW_START_TO_ADD_PROFILE_CV_DATA',
  AUTHOR_SHOW_SUCCEEDED_TO_ADD_PROFILE_CV_DATA = 'AUTHOR_SHOW_SUCCEEDED_TO_ADD_PROFILE_CV_DATA',
  AUTHOR_SHOW_FAIL_TO_ADD_PROFILE_CV_DATA = 'AUTHOR_SHOW_FAIL_TO_ADD_PROFILE_CV_DATA',
  AUTHOR_SHOW_START_TO_UPDATE_PROFILE_CV_DATA = 'AUTHOR_SHOW_START_TO_UPDATE_PROFILE_CV_DATA',
  AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_CV_DATA = 'AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_CV_DATA',
  AUTHOR_SHOW_START_TO_REMOVE_PROFILE_CV_DATA = 'AUTHOR_SHOW_START_TO_REMOVE_PROFILE_CV_DATA',
  AUTHOR_SHOW_SUCCEEDED_TO_REMOVE_PROFILE_CV_DATA = 'AUTHOR_SHOW_SUCCEEDED_TO_REMOVE_PROFILE_CV_DATA',
  AUTHOR_SHOW_FAIL_TO_REMOVE_PROFILE_CV_DATA = 'AUTHOR_SHOW_FAIL_TO_REMOVE_PROFILE_CV_DATA',

  // tslint:disable-next-line:max-line-length
  CONNECTED_AUTHOR_SHOW_START_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST = 'CONNECTED_AUTHOR_SHOW_START_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST',
  // tslint:disable-next-line:max-line-length
  CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST = 'CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST',
  // tslint:disable-next-line:max-line-length
  CONNECTED_AUTHOR_SHOW_FAILED_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST = 'CONNECTED_AUTHOR_SHOW_FAILED_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST',
  CONNECTED_AUTHOR_SHOW_START_TO_UPDATE_PROFILE_DATA = 'CONNECTED_AUTHOR_SHOW_START_TO_UPDATE_PROFILE_DATA',
  CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_DATA = 'CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_DATA',
  CONNECTED_AUTHOR_SHOW_FAILED_TO_UPDATE_PROFILE_DATA = 'CONNECTED_AUTHOR_SHOW_FAILED_TO_UPDATE_PROFILE_DATA',
  CONNECTED_AUTHOR_SHOW_START_TO_UPDATE_PROFILE_IMAGE_DATA = 'CONNECTED_AUTHOR_SHOW_START_TO_UPDATE_PROFILE_IMAGE_DATA',
  // tslint:disable-next-line:max-line-length
  CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_IMAGE_DATA = 'CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_IMAGE_DATA',
  // tslint:disable-next-line:max-line-length
  CONNECTED_AUTHOR_SHOW_FAILED_TO_UPDATE_PROFILE_IMAGE_DATA = 'CONNECTED_AUTHOR_SHOW_FAILED_TO_UPDATE_PROFILE_IMAGE_DATA',
  // tslint:disable-next-line:max-line-length
  CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_CHANGE_REPRESENTATIVE_PAPERS = 'CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_CHANGE_REPRESENTATIVE_PAPERS',

  COLLECTIONS_START_TO_GET_COLLECTIONS = 'COLLECTIONS_START_TO_GET_COLLECTIONS',
  COLLECTIONS_SUCCEEDED_GET_COLLECTIONS = 'COLLECTIONS_SUCCEEDED_GET_COLLECTIONS',
  COLLECTIONS_FAILED_TO_GET_COLLECTIONS = 'COLLECTIONS_FAILED_TO_GET_COLLECTIONS',
  COLLECTIONS_START_TO_GET_MEMBER = 'COLLECTIONS_START_TO_GET_MEMBER',
  COLLECTIONS_SUCCEEDED_GET_MEMBER = 'COLLECTIONS_SUCCEEDED_GET_MEMBER',
  COLLECTIONS_FAILED_TO_GET_MEMBER = 'COLLECTIONS_FAILED_TO_GET_MEMBER',
  COLLECTIONS_FAILED_TO_GET_PAGE_DATA = 'COLLECTIONS_FAILED_TO_GET_PAGE_DATA',

  COLLECTIONS_SUCCEEDED_GET_MEMBER_COLLECTIONS = 'COLLECTIONS_SUCCEEDED_GET_MEMBER_COLLECTIONS',

  COLLECTION_SHOW_START_TO_GET_COLLECTION = 'COLLECTION_SHOW_START_TO_GET_COLLECTION',
  COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION = 'COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION',
  COLLECTION_SHOW_FAILED_TO_GET_COLLECTION = 'COLLECTION_SHOW_FAILED_TO_GET_COLLECTION',
  COLLECTION_SHOW_START_TO_GET_PAPERS = 'COLLECTION_SHOW_START_TO_GET_PAPERS',
  COLLECTION_SHOW_SUCCEEDED_GET_PAPERS = 'COLLECTION_SHOW_SUCCEEDED_GET_PAPERS',
  COLLECTION_SHOW_FAILED_TO_GET_PAPERS = 'COLLECTION_SHOW_FAILED_TO_GET_PAPERS',
  JOURNAL_SHOW_START_TO_GET_JOURNAL = 'JOURNAL_SHOW_START_TO_GET_JOURNAL',
  JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL = 'JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL',
  JOURNAL_SHOW_FAILED_TO_GET_JOURNAL = 'JOURNAL_SHOW_FAILED_TO_GET_JOURNAL',
  JOURNAL_SHOW_START_TO_GET_PAPERS = 'JOURNAL_SHOW_START_TO_GET_PAPERS',
  JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS = 'JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS',
  JOURNAL_SHOW_FAILED_TO_GET_PAPERS = 'JOURNAL_SHOW_FAILED_TO_GET_PAPERS',

  RELATED_PAPERS_START_TO_GET_PAPERS = 'RELATED_PAPERS_START_TO_GET_PAPERS',
  RELATED_PAPERS_SUCCEEDED_TO_GET_PAPERS = 'RELATED_PAPERS_SUCCEEDED_TO_GET_PAPERS',
  RELATED_PAPERS_FAILED_TO_GET_PAPERS = 'RELATED_PAPERS_FAILED_TO_GET_PAPERS',

  PDF_VIEWER_SET_PDF_BLOB = 'PDF_VIEWER_SET_PDF_BLOB',
  PDF_VIEWER_START_TO_FETCH_PDF = 'PDF_VIEWER_START_TO_FETCH_PDF',
  PDF_VIEWER_FAIL_TO_FETCH_PDF = 'PDF_VIEWER_FAIL_TO_FETCH_PDF',
  PDF_VIEWER_SUCCEED_TO_FETCH_PDF = 'PDF_VIEWER_SUCCEED_TO_FETCH_PDF',
  PDF_VIEWER_CLICK_DOWNLOAD_BTN = 'PDF_VIEWER_CLICK_DOWNLOAD_BTN',
  PDF_VIEWER_CLICK_RELOAD_BTN = 'PDF_VIEWER_CLICK_RELOAD_BTN',
  PDF_VIEWER_CLICK_VIEW_MORE_BTN = 'PDF_VIEWER_CLICK_VIEW_MORE_BTN',
  PDF_VIEWER_GET_BEST_PDF_OF_PAPER = 'PDF_VIEWER_GET_BEST_PDF_OF_PAPER',

  KNOWLEDGE_BASE_NOTI_OPEN = 'KNOWLEDGE_BASE_NOTI_OPEN',
  KNOWLEDGE_BASE_NOTI_CLOSE = 'KNOWLEDGE_BASE_NOTI_CLOSE',
}

export function createAction<T extends { type: ACTION_TYPES }>(d: T): T {
  return d;
}

interface GetMultiPapersInCollection {
  paperResponse: NormalizedDataWithPaginationV2<{
    papersInCollection: {
      [paperId: number]: PaperInCollection;
    };
  }>;
  sort?: string;
  query?: string;
}

interface GetMultiPapers extends PageObjectV2 {
  paperIds: number[];
  sort?: AUTHOR_PAPER_LIST_SORT_TYPES;
  query?: string;
}

export const ActionCreators = {
  changeGlobalDialog(payload: { type: GLOBAL_DIALOG_TYPE; signUpStep?: SIGN_UP_STEP; oauthResult?: OAuthCheckParams }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE,
      payload,
    });
  },

  openGlobalDialog(payload: {
    type: GLOBAL_DIALOG_TYPE;
    collectionDialogTargetPaperId?: number;
    citationDialogTargetPaperId?: number;
    authorListTargetPaper?: Paper;
    collection?: Collection;
    userActionType?: Scinapse.ActionTicket.ActionTagType;
    authContext?: SignUpConversionExpTicketContext;
    isBlocked?: boolean;
    nextSignUpStep?: string;
    paperFigures?: PaperFigure[];
    currentPaperFigureIndex?: number;
  }) {
    return createAction({ type: ACTION_TYPES.GLOBAL_DIALOG_OPEN, payload });
  },

  closeGlobalDialog() {
    return createAction({ type: ACTION_TYPES.GLOBAL_DIALOG_CLOSE });
  },

  setBlockedGlobalDialog() {
    return createAction({ type: ACTION_TYPES.GLOBAL_DIALOG_SET_BLOCKED });
  },

  unsetBlockedGlobalDialog() {
    return createAction({ type: ACTION_TYPES.GLOBAL_DIALOG_UNSET_BLOCKED });
  },

  startToGetRelatedPapers() {
    return createAction({ type: ACTION_TYPES.RELATED_PAPERS_START_TO_GET_PAPERS });
  },

  failedToGetRelatedPapers() {
    return createAction({ type: ACTION_TYPES.RELATED_PAPERS_FAILED_TO_GET_PAPERS });
  },

  getRelatedPapers(payload: { paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.RELATED_PAPERS_SUCCEEDED_TO_GET_PAPERS,
      payload,
    });
  },

  setPDFBlob(payload: { blob: Blob }) {
    return createAction({
      type: ACTION_TYPES.PDF_VIEWER_SET_PDF_BLOB,
      payload,
    });
  },

  startToFetchPDF() {
    return createAction({ type: ACTION_TYPES.PDF_VIEWER_START_TO_FETCH_PDF });
  },

  failToFetchPDF() {
    return createAction({ type: ACTION_TYPES.PDF_VIEWER_FAIL_TO_FETCH_PDF });
  },

  succeedToFetchPDF(payload: { pdf: any }) {
    return createAction({ type: ACTION_TYPES.PDF_VIEWER_SUCCEED_TO_FETCH_PDF, payload });
  },

  clickPDFDownloadBtn() {
    return createAction({ type: ACTION_TYPES.PDF_VIEWER_CLICK_DOWNLOAD_BTN });
  },

  clickPDFReloadBtn() {
    return createAction({ type: ACTION_TYPES.PDF_VIEWER_CLICK_RELOAD_BTN });
  },

  clickPDFViewMoreBtn() {
    return createAction({ type: ACTION_TYPES.PDF_VIEWER_CLICK_VIEW_MORE_BTN });
  },

  getBestPDFOfPaper(payload: { paperId: number; bestPDF: PaperPdf }) {
    return createAction({ type: ACTION_TYPES.PDF_VIEWER_GET_BEST_PDF_OF_PAPER, payload });
  },

  startToLoadAuthorShowPageData() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_START_TO_LOAD_DATA_FOR_PAGE });
  },

  finishToLoadAuthorShowPageData() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_FINISH_TO_LOAD_DATA_FOR_PAGE });
  },

  failedToLoadAuthorShowPageData(payload: { statusCode: number }) {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_FAILED_TO_LOAD_DATA_FOR_PAGE, payload });
  },

  toggleConnectAuthorDialog() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_TOGGLE_CONNECT_MEMBER_DIALOG });
  },

  startToConnectAuthor() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_START_TO_CONNECT_AUTHOR });
  },

  succeedToConnectAuthor(payload: { authorId: number }) {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_SUCCEED_TO_CONNECT_AUTHOR, payload });
  },

  succeedToUpdateAuthorRepresentativePapers(payload: { papers: Paper[]; authorId: number }) {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_CHANGE_REPRESENTATIVE_PAPERS,
      payload,
    });
  },

  signOut() {
    return createAction({ type: ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT });
  },

  failToConnectAuthor() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_FAIL_TO_CONNECT_AUTHOR });
  },

  getProfile(payload: { authorId: number }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_PROFILE,
      payload,
    });
  },

  getCoAuthors(payload: { coAuthorIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS,
      payload,
    });
  },

  getAuthor(payload: { authorId: number }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR,
      payload,
    });
  },

  failedToGetAuthor() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_FAILED_GET_AUTHOR });
  },

  startToGetAuthorPapers() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_START_TO_GET_PAPERS });
  },

  failedToGetAuthorPapers() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_FAILED_TO_GET_PAPERS });
  },

  getAuthorPapers(payload: GetMultiPapers) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS,
      payload,
    });
  },

  startToGetPaper() {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER });
  },

  failedToGetPaper(payload: { statusCode: number }) {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER, payload });
  },

  getPaper(payload: { paperId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER,
      payload,
    });
  },

  getReferencePapers(payload: GetMultiPapers) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
      payload,
    });
  },

  getCitedPapers(payload: GetMultiPapers) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS,
      payload,
    });
  },

  startToAddPaperToAuthorPaperList() {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_START_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST,
    });
  },

  succeededToAddPaperToAuthorPaperList() {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST,
    });
  },

  failedToAddPaperToAuthorPaperList() {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_FAILED_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST,
    });
  },

  startToUpdateProfileData() {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_START_TO_UPDATE_PROFILE_DATA,
    });
  },

  succeededToUpdateProfileData() {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_DATA,
    });
  },

  failedToUpdateProfileData() {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_FAILED_TO_UPDATE_PROFILE_DATA,
    });
  },

  startToUpdateProfileImageData() {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_START_TO_UPDATE_PROFILE_IMAGE_DATA,
    });
  },

  succeededToUpdateProfileImageData(payload: { authorId: number; profileImageUrl: string }) {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_IMAGE_DATA,
      payload,
    });
  },

  failedToUpdateProfileImageData() {
    return createAction({
      type: ACTION_TYPES.CONNECTED_AUTHOR_SHOW_FAILED_TO_UPDATE_PROFILE_IMAGE_DATA,
    });
  },

  handleClickCitationTab(payload: { tab: AvailableCitationType }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_CLICK_CITATION_TAB,
      payload,
    });
  },

  startToGetCitationText() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_GET_CITATION_TEXT,
    });
  },

  succeededToGetCitationText(payload: { citationText: string }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_GET_CITATION_TEXT,
      payload,
    });
  },

  failedToGetCitationText() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_GET_CITATION_TEXT,
    });
  },

  startToGetReferencePapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS,
    });
  },

  failedToGetReferencePapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS,
    });
  },

  startToGetCitedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS,
    });
  },

  failedToGetCitedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS,
    });
  },

  startToGetCollectionInCollectionShow() {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_COLLECTION,
    });
  },

  succeededToGetCollectionInCollectionShow(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION,
      payload,
    });
  },

  failedToGetCollectionInCollectionShow(payload: { statusCode: number }) {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_COLLECTION,
      payload,
    });
  },

  startToGetCollectionsInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_GET_COLLECTIONS,
    });
  },

  succeededToGetCollectionsInGlobalDialog(payload: { collectionIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS,
      payload,
    });
  },

  failedToGetCollectionsInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_GET_COLLECTIONS,
    });
  },

  startToPostCollectionInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_POST_COLLECTION,
    });
  },

  succeededToPostCollectionInGlobalDialog(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION,
      payload,
    });
  },

  failedToPostCollectionInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION,
    });
  },

  startToAddPaperToCollectionInGlobalDialog(payload: { collection: Collection; paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_START_TO_ADD_PAPER_TO_COLLECTION,
      payload,
    });
  },

  succeededToAddPaperToCollectionInGlobalDialog(payload: { collection: Collection; paperId: number }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_SUCCEEDED_ADD_PAPER_TO_COLLECTION,
      payload,
    });
  },

  failedToAddPaperToCollectionInGlobalDialog(payload: { collection: Collection; paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_FAILED_TO_ADD_PAPER_TO_COLLECTION,
      payload,
    });
  },

  startToRemovePaperFromCollection(payload: { collection: Collection; paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_START_TO_REMOVE_PAPER_FROM_COLLECTION,
      payload,
    });
  },

  succeededToRemovePaperFromCollection(payload: { collection: Collection; paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION,
      payload,
    });
  },

  failedToRemovePaperFromCollection(payload: { collection: Collection; paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_PAPER_FROM_COLLECTION,
      payload,
    });
  },

  startToGetCollectionsInPaperShow() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_COLLECTIONS,
    });
  },

  startToGetCollectionsInPaperShowDropdown() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_COLLECTIONS_IN_DROPDOWN,
    });
  },

  succeededToGetCollectionsInPaperShow(payload: GetCollectionsResponse) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_GET_COLLECTIONS,
      payload,
    });
  },

  failedToGetCollectionsInPaperShow() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COLLECTIONS,
    });
  },

  startToPostCollectionInCollectionDropdown() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_POST_COLLECTION,
    });
  },

  succeededToPostCollectionInCollectionDropdown(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_POST_COLLECTION,
      payload,
    });
  },

  failedToPostCollectionInCollectionDropdown() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COLLECTION,
    });
  },

  startToGetCollectionsInCollectionsPage() {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_START_TO_GET_COLLECTIONS,
    });
  },

  succeededToGetCollectionsInCollectionsPage(payload: GetCollectionsResponse) {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_COLLECTIONS,
      payload,
    });
  },

  failedToGetCollectionsInCollectionsPage() {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_FAILED_TO_GET_COLLECTIONS,
    });
  },

  succeedToGetCollectionsInMember(payload: GetCollectionsResponse) {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_MEMBER_COLLECTIONS,
      payload,
    });
  },

  startToGetMemberInCollectionsPage() {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_START_TO_GET_MEMBER,
    });
  },

  succeededToGetMemberInCollectionsPage(payload: { memberId: number }) {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_MEMBER,
      payload,
    });
  },

  failedToGetMemberInCollectionsPage() {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_FAILED_TO_GET_MEMBER,
    });
  },

  failedToGetCollectionsPageData(payload: { statusCode: number }) {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_FAILED_TO_GET_PAGE_DATA,
      payload,
    });
  },

  startToGetPapersInCollectionShow() {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_PAPERS,
    });
  },

  succeededToGetPapersInCollectionShow(payload: GetMultiPapersInCollection) {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_PAPERS,
      payload,
    });
  },

  startToDeleteCollection() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_DELETE_COLLECTION,
    });
  },

  succeededToDeleteCollection(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_DELETE_COLLECTION,
      payload,
    });
  },

  failedToDeleteCollection() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_DELETE_COLLECTION,
    });
  },

  startToUpdateCollection() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_UPDATE_COLLECTION,
    });
  },

  succeededToUpdateCollection(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_UPDATE_COLLECTION,
      payload,
    });
  },

  failedToUpdateCollection() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_UPDATE_COLLECTION,
    });
  },

  startToGetJournal() {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_JOURNAL,
    });
  },

  succeededToGetJournal(payload: { journalId: number }) {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL,
      payload,
    });
  },

  failedToGetJournal(payload: { statusCode: number }) {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_JOURNAL,
      payload,
    });
  },

  startToGetJournalPapers() {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_PAPERS,
    });
  },

  succeededToGetJournalPapers(payload: {
    paperIds: number[];
    totalPage: number;
    currentPage: number;
    paperCount: number;
    filteredPaperCount: number;
    searchKeyword?: string;
  }) {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS,
      payload,
    });
  },

  failedToGetJournalPapers() {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_PAPERS,
    });
  },

  failedToGetAuthorList() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_GET_AUTHOR_LIST,
    });
  },

  failedToGetPapersInCollectionShow() {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_PAPERS,
    });
  },

  clearPaperShowState() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE,
    });
  },

  openCollectionDropdownInPaperShowCollectionDropdown() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_OPEN_COLLECTION_DROPDOWN,
    });
  },

  closeCollectionDropdownInPaperShowCollectionDropdown() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_CLOSE_COLLECTION_DROPDOWN,
    });
  },

  openNoteDropdownInPaperShow() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_OPEN_NOTE_DROPDOWN,
    });
  },

  closeNoteDropdownInPaperShow() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_CLOSE_NOTE_DROPDOWN,
    });
  },

  startToPostPaperToCollection() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_POST_PAPER_TO_COLLECTION,
    });
  },

  succeededPostPaperToCollection(payload: { collection: Collection }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_POST_PAPER_TO_COLLECTION,
      payload,
    });
  },

  failedToPostPaperToCollection() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_PAPER_TO_COLLECTION,
    });
  },

  startToRemovePaperFromCollectionInPaperShow() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_REMOVE_PAPER_FROM_COLLECTION,
    });
  },

  succeededToRemovePaperFromCollectionInPaperShow(payload: { collection: Collection }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION,
      payload,
    });
  },

  failedToRemovePaperFromCollectionInPaperShow() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_REMOVE_PAPER_FROM_COLLECTION,
    });
  },

  startToUpdatePaperNote() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_START_TO_UPDATE_PAPER_NOTE,
    });
  },

  succeededToUpdatePaperNote(payload: { paperId: number; collectionId: number; note: string | null }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_SUCCEEDED_TO_UPDATE_PAPER_NOTE,
      payload,
    });
  },

  failedToUpdatePaperNote() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_FAILED_TO_UPDATE_PAPER_NOTE,
    });
  },

  toggleNoteEditMode() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_TOGGLE_NOTE_EDIT_MODE,
    });
  },

  staleUpdatedCollectionNote(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_STALE_UPDATED_COLLECTION_NOTE,
      payload,
    });
  },

  selectCollection(payload: { collection: Collection }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_SELECT_COLLECTION,
      payload,
    });
  },

  startToAddProfileCvData(payload: { CVType: keyof CVInfoType }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_START_TO_ADD_PROFILE_CV_DATA,
      payload,
    });
  },

  succeedToAddProfileCvData(payload: {
    authorId: number;
    cvInfoType: keyof CVInfoType;
    cvInformation: Award | Education | Experience;
  }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_ADD_PROFILE_CV_DATA,
      payload,
    });
  },

  failToAddProfileCvData() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_FAIL_TO_ADD_PROFILE_CV_DATA });
  },

  startToUpdateProfileCvData(payload: { CVType: keyof CVInfoType }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_START_TO_UPDATE_PROFILE_CV_DATA,
      payload,
    });
  },

  succeededToUpdateProfileCvData(payload: {
    authorId: number;
    cvInfoType: keyof CVInfoType;
    cvInformation: Award | Education | Experience;
  }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_CV_DATA,
      payload,
    });
  },

  startToRemoveProfileCvData(payload: { CVType: keyof CVInfoType }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_START_TO_REMOVE_PROFILE_CV_DATA,
      payload,
    });
  },

  succeededToRemoveProfileCvData(payload: {
    authorId: number;
    cvInfoType: keyof CVInfoType;
    cvInformation: Award | Education | Experience;
  }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_REMOVE_PROFILE_CV_DATA,
      payload,
    });
  },

  setHighlightContentInPaperShow(payload: { title: string; abstract: string }) {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_SET_HIGHLIGHT, payload });
  },

  failToRemoveProfileCvData() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_FAIL_TO_REMOVE_PROFILE_CV_DATA });
  },

  changeSearchQuery(payload: { query: string }) {
    return createAction({ type: ACTION_TYPES.SEARCH_QUERY_CHANGE_QUERY, payload });
  },

  openKnowledgeBaseNoti(payload: { actionArea: string }) {
    return createAction({ type: ACTION_TYPES.KNOWLEDGE_BASE_NOTI_OPEN, payload });
  },

  closeKnowledgeBaseNoti() {
    return createAction({ type: ACTION_TYPES.KNOWLEDGE_BASE_NOTI_CLOSE });
  },

  fetchLastFullTextRequestedDate(payload: { requestedAt: string | null }) {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_FETCH_LAST_FULL_TEXT_REQUESTED_DATE, payload });
  },

  addEntity(payload: { entities: { [K in keyof AppEntities]?: AppEntities[K] }; result: number | number[] }) {
    return createAction({ type: ACTION_TYPES.GLOBAL_ADD_ENTITY, payload });
  },

  flushEntities() {
    return createAction({ type: ACTION_TYPES.GLOBAL_FLUSH_ENTITIES });
  },
};

export type ActionUnion<T extends ActionCreatorsMapObject> = ReturnType<T[keyof T]>;

interface SucceedToGetSearchResultAction {
  type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS;
  payload: SearchResult;
}

export interface SetActiveFilterBoxButtonAction {
  type: ACTION_TYPES.ARTICLE_SEARCH_SET_ACTIVE_FILTER_BOX_BUTTON;
  payload: { button: FILTER_BUTTON_TYPE | null };
}

export interface SyncFilterWithQueryParamsAction {
  type: ACTION_TYPES.ARTICLE_SEARCH_SYNC_FILTERS_WITH_QUERY_PARAMS;
  payload: { filters: FilterObject; sorting: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS };
}

interface SelectJournalFilterItemAction {
  type: ACTION_TYPES.ARTICLE_SEARCH_SELECT_JOURNAL_FILTER_ITEM;
  payload: { journalId: number };
}

interface SelectFOSFilterItemAction {
  type: ACTION_TYPES.ARTICLE_SEARCH_SELECT_FOS_FILTER_ITEM;
  payload: { FOSId: number };
}

interface ClearJournalFilterAction {
  type: ACTION_TYPES.ARTICLE_SEARCH_CLEAR_JOURNAL_FILTER;
}

interface ClearFOSFilterAction {
  type: ACTION_TYPES.ARTICLE_SEARCH_CLEAR_FOS_FILTER;
}

interface AddJournalFilterItems {
  type: ACTION_TYPES.ARTICLE_SEARCH_ADD_JOURNAL_FILTER_ITEMS;
  payload: {
    journals: AggregationJournal[];
  };
}

interface DisableAutoYearFilter {
  type: ACTION_TYPES.ARTICLE_SEARCH_DISABLE_AUTO_YEAR_FILTER;
}

export type SearchActions =
  | SucceedToGetSearchResultAction
  | SetActiveFilterBoxButtonAction
  | SyncFilterWithQueryParamsAction
  | SelectJournalFilterItemAction
  | SelectFOSFilterItemAction
  | ClearJournalFilterAction
  | ClearFOSFilterAction
  | AddJournalFilterItems
  | DisableAutoYearFilter;

export type Actions = ActionUnion<typeof ActionCreators>;
