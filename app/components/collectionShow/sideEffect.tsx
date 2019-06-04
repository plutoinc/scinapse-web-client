import { LoadDataParams } from '../../routes';
import { CollectionShowMatchParams } from './types';
import { getCollection, getPapers } from './actions';
import { ActionCreators } from '../../actions/actionTypes';
import { Dispatch } from 'redux';

export async function fetchCollectionShowData(params: LoadDataParams<CollectionShowMatchParams>) {
  const { dispatch, match } = params;

  const collectionId = parseInt(match.params.collectionId, 10);
  if (isNaN(collectionId)) {
    return dispatch(
      ActionCreators.failedToGetCollectionInCollectionShow({
        statusCode: 400,
      })
    );
  } else {
    const promiseArr: ((dispatch: Dispatch<any>) => Promise<any>)[] = [];
    promiseArr.push(dispatch(getCollection(collectionId, params.cancelToken)));
    promiseArr.push(
      dispatch(
        getPapers({
          collectionId,
          cancelToken: params.cancelToken,
          sort: 'RECENTLY_ADDED',
          page: 1,
        })
      )
    );
    await Promise.all(promiseArr);
  }
}
