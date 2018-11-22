import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { PAPER_LIST_SORT_TYPES } from "../../components/common/sortBox";

export interface AuthorShowState
  extends Readonly<{
      paperIds: number[];
      authorId: number | null;
      coAuthorIds: number[];
      papersTotalPage: number;
      papersCurrentPage: number;
      papersSort: PAPER_LIST_SORT_TYPES;
      isOpenConnectProfileDialog: boolean;
      isLoadingPage: boolean;
      isLoadingToUpdateProfile: boolean;
      hasFailedToUpdateProfile: boolean;
      isLoadingToAddPaperToAuthorPaperList: boolean;
      hasFailedToAddPaperToAuthorPaperList: boolean;
    }> {}

export const AUTHOR_SHOW_INITIAL_STATE: AuthorShowState = {
  paperIds: [],
  authorId: null,
  coAuthorIds: [],
  papersTotalPage: 0,
  papersCurrentPage: 1,
  papersSort: "MOST_CITATIONS",
  isOpenConnectProfileDialog: false,
  isLoadingPage: false,
  isLoadingToUpdateProfile: false,
  hasFailedToUpdateProfile: false,
  isLoadingToAddPaperToAuthorPaperList: false,
  hasFailedToAddPaperToAuthorPaperList: false,
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
        isOpenConnectProfileDialog: false,
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_REMOVE_PAPER_FROM_AUTHOR_PAPER_LIST: {
      const targetPaperId = action.payload.paperId;
      const index = state.paperIds.indexOf(targetPaperId);

      return {
        ...state,
        paperIds: [...state.paperIds.slice(0, index), ...state.paperIds.slice(index + 1)],
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

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS: {
      return {
        ...state,
        paperIds: action.payload.paperIds,
        papersSort: action.payload.sort as PAPER_LIST_SORT_TYPES,
        papersTotalPage: action.payload.totalPages,
        papersCurrentPage: action.payload.number,
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
      const { paperIds } = action.payload;

      return {
        ...state,
        paperIds: [...paperIds, ...state.paperIds],
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
