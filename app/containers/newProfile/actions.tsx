import { Dispatch } from "react-redux";
import ProfileAPI from "../../api/profile";
import { ActionCreators } from "../../actions/actionTypes";
import PlutoAxios from "../../api/pluto";

export function postProfile(authorIds: number[]) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToPostProfile());
      const profileRes = await ProfileAPI.makeProfile(authorIds);
      dispatch(ActionCreators.succeededToPostProfile({ profileId: profileRes.result }));
      dispatch(ActionCreators.addEntity(profileRes));

      return profileRes;
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      dispatch(ActionCreators.failedToPostProfile());
      throw new Error(error.message);
    }
  };
}
