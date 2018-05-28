import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { PAPER_SHOW_INITIAL_STATE, PaperShowStateRecord, AvailableCitationType } from "./records";
import { GetCommentsResult } from "../../api/types/comment";
import { PaperRecord } from "../../model/paper";

// TODO: Change any for action type definition to Actions only.
export function reducer(
  state: PaperShowStateRecord = PAPER_SHOW_INITIAL_STATE,
  action: any | Actions,
): PaperShowStateRecord {
  switch (action.type) {
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITATION_TEXT:
    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITATION_TEXT: {
      return state.withMutations(currentState => {
        return currentState.set("isFetchingCitationInformation", true).set("citationText", "");
      });
    }
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_GET_CITATION_TEXT: {
      return state.withMutations(currentState => {
        return currentState
          .set("isFetchingCitationInformation", false)
          .set("citationText", action.payload.citationText);
      });
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER: {
      return state.withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingPaper", false)
          .set("isLoadingPaper", false)
          .set("paperId", action.payload.paperId);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER: {
      return state.withMutations(currentState => {
        return currentState.set("hasErrorOnFetchingPaper", false).set("isLoadingPaper", true);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER: {
      return state.withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingPaper", true)
          .set("isLoadingPaper", false)
          .set("paperId", 0);
      });
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS: {
      return state.withMutations(currentState => {
        const response: GetCommentsResult = action.payload.commentsResponse;

        return currentState
          .set("hasErrorOnFetchingComments", false)
          .set("isLoadingComments", false)
          .set("currentCommentPage", response.number)
          .set("commentTotalPage", response.totalPages)
          .set("comments", response.comments);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_COMMENTS: {
      return state.withMutations(currentState => {
        return currentState.set("hasErrorOnFetchingComments", false).set("isLoadingComments", true);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COMMENTS: {
      return state.withMutations(currentState => {
        return currentState
          .set("hasErrorOnFetchingComments", true)
          .set("isLoadingComments", false)
          .set("comments", null);
      });
    }

    case ACTION_TYPES.PAPER_SHOW_CHANGE_COMMENT_INPUT: {
      return state.set("commentInput", action.payload.comment);
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_POST_COMMENT: {
      return state.withMutations(currentState => {
        return currentState.set("isPostingComment", true).set("isFailedToPostingComment", false);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT: {
      return state.withMutations(currentState => {
        return currentState
          .set("isPostingComment", false)
          .set("isFailedToPostingComment", false)
          .set("comments", currentState.comments!.unshift(action.payload.comment))
          .set("commentInput", "");
      });
    }
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COMMENT: {
      return state.withMutations(currentState => {
        return currentState.set("isPostingComment", false).set("isFailedToPostingComment", true);
      });
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoadingReferencePapers", true).set("isFailedToGetReferencePapers", false);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS: {
      return state.withMutations(currentState => {
        return currentState
          .set("isLoadingReferencePapers", false)
          .set("isFailedToGetReferencePapers", false)
          .set("referencePaperTotalPage", action.payload.totalPages)
          .set("referencePaperCurrentPage", action.payload.number)
          .set("referencePaperIds", action.payload.paperIds);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoadingReferencePapers", false).set("isFailedToGetReferencePapers", true);
      });
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoadingCitedPapers", true).set("isFailedToGetCitedPapers", false);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        return currentState
          .set("isLoadingCitedPapers", false)
          .set("isFailedToGetCitedPapers", false)
          .set("citedPaperTotalPage", action.payload.totalPages)
          .set("citedPaperCurrentPage", action.payload.number)
          .set("citedPaperIds", action.payload.paperIds);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoadingCitedPapers", false).set("isFailedToGetCitedPapers", true);
      });
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_DELETE_COMMENT: {
      return state.set("isDeletingComment", true);
    }
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT: {
      return state.withMutations(currentState => {
        const key = currentState.comments!.findKey(comment => comment!.id === action.payload.commentId);

        if (key !== undefined) {
          return currentState.set("comments", currentState.comments!.remove(key)).set("isDeletingComment", false);
        }
      });
    }
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_DELETE_COMMENT: {
      return state.withMutations(currentState => {
        return currentState.set("isDeletingComment", false);
      });
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_BOOKMARK:
    case ACTION_TYPES.GLOBAL_START_TO_POST_BOOKMARK: {
      const targetPaper: PaperRecord = action.payload.paper;

      if (state.paperId === targetPaper.id) {
        return state.set("isBookmarked", true);
      }
      return state;
    }

    case ACTION_TYPES.GLOBAL_START_TO_REMOVE_BOOKMARK:
    case ACTION_TYPES.GLOBAL_FAILED_TO_POST_BOOKMARK: {
      const targetPaper: PaperRecord = action.payload.paper;

      if (state.paperId === targetPaper.id) {
        return state.set("isBookmarked", false);
      }

      return state;
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS: {
      return state.set("isBookmarked", action.payload.checkedStatus.bookmarked);
    }

    case ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE: {
      return PAPER_SHOW_INITIAL_STATE;
    }

    case ACTION_TYPES.PAPER_SHOW_CLICK_CITATION_TAB: {
      const tab: AvailableCitationType = action.payload.tab;

      return state.set("activeCitationTab", tab);
    }

    case ACTION_TYPES.PAPER_SHOW_TOGGLE_CITATION_DIALOG: {
      return state.set("isCitationDialogOpen", !state.isCitationDialogOpen);
    }

    case ACTION_TYPES.PAPER_SHOW_TOGGLE_AUTHOR_BOX: {
      return state.set("isAuthorBoxExtended", !state.isAuthorBoxExtended);
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS: {
      return state.set("relatedPaperIds", action.payload.paperIds);
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_OTHER_PAPERS: {
      return state.set("otherPaperIds", action.payload.paperIds);
    }

    default:
      return state;
  }
}
