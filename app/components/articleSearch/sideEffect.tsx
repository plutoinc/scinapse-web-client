import PaperSearchQueryFormatter from "../../helpers/papersQueryFormatter";
import { LoadDataParams } from "../../routes";
import { searchPapers } from "./actions";
import { SearchPapersParams } from "../../api/types/paper";
import { ACTION_TYPES } from "../../actions/actionTypes";
import ActionTicketManager from "../../helpers/actionTicketManager";

export async function getSearchData(params: LoadDataParams<null>) {
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
    const searchResults = dispatch(searchPapers({ ...searchQueryObject, cancelToken: params.cancelToken }));
    searchResults.then(result => {
      if (!result) {
        ActionTicketManager.trackTicket({
          pageType: "searchResult",
          actionType: "fire",
          actionArea: "paperList",
          actionTag: "pageView",
          actionLabel: String(0),
        });
      } else {
        ActionTicketManager.trackTicket({
          pageType: "searchResult",
          actionType: "fire",
          actionArea: "paperList",
          actionTag: "pageView",
          actionLabel: String(result.length),
        });
      }
    });
    promiseArray.push(searchResults);
    await Promise.all(promiseArray);
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
