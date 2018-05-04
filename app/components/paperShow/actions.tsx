import { Dispatch } from "react-redux";
import axios from "axios";
import { ACTION_TYPES } from "../../actions/actionTypes";
import CommentAPI from "../../api/comment";
import MemberAPI from "../../api/member";
import PaperAPI, {
  GetPaperParams,
  GetCitationTextParams,
  GetRelatedPapersParams,
  GetOtherPapersFromAuthorParams,
} from "../../api/paper";
import {
  GetCommentsParams,
  PostCommentParams,
  DeleteCommentParams,
  DeleteCommentResult,
} from "../../api/types/comment";
import { ICommentRecord } from "../../model/comment";
import { GetRefOrCitedPapersParams, GetPapersResult } from "../../api/types/paper";
import alertToast from "../../helpers/makePlutoToastAction";
import { AvailableCitationType } from "./records";
import { PaperRecord } from "../../model/paper";
import { RELATED_PAPERS } from "./constants";

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

export function toggleAuthorBox() {
  return {
    type: ACTION_TYPES.PAPER_SHOW_TOGGLE_AUTHOR_BOX,
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

      alertToast({
        type: "error",
        message: `Sorry. Temporarily unavailable to get citation text.`,
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

      return paper;
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
    dispatch({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS });

    try {
      const getPapersResult: GetPapersResult = await PaperAPI.getReferencePapers(params);

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
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
        dispatch({ type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS });
      }
    }
  };
}

export function getCitedPapers(params: GetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS });

    try {
      const getPapersResult: GetPapersResult = await PaperAPI.getCitedPapers(params);

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS,
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
        dispatch({ type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS });
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

export function toggleAbstract(paperId: number, relatedPapersType: RELATED_PAPERS) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_TOGGLE_ABSTRACT,
    payload: {
      paperId,
      relatedPapersType,
    },
  };
}

export function toggleAuthors(paperId: number, relatedPapersType: RELATED_PAPERS) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_TOGGLE_AUTHORS,
    payload: {
      paperId,
      relatedPapersType,
    },
  };
}

export function visitTitle(paperId: number, relatedPapersType: RELATED_PAPERS) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_VISIT_TITLE,
    payload: {
      paperId,
      relatedPapersType,
    },
  };
}

export function closeFirstOpen(paperId: number, relatedPapersType: RELATED_PAPERS) {
  return {
    type: ACTION_TYPES.PAPER_SHOW_CLOSE_FIRST_OPEN,
    payload: {
      paperId,
      relatedPapersType,
    },
  };
}

export function getBookmarkedStatus(paper: PaperRecord) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.PAPER_SHOW_START_TO_CHECK_BOOKMARKED_STATUS });
    try {
      const res = await MemberAPI.checkBookmark(paper);

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS,
        payload: {
          checkedStatus: res[0],
        },
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_CHECK_BOOKMARKED_STATUS,
      });
    }
  };
}

export function getRelatedPapers(params: GetRelatedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_RELATED_PAPERS });
    try {
      const papers = await PaperAPI.getRelatedPapers(params);

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS,
        payload: {
          relatedPapers: papers,
        },
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS,
      });
    }
  };
}

export function getOtherPapers(params: GetOtherPapersFromAuthorParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_OTHER_PAPERS });
    try {
      const papers = await PaperAPI.getOtherPapersFromAuthor(params);

      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_OTHER_PAPERS,
        payload: {
          papers,
        },
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_OTHER_PAPERS,
      });
    }
  };
}
