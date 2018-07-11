import { Dispatch } from "react-redux";
import { ActionCreators } from "../../actions/actionTypes";
import { GLOBAL_DIALOG_TYPE } from "./reducer";
import PaperAPI, { GetCitationTextParams } from "../../api/paper";
import MemberAPI from "../../api/member";
import CollectionAPI, {
  PostCollectionParams,
  AddPaperToCollectionParams,
  RemovePapersFromCollectionParams,
} from "../../api/collection";
import alertToast from "../../helpers/makePlutoToastAction";
import { AvailableCitationType } from "../paperShow/records";

export interface OpenGlobalDialogParams {
  type: GLOBAL_DIALOG_TYPE;
  collectionDialogTargetPaperId?: number;
}

export function openSignIn() {
  return ActionCreators.openGlobalDialog({
    type: GLOBAL_DIALOG_TYPE.SIGN_IN,
  });
}

export function openSignUp() {
  return ActionCreators.openGlobalDialog({
    type: GLOBAL_DIALOG_TYPE.SIGN_UP,
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

export function changeModalType(type: GLOBAL_DIALOG_TYPE) {
  return ActionCreators.changeGlobalModal({ type });
}

export function addPaperToCollection(params: AddPaperToCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        ActionCreators.startToAddPaperToCollectionInGlobalDialog({
          collection: params.collection,
        })
      );

      await CollectionAPI.addPaperToCollection(params);
      dispatch(ActionCreators.succeededToAddPaperToCollectionInGlobalDialog());
      alertToast({
        type: "success",
        message: `Added the paper to ${params.collection.title} collection.`,
      });
    } catch (err) {
      dispatch(
        ActionCreators.failedToAddPaperToCollectionInGlobalDialog({
          collection: params.collection,
        })
      );
      alertToast({
        type: "error",
        message: err.message || "Failed to add paper to the collection.",
      });

      throw err;
    }
  };
}

export function removePaperFromCollection(params: RemovePapersFromCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        ActionCreators.startToRemovePaperToCollection({
          collection: params.collection,
        })
      );

      await CollectionAPI.removePapersFromCollection(params);
      dispatch(ActionCreators.succeededToRemovePaperToCollection());
    } catch (err) {
      dispatch(
        ActionCreators.failedToRemovePaperToCollection({
          collection: params.collection,
        })
      );
      alertToast({
        type: "error",
        message: err.message || "Failed to remove paper to the collection.",
      });

      throw err;
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
          collectionId: res.result,
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToPostCollectionInGlobalDialog());
      throw err;
    }
  };
}

export function getMyCollections(paperId?: number) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetCollectionsInGlobalDialog());

      const res = await MemberAPI.getMyCollections(paperId);
      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetCollectionsInGlobalDialog({
          collectionIds: res.result,
        })
      );
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

export function changeCitationTab(tab: AvailableCitationType) {
  return ActionCreators.handleClickCitationTab({ tab });
}

export function closeDialog() {
  return ActionCreators.closeGlobalDialog();
}
