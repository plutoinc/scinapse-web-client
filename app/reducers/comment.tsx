import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { ICommentsRecord, COMMENTS_INITIAL_STATE } from "../model/comment";

export function reducer(state = COMMENTS_INITIAL_STATE, action: IReduxAction<any>): ICommentsRecord {
  switch (action.type) {
    case ACTION_TYPES.SUCCEEDED_TO_FETCH_COMMENTS: {
      const targetComments: ICommentsRecord = action.payload.comments;
      const updatedCommentsIdArray: number[] = [];

      const updatedCommentsList = state.map(comment => {
        const alreadyExistComment = targetComments.find(targetComment => {
          return targetComment.id === comment.id;
        });

        if (alreadyExistComment !== undefined) {
          updatedCommentsIdArray.push(alreadyExistComment.id);
          return alreadyExistComment;
        } else {
          return comment;
        }
      });

      const targetCommentsWithoutUpdatedComments = targetComments.filter(comment => {
        return !updatedCommentsIdArray.includes(comment.id);
      });

      return updatedCommentsList.concat(targetCommentsWithoutUpdatedComments).toList();
    }

    case ACTION_TYPES.ARTICLE_SHOW_SUCCEEDED_TO_PEER_EVALUATION_COMMENT_SUBMIT: {
      return state.push(action.payload.comment);
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return COMMENTS_INITIAL_STATE;
    }

    default:
      return state;
  }
}
