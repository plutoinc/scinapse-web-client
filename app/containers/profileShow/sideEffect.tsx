import { ProfileShowMatchParams } from ".";
import { LoadDataParams } from "../../routes";
import { CurrentUser } from "../../model/currentUser";
import { getProfile } from "./actions";

export async function getProfilePageData(params: LoadDataParams<ProfileShowMatchParams>, _currentUser?: CurrentUser) {
  const { dispatch, match } = params;
  const { profileId } = match.params;
  const promiseArray = [];

  try {
    if (profileId) {
      promiseArray.push(dispatch(getProfile(profileId)));
    }
    await Promise.all(promiseArray);
  } catch (err) {
    console.error(err);
  }
}
