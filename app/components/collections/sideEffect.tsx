import { getCollections as getUserCollections, getMember } from "./actions";
import { LoadDataParams } from "../../routes";

interface GetCollectionsParams extends LoadDataParams<{ userId: string }> {
  userId?: number;
}

export async function getCollections(params: GetCollectionsParams) {
  const { match, dispatch } = params;

  try {
    const promiseArray: Array<Promise<any>> = [];
    const userId = params.userId ? params.userId : parseInt(match.params.userId, 10);

    promiseArray.push(dispatch(getMember(userId)));
    promiseArray.push(dispatch(getUserCollections(userId)));

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching collection list page data`, err);
  }
}
