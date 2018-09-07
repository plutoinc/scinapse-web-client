import SafeURIStringHandler from "../../helpers/safeURIStringHandler";
import PaperSearchQueryFormatter from "../../helpers/papersQueryFormatter";
import { LoadDataParams } from "../../routes";
import { fetchSearchPapers, getAggregationData as getAggregation, getSuggestionKeyword } from "./actions";
import { ACTION_TYPES } from "../../actions/actionTypes";

export async function getSearchData(params: LoadDataParams<null>) {
  const { queryParams, dispatch } = params;
  const searchQueryObject = PaperSearchQueryFormatter.makeSearchQueryFromParamsObject(queryParams);

  try {
    const promiseArray: Array<Promise<any>> = [];

    promiseArray.push(dispatch(fetchSearchPapers(searchQueryObject)));
    promiseArray.push(
      dispatch(
        getAggregation({
          query: SafeURIStringHandler.decode(queryParams.query),
          filter: queryParams.filter,
        })
      )
    );
    promiseArray.push(dispatch(getSuggestionKeyword(searchQueryObject.query)));

    await Promise.all(promiseArray);

    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_SAVE_LAST_SUCCEEDED_PARAMS,
      payload: {
        params: JSON.stringify(params),
      },
    });
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
