import axios, { CancelToken } from "axios";
import { Dispatch } from "react-redux";
import CollectionAPI, { GetCollectionsPapersParams } from "../../api/collection";
import { ActionCreators } from "../../actions/actionTypes";
import alertToast from "../../helpers/__mocks__/makePlutoToastAction";

export function getCollection(collectionId: number, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetCollectionInCollectionShow());
      const res = await CollectionAPI.getCollection(collectionId, cancelToken);

      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetCollectionInCollectionShow({
          collectionId: res.result,
        })
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: `Failed to get collection information: ${err}`,
        });
        dispatch(ActionCreators.failedToGetCollectionInCollectionShow());
      }
    }
  };
}

export function getPapers(params: GetCollectionsPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetPapersInCollectionShow());

      const paperResponse = await CollectionAPI.getPapers(params);

      dispatch(ActionCreators.addEntity({ entities: paperResponse.entities, result: paperResponse.result }));
      dispatch(
        ActionCreators.succeededToGetPapersInCollectionShow({
          paperResponse,
          sort: params.sort,
        })
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        alertToast({
          type: "error",
          message: `Failed to get collection's papers: ${err}`,
        });
        dispatch(ActionCreators.failedToGetPapersInCollectionShow());
      }
    }
  };
}
