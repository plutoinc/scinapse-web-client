import { Dispatch } from 'redux';
import { ActionCreators } from './actionTypes';
import homeAPI from '../api/home';

export function fetchBasedOnActivityPapers() {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetBasedOnActivityPapers());
    try {
      const response = await homeAPI.getBasedOnActivityPapers();
      if (response && response.length > 0) {
        dispatch(ActionCreators.succeededToGetBasedOnActivityPapers({ basedOnActivityPapers: response }));
      }
    } catch (err) {
      dispatch(ActionCreators.failedToGetBasedOnActivityPapers());
      console.error(err);
    }
  };
}

export function fetchBasedOnCollectionPapers() {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetBasedOnCollectionPapers());
    try {
      const response = await homeAPI.getBasedOnCollectionPapers();
      if (response) {
        dispatch(ActionCreators.succeededToGetBasedOnCollectionPapers({ basedOnCollectionPapers: response }));
      }
    } catch (err) {
      dispatch(ActionCreators.failedToGetBasedOnCollectionPapers());
      console.error(err);
    }
  };
}
