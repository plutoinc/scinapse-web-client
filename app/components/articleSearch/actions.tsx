import { Dispatch } from "redux";
import axios, { CancelTokenSource } from "axios";
import { push } from "react-router-redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { SEARCH_SORTING } from "./records";
import { IGetPapersParams, IGetPapersResult, IGetRefOrCitedPapersParams } from "../../api/types/paper";
import PaperAPI from "../../api/paper";
import CommentAPI from "../../api/comment";
import { ICommentRecord } from "../../model/comment";
import { IPaperRecord } from "../../model/paper";
import alertToast from "../../helpers/makePlutoToastAction";
import papersQueryFormatter, { IFormatPapersQueryParams } from "../../helpers/papersQueryFormatter";
import { SEARCH_FETCH_ITEM_MODE } from "./types";
import { FetchSearchItemsParams } from "./types/actions";
import { trackSearch } from "../../helpers/handleGA";
import {
  GetCommentsParams,
  IGetCommentsResult,
  PostCommentParams,
  IDeleteCommentParams,
  IDeleteCommentResult,
} from "../../api/types/comment";

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
      alert("Search query length has to be over 2.");
    } else {
      trackSearch("query", searchInput);
      dispatch(push(`/search?query=${papersQueryFormatter.formatPapersQuery({ text: searchInput })}&page=1`));
    }
  };
}

export function addFilter({ text, yearFrom, yearTo, journalIFFrom, journalIFTo }: IFormatPapersQueryParams) {
  return push(
    `/search?query=${papersQueryFormatter.formatPapersQuery({
      text,
      yearFrom,
      yearTo,
      journalIFFrom,
      journalIFTo,
    })}&page=1`,
  );
}

export function changeSorting(sorting: SEARCH_SORTING) {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING,
    payload: {
      sorting,
    },
  };
}

export function getPapers(params: IGetPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS });

    try {
      const papersData: IGetPapersResult = await PaperAPI.getPapers({
        page: params.page,
        query: params.query,
        cancelTokenSource: params.cancelTokenSource,
      });

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
        alert(`Failed to get Papers! ${err}`);
        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS });
      }
    }
  };
}

function buildRefOrCitedAPIParams(params: IGetRefOrCitedPapersParams) {
  if (params.cognitiveId && params.cognitiveId !== 0) {
    return {
      page: params.page,
      paperId: params.cognitiveId,
      cancelTokenSource: params.cancelTokenSource,
      cognitive: true,
    };
  } else {
    return {
      page: params.page,
      paperId: params.paperId,
      cancelTokenSource: params.cancelTokenSource,
    };
  }
}

export function getCitedPapers(params: IGetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS });

    try {
      const papersData: IGetPapersResult = await PaperAPI.getCitedPapers(buildRefOrCitedAPIParams(params));

      let targetPaper: IPaperRecord = null;
      if (params.paperId) {
        targetPaper = await PaperAPI.getPaper(params.paperId, params.cancelTokenSource);
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
        alert(`Failed to get Papers! ${err}`);
        dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS });
      }
    }
  };
}

export function getReferencePapers(params: IGetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS });

    try {
      const papersData: IGetPapersResult = await PaperAPI.getReferencePapers(buildRefOrCitedAPIParams(params));

      let targetPaper: IPaperRecord = null;
      if (params.paperId) {
        targetPaper = await PaperAPI.getPaper(params.paperId, params.cancelTokenSource);
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
        alert(`Failed to get Papers! ${err}`);
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
      const commentsData: IGetCommentsResult = await CommentAPI.getComments(buildGetMoreCommentsParams(params));

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
        alert(`Failed to get More comments! ${err}`);
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
      alert(`Failed to post comment! ${err}`);
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

export function deleteComment(params: IDeleteCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_DELETE_COMMENT,
    });

    try {
      const deleteCommentResult: IDeleteCommentResult = await CommentAPI.deleteComment(params);

      if (!deleteCommentResult.success) throw new Error("Failed");

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
      alert(`Failed to delete Review! ${err}`);
      dispatch({
        type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_DELETE_COMMENT,
      });
    }
  };
}

export function fetchSearchItems(params: FetchSearchItemsParams, cancelTokenSource: CancelTokenSource) {
  return async (dispatch: Dispatch<any>) => {
    const { mode, page, query, paperId, cognitiveId } = params;

    switch (mode) {
      case SEARCH_FETCH_ITEM_MODE.QUERY:
        await dispatch(
          getPapers({
            page,
            query,
            cancelTokenSource: cancelTokenSource,
          }),
        );
        break;

      case SEARCH_FETCH_ITEM_MODE.CITED:
        await dispatch(
          getCitedPapers({
            page,
            paperId,
            cognitiveId,
            cancelTokenSource: cancelTokenSource,
          }),
        );
        break;

      case SEARCH_FETCH_ITEM_MODE.REFERENCES:
        await dispatch(
          getReferencePapers({
            page,
            paperId,
            cognitiveId,
            cancelTokenSource: cancelTokenSource,
          }),
        );
        break;
      default:
        break;
    }
  };
}
