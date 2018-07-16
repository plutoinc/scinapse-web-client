import { Dispatch } from "react-redux";
import axios from "axios";
import { ActionCreators } from "../../actions/actionTypes";
import CommentAPI from "../../api/comment";
import MemberAPI from "../../api/member";
import CollectionAPI, { PostCollectionParams } from "../../api/collection";
import PaperAPI, {
  GetPaperParams,
  GetRelatedPapersParams,
  GetOtherPapersFromAuthorParams,
} from "../../api/paper";
import {
  GetCommentsParams,
  PostCommentParams,
  DeleteCommentParams,
  DeleteCommentResult,
} from "../../api/types/comment";
import { GetRefOrCitedPapersParams } from "../../api/types/paper";
import alertToast from "../../helpers/makePlutoToastAction";
import { trackEvent } from "../../helpers/handleGA";

export function toggleAuthorBox() {
  return ActionCreators.toggleAuthorBox();
}

export function clearPaperShowState() {
  return ActionCreators.clearPaperShowState();
}

export function getMyCollections(paperId?: number) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetCollectionsInPaperShow());

      const res = await MemberAPI.getMyCollections(paperId);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetCollectionsInPaperShow({
          collectionIds: res.result,
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToGetCollectionsInPaperShow());
      alertToast({
        type: "error",
        message: err.message || "Failed to get collections.",
      });
    }
  };
}

export function postComment({ paperId, comment, cognitivePaperId }: PostCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToPostComment());

    try {
      const commentResponse = await CommentAPI.postComment({
        paperId,
        comment,
        cognitivePaperId,
      });

      dispatch(ActionCreators.addEntity(commentResponse));
      dispatch(ActionCreators.postComment({ commentId: commentResponse.result }));

      trackEvent({
        category: "paper-show",
        action: "post-comment",
        label: comment,
      });
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to post comment. ${err}`,
      });
      dispatch(ActionCreators.failedToPostComment({ paperId }));
    }
  };
}

export function getPaper(params: GetPaperParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetPaper());

      const paperResponse = await PaperAPI.getPaper(params);

      dispatch(ActionCreators.addEntity(paperResponse));
      dispatch(ActionCreators.getPaper({ paperId: paperResponse.result }));
      return paperResponse.entities.papers[params.paperId];
    } catch (err) {
      dispatch(ActionCreators.failedToGetPaper());
    }
  };
}

export function getComments(params: GetCommentsParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetComments());

    try {
      const commentsResponse = await CommentAPI.getComments(params);
      dispatch(ActionCreators.addEntity(commentsResponse));
      dispatch(
        ActionCreators.getComments({
          commentIds: commentsResponse.result,
          size: commentsResponse.size,
          number: commentsResponse.number,
          sort: "",
          first: commentsResponse.first,
          last: commentsResponse.last,
          numberOfElements: commentsResponse.numberOfElements,
          totalPages: commentsResponse.totalPages,
          totalElements: commentsResponse.totalElements,
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(ActionCreators.failedToGetComments());
    }
  };
}

export function getReferencePapers(params: GetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetReferencePapers());

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
        })
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: `Failed to get papers. ${err}`,
        });
        dispatch(ActionCreators.failedToGetReferencePapers());
      }
    }
  };
}

export function getCitedPapers(params: GetRefOrCitedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetCitedPapers());

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
        })
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: `Failed to get papers. ${err}`,
        });
        dispatch(ActionCreators.startToGetCitedPapers());
      }
    }
  };
}

export function deleteComment(params: DeleteCommentParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToDeleteComment());

    try {
      const deleteCommentResult: DeleteCommentResult = await CommentAPI.deleteComment(params);

      if (!deleteCommentResult.success) {
        throw new Error("Failed");
      }

      dispatch(ActionCreators.succeededToDeleteComment({ commentId: params.commentId }));

      alertToast({
        type: "success",
        message: "Succeeded to delete your comment.",
      });
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to delete the comment. ${err}`,
      });
      dispatch(ActionCreators.failedToDeleteComment());
    }
  };
}

export function getRelatedPapers(params: GetRelatedPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetRelatedPapers());
    try {
      const responseData = await PaperAPI.getRelatedPapers(params);

      dispatch(ActionCreators.addEntity(responseData));
      dispatch(ActionCreators.getRelatedPapers({ paperIds: responseData.result }));
    } catch (err) {
      console.error(err);
      dispatch(ActionCreators.failedToGetRelatedPapers());
    }
  };
}

export function getOtherPapers(params: GetOtherPapersFromAuthorParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetAuthorOtherPapers());
    try {
      const responseData = await PaperAPI.getOtherPapersFromAuthor(params);

      dispatch(ActionCreators.addEntity(responseData));
      dispatch(
        ActionCreators.getOtherPapersFromAuthor({
          paperIds: responseData.result,
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(ActionCreators.failedToGetAuthorOtherPapers());
    }
  };
}

export function postNewCollection(params: PostCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToPostCollectionInCollectionDropdown());

      const res = await CollectionAPI.postCollection(params);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToPostCollectionInCollectionDropdown({
          collectionId: res.result,
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToPostCollectionInCollectionDropdown());
      throw err;
    }
  };
}
