import { Dispatch } from "react-redux";
import { ActionCreators } from "./actionTypes";
import PlutoAxios from "../api/pluto";
import alertToast from "../helpers/makePlutoToastAction";
import { AddPaperToCollectionParams } from "../api/collection";
import CollectionAPI from "../api/collection";

export function savePaperToCollection(params: AddPaperToCollectionParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToPostPaperToCollection());

      await CollectionAPI.addPaperToCollection(params);

      dispatch(ActionCreators.succeededPostPaperToCollection());
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
