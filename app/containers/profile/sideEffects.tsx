import { LoadDataParams } from '../../routes';
import { fetchProfileData, fetchProfilePapers, fetchProfilePendingPapers } from '../../actions/profile';

export async function fetchAuthorShowPageData(params: LoadDataParams<{ profileId: string }>) {
  const { dispatch, match, queryParams } = params;
  const profileId = match.params.profileId;

  await Promise.all([
    await dispatch(fetchProfileData(profileId)),
    await dispatch(fetchProfilePendingPapers(profileId)),
    await dispatch(fetchProfilePapers({ profileId, page: queryParams?.page || 0 })),
  ]);
}
