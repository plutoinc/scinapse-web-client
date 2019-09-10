import { Dispatch } from 'redux';
import { ActionCreators } from './actionTypes';
import PlutoAxios from '../api/pluto';
import alertToast from '../helpers/makePlutoToastAction';
import CollectionAPI, {
  AddPaperToCollectionParams,
  RemovePapersFromCollectionParams,
  UpdatePaperNoteToCollectionParams,
} from '../api/collection';
import { Collection } from '../model/collection';
import { fetchMyCollection } from '../containers/paperShow/sideEffect';
import { openCollectionSnackBar } from '../reducers/collectionSnackBar';

export function savePaperToCollection(params: AddPaperToCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToPostPaperToCollection());

      await CollectionAPI.addPaperToCollection(params);

      dispatch(
        ActionCreators.succeededPostPaperToCollection({
          collection: params.collection,
        })
      );

      if (params.cancelToken) {
        dispatch(fetchMyCollection(params.paperId, params.cancelToken));
      }

      dispatch(openCollectionSnackBar({ collectionId: params.collection.id, collectionName: params.collection.title }));
    } catch (err) {
      dispatch(ActionCreators.failedToPostPaperToCollection());
      const error = PlutoAxios.getGlobalError(err);
      if (error) {
        alertToast({
          type: 'error',
          message: error.message,
        });
      }
    }
  };
}

export function removePaperFromCollection(params: RemovePapersFromCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToRemovePaperFromCollectionInPaperShow());

      await CollectionAPI.removePapersFromCollection(params);
      dispatch(
        ActionCreators.succeededToRemovePaperFromCollectionInPaperShow({
          collection: params.collection,
        })
      );

      if (params.cancelToken) {
        dispatch(fetchMyCollection(params.paperIds[0], params.cancelToken));
      }
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      dispatch(ActionCreators.failedToRemovePaperFromCollectionInPaperShow());
      alertToast({
        type: 'error',
        message: error.message,
      });
    }
  };
}

export function selectCollectionToCurrentCollection(collection: Collection) {
  return ActionCreators.selectCollection({ collection });
}

export function toggleNoteEditMode() {
  return ActionCreators.toggleNoteEditMode();
}

export function staleUpdatedCollectionNote(collectionId: number) {
  return ActionCreators.staleUpdatedCollectionNote({ collectionId });
}

export function updatePaperNote(params: UpdatePaperNoteToCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToUpdatePaperNote());
    try {
      await CollectionAPI.updatePaperNoteToCollection(params);
      dispatch(ActionCreators.succeededToUpdatePaperNote(params));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      dispatch(ActionCreators.failedToUpdatePaperNote());
      alertToast({
        type: 'error',
        message: 'Had an error when update the paper note to collection',
      });
      throw error;
    }
  };
}
