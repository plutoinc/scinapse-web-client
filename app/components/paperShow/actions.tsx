import { Dispatch } from "redux";
import axios from "axios";
import { ACTION_TYPES } from "../../actions/actionTypes";
import CommentAPI from "../../api/comment";
import PaperAPI, { GetPaperParams, GetCitationTextParams } from "../../api/paper";
import {
  GetCommentsParams,
  PostCommentParams,
  DeleteCommentParams,
  DeleteCommentResult,
} from "../../api/types/comment";
import { ICommentRecord } from "../../model/comment";
import { GetRefOrCitedPapersParams, GetPapersResult } from "../../api/types/paper";
import { buildRefOrCitedAPIParams } from "../articleSearch/actions";
import alertToast from "../../helpers/makePlutoToastAction";
import { AvailableCitationType } from "./records";

export function toggleCitationDialog() {
  return {
    type: ACTION_TYPES.PAPER_SHOW_TOGGLE_CITATION_DIALOG,
  };
}

export function changeCommentInput(comment: string) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_CHANGE_COMMENT_INPUT,
    payload: { comment },
  };
}

export function handleClickCitationTab(citationTab: AvailableCitationType) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_CLICK_CITATION_TAB,
    payload: {
      tab: citationTab,
    },
  };
}

export function getCitationText(params: GetCitationTextParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITATION_TEXT,
    });

    try {
      const response = await PaperAPI.getCitationText(params);

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_GET_CITATION_TEXT,
        payload: {
          citationText: response.citationText,
        },
      });
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITATION_TEXT,
      });
    }
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
      alertToast({
        type: "error",
        message: `Failed to post comment. ${err}`,
      });
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

      if (!!paper.doi) {
        dispatch(getCitationText({ type: AvailableCitationType.BIBTEX, paperId: paper.id }));
      }
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
      console.error(err);
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COMMENTS,
      });
    }
  };
}

export function getReferencePapers(params: GetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_RELATED_PAPERS });

    try {
      const getPapersResult: GetPapersResult = await PaperAPI.getReferencePapers(buildRefOrCitedAPIParams(params));

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

      return getPapersResult.papers;
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: `Failed to get papers. ${err}`,
        });
        dispatch({ type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS });
      }
    }
  };
}

export function getCitedPapers(params: GetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_RELATED_PAPERS });

    try {
      const getPapersResult: GetPapersResult = await PaperAPI.getCitedPapers(buildRefOrCitedAPIParams(params));

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

      return getPapersResult.papers;
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: `Failed to get papers. ${err}`,
        });
        dispatch({ type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS });
      }
    }
  };
}

export function deleteComment(params: DeleteCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_DELETE_COMMENT,
      payload: {
        commentId: params.commentId,
      },
    });

    try {
      const deleteCommentResult: DeleteCommentResult = await CommentAPI.deleteComment(params);

      if (!deleteCommentResult.success) {
        throw new Error("Failed");
      }

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT,
        payload: {
          commentId: params.commentId,
        },
      });

      alertToast({
        type: "success",
        message: "Succeeded to delete your comment.",
      });
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to delete the comment. ${err}`,
      });
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_DELETE_COMMENT,
        payload: {
          commentId: params.commentId,
        },
      });
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
