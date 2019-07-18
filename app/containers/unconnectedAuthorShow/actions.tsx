import axios, { CancelToken } from 'axios';
import { Dispatch } from 'redux';
import AuthorAPI, { ConnectAuthorParams } from '../../api/author';
import ProfileAPI from '../../api/profile';
import alertToast from '../../helpers/makePlutoToastAction';
import { ActionCreators } from '../../actions/actionTypes';
import { GetAuthorPapersParams } from '../../api/author/types';
import PlutoAxios from '../../api/pluto';

export function getProfile(authorId: number, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const profileResponse = await ProfileAPI.getProfile(authorId, cancelToken);

      dispatch(ActionCreators.addEntity(profileResponse));
      dispatch(ActionCreators.getProfile({ authorId: profileResponse.result }));
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: 'error',
          message: 'Failed to get profile information',
        });
      }
    }
  };
}

export function getCoAuthors(authorId: number, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const coAuthorsResponse = await AuthorAPI.getCoAuthors(authorId, cancelToken);

      dispatch(ActionCreators.addEntity(coAuthorsResponse));
      dispatch(ActionCreators.getCoAuthors({ coAuthorIds: coAuthorsResponse.result }));
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: 'error',
          message: 'Failed to get co-authors information',
        });
      }
    }
  };
}

export function getAuthor(authorId: number, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const authorResponse = await AuthorAPI.getAuthor(authorId, cancelToken);

      dispatch(ActionCreators.addEntity(authorResponse));
      dispatch(ActionCreators.getAuthor({ authorId: authorResponse.result }));

      if (authorResponse.entities.authors[authorResponse.result].isLayered) {
        await dispatch(getProfile(authorId, cancelToken));
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);
        dispatch(ActionCreators.failedToGetAuthor());
        alertToast({
          type: 'error',
          message: error.message,
        });
        throw err;
      }
    }
  };
}

export function getAuthorPapers(params: GetAuthorPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToGetAuthorPapers());
    try {
      const paperResponse = await AuthorAPI.getAuthorPapers(params);
      dispatch(ActionCreators.addEntity(paperResponse));
      dispatch(
        ActionCreators.getAuthorPapers({
          query: params.query,
          sort: params.sort,
          paperIds: paperResponse.result,
          size: paperResponse.size,
          page: paperResponse.page,
          first: paperResponse.first,
          last: paperResponse.last,
          numberOfElements: paperResponse.numberOfElements,
          totalPages: paperResponse.totalPages,
          totalElements: paperResponse.totalElements,
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToGetAuthorPapers());
      alertToast({
        type: 'error',
        message: "Failed to get author's papers information",
      });
    }
  };
}

export function toggleConnectProfileDialog() {
  return ActionCreators.toggleConnectAuthorDialog();
}

export function connectAuthor(params: ConnectAuthorParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToConnectAuthor());

    try {
      const res = await AuthorAPI.connectAuthor(params);

      dispatch(ActionCreators.addEntity(res));
      dispatch(ActionCreators.succeedToConnectAuthor({ authorId: res.result }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      dispatch(ActionCreators.failToConnectAuthor());
      alertToast({
        type: 'error',
        message: 'Had an error to connect author',
      });
    }
  };
}
