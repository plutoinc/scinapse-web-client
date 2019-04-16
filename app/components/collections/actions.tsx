import axios, { CancelToken } from "axios";
import { Dispatch } from "react-redux";
import MemberAPI, { GetCollectionsResponse } from "../../api/member";
import { ActionCreators, ACTION_TYPES } from "../../actions/actionTypes";
import { GetUserCollectionsResponse } from "../../api/member";

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
            type: "error",
            message: "Sorry. Temporarily unavailable to get members.",
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
      const res = await MemberAPI.getCollections(memberId, itsMe, cancelToken);

      if (itsMe) {
        dispatch(ActionCreators.addEntity(res as GetUserCollectionsResponse));
        dispatch(ActionCreators.succeedToGetCollectionsInMember(res as GetUserCollectionsResponse));
      } else {
        dispatch(ActionCreators.addEntity(res as GetCollectionsResponse));
        dispatch(ActionCreators.succeededToGetCollectionsInCollectionsPage(res as GetCollectionsResponse));
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch(ActionCreators.failedToGetCollectionsInCollectionsPage());
        dispatch({
          type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
          payload: {
            type: "error",
            message: "Sorry. Temporarily unavailable to get collections.",
          },
        });
        throw err;
      }
    }
  };
}
