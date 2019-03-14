import PaperSearchQueryFormatter from "../../helpers/papersQueryFormatter";
import { LoadDataParams } from "../../routes";
import { fetchSearchPapers, fetchMyFilters } from "./actions";
import { GetPapersParams } from "../../api/types/paper";
import { ACTION_TYPES } from "../../actions/actionTypes";

export async function getSearchData(params: LoadDataParams<null>) {
  const { queryParams, dispatch } = params;

  const searchQueryObject: GetPapersParams = PaperSearchQueryFormatter.makeSearchQueryFromParamsObject(queryParams);

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

    promiseArray.push(dispatch(fetchSearchPapers(searchQueryObject)));
    promiseArray.push(dispatch(fetchMyFilters()));

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
