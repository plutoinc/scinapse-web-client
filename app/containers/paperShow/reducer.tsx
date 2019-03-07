import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { PAPER_SHOW_INITIAL_STATE, PaperShowState } from "./records";

export function reducer(state: PaperShowState = PAPER_SHOW_INITIAL_STATE, action: Actions): PaperShowState {
  switch (action.type) {
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER: {
      return {
        ...state,
        ...{
          hasErrorOnFetchingPaper: null,
          isLoadingPaper: false,
          paperId: action.payload.paperId,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER: {
      return {
        ...state,
        ...{ hasErrorOnFetchingPaper: null, isLoadingPaper: true },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER: {
      return {
        ...state,
        ...{
          hasErrorOnFetchingPaper: action.payload.statusCode,
          isLoadingPaper: false,
          paperId: 0,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS: {
      return {
        ...state,
        ...{
          hasErrorOnFetchingComments: false,
          isLoadingComments: false,
          currentCommentPage: action.payload.number,
          commentTotalPage: action.payload.totalPages,
          commentIds: action.payload.commentIds,
        },
      };
    }
    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_COMMENTS: {
      return {
        ...state,
        ...{
          hasErrorOnFetchingComments: false,
          isLoadingComments: true,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COMMENTS: {
      return {
        ...state,
        ...{
          hasErrorOnFetchingComments: true,
          isLoadingComments: false,
          commentIds: [],
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_POST_COMMENT: {
      return {
        ...state,
        ...{ isPostingComment: true, isFailedToPostingComment: false },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT: {
      return {
        ...state,
        ...{
          isPostingComment: false,
          isFailedToPostingComment: false,
          commentIds: [...[action.payload.commentId], ...state.commentIds],
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COMMENT: {
      return {
        ...state,
        ...{
          isPostingComment: false,
          isFailedToPostingComment: true,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS: {
      return {
        ...state,
        ...{
          isLoadingReferencePapers: true,
          isFailedToGetReferencePapers: false,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS: {
      return {
        ...state,
        ...{
          isLoadingReferencePapers: false,
          isFailedToGetReferencePapers: false,
          referencePaperTotalPage: action.payload.totalPages,
          referencePaperCurrentPage: action.payload.number,
          referencePaperIds: action.payload.paperIds,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS: {
      return {
        ...state,
        ...{
          isLoadingReferencePapers: false,
          isFailedToGetReferencePapers: true,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        ...{ isLoadingCitedPapers: true, isFailedToGetCitedPapers: false },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        ...{
          isLoadingCitedPapers: false,
          isFailedToGetCitedPapers: false,
          citedPaperTotalPage: action.payload.totalPages,
          citedPaperCurrentPage: action.payload.number,
          citedPaperIds: action.payload.paperIds,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS: {
      return {
        ...state,
        ...{ isLoadingCitedPapers: false, isFailedToGetCitedPapers: true },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_DELETE_COMMENT: {
      return { ...state, ...{ isDeletingComment: true } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT: {
      const index = state.commentIds.indexOf(action.payload.commentId);
      if (index !== -1) {
        const newCommentIds = [...state.commentIds.slice(0, index), ...state.commentIds.slice(index + 1)];

        return { ...state, ...{ commentIds: newCommentIds } };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_DELETE_COMMENT: {
      return { ...state, ...{ isDeletingComment: false } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS: {
      return { ...state, ...{ relatedPaperIds: action.payload.paperIds } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_OTHER_PAPERS_FROM_AUTHOR: {
      return { ...state, ...{ otherPaperIdsFromAuthor: action.payload.paperIds } };
    }

    case ACTION_TYPES.PAPER_SHOW_ANIMATE_BETTER_SEARCH_TITLE: {
      return { ...state, betterSearchIsAnimated: true };
    }

    case ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE: {
      return { ...PAPER_SHOW_INITIAL_STATE, betterSearchIsAnimated: state.betterSearchIsAnimated };
    }

    default:
      return state;
  }
}
