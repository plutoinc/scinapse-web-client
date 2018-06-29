import { Dispatch } from "react-redux";
import { ActionCreators } from "../../actions/actionTypes";
import { GLOBAL_DIALOG_TYPE } from "./reducer";
import MemberAPI from "../../api/member";
import CollectionAPI, {
  PostCollectionParams,
  AddPaperToCollectionsParams
} from "../../api/collection";
import alertToast from "../../helpers/makePlutoToastAction";

export interface OpenGlobalDialogParams {
  type: GLOBAL_DIALOG_TYPE;
  collectionDialogTargetPaperId?: number;
}

export function openSignIn() {
  return ActionCreators.openGlobalModal({
    type: GLOBAL_DIALOG_TYPE.SIGN_IN
  });
}

export function openSignUp() {
  return ActionCreators.openGlobalModal({
    type: GLOBAL_DIALOG_TYPE.SIGN_UP
  });
}

export function openVerificationNeeded() {
  return ActionCreators.openGlobalModal({
    type: GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED
  });
}

export function openGlobalDialog({
  type,
  collectionDialogTargetPaperId
}: OpenGlobalDialogParams) {
  return ActionCreators.openGlobalModal({
    type,
    collectionDialogTargetPaperId
  });
}

export function changeModalType(type: GLOBAL_DIALOG_TYPE) {
  return ActionCreators.changeGlobalModal({ type });
}

export function addPaperToCollections(params: AddPaperToCollectionsParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToAddPaperToCollectionsInGlobalDialog());

      await CollectionAPI.addPaperToCollections(params);
      dispatch(
        ActionCreators.succeededToAddPaperToCollectionsInGlobalDialog({
          collections: params.collections
        })
      );
      alertToast({
        type: "success",
        message: "Succeeded to add paper to the collections."
      });
    } catch (err) {
      dispatch(ActionCreators.failedToAddPaperToCollectionsInGlobalDialog());
      alertToast({
        type: "error",
        message: err.message || "Failed to add paper to the collections."
      });
    }
  };
}

export function postNewCollection(params: PostCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToPostCollectionInGlobalDialog());

      const res = await CollectionAPI.postCollection(params);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToPostCollectionInGlobalDialog({
          collectionId: res.result
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToPostCollectionInGlobalDialog());
      alertToast(err);
    }
  };
}

export function getMyCollections(userId: number) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetCollectionsInGlobalDialog());

      const res = await MemberAPI.getCollections(userId);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetCollectionsInGlobalDialog({
          collectionIds: res.result
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToGetCollectionsInGlobalDialog());
      alertToast(err);
    }
  };
}

export function closeDialog() {
  return ActionCreators.closeGlobalModal();
}
