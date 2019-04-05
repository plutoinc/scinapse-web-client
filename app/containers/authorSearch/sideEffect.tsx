import PaperSearchQueryFormatter from "../../helpers/papersQueryFormatter";
import { LoadDataParams } from "../../routes";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { fetchSearchAuthors } from "../../components/articleSearch/actions";
import { GetAuthorsParam } from "../../api/types/author";

export async function getAuthorSearchData(params: LoadDataParams<null>) {
  const { queryParams, dispatch } = params;

  const searchQueryObject: GetAuthorsParam = PaperSearchQueryFormatter.makeSearchQueryFromParamsObject(queryParams);

  if (!searchQueryObject.query) {
    return dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_AUTHORS,
      payload: {
        statusCode: 400,
      },
    });
  }

  try {
    const promiseArray: Array<Promise<any>> = [];

    promiseArray.push(dispatch(fetchSearchAuthors(searchQueryObject)));

    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
