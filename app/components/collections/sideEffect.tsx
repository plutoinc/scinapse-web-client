import { Dispatch } from 'redux';
import { getCollections as getUserCollections, getMember } from './actions';
import { LoadDataParams } from '../../routes';
import { ActionCreators } from '../../actions/actionTypes';
import PlutoAxios from '../../api/pluto';
import { CommonError } from '../../model/error';

export interface GetCollectionsParams extends LoadDataParams<{ userId: string }> {
  userId?: string;
}

export async function getCollections(params: GetCollectionsParams) {
  const { match, dispatch } = params;

  try {
    const promiseArray: ((dispatch: Dispatch<any>) => Promise<any>)[] = [];
    const userIdStr = params.userId ? params.userId : match.params.userId;
    const userId = parseInt(userIdStr, 10);

    if (isNaN(userId)) {
      return dispatch(ActionCreators.failedToGetCollectionsPageData({ statusCode: 400 }));
    }

    promiseArray.push(dispatch(getMember(userId)));
    promiseArray.push(dispatch(getUserCollections(userId)));

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(err);
    const error = PlutoAxios.getGlobalError(err);
    dispatch(ActionCreators.failedToGetCollectionsPageData({ statusCode: (error as CommonError).status }));
    console.error(`Error for fetching collection list page data`, err);
  }
}
