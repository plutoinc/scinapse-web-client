import SafeURIStringHandler from "../../helpers/safeURIStringHandler";
import { ArticleSearchSearchParams } from "./types";
import { LoadDataParams } from "../../routes";
import { fetchSearchItems, getAggregationData as getAggregation, getSuggestionKeyword } from "./actions";

export function makeSearchQueryFromParamsObject(queryParams: ArticleSearchSearchParams) {
  const query = SafeURIStringHandler.decode(queryParams.query);
  const searchPage = parseInt(queryParams.page, 10) - 1 || 0;
  const filter = queryParams.filter;

  return {
    query,
    filter,
    page: searchPage,
  };
}

export async function getSearchData(params: LoadDataParams) {
  const { queryParams, dispatch } = params;
  const searchQueryObject = makeSearchQueryFromParamsObject(queryParams);

  try {
    const promiseArray: Array<Promise<any>> = [];

    promiseArray.push(dispatch(fetchSearchItems(searchQueryObject)));
    promiseArray.push(
      dispatch(
        getAggregation({
          query: SafeURIStringHandler.decode(queryParams.query),
          filter: queryParams.filter,
        }),
      ),
    );
    promiseArray.push(dispatch(getSuggestionKeyword(searchQueryObject.query)));

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
