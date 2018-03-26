import { Dispatch } from "redux";
import axios, { CancelTokenSource } from "axios";
import { push } from "react-router-redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { SEARCH_SORTING } from "./records";
import {
  GetPapersParams,
  GetPapersResult,
  GetRefOrCitedPapersParams,
  GetAggregationParams,
} from "../../api/types/paper";
import PaperAPI from "../../api/paper";
import CommentAPI from "../../api/comment";
import { ICommentRecord } from "../../model/comment";
import { PaperRecord } from "../../model/paper";
import alertToast from "../../helpers/makePlutoToastAction";
import papersQueryFormatter from "../../helpers/papersQueryFormatter";
import { FetchSearchItemsParams } from "./types/actions";
import { trackSearch, trackEvent } from "../../helpers/handleGA";
import {
  GetCommentsParams,
  GetCommentsResult,
  PostCommentParams,
  DeleteCommentParams,
  DeleteCommentResult,
} from "../../api/types/comment";

export enum FILTER_RANGE_TYPE {
  FROM,
  TO,
}

export enum FILTER_TYPE_HAS_RANGE {
  PUBLISHED_YEAR,
  JOURNAL_IF,
}

export enum FILTER_TYPE_HAS_EXPANDING_OPTION {
  FOS,
  JOURNAL,
}

export enum FILTER_BOX_TYPE {
  PUBLISHED_YEAR,
  JOURNAL_IF,
  FOS,
  JOURNAL,
}

export function toggleFilterBox(type: FILTER_BOX_TYPE) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_FILTER_BOX,
    payload: {
      type,
    },
  };
}

export function toggleExpandingFilter(type: FILTER_TYPE_HAS_EXPANDING_OPTION) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX,
    payload: {
      type,
    },
  };
}

export interface ChangeRangeInputParams {
  type: FILTER_TYPE_HAS_RANGE;
  rangeType: FILTER_RANGE_TYPE;
  numberValue: number;
}

export function changeRangeInput(params: ChangeRangeInputParams) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT,
    payload: params,
  };
}

export function changeSearchInput(searchInput: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
    payload: {
      searchInput,
    },
  };
}

export function handleSearchPush(searchInput: string) {
  return (dispatch: Dispatch<any>) => {
    if (searchInput.length < 2) {
      alertToast({
        type: "error",
        message: "You should search more than 2 characters.",
      });
    } else {
      trackSearch("query", searchInput);
      dispatch(
        push(
          `/search?${papersQueryFormatter.stringifyPapersQuery({
            query: searchInput,
            filter: {},
            page: 1,
          })}`,
        ),
      );
    }
  };
}

export function changeSorting(sorting: SEARCH_SORTING) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING,
    payload: {
      sorting,
    },
  };
}

function logFailedSearchQuery(stringifiedSearchQuery: string) {
  trackEvent({
    category: "Search",
    action: "NotFound",
    label: stringifiedSearchQuery,
  });
}

export function getAggregationData(params: GetAggregationParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_AGGREGATION_DATA,
    });

    try {
      const aggregationRecord = await PaperAPI.getAggregation(params);

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_AGGREGATION_DATA,
        payload: {
          aggregationData: aggregationRecord,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_AGGREGATION_DATA,
      });
    }
  };
}

export function getPapers(params: GetPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS });

    try {
      const papersData: GetPapersResult = await PaperAPI.getPapers(params);

      if (papersData.papers.size === 0) {
        logFailedSearchQuery(JSON.stringify(params));
      }

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: papersData.papers,
          nextPage: params.page + 1,
          isEnd: papersData.last,
          totalElements: papersData.totalElements,
          totalPages: papersData.totalPages,
          numberOfElements: papersData.numberOfElements,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: "Temporarily Unavailable",
        });
        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS });
      }
    }
  };
}

export function buildRefOrCitedAPIParams(params: GetRefOrCitedPapersParams) {
  if (params.cognitiveId && params.cognitiveId !== 0) {
    return {
      page: params.page,
      filter: params.filter,
      paperId: params.cognitiveId,
      cancelTokenSource: params.cancelTokenSource,
      cognitive: true,
    };
  } else {
    return {
      page: params.page,
      filter: params.filter,
      paperId: params.paperId,
      cancelTokenSource: params.cancelTokenSource,
    };
  }
}

