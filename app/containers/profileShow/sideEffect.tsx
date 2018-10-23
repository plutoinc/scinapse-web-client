import { ProfileShowMatchParams } from ".";
import { LoadDataParams } from "../../routes";
import { CurrentUser } from "../../model/currentUser";
import { getProfile, getProfilePublications } from "./actions";

export async function getProfilePageData(params: LoadDataParams<ProfileShowMatchParams>, _currentUser?: CurrentUser) {
  const { dispatch, match, pathname } = params;
  const { profileId } = match.params;
  const promiseArray = [];

  const isPublicationsTab = pathname.split("/").pop() === "publications";
  try {
    if (profileId) {
      promiseArray.push(dispatch(getProfile(profileId)));

      if (isPublicationsTab) {
        const page = params.queryParams ? parseInt(params.queryParams.page, 10) : 1;
        promiseArray.push(
          dispatch(
            getProfilePublications({
              profileId,
              size: 10,
              page,
            })
          )
        );
      }
    }
    await Promise.all(promiseArray);
  } catch (err) {
    console.error(err);
  }
}
