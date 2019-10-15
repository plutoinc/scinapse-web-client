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
import { getMyCollections } from './paperShow';
import { closeSnackbar, openSnackbar, GLOBAL_SNACKBAR_TYPE } from '../reducers/scinapseSnackbar';

export function savePaperToCollection(params: AddPaperToCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToPostPaperToCollection());
      dispatch(closeSnackbar());

      await CollectionAPI.addPaperToCollection(params);

      dispatch(
        ActionCreators.succeededPostPaperToCollection({
          collection: params.collection,
        })
      );

      if (params.cancelToken) {
        dispatch(getMyCollections(params.paperId, params.cancelToken));
      }

      dispatch(
        openSnackbar({
          type: GLOBAL_SNACKBAR_TYPE.COLLECTION_SAVED,
          id: params.collection.id,
          context: params.collection.title,
          actionTicketParams: {
            pageType: 'paperShow',
            actionType: 'view',
            actionArea: 'collectionSnackbar',
            actionTag: 'viewCollectionSnackBar',
            actionLabel: String(params.collection.id),
          },
        })
      );
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
        dispatch(getMyCollections(params.paperIds[0], params.cancelToken));
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
