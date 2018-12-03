import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { AUTHOR_PAPER_LIST_SORT_TYPES } from "../../components/common/sortBox";

export interface AuthorShowState
  extends Readonly<{
      paperIds: number[];
      authorId: number | null;
      coAuthorIds: number[];
      papersTotalPage: number;
      papersCurrentPage: number;
      papersTotalCount: number;
      papersSort: AUTHOR_PAPER_LIST_SORT_TYPES;
      isOpenConnectProfileDialog: boolean;
      isLoadingPage: boolean;
      isLoadingPapers: boolean;
      isLoadingToUpdateProfile: boolean;
      hasFailedToUpdateProfile: boolean;
    }> {}

export const AUTHOR_SHOW_INITIAL_STATE: AuthorShowState = {
  paperIds: [],
  authorId: null,
  coAuthorIds: [],
  papersTotalPage: 0,
  papersCurrentPage: 1,
  papersTotalCount: 0,
  papersSort: "NEWEST_FIRST",
  isOpenConnectProfileDialog: false,
  isLoadingPage: false,
  isLoadingPapers: false,
  isLoadingToUpdateProfile: false,
  hasFailedToUpdateProfile: false,
};

export function reducer(state: AuthorShowState = AUTHOR_SHOW_INITIAL_STATE, action: Actions): AuthorShowState {
  switch (action.type) {
    case ACTION_TYPES.AUTHOR_SHOW_TOGGLE_CONNECT_MEMBER_DIALOG: {
      return {
        ...state,
        isOpenConnectProfileDialog: !state.isOpenConnectProfileDialog,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEED_TO_CONNECT_AUTHOR: {
      return {
        ...state,
        isLoadingToUpdateProfile: false,
        isOpenConnectProfileDialog: false,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_START_TO_LOAD_DATA_FOR_PAGE: {
      return {
        ...state,
        isLoadingPage: true,
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_FINISH_TO_LOAD_DATA_FOR_PAGE: {
      return {
        ...state,
        isLoadingPage: false,
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
        paperIds: action.payload.paperIds,
        papersSort: action.payload.sort as AUTHOR_PAPER_LIST_SORT_TYPES,
        isLoadingPapers: false,
        papersTotalPage: action.payload.totalPages,
        papersCurrentPage: action.payload.number,
        papersTotalCount: action.payload.totalElements,
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

    default:
      return state;
  }
}
