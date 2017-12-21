import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_SEARCH_INITIAL_STATE, IArticleSearchStateRecord, initializeSearchItemsInfo } from "./records";
import { IPaperRecord } from "../../model/paper";
import { ICommentRecord } from "../../model/comment";

export function reducer(state = ARTICLE_SEARCH_INITIAL_STATE, action: IReduxAction<any>): IArticleSearchStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT: {
      return state.set("searchInput", action.payload.searchInput);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING: {
      return state.set("sorting", action.payload.sorting);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: {
      return state.withMutations(currentState => {
        return currentState
          .set("isEnd", action.payload.isEnd)
          .set("page", action.payload.nextPage)
          .set("searchItemsToShow", action.payload.papers)
          .set("searchItemsInfo", initializeSearchItemsInfo(action.payload.numberOfElements))
          .set("totalElements", action.payload.totalElements)
          .set("totalPages", action.payload.totalPages)
          .set("isLoading", false)
          .set("hasError", false)
          .set("targetPaper", null);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT: {
      const paperKey = state.searchItemsToShow.findKey((paper: IPaperRecord) => {
        return paper.id === action.payload.paperId;
      });

      if (paperKey === undefined) {
        return state;
      }

      const commentKey = state.searchItemsToShow.getIn([paperKey, "comments"]).findKey((comment: ICommentRecord) => {
        return comment.id === action.payload.commentId;
      });

      if (commentKey === undefined) {
        return state;
      }

      return state.removeIn(["searchItemsToShow", paperKey, "comments", commentKey]);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_CITED_GET_PAPERS: {
      return state.withMutations(currentState => {
        return currentState
          .set("isEnd", action.payload.isEnd)
          .set("page", action.payload.nextPage)
          .set("searchItemsToShow", action.payload.papers)
          .set("searchItemsInfo", initializeSearchItemsInfo(action.payload.numberOfElements))
          .set("totalElements", action.payload.totalElements)
          .set("totalPages", action.payload.totalPages)
          .set("isLoading", false)
          .set("hasError", false)
          .set("targetPaper", action.payload.targetPaper);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT: {
      return state.setIn(["searchItemsInfo", action.payload.index, "commentInput"], action.payload.comment);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_ABSTRACT: {
      const toggledValue = !state.getIn(["searchItemsInfo", action.payload.index, "isAbstractOpen"]);

      return state.setIn(["searchItemsInfo", action.payload.index, "isAbstractOpen"], toggledValue);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_COMMENTS: {
      const toggledValue = !state.getIn(["searchItemsInfo", action.payload.index, "isCommentsOpen"]);

      return state.setIn(["searchItemsInfo", action.payload.index, "isCommentsOpen"], toggledValue);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_AUTHORS: {
      const toggledValue = !state.getIn(["searchItemsInfo", action.payload.index, "isAuthorsOpen"]);

      return state.setIn(["searchItemsInfo", action.payload.index, "isAuthorsOpen"], toggledValue);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CLOSE_FIRST_OPEN: {
      return state.setIn(["searchItemsInfo", action.payload.index, "isFirstOpen"], false);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_COMMENT_POST: {
      const targetPaperId: number = action.payload.paperId;
      const key = state.searchItemsToShow.findKey(paper => {
        return paper.id === targetPaperId;
      });

      if (key !== undefined) {
        return state.withMutations(currentState => {
          return currentState
            .setIn(["searchItemsInfo", key, "hasError"], false)
            .setIn(["searchItemsInfo", key, "isLoading"], true);
        });
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_COMMENT_POST: {
      const targetPaperId: number = action.payload.paperId;
      const key = state.searchItemsToShow.findKey(paper => {
        return paper.id === targetPaperId;
      });

      if (key !== undefined) {
        return state.withMutations(currentState => {
          const newComments = currentState.getIn(["searchItemsToShow", key, "comments"]).push(action.payload.comment);
          currentState.searchItemsToShow.setIn([key, "comments"], newComments);

          return currentState
            .setIn(["searchItemsToShow", key, "comments"], newComments)
            .setIn(["searchItemsInfo", key, "hasError"], false)
            .setIn(["searchItemsInfo", key, "isLoading"], false)
            .setIn(["searchItemsInfo", key, "commentInput"], "");
        });
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_COMMENT_POST: {
      const targetPaperId: number = action.payload.paperId;
      const key = state.searchItemsToShow.findKey(paper => {
        return paper.id === targetPaperId;
      });

      if (key !== undefined) {
        return state.withMutations(currentState => {
          return currentState
            .setIn(["searchItemsInfo", key, "hasError"], true)
            .setIn(["searchItemsInfo", key, "isLoading"], false);
        });
      } else {
        return state;
      }
    }

    default:
      return state;
  }
}
