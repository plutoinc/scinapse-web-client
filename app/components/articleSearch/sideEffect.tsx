import PaperSearchQueryFormatter from "../../helpers/papersQueryFormatter";
import { LoadDataParams } from "../../routes";
import { fetchSearchPapers } from "./actions";
import { GetPapersParams } from "../../api/types/paper";

export async function getSearchData(params: LoadDataParams<null>) {
  const { queryParams, dispatch } = params;

  const searchQueryObject: GetPapersParams = PaperSearchQueryFormatter.makeSearchQueryFromParamsObject(queryParams);

  try {
    const promiseArray: Array<Promise<any>> = [];

    promiseArray.push(dispatch(fetchSearchPapers(searchQueryObject)));

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
