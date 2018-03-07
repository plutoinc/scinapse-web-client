import { Dispatch } from "redux";
import axios from "axios";
import { ACTION_TYPES } from "../../actions/actionTypes";
import CommentAPI from "../../api/comment";
import PaperAPI, { GetPaperParams } from "../../api/paper";
import { GetCommentsParams, PostCommentParams } from "../../api/types/comment";
import { ICommentRecord } from "../../model/comment";
import { IGetRefOrCitedPapersParams, IGetPapersResult } from "../../api/types/paper";
import { buildRefOrCitedAPIParams } from "../articleSearch/actions";

export function changeCommentInput(comment: string) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_CHANGE_COMMENT_INPUT,
    payload: { comment },
  };
}

export function postComment({ paperId, comment, cognitivePaperId }: PostCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_POST_COMMENT,
    });

    try {
      const recordifiedComment: ICommentRecord = await CommentAPI.postComment({
        paperId,
        comment,
        cognitivePaperId,
      });

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT,
        payload: {
          comment: recordifiedComment,
        },
      });
    } catch (err) {
      alert(`Failed to post comment! ${err}`);
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COMMENT,
        payload: {
          paperId,
          cognitivePaperId,
        },
      });
    }
  };
}

export function getPaper(params: GetPaperParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER,
      });

      const paper = await PaperAPI.getPaper(params);

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER,
        payload: {
          paper,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER,
      });
    }
  };
}

export function getComments(params: GetCommentsParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_COMMENTS,
    });

    try {
      const commentsResponse = await CommentAPI.getComments(params);

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS,
        payload: {
          commentsResponse,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COMMENTS,
      });
    }
  };
}

export function getReferencePapers(params: IGetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_RELATED_PAPERS });

    try {
      const getPapersResult: IGetPapersResult = await PaperAPI.getReferencePapers(buildRefOrCitedAPIParams(params));

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS,
        payload: {
          papers: getPapersResult.papers,
          currentPage: getPapersResult.number,
          isEnd: getPapersResult.last,
          totalElements: getPapersResult.totalElements,
          totalPages: getPapersResult.totalPages,
          numberOfElements: getPapersResult.numberOfElements,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Papers! ${err}`);
        dispatch({ type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS });
      }
    }
  };
}

export function getCitedPapers(params: IGetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_RELATED_PAPERS });

    try {
      const getPapersResult: IGetPapersResult = await PaperAPI.getCitedPapers(buildRefOrCitedAPIParams(params));

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS,
        payload: {
          papers: getPapersResult.papers,
          currentPage: getPapersResult.number,
          isEnd: getPapersResult.last,
          totalElements: getPapersResult.totalElements,
          totalPages: getPapersResult.totalPages,
          numberOfElements: getPapersResult.numberOfElements,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        alert(`Failed to get Papers! ${err}`);
        dispatch({ type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS });
      }
    }
  };
}

export function clearPaperShowState() {
  return {
    type: ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE,
  };
}

export function toggleAbstract(paperId: number) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_TOGGLE_ABSTRACT,
    payload: {
      paperId,
    },
  };
}

export function toggleAuthors(paperId: number) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_TOGGLE_AUTHORS,
    payload: {
      paperId,
    },
  };
}

export function visitTitle(paperId: number) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_VISIT_TITLE,
    payload: {
      paperId,
    },
  };
}

export function closeFirstOpen(paperId: number) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_CLOSE_FIRST_OPEN,
    payload: {
      paperId,
    },
  };
}
