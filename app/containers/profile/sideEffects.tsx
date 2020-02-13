import { LoadDataParams } from '../../routes';
import { fetchProfileData, fetchProfilePapers, fetchProfilePendingPapers } from '../../actions/profile';

export async function fetchAuthorShowPageData(params: LoadDataParams<{ profileSlug: string }>) {
  const { dispatch, match, queryParams } = params;
  const profileSlug = match.params.profileSlug;

  await Promise.all([
    await dispatch(fetchProfileData(profileSlug)),
    await dispatch(fetchProfilePendingPapers(profileSlug)),
    await dispatch(fetchProfilePapers({ profileSlug, page: queryParams?.page || 0 })),
  ]);
}
