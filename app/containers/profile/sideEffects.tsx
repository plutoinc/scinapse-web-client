import { LoadDataParams } from '../../routes';
import { ActionCreators } from '../../actions/actionTypes';
import { fetchProfileData, fetchProfilePapers } from '../../actions/profile';

export async function fetchAuthorShowPageData(params: LoadDataParams<{ profileId: string }>) {
  const { dispatch, match, queryParams } = params;
  const profileId = match.params.profileId;

  if (isNaN(parseInt(profileId, 10))) {
    // TODO: Change below
    return dispatch(ActionCreators.failedToLoadAuthorShowPageData({ statusCode: 400 }));
  }

  await Promise.all([
    await dispatch(fetchProfileData(profileId)),
    await dispatch(fetchProfilePapers({ profileId, page: queryParams?.page || 0 })),
  ]);
}
