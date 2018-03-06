import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { PAPER_SHOW_INITIAL_STATE, PaperShowStateRecord } from "./records";
import { GetCommentsResult } from "../../api/types/comment";

export function reducer(state = PAPER_SHOW_INITIAL_STATE, action: IReduxAction<any>): PaperShowStateRecord {
  switch (action.type) {
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

    case ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE: {
      return PAPER_SHOW_INITIAL_STATE;
    }

    default:
      return state;
  }
}
