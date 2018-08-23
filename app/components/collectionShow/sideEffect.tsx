import { LoadDataParams } from "../../routes";
import { CollectionShowMatchParams } from ".";
import { getCollection, getPapers } from "./actions";

export async function fetchCollectionShowData(params: LoadDataParams<CollectionShowMatchParams>) {
  const { dispatch, match } = params;

  const collectionId = parseInt(match.params.collectionId, 10);
  if (isNaN(collectionId)) {
    // TODO: Add redirect logic
    return;
  } else {
    try {
      const promiseArr: Array<Promise<any>> = [];
      promiseArr.push(dispatch(getCollection(collectionId)));
      promiseArr.push(dispatch(getPapers(collectionId)));
      await Promise.all(promiseArr);
    } catch (err) {
      // TODO: add redirect logic
      console.error(`Error for fetching collection list page data`, err);
    }
  }
}
