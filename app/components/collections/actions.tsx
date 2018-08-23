import { Dispatch } from "react-redux";
import MemberAPI from "../../api/member";
import { ActionCreators } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";

export function getMember(memberId: number) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetMemberInCollectionsPage());

    try {
      const res = await MemberAPI.getMember(memberId);

      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetMemberInCollectionsPage({
          memberId: res.result,
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToGetMemberInCollectionsPage());

      alertToast({
        type: "error",
        message: `Sorry. Temporarily unavailable to get collections.`,
      });
    }
  };
}

export function getCollections(memberId: number) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetCollectionsInCollectionsPage());

    try {
      const res = await MemberAPI.getCollections(memberId);

      dispatch(ActionCreators.addEntity(res));
      dispatch(ActionCreators.succeededToGetCollectionsInCollectionsPage(res));
    } catch (err) {
      dispatch(ActionCreators.failedToGetCollectionsInCollectionsPage());

      alertToast({
        type: "error",
        message: `Sorry. Temporarily unavailable to get collections.`,
      });
    }
  };
}
