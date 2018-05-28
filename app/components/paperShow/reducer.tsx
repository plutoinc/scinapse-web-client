import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { PAPER_SHOW_INITIAL_STATE, AvailableCitationType, PaperShowState } from "./records";
import { PaperRecord } from "../../model/paper";

// TODO: Change any for action type definition to Actions only.
export function reducer(state: PaperShowState = PAPER_SHOW_INITIAL_STATE, action: any | Actions): PaperShowState {
  switch (action.type) {
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITATION_TEXT:
    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITATION_TEXT: {
      return { ...state, ...{ isFetchingCitationInformation: true, citationText: "" } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_GET_CITATION_TEXT: {
      return { ...state, ...{ isFetchingCitationInformation: false, citationText: action.payload.citationText } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER: {
      return {
        ...state,
        ...{
          hasErrorOnFetchingPaper: false,
          isLoadingPaper: false,
          paperId: action.payload.paperId,
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER: {
      return { ...state, ...{ hasErrorOnFetchingPaper: false, isLoadingPaper: true } };
    }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER: {
      return {
        ...state,
        ...{
          hasErrorOnFetchingPaper: true,
          isLoadingPaper: false,
          paperId: 0,
        },
      };
    }

    // TODO: Handle comments with entities
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS: {
      const response = action.payload.commentsResponse;
      return {
        ...state,
        ...{
          hasErrorOnFetchingComments: false,
          isLoadingComments: false,
          currentCommentPage: response.number,
          commentTotalPage: response.totalPages,
          comments: response.comments,
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
          comments: [],
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_CHANGE_COMMENT_INPUT: {
      return { ...state, ...{ commentInput: action.payload.comment } };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_POST_COMMENT: {
      return { ...state, ...{ isPostingComment: true, isFailedToPostingComment: false } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT: {
      return {
        ...state,
        ...{
          isPostingComment: false,
          isFailedToPostingComment: false,
          comments: [...action.payload.comment, ...state.comments!],
          commentInput: "",
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
      return { ...state, ...{ isLoadingReferencePapers: false, isFailedToGetReferencePapers: true } };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS: {
      return { ...state, ...{ isLoadingCitedPapers: true, isFailedToGetCitedPapers: false } };
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
      return { ...state, ...{ isLoadingCitedPapers: false, isFailedToGetCitedPapers: true } };
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_DELETE_COMMENT: {
      return { ...state, ...{ isDeletingComment: true } };
    }

    // TODO: Handle comment logic
    // case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT: {
    //   return state.withMutations(currentState => {
    //     const key = currentState.comments!.findKey(comment => comment!.id === action.payload.commentId);

    //     if (key !== undefined) {
    //       return currentState.set("comments", currentState.comments!.remove(key)).set("isDeletingComment", false);
    //     }
    //   });
    // }

    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_DELETE_COMMENT: {
      return { ...state, ...{ isDeletingComment: false } };
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_BOOKMARK:
    case ACTION_TYPES.GLOBAL_START_TO_POST_BOOKMARK: {
      const targetPaper: PaperRecord = action.payload.paper;

      if (state.paperId === targetPaper.id) {
        return { ...state, ...{ isBookmarked: true } };
      }
      return state;
    }

    case ACTION_TYPES.GLOBAL_START_TO_REMOVE_BOOKMARK:
    case ACTION_TYPES.GLOBAL_FAILED_TO_POST_BOOKMARK: {
      const targetPaper: PaperRecord = action.payload.paper;

      if (state.paperId === targetPaper.id) {
        return { ...state, ...{ isBookmarked: false } };
      }

      return state;
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS: {
      return { ...state, ...{ isBookmarked: action.payload.checkedStatus.bookmarked } };
    }

    case ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE: {
      return PAPER_SHOW_INITIAL_STATE;
    }

    case ACTION_TYPES.PAPER_SHOW_CLICK_CITATION_TAB: {
      const tab: AvailableCitationType = action.payload.tab;
      return { ...state, ...{ activeCitationTab: tab } };
    }

    case ACTION_TYPES.PAPER_SHOW_TOGGLE_CITATION_DIALOG: {
      return { ...state, ...{ isCitationDialogOpen: !state.isCitationDialogOpen } };
    }

    case ACTION_TYPES.PAPER_SHOW_TOGGLE_AUTHOR_BOX: {
      return { ...state, ...{ isAuthorBoxExtended: !state.isAuthorBoxExtended } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS: {
      return { ...state, ...{ relatedPaperIds: action.payload.paperIds } };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_OTHER_PAPERS: {
      return { ...state, ...{ otherPaperIds: action.payload.paperIds } };
    }

    default:
      return state;
  }
}
