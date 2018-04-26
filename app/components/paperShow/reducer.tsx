import { List } from "immutable";
import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import {
  PAPER_SHOW_INITIAL_STATE,
  PaperShowStateRecord,
  InitialReferencePaperMetaFactory,
  AvailableCitationType,
  ReferencePaperMetaRecord,
} from "./records";
import { GetCommentsResult } from "../../api/types/comment";
import { PaperRecord } from "../../model/paper";
import { CheckBookmarkedResponse } from "../../api/member";
import { RELATED_PAPERS } from "./constants";

export function reducer(state = PAPER_SHOW_INITIAL_STATE, action: IReduxAction<any>): PaperShowStateRecord {
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
          .set("paper", action.payload.paper);
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
          .set("paper", null);
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
          .set("comments", currentState.comments.unshift(action.payload.comment))
          .set("commentInput", "")
          .setIn(["paper", "commentCount"], state.paper.commentCount + 1);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COMMENT: {
      return state.withMutations(currentState => {
        return currentState.set("isPostingComment", false).set("isFailedToPostingComment", true);
      });
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS: {
      return state.withMutations(currentState => {
        return currentState
          .set("isLoadingReferencePapers", true)
          .set("isFailedToGetReferencePapers", false)
          .set("referencePapersMeta", List());
      });
    }
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS: {
      return state.withMutations(currentState => {
        const referencePapersMeta = List(
          action.payload.papers.map((paper: PaperRecord) => InitialReferencePaperMetaFactory(paper.id)),
        );

        return currentState
          .set("isLoadingReferencePapers", false)
          .set("isFailedToGetReferencePapers", false)
          .set("referencePaperTotalPage", action.payload.totalPages)
          .set("referencePaperCurrentPage", action.payload.currentPage)
          .set("referencePapersMeta", referencePapersMeta)
          .set("referencePapers", action.payload.papers);
      });
    }
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoadingReferencePapers", false).set("isFailedToGetReferencePapers", true);
      });
    }

    case ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        return currentState
          .set("isLoadingCitedPapers", true)
          .set("isFailedToGetCitedPapers", false)
          .set("citedPapersMeta", List());
      });
    }
    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        const citedPapersMeta = List(
          action.payload.papers.map((paper: PaperRecord) => InitialReferencePaperMetaFactory(paper.id)),
        );

        return currentState
          .set("isLoadingCitedPapers", false)
          .set("isFailedToGetCitedPapers", false)
          .set("citedPaperTotalPage", action.payload.totalPages)
          .set("citedPaperCurrentPage", action.payload.currentPage)
          .set("citedPapersMeta", citedPapersMeta)
          .set("citedPapers", action.payload.papers);
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
        const key = currentState.comments.findKey(comment => comment.id === action.payload.commentId);

        if (key !== undefined) {
          return currentState
            .set("comments", currentState.comments.remove(key))
            .set("isDeletingComment", false)
            .setIn(["paper", "commentCount"], currentState.paper.commentCount - 1);
        }
      });
    }
    case ACTION_TYPES.PAPER_SHOW_FAILED_TO_DELETE_COMMENT: {
      return state.withMutations(currentState => {
        return currentState.set("isDeletingComment", false);
      });
    }

    case ACTION_TYPES.PAPER_SHOW_TOGGLE_ABSTRACT: {
      const payload: { paperId: number; relatedPapersType: RELATED_PAPERS } = action.payload;

      if (payload.relatedPapersType === "reference") {
        const targetMetaIndex = state.referencePapersMeta.findIndex(meta => meta.paperId === payload.paperId);

        if (targetMetaIndex < 0) {
          return state;
        }

        const currentValue = state.getIn(["referencePapersMeta", targetMetaIndex, "isAbstractOpen"]);
        return state.setIn(["referencePapersMeta", targetMetaIndex, "isAbstractOpen"], !currentValue);
      } else if (payload.relatedPapersType === "cited") {
        const targetMetaIndex = state.citedPapersMeta.findIndex(meta => meta.paperId === payload.paperId);

        if (targetMetaIndex < 0) {
          return state;
        }

        const currentValue = state.getIn(["citedPapersMeta", targetMetaIndex, "isAbstractOpen"]);
        return state.setIn(["citedPapersMeta", targetMetaIndex, "isAbstractOpen"], !currentValue);
      }
      return state;
    }

    case ACTION_TYPES.PAPER_SHOW_TOGGLE_AUTHORS: {
      const payload: { paperId: number; relatedPapersType: RELATED_PAPERS } = action.payload;

      if (payload.relatedPapersType === "reference") {
        const targetMetaIndex = state.referencePapersMeta.findIndex(meta => meta.paperId === payload.paperId);

        if (targetMetaIndex < 0) {
          return state;
        }

        const currentValue = state.getIn(["referencePapersMeta", targetMetaIndex, "isAuthorsOpen"]);
        return state.setIn(["referencePapersMeta", targetMetaIndex, "isAuthorsOpen"], !currentValue);
      } else if (payload.relatedPapersType === "cited") {
        const targetMetaIndex = state.citedPapersMeta.findIndex(meta => meta.paperId === payload.paperId);

        if (targetMetaIndex < 0) {
          return state;
        }

        const currentValue = state.getIn(["citedPapersMeta", targetMetaIndex, "isAuthorsOpen"]);
        return state.setIn(["citedPapersMeta", targetMetaIndex, "isAuthorsOpen"], !currentValue);
      }
      return state;
    }

    case ACTION_TYPES.PAPER_SHOW_VISIT_TITLE: {
      const payload: { paperId: number; relatedPapersType: RELATED_PAPERS } = action.payload;

      if (payload.relatedPapersType === "reference") {
        const targetMetaIndex = state.referencePapersMeta.findIndex(meta => meta.paperId === payload.paperId);

        if (targetMetaIndex < 0) {
          return state;
        }

        return state.setIn(["referencePapersMeta", targetMetaIndex, "isTitleVisited"], true);
      } else if (payload.relatedPapersType === "cited") {
        const targetMetaIndex = state.citedPapersMeta.findIndex(meta => meta.paperId === payload.paperId);

        if (targetMetaIndex < 0) {
          return state;
        }

        return state.setIn(["citedPapersMeta", targetMetaIndex, "isTitleVisited"], true);
      }
      return state;
    }

    case ACTION_TYPES.PAPER_SHOW_CLOSE_FIRST_OPEN: {
      const payload: { paperId: number; relatedPapersType: RELATED_PAPERS } = action.payload;

      if (payload.relatedPapersType === "reference") {
        const targetMetaIndex = state.referencePapersMeta.findIndex(meta => meta.paperId === payload.paperId);

        if (targetMetaIndex < 0) {
          return state;
        }

        return state.setIn(["referencePapersMeta", targetMetaIndex, "isFirstOpen"], false);
      } else if (payload.relatedPapersType === "cited") {
        const targetMetaIndex = state.citedPapersMeta.findIndex(meta => meta.paperId === payload.paperId);

        if (targetMetaIndex < 0) {
          return state;
        }

        return state.setIn(["citedPapersMeta", targetMetaIndex, "isFirstOpen"], false);
      }
      return state;
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_BOOKMARK:
    case ACTION_TYPES.GLOBAL_START_TO_POST_BOOKMARK: {
      const targetPaper: PaperRecord = action.payload.paper;

      if (state.paper && state.paper.id === targetPaper.id) {
        return state.set("isBookmarked", true);
      }

      const refKey = state.referencePapersMeta.findKey(meta => meta.paperId === targetPaper.id);
      const citedKey = state.citedPapersMeta.findKey(meta => meta.paperId === targetPaper.id);

      if (refKey !== undefined) {
        return state.update("referencePapersMeta", metaList => {
          return metaList.setIn([refKey, "isBookmarked"], true);
        });
      } else if (citedKey !== undefined) {
        return state.update("citedPapersMeta", metaList => {
          return metaList.setIn([citedKey, "isBookmarked"], true);
        });
      }
      return state;
    }

    case ACTION_TYPES.GLOBAL_START_TO_REMOVE_BOOKMARK:
    case ACTION_TYPES.GLOBAL_FAILED_TO_POST_BOOKMARK: {
      const targetPaper: PaperRecord = action.payload.paper;

      if (state.paper && state.paper.id === targetPaper.id) {
        return state.set("isBookmarked", false);
      }

      const refKey = state.referencePapersMeta.findKey(meta => meta.paperId === targetPaper.id);
      const citedKey = state.citedPapersMeta.findKey(meta => meta.paperId === targetPaper.id);

      if (refKey !== undefined) {
        return state.update("referencePapersMeta", metaList => {
          return metaList.setIn([refKey, "isBookmarked"], false);
        });
      } else if (citedKey !== undefined) {
        return state.update("citedPapersMeta", metaList => {
          return metaList.setIn([citedKey, "isBookmarked"], false);
        });
      }
      return state;
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS: {
      const checkedStatusArray = action.payload.checkedStatusArray as CheckBookmarkedResponse[];

      return state.withMutations(currentState => {
        const referencePapersUpdatedState = currentState.update("referencePapersMeta", metaList => {
          return metaList.map((meta: ReferencePaperMetaRecord) => {
            const checkedStatus = checkedStatusArray.find(status => status.paperId === meta.paperId);

            if (checkedStatus) {
              return meta.set("isBookmarked", checkedStatus.bookmarked);
            } else {
              return meta;
            }
          });
        });

        return referencePapersUpdatedState.update("citedPapersMeta", metaList => {
          return metaList.map((meta: ReferencePaperMetaRecord) => {
            const checkedStatus = checkedStatusArray.find(status => status.paperId === meta.paperId);

            if (checkedStatus) {
              return meta.set("isBookmarked", checkedStatus.bookmarked);
            } else {
              return meta;
            }
          });
        });
      });
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

    default:
      return state;
  }
}
