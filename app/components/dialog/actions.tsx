import { Dispatch } from "react-redux";
import { ActionCreators } from "../../actions/actionTypes";
import { GLOBAL_DIALOG_TYPE } from "./reducer";
import MemberAPI from "../../api/member";
import CollectionAPI, { PostCollectionParams } from "../../api/collection"
import alertToast from "../../helpers/makePlutoToastAction";

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

export function changeModalType(type: GLOBAL_DIALOG_TYPE) {
  return ActionCreators.changeGlobalModal({ type });
}
