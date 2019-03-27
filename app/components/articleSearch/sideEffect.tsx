import PaperSearchQueryFormatter from "../../helpers/papersQueryFormatter";
import { LoadDataParams } from "../../routes";
import { searchPapers, fetchCurrentUserFilters, fetchLocalStorageFilters } from "./actions";
import { SearchPapersParams } from "../../api/types/paper";
import { ACTION_TYPES } from "../../actions/actionTypes";

export async function getSearchData(params: LoadDataParams<null>, isLoggedIn?: boolean) {
  const { queryParams, dispatch } = params;
  const searchQueryObject: SearchPapersParams = PaperSearchQueryFormatter.makeSearchQueryFromParamsObject(queryParams);

  if (!searchQueryObject.query) {
    return dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS,
      payload: {
        statusCode: 400,
      },
    });
  }

  try {
    const promiseArray: Array<Promise<any>> = [];

    if (isLoggedIn === false) {
      promiseArray.push(dispatch(fetchLocalStorageFilters()));
    } else {
      promiseArray.push(dispatch(fetchCurrentUserFilters()));
    }

    promiseArray.push(dispatch(searchPapers({ ...searchQueryObject, cancelToken: params.cancelToken })));
    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
