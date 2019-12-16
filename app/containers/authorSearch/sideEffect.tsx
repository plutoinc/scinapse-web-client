import PaperSearchQueryFormatter from '../../helpers/searchQueryManager';
import { LoadDataParams } from '../../routes';
import { ACTION_TYPES } from '../../actions/actionTypes';
import { fetchSearchAuthors } from '../../components/articleSearch/actions';
import { GetAuthorsParam } from '../../api/types/author';
import { Author } from '../../model/author/author';

export async function getAuthorSearchData(params: LoadDataParams<null>): Promise<Author[] | null | undefined> {
  const { queryParams, dispatch } = params;
  const searchQueryObject: GetAuthorsParam = PaperSearchQueryFormatter.makeSearchQueryFromParamsObject(queryParams);

  if (!searchQueryObject.query) {
    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_AUTHORS,
      payload: {
        statusCode: 400,
      },
    });

    return null;
  }

  try {
    const authorSearchResults = await fetchSearchAuthors(searchQueryObject)(dispatch);
    return authorSearchResults;
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
