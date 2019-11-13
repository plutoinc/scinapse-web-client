import axios from 'axios';
import { LoadDataParams } from '../../routes';
import { CurrentUser } from '../../model/currentUser';
import { AuthorShowMatchParams } from '../unconnectedAuthorShow';
import { fetchAuthorShowRelevantData } from '../../actions/author';
import { ActionCreators } from '../../actions/actionTypes';

export async function fetchAuthorShowPageData(
  params: LoadDataParams<AuthorShowMatchParams>,
  currentUser?: CurrentUser
) {
  const { dispatch, match } = params;
  const authorId = match.params.authorId;

  if (!isNaN(parseInt(authorId, 10))) {
    return dispatch(ActionCreators.failedToLoadAuthorShowPageData({ statusCode: 400 }));
  }

  await dispatch(
    fetchAuthorShowRelevantData({
      authorId,
      currentUser,
      cancelToken: axios.CancelToken.source().token,
    })
  );
}
