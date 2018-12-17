import axios, { CancelToken } from "axios";
import { Dispatch } from "react-redux";
import MemberAPI from "../../api/member";
import { ActionCreators } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";

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

        alertToast({
          type: "error",
          message: `Sorry. Temporarily unavailable to get collections.`,
        });
      }
    }
  };
}

export function getCollections(memberId: number, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetCollectionsInCollectionsPage());

    try {
      const res = await MemberAPI.getCollections(memberId, cancelToken);

      dispatch(ActionCreators.addEntity(res));
      dispatch(ActionCreators.succeededToGetCollectionsInCollectionsPage(res));
    } catch (err) {
      if (!axios.isCancel(err)) {
        dispatch(ActionCreators.failedToGetCollectionsInCollectionsPage());

        alertToast({
          type: "error",
          message: `Sorry. Temporarily unavailable to get collections.`,
        });
      }
    }
  };
}
