import PlutoAxios from "../pluto";
import { RAW } from "../../__mocks__";
import { SearchResult, SearchParams } from "../search";
import { camelCaseKeys } from "../../helpers/camelCaseKeys";

class SearchAPI extends PlutoAxios {
  public async search(params: SearchParams) {
    if (!params.query) {
      throw new Error("FAKE ERROR");
    }

    const searchResult = {
      data: {
        content: RAW.PAPER,
        page: null,
        aggregation: RAW.AGGREGATION_RESPONSE,
        matchedAuthor: null,
        resultModified: true,
        suggestion: null,
      },
    };

    const camelizedRes = camelCaseKeys(searchResult);
    const searchRes: SearchResult = camelizedRes;

    return {
      ...searchRes,
      data: {
        ...searchRes.data,
        page: {
          ...searchRes.data.page,
          page: searchRes.data.page ? searchRes.data.page.page + 1 : 1,
        },
      },
    };
  }
}

const apiHelper = new SearchAPI();

export default apiHelper;
