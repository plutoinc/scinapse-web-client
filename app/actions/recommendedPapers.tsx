import { Dispatch } from 'redux';
import { ActionCreators } from './actionTypes';
import homeAPI from '../api/home';
import alertToast from '../helpers/makePlutoToastAction';

export function fetchBasedOnActivityPapers() {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetBasedOnActivityPapers());
    try {
      const response = await homeAPI.getBasedOnActivityPapers();
      if (response && response.length > 0) {
        dispatch(ActionCreators.succeededToGetBasedOnActivityPapers({ basedOnActivityPapers: response }));
      } else {
        dispatch(ActionCreators.failedToGetBasedOnActivityPapers());
      }
    } catch (err) {
      dispatch(ActionCreators.failedToGetBasedOnActivityPapers());
      alertToast({
        type: 'error',
        message: `Had an error to get based on activity papers data.`,
      });
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
      } else {
        dispatch(ActionCreators.failedToGetBasedOnCollectionPapers());
      }
    } catch (err) {
      dispatch(ActionCreators.failedToGetBasedOnCollectionPapers());
      alertToast({
        type: 'error',
        message: `Had an error to get based on collection papers data.`,
      });
    }
  };
}
