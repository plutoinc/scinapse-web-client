import PaperSearchQueryFormatter from "../../helpers/papersQueryFormatter";
import { LoadDataParams } from "../../routes";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { fetchSearchAuthors } from "../../components/articleSearch/actions";
import { GetAuthorsParam } from "../../api/types/author";
import ActionTicketManager from "../../helpers/actionTicketManager";
import EnvChecker from "../../helpers/envChecker";

export async function getAuthorSearchData(params: LoadDataParams<null>, isLocationChanged?: boolean) {
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
    const authorSearchResults = dispatch(fetchSearchAuthors(searchQueryObject));
    if (!EnvChecker.isOnServer() && isLocationChanged) {
      authorSearchResults.then(result => {
        if (!result) {
          ActionTicketManager.trackTicket({
            pageType: "authorSearchResult",
            actionType: "fire",
            actionArea: "authorList",
            actionTag: "pageView",
            actionLabel: String(0),
          });
        } else {
          ActionTicketManager.trackTicket({
            pageType: "authorSearchResult",
            actionType: "fire",
            actionArea: "authorList",
            actionTag: "pageView",
            actionLabel: String(result.length),
          });
        }
      });
    }
    promiseArray.push(authorSearchResults);

    await Promise.all(promiseArray);
    return authorSearchResults;
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
