import PaperSearchQueryFormatter from "../../helpers/papersQueryFormatter";
import { LoadDataParams } from "../../routes";
import { searchPapers } from "./actions";
import { SearchPapersParams } from "../../api/types/paper";
import { ACTION_TYPES } from "../../actions/actionTypes";

export async function getSearchData(params: LoadDataParams<null>) {
  const { queryParams, dispatch } = params;
  const searchQueryObject: SearchPapersParams = PaperSearchQueryFormatter.makeSearchQueryFromParamsObject(queryParams);

  if (!searchQueryObject.query) {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS,
      payload: {
        statusCode: 400,
      },
    });
    return null;
  }

  try {
    const searchResults = await dispatch(searchPapers({ ...searchQueryObject, cancelToken: params.cancelToken }));
    return searchResults;
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
