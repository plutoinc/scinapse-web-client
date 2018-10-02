import { Dispatch } from "react-redux";
import ProfileAPI from "../../api/profile";
import { ActionCreators } from "../../actions/actionTypes";

export function getProfile(profileId: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetProfile());
      const profile = await ProfileAPI.getProfile(profileId);
      dispatch(ActionCreators.succeededToGetProfile({ profileId }));
      dispatch(ActionCreators.addEntity(profile));
    } catch (err) {
      dispatch(ActionCreators.failedToGetProfile());
      console.error(err);
    }
  };
}
