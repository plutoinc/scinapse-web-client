import { Dispatch } from "react-redux";
import ProfileAPI from "../../api/profile";
import { ActionCreators } from "../../actions/actionTypes";
import PlutoAxios from "../../api/pluto";

export function postProfile(authorIds: number[]) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToPostProfile());
      const profile = await ProfileAPI.makeProfile(authorIds);
      dispatch(ActionCreators.succeededToPostProfile({ profileId: profile.result }));
      dispatch(ActionCreators.addEntity(profile));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      dispatch(ActionCreators.failedToPostProfile());
      throw new Error(error.message);
    }
  };
}