export function getCitedPapers(params: GetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS });

    try {
      const papersData: GetPapersResult = await PaperAPI.getCitedPapers(buildRefOrCitedAPIParams(params));

      let targetPaper: PaperRecord = null;
      if (params.paperId || params.cognitiveId) {
        targetPaper = await PaperAPI.getPaper({
          cognitiveId: params.cognitiveId,
          paperId: params.paperId,
          cancelTokenSource: params.cancelTokenSource,
        });
      }

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS,
        payload: {
          papers: papersData.papers,
          nextPage: params.page + 1,
          isEnd: papersData.last,
          totalElements: papersData.totalElements,
          totalPages: papersData.totalPages,
          numberOfElements: papersData.numberOfElements,
          targetPaper,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: "Temporarily Unavailable",
        });
        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS });
      }
    }
  };
}

export function getReferencePapers(params: GetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS });

    try {
      const papersData: GetPapersResult = await PaperAPI.getReferencePapers(buildRefOrCitedAPIParams(params));

      let targetPaper: PaperRecord = null;
      if (params.paperId || params.cognitiveId) {
        targetPaper = await PaperAPI.getPaper({
          cognitiveId: params.cognitiveId,
          paperId: params.paperId,
          cancelTokenSource: params.cancelTokenSource,
        });
      }

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
        payload: {
          papers: papersData.papers,
          nextPage: params.page + 1,
          isEnd: papersData.last,
          totalElements: papersData.totalElements,
          totalPages: papersData.totalPages,
          numberOfElements: papersData.numberOfElements,
          targetPaper,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: "Temporarily Unavailable",
        });
        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS });
      }
    }
  };
}

function buildGetMoreCommentsParams(params: GetCommentsParams): GetCommentsParams {
  if (params.cognitiveId && params.cognitiveId !== 0) {
    return {
      page: params.page + 1,
      paperId: params.cognitiveId,
      cancelTokenSource: params.cancelTokenSource,
      cognitive: true,
    };
  } else {
    return {
      page: params.page + 1,
      paperId: params.paperId,
      cancelTokenSource: params.cancelTokenSource,
    };
  }
}

export function getMoreComments(params: GetCommentsParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS,
      payload: {
        paperId: params.paperId,
      },
    });

    try {
      const commentsData: GetCommentsResult = await CommentAPI.getComments(buildGetMoreCommentsParams(params));

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS,
        payload: {
          paperId: params.paperId,
          comments: commentsData.comments,
          nextPage: params.page + 1,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: `Failed to get comments ${err}`,
        });
        dispatch({
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_MORE_COMMENTS,
          payload: {
            paperId: params.paperId,
          },
        });
      }
    }
  };
}

export function changeCommentInput(index: number, comment: string) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT,
    payload: {
      index,
      comment,
    },
  };
}

export function toggleAbstract(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_ABSTRACT,
    payload: {
      index,
    },
  };
}

export function toggleComments(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_COMMENTS,
    payload: {
      index,
    },
  };
}

export function toggleAuthors(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_AUTHORS,
    payload: {
      index,
    },
  };
}

export function visitTitle(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_VISIT_TITLE,
    payload: {
      index,
    },
  };
}

export function postComment({ paperId, comment, cognitivePaperId }: PostCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_POST_COMMENT,
      payload: {
        paperId,
        cognitivePaperId,
      },
    });

    try {
      const recordifiedComment: ICommentRecord = await CommentAPI.postComment({
        paperId,
        comment,
        cognitivePaperId,
      });

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT,
        payload: {
          comment: recordifiedComment,
          paperId,
          cognitivePaperId,
        },
      });
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to post comment. ${err}`,
      });
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_POST_COMMENT,
        payload: {
          paperId,
          cognitivePaperId,
        },
      });
    }
  };
}

export function closeFirstOpen(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CLOSE_FIRST_OPEN,
    payload: {
      index,
    },
  };
}

export function deleteComment(params: DeleteCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_DELETE_COMMENT,
    });

    try {
      const deleteCommentResult: DeleteCommentResult = await CommentAPI.deleteComment(params);

      if (!deleteCommentResult.success) {
        throw new Error("Failed");
      }

      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT,
        payload: {
          paperId: params.paperId,
          commentId: params.commentId,
        },
      });
      alertToast({
        type: "success",
        message: "Succeeded to delete Your comment!!",
      });
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to delete the comment. ${err}`,
      });
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_DELETE_COMMENT,
      });
    }
  };
}

export function fetchSearchItems(params: FetchSearchItemsParams, cancelTokenSource?: CancelTokenSource) {
  return async (dispatch: Dispatch<any>) => {
    const { page, query, filter } = params;

    await dispatch(
      getPapers({
        page,
        query,
        filter,
        cancelTokenSource,
      }),
    );
  };
}
