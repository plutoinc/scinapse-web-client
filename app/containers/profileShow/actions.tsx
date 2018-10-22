import { Dispatch } from "react-redux";
import ProfileAPI, { GetProfilePublicationsParams } from "../../api/profile";
import { ActionCreators } from "../../actions/actionTypes";
import PlutoAxios from "../../api/pluto";

export function getProfile(profileId: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetProfile());
      const profile = await ProfileAPI.getProfile(profileId);
      dispatch(ActionCreators.succeededToGetProfile({ profileId }));
      dispatch(ActionCreators.addEntity(profile));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      dispatch(ActionCreators.failedToGetProfile());
      console.error(error);
    }
  };
}

export function getProfilePublications(params: GetProfilePublicationsParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetProfilePublications());
      const papersResponse = await ProfileAPI.getProfilePublications(params);
      dispatch(ActionCreators.addEntity(papersResponse));
      dispatch(
        ActionCreators.succeededToGetProfilePublications({
          paperIds: papersResponse.result as number[],
          page: papersResponse.page!.page,
          numberOfPapers: papersResponse.page!.totalElements,
          totalPages: papersResponse.page!.totalPages,
        })
      );
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      dispatch(ActionCreators.failedToGetProfilePublications());
      console.error(error);
    }
  };
}
