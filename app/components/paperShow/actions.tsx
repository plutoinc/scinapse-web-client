import { Dispatch } from "react-redux";
import axios from "axios";
import { ACTION_TYPES, ActionCreators } from "../../actions/actionTypes";
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
import { CommentRecord } from "../../model/comment";
import { GetRefOrCitedPapersParams } from "../../api/types/paper";
import alertToast from "../../helpers/makePlutoToastAction";
import { AvailableCitationType } from "./records";
import { Paper } from "../../model/paper";
import { trackEvent } from "../../helpers/handleGA";

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
      const recordifiedComment: CommentRecord = await CommentAPI.postComment({
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

      trackEvent({ category: "paper-show", action: "post-comment", label: comment });
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

      const paperResponse = await PaperAPI.getPaper(params);

      dispatch(ActionCreators.addEntity(paperResponse));
      dispatch(ActionCreators.getPaper({ paperId: paperResponse.result }));
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
      const getPapersResult = await PaperAPI.getReferencePapers(params);
      dispatch(ActionCreators.addEntity(getPapersResult));
      dispatch(
        ActionCreators.getReferencePapers({
          paperIds: getPapersResult.result,
          size: getPapersResult.size,
          number: getPapersResult.number,
          sort: "",
          first: getPapersResult.first,
          last: getPapersResult.last,
          numberOfElements: getPapersResult.numberOfElements,
          totalPages: getPapersResult.totalPages,
          totalElements: getPapersResult.totalElements,
        }),
      );
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
      const getPapersResult = await PaperAPI.getCitedPapers(params);
      dispatch(ActionCreators.addEntity(getPapersResult));
      dispatch(
        ActionCreators.getCitedPapers({
          paperIds: getPapersResult.result,
          size: getPapersResult.size,
          number: getPapersResult.number,
          sort: "",
          first: getPapersResult.first,
          last: getPapersResult.last,
          numberOfElements: getPapersResult.numberOfElements,
          totalPages: getPapersResult.totalPages,
          totalElements: getPapersResult.totalElements,
        }),
      );
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

export function getBookmarkedStatus(paper: Paper) {
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
      const responseData = await PaperAPI.getRelatedPapers(params);

      dispatch(ActionCreators.addEntity(responseData));
      dispatch(ActionCreators.getRelatedPapers({ paperIds: responseData.result }));
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
      const responseData = await PaperAPI.getOtherPapersFromAuthor(params);

      dispatch(ActionCreators.addEntity(responseData));
      dispatch(ActionCreators.getOtherPapersFromAuthor({ paperIds: responseData.result }));
    } catch (err) {
      console.error(err);
      dispatch({
        type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_OTHER_PAPERS,
      });
    }
  };
}
