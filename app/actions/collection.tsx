import { Dispatch } from "react-redux";
import { ActionCreators } from "./actionTypes";
import PlutoAxios from "../api/pluto";
import alertToast from "../helpers/makePlutoToastAction";
import CollectionAPI, {
  AddPaperToCollectionParams,
  RemovePapersFromCollectionParams,
  UpdatePaperNoteToCollectionParams,
} from "../api/collection";
import { Collection } from "../model/collection";

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
    } catch (err) {
      dispatch(ActionCreators.failedToPostPaperToCollection());
      const error = PlutoAxios.getGlobalError(err);
      if (error) {
        alertToast({
          type: "error",
          message: error.message,
        });
      }
    }
  };
}

export function removePaperFromCollection(params: RemovePapersFromCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToRemovePaperFromCollection());

      await CollectionAPI.removePapersFromCollection(params);
      dispatch(
        ActionCreators.succeededToRemovePaperFromCollection({
          collection: params.collection,
        })
      );
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      dispatch(ActionCreators.failedToRemovePaperFromCollection());
      alertToast({
        type: "error",
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

export function updatePaperNote(params: UpdatePaperNoteToCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToUpdatePaperNote());
    try {
      await CollectionAPI.updatePaperNoteToCollection(params);
      dispatch(ActionCreators.succeededToUpdatePaperNote(params));
      dispatch(ActionCreators.closeNoteDropdownInPaperShow());
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      dispatch(ActionCreators.failedToUpdatePaperNote());
      alertToast({
        type: "error",
        message: "Had an error when update the paper note to collection",
      });
    }
  };
}
