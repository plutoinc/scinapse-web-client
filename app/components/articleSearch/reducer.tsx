import { IReduxAction } from "../../typings/actionType";
import { ACTION_TYPES } from "../../actions/actionTypes";
import {
  ARTICLE_SEARCH_INITIAL_STATE,
  ArticleSearchStateRecord,
  makeSearchItemMetaListFromPaperList,
  SearchItemMetaRecord,
} from "./records";
import { PaperRecord } from "../../model/paper";
import { ICommentRecord } from "../../model/comment";
import {
  FILTER_RANGE_TYPE,
  FILTER_BOX_TYPE,
  ChangeRangeInputParams,
  FILTER_TYPE_HAS_RANGE,
  FILTER_TYPE_HAS_EXPANDING_OPTION,
} from "./actions";
import { AvailableCitationType } from "../paperShow/records";
import { CheckBookmarkedResponse } from "../../api/member";

export function reducer(state = ARTICLE_SEARCH_INITIAL_STATE, action: IReduxAction<any>): ArticleSearchStateRecord {
  switch (action.type) {
    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_AGGREGATION_DATA: {
      return state.withMutations(currentState => {
        return currentState
          .set("isLoadingAggregateData", true)
          .set("hasErrorOnFetchingAggregateData", false)
          .set("aggregationData", null);
      });
    }
    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_AGGREGATION_DATA: {
      return state.withMutations(currentState => {
        return currentState
          .set("isFilterAvailable", action.payload.available)
          .set("isLoadingAggregateData", false)
          .set("hasErrorOnFetchingAggregateData", false)
          .set("aggregationData", action.payload.aggregationData);
      });
    }
    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_AGGREGATION_DATA: {
      return state.withMutations(currentState => {
        return currentState.set("isLoadingAggregateData", false).set("hasErrorOnFetchingAggregateData", true);
      });
    }

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
          .set("totalElements", action.payload.totalElements)
          .set("totalPages", action.payload.totalPages)
          .set("isLoading", false)
          .set("hasError", false)
          .set("searchItemsToShow", action.payload.papers)
          .set("searchItemsMeta", makeSearchItemMetaListFromPaperList(action.payload.papers))
          .set("targetPaper", null);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT: {
      const paperKey = state.searchItemsToShow.findKey((paper: PaperRecord) => {
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

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", true).set("hasError", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        return currentState
          .set("isEnd", action.payload.isEnd)
          .set("page", action.payload.nextPage)
          .set("searchItemsToShow", action.payload.papers)
          .set("totalElements", action.payload.totalElements)
          .set("totalPages", action.payload.totalPages)
          .set("isLoading", false)
          .set("hasError", false)
          .set("searchItemsMeta", makeSearchItemMetaListFromPaperList(action.payload.papers))
          .set("targetPaper", action.payload.targetPaper);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS:
    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS: {
      return state.withMutations(currentState => {
        return currentState.set("isLoading", false).set("hasError", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT: {
      return state.setIn(["searchItemsMeta", action.payload.index, "commentInput"], action.payload.comment);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_ABSTRACT: {
      const toggledValue = !state.getIn(["searchItemsMeta", action.payload.index, "isAbstractOpen"]);

      return state.setIn(["searchItemsMeta", action.payload.index, "isAbstractOpen"], toggledValue);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_COMMENTS: {
      const toggledValue = !state.getIn(["searchItemsMeta", action.payload.index, "isCommentsOpen"]);

      return state.setIn(["searchItemsMeta", action.payload.index, "isCommentsOpen"], toggledValue);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_AUTHORS: {
      const toggledValue = !state.getIn(["searchItemsMeta", action.payload.index, "isAuthorsOpen"]);

      return state.setIn(["searchItemsMeta", action.payload.index, "isAuthorsOpen"], toggledValue);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_VISIT_TITLE: {
      return state.setIn(["searchItemsMeta", action.payload.index, "isTitleVisited"], true);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CLOSE_FIRST_OPEN: {
      return state.setIn(["searchItemsMeta", action.payload.index, "isFirstOpen"], false);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_POST_COMMENT: {
      const targetPaperId: number = action.payload.paperId;
      const targetPaperCognitiveId: number = action.payload.cognitivePaperId;

      const key = state.searchItemsToShow.findKey(paper => {
        return paper.id === targetPaperId || paper.cognitivePaperId === targetPaperCognitiveId;
      });

      if (key !== undefined) {
        return state.withMutations(currentState => {
          return currentState
            .setIn(["searchItemsMeta", key, "hasError"], false)
            .setIn(["searchItemsMeta", key, "isLoading"], true);
        });
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT: {
      const targetPaperId: number = action.payload.paperId;
      const targetPaperCognitiveId: number = action.payload.cognitivePaperId;

      const key = state.searchItemsToShow.findKey(paper => {
        return paper.id === targetPaperId || paper.cognitivePaperId === targetPaperCognitiveId;
      });

      if (key !== undefined) {
        return state.withMutations(currentState => {
          const newComments = currentState
            .getIn(["searchItemsToShow", key, "comments"])
            .unshift(action.payload.comment);
          const newCommentCount = currentState.getIn(["searchItemsToShow", key, "commentCount"]) + 1;

          return currentState
            .setIn(["searchItemsToShow", key, "comments"], newComments)
            .setIn(["searchItemsToShow", key, "commentCount"], newCommentCount)
            .setIn(["searchItemsMeta", key, "hasError"], false)
            .setIn(["searchItemsMeta", key, "isLoading"], false)
            .setIn(["searchItemsMeta", key, "commentInput"], "");
        });
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_POST_COMMENT: {
      const targetPaperId: number = action.payload.paperId;
      const targetPaperCognitiveId: number = action.payload.cognitivePaperId;

      const key = state.searchItemsToShow.findKey(paper => {
        return paper.id === targetPaperId || paper.cognitivePaperId === targetPaperCognitiveId;
      });

      if (key !== undefined) {
        return state.withMutations(currentState => {
          return currentState
            .setIn(["searchItemsMeta", key, "hasError"], true)
            .setIn(["searchItemsMeta", key, "isLoading"], false);
        });
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS: {
      const targetPaperId: number = action.payload.paperId;
      const key = state.searchItemsToShow.findKey(paper => {
        return paper.id === targetPaperId;
      });

      if (key !== undefined) {
        return state.withMutations(currentState => {
          return currentState
            .setIn(["searchItemsMeta", key, "hasError"], false)
            .setIn(["searchItemsMeta", key, "isPageLoading"], true);
        });
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS: {
      const targetPaperId: number = action.payload.paperId;
      const key = state.searchItemsToShow.findKey(paper => {
        return paper.id === targetPaperId;
      });

      if (key !== undefined) {
        return state.withMutations(currentState => {
          const newComments = currentState
            .getIn(["searchItemsToShow", key, "comments"])
            .concat(action.payload.comments);

          return currentState
            .setIn(["searchItemsToShow", key, "comments"], newComments)
            .setIn(["searchItemsMeta", key, "page"], action.payload.nextPage)
            .setIn(["searchItemsMeta", key, "hasError"], false)
            .setIn(["searchItemsMeta", key, "isPageLoading"], false);
        });
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_MORE_COMMENTS: {
      const targetPaperId: number = action.payload.paperId;
      const key = state.searchItemsToShow.findKey(paper => {
        return paper.id === targetPaperId;
      });

      if (key !== undefined) {
        return state.withMutations(currentState => {
          return currentState
            .setIn(["searchItemsMeta", key, "hasError"], true)
            .setIn(["searchItemsMeta", key, "isPageLoading"], false);
        });
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT: {
      const payload: ChangeRangeInputParams = action.payload;

      if (payload.type === FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR) {
        if (payload.rangeType === FILTER_RANGE_TYPE.FROM) {
          return state.set("yearFilterFromValue", payload.numberValue);
        } else if (payload.rangeType === FILTER_RANGE_TYPE.TO) {
          return state.set("yearFilterToValue", payload.numberValue);
        } else {
          return state;
        }
      } else if (payload.type === FILTER_TYPE_HAS_RANGE.JOURNAL_IF) {
        if (payload.rangeType === FILTER_RANGE_TYPE.FROM) {
          return state.set("IFFilterFromValue", payload.numberValue);
        } else if (payload.rangeType === FILTER_RANGE_TYPE.TO) {
          return state.set("IFFilterToValue", payload.numberValue);
        } else {
          return state;
        }
      } else {
        return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX: {
      const type: FILTER_BOX_TYPE = action.payload.type;

      switch (type) {
        case FILTER_BOX_TYPE.PUBLISHED_YEAR:
          return state.set("isYearFilterOpen", !state.isYearFilterOpen);
        case FILTER_BOX_TYPE.JOURNAL_IF:
          return state.set("isJournalIFFilterOpen", !state.isJournalIFFilterOpen);
        case FILTER_BOX_TYPE.FOS:
          return state.set("isFOSFilterOpen", !state.isFOSFilterOpen);
        case FILTER_BOX_TYPE.JOURNAL:
          return state.set("isJournalFilterOpen", !state.isJournalFilterOpen);
        default:
          return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX: {
      const type: FILTER_TYPE_HAS_EXPANDING_OPTION = action.payload.type;

      switch (type) {
        case FILTER_TYPE_HAS_EXPANDING_OPTION.FOS:
          return state.set("isFOSFilterExpanding", !state.isFOSFilterExpanding);
        case FILTER_TYPE_HAS_EXPANDING_OPTION.JOURNAL:
          return state.set("isJournalFilterExpanding", !state.isJournalFilterExpanding);
        default:
          return state;
      }
    }

    case ACTION_TYPES.ARTICLE_SEARCH_CLICK_CITATION_TAB: {
      const payload: { tab: AvailableCitationType } = action.payload;

      return state.set("activeCitationTab", payload.tab);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT: {
      return state.withMutations(currentState => {
        return currentState.set("citationText", "").set("isFetchingCitationInformation", true);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_GET_CITATION_TEXT: {
      const payload: { citationText: string } = action.payload;

      return state.withMutations(currentState => {
        return currentState.set("citationText", payload.citationText).set("isFetchingCitationInformation", false);
      });
    }

    case ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_CITATION_DIALOG: {
      return state.set("isCitationDialogOpen", !state.isCitationDialogOpen);
    }

    case ACTION_TYPES.ARTICLE_SEARCH_SET_ACTIVE_CITATION_DIALOG_PAPER_ID: {
      return state.set("activeCitationDialogPaperId", action.payload.paperId);
    }

    case ACTION_TYPES.GLOBAL_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS: {
      const checkedStatusArray = action.payload.checkedStatusArray as CheckBookmarkedResponse[];

      // TODO: O(N^2) -> O(NlogN?)
      return state.update("searchItemsMeta", metaList => {
        return metaList.map((meta: SearchItemMetaRecord) => {
          const checkedStatus = checkedStatusArray.find(status => status.paperId === meta.paperId);

          if (checkedStatus) {
            return meta.set("isBookmarked", checkedStatus.bookmarked);
          } else {
            return meta;
          }
        });
      });
    }

    case ACTION_TYPES.GLOBAL_START_TO_POST_BOOKMARK: {
      return state.update("searchItemsMeta", metaList => {
        const key = metaList.findKey((meta: SearchItemMetaRecord) => meta.paperId === action.payload.paper.id);

        if (key !== undefined) {
          return metaList.setIn([key, "isBookmarked"], true);
        } else {
          return metaList;
        }
      });
    }

    case ACTION_TYPES.GLOBAL_FAILED_TO_POST_BOOKMARK: {
      return state.update("searchItemsMeta", metaList => {
        const key = metaList.findKey((meta: SearchItemMetaRecord) => meta.paperId === action.payload.paper.id);

        if (key !== undefined) {
          return metaList.setIn([key, "isBookmarked"], false);
        } else {
          return metaList;
        }
      });
    }

    default: {
      return state;
    }
  }
}
