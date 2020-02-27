import { LoadDataParams } from '../../routes';
import {
  fetchProfileData,
  fetchProfilePapers,
  fetchProfilePendingPapers,
  fetchRepresentativePapers,
} from '../../actions/profile';

export async function fetchAuthorShowPageData(params: LoadDataParams<{ profileSlug: string }>) {
  const { dispatch, match, queryParams } = params;
  const profileSlug = match.params.profileSlug;

  await Promise.all([
    dispatch(fetchProfileData(profileSlug)),
    dispatch(fetchProfilePendingPapers(profileSlug)),
    dispatch(fetchRepresentativePapers({ profileSlug })),
    dispatch(fetchProfilePapers({ profileSlug, page: queryParams?.page || 0 })),
  ]);
}
