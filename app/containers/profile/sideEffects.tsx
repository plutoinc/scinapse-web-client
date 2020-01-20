import { LoadDataParams } from '../../routes';
import { fetchAuthorShowRelevantData } from '../../actions/author';
import { ActionCreators } from '../../actions/actionTypes';

export async function fetchAuthorShowPageData(params: LoadDataParams<{ profileId: string }>) {
  const { dispatch, match } = params;
  const profileId = match.params.profileId;

  if (isNaN(parseInt(profileId, 10))) {
    return dispatch(ActionCreators.failedToLoadAuthorShowPageData({ statusCode: 400 }));
  }

  await dispatch(
    fetchAuthorShowRelevantData({
      authorId: profileId,
    })
  );
}
