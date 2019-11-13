import { CancelToken } from 'axios';
import { Dispatch } from 'redux';
import { ActionCreators, ACTION_TYPES } from '../../actions/actionTypes';
import { GLOBAL_DIALOG_TYPE } from './reducer';
import PaperAPI, { GetCitationTextParams } from '../../api/paper';
import MemberAPI from '../../api/member';
import CollectionAPI, {
  PostCollectionParams,
  AddPaperToCollectionParams,
  RemovePapersFromCollectionParams,
  UpdateCollectionParams,
} from '../../api/collection';
import { AvailableCitationType } from '../../containers/paperShow/records';
import PlutoAxios from '../../api/pluto';
import { openSnackbar, closeSnackbar, GLOBAL_SNACKBAR_TYPE } from '../../reducers/scinapseSnackbar';

export interface OpenGlobalDialogParams {
  type: GLOBAL_DIALOG_TYPE;
  collectionDialogTargetPaperId?: string;
}

export function openSignIn() {
  return ActionCreators.openGlobalDialog({
    type: GLOBAL_DIALOG_TYPE.SIGN_IN,
  });
}

export function openVerificationNeeded() {
  return ActionCreators.openGlobalDialog({
    type: GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED,
  });
}

export function openGlobalDialog({ type, collectionDialogTargetPaperId }: OpenGlobalDialogParams) {
  return ActionCreators.openGlobalDialog({
    type,
    collectionDialogTargetPaperId,
  });
}

export function changeDialogType(type: GLOBAL_DIALOG_TYPE) {
  return ActionCreators.changeGlobalDialog({ type });
}

export function addPaperToCollection(params: AddPaperToCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        ActionCreators.startToAddPaperToCollectionInGlobalDialog({
          paperIds: [params.paperId],
          collection: params.collection,
        })
      );
      dispatch(closeSnackbar());

      const res = await CollectionAPI.addPaperToCollection(params);
      dispatch(
        ActionCreators.succeededToAddPaperToCollectionInGlobalDialog({
          paperId: params.paperId,
          collection: params.collection,
        })
      );
      dispatch(
        openSnackbar({
          type: GLOBAL_SNACKBAR_TYPE.COLLECTION_SAVED,
          collectionId: params.collection.id,
          context: params.collection.title,
          actionTicketParams: {
            pageType: 'searchResult',
            actionType: 'view',
            actionArea: 'collectionSnackbar',
            actionTag: 'viewCollectionSnackBar',
            actionLabel: String(params.collection.id),
          },
        })
      );
      return res;
    } catch (err) {
      dispatch(
        ActionCreators.failedToAddPaperToCollectionInGlobalDialog({
          paperIds: [params.paperId],
          collection: params.collection,
        })
      );
      const error = PlutoAxios.getGlobalError(err);
      throw error;
    }
  };
}

export function removePaperFromCollection(params: RemovePapersFromCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToRemovePaperFromCollection(params));

      await CollectionAPI.removePapersFromCollection(params);
      dispatch(ActionCreators.succeededToRemovePaperFromCollection(params));
    } catch (err) {
      dispatch(ActionCreators.failedToRemovePaperFromCollection(params));
      const error = PlutoAxios.getGlobalError(err);
      throw error;
    }
  };
}

export function postNewCollection(params: PostCollectionParams, targetPaperId?: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToPostCollectionInGlobalDialog());

      const res = await CollectionAPI.postCollection(params);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToPostCollectionInGlobalDialog({
          collectionId: res.result,
        })
      );

      if (targetPaperId) {
        await dispatch(
          addPaperToCollection({ collection: res.entities.collections[res.result], paperId: targetPaperId })
        );
        dispatch({
          type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
          payload: {
            type: 'success',
            message: "Saved to 'Read Later' Collection!",
          },
        });
      }
    } catch (err) {
      dispatch(ActionCreators.failedToPostCollectionInGlobalDialog());
      const error = PlutoAxios.getGlobalError(err);
      throw error;
    }
  };
}

export function getMyCollections(paperId: string, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetCollectionsInGlobalDialog());
      const res = await MemberAPI.getMyCollections(paperId, cancelToken);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetCollectionsInGlobalDialog({
          collectionIds: res.result,
        })
      );
      return res;
    } catch (err) {
      dispatch(ActionCreators.failedToGetCollectionsInGlobalDialog());
      throw err;
    }
  };
}

export function getCitationText(params: GetCitationTextParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetCitationText());

      const res = await PaperAPI.getCitationText(params);
      dispatch(ActionCreators.succeededToGetCitationText({ citationText: res.citationText }));
    } catch (_err) {
      dispatch(ActionCreators.failedToGetCitationText());
    }
  };
}

export function deleteCollection(collectionId: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToDeleteCollection());

      await CollectionAPI.deleteCollection(collectionId);
      dispatch(ActionCreators.succeededToDeleteCollection({ collectionId }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      dispatch(ActionCreators.failedToDeleteCollection());
      throw error;
    }
  };
}

export function updateCollection(params: UpdateCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToUpdateCollection());

      const res = await CollectionAPI.updateCollection(params);
      dispatch(ActionCreators.addEntity(res));
      dispatch(ActionCreators.succeededToUpdateCollection({ collectionId: res.result }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      dispatch(ActionCreators.failedToUpdateCollection());
      throw error;
    }
  };
}

export function changeCitationTab(tab: AvailableCitationType) {
  return ActionCreators.handleClickCitationTab({ tab });
}

export function closeDialog() {
  return ActionCreators.closeGlobalDialog();
}
