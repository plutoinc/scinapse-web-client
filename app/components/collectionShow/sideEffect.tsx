import { LoadDataParams } from "../../routes";
import { CollectionShowMatchParams } from ".";
import { getCollection } from "./actions";

export async function fetchTargetCollection(
  params: LoadDataParams<CollectionShowMatchParams>
) {
  const { dispatch, match } = params;

  const collectionId = parseInt(match.params.collectionId, 10);
  if (isNaN(collectionId)) {
    // TODO: Add redirect logic
    return;
  } else {
    await dispatch(getCollection(collectionId));
  }
}
