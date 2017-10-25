import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { ICommentsRecord, COMMENTS_INITIAL_STATE } from "../model/comment";

export function reducer(state = COMMENTS_INITIAL_STATE, action: IReduxAction<any>): ICommentsRecord {
  switch (action.type) {
    case ACTION_TYPES.SUCCEEDED_TO_FETCH_COMMENTS: {
      const targetComments: ICommentsRecord = action.payload.comments;
      const updatedCommentsIdArray: number[] = [];

      const updatedCommentsList = state.map(comment => {
        const alreadyExistComments = targetComments.find(targetComment => {
          return targetComment.id === comment.id;
        });

        if (alreadyExistComments !== undefined) {
          updatedCommentsIdArray.push(alreadyExistComments.id);
          return alreadyExistComments;
        } else {
          return comment;
        }
      });

      const targetCommentsWithoutUpdatedComments = targetComments.filter(comment => {
        return !updatedCommentsIdArray.includes(comment.id);
      });

      return updatedCommentsList.concat(targetCommentsWithoutUpdatedComments).toList();
    }

    case ACTION_TYPES.GLOBAL_LOCATION_CHANGE: {
      return COMMENTS_INITIAL_STATE;
    }

    default:
      return state;
  }
}
