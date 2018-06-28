import { Dispatch } from "react-redux";
import CollectionAPI from "../../api/collection";
import { ActionCreators } from "../../actions/actionTypes";
import alertToast from "../../helpers/__mocks__/makePlutoToastAction";

export function getCollection(collectionId: number) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToGetCollectionInCollectionShow());
      const res = await CollectionAPI.getCollection(collectionId);

      dispatch(ActionCreators.addEntity(res));
      dispatch(
        ActionCreators.succeededToGetCollectionInCollectionShow({
          collectionId: res.result
        })
      );
    } catch (err) {
      alertToast({
        type: "error",
        message: `Failed to get collection information: ${err}`
      });
      dispatch(ActionCreators.failedToGetCollectionInCollectionShow());
    }
  };
}
