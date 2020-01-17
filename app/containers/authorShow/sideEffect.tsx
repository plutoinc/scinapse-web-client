import { LoadDataParams } from '../../routes';
import { AuthorShowMatchParams } from '../unconnectedAuthorShow';
import { fetchAuthorShowRelevantData } from '../../actions/author';
import { ActionCreators } from '../../actions/actionTypes';

export async function fetchAuthorShowPageData(params: LoadDataParams<AuthorShowMatchParams>) {
  const { dispatch, match } = params;
  const authorId = match.params.authorId;

  if (isNaN(parseInt(authorId, 10))) {
    return dispatch(ActionCreators.failedToLoadAuthorShowPageData({ statusCode: 400 }));
  }

  await dispatch(
    fetchAuthorShowRelevantData({
      authorId,
    })
  );
}
