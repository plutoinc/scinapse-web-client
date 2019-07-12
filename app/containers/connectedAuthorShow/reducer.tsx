import { ACTION_TYPES, Actions } from '../../actions/actionTypes';
import { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../components/common/sortBox';
import { CVInfoType } from '../../model/profile';

export interface ConnectedAuthorShowState
  extends Readonly<{
      paperIds: number[];
      authorId: number | null;
      coAuthorIds: number[];
      papersTotalPage: number;
      papersCurrentPage: number;
      papersTotalCount: number;
      papersSort: AUTHOR_PAPER_LIST_SORT_TYPES;
      paperSearchQuery: string;
      isLoadingPage: boolean;
      isLoadingPapers: boolean;
      isLoadingToUpdateProfile: boolean;
      hasFailedToUpdateProfile: boolean;
      isLoadingToUpdateProfileImage: boolean;
      isLoadingToAddPaperToAuthorPaperList: boolean;
      hasFailedToAddPaperToAuthorPaperList: boolean;
      isFetchingCVForm: keyof CVInfoType | null;
      pageErrorStatusCode: number | null;
    }> {}

export const CONNECTED_AUTHOR_SHOW_INITIAL_STATE: ConnectedAuthorShowState = {
  paperIds: [],
  authorId: null,
  coAuthorIds: [],
  papersTotalPage: 0,
  papersCurrentPage: 1,
  papersTotalCount: 0,
  papersSort: 'NEWEST_FIRST',
  paperSearchQuery: '',
  isLoadingPage: false,
  isLoadingPapers: false,
  isLoadingToUpdateProfile: false,
  hasFailedToUpdateProfile: false,
  isLoadingToUpdateProfileImage: false,
  isLoadingToAddPaperToAuthorPaperList: false,
  hasFailedToAddPaperToAuthorPaperList: false,
  isFetchingCVForm: null,
  pageErrorStatusCode: null,
};

export function reducer(
  state: ConnectedAuthorShowState = CONNECTED_AUTHOR_SHOW_INITIAL_STATE,
  action: Actions
): ConnectedAuthorShowState {
  switch (action.type) {
    case ACTION_TYPES.AUTHOR_SHOW_START_TO_LOAD_DATA_FOR_PAGE: {
      return {
        ...state,
        isLoadingPage: true,
        pageErrorStatusCode: null,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_FINISH_TO_LOAD_DATA_FOR_PAGE: {
      return {
        ...state,
        isLoadingPage: false,
        pageErrorStatusCode: null,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_FAILED_TO_LOAD_DATA_FOR_PAGE: {
      return {
        ...state,
        pageErrorStatusCode: action.payload.statusCode,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR: {
      return {
        ...state,
        authorId: action.payload.authorId,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS: {
      return {
        ...state,
        coAuthorIds: action.payload.coAuthorIds,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_START_TO_GET_PAPERS: {
      return {
        ...state,
        isLoadingPapers: true,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_FAILED_TO_GET_PAPERS: {
      return {
        ...state,
        isLoadingPapers: false,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS: {
      return {
        ...state,
        paperSearchQuery: action.payload.query || '',
        papersSort: action.payload.sort!,
        paperIds: action.payload.paperIds,
        isLoadingPapers: false,
        papersTotalPage: action.payload.totalPages,
        papersCurrentPage: action.payload.page,
        papersTotalCount: action.payload.totalElements,
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_START_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST: {
      return {
        ...state,
        isLoadingToAddPaperToAuthorPaperList: true,
        hasFailedToAddPaperToAuthorPaperList: false,
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST: {
      return {
        ...state,
        isLoadingToAddPaperToAuthorPaperList: false,
        hasFailedToAddPaperToAuthorPaperList: false,
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_FAILED_TO_ADD_PAPER_TO_AUTHOR_PAPER_LIST: {
      return {
        ...state,
        isLoadingToAddPaperToAuthorPaperList: false,
        hasFailedToAddPaperToAuthorPaperList: true,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_START_TO_CONNECT_AUTHOR:
    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_START_TO_UPDATE_PROFILE_DATA: {
      return {
        ...state,
        isLoadingToUpdateProfile: true,
        hasFailedToUpdateProfile: false,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEED_TO_CONNECT_AUTHOR:
    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_DATA: {
      return {
        ...state,
        isLoadingToUpdateProfile: false,
        hasFailedToUpdateProfile: false,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_FAIL_TO_CONNECT_AUTHOR:
    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_FAILED_TO_UPDATE_PROFILE_DATA: {
      return {
        ...state,
        isLoadingToUpdateProfile: false,
        hasFailedToUpdateProfile: true,
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_START_TO_UPDATE_PROFILE_IMAGE_DATA: {
      return {
        ...state,
        isLoadingToUpdateProfileImage: true,
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_IMAGE_DATA: {
      return {
        ...state,
        isLoadingToUpdateProfileImage: false,
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_FAILED_TO_UPDATE_PROFILE_IMAGE_DATA: {
      return {
        ...state,
        isLoadingToUpdateProfileImage: false,
      };
    }

    default:
      return state;
  }
}
