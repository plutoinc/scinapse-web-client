import { LoadDataParams } from '../../routes';
import { ActionCreators } from '../../actions/actionTypes';
import { fetchProfileData } from '../../actions/profile';

export async function fetchAuthorShowPageData(params: LoadDataParams<{ profileId: string }>) {
  const { dispatch, match } = params;
  const profileId = match.params.profileId;

  if (isNaN(parseInt(profileId, 10))) {
    // TODO: Change below
    return dispatch(ActionCreators.failedToLoadAuthorShowPageData({ statusCode: 400 }));
  }

  await dispatch(fetchProfileData(profileId));
}
