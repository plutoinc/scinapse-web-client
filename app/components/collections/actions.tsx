import axios, { CancelToken } from 'axios';
import { Dispatch } from 'redux';
import MemberAPI from '../../api/member';
import { ActionCreators, ACTION_TYPES } from '../../actions/actionTypes';

export function getMember(memberId: number, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetMemberInCollectionsPage());

    try {
      const res = await MemberAPI.getMember(memberId, cancelToken);

      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetMemberInCollectionsPage({
          memberId: res.result,
        })
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch(ActionCreators.failedToGetMemberInCollectionsPage());
        dispatch({
          type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
          payload: {
            type: 'error',
            message: 'Sorry. Temporarily unavailable to get members.',
          },
        });
        throw err;
      }
    }
  };
}

export function getCollections(memberId: number, cancelToken?: CancelToken, itsMe?: boolean) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetCollectionsInCollectionsPage());

    try {
      const res = await MemberAPI.getCollections(memberId, cancelToken);

      dispatch(ActionCreators.addEntity(res));
      if (itsMe) {
        dispatch(ActionCreators.succeedToGetCollectionsInMember(res));
      } else {
        dispatch(ActionCreators.succeededToGetCollectionsInCollectionsPage(res));
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch(ActionCreators.failedToGetCollectionsInCollectionsPage());
        dispatch({
          type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
          payload: {
            type: 'error',
            message: 'Sorry. Temporarily unavailable to get collections.',
          },
        });
        throw err;
      }
    }
  };
}
